import { useRef, useEffect, useState, useCallback } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"

// Same feature math as the Python backend
function computeFeatures(signal) {
  const n = signal.length
  if (n < 2) return null

  const mav = signal.reduce((s, v) => s + Math.abs(v), 0) / n
  const rms = Math.sqrt(signal.reduce((s, v) => s + v * v, 0) / n)

  let zc = 0
  for (let i = 1; i < n; i++) {
    if ((signal[i] >= 0) !== (signal[i - 1] >= 0)) zc++
  }

  let wl = 0
  for (let i = 1; i < n; i++) {
    wl += Math.abs(signal[i] - signal[i - 1])
  }

  return { mav, rms, zc, wl }
}

// Rough gesture similarity based on feature profile
function classifyGesture(features, signalPeak) {
  if (!features) return null
  const { mav, rms, zc, wl } = features

  // Heuristics based on typical EMG feature profiles
  if (mav < 0.02 && rms < 0.02) return { name: "rest", confidence: 0.91, color: "#AEAEB2" }
  if (zc > 60 && wl > 3.0)      return { name: "fist", confidence: 0.84, color: "#EF4444" }
  if (zc > 45 && mav > 0.25)    return { name: "index flex", confidence: 0.78, color: "#FF2D78" }
  if (zc > 35 && rms > 0.28)    return { name: "middle flex", confidence: 0.74, color: "#3B82F6" }
  if (wl > 2.0 && mav > 0.18)   return { name: "ring flex", confidence: 0.71, color: "#8B5CF6" }
  if (zc < 20 && wl > 1.2)      return { name: "thumb flex", confidence: 0.68, color: "#F59E0B" }
  if (zc < 15)                   return { name: "pinky flex", confidence: 0.65, color: "#10B981" }
  return { name: "index flex", confidence: 0.60, color: "#FF2D78" }
}

const FEATURE_INFO = {
  mav: { label: "MAV", full: "Mean Absolute Value", desc: "Average signal energy — how active the muscle is overall.", color: "#FF2D78" },
  rms: { label: "RMS", full: "Root Mean Square", desc: "Signal power — similar to MAV but emphasises peaks.", color: "#3B82F6" },
  zc:  { label: "ZC",  full: "Zero Crossing Rate", desc: "How often the signal crosses zero — a proxy for frequency content.", color: "#8B5CF6" },
  wl:  { label: "WL",  full: "Waveform Length", desc: "Total variation of the signal — captures complexity and speed.", color: "#10B981" },
}

export default function SignalPlayground() {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [signal, setSignal] = useState([])
  const [features, setFeatures] = useState(null)
  const [gesture, setGesture] = useState(null)
  const [hasDrawn, setHasDrawn] = useState(false)
  const lastX = useRef(null)

  // Draw the signal on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    const mid = H / 2

    ctx.clearRect(0, 0, W, H)

    // Background
    ctx.fillStyle = "#F5F5F7"
    ctx.fillRect(0, 0, W, H)

    // Grid lines
    ctx.strokeStyle = "rgba(0,0,0,0.06)"
    ctx.lineWidth = 1
    for (let i = 1; i < 4; i++) {
      ctx.beginPath()
      ctx.moveTo(0, H * i / 4)
      ctx.lineTo(W, H * i / 4)
      ctx.stroke()
    }

    // Zero line
    ctx.strokeStyle = "rgba(0,0,0,0.12)"
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(0, mid)
    ctx.lineTo(W, mid)
    ctx.stroke()
    ctx.setLineDash([])

    if (!hasDrawn) {
      // Placeholder
      ctx.fillStyle = "#AEAEB2"
      ctx.font = "400 14px -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Draw a signal here with your mouse or finger", W / 2, mid - 16)
      ctx.fillText("← drag across to sketch a waveform →", W / 2, mid + 16)
      return
    }

    if (signal.length < 2) return

    const stepX = W / 200
    const ampScale = H * 0.42

    // Fill
    const fillGrad = ctx.createLinearGradient(0, 0, 0, H)
    fillGrad.addColorStop(0, "rgba(255,45,120,0.12)")
    fillGrad.addColorStop(1, "rgba(255,45,120,0.01)")
    ctx.fillStyle = fillGrad
    ctx.beginPath()
    ctx.moveTo(0, mid)
    signal.forEach((v, i) => ctx.lineTo(i * stepX, mid - v * ampScale))
    ctx.lineTo((signal.length - 1) * stepX, mid)
    ctx.closePath()
    ctx.fill()

    // Line
    ctx.strokeStyle = "#FF2D78"
    ctx.lineWidth = 2.5
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.beginPath()
    signal.forEach((v, i) => {
      const x = i * stepX, y = mid - v * ampScale
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()

  }, [signal, hasDrawn])

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  function startDraw(e) {
    e.preventDefault()
    setDrawing(true)
    setHasDrawn(true)
    setSignal([])
    setFeatures(null)
    setGesture(null)
    lastX.current = null
  }

  function draw(e) {
    e.preventDefault()
    if (!drawing) return
    const canvas = canvasRef.current
    const { x, y } = getPos(e, canvas)
    const H = canvas.height
    // Normalise y to [-1, 1] centred on mid
    const val = -((y - H / 2) / (H * 0.42))
    const clamped = Math.max(-1, Math.min(1, val))

    setSignal(prev => {
      const next = [...prev, clamped].slice(-200)
      const feats = computeFeatures(next)
      setFeatures(feats)
      setGesture(classifyGesture(feats, Math.max(...next.map(Math.abs))))
      return next
    })
  }

  function endDraw(e) {
    e.preventDefault()
    setDrawing(false)
  }

  function clear() {
    setSignal([])
    setFeatures(null)
    setGesture(null)
    setHasDrawn(false)
  }

  // Example signals
  function loadExample(type) {
    setHasDrawn(true)
    setSignal([])
    setFeatures(null)
    setGesture(null)

    let generated = []
    if (type === "rest") {
      generated = Array.from({ length: 200 }, () => (Math.random() - 0.5) * 0.04)
    } else if (type === "flex") {
      generated = Array.from({ length: 200 }, (_, i) => {
        const burst = i > 40 && i < 160 ? 1 : 0
        return burst * (Math.sin(i * 0.8) * 0.6 + (Math.random() - 0.5) * 0.3)
      })
    } else if (type === "fist") {
      generated = Array.from({ length: 200 }, (_, i) => {
        const burst = i > 20 && i < 180 ? 1 : 0
        return burst * (Math.sin(i * 1.4) * 0.8 + Math.sin(i * 2.1) * 0.3 + (Math.random() - 0.5) * 0.25)
      })
    }

    setSignal(generated)
    const feats = computeFeatures(generated)
    setFeatures(feats)
    setGesture(classifyGesture(feats, Math.max(...generated.map(Math.abs))))
  }

  const featEntries = features
    ? Object.entries(FEATURE_INFO).map(([key, info]) => ({
        ...info, key,
        value: key === "zc" ? Math.round(features[key]) : features[key].toFixed(3),
        raw: features[key],
        // Normalise for display bar
        norm: key === "zc"
          ? Math.min(1, features[key] / 80)
          : Math.min(1, features[key] / (key === "wl" ? 4 : 0.5))
      }))
    : []

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #fff0f5 0%, #ffffff 60%)",
        borderBottom: "1px solid var(--border)",
        padding: "100px 32px 64px"
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "var(--accent-soft)", border: "1px solid rgba(255,45,120,0.15)",
            borderRadius: 100, padding: "5px 16px",
            fontSize: 13, color: "var(--accent)", fontWeight: 500, marginBottom: 28
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }}/>
            Interactive · No hardware needed
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 600,
            letterSpacing: "-1.5px", color: "var(--text)", marginBottom: 20, lineHeight: 1.08
          }}>
            Signal playground.<br />
            <span style={{ color: "var(--accent)" }}>Draw a waveform, see the math.</span>
          </h1>
          <p style={{
            fontSize: 17, color: "var(--text-secondary)", fontWeight: 300,
            lineHeight: 1.7, maxWidth: 560
          }}>
            Sketch an EMG-like signal with your mouse and watch the same feature extraction
            pipeline that runs inside myojam compute in real time — MAV, RMS, ZC, and WL,
            live as you draw.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "56px 32px 80px" }}>

        {/* Example buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 300 }}>Try an example:</span>
          {[
            ["Rest signal", "rest", "#AEAEB2"],
            ["Finger flex", "flex", "#FF2D78"],
            ["Fist", "fist", "#EF4444"],
          ].map(([label, type, color]) => (
            <button key={type} onClick={() => loadExample(type)} style={{
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              borderRadius: 100, padding: "6px 14px",
              fontSize: 12, color: "var(--text-secondary)", fontWeight: 400,
              cursor: "pointer", fontFamily: "var(--font)",
              display: "flex", alignItems: "center", gap: 6,
              transition: "border-color 0.15s, color 0.15s"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)" }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }}/>
              {label}
            </button>
          ))}
          {hasDrawn && (
            <button onClick={clear} style={{
              background: "none", border: "1px solid var(--border)",
              borderRadius: 100, padding: "6px 14px",
              fontSize: 12, color: "var(--text-tertiary)", fontWeight: 400,
              cursor: "pointer", fontFamily: "var(--font)",
              transition: "border-color 0.15s"
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,45,120,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >✕ Clear</button>
          )}
        </div>

        {/* Canvas */}
        <div style={{
          borderRadius: "var(--radius)", overflow: "hidden",
          border: `2px solid ${drawing ? "rgba(255,45,120,0.4)" : "var(--border)"}`,
          transition: "border-color 0.2s",
          cursor: "crosshair", marginBottom: 24,
          boxShadow: drawing ? "0 0 0 4px rgba(255,45,120,0.08)" : "none"
        }}>
          <canvas
            ref={canvasRef}
            width={820}
            height={220}
            style={{ display: "block", width: "100%", height: "auto", touchAction: "none" }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </div>

        {/* Feature readouts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {Object.entries(FEATURE_INFO).map(([key, info]) => {
            const entry = featEntries.find(e => e.key === key)
            const val = entry ? entry.value : "—"
            const norm = entry ? entry.norm : 0
            return (
              <div key={key} style={{
                background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)", padding: "16px 18px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: info.color, letterSpacing: "0.06em" }}>{info.label}</span>
                  <span style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.5px" }}>{val}</span>
                </div>
                {/* Bar */}
                <div style={{ height: 4, background: "var(--border)", borderRadius: 100, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{
                    height: "100%", width: `${norm * 100}%`,
                    background: info.color, borderRadius: 100,
                    transition: "width 0.15s ease"
                  }}/>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 300, lineHeight: 1.5 }}>{info.full}</div>
              </div>
            )
          })}
        </div>

        {/* Gesture prediction */}
        {gesture && (
          <div style={{
            background: "var(--bg-secondary)",
            border: `1px solid ${gesture.color}30`,
            borderLeft: `3px solid ${gesture.color}`,
            borderRadius: "var(--radius-sm)", padding: "20px 24px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 48
          }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 300, marginBottom: 4 }}>
                If this were a real EMG window, the classifier would predict:
              </div>
              <div style={{ fontSize: 22, fontWeight: 600, color: gesture.color, letterSpacing: "-0.5px" }}>
                {gesture.name}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 300, marginBottom: 4 }}>estimated confidence</div>
              <div style={{ fontSize: 32, fontWeight: 600, color: gesture.color, letterSpacing: "-1px" }}>
                {Math.round(gesture.confidence * 100)}%
              </div>
            </div>
          </div>
        )}

        {/* Feature explainer */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.4px", marginBottom: 8 }}>
            What are these features?
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7, marginBottom: 32 }}>
            myojam compresses each 200-sample EMG window into 64 numbers — four features per electrode channel.
            Here's what each one captures:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(FEATURE_INFO).map(([key, info]) => (
              <div key={key} style={{
                display: "flex", gap: 20, alignItems: "flex-start",
                background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)", padding: "20px 24px",
                transition: "border-color 0.2s"
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = info.color + "60"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: info.color + "18",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: info.color
                }}>{info.label}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{info.full}</div>
                  <div style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.6 }}>{info.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}