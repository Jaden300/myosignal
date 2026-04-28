import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, SectionPill } from "./Animate"
import { LiquidChrome } from "./components/LiquidChrome"

const DOWNLOAD_URL = "https://github.com/Jaden300/myojam/releases/download/v1.0.0-macos/myojam-mac.zip"

function DownloadButton({ large = false }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={DOWNLOAD_URL}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: large ? 10 : 8,
        background: hovered ? "#e0256a" : "#FF2D78",
        color: "#fff", textDecoration: "none",
        borderRadius: 100,
        padding: large ? "16px 36px" : "11px 24px",
        fontSize: large ? 17 : 14,
        fontWeight: 600,
        boxShadow: hovered
          ? "0 12px 40px rgba(255,45,120,0.55)"
          : "0 6px 24px rgba(255,45,120,0.40)",
        transform: hovered ? "scale(1.04)" : "scale(1)",
        transition: "all 0.18s ease",
        flexShrink: 0,
      }}
    >
      <svg width={large ? 16 : 13} height={large ? 16 : 13} viewBox="0 0 12 12" fill="none">
        <path d="M6 1v7M3 5l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Download for Mac
    </a>
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

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", alignItems: "center" }}>
        {/* LiquidChrome animated background */}
        <div style={{ position: "absolute", inset: 0 }}>
          <LiquidChrome
            baseColor={[0.07, 0.0, 0.18]}
            speed={0.12}
            amplitude={0.28}
            frequencyX={2.8}
            frequencyY={2.8}
            interactive={true}
          />
        </div>
        {/* Dark overlay for text legibility */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(3,0,18,0.72) 0%, rgba(3,0,18,0.55) 50%, rgba(3,0,18,0.82) 100%)", zIndex: 1 }} />

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 900, margin: "0 auto", padding: "140px 32px 100px" }}>
          <Reveal>
            {/* Platform badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 100, padding: "5px 14px", marginBottom: 32 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5A5.5 5.5 0 1 0 7 12.5 5.5 5.5 0 0 0 7 1.5Z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none"/>
                <path d="M5 5.5C5 4.4 5.9 3.5 7 3.5s2 .9 2 2c0 1.5-2 2.5-2 2.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="7" cy="10.5" r="0.65" fill="rgba(255,255,255,0.6)"/>
              </svg>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 400, letterSpacing: "0.03em" }}>macOS desktop app · free · open source</span>
            </div>

            <h1 style={{
              fontSize: "clamp(40px, 7vw, 80px)",
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 1.0,
              color: "#fff",
              marginBottom: 28,
            }}>
              The future of EMG,<br />
              <span style={{ color: "#FF2D78" }}>in your hands.</span>
            </h1>

            <p style={{
              fontSize: "clamp(16px, 2.2vw, 20px)",
              color: "rgba(255,255,255,0.68)",
              fontWeight: 300,
              lineHeight: 1.75,
              maxWidth: 560,
              marginBottom: 48,
            }}>
              Real-time gesture classification from a surface EMG sensor — running locally on your Mac, powered by a Random Forest with 84.85% cross-subject accuracy, backed by peer-level research.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <DownloadButton large />
              <button
                onClick={() => navigate("/research/paper")}
                style={{
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.75)", borderRadius: 100, padding: "15px 28px",
                  fontSize: 15, fontWeight: 400, cursor: "pointer", fontFamily: "var(--font)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = "#fff" }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)" }}
              >
                Read the research →
              </button>
            </div>

            {/* Spec row */}
            <div style={{ display: "flex", gap: 24, marginTop: 40, flexWrap: "wrap" }}>
              {[["v1.0.0", "Version"], ["macOS 12+", "Requires"], ["~295 MB", "Download size"], ["MIT", "License"]].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 300, letterSpacing: "0.03em", textTransform: "uppercase", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.35 }}>
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
              <Reveal key={f.title} delay={i * 0.06}>
                <div style={{
                  background: "var(--bg-secondary)", border: "1px solid var(--border)",
                  borderRadius: 16, padding: "32px 28px",
                  transition: "border-color 0.2s",
                }}
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
                    <div style={{ position: "absolute", top: 22, left: "calc(100% - 12px)", width: 24, height: 1, background: "var(--border)", zIndex: 1 }} />
                  )}
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: s.accent + "18", border: `1px solid ${s.accent}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 20,
                  }}>
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
                No MyoWare sensor yet? The browser-based <span
                  onClick={() => window.location.href = "/playground"}
                  style={{ color: "var(--accent)", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>Signal Playground</span> lets you explore simulated EMG data with no hardware at all.
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

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
            {[
              { val: "84.85%", label: "Cross-subject accuracy", sub: "Tested on 10 unseen subjects", accent: "#FF2D78" },
              { val: "64", label: "Features extracted", sub: "MAV · RMS · WL · ZCR × 16 ch", accent: "#A78BFA" },
              { val: "LOSO", label: "Cross-validation", sub: "Leave-one-subject-out", accent: "#22D3EE" },
              { val: "Ninapro DB5", label: "Benchmark dataset", sub: "52 gestures · 10 subjects · 16ch", accent: "#10B981" },
            ].map((s, i) => (
              <Reveal key={s.val} delay={i * 0.06}>
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px 20px" }}>
                  <div style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: s.accent, letterSpacing: "-1px", marginBottom: 6 }}>{s.val}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 300, lineHeight: 1.5 }}>{s.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Paper links */}
          <Reveal delay={0.2}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: "Full technical report", path: "/research/paper" },
                { label: "Classifier comparison", path: "/research/classifier-analysis" },
                { label: "Variability review", path: "/research/variability-review" },
                { label: "Windowing analysis", path: "/research/windowing-analysis" },
              ].map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => window.location.href = path}
                  style={{
                    background: "var(--bg-secondary)", border: "1px solid var(--border)",
                    color: "var(--text-secondary)", borderRadius: 100, padding: "8px 18px",
                    fontSize: 13, cursor: "pointer", fontFamily: "var(--font)",
                    fontWeight: 400, transition: "all 0.15s",
                  }}
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
                {[
                  ["Operating system", "macOS 12 Monterey or later"],
                  ["Hardware sensor", "MyoWare 2.0 EMG sensor"],
                  ["Microcontroller", "Arduino Uno or compatible"],
                  ["Processor", "Apple Silicon or Intel"],
                  ["Download size", "~295 MB (app bundle)"],
                  ["License", "MIT — free to use, modify, and distribute"],
                ].map(([k, v]) => (
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
                The desktop app source — Python, PyQt6, the signal processing pipeline, and the trained Random Forest model — is on GitHub under MIT. Fork it, modify it, build on it. If you improve the classifier, open a PR.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Signal processing pipeline (bandpass filter, windowing, feature extraction)",
                  "64-feature Random Forest classifier (MAV, RMS, WL, ZCR × 16 channels)",
                  "Live serial reader from Arduino at 115200 baud",
                  "PyQt6 dark-theme UI with custom widget painting",
                  "Three.js 3D hand model (embedded in QWebEngineView)",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF2D78", flexShrink: 0, marginTop: 6 }} />
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
          <LiquidChrome
            baseColor={[0.07, 0.0, 0.18]}
            speed={0.08}
            amplitude={0.22}
            frequencyX={2.5}
            frequencyY={2.5}
            interactive={false}
          />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,0,18,0.75)", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#FF2D78", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>Free download</div>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.05, color: "#fff", marginBottom: 20 }}>
              Start reading your muscles.
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", fontWeight: 300, lineHeight: 1.7, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
              Surface EMG hardware interfaces are still rare, still expensive, and still mostly locked inside research labs. myojam is what it looks like when that changes.
            </p>
            <DownloadButton large />
            <div style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
              v1.0.0 · macOS 12+ · MIT licence · no account required
            </div>
          </Reveal>
        </div>
      </div>

      <Footer />
    </div>
  )
}
