import json
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtCore import Qt

_HTML = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #08081A; overflow: hidden; }
  canvas { display: block; }
</style>
</head>
<body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const PRIMARY_FINGER = {
  "index flex": 0, "middle flex": 1, "ring flex": 2,
  "pinky flex": 3, "thumb flex": 4, "fist": -1,
};

const GESTURE_COLORS = {
  "index flex":  0xFF2D78, "middle flex": 0x3B82F6,
  "ring flex":   0x8B5CF6, "pinky flex":  0x10B981,
  "thumb flex":  0xF59E0B, "fist":        0xEF4444,
};

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x08081A, 1);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(0, 0.15, 2.0);
camera.lookAt(0, 0.02, 0);

// 4-point lighting rig
scene.add(new THREE.AmbientLight(0x1a0a2e, 1.1));
const keyLight = new THREE.DirectionalLight(0xff4d88, 1.15);
keyLight.position.set(2, 4, 3); scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0x6644cc, 0.42);
fillLight.position.set(-3, 1, 2); scene.add(fillLight);
const rimLight = new THREE.DirectionalLight(0xffffff, 0.40);
rimLight.position.set(0, -2, -3); scene.add(rimLight);
const topLight = new THREE.DirectionalLight(0xffaacc, 0.22);
topLight.position.set(0, 6, 1); scene.add(topLight);

// PBR materials
const skinMat = new THREE.MeshStandardMaterial({
  color: 0xFF2D78, roughness: 0.44, metalness: 0.08,
  emissive: new THREE.Color(0xFF2D78), emissiveIntensity: 0.0,
});
const knuckleMat = new THREE.MeshStandardMaterial({
  color: 0xe0245e, roughness: 0.36, metalness: 0.14,
  emissive: new THREE.Color(0xe0245e), emissiveIntensity: 0.0,
});
const nailMat = new THREE.MeshStandardMaterial({
  color: 0xffb3c6, roughness: 0.20, metalness: 0.20,
  emissive: new THREE.Color(0xffccdd), emissiveIntensity: 0.03,
});

// ── Particle background
const PARTICLE_COUNT = 160;
const pPos = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  pPos[i*3]   = (Math.random() - 0.5) * 3.4;
  pPos[i*3+1] = (Math.random() - 0.5) * 3.4;
  pPos[i*3+2] = (Math.random() - 0.5) * 2.0 - 0.5;
}
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const pMat = new THREE.PointsMaterial({
  color: 0xFF2D78, size: 0.013, transparent: true,
  opacity: 0.30, sizeAttenuation: true,
});
const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);

const handGroup = new THREE.Group();
scene.add(handGroup);

// Gesture-reactive point light attached to hand
const handGlow = new THREE.PointLight(0xFF2D78, 0.75, 2.6);
handGlow.position.set(0, 0.08, 0.22);
handGroup.add(handGlow);

// ── Palm geometry
function makePalm() {
  const g = new THREE.BufferGeometry();
  const wW = 0.24, fW = 0.40, palmH = 0.26, d = 0.095;
  const wZ = d * 0.38, fZ = d * 0.5, archY = 0.012;
  const v = new Float32Array([
    -wW/2,0,-wZ,  wW/2,0,-wZ,  wW/2,0,wZ,  -wW/2,0,wZ,
    -fW/2,palmH,-fZ,  -fW/6,palmH+archY,-fZ*0.8,  fW/6,palmH+archY,-fZ*0.8,  fW/2,palmH,-fZ,
    -fW/2,palmH,fZ,   -fW/6,palmH+archY,fZ*0.8,   fW/6,palmH+archY,fZ*0.8,   fW/2,palmH,fZ,
  ]);
  const idx = [
    0,2,1, 0,3,2,
    4,5,8, 8,5,9, 5,6,9, 9,6,10, 6,7,10, 10,7,11,
    0,4,1, 1,4,5, 1,5,6, 1,6,7,
    3,2,8, 2,11,8, 2,10,11, 2,9,10,
    0,3,4, 3,8,4, 1,7,2, 2,7,11,
  ];
  g.setAttribute('position', new THREE.BufferAttribute(v, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
const palm = new THREE.Mesh(makePalm(), skinMat);
palm.position.y = -0.15;
handGroup.add(palm);

// ── Wrist + forearm below palm
const wristGeo = new THREE.CylinderGeometry(0.088, 0.106, 0.22, 16);
const wrist = new THREE.Mesh(wristGeo, skinMat);
wrist.position.set(0, -0.26, 0);
handGroup.add(wrist);

const forearmGeo = new THREE.CylinderGeometry(0.097, 0.112, 0.16, 16);
const forearm = new THREE.Mesh(forearmGeo, skinMat);
forearm.position.set(0, -0.42, 0);
handGroup.add(forearm);

// ── Finger segment helper
function seg(len, rTop, rBot) {
  const g = new THREE.CylinderGeometry(rTop, rBot, len, 12);
  g.translate(0, len/2, 0); return g;
}

function buildFinger(parent, bx, by, defs) {
  const pivots = []; let cur = parent;
  defs.forEach(([len, rTop, rBot], i) => {
    const pivot = new THREE.Group();
    if (i === 0) pivot.position.set(bx, by, 0);
    else pivot.position.y = defs[i-1][0];
    cur.add(pivot); cur = pivot; pivots.push(pivot);
    pivot.add(new THREE.Mesh(seg(len, rTop, rBot), skinMat));
    const kg = new THREE.SphereGeometry(rBot*1.05, 10, 8); kg.scale(1.05, 0.82, 1);
    pivot.add(new THREE.Mesh(kg, knuckleMat));
    if (i === defs.length - 1) {
      const ng = new THREE.BoxGeometry(rTop*1.3, len*0.32, rTop*0.38);
      ng.translate(0, len*0.70, -rTop*0.50); pivot.add(new THREE.Mesh(ng, nailMat));
      const cap = new THREE.SphereGeometry(rTop*0.95, 10, 8); cap.scale(1, 0.9, 0.95); cap.translate(0, len, 0);
      pivot.add(new THREE.Mesh(cap, skinMat));
    }
  });
  return pivots;
}

const fingerDefs = [
  {x: 0.170, y: 0.108, d: [[0.185,0.036,0.043],[0.142,0.030,0.036],[0.108,0.023,0.030]]},
  {x: 0.057, y: 0.118, d: [[0.205,0.038,0.046],[0.158,0.032,0.038],[0.120,0.024,0.032]]},
  {x:-0.057, y: 0.112, d: [[0.192,0.036,0.044],[0.148,0.030,0.036],[0.115,0.023,0.030]]},
  {x:-0.165, y: 0.088, d: [[0.158,0.030,0.037],[0.118,0.025,0.030],[0.090,0.019,0.025]]},
];
const fingerPivots = fingerDefs.map(f => buildFinger(handGroup, f.x, f.y, f.d));

fingerDefs.forEach(f => {
  const kg = new THREE.SphereGeometry(0.025, 10, 8); kg.scale(1.1, 0.65, 0.9);
  const km = new THREE.Mesh(kg, knuckleMat);
  km.position.set(f.x*0.90, f.y-0.005, 0.025); handGroup.add(km);
});

// ── Thumb
const thumbGroup = new THREE.Group();
thumbGroup.position.set(0.205, -0.090, 0.010);
thumbGroup.rotation.z = -Math.PI*0.22;
thumbGroup.rotation.y =  Math.PI*0.12;
thumbGroup.rotation.x = -Math.PI*0.04;
handGroup.add(thumbGroup);
const moundGeo = new THREE.SphereGeometry(0.062, 12, 10); moundGeo.scale(1.1, 0.85, 0.90);
thumbGroup.add(new THREE.Mesh(moundGeo, skinMat));

const thumbPivots = [];
[[0.170,0.044,0.055],[0.138,0.035,0.044]].forEach(([len, rTop, rBot], i) => {
  const pivot = new THREE.Group();
  pivot.position.y = i===0 ? 0.042 : 0.170;
  (i===0 ? thumbGroup : thumbPivots[0]).add(pivot); thumbPivots.push(pivot);
  pivot.add(new THREE.Mesh(seg(len, rTop, rBot), skinMat));
  const kg = new THREE.SphereGeometry(rBot*1.05, 10, 8); kg.scale(1.05, 0.82, 1);
  pivot.add(new THREE.Mesh(kg, knuckleMat));
  if (i === 1) {
    const ng = new THREE.BoxGeometry(rTop*1.3, len*0.32, rTop*0.38);
    ng.translate(0, len*0.70, -rTop*0.50); pivot.add(new THREE.Mesh(ng, nailMat));
    const cap = new THREE.SphereGeometry(rTop*0.95, 10, 8); cap.scale(1, 0.9, 0.95); cap.translate(0, len, 0);
    pivot.add(new THREE.Mesh(cap, skinMat));
  }
});

// ── Spring-damper physics
const STIFFNESS = 0.16, DAMPING = 0.72;
let current  = [0, 0, 0, 0, 0];
let velocity = [0, 0, 0, 0, 0];
let target   = [0, 0, 0, 0, 0];
const MAX = Math.PI * 0.80;

// Gesture-reactive glow
const currentGlowColor = new THREE.Color(0xFF2D78);
const targetGlowColor  = new THREE.Color(0xFF2D78);
let currentEmissive = 0.0;
let targetEmissive  = 0.0;

let rotY      = 0;
let breathTime = 0;

window.updateGesture = function(gestureName, fingerCurls) {
  const primary = PRIMARY_FINGER[gestureName] ?? -1;
  const curls   = fingerCurls || [0.5,0.5,0.5,0.5,0.5];
  const maxC    = Math.max(...curls, 0.001);
  const norm    = curls.map(c => c / maxC);
  target = norm.map((n, i) => {
    if (primary === -1) return Math.min(1, n * 1.05);
    if (i === primary)  return Math.min(1, 0.55 + n * 0.45);
    return Math.min(0.42, n * 0.46);
  });
  const hex = GESTURE_COLORS[gestureName] || 0xFF2D78;
  targetGlowColor.setHex(hex);
  targetEmissive = 0.24;
};

window.resetHand = function() {
  target = [0, 0, 0, 0, 0];
  targetEmissive = 0.0;
  targetGlowColor.setHex(0xFF2D78);
};

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize); resize();

function animate() {
  requestAnimationFrame(animate);

  // Spring physics for fingers
  for (let i = 0; i < 5; i++) {
    const force = (target[i] - current[i]) * STIFFNESS;
    velocity[i] = velocity[i] * DAMPING + force;
    current[i]  = Math.max(0, Math.min(1, current[i] + velocity[i]));
  }

  // Apply finger curls
  fingerPivots.forEach((pivots, fi) => {
    const curl = current[fi] * MAX;
    pivots.forEach((pivot, si) => { pivot.rotation.x = curl * (0.28 + si * 0.44); });
  });
  const tc = current[4] * MAX * 0.75;
  if (thumbPivots[0]) { thumbPivots[0].rotation.x = tc * 0.38; thumbPivots[0].rotation.z = -tc * 0.28; }
  if (thumbPivots[1]) thumbPivots[1].rotation.x = tc * 0.68;

  // Camera breathing
  breathTime += 0.007;
  camera.position.y = 0.15 + Math.sin(breathTime) * 0.012;
  camera.position.x = Math.sin(breathTime * 0.61) * 0.007;
  camera.lookAt(0, 0.02, 0);

  // Auto-rotate hand
  rotY += 0.0018;
  handGroup.rotation.y = rotY;

  // Particle drift
  particles.rotation.y += 0.00042;
  particles.rotation.x += 0.00018;

  // Glow color and emissive lerp
  currentGlowColor.lerp(targetGlowColor, 0.055);
  handGlow.color.copy(currentGlowColor);
  currentEmissive += (targetEmissive - currentEmissive) * 0.065;
  targetEmissive  += (0.0 - targetEmissive) * 0.014;

  skinMat.emissive.copy(currentGlowColor);
  skinMat.emissiveIntensity = currentEmissive * 0.88;
  knuckleMat.emissive.copy(currentGlowColor);
  knuckleMat.emissiveIntensity = currentEmissive * 0.55;

  renderer.render(scene, camera);
}
animate();
</script>
</body>
</html>"""


class Hand3DWidget(QWebEngineView):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setMinimumSize(200, 220)
        self.page().setBackgroundColor(Qt.GlobalColor.transparent)
        self.setHtml(_HTML)

    def update_gesture(self, gesture_name, finger_curls):
        curls_json   = json.dumps(finger_curls or [0, 0, 0, 0, 0])
        gesture_json = json.dumps(gesture_name or "")
        self.page().runJavaScript(
            f"if(window.updateGesture) window.updateGesture({gesture_json}, {curls_json});"
        )

    def reset(self):
        self.page().runJavaScript("if(window.resetHand) window.resetHand();")
