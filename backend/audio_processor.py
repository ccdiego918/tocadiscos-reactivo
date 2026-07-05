import os
import re
import numpy as np
import librosa
from config import AUDIO_DIR, SAMPLE_RATE, FFT_SIZE, HOP_LENGTH

KEY = bytes([0xD4, 0xB0, 0xE6, 0xC9, 0xA0, 0xDC])
_cache = {}


def xor(data):
    return bytes(b ^ KEY[i % len(KEY)] for i, b in enumerate(data))


def list_songs():
    files = sorted(f for f in os.listdir(AUDIO_DIR) if f.endswith(".dat"))
    songs = []
    for f in files:
        match = re.match(r"(\d+)\s+(.+)\.dat", f)
        if match:
            track = int(match.group(1))
            title = match.group(2)
        else:
            track = 0
            title = f.replace(".dat", "")
        songs.append({
            "id": track,
            "title": title,
            "file": f,
            "path": os.path.join(AUDIO_DIR, f),
        })
    return songs


def get_song_by_id(song_id):
    for s in list_songs():
        if s["id"] == song_id:
            return s
    return list_songs()[0] if list_songs() else None


def load_frames(song_id):
    if song_id in _cache:
        return _cache[song_id]

    song = get_song_by_id(song_id)
    if not song:
        return []

    with open(song["path"], "rb") as f:
        raw = xor(f.read())

    import tempfile
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        tmp.write(raw)
        tmppath = tmp.name

    try:
        y, _ = librosa.load(tmppath, sr=SAMPLE_RATE, mono=True)
    finally:
        os.remove(tmppath)

    D = np.abs(librosa.stft(y, n_fft=FFT_SIZE, hop_length=HOP_LENGTH))
    frames = [D[:, i].tolist() for i in range(D.shape[1])]
    _cache[song_id] = frames
    return frames


def decrypt_file_bytes(filepath):
    with open(filepath, "rb") as f:
        return xor(f.read())
