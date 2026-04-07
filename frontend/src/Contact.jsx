import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Contact() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "120px 32px 80px" }}>

        <p style={{
          fontSize: 13, fontWeight: 500, color: "var(--accent)",
          letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 16
        }}>Contact</p>

        <h1 style={{
          fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 600,
          letterSpacing: "-2px", lineHeight: 1.05, marginBottom: 24
        }}>Get in touch.</h1>

        <p style={{
          fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7,
          fontWeight: 300, marginBottom: 56
        }}>Questions about the project, research collaboration, or building on top of myojam? Reach out.</p>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 56 }}>
          {[
            ["GitHub", "Open an issue or pull request", "https://github.com/Jaden300/myosignal"],
            ["Ninapro dataset", "Source data for the model", "https://ninapro.hevs.ch"],
          ].map(([label, desc, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              style={{
                background: "var(--bg-secondary)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", padding: "20px 24px",
                display: "flex", justifyContent: "space-between",
                alignItems: "center", textDecoration: "none",
                transition: "border-color 0.15s, box-shadow 0.15s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(255,45,120,0.3)"
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(255,45,120,0.08)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 300 }}>{desc}</div>
              </div>
              <span style={{ fontSize: 18, color: "var(--text-tertiary)" }}>↗</span>
            </a>
          ))}
        </div>

        <div style={{
          background: "var(--bg-secondary)", borderRadius: "var(--radius)",
          border: "1px solid var(--border)", overflow: "hidden"
        }}>
          <iframe
            src="https://tally.so/embed/gDZlkJ?hideTitle=1&transparentBackground=1&dynamicHeight=1"
            width="100%"
            height="500"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Contact form"
            style={{ display: "block" }}
          />
        </div>

        <p style={{
          marginTop: 40, fontSize: 13, color: "var(--text-tertiary)",
          lineHeight: 1.6, fontWeight: 300
        }}>
          myojam is an open-source student research project. MIT License. Not a medical device.
        </p>
      </div>

    <Footer />
    </div>
  )
}