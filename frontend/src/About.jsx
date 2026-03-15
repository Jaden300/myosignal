import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"

const TEAM = [
  {
    name: "Jaden",
    role: "Builder & Researcher",
    bio: "Grade 11 student passionate about the intersection of machine learning and assistive technology. Built MyoMetro to explore how consumer-grade biosignal hardware could give people with motor impairments a new way to interact with computers."
  }
]

const MISSION = [
  ["The Problem", "Over 1 billion people worldwide live with some form of disability. For those with motor impairments — from ALS to cerebral palsy to limb differences — standard computer interfaces like keyboards and mice are often inaccessible or impossible to use."],
  ["The Approach", "Surface EMG sensors read the electrical signals your muscles produce when you move. MyoMetro uses machine learning to classify those signals into discrete gestures in real time — no invasive hardware, no custom drivers, just a sensor, a USB port, and a browser."],
  ["The Data", "Our classifier was trained on the Ninapro DB5 dataset — a clinical EMG database containing recordings from 10 subjects performing 52 hand and finger gestures. We focus on 6 high-separability gestures and achieve 84.85% cross-subject accuracy, meaning the model generalizes to people it has never seen before."],
  ["Open Source", "Everything is open source under the MIT license. The training pipeline, the model weights, the frontend — all of it is on GitHub. The goal is for other students and researchers to build on this, not to lock it behind a product."],
]

export default function About() {
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
          }}>ABOUT MYOMETRO</div>
          <h1 style={{
            fontFamily: "var(--font)", fontWeight: 800,
            fontSize: "clamp(40px, 7vw, 80px)",
            letterSpacing: "-2px", lineHeight: 0.95,
            marginBottom: 32
          }}>
            MUSCLE SIGNALS.<br />
            <span style={{
              WebkitTextStroke: "2px var(--accent)",
              color: "transparent"
            }}>REAL CONTROL.</span>
          </h1>
          <p style={{
            fontSize: 17, color: "var(--text2)",
            lineHeight: 1.8, maxWidth: 600
          }}>
            MyoMetro is an open-source platform for real-time EMG gesture 
            classification, built specifically for assistive technology applications. 
            It runs entirely in the browser — no app downloads, no subscriptions.
          </p>
        </div>

        {/* Mission sections */}
        <div style={{ marginBottom: 72 }}>
          <div style={{
            borderBottom: "1px solid var(--border)",
            paddingBottom: 16, marginBottom: 32,
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end"
          }}>
            <h2 style={{
              fontFamily: "var(--font)", fontWeight: 800,
              fontSize: 32, letterSpacing: "-0.8px"
            }}>MISSION</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {MISSION.map(([title, body], i) => (
              <div key={title} style={{
                display: "grid", gridTemplateColumns: "200px 1fr",
                gap: 32, padding: "28px 0",
                borderBottom: "1px solid var(--border)"
              }}>
                <div style={{
                  fontFamily: "var(--mono)", fontSize: 11,
                  color: "var(--accent)", letterSpacing: "0.1em",
                  paddingTop: 3
                }}>{String(i + 1).padStart(2, "0")} — {title.toUpperCase()}</div>
                <p style={{
                  fontSize: 15, color: "var(--text2)",
                  lineHeight: 1.8
                }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Built by */}
        <div style={{ marginBottom: 72 }}>
          <div style={{
            borderBottom: "1px solid var(--border)",
            paddingBottom: 16, marginBottom: 32
          }}>
            <h2 style={{
              fontFamily: "var(--font)", fontWeight: 800,
              fontSize: 32, letterSpacing: "-0.8px"
            }}>BUILT BY</h2>
          </div>

          {TEAM.map(person => (
            <div key={person.name} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8, padding: 32,
              display: "grid", gridTemplateColumns: "auto 1fr",
              gap: 28, alignItems: "start"
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "var(--border2)",
                border: "2px solid var(--accent)",
                display: "flex", alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font)", fontWeight: 800,
                fontSize: 22, color: "var(--accent)"
              }}>
                {person.name[0]}
              </div>
              <div>
                <div style={{
                  fontFamily: "var(--font)", fontWeight: 700,
                  fontSize: 20, marginBottom: 4
                }}>{person.name}</div>
                <div style={{
                  fontFamily: "var(--mono)", fontSize: 11,
                  color: "var(--accent)", letterSpacing: "0.1em",
                  marginBottom: 12
                }}>{person.role.toUpperCase()}</div>
                <p style={{
                  fontSize: 14, color: "var(--text2)", lineHeight: 1.75
                }}>{person.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: 8, padding: "32px 36px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 20
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font)", fontWeight: 800,
              fontSize: 22, letterSpacing: "-0.5px", marginBottom: 6
            }}>See it in action</div>
            <p style={{
              fontFamily: "var(--mono)", fontSize: 12,
              color: "var(--text2)", letterSpacing: "0.04em"
            }}>Load real EMG data and watch the classifier run live.</p>
          </div>
          <button onClick={() => navigate("/demo")} style={{
            background: "var(--accent)", color: "#000",
            border: "none", borderRadius: 4,
            padding: "12px 28px", fontSize: 14,
            fontFamily: "var(--font)", fontWeight: 700,
            cursor: "pointer"
          }}>Open demo →</button>
        </div>
      </div>
    </div>
  )
}