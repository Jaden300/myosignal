"""
hand3d.py — 3D hand widget for myojam desktop app
Pure QPainter — no OpenGL, no extra dependencies.
Uses perspective projection + painter's algorithm (depth sort).
"""

import math
from PyQt6.QtWidgets import QWidget, QSizePolicy
from PyQt6.QtGui import QPainter, QColor, QPen, QBrush, QPolygonF
from PyQt6.QtCore import Qt, QTimer, QPointF


# ── Colour palette
SKIN        = QColor("#F2C9A0")
SKIN_DARK   = QColor("#D4A574")
SKIN_MID    = QColor("#E8B882")
NAIL        = QColor("#F9E0E8")
ACCENT      = QColor("#FF2D78")
ACCENT_SOFT = QColor("#FFD6E7")
BG          = QColor("#FFFFFF")


# ── 3-D math helpers (plain lists, no numpy needed)

def _mul(m, v):
    """4x4 matrix * 4-vec"""
    return [
        m[0]*v[0] + m[1]*v[1] + m[2]*v[2]  + m[3]*v[3],
        m[4]*v[0] + m[5]*v[1] + m[6]*v[2]  + m[7]*v[3],
        m[8]*v[0] + m[9]*v[1] + m[10]*v[2] + m[11]*v[3],
        m[12]*v[0]+m[13]*v[1] + m[14]*v[2] + m[15]*v[3],
    ]

def _ry(a):
    c, s = math.cos(a), math.sin(a)
    return [c,0,s,0,  0,1,0,0,  -s,0,c,0,  0,0,0,1]

def _rx(a):
    c, s = math.cos(a), math.sin(a)
    return [1,0,0,0,  0,c,-s,0,  0,s,c,0,  0,0,0,1]

def _rz(a):
    c, s = math.cos(a), math.sin(a)
    return [c,-s,0,0,  s,c,0,0,  0,0,1,0,  0,0,0,1]

def _transform(pts, m):
    out = []
    for p in pts:
        v = _mul(m, [p[0], p[1], p[2], 1.0])
        out.append((v[0], v[1], v[2]))
    return out

def _chain(*matrices):
    """Multiply a sequence of 4x4 matrices left-to-right"""
    def mm(a, b):
        r = [0]*16
        for i in range(4):
            for j in range(4):
                for k in range(4):
                    r[i*4+j] += a[i*4+k] * b[k*4+j]
        return r
    result = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]  # identity
    for m in matrices:
        result = mm(result, m)
    return result

def _project(p, fov=320, cam_z=4.5):
    z = p[2] + cam_z
    if z < 0.01:
        z = 0.01
    scale = fov / z
    return (p[0] * scale, -p[1] * scale)


def _box_faces(x0, y0, z0, x1, y1, z1):
    """6 faces of an axis-aligned box as lists of 4 vertices"""
    v = [
        (x0,y0,z0),(x1,y0,z0),(x1,y1,z0),(x0,y1,z0),  # front
        (x0,y0,z1),(x1,y0,z1),(x1,y1,z1),(x0,y1,z1),  # back
    ]
    return [
        [v[0],v[1],v[2],v[3]],  # front  -z
        [v[7],v[6],v[5],v[4]],  # back   +z
        [v[4],v[5],v[1],v[0]],  # bottom -y
        [v[3],v[2],v[6],v[7]],  # top    +y
        [v[0],v[3],v[7],v[4]],  # left   -x
        [v[1],v[5],v[6],v[2]],  # right  +x
    ]

def _face_normal_z(pts3d):
    """Rough normal — just for back-face culling (z component)"""
    if len(pts3d) < 3:
        return 0
    ax, ay = pts3d[1][0]-pts3d[0][0], pts3d[1][1]-pts3d[0][1]
    bx, by = pts3d[2][0]-pts3d[0][0], pts3d[2][1]-pts3d[0][1]
    return ax*by - ay*bx  # z of cross product


# ── Finger segment builder

def _segment(length, r_top, r_bot, n=6):
    """Return box-style faces for a rounded finger segment"""
    # Simplified as a tapered box (looks fine at this scale)
    hw = r_top * 0.9
    hd = r_top * 0.65
    hw2 = r_bot * 0.9
    hd2 = r_bot * 0.65
    faces = [
        # front
        [(-hw,0,-hd), (hw,0,-hd), (hw2,length,-hd2), (-hw2,length,-hd2)],
        # back
        [(-hw2,length,hd2),(hw2,length,hd2),(hw,0,hd),(-hw,0,hd)],
        # left
        [(-hw,0,hd),(-hw,0,-hd),(-hw2,length,-hd2),(-hw2,length,hd2)],
        # right
        [(hw,0,-hd),(hw,0,hd),(hw2,length,hd2),(hw2,length,-hd2)],
        # top cap
        [(-hw2,length,-hd2),(hw2,length,-hd2),(hw2,length,hd2),(-hw2,length,hd2)],
        # bottom cap
        [(-hw,0,hd),(hw,0,hd),(hw,0,-hd),(-hw,0,-hd)],
    ]
    return faces


# ── Main widget

class Hand3DWidget(QWidget):

    # Finger layout: (spread_angle, x_offset, y_at_palm_top)
    _FINGER_LAYOUT = [
        # name,  spread,  x,     lengths (prox, mid, dist),   radii
        ("pinky",  0.18,  -0.38, [0.38, 0.30, 0.22],  [0.075, 0.065, 0.055]),
        ("ring",   0.06,  -0.13, [0.44, 0.34, 0.24],  [0.085, 0.073, 0.060]),
        ("middle", -0.04,  0.12, [0.48, 0.36, 0.25],  [0.090, 0.077, 0.063]),
        ("index",  -0.14,  0.37, [0.44, 0.33, 0.23],  [0.085, 0.073, 0.060]),
    ]

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setMinimumHeight(180)
        self.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Fixed)
        self.setAttribute(Qt.WidgetAttribute.WA_OpaquePaintSurface, False)

        self._rot_y   = 0.0          # current Y rotation
        self._rot_x   = -0.18        # slight downward tilt (fixed)
        self._curls   = [0.0] * 5    # [pinky, ring, middle, index, thumb]
        self._targets = [0.0] * 5
        self._gesture = None
        self._active_finger = -1     # which finger to highlight (-1 = none)

        t = QTimer(self)
        t.timeout.connect(self._tick)
        t.start(16)  # ~60 fps

    def update_gesture(self, gesture_name, finger_curls):
        """Called from myojam.py when a gesture is classified."""
        self._gesture = gesture_name
        if finger_curls and len(finger_curls) >= 5:
            # finger_curls order: [index, middle, ring, pinky, thumb]
            # our _curls order:   [pinky, ring, middle, index, thumb]
            self._targets = [
                finger_curls[3],  # pinky
                finger_curls[2],  # ring
                finger_curls[1],  # middle
                finger_curls[0],  # index
                finger_curls[4],  # thumb
            ]
        # Highlight active finger
        highlights = {
            "index flex":  3,
            "middle flex": 2,
            "ring flex":   1,
            "pinky flex":  0,
            "thumb flex":  4,
            "fist":       -2,   # -2 = all highlighted
        }
        self._active_finger = highlights.get(gesture_name, -1)

    def reset(self):
        self._targets = [0.0] * 5
        self._active_finger = -1
        self._gesture = None

    def _tick(self):
        self._rot_y += 0.012
        changed = False
        for i in range(5):
            diff = self._targets[i] - self._curls[i]
            if abs(diff) > 0.001:
                self._curls[i] += diff * 0.09
                changed = True
        self.update()

    # ── Rendering

    def paintEvent(self, event):
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing)

        w, h = self.width(), self.height()
        cx, cy = w // 2, h // 2 + 10

        # Background
        p.fillRect(0, 0, w, h, BG)

        # Collect all faces with their depth (avg z after transform)
        all_faces = []  # (avg_z, pts_3d, face_type, finger_idx)

        ry = _ry(self._rot_y)
        rx = _rx(self._rot_x)
        R  = _chain(rx, ry)

        # ── Palm
        palm_faces = _box_faces(-0.55, -0.72, -0.12,  0.55, 0.18, 0.12)
        for fi, face in enumerate(palm_faces):
            tf = _transform(face, R)
            avg_z = sum(v[2] for v in tf) / len(tf)
            all_faces.append((avg_z, tf, "palm", -1))

        # ── Thumb (separate layout)
        thumb_curl  = self._curls[4]
        thumb_angle = math.pi * 0.55 * thumb_curl  # curls toward palm
        # Thumb base position on the side of the palm
        thumb_base  = _chain(R, _rz(math.pi * 0.45), _rx(math.pi * 0.08))
        thumb_segs  = [(0.30, 0.095, 0.080), (0.24, 0.080, 0.068), (0.18, 0.068, 0.055)]

        t_off = _transform([(-0.55, -0.30, 0.0)], R)[0]
        t_mat = _chain(R, _rz(math.pi * 0.42 + thumb_curl * math.pi * 0.5), _rx(-0.12))
        t_y   = 0.0
        for si, (seg_len, r_top, r_bot) in enumerate(thumb_segs):
            faces_local = _segment(seg_len, r_top, r_bot)
            # translate up along the segment's local Y
            faces_world = []
            for face in faces_local:
                pts_up = [(v[0], v[1] + t_y, v[2]) for v in face]
                pts_t  = _transform(pts_up, t_mat)
                # translate to thumb base
                pts_t  = [(v[0] + t_off[0], v[1] + t_off[1], v[2] + t_off[2]) for v in pts_t]
                avg_z  = sum(v[2] for v in pts_t) / len(pts_t)
                all_faces.append((avg_z, pts_t, "thumb", 4))
            t_y += seg_len

        # ── 4 Fingers
        for fi, (fname, spread, xoff, lengths, radii) in enumerate(self._FINGER_LAYOUT):
            curl = self._curls[fi]
            # each segment rotates around local X by curl * max_angle
            max_angle = math.pi * 0.82

            # base matrix: finger starts at top of palm, splayed outward
            base_spread = _rz(-spread)
            base_trans  = [(xoff, 0.18, 0.0)]
            palm_top    = _transform(base_trans, R)[0]

            # Build finger segments iteratively
            # seg 0: proximal — rotates from palm
            # seg 1: middle   — rotates relative to seg 0 tip
            # seg 2: distal   — rotates relative to seg 1 tip

            seg_mat = _chain(R, base_spread)
            tip     = (xoff, 0.18, 0.0)  # world coords of current joint
            tip_t   = _transform([tip], R)[0]

            prox_angle  = curl * max_angle * 0.40
            mid_angle   = curl * max_angle * 0.38
            dist_angle  = curl * max_angle * 0.22

            angles = [prox_angle, mid_angle, dist_angle]

            current_mat = seg_mat
            cur_tip_local = (xoff, 0.18, 0.0)

            for si, (seg_len, r_top, r_bot, seg_angle) in enumerate(
                    zip(lengths, radii, radii[1:]+[radii[-1]], angles)):
                r_bot_use = radii[si+1] if si+1 < len(radii) else radii[-1]

                # Accumulate rotation for this segment
                current_mat = _chain(current_mat, _rx(seg_angle))
                faces_local = _segment(seg_len, r_top, r_bot_use)

                for face in faces_local:
                    # The segment origin is cur_tip_local
                    pts_offset = [(v[0] + cur_tip_local[0],
                                   v[1] + cur_tip_local[1],
                                   v[2] + cur_tip_local[2]) for v in face]
                    # Now apply full rotation to get world space is wrong —
                    # let's do it properly by building in local space and rotating

                faces_world = []
                for face in faces_local:
                    # local → segment → world
                    pts_w = _transform(
                        [(v[0], v[1] + cur_tip_local[1], v[2]) for v in face],
                        _chain(_rx(0), current_mat)   # already has R embedded
                    )
                    # Shift by x offset (spread already in matrix)
                    avg_z = sum(v[2] for v in pts_w) / len(pts_w)
                    ftype = "finger_active" if (
                        self._active_finger == -2 or self._active_finger == fi
                    ) else "finger"
                    all_faces.append((avg_z, pts_w, ftype, fi))

                # advance tip along local Y
                tip_advance = _transform([(0.0, seg_len, 0.0)], current_mat)
                cur_tip_local = (tip_advance[0][0], tip_advance[0][1], cur_tip_local[1] + seg_len)

        # ── Sort by depth (painter's algorithm — back to front)
        all_faces.sort(key=lambda f: f[0], reverse=True)

        # ── Draw
        for avg_z, pts3d, ftype, fidx in all_faces:
            # Back-face cull
            nz = _face_normal_z(pts3d)
            if nz < 0:
                continue

            # Project
            pts2d = [_project(v) for v in pts3d]
            poly  = QPolygonF([QPointF(cx + x, cy + y) for x, y in pts2d])

            # Colour based on face type and rough lighting
            light = 0.7 + 0.3 * max(0, min(1, (avg_z + 2) / 4))

            if ftype == "palm":
                base  = SKIN_MID
                edge  = SKIN_DARK
            elif ftype == "thumb":
                if self._active_finger == 4 or self._active_finger == -2:
                    base = ACCENT_SOFT
                    edge = ACCENT
                else:
                    base = SKIN
                    edge = SKIN_DARK
            elif ftype == "finger_active":
                base = ACCENT_SOFT
                edge = ACCENT
            else:  # finger, inactive
                base = SKIN
                edge = SKIN_DARK

            fill = QColor(
                min(255, int(base.red()   * light)),
                min(255, int(base.green() * light)),
                min(255, int(base.blue()  * light)),
            )
            pen_col = QColor(
                min(255, int(edge.red()   * light * 0.8)),
                min(255, int(edge.green() * light * 0.8)),
                min(255, int(edge.blue()  * light * 0.8)),
            )

            p.setPen(QPen(pen_col, 0.8))
            p.setBrush(QBrush(fill))
            p.drawPolygon(poly)

        # Gesture label overlay (subtle, bottom-right)
        if self._gesture:
            p.setPen(QPen(QColor("#AEAEB2")))
            from PyQt6.QtGui import QFont
            p.setFont(QFont("Helvetica Neue", 10))
            p.drawText(0, h - 20, w - 8, 18,
                       Qt.AlignmentFlag.AlignRight | Qt.AlignmentFlag.AlignBottom,
                       self._gesture)

        p.end()