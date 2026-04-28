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
  #toggle {
    position: fixed; bottom: 10px; right: 10px;
    background: rgba(255,45,120,0.12); border: 1px solid rgba(255,45,120,0.35); color: #FF2D78;
    border-radius: 100px; padding: 4px 12px;
    font-family: -apple-system, sans-serif; font-size: 11px; font-weight: 500;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.25s, border-color 0.25s, color 0.25s;
    white-space: nowrap;
  }
  #toggle.paused {
    background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.18); color: rgba(255,255,255,0.45);
  }
</style>
</head>
<body>
<button id="toggle">⟳ Rotating</button>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const PRIMARY_FINGER = {
  "index flex": 0, "middle flex": 1, "ring flex": 2,
  "pinky flex": 3, "thumb flex": 4, "fist": -1,
};

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x08081A, 1);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(0, 0.15, 2.0);
camera.lookAt(0, 0.05, 0);

scene.add(new THREE.AmbientLight(0xffffff, 1.2));
const key = new THREE.DirectionalLight(0xff8fb0, 0.8);
key.position.set(2, 4, 3); scene.add(key);
const fill = new THREE.DirectionalLight(0xffeef4, 0.5);
fill.position.set(-3, 1, 2); scene.add(fill);
const rim = new THREE.DirectionalLight(0xffffff, 0.25);
rim.position.set(0, -2, -3); scene.add(rim);

// Pink hand colours
const skinMat    = new THREE.MeshPhongMaterial({ color: 0xFF2D78, shininess: 35, specular: 0xff88aa });
const knuckleMat = new THREE.MeshPhongMaterial({ color: 0xe0245e, shininess: 70, specular: 0xff88aa });
const nailMat    = new THREE.MeshPhongMaterial({ color: 0xffb3c6, shininess: 180, specular: 0xffffff });

const handGroup = new THREE.Group();
scene.add(handGroup);

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
    0,2,1,0,3,2,
    4,5,8,8,5,9,5,6,9,9,6,10,6,7,10,10,7,11,
    0,4,1,1,4,5,1,5,6,1,6,7,
    3,2,8,2,11,8,2,10,11,2,9,10,
    0,3,4,3,8,4,1,7,2,2,7,11,
  ];
  g.setAttribute('position', new THREE.BufferAttribute(v, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
const palm = new THREE.Mesh(makePalm(), skinMat);
palm.position.y = -0.15;
handGroup.add(palm);

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
    const kg = new THREE.SphereGeometry(rBot*1.05,10,8); kg.scale(1.05,0.82,1);
    pivot.add(new THREE.Mesh(kg, knuckleMat));
    if (i === defs.length-1) {
      const ng = new THREE.BoxGeometry(rTop*1.3,len*0.32,rTop*0.38);
      ng.translate(0,len*0.70,-rTop*0.50); pivot.add(new THREE.Mesh(ng,nailMat));
      const cap = new THREE.SphereGeometry(rTop*0.95,10,8); cap.scale(1,0.9,0.95); cap.translate(0,len,0);
      pivot.add(new THREE.Mesh(cap,skinMat));
    }
  });
  return pivots;
}

const fingerDefs = [
  {x:0.170,y:0.108,d:[[0.185,0.036,0.043],[0.142,0.030,0.036],[0.108,0.023,0.030]]},
  {x:0.057,y:0.118,d:[[0.205,0.038,0.046],[0.158,0.032,0.038],[0.120,0.024,0.032]]},
  {x:-0.057,y:0.112,d:[[0.192,0.036,0.044],[0.148,0.030,0.036],[0.115,0.023,0.030]]},
  {x:-0.165,y:0.088,d:[[0.158,0.030,0.037],[0.118,0.025,0.030],[0.090,0.019,0.025]]},
];
const fingerPivots = fingerDefs.map(f => buildFinger(handGroup, f.x, f.y, f.d));

fingerDefs.forEach(f => {
  const kg = new THREE.SphereGeometry(0.025,10,8); kg.scale(1.1,0.65,0.9);
  const km = new THREE.Mesh(kg,knuckleMat);
  km.position.set(f.x*0.90, f.y-0.005, 0.025); handGroup.add(km);
});

const thumbGroup = new THREE.Group();
thumbGroup.position.set(0.205,-0.090,0.010);
thumbGroup.rotation.z = -Math.PI*0.22;
thumbGroup.rotation.y =  Math.PI*0.12;
thumbGroup.rotation.x = -Math.PI*0.04;
handGroup.add(thumbGroup);
const moundGeo = new THREE.SphereGeometry(0.062,12,10); moundGeo.scale(1.1,0.85,0.90);
thumbGroup.add(new THREE.Mesh(moundGeo,skinMat));

const thumbPivots = [];
[[0.170,0.044,0.055],[0.138,0.035,0.044]].forEach(([len,rTop,rBot],i) => {
  const pivot = new THREE.Group();
  pivot.position.y = i===0 ? 0.042 : 0.170;
  (i===0?thumbGroup:thumbPivots[0]).add(pivot); thumbPivots.push(pivot);
  pivot.add(new THREE.Mesh(seg(len,rTop,rBot),skinMat));
  const kg=new THREE.SphereGeometry(rBot*1.05,10,8); kg.scale(1.05,0.82,1);
  pivot.add(new THREE.Mesh(kg,knuckleMat));
  if(i===1){
    const ng=new THREE.BoxGeometry(rTop*1.3,len*0.32,rTop*0.38); ng.translate(0,len*0.70,-rTop*0.50);
    pivot.add(new THREE.Mesh(ng,nailMat));
    const cap=new THREE.SphereGeometry(rTop*0.95,10,8); cap.scale(1,0.9,0.95); cap.translate(0,len,0);
    pivot.add(new THREE.Mesh(cap,skinMat));
  }
});

let current=[0,0,0,0,0], target=[0,0,0,0,0];
let rotY=0, rotSpeed=0.0018, targetRotSpeed=0.0018;
const MAX=Math.PI*0.80;
let autoRotate = true;

// Toggle button
const btn = document.getElementById('toggle');
btn.addEventListener('click', () => {
  autoRotate = !autoRotate;
  targetRotSpeed = autoRotate ? 0.0018 : 0;
  btn.textContent = autoRotate ? '⟳ Rotating' : '⏸ Paused';
  btn.classList.toggle('paused', !autoRotate);
});

window.updateGesture = function(gestureName, fingerCurls) {
  const primary = PRIMARY_FINGER[gestureName] ?? -1;
  const curls = fingerCurls || [0.5,0.5,0.5,0.5,0.5];
  const maxC = Math.max(...curls, 0.001);
  const norm = curls.map(c => c/maxC);
  target = norm.map((n,i) => {
    if (primary===-1) return Math.min(1, n*1.05);
    if (i===primary)  return Math.min(1, 0.55+n*0.45);
    return Math.min(0.42, n*0.46);
  });
};
window.resetHand = function() { target=[0,0,0,0,0]; };

function resize() {
  const w=window.innerWidth, h=window.innerHeight;
  renderer.setSize(w,h);
  camera.aspect=w/h; camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize); resize();

function animate() {
  requestAnimationFrame(animate);
  current=current.map((c,i)=>c+(target[i]-c)*0.09);
  fingerPivots.forEach((pivots,fi)=>{
    const curl=current[fi]*MAX;
    pivots.forEach((pivot,si)=>{ pivot.rotation.x=curl*(0.28+si*0.44); });
  });
  const tc=current[4]*MAX*0.75;
  if(thumbPivots[0]){thumbPivots[0].rotation.x=tc*0.38; thumbPivots[0].rotation.z=-tc*0.28;}
  if(thumbPivots[1]) thumbPivots[1].rotation.x=tc*0.68;
  // Smooth rotation speed transition (same as website)
  rotSpeed += (targetRotSpeed - rotSpeed) * 0.05;
  rotY += rotSpeed;
  handGroup.rotation.y=rotY;
  renderer.render(scene,camera);
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
        curls_json = json.dumps(finger_curls or [0,0,0,0,0])
        gesture_json = json.dumps(gesture_name or "")
        self.page().runJavaScript(
            f"if(window.updateGesture) window.updateGesture({gesture_json}, {curls_json});"
        )

    def reset(self):
        self.page().runJavaScript("if(window.resetHand) window.resetHand();")