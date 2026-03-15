import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"

const STEPS = [
  {
    num: "01",
    title: "SIGNAL CAPTURE",
    subtitle: "The hardware layer",
    body: "Surface EMG electrodes — adhesive stickers, no needles — are placed on the forearm. When muscles contract, they produce tiny electrical potentials (microvolts to millivolts). The MyoWare 2.0 sensor amplifies and conditions this signal across 16 channels at 200 samples per second.",
    details: ["16 differential EMG channels", "200 Hz sampling rate", "Passive surface electrodes", "MyoWare 2.0 or compatible sensor"]
  },
  {
    num: "02",
    title: "SIGNAL PROCESSING",
    subtitle: "Filtering and windowing",
    body: "Raw EMG is contaminated with noise — powerline interference at 60 Hz, motion artifacts, and baseline drift. A 4th-order Butterworth bandpass filter (20–90 Hz) isolates the physiologically relevant frequency band. The cleaned signal is then segmented into 200-sample windows with 50-sample steps, giving us overlapping snapshots of muscle activity.",
    details: ["Butterworth bandpass: 20–90 Hz", "Window size: 200 samples (1 second)", "Step size: 50 samples (250ms)", "Overlap: 75%"]
  },
  {
    num: "03",
    title: "FEATURE EXTRACTION",
    subtitle: "From waveform to numbers",
    body: "Each window is compressed into 64 numbers — four time-domain features computed per channel. These features capture the essential character of the EMG burst: how active the muscle is, how much energy it's producing, how often the signal crosses zero, and how much the waveform oscillates.",
    details: ["MAV — Mean Absolute Value (muscle activation level)", "RMS — Root Mean Square (signal power)", "ZC — Zero Crossings (frequency content)", "WL — Waveform Length (total signal variation)"]
  },
  {
    num: "04",
    title: "CLASSIFICATION",
    subtitle: "The machine learning model",
    body: "A Random Forest classifier with 500 decision trees takes the 64-feature vector and outputs a probability distribution across 6 gesture classes. The model was trained on 16,269 labeled windows from 10 subjects in the Ninapro DB5 clinical dataset, then tuned via randomized cross-validated hyperparameter search. Cross-subject test accuracy: 84.85%.",
    details: ["Algorithm: Random Forest (500 trees)", "Training data: 16,269 samples, 10 subjects", "Feature vector: 64 dimensions", "Test accuracy: 84.85% cross-subject"]
  },
  {
    num: "05",
    title: "ASSISTIVE OUTPUT",
    subtitle: "Gesture to action",
    body: "The predicted gesture label maps to a configurable computer action — cursor movement, mouse clicks, or keypresses. This gives users with motor impairments a hands-free interface. The entire inference pipeline runs in under 5ms, making the response feel instantaneous.",
    details: ["Index flex → cursor left", "Middle flex → cursor right", "Ring flex → scroll down", "Thumb flex → click", "Fist → spacebar"]
  },
]

export default function HowItWorks() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="grid-bg" />
      <Navbar />

      <div style={{
        maxWidth: 900, margin: "0 auto",
        padding: "120px 40px 80px",
        position: "relative", zIndex: 1
      }}>

        {/* Header */}
        <div style={{ marginBottom: 72 }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11,
            color: "var(--accent)", letterSpacing: "0.12em", marginBottom: 20
          }}>TECHNICAL OVERVIEW</div>
          <h1 style={{
            fontFamily: "var(--font)", fontWeight: 800,
            fontSize: "clamp(40px, 7vw, 80px)",
            letterSpacing: "-2px", lineHeight: 0.95,
            marginBottom: 32
          }}>
            HOW IT<br />
            <span style={{
              WebkitTextStroke: "2px var(--accent)",
              color: "transparent"
            }}>WORKS.</span>
          </h1>
          <p style={{
            fontSize: 17, color: "var(--text2)",
            lineHeight: 1.8, maxWidth: 560
          }}>
            From raw electrical signal to gesture classification in under 5ms.
            Here's the full pipeline.
          </p>
        </div>

        {/* Pipeline summary bar */}
        <div style={{
          display: "flex", alignItems: "center",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 8, padding: "16px 24px",
          marginBottom: 64, gap: 0, overflow: "hidden",
          flexWrap: "wrap", gap: 8
        }}>
          {["CAPTURE", "FILTER", "EXTRACT", "CLASSIFY", "OUTPUT"].map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontFamily: "var(--mono)", fontSize: 11,
                color: i === 4 ? "var(--accent)" : "var(--text2)",
                letterSpacing: "0.1em"
              }}>{step}</span>
              {i < 4 && <span style={{
                fontFamily: "var(--mono)", fontSize: 14,
                color: "var(--text3)", margin: "0 4px"
              }}>→</span>}
            </div>
          ))}
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8, padding: "36px",
              position: "relative", overflow: "hidden"
            }}>
              <div style={{
                position: "absolute", top: 24, right: 28,
                fontFamily: "var(--mono)", fontSize: 72,
                color: "var(--border2)", fontWeight: 400,
                lineHeight: 1, userSelect: "none"
              }}>{step.num}</div>

              <div style={{
                fontFamily: "var(--mono)", fontSize: 11,
                color: "var(--accent)", letterSpacing: "0.12em",
                marginBottom: 8
              }}>{step.title}</div>
              <div style={{
                fontFamily: "var(--font)", fontWeight: 700,
                fontSize: 22, letterSpacing: "-0.4px",
                marginBottom: 16, color: "var(--text)"
              }}>{step.subtitle}</div>
              <p style={{
                fontSize: 15, color: "var(--text2)",
                lineHeight: 1.8, maxWidth: 600, marginBottom: 24
              }}>{step.body}</p>

              <div style={{
                display: "flex", flexWrap: "wrap", gap: 8
              }}>
                {step.details.map(d => (
                  <span key={d} style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border2)",
                    borderRadius: 4, padding: "5px 12px",
                    fontFamily: "var(--mono)", fontSize: 11,
                    color: "var(--text2)", letterSpacing: "0.04em"
                  }}>{d}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dataset callout */}
        <div style={{
          marginTop: 48,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: 8, padding: "28px 32px"
        }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 10,
            color: "var(--accent)", letterSpacing: "0.12em", marginBottom: 10
          }}>DATASET — NINAPRO DB5</div>
          <p style={{
            fontSize: 14, color: "var(--text2)", lineHeight: 1.8
          }}>
            The Non-Invasive Adaptive Prosthetics (Ninapro) database is a publicly
            available benchmark dataset for EMG-based hand gesture recognition research.
            DB5 contains recordings from 10 intact subjects performing 52 hand and
            finger movements, each repeated 6 times, recorded with a Thalmic Myo
            armband. MyoMetro uses gestures 1–6 from Exercise 1 across all subjects
            and repetitions. Dataset available at{" "}
            <a href="https://ninapro.hevs.ch" target="_blank" rel="noreferrer"
              style={{ color: "var(--accent)" }}>ninapro.hevs.ch</a>.
          </p>
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 48, display: "flex", gap: 14
        }}>
          <button onClick={() => navigate("/demo")} style={{
            background: "var(--accent)", color: "#000",
            border: "none", borderRadius: 4,
            padding: "12px 28px", fontSize: 14,
            fontFamily: "var(--font)", fontWeight: 700,
            cursor: "pointer"
          }}>Try the demo →</button>
          <a href="https://github.com/Jaden300/myosignal"
            target="_blank" rel="noreferrer"
            style={{
              background: "transparent", color: "var(--text2)",
              border: "1px solid var(--border2)", borderRadius: 4,
              padding: "11px 24px", fontSize: 14,
              fontFamily: "var(--font)", textDecoration: "none"
            }}>View source on GitHub ↗</a>
        </div>
      </div>
    </div>
  )
}