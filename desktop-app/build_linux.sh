#!/usr/bin/env bash
set -e

echo "=== myojam Linux build ==="

# Install build dependencies (skip if already present)
pip install pyinstaller pynput PyQt6 PyQt6-WebEngine scipy numpy pyserial scikit-learn > /dev/null

# Clean previous build
rm -rf build dist/myojam-linux

pyinstaller \
  --name myojam \
  --onedir \
  --noconfirm \
  --windowed \
  --add-data "model:model" \
  --add-data "data:data" \
  --add-data "keywatcher_cross.py:." \
  --hidden-import sklearn \
  --hidden-import sklearn.ensemble \
  --hidden-import sklearn.preprocessing \
  --hidden-import scipy.io \
  --hidden-import scipy.signal \
  --hidden-import PyQt6.QtWebEngineWidgets \
  --hidden-import PyQt6.QtWebEngineCore \
  myojam.py

# Rename output and package
mv dist/myojam dist/myojam-linux
tar -czf dist/myojam-linux.tar.gz -C dist myojam-linux

echo ""
echo "Build complete: dist/myojam-linux.tar.gz"
echo "To run directly: dist/myojam-linux/myojam"
echo ""
echo "Requirements on the target machine:"
echo "  sudo apt install xdotool libxcb-xinerama0 libxcb-cursor0 libgl1"
