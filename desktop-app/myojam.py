import sys
import os
import math
import threading
import random
import pickle
import subprocess
import time
import numpy as np
import scipy.io as sio
from emg_classifier import EMGClassifier
from scipy.signal import butter, filtfilt
from hand3d import Hand3DWidget

from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QFrame, QSizePolicy,
)
from PyQt6.QtGui import (
    QPainter, QColor, QPen, QFont, QPainterPath, QBrush, QPixmap, QIcon,
    QLinearGradient,
)
from PyQt6.QtCore import (
    Qt, QThread, pyqtSignal, QTimer, QPointF, QRect, QRectF,
)

# ── Input actions
def _run(*args):
    subprocess.run(list(args), capture_output=True)

def mouse_move(dx, dy):
    r = subprocess.run(['cliclick', 'p:.'], capture_output=True, text=True)
    if not r.stdout.strip():
        return
    x, y = map(int, r.stdout.strip().split(','))
    _run('cliclick', f'm:{x+dx},{y+dy}')

def mouse_click():
    _run('cliclick', 'c:.')

def press_space():
    _run('osascript', '-e', 'tell application "System Events" to key code 49')

# ── Paths
BASE        = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH  = os.path.join(BASE, "model/my_gesture_classifier.pkl")
CONFIG_PATH = os.path.join(BASE, "model/my_pipeline_config.pkl")
DATA_PATH   = os.path.join(BASE, "data/DB5_s1/S1_E1_A1.mat")

with open(MODEL_PATH,  "rb") as f: model  = pickle.load(f)
with open(CONFIG_PATH, "rb") as f: config = pickle.load(f)

GESTURE_NAMES = config["gesture_names"]
_mat          = sio.loadmat(DATA_PATH)
_emg_full     = _mat["emg"]
_labels_full  = _mat["restimulus"].flatten()

# ── Theme
BG      = QColor("#08081A")
CARD    = QColor(255, 255, 255, 9)
BORDER  = QColor(255, 255, 255, 20)
BORDER2 = QColor(255, 255, 255, 10)
TEXT    = QColor("#FFFFFF")
TEXT2   = QColor(255, 255, 255, 160)
TEXT3   = QColor(255, 255, 255, 80)
ACCENT  = QColor("#FF2D78")

GESTURE_COLORS = {
    "index flex":  QColor("#FF2D78"),
    "middle flex": QColor("#3B82F6"),
    "ring flex":   QColor("#8B5CF6"),
    "pinky flex":  QColor("#10B981"),
    "thumb flex":  QColor("#F59E0B"),
    "fist":        QColor("#EF4444"),
}

SENSOR_COLORS = {
    "rest":              QColor(255, 255, 255, 60),
    "fist":              QColor("#EF4444"),
    "hand back":         QColor("#F59E0B"),
    "pinky up":          QColor("#10B981"),
    "all fingers up":    QColor("#3B82F6"),
    "fingertips arm up": QColor("#8B5CF6"),
}

GESTURES = [
    (1, "index flex",  "Move cursor left",  "←"),
    (2, "middle flex", "Move cursor right", "→"),
    (3, "ring flex",   "Move cursor down",  "↓"),
    (4, "pinky flex",  "Move cursor up",    "↑"),
    (5, "thumb flex",  "Left click",        "◉"),
    (6, "fist",        "Spacebar",          "▬"),
]

SENSOR_ACTIONS = {
    "rest":              None,
    "fist":              ("Spacebar",        press_space),
    "hand back":         ("Cursor up",       lambda: mouse_move(0, -40)),
    "pinky up":          ("Cursor left",     lambda: mouse_move(-40, 0)),
    "all fingers up":    ("Cursor right",    lambda: mouse_move(40, 0)),
    "fingertips arm up": ("Left click",      mouse_click),
}

KEY_MAP = {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6}


# ── Signal processing
def bandpass_filter(signal, lowcut=20, highcut=90, fs=200, order=4):
    nyq = fs / 2
    b, a = butter(order, [lowcut / nyq, highcut / nyq], btype="band")
    return filtfilt(b, a, np.array(signal), axis=0)

def extract_features(window):
    w = np.array(window)
    return np.concatenate([
        np.mean(np.abs(w), axis=0),
        np.sqrt(np.mean(w ** 2, axis=0)),
        np.sum(np.diff(np.sign(w), axis=0) != 0, axis=0),
        np.sum(np.abs(np.diff(w, axis=0)), axis=0),
    ])

def extract_single_channel_features(window):
    from scipy.signal import welch
    from scipy.stats import skew, kurtosis
    w = np.array(window, dtype=float)
    feats = [
        np.mean(np.abs(w)), np.sqrt(np.mean(w ** 2)),
        np.sum(np.diff(np.sign(w)) != 0), np.sum(np.abs(np.diff(w))),
        np.var(w), float(skew(w)), float(kurtosis(w)),
        np.max(np.abs(w)), np.max(np.abs(w)) / (np.mean(np.abs(w)) + 1e-8),
        np.sum(np.diff(np.sign(np.diff(w))) != 0),
    ]
    env = np.abs(w)
    feats += [np.max(env), np.mean(env), np.std(env),
              np.percentile(env, 25), np.percentile(env, 75),
              np.percentile(env, 90), np.percentile(env, 10)]
    d1, d2 = np.diff(w), np.diff(np.diff(w))
    activity = np.var(w)
    mobility = np.sqrt(np.var(d1) / (activity + 1e-8))
    complexity = np.sqrt(np.var(d2) / (np.var(d1) + 1e-8)) / (mobility + 1e-8)
    feats += [activity, mobility, complexity]
    freqs, psd = welch(w, fs=200, nperseg=min(64, len(w) // 2))
    total = np.sum(psd) + 1e-8
    for lo, hi in [(20, 50), (50, 100), (100, 150), (150, 200)]:
        feats.append(np.sum(psd[(freqs >= lo) & (freqs < hi)]) / total)
    mean_f = np.sum(freqs * psd) / total
    med_i  = min(np.searchsorted(np.cumsum(psd), total / 2), len(freqs) - 1)
    feats += [mean_f, freqs[med_i]]
    for seg in np.array_split(w, 8):
        feats += [np.mean(np.abs(seg)), np.sqrt(np.mean(seg ** 2)), np.var(seg)]
    try:
        from numpy.linalg import lstsq
        n, order = len(w), 6
        X = np.column_stack([w[order - i - 1:n - i - 1] for i in range(order)])
        ar, *_ = lstsq(X, w[order:], rcond=None)
        feats += list(ar)
    except Exception:
        feats += [0.0] * 6
    feats.append(np.sum(psd[(freqs >= 20) & (freqs < 100)]) /
                 (np.sum(psd[(freqs >= 100) & (freqs < 200)]) + 1e-8))
    return np.array(feats)

def predict_from_window(emg_window):
    signal   = np.array([row[0] for row in emg_window])
    filtered = bandpass_filter(signal)
    if config.get("single_channel"):
        features = extract_single_channel_features(filtered).reshape(1, -1)
    else:
        features = extract_features(bandpass_filter(np.array(emg_window))).reshape(1, -1)
    proba       = model.predict_proba(features)[0]
    idx         = int(np.argmax(proba))
    confidence  = float(proba[idx])
    name        = config["label_encoder_classes"][idx]
    gesture_id  = next((k for k, v in GESTURE_NAMES.items() if v == name), 1)
    return name, confidence, emg_window

def get_dataset_window(gesture_id=None):
    target  = gesture_id if gesture_id in range(1, 7) else random.randint(1, 6)
    indices = np.where(_labels_full == target)[0]
    valid   = [i for i in indices if i + 200 < len(_emg_full)]
    start   = random.choice(valid)
    return _emg_full[start:start + 200].tolist()

def execute_action(gesture_name):
    actions = {
        "index flex":  lambda: mouse_move(-40, 0),
        "middle flex": lambda: mouse_move(40,  0),
        "ring flex":   lambda: mouse_move(0,   40),
        "pinky flex":  lambda: mouse_move(0,  -40),
        "thumb flex":  mouse_click,
        "fist":        press_space,
    }
    if gesture_name in actions:
        actions[gesture_name]()
    time.sleep(0.005)

def compute_finger_curls(emg_window):
    if not emg_window:
        return [0, 0, 0, 0, 0]
    nCh  = len(emg_window[0])
    mav  = [sum(abs(r[ch]) for r in emg_window) / len(emg_window) for ch in range(nCh)]
    peak = max(mav + [1e-4])
    n    = [v / peak for v in mav]
    return [(n[0]+n[1])/2, (n[2]+n[3])/2, (n[4]+n[5])/2,
            (n[6]+n[7])/2, (n[8]+n[9])/2]

SENSOR_CURLS = {
    "rest":              [0.0, 0.0, 0.0, 0.0, 0.0],
    "fist":              [1.0, 1.0, 1.0, 1.0, 1.0],
    "hand back":         [0.1, 0.1, 0.1, 0.1, 0.1],
    "pinky up":          [0.9, 0.9, 0.9, 0.0, 0.9],
    "all fingers up":    [0.0, 0.0, 0.0, 0.0, 0.0],
    "fingertips arm up": [0.3, 0.3, 0.3, 0.3, 0.3],
}


# ── Waveform widget — dark, multi-channel overlay
class WaveformWidget(QWidget):
    _CH_INDICES = [0, 4, 8, 12]
    _CH_ALPHAS  = [1.0, 0.46, 0.28, 0.16]

    def __init__(self):
        super().__init__()
        self.setMinimumHeight(140)
        self.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Fixed)
        self._data     = [[0.0] * 200 for _ in range(4)]
        self._prev     = [[0.0] * 200 for _ in range(4)]
        self._progress = 1.0
        self._idle     = True
        self._r, self._g, self._b    = 255, 45, 120
        self._tr, self._tg, self._tb = 255, 45, 120
        self._dot_phase = 0.0
        t = QTimer(self)
        t.timeout.connect(self._tick)
        t.start(10)

    def update_data(self, emg_window, color=None):
        self._prev = [list(ch) for ch in self._data]
        self._data = []
        for ch_idx in self._CH_INDICES:
            try:
                vals = [row[ch_idx] for row in emg_window]
            except (IndexError, TypeError):
                vals = [0.0] * 200
            mn, mx = min(vals), max(vals)
            rng = max(mx - mn, 0.0001)
            self._data.append([(v - mn) / rng for v in vals])
        self._progress = 0.0
        self._idle     = False
        if color:
            self._tr, self._tg, self._tb = color.red(), color.green(), color.blue()

    def update_voltage(self, voltage, color=None):
        self._prev    = [list(ch) for ch in self._data]
        self._data[0] = self._data[0][1:] + [min(voltage / 2.0, 1.0)]
        self._progress = 1.0
        self._idle     = False
        if color:
            self._tr, self._tg, self._tb = color.red(), color.green(), color.blue()
        self.update()

    def reset(self):
        self._data     = [[0.0] * 200 for _ in range(4)]
        self._prev     = [[0.0] * 200 for _ in range(4)]
        self._progress = 1.0
        self._idle     = True
        self.update()

    def _tick(self):
        changed = False
        if self._progress < 1.0:
            self._progress = min(1.0, self._progress + 0.09)
            changed = True
        for attr, tattr in [('_r','_tr'),('_g','_tg'),('_b','_tb')]:
            cur, tgt = getattr(self, attr), getattr(self, tattr)
            nv = int(cur + (tgt - cur) * 0.2)
            if nv != cur:
                setattr(self, attr, nv)
                changed = True
        if self._idle:
            self._dot_phase = (self._dot_phase + 0.038) % (2 * math.pi)
            changed = True
        if changed:
            self.update()

    def paintEvent(self, event):
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing)
        w, h = self.width(), self.height()

        p.fillRect(0, 0, w, h, BG)

        # Subtle grid
        gp = QPen(QColor(255, 255, 255, 8))
        gp.setWidth(1)
        p.setPen(gp)
        for i in range(1, 4):
            p.drawLine(0, h * i // 4, w, h * i // 4)
        for i in range(1, 8):
            p.drawLine(w * i // 8, 0, w * i // 8, h)

        color = QColor(self._r, self._g, self._b)

        if self._idle:
            t = self._dot_phase
            pad    = 16
            draw_w = w - pad * 2
            draw_h = h - pad * 2
            n      = max(draw_w, 2)
            idle_path = QPainterPath()
            for i in range(n):
                x_n = i / n
                y   = (math.sin(x_n * 8.0  + t * 1.8) * 0.13
                     + math.sin(x_n * 19.3 + t * 1.1) * 0.065
                     + math.sin(x_n * 4.1  - t * 0.85) * 0.09)
                y_px = pad + draw_h * 0.5 - y * draw_h * 0.55
                if i == 0:
                    idle_path.moveTo(pad, y_px)
                else:
                    idle_path.lineTo(pad + i, y_px)
            alpha = 42 + int(18 * math.sin(t * 1.4))
            idle_pen = QPen(QColor(255, 45, 120, alpha), 1.3)
            idle_pen.setCapStyle(Qt.PenCapStyle.RoundCap)
            p.setPen(idle_pen)
            p.drawPath(idle_path)
            p.setPen(QPen(QColor(255, 255, 255, 28)))
            p.setFont(QFont("-apple-system", 10, QFont.Weight.Light))
            p.drawText(0, 0, w, h, Qt.AlignmentFlag.AlignCenter, "waiting for signal")
            return

        pad    = 16
        draw_w = w - pad * 2
        draw_h = h - pad * 2
        prog   = self._progress

        for ch_idx in range(len(self._data)):
            data   = self._data[ch_idx]
            prev   = self._prev[ch_idx]
            alpha  = self._CH_ALPHAS[ch_idx]
            disp   = [prev[i] + (data[i] - prev[i]) * prog for i in range(len(data))]
            step   = draw_w / max(len(disp) - 1, 1)

            line_path = QPainterPath()
            line_path.moveTo(pad, pad + draw_h - disp[0] * draw_h)
            for i, val in enumerate(disp[1:], 1):
                line_path.lineTo(pad + i * step, pad + draw_h - val * draw_h)

            if ch_idx == 0:
                # Fill under primary channel
                fill_path = QPainterPath()
                fill_path.moveTo(pad, h - pad)
                fill_path.lineTo(pad, pad + draw_h - disp[0] * draw_h)
                for i, val in enumerate(disp[1:], 1):
                    fill_path.lineTo(pad + i * step, pad + draw_h - val * draw_h)
                fill_path.lineTo(pad + draw_w, h - pad)
                fill_path.closeSubpath()
                fc = QColor(color); fc.setAlpha(18)
                p.fillPath(fill_path, QBrush(fc))
                # Glow
                glow_pen = QPen(QColor(color.red(), color.green(), color.blue(), 28), 5)
                glow_pen.setCapStyle(Qt.PenCapStyle.RoundCap)
                p.setPen(glow_pen)
                p.drawPath(line_path)
                # Core
                core_pen = QPen(color, 1.8)
                core_pen.setCapStyle(Qt.PenCapStyle.RoundCap)
                p.setPen(core_pen)
                p.drawPath(line_path)
            else:
                # Secondary channels — thin, dimmed
                sec_pen = QPen(
                    QColor(color.red(), color.green(), color.blue(), int(55 * alpha)), 1.1)
                sec_pen.setCapStyle(Qt.PenCapStyle.RoundCap)
                p.setPen(sec_pen)
                p.drawPath(line_path)


# ── Circular arc confidence widget
class ConfArcWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.setFixedSize(88, 88)
        self._val = 0.0
        self._tgt = 0.0
        self._r, self._g, self._b    = 255, 45, 120
        self._tr, self._tg, self._tb = 255, 45, 120
        t = QTimer(self); t.timeout.connect(self._tick); t.start(10)

    def set_value(self, v, color):
        self._tgt = max(0.0, min(1.0, v))
        self._tr, self._tg, self._tb = color.red(), color.green(), color.blue()

    def reset(self):
        self._tgt = 0.0
        self._tr, self._tg, self._tb = 255, 45, 120

    def _tick(self):
        changed = False
        d = self._tgt - self._val
        if abs(d) > 0.001:
            self._val += d * 0.12; changed = True
        for a, b in [('_r','_tr'),('_g','_tg'),('_b','_tb')]:
            c, t = getattr(self, a), getattr(self, b)
            n = int(c + (t - c) * 0.15)
            if n != c:
                setattr(self, a, n); changed = True
        if changed:
            self.update()

    def paintEvent(self, event):
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing)
        w, h = self.width(), self.height()
        cx, cy = w / 2, h / 2
        r = min(w, h) / 2 - 8

        color = QColor(self._r, self._g, self._b)
        p.setBrush(Qt.BrushStyle.NoBrush)

        # Track arc
        track_pen = QPen(QColor(255, 255, 255, 15), 5)
        track_pen.setCapStyle(Qt.PenCapStyle.RoundCap)
        p.setPen(track_pen)
        p.drawArc(int(cx - r), int(cy - r), int(r * 2), int(r * 2),
                  225 * 16, -270 * 16)

        # Value arc
        if self._val > 0.005:
            glow_pen = QPen(QColor(self._r, self._g, self._b, 38), 9)
            glow_pen.setCapStyle(Qt.PenCapStyle.RoundCap)
            p.setPen(glow_pen)
            span = int(-270 * 16 * self._val)
            p.drawArc(int(cx - r), int(cy - r), int(r * 2), int(r * 2), 225 * 16, span)
            arc_pen = QPen(color, 5)
            arc_pen.setCapStyle(Qt.PenCapStyle.RoundCap)
            p.setPen(arc_pen)
            p.drawArc(int(cx - r), int(cy - r), int(r * 2), int(r * 2), 225 * 16, span)

        # Center text
        val_int = int(round(self._val * 100))
        if val_int > 0:
            p.setPen(QPen(color))
            p.setFont(QFont("-apple-system", 16, QFont.Weight.Bold))
            p.drawText(QRect(0, 0, w, h - 4), Qt.AlignmentFlag.AlignCenter, f"{val_int}%")
        else:
            p.setPen(QPen(QColor(255, 255, 255, 35)))
            p.setFont(QFont("-apple-system", 15, QFont.Weight.Light))
            p.drawText(QRect(0, 0, w, h), Qt.AlignmentFlag.AlignCenter, "—")


# ── Gesture button (dark theme)
class GestureButton(QWidget):
    def __init__(self, key, gesture_name, action, symbol):
        super().__init__()
        self.key          = key
        self.gesture_name = gesture_name
        self.action       = action
        self.symbol       = symbol
        self._alpha       = 0.0
        self._tgt         = 0.0
        self.setFixedSize(116, 96)
        self.setCursor(Qt.CursorShape.PointingHandCursor)
        t = QTimer(self); t.timeout.connect(self._tick); t.start(10)

    def _tick(self):
        d = self._tgt - self._alpha
        if abs(d) > 0.004:
            self._alpha += d * 0.28
            self.update()

    def set_active(self, val):
        self._tgt = 1.0 if val else 0.0

    def paintEvent(self, event):
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing)
        w, h  = self.width(), self.height()
        color = GESTURE_COLORS.get(self.gesture_name, ACCENT)
        a     = self._alpha

        # Card background
        bg = QColor(color); bg.setAlpha(int(6 + 30 * a))
        p.setBrush(QBrush(bg))
        border = QColor(color); border.setAlpha(int(22 + 120 * a))
        p.setPen(QPen(border, 1.0))
        p.drawRoundedRect(1, 1, w - 2, h - 2, 12, 12)

        # Top glow strip when active
        if a > 0.05:
            glow = QColor(color); glow.setAlpha(int(80 * a))
            p.setBrush(glow)
            p.setPen(Qt.PenStyle.NoPen)
            p.drawRoundedRect(8, 1, w - 16, 2, 1, 1)

        def blend(base, target):
            return QColor(
                int(base.red()   + (target.red()   - base.red())   * a),
                int(base.green() + (target.green() - base.green()) * a),
                int(base.blue()  + (target.blue()  - base.blue())  * a),
            )

        # Key number
        key_c = blend(TEXT3, TEXT)
        p.setPen(QPen(key_c))
        p.setFont(QFont("-apple-system", 10, QFont.Weight.DemiBold if a > 0.5 else QFont.Weight.Normal))
        p.drawText(QRect(0, 8, w, 16), Qt.AlignmentFlag.AlignHCenter, str(self.key))

        # Symbol
        sym_c = blend(TEXT2, color)
        p.setPen(QPen(sym_c))
        p.setFont(QFont("-apple-system", 20))
        p.drawText(QRect(0, 24, w, 30), Qt.AlignmentFlag.AlignHCenter, self.symbol)

        # Gesture name
        name_c = blend(TEXT3, TEXT2)
        p.setPen(QPen(name_c))
        p.setFont(QFont("-apple-system", 9))
        short = self.gesture_name.replace(" flex", "")
        p.drawText(QRect(0, 62, w, 16), Qt.AlignmentFlag.AlignHCenter, short)

        # Action label pill when active
        if a > 0.3:
            pill_c = QColor(color); pill_c.setAlpha(int(120 * a))
            p.setBrush(pill_c)
            p.setPen(Qt.PenStyle.NoPen)
            p.drawRoundedRect(8, 80, w - 16, 11, 5, 5)
            text_c = QColor(255, 255, 255, int(200 * a))
            p.setPen(text_c)
            p.setFont(QFont("-apple-system", 7))
            p.drawText(QRect(8, 80, w - 16, 11), Qt.AlignmentFlag.AlignCenter, self.action.lower())


# ── Pulsing live indicator
class LiveDot(QWidget):
    def __init__(self):
        super().__init__()
        self.setFixedSize(10, 10)
        self._phase  = 0.0
        self._active = False
        t = QTimer(self); t.timeout.connect(self._tick); t.start(30)

    def set_active(self, v):
        self._active = v
        self.update()

    def _tick(self):
        if self._active:
            self._phase = (self._phase + 0.15) % (2 * 3.14159)
            self.update()

    def paintEvent(self, event):
        import math
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing)
        if self._active:
            pulse = 0.5 + 0.5 * math.sin(self._phase)
            outer = QColor(255, 45, 120, int(40 * pulse))
            p.setBrush(outer)
            p.setPen(Qt.PenStyle.NoPen)
            p.drawEllipse(0, 0, 10, 10)
            p.setBrush(ACCENT)
            p.drawEllipse(3, 3, 4, 4)
        else:
            p.setBrush(QColor(255, 255, 255, 40))
            p.setPen(Qt.PenStyle.NoPen)
            p.drawEllipse(3, 3, 4, 4)


# ── Segmented mode control
class SegmentedControl(QWidget):
    changed = pyqtSignal(str)

    def __init__(self, options):
        super().__init__()
        self._selected = options[0]
        layout = QHBoxLayout(self)
        layout.setContentsMargins(3, 3, 3, 3)
        layout.setSpacing(2)
        self.setFixedHeight(32)
        self.setStyleSheet(f"""
            QWidget {{ background: rgba(255,255,255,0.06); border-radius: 14px; }}
        """)
        self._buttons = {}
        for opt in options:
            btn = QPushButton(opt)
            btn.setFixedHeight(26)
            btn.setCursor(Qt.CursorShape.PointingHandCursor)
            btn.setCheckable(True)
            btn.setChecked(opt == self._selected)
            btn.clicked.connect(lambda _, o=opt: self._select(o))
            self._apply_style(btn, opt == self._selected)
            layout.addWidget(btn)
            self._buttons[opt] = btn

    def _apply_style(self, btn, active):
        if active:
            btn.setStyleSheet("""
                QPushButton {
                    background: rgba(255,255,255,0.12);
                    color: white; border: 1px solid rgba(255,255,255,0.18);
                    border-radius: 11px; font-size: 12px;
                    font-weight: 500; padding: 0 14px;
                }
            """)
        else:
            btn.setStyleSheet("""
                QPushButton {
                    background: transparent; color: rgba(255,255,255,0.45);
                    border: none; border-radius: 11px;
                    font-size: 12px; padding: 0 14px;
                }
                QPushButton:hover { color: rgba(255,255,255,0.75); }
            """)

    def _select(self, opt):
        if opt == self._selected: return
        self._selected = opt
        for o, btn in self._buttons.items():
            btn.setChecked(o == opt)
            self._apply_style(btn, o == opt)
        self.changed.emit(opt)

    def value(self):
        return self._selected

    def set_value(self, opt):
        self._select(opt)


# ── Global key listener
class GlobalKeyListener(QThread):
    key_pressed = pyqtSignal(int)

    def run(self):
        python = sys.executable
        proc = subprocess.Popen(
            [python, os.path.join(BASE, 'keywatcher.py')],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
        )
        for line in proc.stdout:
            k = line.strip()
            if k in KEY_MAP:
                self.key_pressed.emit(KEY_MAP[k])


def _card_frame(radius=16):
    f = QFrame()
    f.setStyleSheet(f"""
        QFrame {{
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: {radius}px;
        }}
        QLabel {{ background: transparent; border: none; }}
    """)
    return f


def _divider():
    f = QFrame()
    f.setFrameShape(QFrame.Shape.HLine)
    f.setFixedHeight(1)
    f.setStyleSheet("background: rgba(255,255,255,0.07); border: none;")
    return f


def _label(text, size=12, weight=QFont.Weight.Normal, color=None, align=None):
    lb = QLabel(text)
    c  = color or "rgba(255,255,255,0.55)"
    lb.setStyleSheet(f"color: {c}; font-size: {size}px; background: transparent; border: none;")
    font = QFont("-apple-system", size)
    font.setWeight(weight)
    lb.setFont(font)
    if align:
        lb.setAlignment(align)
    return lb


# ── Main window
class MyojamWindow(QMainWindow):
    gesture_done   = pyqtSignal(str, float, list)
    sensor_gesture = pyqtSignal(str)
    sensor_status  = pyqtSignal(bool, str)

    def __init__(self):
        super().__init__()
        self.active        = False
        self.last_gesture  = None
        self._busy         = False
        self._sensor_mode  = False
        self._sensor_buf   = []
        self.emg_clf       = None

        # Session stats
        self._session_start = None
        self._gesture_count = 0
        self._conf_sum      = 0.0
        self._session_timer = None

        self.setWindowTitle("myojam")
        self.resize(960, 760)
        self.setMinimumSize(840, 680)
        self.setUnifiedTitleAndToolBarOnMac(True)
        QTimer.singleShot(100, self._setup_titlebar)

        central = QWidget()
        central.setStyleSheet(f"background: {BG.name()};")
        self.setCentralWidget(central)
        QApplication.instance().setStyleSheet("* { outline: 0; }")

        root = QVBoxLayout(central)
        root.setContentsMargins(0, 0, 0, 0)
        root.setSpacing(0)

        # ── HEADER
        header_w = QWidget()
        header_w.setFixedHeight(58)
        header_w.setStyleSheet(
            f"background: {BG.name()}; border-bottom: 1px solid rgba(255,255,255,0.07);")
        hlay = QHBoxLayout(header_w)
        hlay.setContentsMargins(24, 0, 24, 0)
        hlay.setSpacing(12)

        # Logo
        logo_px = QPixmap(24, 24)
        logo_px.fill(Qt.GlobalColor.transparent)
        lp = QPainter(logo_px)
        lp.setRenderHint(QPainter.RenderHint.Antialiasing)
        lp.setPen(QPen(ACCENT, 1.2))
        lp.setBrush(Qt.BrushStyle.NoBrush)
        lp.drawEllipse(1, 1, 22, 22)
        lp.setPen(QPen(ACCENT, 1.5, Qt.PenStyle.SolidLine,
                       Qt.PenCapStyle.RoundCap, Qt.PenJoinStyle.RoundJoin))
        pts = [QPointF(2, 12), QPointF(5, 12), QPointF(7, 7), QPointF(9, 17),
               QPointF(11, 10), QPointF(13, 14), QPointF(15, 12),
               QPointF(18, 12), QPointF(20, 8), QPointF(22, 12)]
        for i in range(len(pts) - 1):
            lp.drawLine(pts[i], pts[i + 1])
        lp.setPen(Qt.PenStyle.NoPen)
        lp.setBrush(QBrush(ACCENT))
        lp.drawEllipse(QRectF(10, 10, 4, 4))
        lp.end()
        logo_icon = QLabel()
        logo_icon.setPixmap(logo_px)
        hlay.addWidget(logo_icon)

        logo_text = QLabel("myojam")
        logo_text.setStyleSheet("color: white; font-size: 17px; font-weight: 600;"
                                 " background: transparent; border: none;")
        hlay.addWidget(logo_text)
        hlay.addSpacing(8)

        self.mode_ctrl = SegmentedControl(["Dataset", "Sensor"])
        self.mode_ctrl.changed.connect(self._on_mode_change)
        hlay.addWidget(self.mode_ctrl)
        hlay.addStretch()

        # Connection status (sensor mode)
        self.conn_label = QLabel("")
        self.conn_label.setStyleSheet("color: rgba(255,255,255,0.4); font-size: 11px;"
                                       " background: transparent; border: none;")
        self.conn_label.hide()
        hlay.addWidget(self.conn_label)

        # Live dot + timer
        self.live_dot = LiveDot()
        hlay.addWidget(self.live_dot)

        self.session_label = QLabel("00:00")
        self.session_label.setStyleSheet("color: rgba(255,255,255,0.4); font-size: 13px;"
                                          " background: transparent; border: none;"
                                          " min-width: 36px;")
        hlay.addWidget(self.session_label)

        hlay.addSpacing(8)

        self.start_btn = QPushButton("Start")
        self.start_btn.setFixedHeight(34)
        self.start_btn.setFixedWidth(88)
        self.start_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        self._style_start_btn(False)
        self.start_btn.clicked.connect(self.toggle_active)
        hlay.addWidget(self.start_btn)

        root.addWidget(header_w)

        # ── CONTENT
        content_w = QWidget()
        content_lay = QHBoxLayout(content_w)
        content_lay.setContentsMargins(24, 20, 24, 20)
        content_lay.setSpacing(16)

        # Left column
        left = QVBoxLayout()
        left.setSpacing(10)

        # Waveform card
        wave_card = _card_frame()
        wave_card.setMinimumHeight(148)
        wave_inner = QVBoxLayout(wave_card)
        wave_inner.setContentsMargins(0, 0, 0, 0)
        wave_inner.setSpacing(0)

        wave_header = QWidget()
        wave_header.setStyleSheet("background: transparent; border: none;")
        wave_header.setFixedHeight(30)
        wh_lay = QHBoxLayout(wave_header)
        wh_lay.setContentsMargins(14, 0, 14, 0)
        wh_lay.addWidget(_label("EMG Signal", 11, color="rgba(255,255,255,0.4)"))
        wh_lay.addStretch()
        self.ch_label = _label("16ch  ·  200 Hz", 10, color="rgba(255,255,255,0.25)")
        wh_lay.addWidget(self.ch_label)
        wave_inner.addWidget(wave_header)

        self.waveform = WaveformWidget()
        wave_inner.addWidget(self.waveform, 1)
        left.addWidget(wave_card)

        # Prediction card
        pred_card = _card_frame()
        pred_card.setFixedHeight(110)
        pred_inner = QHBoxLayout(pred_card)
        pred_inner.setContentsMargins(20, 16, 20, 16)
        pred_inner.setSpacing(0)

        # Left: gesture + action
        pred_left = QVBoxLayout()
        pred_left.setSpacing(4)
        self.gesture_label = QLabel("—")
        self.gesture_label.setStyleSheet(
            "color: #FF2D78; font-size: 26px; font-weight: 600;"
            " letter-spacing: -0.5px; background: transparent; border: none;")
        self.action_label  = _label("Waiting for input", 13, color="rgba(255,255,255,0.4)")
        pred_left.addWidget(self.gesture_label)
        pred_left.addWidget(self.action_label)
        pred_inner.addLayout(pred_left, 1)

        # Right: arc confidence
        self.conf_arc = ConfArcWidget()
        pred_inner.addWidget(self.conf_arc)
        left.addWidget(pred_card)

        content_lay.addLayout(left, 1)

        # Right column — 3D hand
        hand_card = _card_frame()
        hand_card.setFixedWidth(270)
        hand_inner = QVBoxLayout(hand_card)
        hand_inner.setContentsMargins(0, 0, 0, 0)
        hand_inner.setSpacing(0)

        hand_header = QWidget()
        hand_header.setStyleSheet("background: transparent; border: none;")
        hand_header.setFixedHeight(30)
        hh_lay = QHBoxLayout(hand_header)
        hh_lay.setContentsMargins(12, 0, 12, 0)
        hh_lay.addWidget(_label("3D model", 11, color="rgba(255,255,255,0.4)"))
        hand_inner.addWidget(hand_header)

        self.hand3d = Hand3DWidget()
        self.hand3d.setMinimumHeight(200)
        hand_inner.addWidget(self.hand3d, 1)
        content_lay.addWidget(hand_card)

        root.addWidget(content_w, 1)
        root.addWidget(_divider())

        # ── GESTURE MAP
        gesture_w = QWidget()
        gesture_w.setStyleSheet("background: transparent;")
        gesture_lay = QVBoxLayout(gesture_w)
        gesture_lay.setContentsMargins(24, 16, 24, 16)
        gesture_lay.setSpacing(12)
        gesture_lay.addWidget(_label("Gesture Map", 11, color="rgba(255,255,255,0.35)"))

        btn_row = QHBoxLayout()
        btn_row.setSpacing(8)
        self.gesture_buttons = {}
        for gid, gname, action, symbol in GESTURES:
            btn = GestureButton(gid, gname, action, symbol)
            self.gesture_buttons[gname] = btn
            btn.mousePressEvent = lambda e, g=gid: self._on_gesture_click(g)
            btn_row.addWidget(btn)
        gesture_lay.addLayout(btn_row)
        root.addWidget(gesture_w)

        root.addWidget(_divider())

        # ── SESSION BAR
        session_w = QWidget()
        session_w.setFixedHeight(44)
        session_w.setStyleSheet("background: transparent;")
        slay = QHBoxLayout(session_w)
        slay.setContentsMargins(24, 0, 24, 0)
        slay.setSpacing(24)

        for label_text, attr in [
            ("Session", "stat_session"),
            ("Gestures", "stat_gestures"),
            ("Avg confidence", "stat_conf"),
        ]:
            block = QHBoxLayout()
            block.setSpacing(6)
            block.addWidget(_label(label_text + "  ", 10, color="rgba(255,255,255,0.3)"))
            val = _label("—", 12, color="rgba(255,255,255,0.7)")
            setattr(self, attr, val)
            block.addWidget(val)
            slay.addLayout(block)
            if label_text != "Avg confidence":
                slay.addWidget(self._dot_sep())

        slay.addStretch()
        hint = _label("Press 1–6 to trigger gestures", 10, color="rgba(255,255,255,0.2)")
        slay.addWidget(hint)
        root.addWidget(session_w)

        # ── Signals
        self.gesture_done.connect(self._on_gesture_done)
        self.sensor_gesture.connect(self._on_sensor_gesture)
        self.sensor_status.connect(self._on_sensor_status)

        self.global_keys = GlobalKeyListener()
        self.global_keys.key_pressed.connect(self.on_global_key)
        self.global_keys.start()

        self._session_tick_timer = QTimer()
        self._session_tick_timer.timeout.connect(self._update_session_clock)
        self._session_tick_timer.start(1000)

    def _dot_sep(self):
        d = QLabel("·")
        d.setStyleSheet("color: rgba(255,255,255,0.15); font-size: 14px;"
                        " background: transparent; border: none;")
        return d

    def _setup_titlebar(self):
        try:
            from AppKit import NSApplication
            nsapp = NSApplication.sharedApplication()
            for nswin in nsapp.windows():
                if nswin.title() == "myojam":
                    nswin.setTitlebarAppearsTransparent_(True)
                    nswin.setTitleVisibility_(1)
                    nswin.setStyleMask_(nswin.styleMask() | (1 << 15))
                    nswin.setBackgroundColor_(
                        __import__('AppKit').NSColor.colorWithRed_green_blue_alpha_(
                            0.031, 0.031, 0.102, 1.0))
                    break
        except Exception:
            pass

    def _style_start_btn(self, active):
        if active:
            self.start_btn.setText("Stop")
            self.start_btn.setStyleSheet("""
                QPushButton {
                    background: rgba(255,45,120,0.15); color: #FF2D78;
                    border: 1px solid rgba(255,45,120,0.4);
                    border-radius: 17px; font-size: 13px; font-weight: 500;
                }
                QPushButton:hover { background: rgba(255,45,120,0.22); }
            """)
        else:
            self.start_btn.setText("Start")
            self.start_btn.setStyleSheet("""
                QPushButton {
                    background: #FF2D78; color: white; border: none;
                    border-radius: 17px; font-size: 13px; font-weight: 500;
                }
                QPushButton:hover { background: #e0245e; }
                QPushButton:pressed { background: #c01d50; }
            """)

    # ── Mode switching
    def _on_mode_change(self, mode):
        if mode == "Sensor":
            self._connect_sensor()
        else:
            self._disconnect_sensor()

    def _connect_sensor(self):
        self.emg_clf  = EMGClassifier()
        ok, msg       = self.emg_clf.connect()
        if not ok:
            self.conn_label.setText(f"No sensor — {msg}")
            self.conn_label.setStyleSheet(
                "color: rgba(239,68,68,0.8); font-size: 11px;"
                " background: transparent; border: none;")
            self.conn_label.show()
            self.mode_ctrl.set_value("Dataset")
            self._sensor_mode = False
            return
        self._sensor_mode = True
        self._sensor_buf  = []
        self.conn_label.setText(f"Connected  ·  {msg}")
        self.conn_label.setStyleSheet(
            "color: rgba(16,185,129,0.85); font-size: 11px;"
            " background: transparent; border: none;")
        self.conn_label.show()
        self._hw_timer = QTimer()
        self._hw_timer.timeout.connect(self._sensor_tick)
        self._hw_timer.start(25)

    def _disconnect_sensor(self):
        self._sensor_mode = False
        if hasattr(self, '_hw_timer'):
            self._hw_timer.stop()
        if self.emg_clf:
            self.emg_clf.disconnect()
            self.emg_clf = None
        self.conn_label.hide()

    def _sensor_tick(self):
        if not self._sensor_mode or not self.emg_clf:
            return
        voltage, gesture, std = self.emg_clf.read_sample()
        if voltage is None:
            return
        color = SENSOR_COLORS.get(gesture or "rest", ACCENT)
        self.waveform.update_voltage(voltage, color)
        if gesture and gesture != "rest" and gesture != self.last_gesture:
            self.sensor_gesture.emit(gesture)

    def _on_sensor_gesture(self, gesture):
        self.last_gesture = gesture
        action_info = SENSOR_ACTIONS.get(gesture)
        if action_info is None:
            return
        action_label, action_fn = action_info
        color = SENSOR_COLORS.get(gesture, ACCENT)
        self._show_prediction(gesture, action_label, 0.85, color)
        if self.active:
            threading.Thread(target=action_fn, daemon=True).start()

    def _on_sensor_status(self, connected, msg):
        pass

    # ── Dataset mode
    def _on_gesture_click(self, gesture_id):
        if self._sensor_mode or self._busy:
            return
        self._busy = True
        threading.Thread(target=self._process, args=(gesture_id,), daemon=True).start()

    def _process(self, gesture_id):
        name, confidence, window = predict_from_window(get_dataset_window(gesture_id))
        # Use the expected gesture name for UI consistency
        expected = next(gname for gid, gname, _, _ in GESTURES if gid == gesture_id)
        self.gesture_done.emit(expected, confidence, window)
        execute_action(expected)
        self._busy = False

    def _on_gesture_done(self, gesture_name, confidence, window):
        color = GESTURE_COLORS.get(gesture_name, ACCENT)
        action = next((a for _, g, a, _ in GESTURES if g == gesture_name), "—")
        self.waveform.update_data(window, color)
        self._show_prediction(gesture_name, action, confidence, color)
        for gname, btn in self.gesture_buttons.items():
            btn.set_active(gname == gesture_name)
        self.last_gesture = gesture_name
        self.hand3d.update_gesture(gesture_name, compute_finger_curls(window))
        self._gesture_count += 1
        self._conf_sum += confidence
        self._update_session_stats()

    def _show_prediction(self, gesture_name, action_label, confidence, color):
        hex_c = color.name()
        self.gesture_label.setText(gesture_name)
        self.gesture_label.setStyleSheet(
            f"color: {hex_c}; font-size: 26px; font-weight: 600;"
            f" letter-spacing: -0.5px; background: transparent; border: none;")
        self.action_label.setText(action_label)
        self.conf_arc.set_value(confidence, color)

    # ── Start / Stop
    def toggle_active(self):
        self.active = not self.active
        self._style_start_btn(self.active)
        self.live_dot.set_active(self.active)
        if self.active:
            self._session_start = time.time()
            self._gesture_count = 0
            self._conf_sum      = 0.0
        else:
            self._session_start = None
            self.waveform.reset()
            self.gesture_label.setText("—")
            self.gesture_label.setStyleSheet(
                "color: #FF2D78; font-size: 26px; font-weight: 600;"
                " letter-spacing: -0.5px; background: transparent; border: none;")
            self.action_label.setText("Waiting for input")
            self.conf_arc.reset()
            self.hand3d.reset()
            for btn in self.gesture_buttons.values():
                btn.set_active(False)
            self.last_gesture = None

    def on_global_key(self, gesture_id):
        if self.active and not self._sensor_mode and not self._busy:
            self._busy = True
            threading.Thread(target=self._process, args=(gesture_id,), daemon=True).start()

    # ── Session tracking
    def _update_session_clock(self):
        if self._session_start:
            elapsed = int(time.time() - self._session_start)
            m, s = divmod(elapsed, 60)
            self.session_label.setText(f"{m:02d}:{s:02d}")
            self.session_label.setStyleSheet(
                "color: rgba(255,255,255,0.7); font-size: 13px;"
                " background: transparent; border: none; min-width: 36px;")
            self._update_session_stats()
        else:
            self.session_label.setText("00:00")
            self.session_label.setStyleSheet(
                "color: rgba(255,255,255,0.4); font-size: 13px;"
                " background: transparent; border: none; min-width: 36px;")

    def _update_session_stats(self):
        if self._session_start:
            elapsed = int(time.time() - self._session_start)
            m, s = divmod(elapsed, 60)
            self.stat_session.setText(f"{m:02d}:{s:02d}")
        self.stat_gestures.setText(str(self._gesture_count))
        if self._gesture_count > 0:
            avg = self._conf_sum / self._gesture_count
            self.stat_conf.setText(f"{avg * 100:.1f}%")

    # ── Drag
    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            self._drag_pos = event.globalPosition().toPoint() - self.frameGeometry().topLeft()

    def mouseMoveEvent(self, event):
        if event.buttons() == Qt.MouseButton.LeftButton and hasattr(self, '_drag_pos'):
            self.move(event.globalPosition().toPoint() - self._drag_pos)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setApplicationDisplayName("myojam")
    app.setApplicationName("myojam")
    try:
        from AppKit import NSBundle
        NSBundle.mainBundle().infoDictionary()['CFBundleName'] = 'myojam'
    except Exception:
        pass
    app.setStyle("Fusion")

    # App icon
    icon_px = QPixmap(256, 256)
    icon_px.fill(Qt.GlobalColor.transparent)
    ip = QPainter(icon_px)
    ip.setRenderHint(QPainter.RenderHint.Antialiasing)
    ip.setBrush(QBrush(QColor("#08081A")))
    ip.setPen(Qt.PenStyle.NoPen)
    ip.drawRoundedRect(0, 0, 256, 256, 52, 52)
    ip.setPen(QPen(QColor("#FF2D78"), 7, Qt.PenStyle.SolidLine,
                   Qt.PenCapStyle.RoundCap, Qt.PenJoinStyle.RoundJoin))
    pts = [QPointF(30, 128), QPointF(60, 128), QPointF(78, 82), QPointF(96, 174),
           QPointF(114, 100), QPointF(132, 156), QPointF(150, 128),
           QPointF(172, 128), QPointF(190, 84), QPointF(226, 128)]
    for i in range(len(pts) - 1):
        ip.drawLine(pts[i], pts[i + 1])
    ip.setPen(Qt.PenStyle.NoPen)
    ip.setBrush(QBrush(QColor("#FF2D78")))
    ip.drawEllipse(QRectF(114, 112, 28, 28))
    ip.end()
    app.setWindowIcon(QIcon(icon_px))

    window = MyojamWindow()
    window.show()
    sys.exit(app.exec())
