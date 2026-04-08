import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, StaggerList, HoverCard, SectionPill } from "./Animate"

const DEMOS = [
  {
    slug: "/demo",
    icon: "⚡",
    tag: "Live classifier",
    title: "EMG Gesture Demo",
    desc: "Load real EMG windows from the Ninapro DB5 dataset and watch the Random Forest classifier predict gestures in real time. Includes a 3D hand model, confidence scores, and per-gesture accuracy breakdown. No hardware needed.",
    features: ["Real Ninapro DB5 data", "6 gesture classes", "Live confidence scoring", "3D hand visualization"],
    cta: "Open demo →",
    bg: "linear-gradient(135deg, #fff0f5 0%, #fafafa 100%)",
    accent: "#FF2D78",
  },
  {
    slug: "/playground",
    icon: "✏️",
    tag: "Interactive",
    title: "Signal Playground",
    desc: "Draw an EMG-like waveform with your mouse and watch the feature extraction pipeline compute MAV, RMS, ZC, and WL live as you draw. See how different signal shapes produce different feature profiles and gesture predictions.",
    features: ["Draw any waveform", "Live feature extraction", "Heuristic classification", "Feature explainer"],
    cta: "Open playground →",
    bg: "linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)",
    accent: "#3B82F6",
  },
]

export default function Demos() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{
        background: "linear-gradient(135deg, #fff0f5 0%, #ffffff 60%)",
        borderBottom: "1px solid var(--border)",
        padding: "100px 32px 64px"
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>Interactive demos</SectionPill>
            <h1 style={{
              fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 600,
              letterSpacing: "-1.5px", color: "var(--text)", marginBottom: 20, lineHeight: 1.08
            }}>
              See myojam<br />
              <span style={{ color: "var(--accent)" }}>working in your browser.</span>
            </h1>
            <p style={{
              fontSize: 17, color: "var(--text-secondary)", fontWeight: 300,
              lineHeight: 1.7, maxWidth: 520
            }}>
              No hardware required. Both demos run entirely in the browser using
              real data from the Ninapro DB5 dataset and the same signal processing
              pipeline as the desktop app.
            </p>
          </Reveal>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "64px 32px 80px" }}>
        <StaggerList
          items={DEMOS}
          columns={1}
          gap={24}
          renderItem={(demo) => (
            <HoverCard
              color="rgba(255,45,120,0.08)"
              onClick={() => navigate(demo.slug)}
              style={{
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                overflow: "hidden", cursor: "pointer"
              }}
            >
              {/* Card banner */}
              <div style={{
                background: demo.bg,
                borderBottom: "1px solid var(--border)",
                padding: "36px 40px",
                display: "flex", alignItems: "flex-start", gap: 24
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 18, flexShrink: 0,
                  background: demo.accent + "18",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26
                }}>{demo.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 500, color: demo.accent,
                      background: demo.accent + "18", border: `1px solid ${demo.accent}30`,
                      borderRadius: 100, padding: "3px 10px"
                    }}>{demo.tag}</span>
                  </div>
                  <h2 style={{
                    fontSize: 24, fontWeight: 600, color: "var(--text)",
                    letterSpacing: "-0.5px", marginBottom: 10
                  }}>{demo.title}</h2>
                  <p style={{
                    fontSize: 15, color: "var(--text-secondary)",
                    lineHeight: 1.7, fontWeight: 300, margin: 0, maxWidth: 560
                  }}>{demo.desc}</p>
                </div>
              </div>

              {/* Card footer */}
              <div style={{
                padding: "20px 40px",
                background: "var(--bg-secondary)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                flexWrap: "wrap", gap: 16
              }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {demo.features.map(f => (
                    <span key={f} style={{
                      fontSize: 12, color: "var(--text-secondary)",
                      background: "var(--bg)", border: "1px solid var(--border)",
                      borderRadius: 100, padding: "4px 12px", fontWeight: 300
                    }}>✓ {f}</span>
                  ))}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: demo.accent }}>{demo.cta}</span>
              </div>
            </HoverCard>
          )}
        />

        <Reveal delay={0.3}>
          <div style={{
            marginTop: 48, textAlign: "center",
            padding: "32px", background: "var(--bg-secondary)",
            border: "1px solid var(--border)", borderRadius: "var(--radius)"
          }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>
              Want to try with real hardware?
            </div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7, marginBottom: 16, maxWidth: 400, margin: "0 auto 16px" }}>
              The macOS desktop app connects directly to a MyoWare 2.0 sensor for live EMG classification.
            </p>
            <a href="https://github.com/user-attachments/files/26291771/myojam-mac.zip"
              style={{
                background: "var(--accent)", color: "#fff", borderRadius: 100,
                padding: "10px 24px", fontSize: 14, fontWeight: 500,
                textDecoration: "none", display: "inline-block"
              }}>Download for Mac</a>
          </div>
        </Reveal>
      </div>

      <Footer />
    </div>
  )
}