import Navbar from "./Navbar"

export default function Contact() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="grid-bg" />
      <Navbar />

      <div style={{
        maxWidth: 700, margin: "0 auto",
        padding: "120px 40px 80px",
        position: "relative", zIndex: 1
      }}>

        <div style={{ marginBottom: 64 }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11,
            color: "var(--accent)", letterSpacing: "0.12em", marginBottom: 20
          }}>GET IN TOUCH</div>
          <h1 style={{
            fontFamily: "var(--font)", fontWeight: 800,
            fontSize: "clamp(40px, 7vw, 72px)",
            letterSpacing: "-2px", lineHeight: 0.95,
            marginBottom: 24
          }}>
            CONTACT<br />
            <span style={{
              WebkitTextStroke: "2px var(--accent)",
              color: "transparent"
            }}>US.</span>
          </h1>
          <p style={{
            fontSize: 16, color: "var(--text2)", lineHeight: 1.8
          }}>
            Questions about the project, research collaboration, or building on
            top of MyoMetro? Reach out.
          </p>
        </div>

        {/* Contact options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
          {[
            ["GITHUB", "Open an issue or pull request", "https://github.com/Jaden300/myosignal", "github.com/Jaden300/myosignal ↗"],
            ["DATASET", "Ninapro DB5 source data", "https://ninapro.hevs.ch", "ninapro.hevs.ch ↗"],
          ].map(([label, desc, href, display]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "24px 28px",
                display: "flex", justifyContent: "space-between",
                alignItems: "center", textDecoration: "none",
                transition: "border-color 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <div>
                <div style={{
                  fontFamily: "var(--mono)", fontSize: 10,
                  color: "var(--accent)", letterSpacing: "0.12em", marginBottom: 6
                }}>{label}</div>
                <div style={{
                  fontFamily: "var(--font)", fontSize: 15,
                  color: "var(--text)", fontWeight: 600
                }}>{desc}</div>
              </div>
              <span style={{
                fontFamily: "var(--mono)", fontSize: 12,
                color: "var(--text2)"
              }}>{display}</span>
            </a>
          ))}
        </div>

        {/* Email form */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 8, padding: 32
        }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 10,
            color: "var(--accent)", letterSpacing: "0.12em", marginBottom: 20
          }}>SEND A MESSAGE</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[["NAME", "text", "Your name"], ["EMAIL", "email", "your@email.com"]].map(([label, type, placeholder]) => (
              <div key={label}>
                <div style={{
                  fontFamily: "var(--mono)", fontSize: 10,
                  color: "var(--text2)", letterSpacing: "0.1em", marginBottom: 6
                }}>{label}</div>
                <input type={type} placeholder={placeholder} style={{
                  width: "100%", background: "var(--surface2)",
                  border: "1px solid var(--border2)", borderRadius: 6,
                  padding: "10px 14px", color: "var(--text)",
                  fontFamily: "var(--mono)", fontSize: 13,
                  outline: "none"
                }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--border2)"}
                />
              </div>
            ))}
            <div>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 10,
                color: "var(--text2)", letterSpacing: "0.1em", marginBottom: 6
              }}>MESSAGE</div>
              <textarea rows={5} placeholder="What's on your mind?" style={{
                width: "100%", background: "var(--surface2)",
                border: "1px solid var(--border2)", borderRadius: 6,
                padding: "10px 14px", color: "var(--text)",
                fontFamily: "var(--mono)", fontSize: 13,
                outline: "none", resize: "vertical"
              }}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border2)"}
              />
            </div>
            <button
              onClick={() => window.location.href = "mailto:your@email.com"}
              style={{
                background: "var(--accent)", color: "#000",
                border: "none", borderRadius: 4,
                padding: "12px 28px", fontSize: 13,
                fontFamily: "var(--mono)", fontWeight: 700,
                letterSpacing: "0.06em", cursor: "pointer",
                alignSelf: "flex-start"
              }}>SEND MESSAGE →</button>
          </div>
        </div>

        <div style={{
          marginTop: 48, borderTop: "1px solid var(--border)",
          paddingTop: 24
        }}>
          <p style={{
            fontFamily: "var(--mono)", fontSize: 11,
            color: "var(--text3)", lineHeight: 1.7
          }}>
            MyoMetro is an open-source student research project. MIT License.
            Built on the Ninapro DB5 dataset. Not a medical device.
          </p>
        </div>
      </div>
    </div>
  )
}