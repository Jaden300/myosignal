from collections import deque
import statistics
import serial
import serial.tools.list_ports

WINDOW_SIZE   = 50
STD_THRESHOLD = 0.25
HYSTERESIS    = 0.5

GESTURES = [
    (0.000, 0.176, "rest"),
    (0.176, 0.224, "fist"),
    (0.224, 0.516, "hand back"),
    (0.516, 0.869, "pinky up"),
    (0.869, 1.093, "all fingers up"),
    (1.093, 9.999, "fingertips arm up"),
]

def find_arduino():
    for p in serial.tools.list_ports.comports():
        if "usbmodem" in p.device or "usbserial" in p.device or "Arduino" in (p.description or ""):
            return p.device
    return None

class EMGClassifier:
    def __init__(self):
        self.window       = deque(maxlen=WINDOW_SIZE)
        self.last_gesture = None
        self.last_change  = 0
        self.ser          = None

    def connect(self):
        port = find_arduino()
        if not port:
            return False, "No Arduino found"
        try:
            self.ser = serial.Serial(port, 115200, timeout=1)
            import time; time.sleep(2)
            self.ser.reset_input_buffer()
            return True, port
        except Exception as e:
            return False, str(e)

    def disconnect(self):
        if self.ser and self.ser.is_open:
            self.ser.close()

    def read_sample(self):
        """Read one raw sample. Returns (voltage, gesture_or_None, std)."""
        if not self.ser:
            return None, None, None

        line = self.ser.readline().decode("utf-8", errors="ignore").strip()
        if not line:
            return None, None, None
        try:
            val = int(line)
        except ValueError:
            return None, None, None

        voltage = (val / 1023.0) * 5.0
        self.window.append(voltage)

        if len(self.window) < WINDOW_SIZE:
            return voltage, None, None

        mean = statistics.mean(self.window)
        std  = statistics.stdev(self.window)

        if std > STD_THRESHOLD:
            return voltage, None, std  # transitioning

        gesture = None
        for low, high, label in GESTURES:
            if low <= mean < high:
                gesture = label
                break

        import time
        now = time.time()
        if gesture != self.last_gesture and (now - self.last_change) > HYSTERESIS:
            self.last_gesture = gesture
            self.last_change  = now

        return voltage, self.last_gesture, std