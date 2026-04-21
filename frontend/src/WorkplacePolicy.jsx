import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, StaggerList, HoverCard, SectionPill } from "./Animate"
import NeuralNoise from "./components/NeuralNoise"
import {
  IconPeople, IconHeart, IconShield, IconBulb,
  IconBolt, IconBrain, IconCode, IconRocket
} from "./Icons"

// ─── Data ─────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    Icon: IconPeople,
    color: [255, 45, 120],
    title: "Fully distributed by design",
    body: "myojam has no central office and never will. Every process, meeting format, and communication norm is built for people who are not in the same room — not retrofitted from in-person habits.",
  },
  {
    Icon: IconHeart,
    color: [192, 38, 211],
    title: "Belonging over representation",
    body: "Diversity metrics are a floor, not a ceiling. We care more about whether every contributor feels genuinely heard, respected, and able to do their best work than about hitting any particular number.",
  },
  {
    Icon: IconShield,
    color: [124, 58, 237],
    title: "Psychological safety first",
    body: "You will never be penalised for asking a question, admitting uncertainty, or disagreeing with a decision. We treat intellectual honesty as a core skill, not a liability.",
  },
  {
    Icon: IconBulb,
    color: [59, 130, 246],
    title: "Asynchronous by default",
    body: "Real-time meetings are the exception. We document decisions in writing, give people time to think before responding, and respect that contributors live across time zones and different life schedules.",
  },
]

const DEI_COMMITMENTS = [
  {
    label: "Hiring",
    text: "We write role descriptions that focus on skills and impact, not credentials. We actively source candidates from underrepresented communities in STEM and assistive technology.",
  },
  {
    label: "Language",
    text: "Our documentation, comments, and communication default to plain, inclusive language. We avoid jargon that excludes newcomers and update terminology when community standards evolve.",
  },
  {
    label: "Accessibility",
    text: "Every public-facing tool we build is tested against WCAG 2.1 AA. Accessibility is a feature requirement, not an afterthought — it is directly aligned with our mission.",
  },
  {
    label: "Economic inclusion",
    text: "We make our education platform, tools, and resources permanently free. No paywalls, no institutional logins required. The knowledge we build should be accessible to anyone with an internet connection.",
  },
  {
    label: "Neurodiversity",
    text: "We support different working and communication styles. Contributors are never required to be on camera, respond instantly, or engage in social rituals that create undue pressure.",
  },
  {
    label: "Disability",
    text: "Given that we build assistive technology, we centre the voices of people with disabilities in our design and research processes — not as token consultees, but as core contributors.",
  },
]

const REMOTE_NORMS = [
  {
    icon: "🕐",
    title: "Work when it works for you",
    body: "We have no set hours. The only expectation is that you communicate proactively — if you're unavailable, say so. We optimise for output and trust contributors to manage their own time.",
  },
  {
    icon: "📝",
    title: "Write things down",
    body: "Decisions, context, and reasoning all live in writing. If a conversation happened in a DM or a call, the outcome gets documented where the team can find it. Institutional memory shouldn't depend on who attended which meeting.",
  },
  {
    icon: "📣",
    title: "Over-communicate context",
    body: "When you share work, include the why. When you leave a review comment, explain your reasoning. When you're blocked, say so early. Context-rich communication eliminates the anxiety of silence.",
  },
  {
    icon: "🔕",
    title: "Respect deep work",
    body: "Notifications are not urgent by default. We do not expect instant replies. If something is genuinely time-sensitive, say so explicitly — otherwise, assume people will respond when they surface from focused work.",
  },
  {
    icon: "🌍",
    title: "Time-zone aware scheduling",
    body: "When synchronous conversation is necessary, we rotate meeting times so the same people aren't always burdened with off-hours calls. We record and summarise everything for those who can't attend live.",
  },
  {
    icon: "🔁",
    title: "Iterate in public",
    body: "Draft thinking, half-formed ideas, and works in progress are welcome. We'd rather see messy early work than polished output that arrives too late for feedback. Progress over perfection, always.",
  },
]

const CONDUCT_ITEMS = [
  ["We do not tolerate", [
    "Harassment, discrimination, or exclusion based on race, gender, sexuality, disability, nationality, religion, age, or any other identity",
    "Condescending or dismissive communication — in reviews, comments, or discussions",
    "Gatekeeping knowledge or treating expertise as a social hierarchy",
    "Retaliation against anyone who raises a concern in good faith",
  ]],
  ["We actively encourage", [
    "Asking questions at any experience level — there are no dumb questions here",
    "Constructive disagreement — challenge ideas, not people",
    "Crediting contributors generously and by name",
    "Pointing out where our own processes fall short of our values",
  ]],
]

const WELLBEING = [
  { icon: "🧠", title: "Mental health", body: "Burnout is treated as a systems failure, not a personal one. If you're overwhelmed, say so. We will reduce scope, adjust timelines, or redistribute work — no questions asked." },
  { icon: "📵", title: "Right to disconnect", body: "Once you're done for the day, you're done. No one is expected to monitor channels, respond to pings, or be reachable outside their own working hours." },
  { icon: "🌱", title: "Growth support", body: "We invest in contributors' development. Whether that's reviewing your code in depth, co-authoring a research write-up, or connecting you with mentors in the field — we want you to leave myojam more capable than when you arrived." },
  { icon: "🤝", title: "Onboarding care", body: "No one should feel dropped in at the deep end. Every new contributor gets a dedicated onboarding guide, a point of contact, and an explicit invitation to ask any question they have — however basic it might seem." },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function AccordionItem({ label, text }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 0", textAlign: "left", gap: 16,
          fontFamily: "var(--font)",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{label}</span>
        <span style={{
          fontSize: 18, color: "var(--accent)", fontWeight: 300,
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease", flexShrink: 0, lineHeight: 1,
        }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? 200 : 0,
        opacity: open ? 1 : 0,
        overflow: "hidden",
        transition: "max-height 0.35s ease, opacity 0.25s ease",
      }}>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, fontWeight: 300, paddingBottom: 20, margin: 0 }}>
          {text}
        </p>
      </div>
    </div>
  )
}

function ConductBlock({ title, items, accent }) {
  return (
    <div style={{
      background: accent
        ? "linear-gradient(135deg, rgba(255,45,120,0.05) 0%, transparent 100%)"
        : "var(--bg-secondary)",
      border: `1px solid ${accent ? "rgba(255,45,120,0.18)" : "var(--border)"}`,
      borderRadius: "var(--radius)",
      padding: "32px 36px",
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: accent ? "var(--accent)" : "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 20 }}>
        {title}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", flexShrink: 0, marginTop: 7,
              background: accent ? "var(--accent)" : "var(--text-tertiary)",
            }}/>
            <span style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, fontWeight: 300 }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkplacePolicy() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "clip" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(22px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse  { 0%,100% { opacity:1 } 50% { opacity:0.45 } }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)", padding: "110px 32px 90px" }}>
        <NeuralNoise color={[0.49, 0.23, 0.93]} opacity={0.85} speed={0.0006} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,0,18,0.65)", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,45,120,0.3)",
            borderRadius: 100, padding: "6px 18px",
            fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500, marginBottom: 28,
            animation: "fadeUp 0.5s ease both",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "pulse 2.4s infinite" }}/>
            How we work together
          </div>
          <h1 style={{
            fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 600,
            letterSpacing: "-2.5px", lineHeight: 1.06, color: "#fff",
            marginBottom: 24, animation: "fadeUp 0.55s 0.08s ease both",
          }}>
            A workplace built around<br/>
            <span style={{ color: "var(--accent)" }}>people, not proximity.</span>
          </h1>
          <p style={{
            fontSize: 18, color: "rgba(255,255,255,0.7)", fontWeight: 300,
            lineHeight: 1.78, maxWidth: 600, margin: "0 auto",
            animation: "fadeUp 0.55s 0.16s ease both",
          }}>
            myojam is a remote-first, open-source project. This page outlines how we work, how we treat each other, and the values we hold ourselves to — not as aspirations, but as operating principles.
          </p>
        </div>
      </div>

      {/* ── Four Pillars ── */}
      <section style={{ padding: "88px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>Our foundation</SectionPill>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, letterSpacing: "-1.2px", color: "var(--text)", marginBottom: 48 }}>
              Four things we never compromise on.
            </h2>
          </Reveal>
          <StaggerList items={PILLARS} columns={2} gap={20} renderItem={(p) => (
            <HoverCard style={{
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "32px",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: 20,
                background: `rgba(${p.color[0]},${p.color[1]},${p.color[2]},0.1)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <p.Icon size={22} color={`rgb(${p.color[0]},${p.color[1]},${p.color[2]})`} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>{p.title}</div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, fontWeight: 300, margin: 0 }}>{p.body}</p>
            </HoverCard>
          )} />
        </div>
      </section>

      {/* ── Remote Work Norms ── */}
      <section style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "88px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>Remote work</SectionPill>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", marginBottom: 52 }}>
              <div>
                <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, letterSpacing: "-1.2px", color: "var(--text)", lineHeight: 1.15 }}>
                  How we actually work remotely.
                </h2>
              </div>
              <div>
                <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.8, margin: 0 }}>
                  Remote work done well requires explicit norms, not just trust and good intentions. These are the habits we have committed to as a team — each one chosen because we've seen what happens when it's missing.
                </p>
              </div>
            </div>
          </Reveal>
          <StaggerList items={REMOTE_NORMS} columns={3} gap={20} renderItem={(n) => (
            <HoverCard style={{
              background: "var(--bg)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "28px",
            }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{n.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>{n.title}</div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, fontWeight: 300, margin: 0 }}>{n.body}</p>
            </HoverCard>
          )} />
        </div>
      </section>

      {/* ── DEI Commitments ── */}
      <section style={{ padding: "88px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>Diversity, equity & inclusion</SectionPill>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", marginBottom: 52 }}>
              <div>
                <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, letterSpacing: "-1.2px", color: "var(--text)", lineHeight: 1.15 }}>
                  DEI is a practice, not a statement.
                </h2>
              </div>
              <div>
                <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.8, margin: 0 }}>
                  We don't have a diversity statement on a shelf. We have specific commitments in specific areas of how we operate — and we hold ourselves accountable to them publicly.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--bg-secondary)" }}>
              <div style={{ padding: "0 36px" }}>
                {DEI_COMMITMENTS.map((item) => (
                  <AccordionItem key={item.label} label={item.label} text={item.text} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Code of Conduct ── */}
      <section style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "88px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>Code of conduct</SectionPill>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, letterSpacing: "-1.2px", color: "var(--text)", marginBottom: 16 }}>
              Clear lines, no grey areas.
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.8, maxWidth: 600, marginBottom: 40 }}>
              Our code of conduct applies everywhere myojam exists — GitHub, Discord, email, research collaborations, and in-person interactions at events like ELEVATE.
            </p>
          </Reveal>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
              {CONDUCT_ITEMS.map(([title, items], i) => (
                <ConductBlock key={title} title={title} items={items} accent={i === 0} />
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div style={{
              background: "linear-gradient(135deg, rgba(255,45,120,0.06), transparent)",
              border: "1px solid rgba(255,45,120,0.15)",
              borderRadius: "var(--radius)", padding: "28px 32px",
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Reporting</div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.75, margin: 0 }}>
                If you experience or witness behaviour that violates this code, contact us at{" "}
                <a href="mailto:conduct@myojam.com" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>conduct@myojam.com</a>.
                All reports are reviewed confidentially. We do not penalise good-faith reporting under any circumstances, and we follow up on every report we receive.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Wellbeing ── */}
      <section style={{ padding: "88px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <SectionPill>Contributor wellbeing</SectionPill>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, letterSpacing: "-1.2px", color: "var(--text)", marginBottom: 48 }}>
              Sustainable contribution.
            </h2>
          </Reveal>
          <StaggerList items={WELLBEING} columns={2} gap={20} renderItem={(w) => (
            <HoverCard style={{
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "32px",
              display: "flex", gap: 20, alignItems: "flex-start",
            }}>
              <div style={{ fontSize: 32, flexShrink: 0, lineHeight: 1 }}>{w.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>{w.title}</div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, fontWeight: 300, margin: 0 }}>{w.body}</p>
              </div>
            </HoverCard>
          )} />
        </div>
      </section>

      {/* ── Living Document ── */}
      <section style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", padding: "88px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
              <div>
                <SectionPill>Always evolving</SectionPill>
                <h2 style={{ fontSize: "clamp(24px, 3.2vw, 38px)", fontWeight: 600, letterSpacing: "-1px", color: "var(--text)", lineHeight: 1.2, marginBottom: 20 }}>
                  This policy is a living document.
                </h2>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.8, marginBottom: 16 }}>
                  Our norms evolve as our community grows. Any contributor can propose a change — open a discussion, make the case, and we'll review it. The version you're reading reflects the community's current best thinking.
                </p>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.8, margin: 0 }}>
                  Last meaningfully updated: January 2025. Questions or suggestions:{" "}
                  <a href="mailto:policy@myojam.com" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>policy@myojam.com</a>
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  ["Version", "2.1 — Public"],
                  ["Scope", "All myojam contributors, spaces, and events"],
                  ["Enforcement", "Core team — conduct@myojam.com"],
                  ["License", "CC BY 4.0 — adapt it for your project"],
                ].map(([key, val]) => (
                  <div key={key} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 20px",
                    background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-tertiary)" }}>{key}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "0 32px 88px", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <div style={{
              background: "linear-gradient(135deg, rgba(255,45,120,0.07) 0%, rgba(124,58,237,0.05) 100%)",
              border: "1px solid rgba(255,45,120,0.15)",
              borderRadius: "var(--radius)", padding: "52px 48px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              gap: 32, flexWrap: "wrap",
            }}>
              <div>
                <div style={{ fontSize: 21, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.5px", marginBottom: 10 }}>
                  Want to contribute?
                </div>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7, margin: 0, maxWidth: 460 }}>
                  myojam is fully open source and remote. If these values resonate, we'd love to have you — whether you're an engineer, researcher, educator, or writer.
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flexShrink: 0 }}>
                <button
                  onClick={() => navigate("/careers")}
                  style={{
                    background: "var(--accent)", color: "#fff",
                    borderRadius: 100, padding: "13px 28px",
                    fontSize: 15, fontWeight: 500, border: "none", cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(255,45,120,0.3)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,45,120,0.4)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,45,120,0.3)" }}
                >
                  See open roles →
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  style={{
                    background: "none", color: "var(--text)",
                    borderRadius: 100, padding: "13px 28px",
                    fontSize: 15, fontWeight: 400,
                    border: "1px solid var(--border)", cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,45,120,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  Get in touch
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
