import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, StaggerList, HoverCard, SectionPill } from "./Animate"
import NeuralNoise from "./components/NeuralNoise"
import ContactForm from "./components/ContactForm"
import { IconBook, IconPencil, IconPeople, IconBulb } from "./Icons"

const WHY = [
  {
    Icon: IconPeople,
    color: [255, 45, 120],
    title: "Reach a genuine audience",
    body: "The myojam education hub is read by students, researchers, and educators working in EMG, assistive technology, and human-computer interaction. Your work lands in front of people who care about the subject.",
  },
  {
    Icon: IconBook,
    color: [124, 58, 237],
    title: "Full author credit, always",
    body: "Every published article carries your name, affiliation, and a short bio. Your contribution is yours - we never republish anonymously or reassign authorship.",
  },
  {
    Icon: IconBulb,
    color: [59, 130, 246],
    title: "Editorial support included",
    body: "We review every submission and offer concrete feedback. If your article needs work before it's ready to publish, we'll tell you what and why - not just reject it.",
  },
  {
    Icon: IconPencil,
    color: [16, 185, 129],
    title: "Open access, permanently",
    body: "Everything published on myojam is free to read, forever. No paywalls, no institutional logins. Your work reaches the widest possible audience by default.",
  },
]

const WHAT_WE_PUBLISH = [
  "Technical explainers on EMG signal processing, feature extraction, or classification methods",
  "Hardware guides - sensor placement, electrode selection, Arduino integration",
  "Neuroscience deep-dives - motor units, action potentials, signal anatomy",
  "Research summaries or critiques of published work in the EMG/BCI space",
  "Opinion pieces on the ethics, equity, or future of assistive technology",
  "Tutorials for educators integrating myojam into a classroom or curriculum",
]

const PROCESS = [
  { step: "01", title: "Submit your pitch", body: "Fill out the form below with your name, email, and a short outline of what you want to write. A paragraph is enough - we don't need a full draft upfront." },
  { step: "02", title: "Editorial review", body: "We review every submission within 5–7 days and respond with either a go-ahead, a request for more detail, or honest feedback on why it's not the right fit right now." },
  { step: "03", title: "Write & revise", body: "Once approved, write your article in whatever format you're comfortable with. We'll do a light editorial pass for clarity and consistency, with your sign-off before anything goes live." },
  { step: "04", title: "Published with your name on it", body: "Your article goes live on the myojam education hub with full author credit - name, bio, and any links you want included. It stays up permanently." },
]

export default function SubmitArticle() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "clip" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)", padding: "110px 32px 90px" }}>
        <NeuralNoise color={[0.49, 0.23, 0.93]} opacity={0.85} speed={0.0006} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,0,18,0.68)", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,45,120,0.3)", borderRadius: 100,
            padding: "6px 18px", fontSize: 13, color: "rgba(255,255,255,0.85)",
            fontWeight: 500, marginBottom: 28, animation: "fadeUp 0.5s ease both",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            Education hub · Open submissions
          </div>
          <h1 style={{
            fontSize: "clamp(38px, 6vw, 66px)", fontWeight: 600,
            letterSpacing: "-2.5px", lineHeight: 1.06, color: "#fff",
            marginBottom: 24, animation: "fadeUp 0.55s 0.08s ease both",
          }}>
            Write for the<br />
            <span style={{ color: "var(--accent)" }}>myojam education hub.</span>
          </h1>
          <p style={{
            fontSize: 18, color: "rgba(255,255,255,0.7)", fontWeight: 300,
            lineHeight: 1.78, maxWidth: 580, margin: "0 auto",
            animation: "fadeUp 0.55s 0.16s ease both",
          }}>
            We publish original articles on EMG, assistive technology, neuroscience, and human-computer interaction. If you've got something worth saying, we want to read it.
          </p>
        </div>
      </div>

      {/* ── Why write for us ── */}
      <section style={{ padding: "88px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>Why write for us</SectionPill>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, letterSpacing: "-1.2px", color: "var(--text)", marginBottom: 48 }}>
              Your work deserves a real audience.
            </h2>
          </Reveal>
          <StaggerList items={WHY} columns={2} gap={20} renderItem={w => (
            <HoverCard style={{
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "32px",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: 20,
                background: `rgba(${w.color[0]},${w.color[1]},${w.color[2]},0.1)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <w.Icon size={22} color={`rgb(${w.color[0]},${w.color[1]},${w.color[2]})`} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>{w.title}</div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, fontWeight: 300, margin: 0 }}>{w.body}</p>
            </HoverCard>
          )} />
        </div>
      </section>

      {/* ── What we publish ── */}
      <section style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "88px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
              <div>
                <SectionPill>What we publish</SectionPill>
                <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, letterSpacing: "-1.2px", color: "var(--text)", lineHeight: 1.15, marginBottom: 20 }}>
                  Topics we're always looking for.
                </h2>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.8, margin: 0 }}>
                  We're not precious about format - explainers, tutorials, opinion pieces, research summaries. What matters is that it's original, accurate, and genuinely useful to someone trying to understand this space.
                </p>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                {WHAT_WE_PUBLISH.map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, fontWeight: 300 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Process ── */}
      <section style={{ padding: "88px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>How it works</SectionPill>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, letterSpacing: "-1.2px", color: "var(--text)", marginBottom: 48 }}>
              From pitch to published in four steps.
            </h2>
          </Reveal>
          <StaggerList items={PROCESS} columns={4} gap={20} renderItem={p => (
            <div style={{
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "28px 24px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", marginBottom: 16 }}>{p.step}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 10, lineHeight: 1.3 }}>{p.title}</div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, fontWeight: 300, margin: 0 }}>{p.body}</p>
            </div>
          )} />
        </div>
      </section>

      {/* ── Submission form ── */}
      <section style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", padding: "88px 32px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>Submit your pitch</SectionPill>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, letterSpacing: "-1px", color: "var(--text)", marginBottom: 12 }}>
              Ready to write?
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.8, marginBottom: 36 }}>
              Send us a short pitch - your name, email, and a paragraph on what you'd like to write. We respond to every submission within 5–7 days.
            </p>
          </Reveal>
          <Reveal>
            <div style={{
              background: "var(--bg)", borderRadius: "var(--radius)",
              border: "1px solid var(--border)", overflow: "hidden",
            }}>
              <ContactForm
                source="education"
                messagePlaceholder="Tell us about the article you'd like to write - topic, angle, and any relevant background or credentials."
                submitLabel="Submit pitch"
              />
            </div>
          </Reveal>
          <Reveal>
            <p style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 300, lineHeight: 1.7, marginTop: 20, textAlign: "center" }}>
              Not ready to pitch yet? Browse the{" "}
              <a href="/education" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>education hub</a>
              {" "}to see what's already been published.
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
