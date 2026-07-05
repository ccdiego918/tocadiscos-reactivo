import os
import re
from config import BASE_DIR

LYRICS_DIR = os.path.join(os.path.dirname(BASE_DIR), "lyrics")


def get_lyrics(song_id):
    path = os.path.join(LYRICS_DIR, f"{song_id:02d}.lrc")
    if not os.path.exists(path):
        return ""
    with open(path, "r") as f:
        return f.read()


def list_lyrics():
    files = sorted(f for f in os.listdir(LYRICS_DIR) if f.endswith(".lrc"))
    result = []
    for f in files:
        match = re.match(r"(\d+)\.lrc", f)
        if match:
            result.append(int(match.group(1)))
    return result
