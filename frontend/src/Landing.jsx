import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"

const STATS = [
  ["92%", "Model accuracy", "Random Forest on Ninapro DB5"],
  ["6", "Gesture classes", "Finger flexions + full fist"],
  ["16ch", "EMG channels", "200 Hz surface recording"],
  ["<5ms", "Inference time", "Real-time classification"],
]

const HOW = [
  ["01", "SIGNAL CAPTURE", "Surface electrodes on the forearm read electrical activity at 200 Hz across 16 channels. No needles — just stickers on skin."],
  ["02", "FEATURE EXTRACTION", "Each 200-sample window is filtered and compressed into 64 features: MAV, RMS, zero crossings, waveform length per channel."],
  ["03", "CLASSIFICATION", "A Random Forest trained on 10 subjects from the Ninapro DB5 clinical dataset identifies the gesture in under 5ms."],
  ["04", "ASSISTIVE OUTPUT", "Detected gestures map to computer actions — cursor movement, clicks, keypresses — giving motor-impaired users hands-free control."],
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="grid-bg" />
      <Navbar />

      {/* Hero */}
      <section style={{
        padding: "140px 40px 100px",
        maxWidth: 1160, margin: "0 auto",
        position: "relative", zIndex: 1
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          border: "1px solid var(--border2)", borderRadius: 3,
          padding: "5px 14px", marginBottom: 52,
          fontFamily: "var(--mono)", fontSize: 11,
          color: "var(--text2)", letterSpacing: "0.12em"
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--accent)", display: "inline-block",
            boxShadow: "0 0 8px var(--accent)"
          }}/>
          OPEN SOURCE · ASSISTIVE TECHNOLOGY · BUILT ON NINAPRO DB5
        </div>

        <h1 style={{
          fontFamily: "var(--font)", fontWeight: 800,
          fontSize: "clamp(52px, 9.5vw, 112px)",
          lineHeight: 0.92, letterSpacing: "-3px",
          marginBottom: 48
        }}>
          CONTROL A<br />
          <span style={{
            WebkitTextStroke: "2px var(--accent)",
            color: "transparent"
          }}>COMPUTER</span><br />
          WITH MUSCLE.
        </h1>

        <p style={{
          fontSize: 18, color: "var(--text2)", lineHeight: 1.75,
          maxWidth: 560, marginBottom: 52
        }}>
          For people with limb differences or motor impairments, MyoSignal
          turns forearm muscle signals into computer inputs — no keyboard,
          no mouse required.
        </p>

        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 100 }}>
          <button onClick={() => navigate("/demo")} style={{
            background: "var(--accent)", color: "#000",
            border: "none", borderRadius: 4,
            padding: "14px 32px", fontSize: 15,
            fontFamily: "var(--font)", fontWeight: 700,
            cursor: "pointer", letterSpacing: "-0.2px"
          }}>Try the demo →</button>
          <a href="https://github.com/Jaden300/myosignal"
            target="_blank" rel="noreferrer"
            style={{
              background: "transparent", color: "var(--text2)",
              border: "1px solid var(--border2)", borderRadius: 4,
              padding: "13px 28px", fontSize: 14,
              fontFamily: "var(--font)", textDecoration: "none",
              letterSpacing: "-0.2px"
            }}>View source ↗</a>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1, background: "var(--border)",
          border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden"
        }}>
          {STATS.map(([val, label, sub]) => (
            <div key={label} style={{
              background: "var(--surface)", padding: "28px 24px"
            }}>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 36,
                fontWeight: 400, color: "var(--accent)",
                letterSpacing: "-1px", marginBottom: 6
              }}>{val}</div>
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: "var(--text)", marginBottom: 4
              }}>{label}</div>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 11,
                color: "var(--text2)", lineHeight: 1.5
              }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{
        padding: "80px 40px 120px",
        maxWidth: 1160, margin: "0 auto",
        position: "relative", zIndex: 1
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", marginBottom: 48,
          borderBottom: "1px solid var(--border)", paddingBottom: 24
        }}>
          <h2 style={{
            fontFamily: "var(--font)", fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 56px)",
            letterSpacing: "-1.5px", lineHeight: 1
          }}>HOW IT<br />WORKS</h2>
          <span style={{
            fontFamily: "var(--mono)", fontSize: 11,
            color: "var(--text2)", letterSpacing: "0.1em"
          }}>SIGNAL → FEATURE → MODEL → ACTION</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {HOW.map(([num, title, desc]) => (
            <div key={num} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              padding: "32px", position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute", top: 20, right: 24,
                fontFamily: "var(--mono)", fontSize: 64,
                fontWeight: 400, color: "var(--border2)",
                lineHeight: 1, userSelect: "none"
              }}>{num}</div>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 11,
                color: "var(--accent)", letterSpacing: "0.12em",
                marginBottom: 14
              }}>{title}</div>
              <p style={{
                fontSize: 15, color: "var(--text2)",
                lineHeight: 1.75, maxWidth: 400
              }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "24px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "relative", zIndex: 1
      }}>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 11,
          color: "var(--text3)", letterSpacing: "0.08em"
        }}>MYOMETRO — OPEN SOURCE ASSISTIVE TECHNOLOGY</span>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 11,
          color: "var(--text3)", letterSpacing: "0.08em"
        }}>BUILT ON NINAPRO DB5</span>
      </footer>
    </div>
  )
}