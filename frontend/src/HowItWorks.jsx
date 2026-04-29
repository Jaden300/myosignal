import { useRef, useState, useEffect } from "react"
import * as THREE from 'three'
import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import Footer from "./Footer"
import { Reveal } from "./Animate"
import { IconGear, IconChart, IconBrain, IconBolt } from "./Icons"
import NeuralNoise from "./components/NeuralNoise"

const STEPS = [
  {
    num: "01",
    icon: <IconGear />,
    title: "Signal capture",
    subtitle: "Hardware layer",
    color: "#FF2D78",
    body: "Surface EMG electrodes - adhesive stickers, no needles - pick up the electrical activity of your forearm muscles as you move. The MyoWare 2.0 sensor amplifies and conditions this signal across 16 channels at 200 Hz, fed into an Arduino Uno over USB.",
    tags: ["MyoWare 2.0 sensor", "16 EMG channels", "200 Hz sampling", "Arduino Uno R3"],
  },
  {
    num: "02",
    icon: <IconChart />,
    title: "Filtering & windowing",
    subtitle: "Signal processing",
    color: "#f472b6",
    body: "Raw EMG is noisy - powerline hum, motion artifacts, baseline drift. A 4th-order Butterworth bandpass filter (20–90 Hz) strips it down to the biologically meaningful band. The cleaned signal is then sliced into 200-sample windows with 50-sample steps, ready for feature extraction.",
    tags: ["Butterworth 20–90 Hz", "200-sample windows", "50-sample step", "75% overlap"],
  },
  {
    num: "03",
    icon: <IconChart />,
    title: "Feature extraction",
    subtitle: "From waveform to numbers",
    color: "#a855f7",
    body: "Each window is compressed into a 64-number vector - four time-domain features computed across all 16 channels. These capture activation level (MAV), signal power (RMS), frequency content (ZC), and complexity (WL). Together they form a compact fingerprint of the gesture.",
    tags: ["MAV · RMS · ZC · WL", "64-dimensional vector", "16 channels × 4 features"],
  },
  {
    num: "04",
    icon: <IconBrain />,
    title: "Gesture classification",
    subtitle: "Machine learning",
    color: "#818cf8",
    body: "A Random Forest classifier (500 trees, hyperparameter-tuned via 100-configuration RandomizedSearchCV) maps the 64-feature vector to one of 6 gesture classes. Trained on 16,269 labeled windows from 10 subjects in the public Ninapro DB5 dataset - achieving 84.85% cross-subject accuracy.",
    tags: ["Random Forest · 500 trees", "16,269 training windows", "10 subjects · Ninapro DB5", "84.85% accuracy"],
  },
  {
    num: "05",
    icon: <IconBolt />,
    title: "Output & applications",
    subtitle: "Real-world application",
    color: "#38bdf8",
    body: "Once classified, a gesture can map to any computer action - cursor movement, clicks, or keypresses - in under 50ms end-to-end. This is the layer where signal science meets real-world assistive technology: hands-free control for people who need it, and a platform others can build on.",
    tags: ["< 50ms end-to-end", "6 gesture classes", "Cursor · Click · Keypress", "Open source output layer"],
  },
]

// ─── Three.js Pipeline Canvas ─────────────────────────────────────────────────
const PN = 2600

const CAM_STEPS = [
  new THREE.Vector3(0,    0.0,  5.8),
  new THREE.Vector3(0.5,  0.1,  5.5),
  new THREE.Vector3(1.1,  0.9,  5.2),
  new THREE.Vector3(0,    0.8,  5.6),
  new THREE.Vector3(0,    0.0,  4.8),
]

const ROT_SPEEDS = [0.0003, 0.0007, 0.0040, 0.0030, 0.0012]

function makeEmgWaves(n) {
  const p = new Float32Array(n * 3)
  const CH = 16
  const freqs = [3.2,5.1,7.3,4.2,6.0,8.4,3.7,5.8,4.6,7.1,6.3,9.0,4.1,5.9,7.8,5.2]
  const amps  = [.09,.13,.08,.11,.10,.07,.14,.08,.10,.09,.13,.07,.12,.09,.08,.11]
  const ppch  = Math.floor(n / CH)
  for (let ch = 0; ch < CH; ch++) {
    for (let k = 0; k < ppch; k++) {
      const i = ch * ppch + k
      const t = (k / ppch) * Math.PI * 5
      p[i*3]   = (k / ppch) * 3.6 - 1.8
      p[i*3+1] = (ch - CH/2 + 0.5) * 0.20 + Math.sin(t * freqs[ch]) * amps[ch]
      p[i*3+2] = (Math.random()-0.5) * 0.04
    }
  }
  return p
}

function makeFilterBands(n) {
  const p = new Float32Array(n * 3)
  const CH = 8
  const freqs = [4.8,5.6,3.9,6.2,4.4,5.3,6.7,4.1]
  const amps  = [.10,.08,.11,.07,.10,.09,.08,.10]
  const ppch  = Math.floor(n / CH)
  for (let ch = 0; ch < CH; ch++) {
    for (let k = 0; k < ppch; k++) {
      const i = ch * ppch + k
      const t = (k / ppch) * Math.PI * 5
      p[i*3]   = (k / ppch) * 3.6 - 1.8
      p[i*3+1] = (ch - CH/2 + 0.5) * 0.35 + Math.sin(t * freqs[ch]) * amps[ch]
      p[i*3+2] = (Math.random()-0.5) * 0.03
    }
  }
  return p
}

function makeFeatureMatrix(n) {
  const p = new Float32Array(n * 3)
  const COLS = 16, ROWS = 4
  const vals = Array.from({length: COLS * ROWS}, (_,i) =>
    0.2 + 0.7 * Math.abs(Math.sin(i*1.47) * Math.cos(i*0.93 + 0.5))
  )
  const perCell = Math.ceil(n / (COLS * ROWS))
  let idx = 0
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = vals[r * COLS + c]
      for (let k = 0; k < perCell && idx < n; k++) {
        p[idx*3]   = (c - COLS/2 + 0.5) * 0.24 + (Math.random()-0.5)*0.055
        p[idx*3+1] = (r - ROWS/2 + 0.5) * 0.52 + (Math.random()-0.5)*0.055
        p[idx*3+2] = v * 1.1 - 0.55 + (Math.random()-0.5)*0.05
        idx++
      }
    }
  }
  return p
}

function makeForest(n) {
  const p = new Float32Array(n * 3)
  const branches = []
  function grow(x, y, z, angle, len, depth) {
    if (depth === 0) return
    const x2 = x + Math.cos(angle) * len
    const y2 = y + Math.sin(angle) * len
    branches.push({x1:x,y1:y,z,x2,y2})
    grow(x2,y2,z, angle+0.42+Math.sin(depth*1.4)*0.05, len*0.65, depth-1)
    grow(x2,y2,z, angle-0.42-Math.sin(depth*0.9)*0.05, len*0.65, depth-1)
  }
  grow(-1.1,-1.65, 0.12, Math.PI/2, 0.88, 6)
  grow( 0.0,-1.65,-0.05, Math.PI/2, 0.88, 6)
  grow( 1.1,-1.65, 0.08, Math.PI/2, 0.88, 6)
  const total = branches.reduce((s,b)=>s+Math.hypot(b.x2-b.x1,b.y2-b.y1),0)
  let idx = 0
  for (const b of branches) {
    const cnt = Math.floor((Math.hypot(b.x2-b.x1,b.y2-b.y1)/total)*n*0.92)
    for (let k=0; k<cnt && idx<n; k++) {
      const t = Math.random()
      p[idx*3]   = b.x1+(b.x2-b.x1)*t+(Math.random()-0.5)*0.028
      p[idx*3+1] = b.y1+(b.y2-b.y1)*t+(Math.random()-0.5)*0.028
      p[idx*3+2] = b.z +(Math.random()-0.5)*0.20
      idx++
    }
  }
  while (idx<n) {
    p[idx*3]=(Math.random()-0.5)*3.6; p[idx*3+1]=Math.random()*3.4-1.7; p[idx*3+2]=(Math.random()-0.5)*0.3
    idx++
  }
  return p
}

function makeActionBeam(n) {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    if (i < n * 0.62) {
      const t = Math.pow(Math.random(), 0.6)
      const r = Math.random() * (1.0 - t * 0.85) * 0.9
      const a = Math.random() * Math.PI * 2
      p[i*3]=Math.cos(a)*r; p[i*3+1]=Math.sin(a)*r; p[i*3+2]=t*3.4-1.3
    } else {
      const r=0.6+Math.random()*0.9, th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1)
      p[i*3]=r*Math.sin(ph)*Math.cos(th); p[i*3+1]=r*Math.cos(ph); p[i*3+2]=r*Math.sin(ph)*Math.sin(th)-0.9
    }
  }
  return p
}

function Pipeline3DCanvas({ activeStep }) {
  const mountRef = useRef(null)
  const stageRef = useRef(activeStep)

  useEffect(() => { stageRef.current = activeStep }, [activeStep])

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'
    el.appendChild(renderer.domElement)
    renderer.setSize(el.offsetWidth || window.innerWidth/2, el.offsetHeight || window.innerHeight)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, (el.offsetWidth||window.innerWidth/2)/(el.offsetHeight||window.innerHeight), 0.1, 100)
    camera.position.copy(CAM_STEPS[0])

    const SHAPES = [makeEmgWaves(PN), makeFilterBands(PN), makeFeatureMatrix(PN), makeForest(PN), makeActionBeam(PN)]

    const liveBuf = new Float32Array(SHAPES[0])
    const tgtBuf  = new Float32Array(SHAPES[0])
    let morphing = false, morphFrames = 0, prevStage = 0

    const sizes = new Float32Array(PN)
    for (let i = 0; i < PN; i++) sizes[i] = 0.28 + Math.random() * 1.15

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(liveBuf, 3))
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uSize:  { value: 2.5 * renderer.getPixelRatio() },
        uColor: { value: new THREE.Color(STEPS[0].color) },
      },
      vertexShader: `
        uniform float uSize;
        attribute float aSize;
        void main() {
          vec4 mvp = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * aSize * (280.0 / -mvp.z);
          gl_Position  = projectionMatrix * mvp;
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform vec3 uColor;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float s = pow(1.0 - d * 2.0, 1.5);
          gl_FragColor = vec4(uColor * (s * 1.6), s);
        }
      `,
      transparent: true,
      blending:   THREE.AdditiveBlending,
      depthWrite: false,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    const tgtColor  = new THREE.Color(STEPS[0].color)
    const tgtCamPos = new THREE.Vector3().copy(CAM_STEPS[0])
    let autoRot = 0, rotSpeed = ROT_SPEEDS[0]

    let visible = true
    const obs = new IntersectionObserver(([e])=>{ visible = e.isIntersecting }, { threshold:0 })
    obs.observe(el)

    let raf
    function tick() {
      raf = requestAnimationFrame(tick)
      if (!visible) return

      const ai = stageRef.current

      if (ai !== prevStage) {
        prevStage = ai
        const src = SHAPES[ai]
        for (let i = 0; i < PN*3; i++) tgtBuf[i] = src[i]
        morphing = true; morphFrames = 0
      }

      if (morphing) {
        const pa = geo.attributes.position.array
        for (let i = 0; i < PN*3; i++) pa[i] += (tgtBuf[i] - pa[i]) * 0.055
        geo.attributes.position.needsUpdate = true
        if (++morphFrames > 65) morphing = false
      }

      rotSpeed += (ROT_SPEEDS[ai] - rotSpeed) * 0.04
      autoRot  += rotSpeed
      points.rotation.y = autoRot

      tgtCamPos.copy(CAM_STEPS[ai])
      camera.position.lerp(tgtCamPos, 0.028)
      camera.lookAt(0, 0, 0)

      tgtColor.set(STEPS[ai].color)
      mat.uniforms.uColor.value.lerp(tgtColor, 0.045)

      renderer.render(scene, camera)
    }
    tick()

    function onResize() {
      const w = el.offsetWidth  || window.innerWidth/2
      const h = el.offsetHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)
    requestAnimationFrame(onResize)

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
      window.removeEventListener('resize', onResize)
      geo.dispose(); mat.dispose(); renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />
}

// ─── Sticky Pipeline Section ──────────────────────────────────────────────────
function StickyPipeline() {
  const containerRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    function onScroll() {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrollable = el.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable))
      setActiveStep(Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length)))
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const step = STEPS[activeStep]

  return (
    <div ref={containerRef} style={{ height: `${STEPS.length * 100}vh`, position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        display: "flex", flexDirection: isMobile ? "column" : "row",
        overflow: "hidden",
        borderBottom: "1px solid var(--border)",
      }}>

        {/* ── Left: 3D canvas ── */}
        <div style={{
          flex: isMobile ? "0 0 42vh" : 1,
          position: "relative",
          background: "#03000d",
          borderRight: isMobile ? "none" : "1px solid var(--border)",
          borderBottom: isMobile ? "1px solid var(--border)" : "none",
          height: isMobile ? "42vh" : "100%",
        }}>
          <Pipeline3DCanvas activeStep={activeStep} />

          {/* Progress dots */}
          <div style={{
            position: "absolute", bottom: 28, left: 0, right: 0,
            display: "flex", justifyContent: "center", gap: 7, zIndex: 2,
          }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                height: 6, borderRadius: 3,
                width: i === activeStep ? 22 : 6,
                background: i === activeStep ? s.color : "var(--border)",
                transition: "width 0.35s ease, background 0.35s ease",
              }} />
            ))}
          </div>
        </div>

        {/* ── Right: Step info ── */}
        <div style={{
          flex: 1,
          display: "flex", alignItems: "center",
          padding: isMobile ? "24px 28px" : "0 64px",
          overflow: "hidden",
        }}>
          <div
            key={activeStep}
            style={{ animation: "stepIn 0.38s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            {/* Step badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: step.color + "18",
              border: `1px solid ${step.color}35`,
              borderRadius: 100, padding: "5px 14px",
              marginBottom: 20,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: step.color, display: "inline-block",
              }} />
              <span style={{
                fontSize: 11, fontWeight: 600, color: step.color,
                letterSpacing: "0.07em", textTransform: "uppercase",
              }}>
                Step {step.num} · {step.subtitle}
              </span>
            </div>

            <h2 style={{
              fontSize: "clamp(22px, 2.8vw, 40px)", fontWeight: 600,
              letterSpacing: "-1px", lineHeight: 1.1,
              color: "var(--text)", marginBottom: 18,
            }}>
              {step.title}
            </h2>

            <p style={{
              fontSize: 15, color: "var(--text-secondary)",
              lineHeight: 1.78, fontWeight: 300, marginBottom: 24,
              maxWidth: 460,
            }}>
              {step.body}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {step.tags.map(tag => (
                <span key={tag} style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: 100, padding: "5px 14px",
                  fontSize: 12, color: "var(--text-secondary)", fontWeight: 300,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HowItWorks() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{`
        @keyframes stepIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Navbar />

      {/* ── Hero with NeuralBackground ── */}
      <div style={{
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid var(--border)",
        padding: "120px 32px 80px",
      }}>
        <NeuralNoise color={[0.18, 0.45, 0.90]} opacity={0.85} speed={0.0006} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,0,18,0.65)", zIndex: 1 }} />

        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <p style={{
              fontSize: 13, fontWeight: 500, color: "var(--accent)",
              letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16,
            }}>
              Technical deep dive
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 style={{
              fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 600,
              letterSpacing: "-2px", lineHeight: 1.05, marginBottom: 28,
              color: "#fff", textShadow: "0 2px 28px rgba(0,0,0,0.55)",
            }}>
              How EMG gesture<br />classification works.
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p style={{
              fontSize: 17, color: "rgba(255,255,255,0.72)",
              lineHeight: 1.75, fontWeight: 300, marginBottom: 48,
            }}>
              A walkthrough of the full signal processing pipeline - from raw electrode data
              to gesture classification. Every stage is documented, reproducible, and openly published.
            </p>
          </Reveal>

          {/* Pipeline breadcrumb */}
          <Reveal delay={0.15}>
            <div style={{
              display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6,
              background: "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)",
              borderRadius: "var(--radius-sm)", padding: "14px 20px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              {STEPS.map((s, i) => (
                <div key={s.num} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    fontSize: 13, fontWeight: 500,
                    color: i === STEPS.length - 1 ? "var(--accent)" : "rgba(255,255,255,0.65)",
                  }}>
                    {s.title.split(" ")[0]}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Pipeline spec strip ── */}
      <div style={{ borderBottom:"1px solid var(--border)", background:"var(--bg-secondary)" }}>
        <div style={{ maxWidth:860, margin:"0 auto", display:"flex", overflowX:"auto" }}>
          {[
            ["200 Hz",      "Sampling rate"],
            ["16",          "EMG channels"],
            ["64",          "Features / window"],
            ["200 samples", "Window size"],
            ["84.85%",      "Cross-subject accuracy"],
            ["< 50 ms",     "End-to-end latency"],
          ].map(([val, label], i) => (
            <div key={label} style={{
              padding:"20px 28px", flexShrink:0, textAlign:"center",
              borderRight: i < 5 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{ fontSize:20, fontWeight:700, color:"var(--accent)", letterSpacing:"-0.5px" }}>{val}</div>
              <div style={{ fontSize:10, color:"var(--text-tertiary)", fontWeight:300, textTransform:"uppercase", letterSpacing:"0.06em", marginTop:3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sticky 3D pipeline ── */}
      <StickyPipeline />

      {/* ── Dataset + CTA ── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px 80px" }}>
        <Reveal>
          <div style={{
            background: "var(--accent-soft)", borderRadius: "var(--radius)",
            padding: "28px 32px", border: "1px solid rgba(255,45,120,0.15)",
          }}>
            <div style={{
              fontSize: 12, fontWeight: 500, color: "var(--accent)",
              textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10,
            }}>
              Dataset · Ninapro DB5
            </div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, fontWeight: 300 }}>
              The Ninapro database is a publicly available benchmark for EMG-based gesture recognition research.
              DB5 contains recordings from 10 intact subjects performing 52 hand movements, each repeated 6 times.
              Available at{" "}
              <a href="https://ninapro.hevs.ch" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
                ninapro.hevs.ch
              </a>.
            </p>
          </div>
        </Reveal>

        {/* Quick reference */}
        <Reveal delay={0.05}>
          <div style={{ marginTop:32, background:"var(--bg-secondary)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"28px 32px" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"var(--text-tertiary)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:20 }}>Pipeline quick reference</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:"14px 24px" }}>
              {[
                ["Sampling rate",   "200 Hz"],
                ["Channels",        "16 differential"],
                ["Bandpass filter", "Butterworth 20–90 Hz, 4th order"],
                ["Window size",     "200 samples (1000 ms)"],
                ["Window step",     "50 samples (250 ms), 75% overlap"],
                ["Features",        "MAV · RMS · ZC · WL × 16 ch"],
                ["Classifier",      "Random Forest · 500 trees"],
                ["Training set",    "16,269 windows · 10 subjects"],
                ["Accuracy",        "84.85% cross-subject (LOSO)"],
                ["Latency",         "< 50 ms end-to-end"],
              ].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize:10, color:"var(--text-tertiary)", fontWeight:300, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{label}</div>
                  <div style={{ fontSize:13, color:"var(--text)", fontWeight:500 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap:"wrap" }}>
            <button onClick={() => navigate("/demos")} style={{
              background: "var(--accent)", color: "#fff", border: "none",
              borderRadius: 100, padding: "13px 32px", fontSize: 15,
              fontWeight: 500, cursor: "pointer", fontFamily: "var(--font)",
              boxShadow: "0 4px 24px rgba(255,45,120,0.3)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow="0 8px 28px rgba(255,45,120,0.4)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 24px rgba(255,45,120,0.3)"}}
            >
              Try the interactive tools
            </button>
            <button onClick={() => navigate("/research")} style={{
              background: "transparent", color: "var(--text)", fontFamily: "var(--font)",
              border: "1px solid var(--border)", borderRadius: 100,
              padding: "13px 28px", fontSize: 15, cursor: "pointer",
              transition: "border-color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              Read the research
            </button>
            <button onClick={() => navigate("/education")} style={{
              background: "transparent", color: "var(--text-secondary)", fontFamily: "var(--font)",
              border: "1px solid var(--border)", borderRadius: 100,
              padding: "13px 28px", fontSize: 15, cursor: "pointer",
              transition: "border-color 0.15s, color 0.15s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text-secondary)"}}
            >
              Read the articles
            </button>
          </div>
        </Reveal>
      </div>

      <Footer />
    </div>
  )
}
