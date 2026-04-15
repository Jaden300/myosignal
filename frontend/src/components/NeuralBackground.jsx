import { useEffect, useRef } from "react"

export default function NeuralBackground({
  color = "#FF2D78",
  trailOpacity = 0.12,
  particleCount = 500,
  speed = 0.8,
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = container.clientWidth
    let height = container.clientHeight
    let particles = []
    let animationFrameId
    const mouse = { x: -1000, y: -1000 }

    class Particle {
      constructor(init = false) {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = 0
        this.vy = 0
        this.age = init ? Math.random() * 300 : 0
        this.life = Math.random() * 200 + 100
      }
      reset() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = 0
        this.vy = 0
        this.age = 0
        this.life = Math.random() * 200 + 100
      }
      update() {
        const angle = (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI
        this.vx += Math.cos(angle) * 0.2 * speed
        this.vy += Math.sin(angle) * 0.2 * speed
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const force = (150 - dist) / 150
          this.vx -= dx * force * 0.05
          this.vy -= dy * force * 0.05
        }
        this.x += this.vx
        this.y += this.vy
        this.vx *= 0.95
        this.vy *= 0.95
        this.age++
        if (this.age > this.life) this.reset()
        if (this.x < 0) this.x = width
        if (this.x > width) this.x = 0
        if (this.y < 0) this.y = height
        if (this.y > height) this.y = 0
      }
      draw() {
        const alpha = Math.max(0, 1 - Math.abs((this.age / this.life) - 0.5) * 2)
        ctx.globalAlpha = alpha
        ctx.fillStyle = color
        ctx.fillRect(this.x, this.y, 1.5, 1.5)
      }
    }

    const init = () => {
      const dpr = window.devicePixelRatio || 1
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      canvas.style.width = width + "px"
      canvas.style.height = height + "px"
      particles = Array.from({ length: particleCount }, (_, i) => new Particle(i < particleCount * 0.5))
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      ctx.globalAlpha = 1
      ctx.fillStyle = `rgba(0,0,0,${trailOpacity})`
      ctx.fillRect(0, 0, width, height)
      particles.forEach(p => { p.update(); p.draw() })
      ctx.globalAlpha = 1
    }

    const handleResize = () => init()
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000 }

    init()
    animate()
    window.addEventListener("resize", handleResize)
    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [color, trailOpacity, particleCount, speed])

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#000" }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  )
}
