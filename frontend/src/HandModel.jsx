import { useRef, useEffect, useState } from "react"
import * as THREE from "three"

const PRIMARY_FINGER = {
  "index flex": 0, "middle flex": 1, "ring flex": 2,
  "pinky flex": 3, "thumb flex": 4, "fist": -1,
}

export default function HandModel({ gestureName, fingerCurls, skinColor = "#f5dce4" }) {
  const mountRef = useRef(null)
  const stateRef = useRef(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    const w = el.clientWidth, h = el.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100)
    camera.position.set(0, 0.15, 2.0)
    camera.lookAt(0, 0.05, 0)

    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    const key = new THREE.DirectionalLight(0xff8fb0, 0.8)
    key.position.set(2, 4, 3)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffeef4, 0.5)
    fill.position.set(-3, 1, 2)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xffffff, 0.25)
    rim.position.set(0, -2, -3)
    scene.add(rim)

    const skinMat = new THREE.MeshPhongMaterial({ color: 0xf5dce4, shininess: 35, specular: 0xffaabb })
    const knuckleMat = new THREE.MeshPhongMaterial({ color: 0xeeccd8, shininess: 70, specular: 0xff88aa })
    const nailMat = new THREE.MeshPhongMaterial({ color: 0xffccd8, shininess: 180, specular: 0xffffff })

    const handGroup = new THREE.Group()
    scene.add(handGroup)

    function makePalm() {
      const g = new THREE.BufferGeometry()
      const wW = 0.30, fW = 0.40, palmH = 0.26, d = 0.095
      const wZ = d * 0.38, fZ = d * 0.5
      const archY = 0.012
      const v = new Float32Array([
        -wW/2, 0,    -wZ,
         wW/2, 0,    -wZ,
         wW/2, 0,     wZ,
        -wW/2, 0,     wZ,
        -fW/2, palmH,        -fZ,
        -fW/6, palmH+archY,  -fZ*0.8,
         fW/6, palmH+archY,  -fZ*0.8,
         fW/2, palmH,        -fZ,
        -fW/2, palmH,         fZ,
        -fW/6, palmH+archY,   fZ*0.8,
         fW/6, palmH+archY,   fZ*0.8,
         fW/2, palmH,         fZ,
      ])
      const idx = [
        0,2,1, 0,3,2,
        4,5,8, 8,5,9,
        5,6,9, 9,6,10,
        6,7,10, 10,7,11,
        0,4,1, 1,4,5, 1,5,6, 1,6,7,
        3,2,8, 2,11,8, 2,10,11, 2,9,10,
        0,3,4, 3,8,4,
        1,7,2, 2,7,11,
      ]
      g.setAttribute('position', new THREE.BufferAttribute(v, 3))
      g.setIndex(idx)
      g.computeVertexNormals()
      return g
    }

    const palm = new THREE.Mesh(makePalm(), skinMat)
    palm.position.y = -0.15
    handGroup.add(palm)

    // NO palmEdge cylinders — those were the rogue piece

    function seg(len, rTop, rBot, segs = 12) {
      const g = new THREE.CylinderGeometry(rTop, rBot, len, segs)
      g.translate(0, len / 2, 0)
      return g
    }

    function buildFinger(parent, bx, by, defs) {
      const pivots = []
      let cur = parent
      defs.forEach(([len, rTop, rBot], i) => {
        const pivot = new THREE.Group()
        if (i === 0) pivot.position.set(bx, by, 0)
        else pivot.position.y = defs[i-1][0]
        cur.add(pivot); cur = pivot; pivots.push(pivot)

        pivot.add(new THREE.Mesh(seg(len, rTop, rBot), skinMat))

        const kg = new THREE.SphereGeometry(rBot * 1.05, 10, 8)
        kg.scale(1.05, 0.82, 1)
        pivot.add(new THREE.Mesh(kg, knuckleMat))

        if (i === defs.length - 1) {
          const ng = new THREE.BoxGeometry(rTop * 1.3, len * 0.32, rTop * 0.38)
          ng.translate(0, len * 0.70, -rTop * 0.50)
          pivot.add(new THREE.Mesh(ng, nailMat))
          const cap = new THREE.SphereGeometry(rTop * 0.95, 10, 8)
          cap.scale(1, 0.9, 0.95)
          cap.translate(0, len, 0)
          pivot.add(new THREE.Mesh(cap, skinMat))
        }
      })
      return pivots
    }

    const fingerDefs = [
      { x:  0.170, y: 0.108, d: [[0.185, 0.036, 0.043], [0.142, 0.030, 0.036], [0.108, 0.023, 0.030]] },
      { x:  0.057, y: 0.118, d: [[0.205, 0.038, 0.046], [0.158, 0.032, 0.038], [0.120, 0.024, 0.032]] },
      { x: -0.057, y: 0.112, d: [[0.192, 0.036, 0.044], [0.148, 0.030, 0.036], [0.115, 0.023, 0.030]] },
      { x: -0.165, y: 0.088, d: [[0.158, 0.030, 0.037], [0.118, 0.025, 0.030], [0.090, 0.019, 0.025]] },
    ]
    const fingerPivots = fingerDefs.map(f => buildFinger(handGroup, f.x, f.y, f.d))

    fingerDefs.forEach(f => {
      const kg = new THREE.SphereGeometry(0.025, 10, 8)
      kg.scale(1.1, 0.65, 0.9)
      const km = new THREE.Mesh(kg, knuckleMat)
      km.position.set(f.x * 0.90, f.y - 0.005, 0.025)
      handGroup.add(km)
    })

    const thumbGroup = new THREE.Group()
    thumbGroup.position.set(0.238, -0.065, 0.010)
    thumbGroup.rotation.z = -Math.PI * 0.18
    thumbGroup.rotation.y =  Math.PI * 0.12
    thumbGroup.rotation.x = -Math.PI * 0.04
    handGroup.add(thumbGroup)

    const moundGeo = new THREE.SphereGeometry(0.062, 12, 10)
    moundGeo.scale(1.1, 0.85, 0.90)
    thumbGroup.add(new THREE.Mesh(moundGeo, skinMat))

    const thumbPivots = []
    const thumbSegs = [[0.170, 0.044, 0.055], [0.138, 0.035, 0.044]]
    thumbSegs.forEach(([len, rTop, rBot], i) => {
      const pivot = new THREE.Group()
      if (i === 0) pivot.position.y = 0.042
      else pivot.position.y = thumbSegs[i-1][0]
      ;(i === 0 ? thumbGroup : thumbPivots[0]).add(pivot)
      thumbPivots.push(pivot)

      pivot.add(new THREE.Mesh(seg(len, rTop, rBot), skinMat))
      const kg = new THREE.SphereGeometry(rBot * 1.05, 10, 8)
      kg.scale(1.05, 0.82, 1)
      pivot.add(new THREE.Mesh(kg, knuckleMat))

      if (i === thumbSegs.length - 1) {
        const ng = new THREE.BoxGeometry(rTop * 1.3, len * 0.32, rTop * 0.38)
        ng.translate(0, len * 0.70, -rTop * 0.50)
        pivot.add(new THREE.Mesh(ng, nailMat))
        const cap = new THREE.SphereGeometry(rTop * 0.95, 10, 8)
        cap.scale(1, 0.9, 0.95)
        cap.translate(0, len, 0)
        pivot.add(new THREE.Mesh(cap, skinMat))
      }
    })

    stateRef.current = {
      renderer, scene, camera, handGroup,
      fingerPivots, thumbPivots,
      current: [0, 0, 0, 0, 0],
      target: [0, 0, 0, 0, 0],
      autoRotate: true,
      rotSpeed: 0.0018,
      targetRotSpeed: 0.0018,
      rotY: 0, rotX: 0,
      isDragging: false, prevX: 0, prevY: 0,
      raf: null,
      skinMat
    }

    const s = stateRef.current
    el.addEventListener('mousedown', e => { s.isDragging = true; s.prevX = e.clientX; s.prevY = e.clientY })
    window.addEventListener('mousemove', e => {
      if (!s.isDragging) return
      s.rotY += (e.clientX - s.prevX) * 0.012
      s.rotX += (e.clientY - s.prevY) * 0.006
      s.rotX = Math.max(-0.7, Math.min(0.7, s.rotX))
      s.prevX = e.clientX; s.prevY = e.clientY
    })
    window.addEventListener('mouseup', () => { s.isDragging = false })

    const MAX = Math.PI * 0.80

    function animate() {
      const s = stateRef.current
      s.raf = requestAnimationFrame(animate)
      s.current = s.current.map((c, i) => c + (s.target[i] - c) * 0.09)

      s.fingerPivots.forEach((pivots, fi) => {
        const curl = s.current[fi] * MAX
        pivots.forEach((pivot, si) => {
          pivot.rotation.x = curl * (0.28 + si * 0.44)
        })
      })

      const tc = s.current[4] * MAX * 0.75
      if (s.thumbPivots[0]) s.thumbPivots[0].rotation.x = tc * 0.38
      if (s.thumbPivots[1]) s.thumbPivots[1].rotation.x = tc * 0.68

      s.targetRotSpeed = s.autoRotate && !s.isDragging ? 0.0018 : 0
      s.rotSpeed += (s.targetRotSpeed - s.rotSpeed) * 0.05
      s.rotY += s.rotSpeed
      s.handGroup.rotation.y = s.rotY
      s.handGroup.rotation.x = s.rotX

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(stateRef.current?.raf)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    if (!stateRef.current) return
    const primary = PRIMARY_FINGER[gestureName] ?? -1
    const curls = fingerCurls ?? [0.5, 0.5, 0.5, 0.5, 0.5]
    const maxC = Math.max(...curls, 0.001)
    const norm = curls.map(c => c / maxC)
    stateRef.current.target = norm.map((n, i) => {
      if (primary === -1) return Math.min(1, n * 1.05)
      if (i === primary) return Math.min(1, 0.55 + n * 0.45)
      return Math.min(0.42, n * 0.46)
    })
  }, [gestureName, fingerCurls])

  useEffect(() => {
    if (stateRef.current) stateRef.current.autoRotate = autoRotate
  }, [autoRotate])

  useEffect(() => {
  if (!stateRef.current) return
  stateRef.current.skinMat.color.set(skinColor)
}, [skinColor])

  function handleToggle() {
    setSpinning(true)
    setAutoRotate(r => !r)
    setTimeout(() => setSpinning(false), 600)
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <style>{`
        @keyframes spinOnce {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />
      <button
        onClick={handleToggle}
        style={{
          position: "absolute", bottom: 10, right: 10,
          background: autoRotate ? "#e8f5e9" : "#fce4ec",
          border: `1px solid ${autoRotate ? "#2e7d32" : "#c62828"}`,
          color: autoRotate ? "#1b5e20" : "#b71c1c",
          borderRadius: 100,
          padding: "4px 12px",
          fontFamily: "var(--font)", fontSize: 11, fontWeight: 500,
          cursor: "pointer",
          transition: "background 0.25s ease, border-color 0.25s ease, color 0.25s ease, padding 0.2s ease, transform 0.2s ease",
          transform: spinning ? "scale(0.94)" : "scale(1)",
          display: "flex", alignItems: "center", gap: 5,
          whiteSpace: "nowrap"
        }}
      >
        <span style={{
          display: "inline-block",
          animation: spinning ? "spinOnce 0.5s ease-in-out" : "none",
        }}>⟳</span>
        {autoRotate ? "Rotating" : "Paused"}
      </button>
    </div>
  )
}