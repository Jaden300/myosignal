import { useRef, useEffect } from "react"
import * as THREE from "three"

export default function HeroSphere({ scrollY }) {
  const mountRef = useRef(null)
  const stateRef = useRef(null)

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
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.set(0, 0, 4.5)

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const pink = new THREE.PointLight(0xff2d78, 2.5, 10)
    pink.position.set(2, 2, 3)
    scene.add(pink)
    const blue = new THREE.PointLight(0x3b82f6, 1.5, 10)
    blue.position.set(-3, -1, 2)
    scene.add(blue)

    const group = new THREE.Group()
    scene.add(group)

    // Generate nodes on a sphere surface
    const NODE_COUNT = 120
    const RADIUS = 1.55
    const positions = []

    for (let i = 0; i < NODE_COUNT; i++) {
      // Fibonacci sphere distribution  -  even spacing
      const phi = Math.acos(1 - 2 * (i + 0.5) / NODE_COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const x = RADIUS * Math.sin(phi) * Math.cos(theta)
      const y = RADIUS * Math.sin(phi) * Math.sin(theta)
      const z = RADIUS * Math.cos(phi)
      positions.push(new THREE.Vector3(x, y, z))
    }

    // Node spheres
    const nodeMat = new THREE.MeshPhongMaterial({
      color: 0xff2d78, shininess: 120, specular: 0xffffff, transparent: true, opacity: 0.85
    })
    const nodeGeo = new THREE.SphereGeometry(0.030, 8, 8)
    positions.forEach(pos => {
      const node = new THREE.Mesh(nodeGeo, nodeMat.clone())
      node.position.copy(pos)
      // Vary sizes slightly
      const s = 0.7 + Math.random() * 0.7
      node.scale.setScalar(s)
      node.material.opacity = 0.5 + Math.random() * 0.5
      group.add(node)
    })

    // Edges between nearby nodes
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xff2d78, transparent: true, opacity: 0.12
    })
    const MAX_EDGE_DIST = 0.72
    const edgeGeo = new THREE.BufferGeometry()
    const edgeVerts = []
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i].distanceTo(positions[j]) < MAX_EDGE_DIST) {
          edgeVerts.push(positions[i].x, positions[i].y, positions[i].z)
          edgeVerts.push(positions[j].x, positions[j].y, positions[j].z)
        }
      }
    }
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgeVerts, 3))
    group.add(new THREE.LineSegments(edgeGeo, edgeMat))

    // Inner glowing core sphere
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0xff2d78, transparent: true, opacity: 0.06,
      shininess: 200, specular: 0xffffff, side: THREE.FrontSide
    })
    group.add(new THREE.Mesh(new THREE.SphereGeometry(RADIUS * 0.98, 32, 32), coreMat))

    // Outer wire shell
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.01, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xff2d78, wireframe: true, transparent: true, opacity: 0.04 })
    ))

    // Pulsing ring equator
    const ringGeo = new THREE.TorusGeometry(RADIUS, 0.008, 6, 80)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff2d78, transparent: true, opacity: 0.3 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    group.add(ring)

    stateRef.current = { renderer, scene, camera, group, ring, scrollY: 0, raf: null }

    let t = 0
    function animate() {
      const s = stateRef.current
      s.raf = requestAnimationFrame(animate)
      t += 0.006

      // Base rotation
      s.group.rotation.y = t * 0.4
      s.group.rotation.x = Math.sin(t * 0.2) * 0.15

      // Scroll tilt  -  deeper scroll = more tilt + scale down
      const scrollFactor = s.scrollY / 600
      s.group.rotation.z = scrollFactor * 0.6
      s.group.rotation.x += scrollFactor * 0.4
      const scale = Math.max(0.6, 1 - scrollFactor * 0.25)
      s.group.scale.setScalar(scale)

      // Pulsing ring opacity
      s.ring.material.opacity = 0.2 + Math.sin(t * 2) * 0.12

      // Pink light orbit
      pink.position.set(
        Math.sin(t * 0.5) * 3,
        Math.cos(t * 0.3) * 2,
        3
      )

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
    if (stateRef.current) stateRef.current.scrollY = scrollY
  }, [scrollY])

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
}