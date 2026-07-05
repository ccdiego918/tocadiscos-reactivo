import os

KEY = bytes([0xD4, 0xB0, 0xE6, 0xC9, 0xA0, 0xDC])
AUDIO_DIR = os.path.join(os.path.dirname(__file__), "..", "audio")


def xor(data):
    return bytes(b ^ KEY[i % len(KEY)] for i, b in enumerate(data))


def obfuscate_file(src, dst):
    with open(src, "rb") as f:
        plain = f.read()
    encrypted = xor(plain)
    with open(dst, "wb") as f:
        f.write(encrypted)
    print(f"  {os.path.basename(src)} → {os.path.basename(dst)}  ({len(plain)} bytes)")


if __name__ == "__main__":
    for f in sorted(os.listdir(AUDIO_DIR)):
        if f.endswith(".mp3"):
            src = os.path.join(AUDIO_DIR, f)
            dst = os.path.join(AUDIO_DIR, f.replace(".mp3", ".dat"))
            obfuscate_file(src, dst)
    print("Done.")
