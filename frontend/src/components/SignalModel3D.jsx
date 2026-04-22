import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const N = 3500 // particle count

// ─── Stage metadata ────────────────────────────────────────────────────────────
const STAGES = [
  {
    sub:   'Step 01 · Hardware',
    title: 'Signal capture.',
    desc:  'Surface EMG electrodes pick up electrical activity across 16 channels at 200 Hz - raw bioelectric data, straight from your forearm.',
    hex:   '#FF2D78',
  },
  {
    sub:   'Step 02 · Signal processing',
    title: 'Filtering & windowing.',
    desc:  'A 4th-order Butterworth bandpass filter (20–90 Hz) strips powerline hum and motion artifacts, leaving only biologically meaningful signal.',
    hex:   '#d946ef',
  },
  {
    sub:   'Step 03 · Analysis',
    title: 'Feature extraction.',
    desc:  "Four time-domain features across 16 channels compress each window into a 64-number fingerprint - the gesture's mathematical DNA.",
    hex:   '#7c3aed',
  },
  {
    sub:   'Step 04 · Machine learning',
    title: 'Gesture classification.',
    desc:  'A Random Forest of 500 trees maps the 64-feature vector to one of 6 gestures. 84.85% accuracy across unseen subjects.',
    hex:   '#3b82f6',
  },
  {
    sub:   'Step 05 · Output',
    title: 'Assistive action.',
    desc:  'Under 50ms end-to-end. Cursor, click, keypress - direct system-level control via CoreGraphics. No accessibility overlays.',
    hex:   '#06b6d4',
  },
]

// ─── Shape generators ──────────────────────────────────────────────────────────
function sphere(n, R = 2.0) {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    const r     = R * (0.88 + Math.random() * 0.24)
    p[i*3]   = r * Math.sin(phi) * Math.cos(theta)
    p[i*3+1] = r * Math.cos(phi)
    p[i*3+2] = r * Math.sin(phi) * Math.sin(theta)
  }
  return p
}

function waveSphere(n, R = 2.0) {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    const wave  = 0.42 * Math.sin(5 * phi) * Math.cos(4 * theta)
              + 0.18 * Math.sin(10 * phi) * Math.sin(6 * theta)
    const r     = R + wave
    p[i*3]   = r * Math.sin(phi) * Math.cos(theta)
    p[i*3+1] = r * Math.cos(phi)
    p[i*3+2] = r * Math.sin(phi) * Math.sin(theta)
  }
  return p
}

function helix(n) {
  const p = new Float32Array(n * 3)
  const turns = 3.5, hR = 0.95, height = 3.8
  for (let i = 0; i < n; i++) {
    const strand = (i % 2) * Math.PI
    const t      = (i / n) * turns * Math.PI * 2
    const y      = (i / n) * height - height / 2
    const r      = hR + (Math.random() - 0.5) * 0.18
    p[i*3]   = r * Math.cos(t + strand) + (Math.random() - 0.5) * 0.14
    p[i*3+1] = y  + (Math.random() - 0.5) * 0.10
    p[i*3+2] = r * Math.sin(t + strand) + (Math.random() - 0.5) * 0.14
  }
  return p
}

function torus(n, R = 1.65, r = 0.58) {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const u = Math.random() * Math.PI * 2
    const v = Math.random() * Math.PI * 2
    const s = (Math.random() - 0.5) * 0.12
    p[i*3]   = (R + (r + s) * Math.cos(v)) * Math.cos(u)
    p[i*3+1] = (r + s) * Math.sin(v)
    p[i*3+2] = (R + (r + s) * Math.cos(v)) * Math.sin(u)
  }
  return p
}

function galaxy(n) {
  const p = new Float32Array(n * 3)
  const arms = 3, spin = 1.6
  for (let i = 0; i < n; i++) {
    const arm    = i % arms
    const t      = Math.random()
    const radius = t * 2.3 + 0.1
    const angle  = (arm / arms) * Math.PI * 2 + radius * spin
    const spread = (1 - t) * 0.08 + t * 0.52
    p[i*3]   = Math.cos(angle) * radius + (Math.random() ** 3) * (Math.random() < 0.5 ? 1 : -1) * spread
    p[i*3+1] =                           (Math.random() ** 3) * (Math.random() < 0.5 ? 1 : -1) * 0.22
    p[i*3+2] = Math.sin(angle) * radius + (Math.random() ** 3) * (Math.random() < 0.5 ? 1 : -1) * spread
  }
  return p
}

// ─── Camera resting positions per stage ───────────────────────────────────────
const CAM = [
  new THREE.Vector3( 0.0,  0.0, 5.0),
  new THREE.Vector3( 0.9,  0.5, 4.6),
  new THREE.Vector3( 0.0,  0.6, 5.4),
  new THREE.Vector3(-0.7, -0.4, 4.8),
  new THREE.Vector3( 0.0,  1.6, 6.8),
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function SignalModel3D() {
  const sectionRef = useRef(null)
  const mountRef   = useRef(null)
  const stageRef   = useRef(0)
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    const el  = mountRef.current
    const sec = sectionRef.current
    if (!el || !sec) return

    // ── Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(el.offsetWidth, el.offsetHeight)
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // ── Scene / camera
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(58, el.offsetWidth / el.offsetHeight, 0.1, 100)
    camera.position.copy(CAM[0])

    // ── Pre-bake all shape arrays
    const SHAPES = [sphere(N), waveSphere(N), helix(N), torus(N), galaxy(N)]

    // ── Live position buffer (lerped each frame)
    const liveBuf  = new Float32Array(SHAPES[0])
    const tgtBuf   = new Float32Array(SHAPES[0])
    let morphing   = false
    let morphFrames = 0

    // ── Per-particle random size
    const sizes = new Float32Array(N)
    for (let i = 0; i < N; i++) sizes[i] = 0.35 + Math.random() * 1.5

    // ── Geometry + shader material
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(liveBuf, 3))
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uSize:    { value: 2.6 * renderer.getPixelRatio() },
        uColor:   { value: new THREE.Color(STAGES[0].hex) },
        uOpacity: { value: 1.0 },
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
        uniform vec3  uColor;
        uniform float uOpacity;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float s = pow(1.0 - d * 2.0, 1.6);
          gl_FragColor = vec4(uColor * (s * 1.4), s * uOpacity);
        }
      `,
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // ── Scroll → stage
    function onScroll() {
      const rect       = sec.getBoundingClientRect()
      const scrollable = sec.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable))
      const stage    = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length))
      if (stage !== stageRef.current) {
        stageRef.current = stage
        setActiveStage(stage)
        const src = SHAPES[stage]
        for (let i = 0; i < N * 3; i++) tgtBuf[i] = src[i]
        morphing = true
        morphFrames = 0
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // ── Resize
    function onResize() {
      camera.aspect = el.offsetWidth / el.offsetHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.offsetWidth, el.offsetHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Pause when off-screen
    let visible = false
    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting },
      { threshold: 0 }
    )
    observer.observe(sec)

    // ── Animation loop
    let raf, autoRot = 0
    const targetColor = new THREE.Color(STAGES[0].hex)

    function tick() {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      autoRot += 0.0028

      // Morph particles - only update while converging (max ~60 frames)
      if (morphing) {
        const pa = geo.attributes.position.array
        const len = N * 3
        for (let i = 0; i < len; i++) pa[i] += (tgtBuf[i] - pa[i]) * 0.06
        geo.attributes.position.needsUpdate = true
        if (++morphFrames > 60) morphing = false
      }

      // Camera drift
      camera.position.lerp(CAM[stageRef.current], 0.028)
      camera.lookAt(0, 0, 0)

      // Model rotation (base + per-stage lean)
      points.rotation.y = autoRot + stageRef.current * 0.55

      // Color lerp
      targetColor.set(STAGES[stageRef.current].hex)
      mat.uniforms.uColor.value.lerp(targetColor, 0.03)

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  const s = STAGES[activeStage]

  return (
    <>
      <style>{`
        @keyframes modelIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        ref={sectionRef}
        style={{ height: `${STAGES.length * 100}vh`, position: 'relative', background: '#000' }}
      >
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          {/* Three.js canvas mount */}
          <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

          {/* Stage text */}
          <div style={{
            position: 'absolute', bottom: 96, left: 0, right: 0,
            display: 'flex', justifyContent: 'center',
            zIndex: 10, pointerEvents: 'none',
            padding: '0 32px',
          }}>
            <div key={activeStage} style={{ textAlign: 'center', animation: 'modelIn 0.45s cubic-bezier(0.22,1,0.36,1) both' }}>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: s.hex, marginBottom: 12,
              }}>
                {s.sub}
              </div>
              <h2 style={{
                fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 700,
                letterSpacing: '-2px', lineHeight: 1.05,
                color: '#fff', marginBottom: 16,
                textShadow: `0 0 60px ${s.hex}55`,
              }}>
                {s.title}
              </h2>
              <p style={{
                fontSize: 15, color: 'rgba(255,255,255,0.58)',
                fontWeight: 300, lineHeight: 1.75,
                maxWidth: 480, margin: '0 auto',
              }}>
                {s.desc}
              </p>
            </div>
          </div>

          {/* Progress pips */}
          <div style={{
            position: 'absolute', bottom: 36, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 8, zIndex: 10,
          }}>
            {STAGES.map((st, i) => (
              <div key={i} style={{
                height: 3, borderRadius: 2,
                width: i === activeStage ? 28 : 4,
                background: i === activeStage ? st.hex : 'rgba(255,255,255,0.18)',
                transition: 'width 0.4s ease, background 0.4s ease',
              }} />
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
