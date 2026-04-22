import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, SectionPill } from "./Animate"
import NeuralNoise from "./components/NeuralNoise"
import { IconMapleLeaf, IconBolt, IconMicroscope, IconBook, IconCoffee, IconChess, IconHandshake, IconGlobe, IconBrain, IconWave } from "./Icons"

export default function Team() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "clip" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      <Navbar />

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)", padding: "110px 32px 90px", textAlign: "center" }}>
        <NeuralNoise color={[0.49, 0.23, 0.93]} opacity={0.85} speed={0.0006} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,0,18,0.65)", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,45,120,0.3)",
            borderRadius: 100, padding: "5px 16px",
            fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500, marginBottom: 24,
            animation: "fadeUp 0.5s ease both",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            Proudly Canadian
          </div>
          <h1 style={{
            fontSize: "clamp(36px, 5.5vw, 60px)", fontWeight: 600,
            letterSpacing: "-2px", lineHeight: 1.06, color: "#fff",
            marginBottom: 20, animation: "fadeUp 0.55s 0.08s ease both",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}>Who we are</h1>
          <p style={{
            fontSize: 18, color: "rgba(255,255,255,0.72)", fontWeight: 300,
            lineHeight: 1.75, margin: 0, animation: "fadeUp 0.55s 0.16s ease both",
          }}>
            A small, passionate team building open-source assistive technology - from Toronto, for everyone.
          </p>
        </div>
      </div>

      {/* About us block */}
      <section style={{ padding: "88px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
              <div>
                <SectionPill>About the team</SectionPill>
                <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, letterSpacing: "-1.2px", color: "var(--text)", lineHeight: 1.15, marginBottom: 24 }}>
                  We're a proudly Canadian startup.
                </h2>
                <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.85, marginBottom: 18 }}>
                  myojam was born in Toronto out of a simple but stubborn belief: that people shouldn't have to adapt to their technology. Technology should adapt to them.
                </p>
                <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.85, marginBottom: 18 }}>
                  We're focused on making gesture-based computer control genuinely accessible - not just as a research concept, but as something anyone can download, build on, and use today. Every line of code is public, every model weight is documented, and the entire platform is free.
                </p>
                <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.85, margin: 0 }}>
                  We're passionate about open science, inclusive design, and the idea that the next big breakthrough in assistive technology is just as likely to come from a student's bedroom as a research lab.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: IconMapleLeaf, label: "Based in", value: "Toronto, Canada" },
                  { icon: IconBolt, label: "Founded", value: "2024" },
                  { icon: IconMicroscope, label: "Focus", value: "EMG-based assistive technology" },
                  { icon: IconBook, label: "Model", value: "Open source, MIT licensed" },
                  { icon: IconCoffee, label: "Fuel", value: "Coffee, mostly" },
                  { icon: IconChess, label: "Off the clock", value: "Chess. Lots of chess." },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "center", gap: 16,
                    background: "var(--bg-secondary)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: "16px 20px",
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={18} color="var(--accent)" /></div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "88px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>What drives us</SectionPill>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, letterSpacing: "-1.2px", color: "var(--text)", marginBottom: 48 }}>
              Why we show up every day.
            </h2>
          </Reveal>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[
                { icon: IconHandshake, title: "Accessibility isn't a feature", body: "It's the whole point. We build for people who need it most - not as a use case, but as the foundation everything else is built around." },
                { icon: IconGlobe, title: "Open by default", body: "Every model, every pipeline, every lesson plan - public. We don't believe in walled gardens when the mission is to help people." },
                { icon: IconBrain, title: "Rigour meets simplicity", body: "The science is real and the bar is high. But the experience should feel effortless. Both things can be true." },
              ].map(({ icon: ValIcon, title, body }) => (
                <div key={title} style={{
                  background: "var(--bg)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius)", padding: "28px 24px",
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}><ValIcon size={20} color="var(--accent)" /></div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>{title}</div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, fontWeight: 300, margin: 0 }}>{body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Say hi */}
      <section style={{ padding: "88px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Reveal>
            <div style={{
              background: "linear-gradient(135deg, rgba(255,45,120,0.06) 0%, rgba(124,58,237,0.04) 100%)",
              border: "1px solid rgba(255,45,120,0.15)",
              borderRadius: "var(--radius)", padding: "52px 48px",
              textAlign: "center",
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><IconWave size={24} color="var(--accent)" /></div>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 600, letterSpacing: "-0.8px", color: "var(--text)", marginBottom: 14 }}>
                Say hi.
              </h2>
              <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.8, maxWidth: 480, margin: "0 auto 32px" }}>
                We love meeting people who care about this space - whether you're a researcher, a student, an educator, or just curious. Drop us a line anytime.
              </p>
              <a
                href="/contact"
                style={{
                  display: "inline-block",
                  background: "var(--accent)", color: "#fff",
                  borderRadius: 100, padding: "13px 32px",
                  fontSize: 15, fontWeight: 500, textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(255,45,120,0.3)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,45,120,0.4)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,45,120,0.3)" }}
              >
                Get in touch →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
