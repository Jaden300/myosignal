import { useEffect, useRef, useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { IconBolt, IconBrain, IconCode, IconChart } from "./Icons"
import { useNavigate } from "react-router-dom"
import { Reveal, StaggerList, HoverCard, SectionPill } from "./Animate"
import LineWaves from "./components/LineWaves"

const REASONS = [
  {
    Icon: IconBolt,
    title: "Real impact, real users",
    body: "myojam isn't a toy project. It's assistive technology people actually use. Your work directly affects how people with motor impairments interact with computers.",
    color: [255, 45, 120],
    rotY: 0,
    speedMult: 1.0,
    label: "Impact",
  },
  {
    Icon: IconBrain,
    title: "Cutting-edge research stack",
    body: "Work at the intersection of biosignal processing, machine learning, and human-computer interaction. Ninapro datasets, Random Forest classifiers, real-time EMG pipelines.",
    color: [139, 92, 246],
    rotY: 1.1,
    speedMult: 0.55,
    label: "Research",
  },
  {
    Icon: IconCode,
    title: "Fully open source",
    body: "Everything we build is public. Your contributions are visible to the world  -  a portfolio piece that speaks for itself on any application.",
    color: [59, 130, 246],
    rotY: 2.2,
    speedMult: 0.8,
    label: "Open",
  },
  {
    Icon: IconChart,
    title: "Move fast",
    body: "Small team, no bureaucracy. If you have an idea on Monday, it can be in production by Friday. We value execution over process.",
    color: [245, 158, 11],
    rotY: 3.3,
    speedMult: 1.6,
    label: "Speed",
  },
]

// ─── 3D Orbital Atom Canvas ───────────────────────────────────────────────────
function OrbitalViz({ activeReason }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(activeReason)

  useEffect(() => { activeRef.current = activeReason }, [activeReason])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    const FOCAL = 420
    let width = 400, height = 500, dpr = 1, raf

    // Three rings defined by (inclination, azimuth-offset, radius, nParticles)
    const RING_DEFS = [
      { inc: Math.PI / 5.5, azOff: 0,            R: 108, np: 4, baseSpeed: 0.009 },
      { inc: Math.PI / 1.9, azOff: Math.PI / 2.8, R:  86, np: 3, baseSpeed: 0.007 },
      { inc: Math.PI / 3.0, azOff: -Math.PI / 3.5,R:  68, np: 3, baseSpeed: 0.011 },
    ]

    // Particle state: one array per ring
    const particles = RING_DEFS.map(ring =>
      Array.from({ length: ring.np }, (_, i) => ({
        t: (i / ring.np) * Math.PI * 2,
      }))
    )

    // Lerped state
    let rotY = 0
    let coreR = [255, 45, 120]
    let speedMult = 1.0
    let time = 0

    function worldPoint(ring, t, globalRotY) {
      const ψ = ring.azOff + globalRotY
      const { inc: φ, R } = ring
      return {
        wx: R * (Math.cos(t) * Math.cos(ψ) + Math.sin(t) * Math.sin(φ) * Math.sin(ψ)),
        wy: R * Math.sin(t) * Math.cos(φ),
        wz: R * (-Math.cos(t) * Math.sin(ψ) + Math.sin(t) * Math.sin(φ) * Math.cos(ψ)),
      }
    }

    function project(wx, wy, wz) {
      const ps = FOCAL / (FOCAL + wz)
      const cx = width / 2, cy = height / 2
      return {
        sx: cx + wx * ps,
        sy: cy + wy * ps,
        ps,
        depth: (wz + 120) / 240,  // 0=back, 1=front  (R_max ≈ 110)
      }
    }

    function lerpColor(a, b, t) {
      return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
      ]
    }

    function resize() {
      dpr = window.devicePixelRatio || 1
      const p = canvas.parentElement
      if (!p) return
      width = p.offsetWidth
      height = p.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + "px"
      canvas.style.height = height + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw() {
      raf = requestAnimationFrame(draw)
      time += 0.016

      const cfg = REASONS[activeRef.current]

      // Lerp toward active config
      const rDiff = ((cfg.rotY - rotY) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI
      rotY += rDiff * 0.04
      coreR = lerpColor(coreR, cfg.color, 0.04)
      speedMult += (cfg.speedMult - speedMult) * 0.04

      ctx.clearRect(0, 0, width, height)

      // Pulsing background rings (atmospheric depth)
      for (let k = 0; k < 3; k++) {
        const prog = ((k / 3 + time * 0.012) % 1)
        ctx.beginPath()
        ctx.arc(width / 2, height / 2, 30 + prog * 140, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${coreR[0]},${coreR[1]},${coreR[2]},${0.03 * (1 - prog)})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw ring traces + particles
      RING_DEFS.forEach((ring, ri) => {
        // Ring trace (faint path)
        const traceSegs = 64
        ctx.beginPath()
        for (let j = 0; j <= traceSegs; j++) {
          const t = (j / traceSegs) * Math.PI * 2
          const w = worldPoint(ring, t, rotY)
          const p = project(w.wx, w.wy, w.wz)
          const alpha = 0.06 + p.depth * 0.12
          if (j === 0) ctx.moveTo(p.sx, p.sy)
          else ctx.lineTo(p.sx, p.sy)
        }
        ctx.strokeStyle = `rgba(${coreR[0]},${coreR[1]},${coreR[2]},0.18)`
        ctx.lineWidth = 0.8
        ctx.stroke()

        // Advance and draw particles
        particles[ri].forEach(pt => {
          pt.t += ring.baseSpeed * speedMult
          const w = worldPoint(ring, pt.t, rotY)
          const p = project(w.wx, w.wy, w.wz)
          const alpha = 0.25 + p.depth * 0.75
          const r = (3.5 + ri * 0.5) * (0.55 + p.depth * 0.6)

          ctx.save()
          ctx.globalAlpha = alpha
          ctx.shadowColor = `rgb(${coreR[0]},${coreR[1]},${coreR[2]})`
          ctx.shadowBlur = 10

          const grad = ctx.createRadialGradient(p.sx - r * 0.25, p.sy - r * 0.25, 0, p.sx, p.sy, r)
          grad.addColorStop(0, "#fff")
          grad.addColorStop(0.4, `rgb(${coreR[0]},${coreR[1]},${coreR[2]})`)
          grad.addColorStop(1, `rgba(${coreR[0]},${coreR[1]},${coreR[2]},0.4)`)

          ctx.beginPath()
          ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
          ctx.restore()
        })
      })

      // Central core sphere
      const cx = width / 2, cy = height / 2
      const coreRadius = 22 + Math.sin(time * 2.2) * 1.8

      // Outer glow
      const outerGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 3.5)
      outerGrd.addColorStop(0, `rgba(${coreR[0]},${coreR[1]},${coreR[2]},0.3)`)
      outerGrd.addColorStop(1, `rgba(${coreR[0]},${coreR[1]},${coreR[2]},0)`)
      ctx.beginPath()
      ctx.arc(cx, cy, coreRadius * 3.5, 0, Math.PI * 2)
      ctx.fillStyle = outerGrd
      ctx.fill()

      // Core
      ctx.save()
      ctx.shadowColor = `rgb(${coreR[0]},${coreR[1]},${coreR[2]})`
      ctx.shadowBlur = 28
      const cGrd = ctx.createRadialGradient(cx - coreRadius * 0.3, cy - coreRadius * 0.3, 0, cx, cy, coreRadius)
      cGrd.addColorStop(0, "#fff")
      cGrd.addColorStop(0.35, `rgb(${coreR[0]},${coreR[1]},${coreR[2]})`)
      cGrd.addColorStop(1, `rgba(${coreR[0]},${coreR[1]},${coreR[2]},0.6)`)
      ctx.beginPath()
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2)
      ctx.fillStyle = cGrd
      ctx.fill()
      ctx.restore()
    }

    resize()
    window.addEventListener("resize", resize)
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
}

// ─── Sticky Why Section ───────────────────────────────────────────────────────
function StickyReasons() {
  const containerRef = useRef(null)
  const [active, setActive] = useState(0)
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
      setActive(Math.min(REASONS.length - 1, Math.floor(progress * REASONS.length)))
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const r = REASONS[active]
  const colorStr = `rgb(${r.color[0]},${r.color[1]},${r.color[2]})`

  return (
    <section style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      {/* Section heading — above sticky */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "72px 32px 0", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--accent)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 12 }}>
          Why contribute
        </p>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, letterSpacing: "-1px", color: "var(--text)", marginBottom: 8 }}>
          Why myojam?
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 300, marginBottom: 0, maxWidth: 400, margin: "0 auto" }}>
          Scroll to explore the four reasons contributors keep coming back.
        </p>
      </div>

      {/* Sticky container */}
      <div ref={containerRef} style={{ height: `${REASONS.length * 100}vh`, position: "relative" }}>
        <div style={{
          position: "sticky", top: 0, height: "100vh",
          display: "flex", flexDirection: isMobile ? "column" : "row",
          overflow: "hidden",
        }}>

          {/* Left — orbital canvas */}
          <div style={{
            flex: isMobile ? "0 0 44vh" : 1,
            position: "relative",
            borderRight: isMobile ? "none" : "1px solid var(--border)",
            borderBottom: isMobile ? "1px solid var(--border)" : "none",
          }}>
            <OrbitalViz activeReason={active} />

            {/* Progress pips */}
            <div style={{
              position: "absolute", bottom: 28, left: 0, right: 0,
              display: "flex", justifyContent: "center", gap: 7, zIndex: 2,
            }}>
              {REASONS.map((reason, i) => (
                <div key={i} style={{
                  height: 6, borderRadius: 3,
                  width: i === active ? 22 : 6,
                  background: i === active
                    ? `rgb(${reason.color[0]},${reason.color[1]},${reason.color[2]})`
                    : "var(--border)",
                  transition: "width 0.35s ease, background 0.35s ease",
                }} />
              ))}
            </div>
          </div>

          {/* Right — reason detail */}
          <div style={{
            flex: 1,
            display: "flex", alignItems: "center",
            padding: isMobile ? "24px 28px" : "0 64px",
            overflow: "hidden",
            background: "var(--bg-secondary)",
          }}>
            <div key={active} style={{ animation: "reasonIn 0.38s cubic-bezier(0.22,1,0.36,1) both" }}>
              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `rgba(${r.color[0]},${r.color[1]},${r.color[2]},0.1)`,
                border: `1px solid rgba(${r.color[0]},${r.color[1]},${r.color[2]},0.25)`,
                borderRadius: 100, padding: "5px 14px", marginBottom: 20,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: colorStr, display: "inline-block" }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: colorStr, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                  {active + 1} of {REASONS.length} · {r.label}
                </span>
              </div>

              {/* Icon tile */}
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: `rgba(${r.color[0]},${r.color[1]},${r.color[2]},0.12)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20,
              }}>
                <r.Icon size={24} color={colorStr} />
              </div>

              <h2 style={{
                fontSize: "clamp(22px, 2.8vw, 36px)", fontWeight: 600,
                letterSpacing: "-0.8px", lineHeight: 1.15,
                color: "var(--text)", marginBottom: 16,
              }}>
                {r.title}
              </h2>

              <p style={{
                fontSize: 15, color: "var(--text-secondary)",
                lineHeight: 1.78, fontWeight: 300,
                maxWidth: 440, marginBottom: 0,
              }}>
                {r.body}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

const ROLES = [
  {
    title:"ML Research Contributor",
    type:"Volunteer · Remote",
    tags:["Python","scikit-learn","EMG","Signal Processing"],
    desc:"Help improve the gesture classifier  -  better features, new architectures, cross-subject adaptation. You'll work directly with Ninapro DB5 and real sensor data.",
  },
  {
    title:"Frontend Developer",
    type:"Volunteer · Remote",
    tags:["React","Three.js","Vite","CSS"],
    desc:"Build new interactive features for myojam.com. The signal playground, education hub, and 3D hand model are good examples of what we make.",
  },
  {
    title:"Hardware Engineer",
    type:"Volunteer · Remote",
    tags:["Arduino","MyoWare","Embedded C","Signal Acquisition"],
    desc:"Improve the Arduino firmware, explore higher-density electrode configurations, and help make the hardware setup more accessible to new users.",
  },
  {
    title:"Biomedical Research Contributor",
    type:"Volunteer · Remote",
    tags:["Neuroscience","EMG","Research Methods","Academic Writing"],
    desc:"Contribute to the scientific documentation of myojam's methodology. Help design experiments, review signal processing decisions, and improve cross-subject generalisation.",
  },
  {
    title:"Technical Writer",
    type:"Volunteer · Remote",
    tags:["Documentation","Markdown","API docs","Education"],
    desc:"Write and maintain technical documentation  -  API references, setup guides, hardware walkthroughs, and tutorials. Make the project accessible to people at every skill level.",
  },
  {
    title:"Education Content Creator",
    type:"Volunteer · Remote",
    tags:["Curriculum Design","Biology","CS Education","Writing"],
    desc:"Develop lesson plans, articles, and educational resources for the myojam educators hub. Background in science communication, biology, or computer science education is a plus.",
  },
  {
    title:"iOS / Android Developer",
    type:"Volunteer · Remote",
    tags:["React Native","iOS","Android","Bluetooth"],
    desc:"Build a companion mobile app for monitoring gesture classification in real time  -  current gesture, confidence score, and session statistics over Bluetooth.",
  },
  {
    title:"UX / Accessibility Researcher",
    type:"Volunteer · Remote",
    tags:["UX Research","Accessibility","User Testing","A11y"],
    desc:"Conduct user research with people who have motor impairments, evaluate the usability of myojam's interfaces, and recommend improvements grounded in real user needs.",
  },
  {
    title:"Community Manager",
    type:"Volunteer · Remote",
    tags:["Community","Social Media","Outreach","Writing"],
    desc:"Help grow the myojam community  -  manage communications, coordinate ELEVATE competition participants, support the Discord, and amplify the project's reach.",
  },
  {
    title:"Windows / Linux Port Contributor",
    type:"Volunteer · Remote",
    tags:["Python","PyQt6","Windows","Linux","Cross-platform"],
    desc:"The desktop app currently only supports macOS due to cliclick and osascript dependencies. Help build a cross-platform input layer so myojam works on Windows and Linux.",
  },
]

export default function Careers() {
  const [visible, setVisible] = useState({})
  const refs = useRef({})

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.dataset.key]: true }))
      })
    }, { threshold: 0.15 })
    Object.values(refs.current).forEach(el => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  function ref(key) {
    return el => { refs.current[key] = el; if (el) el.dataset.key = key }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes reasonIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section style={{ position: "relative", padding: "120px 32px 100px", overflow: "hidden", minHeight: 520, display: "flex", alignItems: "center" }}>
        {/* LineWaves background */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <LineWaves
            color1="#FF2D78"
            color2="#c026d3"
            color3="#7c3aed"
            brightness={0.18}
            speed={0.25}
            warpIntensity={0.8}
            rotation={-35}
            enableMouseInteraction={false}
          />
        </div>
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "rgba(0,0,0,0.52)" }} />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,45,120,0.2)", borderRadius: 100, padding: "6px 16px", fontSize: 13, color: "var(--accent)", fontWeight: 500, marginBottom: 32, animation: "fadeUp 0.6s ease forwards" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "pulse 2s infinite" }}/>
            We're building the future of assistive technology
          </div>

          <h1 style={{ fontSize: "clamp(40px, 6vw, 76px)", fontWeight: 600, letterSpacing: "-2.5px", lineHeight: 1.04, color: "#fff", marginBottom: 28, animation: "fadeUp 0.6s 0.1s ease both", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
            Lead the next generation<br />
            of <span style={{ color: "var(--accent)" }}>human-computer</span><br />
            interaction.
          </h1>

          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", fontWeight: 300, lineHeight: 1.75, maxWidth: 560, marginBottom: 44, animation: "fadeUp 0.6s 0.2s ease both" }}>
            myojam is a student-led open-source project turning surface EMG signals into assistive computer control. We're looking for contributors who want to build technology that genuinely matters.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", animation: "fadeUp 0.6s 0.3s ease both" }}>
            <a href="#roles" style={{ background: "var(--accent)", color: "#fff", borderRadius: 100, padding: "14px 36px", fontSize: 15, fontWeight: 500, textDecoration: "none", boxShadow: "0 4px 24px rgba(255,45,120,0.35)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,45,120,0.45)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(255,45,120,0.35)" }}
            >See open roles ↓</a>
            <a href="https://github.com/Jaden300/myojam" target="_blank" rel="noreferrer" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", color: "var(--text)", border: "1px solid var(--border-mid)", borderRadius: 100, padding: "14px 28px", fontSize: 15, fontWeight: 400, textDecoration: "none", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,45,120,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-mid)"}
            >View the codebase ↗</a>
          </div>
        </div>
      </section>

      {/* Why myojam — sticky 3D orbital section */}
      <StickyReasons />

      {/* Open roles */}
      <section id="roles" style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--accent)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 12 }}>Open roles</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, letterSpacing: "-1px", color: "var(--text)", marginBottom: 16 }}>Where you fit in.</h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7, maxWidth: 520 }}>All roles are volunteer and remote. This is a portfolio-building, mission-driven project  -  not a job. But the work is real and the impact is real.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 64 }}>
            {ROLES.map((role, i) => (
              <div key={role.title} ref={ref(`role_${i}`)} style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "28px 32px", opacity: visible[`role_${i}`] ? 1 : 0, transform: visible[`role_${i}`] ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.5s ${i * 0.12}s ease, transform 0.5s ${i * 0.12}s ease`, cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,45,120,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,45,120,0.07)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}
              >
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 17, fontWeight: 600, color: "var(--text)" }}>{role.title}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: "var(--accent)", background: "var(--accent-soft)", border: "1px solid rgba(255,45,120,0.15)", borderRadius: 100, padding: "3px 10px" }}>{role.type}</span>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, fontWeight: 300, marginTop: 12, marginBottom: 14 }}>{role.desc}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {role.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 12, color: "var(--text-secondary)", background: "var(--bg)", border: "1px solid var(--border-mid)", borderRadius: 100, padding: "3px 12px", fontWeight: 400 }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tally application form */}
          <div ref={ref("form")} style={{ opacity: visible["form"] ? 1 : 0, transform: visible["form"] ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 22, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.4px", marginBottom: 8 }}>Apply to contribute</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7 }}>Tell us about yourself, what role interests you, and what you'd like to build. We review every application personally.</p>
            </div>
            <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden", padding: "0 24px" }}>
              <iframe src="https://tally.so/embed/NpJAGB?hideTitle=1&transparentBackground=1&dynamicHeight=1" width="100%" height="600" frameBorder="0" title="Careers application" style={{ display: "block" }} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}