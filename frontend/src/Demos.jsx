import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, StaggerList, HoverCard, SectionPill } from "./Animate"
import { IconPencil, IconBrain, IconChart, IconDemo } from "./Icons"
import NeuralNoise from "./components/NeuralNoise"

const ICON_MAP = {
  pencil: IconPencil,
  game:   IconBrain,
  chart:  IconChart,
  matrix: IconDemo,
}

const TOOLS = [
  {
    slug: "/playground",
    icon: "pencil",
    tag: "Signal processing",
    title: "Signal Playground",
    desc: "Draw an EMG-like waveform with your mouse and watch the feature extraction pipeline compute MAV, RMS, ZC, and WL live as you draw. A hands-on way to understand what the classifier actually sees.",
    features: ["Draw any waveform", "Live feature extraction", "Heuristic classification", "Feature explainer"],
    cta: "Open playground →",
    accent: "#3B82F6",
  },
  {
    slug: "/game",
    icon: "game",
    tag: "Learning game",
    title: "Gesture Reaction Game",
    desc: "A target gesture appears on screen - press the matching key before time runs out. Three difficulty levels designed to build intuition for the 6 gesture classes used in myojam's classifier.",
    features: ["3 difficulty levels", "6 gesture classes", "Reaction scoring", "Keyboard-driven"],
    cta: "Play now →",
    accent: "#F59E0B",
  },
  {
    slug: "/frequency",
    icon: "chart",
    tag: "Signal processing",
    title: "EMG Frequency Analyzer",
    desc: "Load a real Ninapro EMG window and inspect its frequency spectrum. Watch the 20–90 Hz bandpass filter isolate gesture signal from noise in real time across any of the 16 electrode channels.",
    features: ["Real Ninapro windows", "16 channel selector", "Bandpass filter viz", "Frequency band legend"],
    cta: "Open analyzer →",
    accent: "#8B5CF6",
  },
  {
    slug: "/confusion",
    icon: "matrix",
    tag: "Model evaluation",
    title: "Confusion Matrix Explorer",
    desc: "An interactive heatmap of the classifier's cross-subject accuracy. Click any cell to see how often one gesture is confused for another - and the biomechanical reason why.",
    features: ["Interactive heatmap", "Per-gesture recall", "Confusion explanations", "Click-to-explore"],
    cta: "Explore →",
    accent: "#10B981",
  },
]

export default function Demos() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid var(--border)",
        padding: "100px 32px 64px"
      }}>
        <NeuralNoise color={[0.85, 0.10, 0.30]} opacity={0.85} speed={0.0006} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,0,18,0.65)", zIndex: 1 }} />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <SectionPill>Interactive learning tools</SectionPill>
            <h1 style={{
              fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 600,
              letterSpacing: "-1.5px", color: "#fff", marginBottom: 20, lineHeight: 1.08,
              textShadow: "0 2px 16px rgba(0,0,0,0.4)"
            }}>
              Learn by doing.<br />
              <span style={{ color: "var(--accent)" }}>No hardware required.</span>
            </h1>
            <p style={{
              fontSize: 17, color: "rgba(255,255,255,0.88)", fontWeight: 400,
              lineHeight: 1.7, maxWidth: 520
            }}>
              Four hands-on tools for exploring EMG signal processing, gesture classification,
              and machine learning - all running in your browser using real data from the
              Ninapro DB5 dataset.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Learning pathway */}
      <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", padding: "48px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>Suggested order</SectionPill>
            <h2 style={{ fontSize: "clamp(20px,2.8vw,28px)", fontWeight: 600, letterSpacing: "-0.7px", color: "var(--text)", marginBottom: 8 }}>
              A learning path through the tools
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7, marginBottom: 32, maxWidth: 540 }}>
              Each tool targets a different layer of the EMG pipeline. Follow them in order to build intuition from raw signal all the way to model evaluation.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {[
                { step: "01", stage: "Signal", tool: "Signal Playground", idea: "What does raw EMG actually look like? Draw waveforms and watch MAV, RMS, ZC, WL update live.", color: "#3B82F6", slug: "/playground" },
                { step: "02", stage: "Frequency", tool: "Frequency Analyzer", idea: "Where does gesture signal live in the spectrum? See how the 20–90 Hz bandpass isolates it from noise.", color: "#8B5CF6", slug: "/frequency" },
                { step: "03", stage: "Classification", tool: "Gesture Reaction Game", idea: "Which gestures are similar? Build intuition for the 6 gesture classes the classifier has to separate.", color: "#F59E0B", slug: "/game" },
                { step: "04", stage: "Evaluation", tool: "Confusion Matrix", idea: "Where does the model fail and why? Click any cell to see which gestures get confused and the anatomical reason.", color: "#10B981", slug: "/confusion" },
              ].map(({ step, stage, tool, idea, color, slug }, i) => (
                <div key={step} onClick={() => navigate(slug)} style={{
                  padding: "24px 20px",
                  borderRight: i < 3 ? "1px solid var(--border)" : "none",
                  background: "var(--bg)",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  position: "relative",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${color}08`}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--bg)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${color}18`, border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color }}>{step}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{stage}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>{tool}</div>
                  <p style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{idea}</p>
                  {i < 3 && (
                    <div style={{ position: "absolute", top: "50%", right: -10, transform: "translateY(-50%)", fontSize: 14, color: "var(--border)", zIndex: 1 }}>›</div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Tool cards */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "64px 32px 80px" }}>
        <StaggerList
          items={TOOLS}
          columns={1}
          gap={24}
          renderItem={(tool) => (
            <HoverCard
              color="rgba(255,45,120,0.08)"
              onClick={() => navigate(tool.slug)}
              style={{
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                overflow: "hidden", cursor: "pointer"
              }}
            >
              {/* Card banner */}
              <div style={{
                background: "var(--bg-secondary)",
                borderBottom: "1px solid var(--border)",
                padding: "36px 40px",
                display: "flex", alignItems: "flex-start", gap: 24
              }}>
                {(() => {
                  const Icon = ICON_MAP[tool.icon]
                  return (
                    <div style={{
                      width: 56, height: 56, borderRadius: 18, flexShrink: 0,
                      background: tool.accent + "18",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <Icon size={26} color={tool.accent} />
                    </div>
                  )
                })()}

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 500, color: tool.accent,
                      background: tool.accent + "18", border: `1px solid ${tool.accent}30`,
                      borderRadius: 100, padding: "3px 10px"
                    }}>{tool.tag}</span>
                  </div>
                  <h2 style={{
                    fontSize: 24, fontWeight: 600, color: "var(--text)",
                    letterSpacing: "-0.5px", marginBottom: 10
                  }}>{tool.title}</h2>
                  <p style={{
                    fontSize: 15, color: "var(--text-secondary)",
                    lineHeight: 1.7, fontWeight: 300, margin: 0, maxWidth: 560
                  }}>{tool.desc}</p>
                </div>
              </div>

              {/* Card footer */}
              <div style={{
                padding: "20px 40px",
                background: "var(--bg)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                flexWrap: "wrap", gap: 16
              }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {tool.features.map(f => (
                    <span key={f} style={{
                      fontSize: 12, color: "var(--text-secondary)",
                      background: "var(--bg-secondary)", border: "1px solid var(--border)",
                      borderRadius: 100, padding: "4px 12px", fontWeight: 300
                    }}>✓ {f}</span>
                  ))}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: tool.accent }}>{tool.cta}</span>
              </div>
            </HoverCard>
          )}
        />

        {/* Education hub CTA */}
        <Reveal delay={0.3}>
          <div style={{ marginTop: 48, background: "var(--bg-secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "36px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Want to go deeper?</div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7, margin: 0, maxWidth: 440 }}>
                The education hub has 11 articles covering the neuroscience, signal processing, and machine learning behind these tools - from first principles to implementation details.
              </p>
            </div>
            <button onClick={() => navigate("/education")} style={{ background: "var(--accent)", color: "#fff", borderRadius: 100, padding: "13px 28px", fontSize: 15, fontWeight: 500, border: "none", fontFamily: "var(--font)", cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 16px rgba(255,45,120,0.3)", transition: "transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,45,120,0.4)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,45,120,0.3)" }}
            >Explore the education hub →</button>
          </div>
        </Reveal>
      </div>

      <Footer />
    </div>
  )
}
