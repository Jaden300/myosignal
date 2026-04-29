import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, SectionPill } from "./Animate"
import { LiquidChrome } from "./components/LiquidChrome"

const MAC_URL = "https://github.com/Jaden300/myojam/releases/download/v1.0.0-macos/myojam-mac.zip"

// Pre-computed waveform path for Mac banner — 1600 wide (double for seamless loop)
// Uses harmonics 3, 8, 21 of period=800 so the signal repeats exactly at x=800
function buildWave(W, centerY, amp, phase = 0) {
  const pts = []
  for (let x = 0; x <= W; x += 3) {
    const y = centerY
      + amp * 0.55 * Math.sin(x * 6 * Math.PI / 800 + phase)
      + amp * 0.30 * Math.sin(x * 16 * Math.PI / 800 + phase * 1.3 + 0.8)
      + amp * 0.15 * Math.sin(x * 42 * Math.PI / 800 + phase * 0.7 + 1.5)
    pts.push(`${x},${y.toFixed(1)}`)
  }
  return "M " + pts.join(" L ")
}
const W = 1600
const MAC_WAVE_1 = buildWave(W, 110, 46, 0)
const MAC_WAVE_2 = buildWave(W, 110, 30, 1.1)
const MAC_WAVE_3 = buildWave(W, 110, 18, 2.4)

// Apple logo path (simplified trefoil shape)
const APPLE_PATH = "M12.5 2.5C12.5 2.5 10 2 9 5.5C8 3 5.5 2.5 5.5 2.5C5.5 2.5 3 2.5 3 6C3 9.5 7.5 13.5 9 14C10.5 13.5 15 9.5 15 6C15 2.5 12.5 2.5 12.5 2.5Z"

function MacBanner({ hovered }) {
  return (
    <div style={{
      position: "relative", width: "100%", height: 220, overflow: "hidden",
      borderRadius: "20px 20px 0 0",
      background: "linear-gradient(160deg, #0c0020 0%, #160830 40%, #0c0020 100%)",
    }}>
      <style>{`
        @keyframes macWave1 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes macWave2 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes macWave3 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes macGlow  { 0%,100%{opacity:0.45} 50%{opacity:0.75} }
        @keyframes macPulse { 0%,100%{transform:scale(1);opacity:0.07} 50%{transform:scale(1.08);opacity:0.11} }
        @keyframes macScan  { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
      `}</style>

      {/* Radial glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 80% at 50% 55%, rgba(255,45,120,0.28) 0%, transparent 70%)",
        animation: "macGlow 3.2s ease-in-out infinite",
      }}/>

      {/* Hover glow intensifier */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 70% at 50% 55%, rgba(255,45,120,0.22) 0%, transparent 65%)",
        opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease",
      }}/>

      {/* Animated waveforms */}
      <svg viewBox={`0 0 ${W} 220`} preserveAspectRatio="none"
        style={{ position:"absolute", top:0, left:0, width:"200%", height:"100%",
          animation:"macWave1 6s linear infinite", willChange:"transform" }}>
        <path d={MAC_WAVE_3} stroke="rgba(255,45,120,0.12)" strokeWidth="1" fill="none"/>
        <path d={MAC_WAVE_2} stroke="rgba(200,80,180,0.22)" strokeWidth="1.4" fill="none"/>
        <path d={MAC_WAVE_1} stroke="rgba(255,45,120,0.70)" strokeWidth="2" fill="none"
          style={{ filter:"drop-shadow(0 0 6px rgba(255,45,120,0.7))" }}/>
      </svg>

      {/* Large background symbol */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: 120, color: "rgba(255,45,120,0.07)",
        fontWeight: 700, userSelect: "none", letterSpacing: -2,
        animation: "macPulse 4s ease-in-out infinite",
        lineHeight: 1,
      }}>⌘</div>

      {/* Scan line on hover */}
      {hovered && (
        <div style={{
          position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", top: 0, bottom: 0, width: "30%",
            background: "linear-gradient(90deg, transparent, rgba(255,45,120,0.06), transparent)",
            animation: "macScan 1.4s ease-in-out infinite",
          }}/>
        </div>
      )}

      {/* OS label */}
      <div style={{ position: "absolute", top: 18, left: 22, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,45,120,0.18)", border: "1px solid rgba(255,45,120,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <path d="M9 1.5C9 1.5 6.5 1 5.5 4C4.5 1.5 2 1 2 1C2 1 0 1 0 4C0 8.5 4.5 12.5 6 13.5C7.5 12.5 12 8.5 12 4C12 1 9 1.5 9 1.5Z" fill="rgba(255,45,120,0.9)" transform="translate(3, 2)"/>
          </svg>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.02em" }}>macOS</span>
      </div>

      {/* Live badge */}
      <div style={{
        position: "absolute", top: 18, right: 18,
        background: "rgba(255,45,120,0.15)", border: "1px solid rgba(255,45,120,0.35)",
        borderRadius: 100, padding: "3px 10px",
        fontSize: 10, fontWeight: 600, color: "#FF2D78", letterSpacing: "0.06em",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF2D78" }}/>
        AVAILABLE
      </div>
    </div>
  )
}

function WindowsBanner({ hovered }) {
  return (
    <div style={{
      position: "relative", width: "100%", height: 220, overflow: "hidden",
      borderRadius: "20px 20px 0 0",
      background: "linear-gradient(160deg, #030d1a 0%, #07182e 40%, #030d1a 100%)",
    }}>
      <style>{`
        @keyframes winGlow  { 0%,100%{opacity:0.25} 50%{opacity:0.40} }
        @keyframes winFloat { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-54%) scale(1.04)} }
        @keyframes winGrid  { 0%{transform:translateX(0) translateY(0)} 100%{transform:translateX(24px) translateY(24px)} }
        @keyframes winSoon  { 0%,100%{opacity:0.7} 50%{opacity:1} }
      `}</style>

      {/* Radial glow — muted blue */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 80% at 50% 55%, rgba(0,120,215,0.20) 0%, transparent 70%)",
        animation: "winGlow 3.8s ease-in-out infinite",
      }}/>

      {/* Animated dot grid */}
      <svg style={{
        position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.08,
        animation:"winGrid 4s linear infinite",
      }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="wgrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#0078D7"/>
          </pattern>
        </defs>
        <rect width="200%" height="200%" fill="url(#wgrid)"/>
      </svg>

      {/* Windows logo — animated float */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        animation: "winFloat 5s ease-in-out infinite",
        transform: "translate(-50%, -50%)",
      }}>
        {[
          { x: 0,  y: 0,  color: "rgba(0,180,255,0.18)" },
          { x: 36, y: 0,  color: "rgba(0,180,255,0.13)" },
          { x: 0,  y: 36, color: "rgba(0,180,255,0.13)" },
          { x: 36, y: 36, color: "rgba(0,180,255,0.08)" },
        ].map((t, i) => (
          <div key={i} style={{
            position: "absolute",
            left: t.x, top: t.y,
            width: 30, height: 30,
            background: t.color,
            border: "1px solid rgba(0,140,220,0.25)",
            borderRadius: 3,
          }}/>
        ))}
        {/* Invisible spacer for the float container */}
        <div style={{ width: 66, height: 66, opacity: 0 }}/>
      </div>

      {/* OS label */}
      <div style={{ position: "absolute", top: 18, left: 22, display: "flex", alignItems: "center", gap: 8, opacity: 0.7 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,120,215,0.18)", border: "1px solid rgba(0,120,215,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="0" y="0" width="7" height="7" rx="1" fill="rgba(0,180,255,0.7)"/>
            <rect x="9" y="0" width="7" height="7" rx="1" fill="rgba(0,180,255,0.55)"/>
            <rect x="0" y="9" width="7" height="7" rx="1" fill="rgba(0,180,255,0.55)"/>
            <rect x="9" y="9" width="7" height="7" rx="1" fill="rgba(0,180,255,0.40)"/>
          </svg>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: "0.02em" }}>Windows</span>
      </div>

      {/* Coming Soon badge */}
      <div style={{
        position: "absolute", top: 18, right: 18,
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: 100, padding: "3px 10px",
        fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em",
        animation: "winSoon 3s ease-in-out infinite",
      }}>
        COMING SOON
      </div>

      {/* Diagonal "Coming Soon" stamp */}
      <div style={{
        position: "absolute", bottom: 28, right: -32,
        transform: "rotate(-12deg)",
        background: "rgba(0,120,215,0.12)",
        border: "1px solid rgba(0,120,215,0.25)",
        padding: "6px 40px",
        fontSize: 11, fontWeight: 700,
        color: "rgba(0,180,255,0.45)",
        letterSpacing: "0.2em", textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}>
        In development
      </div>

      {/* Whole-card desaturate overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(3,13,26,0.3)", pointerEvents: "none" }}/>
    </div>
  )
}

function PlatformCard({ platform, hovered, setHovered }) {
  const isMac = platform === "mac"

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20,
        border: `1px solid ${hovered
          ? isMac ? "rgba(255,45,120,0.45)" : "rgba(0,120,215,0.25)"
          : "rgba(255,255,255,0.10)"}`,
        background: "rgba(8,8,26,0.92)",
        overflow: "hidden",
        transform: hovered && isMac ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hovered && isMac
          ? "0 32px 80px rgba(255,45,120,0.22), 0 0 0 1px rgba(255,45,120,0.12)"
          : hovered
            ? "0 16px 48px rgba(0,120,215,0.10)"
            : "0 8px 32px rgba(0,0,0,0.4)",
        opacity: isMac ? 1 : 0.75,
        flex: 1,
        minWidth: 0,
      }}
    >
      {isMac ? <MacBanner hovered={hovered}/> : <WindowsBanner hovered={hovered}/>}

      {/* Info area */}
      <div style={{ padding: "28px 28px 32px" }}>
        {/* Platform name */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: isMac ? "#fff" : "rgba(255,255,255,0.55)", marginBottom: 3 }}>
              {isMac ? "macOS" : "Windows"}
            </div>
            <div style={{ fontSize: 12, color: isMac ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.25)", fontWeight: 300 }}>
              {isMac ? "Apple Silicon · Intel" : "x64 · ARM64"}
            </div>
          </div>
          {isMac
            ? <div style={{ fontSize: 11, fontWeight: 500, color: "#FF2D78", background: "rgba(255,45,120,0.1)", border: "1px solid rgba(255,45,120,0.2)", borderRadius: 100, padding: "4px 12px" }}>v1.0.0</div>
            : <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, padding: "4px 12px" }}>Coming soon</div>
          }
        </div>

        {/* Specs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
          {(isMac
            ? [["Requires", "macOS 12 Monterey or later"], ["Size", "~295 MB"], ["License", "MIT · Free forever"], ["Arch", "Apple Silicon + Intel"]]
            : [["Requires", "Windows 10 or later"], ["Size", "TBD"], ["License", "MIT · Free forever"], ["Status", "In development"]]
          ).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0", borderBottom: `1px solid ${isMac ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)"}` }}>
              <span style={{ fontSize: 12, color: isMac ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.2)", fontWeight: 300 }}>{k}</span>
              <span style={{ fontSize: 12, color: isMac ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)", fontWeight: 400, textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* CTA button */}
        {isMac
          ? <MacDownloadButton hovered={hovered}/>
          : <WindowsComingSoon/>
        }
      </div>
    </div>
  )
}

function MacDownloadButton({ hovered }) {
  const [btnHovered, setBtnHovered] = useState(false)
  const active = hovered || btnHovered
  return (
    <a
      href={MAC_URL}
      onMouseEnter={() => setBtnHovered(true)}
      onMouseLeave={() => setBtnHovered(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
        width: "100%", padding: "14px 0", borderRadius: 12,
        background: active
          ? "linear-gradient(135deg, #ff1a6d, #e0256a)"
          : "linear-gradient(135deg, #FF2D78, #d41f5f)",
        color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 600,
        boxShadow: active ? "0 8px 28px rgba(255,45,120,0.50)" : "0 4px 16px rgba(255,45,120,0.35)",
        transform: active ? "scale(1.02)" : "scale(1)",
        transition: "all 0.2s ease",
        letterSpacing: "0.01em",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 12 12" fill="none">
        <path d="M6 1v7M3 5l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Download for Mac — Free
    </a>
  )
}

function WindowsComingSoon() {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div style={{ position: "relative" }}>
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
          width: "100%", padding: "14px 0", borderRadius: 12,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.3)", fontSize: 15, fontWeight: 500,
          cursor: "not-allowed", fontFamily: "var(--font)",
          letterSpacing: "0.01em",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
          <path d="M6 4v3M6 8.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Windows — Coming Soon
      </button>
      {showTooltip && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          background: "rgba(10,10,30,0.96)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "10px 14px", whiteSpace: "nowrap",
          fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 300,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          zIndex: 10,
        }}>
          Windows build is in development — check back soon.
          <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, background: "rgba(10,10,30,0.96)", border: "1px solid rgba(255,255,255,0.12)", borderBottom: "none", borderRight: "none", transform: "translateX(-50%) rotate(225deg)" }}/>
        </div>
      )}
    </div>
  )
}

const FEATURES = [
  {
    accent: "#FF2D78",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <polyline points="2,20 6,12 10,16 14,8 18,14 22,6 26,10" stroke="#FF2D78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M2,20 26,20" stroke="rgba(255,45,120,0.25)" strokeWidth="1"/>
      </svg>
    ),
    title: "Live EMG waveform",
    body: "Watch your forearm's electrical signal render in real time — every contraction, every twitch. A glowing waveform built for the dark, with a 3-layer glow effect that makes the signal feel alive.",
  },
  {
    accent: "#A78BFA",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="10" width="20" height="14" rx="3" stroke="#A78BFA" strokeWidth="1.8" fill="none"/>
        <path d="M9 10V7a5 5 0 0110 0v3" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <circle cx="14" cy="17" r="2.5" fill="#A78BFA" opacity="0.7"/>
      </svg>
    ),
    title: "Gesture classification",
    body: "Six gesture classes — index flex, middle flex, ring flex, pinky flex, thumb flex, and fist — classified in real time using the same 84.85%-accurate Random Forest that powers the research.",
  },
  {
    accent: "#22D3EE",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 6 C14 6 8 8 8 14 C8 20 14 23 14 23 C14 23 20 20 20 14 C20 8 14 6 14 6 Z" stroke="#22D3EE" strokeWidth="1.8" fill="none"/>
        <line x1="14" y1="6" x2="14" y2="23" stroke="#22D3EE" strokeWidth="1.2" opacity="0.4"/>
        <line x1="8" y1="14" x2="20" y2="14" stroke="#22D3EE" strokeWidth="1.2" opacity="0.4"/>
      </svg>
    ),
    title: "3D hand model",
    body: "A rotating Three.js hand model animates each finger to match your detected gesture — curling in real time as the classifier updates. Visual confirmation that the system sees what you're doing.",
  },
  {
    accent: "#10B981",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#10B981" strokeWidth="1.8" fill="none"/>
        <path d="M14 9v5l3 3" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Session tracking",
    body: "Every session is tracked: total gestures performed, average confidence, and a live timer. See how your accuracy evolves in a single session as your forearm warms up.",
  },
]

const STEPS = [
  {
    num: "01",
    title: "Connect your sensor",
    body: "Plug a MyoWare 2.0 sensor into an Arduino and connect it to your Mac via USB. The app auto-detects the serial port.",
    accent: "#FF2D78",
  },
  {
    num: "02",
    title: "See your signal",
    body: "The live EMG waveform appears immediately. Flex any finger and watch the amplitude spike. This is the raw signal — before filtering, before classification.",
    accent: "#A78BFA",
  },
  {
    num: "03",
    title: "Make a gesture",
    body: "Hold any of the six gestures for one second. The classifier extracts 64 features from your signal window and returns a prediction within 50ms.",
    accent: "#22D3EE",
  },
]

export default function DesktopApp() {
  const navigate = useNavigate()
  const [macHovered, setMacHovered] = useState(false)
  const [winHovered, setWinHovered] = useState(false)

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <LiquidChrome baseColor={[0.07, 0.0, 0.18]} speed={0.12} amplitude={0.28} frequencyX={2.8} frequencyY={2.8} interactive={true}/>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(3,0,18,0.72) 0%, rgba(3,0,18,0.55) 50%, rgba(3,0,18,0.85) 100%)", zIndex: 1 }}/>

        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 960, margin: "0 auto", padding: "140px 32px 100px" }}>
          <Reveal>
            {/* Eyebrow */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 100, padding: "5px 14px", marginBottom: 32 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v7M3 5l3 3 3-3M1 10h10" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 400, letterSpacing: "0.03em" }}>free · open source · MIT licence</span>
            </div>

            <h1 style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 700, letterSpacing: "-3px", lineHeight: 1.0, color: "#fff", marginBottom: 20 }}>
              Download myojam.
            </h1>
            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.60)", fontWeight: 300, lineHeight: 1.75, maxWidth: 500, marginBottom: 56 }}>
              Real-time EMG gesture classification. Runs locally on your machine — no internet, no account, no latency. Backed by research you can read.
            </p>

            {/* Platform cards */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "stretch" }}>
              <div style={{ flex: "1 1 340px", minWidth: 0 }}>
                <PlatformCard platform="mac" hovered={macHovered} setHovered={setMacHovered}/>
              </div>
              <div style={{ flex: "1 1 340px", minWidth: 0 }}>
                <PlatformCard platform="windows" hovered={winHovered} setHovered={setWinHovered}/>
              </div>
            </div>

            {/* Research link */}
            <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/research/paper")}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font)", fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 300, padding: 0, transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
              >
                Read the research →
              </button>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.18)" }}>·</span>
              <button
                onClick={() => navigate("/how-it-works")}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font)", fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 300, padding: 0, transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
              >
                How it works →
              </button>
            </div>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.3 }}>
          <span style={{ fontSize: 10, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase" }}>scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M4 9l4 4 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <div style={{ background: "var(--bg)", borderTop: "1px solid var(--border)", padding: "96px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>What's inside</SectionPill>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: 16, marginTop: 16 }}>
              Built for the signal, not the screenshot.
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.75, maxWidth: 520, marginBottom: 56 }}>
              Every design decision in the app was made to make the EMG signal readable and the classifier transparent.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06} style={{ height: "100%" }}>
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px 28px", transition: "border-color 0.2s", height: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = f.accent + "60"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  <div style={{ marginBottom: 20 }}>{f.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>{f.title}</div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.75, margin: 0 }}>{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <div style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "96px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>Setup</SectionPill>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: 16, marginTop: 16 }}>
              From sensor to gesture in three steps.
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.75, maxWidth: 480, marginBottom: 64 }}>
              You need a MyoWare 2.0 sensor and an Arduino. Everything else — filtering, feature extraction, classification — happens inside the app.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 0 }}>
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.08}>
                <div style={{ position: "relative", padding: "0 32px 0 0" }}>
                  {i < STEPS.length - 1 && (
                    <div style={{ position: "absolute", top: 22, left: "calc(100% - 12px)", width: 24, height: 1, background: "var(--border)", zIndex: 1 }}/>
                  )}
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: s.accent + "18", border: `1px solid ${s.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s.accent, fontFamily: "monospace" }}>{s.num}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>{s.title}</div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.75, margin: 0 }}>{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div style={{ marginTop: 48, padding: "20px 24px", background: "rgba(255,45,120,0.04)", border: "1px solid rgba(255,45,120,0.15)", borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 14 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="9" cy="9" r="7.5" stroke="#FF2D78" strokeWidth="1.4" fill="none"/>
                <path d="M9 8v4M9 6h.01" stroke="#FF2D78" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7 }}>
                No MyoWare sensor yet? The browser-based <span onClick={() => navigate("/playground")} style={{ color: "var(--accent)", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>Signal Playground</span> lets you explore simulated EMG data with no hardware at all.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Research backing ─────────────────────────────────────────────────── */}
      <div style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "96px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>Research</SectionPill>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: 16, marginTop: 16 }}>
              Not a demo. A research instrument.
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.75, maxWidth: 520, marginBottom: 48 }}>
              The classifier embedded in myojam is the same one documented in four open-access technical reports — every hyperparameter, every design decision, every tradeoff, published.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
            {[
              { val: "84.85%", label: "Cross-subject accuracy", sub: "Tested on 10 unseen subjects", accent: "#FF2D78" },
              { val: "64", label: "Features extracted", sub: "MAV · RMS · WL · ZCR × 16 ch", accent: "#A78BFA" },
              { val: "LOSO", label: "Cross-validation", sub: "Leave-one-subject-out", accent: "#22D3EE" },
              { val: "Ninapro DB5", label: "Benchmark dataset", sub: "52 gestures · 10 subjects · 16ch", accent: "#10B981" },
            ].map((s, i) => (
              <Reveal key={s.val} delay={i * 0.06} style={{ height: "100%" }}>
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px 20px", height: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
                  <div style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: s.accent, letterSpacing: "-1px", marginBottom: 6 }}>{s.val}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 300, lineHeight: 1.5 }}>{s.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: "Full technical report", path: "/research/paper" },
                { label: "Classifier comparison", path: "/research/classifier-analysis" },
                { label: "Variability review", path: "/research/variability-review" },
                { label: "Windowing analysis", path: "/research/windowing-analysis" },
              ].map(({ label, path }) => (
                <button key={path} onClick={() => navigate(path)}
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: 100, padding: "8px 18px", fontSize: 13, cursor: "pointer", fontFamily: "var(--font)", fontWeight: 400, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)" }}
                >
                  {label} →
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Requirements ─────────────────────────────────────────────────────── */}
      <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", padding: "64px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
            <Reveal>
              <SectionPill>Requirements</SectionPill>
              <h3 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.8px", color: "var(--text)", marginBottom: 24, marginTop: 16 }}>What you need</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[["Operating system", "macOS 12 Monterey or later"], ["Hardware sensor", "MyoWare 2.0 EMG sensor"], ["Microcontroller", "Arduino Uno or compatible"], ["Processor", "Apple Silicon or Intel"], ["Download size", "~295 MB (app bundle)"], ["License", "MIT — free to use, modify, and distribute"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 16, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 300, minWidth: 140 }}>{k}</span>
                    <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 400 }}>{v}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <SectionPill>Open source</SectionPill>
              <h3 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.8px", color: "var(--text)", marginBottom: 16, marginTop: 16 }}>Everything is public</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.8, marginBottom: 24 }}>
                The desktop app source — Python, PyQt6, the signal processing pipeline, and the trained Random Forest model — is on GitHub under MIT. Fork it, modify it, build on it.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Signal processing pipeline (bandpass filter, windowing, feature extraction)", "64-feature Random Forest classifier (MAV, RMS, WL, ZCR × 16 channels)", "Live serial reader from Arduino at 115200 baud", "PyQt6 dark-theme UI with custom widget painting", "Three.js 3D hand model (embedded in QWebEngineView)"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF2D78", flexShrink: 0, marginTop: 6 }}/>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden", padding: "120px 32px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <LiquidChrome baseColor={[0.07, 0.0, 0.18]} speed={0.08} amplitude={0.22} frequencyX={2.5} frequencyY={2.5} interactive={false}/>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,0,18,0.78)", zIndex: 1 }}/>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#FF2D78", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>Ready to start</div>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.05, color: "#fff", marginBottom: 20 }}>
              Start reading your muscles.
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", fontWeight: 300, lineHeight: 1.7, maxWidth: 460, margin: "0 auto 48px" }}>
              Surface EMG hardware interfaces are still rare, still expensive, and still mostly locked inside research labs. myojam is what it looks like when that changes.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={MAC_URL} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FF2D78", color: "#fff", textDecoration: "none", borderRadius: 100, padding: "14px 32px", fontSize: 15, fontWeight: 600, boxShadow: "0 6px 24px rgba(255,45,120,0.40)", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(255,45,120,0.55)" }}
                onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 6px 24px rgba(255,45,120,0.40)" }}
              >
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Download for Mac
              </a>
              <button disabled style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.3)", borderRadius: 100, padding: "14px 32px", fontSize: 15, fontWeight: 500, cursor: "not-allowed", fontFamily: "var(--font)" }}>
                Windows — Soon
              </button>
            </div>
            <div style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.25)", fontWeight: 300 }}>
              v1.0.0 · macOS 12+ · MIT licence · no account required
            </div>
          </Reveal>
        </div>
      </div>

      <Footer />
    </div>
  )
}
