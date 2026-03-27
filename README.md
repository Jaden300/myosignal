# myojam

Real-time EMG gesture classification for assistive human-computer interaction.

![myojam demo](https://myojam.com)

## What it does

myojam reads surface electromyographic (EMG) signals from forearm muscles and classifies hand gestures in real time — enabling people with motor impairments to control a computer using muscle signals alone.

**6 gesture classes:** index flex · middle flex · ring flex · pinky flex · thumb flex · fist

Each gesture maps to a computer action: cursor movement, left click, or spacebar.

## Performance

- **84.85%** cross-subject classification accuracy
- Trained on [Ninapro DB5](http://ninapro.hevs.ch/) — 10 subjects, 16-channel surface EMG
- Random Forest classifier with 64-dimensional feature vectors (MAV, RMS, ZC, WL)
- Inference latency < 5ms

## Architecture
```
EMG Electrodes → MyoWare 2.0 → Arduino Uno → USB Serial
                                                    ↓
                              FastAPI Backend (signal processing + inference)
                                                    ↓
                        React Web Demo  ←→  macOS Desktop App
```

## Stack

| Layer | Technology |
|-------|-----------|
| Signal processing | Python, SciPy, NumPy |
| ML model | scikit-learn Random Forest |
| Backend API | FastAPI, deployed on Render |
| Web frontend | React, Vite, Three.js, Recharts |
| Desktop app | PyQt6, Quartz (macOS) |
| Hardware | MyoWare 2.0, Arduino Uno R3 |

## Live demo

Try it at **[myojam.com/demo](https://myojam.com/demo)** — no hardware required. Uses real Ninapro DB5 data.

## Download

Download the macOS desktop app from [Releases](https://github.com/Jaden300/myojam/releases/latest).

**Requirements:** macOS 12+, Python 3.13, cliclick (`brew install cliclick`)
```bash
# Install dependencies
pip3 install PyQt6 scipy scikit-learn numpy pyserial

# Run
chmod +x run.sh && ./run.sh
```

Grant Accessibility permission when prompted (System Settings → Privacy & Security → Accessibility).

## Hardware setup

1. Place bipolar EMG electrodes on the forearm flexor muscle belly
2. Connect MyoWare 2.0 sensor via Link Shield + TRS cable to Arduino Shield
3. Connect Arduino Uno to Mac via USB-C (laptop unplugged from wall)
4. Upload `arduino_sketch/emg_stream.ino` via Arduino IDE
5. Click "Connect sensor" in the app

## Train your own model
```bash
python3 collect_data.py    # record your gestures (60 samples each)
python3 train_my_model.py  # trains and saves personalized model
```

## Project structure
```
myojam/
├── myojam.py              # macOS desktop application
├── keywatcher.py          # global keyboard listener (Quartz)
├── collect_data.py        # personal EMG data collection
├── train_my_model.py      # model training pipeline
├── model/                 # trained model files
├── frontend/              # React web application
└── backend/               # FastAPI inference server
```

## Team

Built by [Jaden W.](https://github.com/Jaden300) with contributions from Matthew T. and Darren N.

## License

MIT License — see [LICENSE](LICENSE) for details.

---

© 2025 myojam™