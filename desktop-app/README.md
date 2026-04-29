# myojam desktop app

Real-time surface EMG gesture classification. Runs locally — no internet, no account, no latency.

**Platform:** macOS 12+ · Windows 10+ · Ubuntu 20.04+  
**Licence:** MIT  
**Accuracy:** 84.85% cross-subject (Ninapro DB5, LOSO cross-validation)

---

## What it does

- Reads analog EMG voltage from a MyoWare 2.0 sensor via Arduino serial (115200 baud)
- Applies a 4th-order Butterworth bandpass filter (20–90 Hz, zero-phase)
- Segments into 200-sample sliding windows (75% overlap)
- Extracts 64 time-domain features: MAV, RMS, ZCR, WL × 16 channels
- Classifies into 6 gesture classes using a pre-trained Random Forest (500 trees)
- Animates a Three.js 3D hand model to match the detected gesture
- Tracks session stats: gesture count, average confidence, elapsed time
- Exports session data to CSV on demand

Gesture classes: index flex · middle flex · ring flex · pinky flex · thumb flex · fist  
Each gesture maps to a computer control action (mouse move, click, scroll, space).

---

## Hardware requirements

| Component | Model | Purpose |
|-----------|-------|---------|
| EMG sensor | MyoWare 2.0 | Amplified sEMG signal |
| Microcontroller | Arduino Uno (or compatible) | Serial ADC bridge |
| USB cable | USB-A to USB-B | Data + power |

**Wiring:**

| MyoWare 2.0 pin | Arduino pin | Purpose |
|-----------------|-------------|---------|
| `+` | `5V` | Power |
| `−` | `GND` | Ground |
| `SIG` | `A0` | Analog signal |

**Arduino sketch** (`arduino_sketch/myojam_reader.ino`):

```cpp
void setup() {
  Serial.begin(115200);
}

void loop() {
  int val = analogRead(A0);
  float mv = val * (3300.0 / 1023.0);
  Serial.println(mv);
  delay(5); // 200 Hz
}
```

---

## Installation

### Pre-built binaries (recommended)

Download the latest release from the [GitHub releases page](https://github.com/Jaden300/myojam/releases):

- **macOS**: `myojam-mac.zip` — extract and run `myojam.app`
- **Windows**: `myojam-windows.zip` — extract and run `myojam.exe`
- **Linux**: `myojam-linux.tar.gz` — extract and run `./myojam`

macOS: you may need to right-click → Open the first time to bypass Gatekeeper.  
Linux: `chmod +x myojam` before running.

### From source

**Requirements:** Python 3.11+, pip

```bash
# 1. Clone
git clone https://github.com/Jaden300/myojam.git
cd myojam/desktop-app

# 2. Install dependencies
pip install PyQt6 scipy scikit-learn numpy pyserial

# macOS only — for mouse/keyboard control
brew install cliclick

# Linux only — for mouse/keyboard control
pip install pynput

# 3. Run
python myojam.py
```

**Windows:** pynput is not required; the app uses the Win32 API directly.

---

## Running the app

1. Upload `arduino_sketch/myojam_reader.ino` to your Arduino
2. Connect the MyoWare 2.0 sensor to your forearm (see electrode placement below)
3. Plug the Arduino into USB
4. Launch myojam
5. Switch to **Sensor** mode in the top bar — the app will auto-detect the serial port
6. Click **Start** and make a gesture

**Dataset mode:** if you don't have hardware, switch to **Dataset** mode to run the classifier on real Ninapro DB5 windows. Press keys 1–6 to trigger gesture simulations.

---

## Electrode placement

For best accuracy, place the MyoWare 2.0 sensor on the **flexor digitorum superficialis**:

1. Extend your forearm, palm facing up
2. Locate the belly of the muscle — approximately 3–4 cm below the inside of the elbow crease
3. Centre the electrode pad over this point
4. Attach the **reference (REF) electrode** on a bony, muscle-free area: the olecranon (bony point of the elbow) works well

**Between sessions:** electrode placement variability of even 1–2 cm can degrade accuracy by 5–15pp. Mark the placement on your forearm with a washable marker as a guide.

---

## Architecture

```
myojam.py              Main application + PyQt6 UI
emg_classifier.py      EMGClassifier — serial reader + real-time classification thread
hand3d.py              Hand3DWidget — QWebEngineView wrapping a Three.js 3D hand
keywatcher.py          Global keyboard listener (macOS/Linux)
keywatcher_cross.py    Cross-platform keyboard/mouse fallback
train_my_model.py      Script to train a personalised model from your own data
collect_data.py        Script to collect labelled EMG windows from hardware
model/
  gesture_classifier.pkl   Pre-trained Random Forest (scikit-learn Pipeline)
  pipeline_config.pkl      Feature scaling parameters
arduino_sketch/
  myojam_reader.ino        Arduino sketch (reads A0, sends mV over serial)
```

**Signal processing pipeline:**

```
Raw analog (A0, 200 Hz)
  → Butterworth bandpass filter (20–90 Hz, 4th order, zero-phase)
  → Sliding window (N=200 samples, step=50 samples, 75% overlap)
  → Feature extraction: [MAV, RMS, ZCR, WL] × 16 channels = 64 features
  → Random Forest (500 trees, n_estimators=500, trained on Ninapro DB5)
  → Gesture class + confidence score
  → Action dispatch (mouse/keyboard via cliclick / Win32 / pynput)
```

---

## Training a personalised model

The pre-bundled model is trained on Ninapro DB5 (10 subjects, cross-subject evaluation). For higher accuracy on your own hand, you can train a personalised model:

```bash
# Step 1: collect labelled data from your sensor
python collect_data.py

# Step 2: train a new model on your data
python train_my_model.py
```

The personalised model replaces `model/gesture_classifier.pkl` and is loaded on next launch. Expect 90–95% accuracy on your own gestures with 10+ repetitions per class.

---

## Session export

During or after a session, click **Export CSV** in the session bar. A `.csv` file is saved to your Desktop with columns:

```
timestamp_s, gesture, confidence, elapsed_s
```

Each row represents one gesture classification. Use this for personal accuracy tracking, research logging, or classroom demonstrations.

---

## Building from source (packaging)

```bash
# macOS
pip install pyinstaller
pyinstaller --onefile --windowed --name myojam myojam.py

# Windows (run in Windows environment)
pip install pyinstaller
pyinstaller --onefile --windowed --name myojam myojam.py

# Linux
pip install pyinstaller
pyinstaller --onefile --name myojam myojam.py
```

Build scripts: `build_linux.sh` (Linux AppImage), `setup.py` (macOS .app bundle).

---

## Troubleshooting

**App won't detect Arduino serial port**  
- Ensure the Arduino is connected before launching, or reconnect and switch back to Sensor mode
- On Linux, you may need: `sudo usermod -a -G dialout $USER` (log out and back in after)
- On macOS, verify the port appears in `/dev/cu.usbmodem*`

**Low accuracy / wrong gestures**  
- Check electrode placement — centre over the flexor digitorum superficialis
- Make sure your skin is clean and dry before attaching the sensor
- Hold each gesture for a full second; partial movements produce ambiguous windows
- Try training a personalised model (`train_my_model.py`) for your specific anatomy

**App opens but waveform is flat**  
- Check the SIG → A0 wire connection
- Verify the Arduino is running the correct sketch at 115200 baud
- In Sensor mode, the connection status label should show the detected port

**macOS: "cannot be opened because the developer cannot be verified"**  
- Right-click the app → Open → Open (bypass Gatekeeper once)

---

## Licence

MIT — free to use, modify, and distribute. See `LICENSE`.

Built by Jaden Wong · [myojam.com](https://myojam.com) · [github.com/Jaden300/myojam](https://github.com/Jaden300/myojam)
