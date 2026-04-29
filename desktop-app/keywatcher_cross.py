"""Cross-platform global key listener (Linux / Windows).
Uses pynput — no root required on X11; on Wayland, run with:
  DISPLAY=:0 python keywatcher_cross.py
Prints the digit character (1-6) to stdout on each debounced keypress,
matching the interface of the macOS-only keywatcher.py.
"""
import sys
import time
from pynput import keyboard as pnk

VALID = {'1', '2', '3', '4', '5', '6'}
last_time: dict = {}
DEBOUNCE = 0.4


def on_press(key):
    try:
        k = key.char
    except AttributeError:
        return
    if k in VALID:
        now = time.time()
        if now - last_time.get(k, 0) > DEBOUNCE:
            last_time[k] = now
            sys.stdout.write(k + '\n')
            sys.stdout.flush()


with pnk.Listener(on_press=on_press) as listener:
    listener.join()
