import asyncio
import os
import re
import time

from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

from audio_processor import list_songs, get_song_by_id, load_frames
from ws_manager import ConnectionManager
from lyrics_loader import get_lyrics
from config import SAMPLE_RATE, FFT_SIZE, HOP_LENGTH, FRAME_INTERVAL, BASE_DIR

app = FastAPI(title="El Tocadiscos Reactivo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = ConnectionManager()

CHUNK = 65536
KEY = bytes([0xD4, 0xB0, 0xE6, 0xC9, 0xA0, 0xDC])

def decrypt_stream(filepath, start=0, length=None):
    with open(filepath, "rb") as f:
        if start:
            f.seek(start)
        offset = start
        remaining = length
        while True:
            chunk_size = CHUNK if remaining is None else min(CHUNK, remaining)
            chunk = f.read(chunk_size)
            if not chunk:
                break
            decrypted = bytes(b ^ KEY[(offset + i) % len(KEY)] for i, b in enumerate(chunk))
            offset += len(chunk)
            if remaining is not None:
                remaining -= len(chunk)
            yield decrypted


@app.get("/api/status")
async def api_status():
    songs = list_songs()
    return {
        "status": "ok",
        "songs": len(songs),
    }

@app.get("/songs")
async def songs():
    return list_songs()


@app.get("/audio/{song_id}")
async def get_audio(song_id: int, request: Request):
    song = get_song_by_id(song_id)
    if not song:
        return JSONResponse({"error": "song not found"}, status_code=404)

    filepath = song["path"]
    file_size = os.path.getsize(filepath)
    range_header = request.headers.get("range")

    if range_header:
        match = re.match(r"bytes=(\d+)-(\d*)", range_header)
        if match:
            start = int(match.group(1))
            end_str = match.group(2)
            end = int(end_str) if end_str else file_size - 1
            start = max(0, min(start, file_size - 1))
            end = max(start, min(end, file_size - 1))
            content_length = end - start + 1

            return StreamingResponse(
                decrypt_stream(filepath, start=start, length=content_length),
                status_code=206,
                media_type="audio/mpeg",
                headers={
                    "Content-Range": f"bytes {start}-{end}/{file_size}",
                    "Content-Length": str(content_length),
                    "Accept-Ranges": "bytes",
                }
            )

    return StreamingResponse(
        decrypt_stream(filepath),
        media_type="audio/mpeg",
        headers={
            "Accept-Ranges": "bytes",
            "Content-Length": str(file_size),
        }
    )


@app.get("/audio")
async def get_audio_default(request: Request):
    songs = list_songs()
    if not songs:
        return JSONResponse({"error": "no songs"}, status_code=404)

    filepath = songs[0]["path"]
    file_size = os.path.getsize(filepath)
    range_header = request.headers.get("range")

    if range_header:
        match = re.match(r"bytes=(\d+)-(\d*)", range_header)
        if match:
            start = int(match.group(1))
            end_str = match.group(2)
            end = int(end_str) if end_str else file_size - 1
            start = max(0, min(start, file_size - 1))
            end = max(start, min(end, file_size - 1))
            content_length = end - start + 1

            return StreamingResponse(
                decrypt_stream(filepath, start=start, length=content_length),
                status_code=206,
                media_type="audio/mpeg",
                headers={
                    "Content-Range": f"bytes {start}-{end}/{file_size}",
                    "Content-Length": str(content_length),
                    "Accept-Ranges": "bytes",
                }
            )

    return StreamingResponse(
        decrypt_stream(filepath),
        media_type="audio/mpeg",
        headers={
            "Accept-Ranges": "bytes",
            "Content-Length": str(file_size),
        }
    )


@app.get("/lyrics/{song_id}")
async def lyrics(song_id: int):
    text = get_lyrics(song_id)
    if not text:
        return {"error": "lyrics not found"}, 404
    return {"song_id": song_id, "lrc": text}


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket, song: int = Query(default=0), start: int = Query(default=0)):
    await manager.connect(ws)

    songs = list_songs()
    if not songs:
        await ws.close()
        return

    song_id = song if song > 0 else songs[0]["id"]
    frames = load_frames(song_id)
    total = len(frames)
    start_idx = max(0, min(start, total - 1))

    stream_start = time.time()
    try:
        for i in range(start_idx, total):
            elapsed = time.time() - stream_start
            target = i * FRAME_INTERVAL
            if target > elapsed:
                await asyncio.sleep(target - elapsed)

            await ws.send_json({
                "frame": i,
                "total": total,
                "song_id": song_id,
                "frequencies": frames[i],
            })
    except WebSocketDisconnect:
        manager.disconnect(ws)
    except Exception:
        manager.disconnect(ws)


frontend_dir = os.path.join(os.path.dirname(BASE_DIR), "frontend")
if os.path.isdir(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
