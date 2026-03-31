import { useRef, useEffect } from "react"

// Pre-generate a full EMG signal buffer once
function generateSignal(length) {
  const buf = new Float32Array(length)
  let t = 0
  let burstEnergy = 0
  let burstPhase = 0
  let burstFreq = 0.22
  let nextBurst = 40 + Math.random() * 60

  for (let i = 0; i < length; i++) {
    t++
    if (t >= nextBurst && burstEnergy < 0.05) {
      burstEnergy = 0.65 + Math.random() * 0.35
      burstFreq = 0.18 + Math.random() * 0.22
      nextBurst = t + 55 + Math.random() * 80
      burstPhase = 0
    }
    burstPhase += burstFreq
    const burst = burstEnergy * Math.sin(burstPhase) *
      (1 + 0.35 * Math.sin(burstPhase * 0.5 + 1.2))
    burstEnergy *= 0.975
    if (burstEnergy < 0.008) burstEnergy = 0
    buf[i] = burst + (Math.random() - 0.5) * 0.055
  }
  return buf
}

const SIGNAL = generateSignal(600)

export default function EMGPulseCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const section = canvas.parentElement

    let W = 0, H = 0
    const dpr = window.devicePixelRatio || 1

    function resize() {
      W = section.offsetWidth
      H = section.offsetHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = W + "px"
      canvas.style.height = H + "px"
      ctx.scale(dpr, dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(section)

    // progress: 0 = section top at bottom of viewport, 1 = section top at 15% from top
    function getScrollProgress() {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh
      const end = vh * 0.15
      const pos = rect.top
      return Math.max(0, Math.min(1, (start - pos) / (start - end)))
    }

    // Mouse / sparks
    let hovered = false
    let mouseX = 0, mouseY = 0
    const particles = []

    function spawnSparks(x, y, count = 2) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.6 + Math.random() * 2.5
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4,
          life: 0.9 + Math.random() * 0.1,
          decay: 0.02 + Math.random() * 0.022,
          size: 0.8 + Math.random() * 2,
          isLine: Math.random() > 0.45,
          lineAngle: Math.random() * Math.PI,
          blue: Math.random() > 0.72,
        })
      }
    }

    function onEnter() { hovered = true }
    function onLeave() { hovered = false }
    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    section.addEventListener("mouseenter", onEnter)
    section.addEventListener("mouseleave", onLeave)
    section.addEventListener("mousemove", onMove)

    let raf
    let frame = 0

    function draw() {
      raf = requestAnimationFrame(draw)
      frame++

      ctx.clearRect(0, 0, W, H)

      const progress = getScrollProgress()
      if (progress <= 0) return

      const midY = H * 0.5
      const amp = H * 0.26
      const totalPoints = SIGNAL.length
      const visibleCount = Math.floor(progress * totalPoints)
      if (visibleCount < 2) return

      const stepX = W / totalPoints

      // Faint grid lines (only up to visible width)
      ctx.save()
      ctx.strokeStyle = "rgba(255, 45, 120, 0.055)"
      ctx.lineWidth = 1
      for (let i = 1; i < 5; i++) {
        const y = H * (i / 5)
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(visibleCount * stepX, y); ctx.stroke()
      }
      ctx.restore()

      // Glow layer
      ctx.save()
      ctx.strokeStyle = "rgba(255, 45, 120, 0.2)"
      ctx.lineWidth = 5
      ctx.lineJoin = "round"
      ctx.beginPath()
      for (let i = 0; i < visibleCount; i++) {
        const x = i * stepX
        const y = midY - SIGNAL[i] * amp
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.restore()

      // Main line with left-edge fade
      const fadeGrad = ctx.createLinearGradient(0, 0, visibleCount * stepX, 0)
      fadeGrad.addColorStop(0, "rgba(255, 45, 120, 0)")
      fadeGrad.addColorStop(0.08, "rgba(255, 45, 120, 0.75)")
      fadeGrad.addColorStop(1, "rgba(255, 45, 120, 0.88)")

      ctx.save()
      ctx.strokeStyle = fadeGrad
      ctx.lineWidth = 1.6
      ctx.lineJoin = "round"
      ctx.shadowBlur = 6
      ctx.shadowColor = "rgba(255, 45, 120, 0.5)"
      ctx.beginPath()
      for (let i = 0; i < visibleCount; i++) {
        const x = i * stepX
        const y = midY - SIGNAL[i] * amp
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.restore()

      // Bright dot at the leading edge
      const edgeX = (visibleCount - 1) * stepX
      const edgeY = midY - SIGNAL[visibleCount - 1] * amp
      ctx.save()
      ctx.fillStyle = "#FF2D78"
      ctx.shadowBlur = 14
      ctx.shadowColor = "#FF2D78"
      ctx.beginPath()
      ctx.arc(edgeX, edgeY, 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Cursor glow + sparks
      if (hovered) {
        const grd = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 90)
        grd.addColorStop(0, "rgba(255, 45, 120, 0.13)")
        grd.addColorStop(0.5, "rgba(255, 45, 120, 0.05)")
        grd.addColorStop(1, "rgba(255, 45, 120, 0)")
        ctx.save()
        ctx.fillStyle = grd
        ctx.beginPath(); ctx.arc(mouseX, mouseY, 90, 0, Math.PI * 2); ctx.fill()
        ctx.restore()

        if (frame % 4 === 0) {
          spawnSparks(
            mouseX + (Math.random() - 0.5) * 24,
            mouseY + (Math.random() - 0.5) * 24, 2
          )
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy
        p.vy += 0.038; p.vx *= 0.98
        p.life -= p.decay
        if (p.life <= 0) { particles.splice(i, 1); continue }

        const color = p.blue ? "#3B82F6" : "#FF2D78"
        ctx.save()
        ctx.globalAlpha = p.life * 0.95
        ctx.shadowBlur = 10
        ctx.shadowColor = color

        if (p.isLine) {
          const len = (p.size * 3.5 + 2) * p.life
          ctx.strokeStyle = color
          ctx.lineWidth = Math.max(0.5, p.size * 0.6)
          ctx.lineCap = "round"
          ctx.beginPath()
          ctx.moveTo(p.x - Math.cos(p.lineAngle) * len, p.y - Math.sin(p.lineAngle) * len)
          ctx.lineTo(p.x + Math.cos(p.lineAngle) * len, p.y + Math.sin(p.lineAngle) * len)
          ctx.stroke()
        } else {
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(p.x, p.y, Math.max(0.4, p.size * p.life), 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      section.removeEventListener("mouseenter", onEnter)
      section.removeEventListener("mouseleave", onLeave)
      section.removeEventListener("mousemove", onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  )
}