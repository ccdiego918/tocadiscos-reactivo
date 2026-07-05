import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(BASE_DIR, "..", "audio")

SAMPLE_RATE = 44100
FFT_SIZE = 2048
HOP_LENGTH = 1024

FRAME_INTERVAL = HOP_LENGTH / SAMPLE_RATE
