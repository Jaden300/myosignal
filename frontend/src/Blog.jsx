import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, SectionPill } from "./Animate"
import LiquidChrome from "./components/LiquidChrome"

// ─── Data ─────────────────────────────────────────────────────────────────────

const EMG_FACTS = [
  {
    id: "f5",
    accent: "#06B6D4",
    stat: "300ms",
    statLabel: "the prosthetic threshold",
    title: "The 300ms wall: real-time EMG has a latency problem",
    date: "April 2025",
    preview: "For a prosthetic limb to feel like part of your body, the full loop — detect, classify, move — must complete in under 300ms. Longer than that, the delay becomes perceptible and the hand stops feeling like yours.",
    slides: [
      { accent: "#06B6D4", heading: "Real-time EMG control has a hard deadline", body: "For a prosthetic limb to feel like part of your body, the system has to complete the full loop — detect the signal, classify the gesture, and move the motor — in under 300ms. Longer than that, and the delay becomes perceptible. The hand stops feeling like yours.", stat: null },
      { accent: "#22D3EE", heading: "But longer windows mean better accuracy", body: "A 100ms analysis window captures 20 raw samples at 200Hz — barely enough signal to extract reliable features. A 1000ms window captures 200 samples across a full gesture. Our ablation study shows the tradeoff clearly: 100ms gives 62.4% accuracy. 1000ms gives 84.85%.", stat: "100 ms → 62.4%\n1000 ms → 84.85%\nnearly 23 percentage\npoints of difference" },
      { accent: "#67E8F9", heading: "The problem: you can't have both", body: "A 1000ms window takes at least 1000ms to fill, plus processing time. That already blows the 300ms deadline by 3×. But every window shorter than ~600ms fails to cross the 80% accuracy threshold that prosthetics research treats as clinically meaningful. There's a gap — and no simple engineering fix closes it.", stat: null },
      { accent: "#06B6D4", heading: "Majority voting buys time, not accuracy", body: "One common approach is majority voting: run a short window every 50ms and vote across the last N predictions. It smooths noise and increases effective window size without added latency. But the accuracy ceiling is set by the underlying window quality — and 200ms windows don't contain enough information to vote your way past 75%.", stat: null },
    ],
  },
  {
    id: "f4",
    accent: "#3B82F6",
    stat: "1 in 7",
    statLabel: "predictions wrong",
    title: "Why your classifier fails on new people",
    date: "April 2025",
    preview: "myojam hits 84.85% cross-subject accuracy. That sounds solid — until you realise it means roughly 1 in 7 gesture predictions is wrong. And it gets worse when the model sees someone it's never trained on.",
    slides: [
      { accent: "#3B82F6", heading: "Why your classifier fails on new people", body: "myojam hits 84.85% cross-subject accuracy. That sounds solid - until you realise it means roughly 1 in 7 gesture predictions is wrong. And it gets worse when the model sees someone it's never trained on.", stat: null },
      { accent: "#60A5FA", heading: "The problem is between-person variability", body: "Every person's forearm is slightly different. Different muscle mass, different electrode placement, different tendon geometry. A Random Forest trained on 10 subjects encodes their specific signal patterns - not the universal pattern underneath.", stat: null },
      { accent: "#93C5FD", heading: "Cross-subject accuracy is the honest test", body: "Within-subject accuracy inflates numbers. If you train on Subject 1's data and test on Subject 1's data, you get 95%+. But that's not a product - that's memorisation. Cross-subject is the real question: does it work for someone it's never seen before?", stat: "84.85%\ncross-subject\nvs ~96%\nwithin-subject" },
      { accent: "#3B82F6", heading: "The fix isn't more training data", body: "More subjects helps, but the real solution is domain adaptation - teaching the model to adjust to a new user's signal distribution in real time. That's the unsolved problem that makes EMG interfaces hard to ship at scale.", stat: null },
    ],
  },
  {
    id: "f3",
    accent: "#8B5CF6",
    stat: "20+",
    statLabel: "muscles in your forearm",
    title: "Your forearm has 20+ muscles for 5 fingers",
    date: "April 2025",
    preview: "Surface EMG electrodes sit on your forearm skin — but underneath are over 20 muscles packed into a space smaller than your hand. Getting a clean signal from any one of them is an engineering problem.",
    slides: [
      { accent: "#8B5CF6", heading: "Your forearm has 20+ muscles controlling 5 fingers", body: "Surface EMG electrodes sit on your forearm skin - but underneath are over 20 muscles packed into a space smaller than your hand. Getting a clean signal from any one of them is an engineering problem.", stat: null },
      { accent: "#A78BFA", heading: "Flexor digitorum superficialis: the troublemaker", body: "The flexor digitorum superficialis has four separate tendon slips - one for each finger (index through pinky). But the muscle belly is shared. Bending your middle finger also partially activates the fibres next to your index and ring finger tendons. This is cross-talk, and it's why finger gestures blur together in the EMG signal.", stat: null },
      { accent: "#C4B5FD", heading: "Surface electrodes average over everything", body: "A 2cm surface electrode picks up the summed electrical field of every motor unit within detection range - often spanning 2–3 muscles. This is the core reason surface EMG gesture classification is hard. You're trying to decode individual finger movements from a blended signal.", stat: "2 cm\nelectrode picks up\n2–3 muscles\nof cross-talk" },
      { accent: "#8B5CF6", heading: "16 channels helps, but doesn't solve it", body: "Ninapro DB5 uses 16 electrodes distributed around the forearm. More channels means more spatial diversity in the signal - different electrodes capture different muscle contributions. That's what lets a 64-feature vector (4 features × 16 channels) separate gestures that would otherwise look identical.", stat: null },
    ],
  },
  {
    id: "f2",
    accent: "#10B981",
    stat: "20–90 Hz",
    statLabel: "the useful band",
    title: "The signal-to-noise problem in surface EMG",
    date: "March 2025",
    preview: "A raw forearm EMG signal contains frequencies from 0 Hz to over 500 Hz. But the gesture information you actually need lives between roughly 20 and 90 Hz. Everything else is noise — and there's a lot of it.",
    slides: [
      { accent: "#10B981", heading: "The signal you want lives in a narrow band", body: "A raw forearm EMG signal contains frequencies from 0 Hz to over 500 Hz. But the gesture information you actually need lives between roughly 20 and 90 Hz. Everything else is noise - and there's a lot of it.", stat: null },
      { accent: "#34D399", heading: "What's contaminating the signal", body: "Below 20 Hz: electrode movement artefacts - every tiny shift of skin under the sensor creates a low-frequency voltage spike. DC offset from the skin-electrode interface. Above 90 Hz: amplifier thermal noise. Power line interference at 50/60 Hz sits right in the middle of your useful band and needs a notch filter to remove.", stat: null },
      { accent: "#6EE7B7", heading: "The Butterworth bandpass filter", body: "myojam applies a 4th-order Butterworth bandpass filter at 20–90 Hz. Butterworth was chosen because it has a maximally flat passband - it doesn't distort the signal within the band of interest, only attenuates outside it. The result: gesture-relevant information passes through, most noise doesn't.", stat: "4th order\nButterworth\n20–90 Hz\n-40 dB/decade rolloff" },
      { accent: "#10B981", heading: "You can see this live", body: "The EMG Frequency Analyzer tool loads real Ninapro windows and shows you the frequency spectrum before and after the bandpass filter - across all 16 channels. The 50/60 Hz powerline spike is usually the most dramatic thing to watch disappear.", stat: null },
    ],
  },
  {
    id: "f1",
    accent: "#F59E0B",
    stat: "1791",
    statLabel: "Galvani's discovery",
    title: "EMG science is older than you think",
    date: "March 2025",
    preview: "Luigi Galvani discovered 'animal electricity' in 1791. It took 150 more years before a practical surface EMG recording could be made — and another 70 before an open benchmark dataset existed.",
    slides: [
      { accent: "#F59E0B", heading: "EMG science started in 1791", body: "Luigi Galvani discovered 'animal electricity' by noticing that a frog's leg twitched when touched with two different metals. He didn't understand what he'd found, but he'd demonstrated that biological tissue conducts electricity - the foundational insight of electrophysiology.", stat: null },
      { accent: "#FCD34D", heading: "Surface EMG took another 150 years", body: "The first practical surface EMG recordings weren't made until the 1940s. Early systems required large, inconvenient electrodes and produced signals that were almost impossible to analyse without specialised equipment. For decades, EMG was almost exclusively a clinical diagnostic tool - not a control interface.", stat: "1940s\nfirst practical\nsurface EMG\nrecordings" },
      { accent: "#FDE68A", heading: "Myoelectric prosthetics in the 1960s", body: "The first commercial myoelectric prosthetic arm appeared in the 1960s - a single-degree-of-freedom hook controlled by a bicep contraction. It sounds primitive, but the core principle is identical to what myojam does: detect a muscle signal, map it to a computer action.", stat: null },
      { accent: "#F59E0B", heading: "The Ninapro database changed everything", body: "Before Ninapro (2012), there was no large-scale public EMG dataset for gesture classification research. Labs were each collecting their own small datasets, making results impossible to compare. Ninapro DB5 - 10 subjects, 16 channels, 53 gesture classes - became the standard benchmark. myojam's classifier is trained and evaluated on it.", stat: null },
    ],
  },
]

const JOURNAL = [
  { id: "n9", tag: "Launch", accent: "#FF2D78", date: "Apr 27, 2025", title: "The desktop app is back — and it's been completely rebuilt", body: "The macOS desktop app — real hardware, real MyoWare sensor, real-time gesture classification at 84.85% — is available again as a free download. Completely rebuilt from scratch with a dark theme, live waveform display, 3D hand model, and session tracking. The original was functional but rough. The new version has a proper dark UI: animated confidence bars, a rotating 3D hand that reflects your gesture in real time, and a session stats bar that tracks gesture count and average confidence.", meta: "v1.0 · macOS 12+ · ~295 MB · MIT licence", link: "/download" },
  { id: "n8", tag: "Content",  accent: "#8B5CF6", date: "Apr 22, 2025", title: "Lesson 3 is here: applications and bioethics",           body: "The third lesson plan just dropped. 'EMG in the Real World: Applications & Bioethics' is designed for grades 7–11 and asks the question every technology class should ask: who benefits from this, and who doesn't? Students use the confusion matrix explorer to calculate what 84.85% accuracy means in a prosthetics context versus a keyboard shortcut — and they're usually surprised how different those answers are. Then a structured ethics discussion: access, data privacy, dataset bias, workplace monitoring.", meta: "60 min · Grades 7–11 · No hardware required", link: "/educators" },
  { id: "n7", tag: "Milestone", accent: "#10B981", date: "Apr 10, 2025", title: "11 articles and counting",                              body: "The education hub crossed 11 published articles this month — covering the neuromuscular junction, windowing, the ethics of biometric data, phantom limb research, and more. They started as notes from the build process and turned into something we're genuinely proud of.", meta: "11 articles · 9 topics · 450+ reads", link: "/education" },
  { id: "n6", tag: "Launch",   accent: "#FF2D78", date: "Mar 18, 2025", title: "The educators hub is live",                             body: "Three full lesson plans. Curriculum standards. Differentiation strategies. Assessment rubrics. Built-in quizzes. The educators hub is the part of this project we spent the most time on. Designed for a teacher who has 75 minutes and a class who's never heard of EMG.", meta: "3 lesson plans · Grades 7–university · Free · Open access", link: "/educators" },
  { id: "n5", tag: "Milestone", accent: "#10B981", date: "Mar 4, 2025",  title: "1,000 unique visitors",                                body: "Crossed 1,000 unique visitors this week. Most traffic is coming through the education hub — people finding the articles via search. A handful of teachers have already reached out about using myojam in class. That's the whole point.", meta: "Search-driven · Education hub", link: null },
  { id: "n4", tag: "Launch",   accent: "#FF2D78", date: "Feb 20, 2025", title: "Four tools. No hardware.",                              body: "Everything in the interactive tools section runs in your browser using real Ninapro data. No sensor, no setup. The signal playground, confusion matrix explorer, frequency analyzer, and gesture reaction game — all free, all open source.", meta: "4 tools · Browser-only · Real Ninapro data", link: "/demos" },
  { id: "n3", tag: "Launch",   accent: "#FF2D78", date: "Feb 5, 2025",  title: "myojam.com is live",                                   body: "After months of building locally, myojam.com went live today. FastAPI backend on Render. React/Vite frontend on Vercel. The classifier is accessible in a browser for the first time — no MyoWare sensor required.", meta: "FastAPI · Render · Vite · Vercel", link: null },
  { id: "n2", tag: "Open source", accent: "#3B82F6", date: "Jan 14, 2025", title: "Everything is open source",                        body: "Signal processing pipeline, ML model, React frontend, FastAPI backend — all on GitHub under the MIT license. No private forks, no login required, no waitlist. If you spot something wrong in an article, open a PR.", meta: "MIT licence · GitHub · Full source", link: null },
  { id: "n1", tag: "Research", accent: "#F59E0B", date: "Dec 18, 2024", title: "84.85% — and we mean it",                              body: "The classifier hit 84.85% cross-subject accuracy. Cross-subject means tested on people it had never seen during training — real generalisation, not inflated within-subject numbers. One in seven predictions is still wrong. That's the honest baseline and it's the number on the website.", meta: "16,269 windows · 10 subjects · 6 gestures · LOSO", link: "/research/paper" },
]

// ─── EMG Pulse Hero Canvas ─────────────────────────────────────────────────────

function EMGPulse() {
  const canvasRef = useRef(null)
  const raf = useRef(null)
  const t = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    function draw() {
      const W = canvas.getBoundingClientRect().width
      const H = canvas.getBoundingClientRect().height
      if (!W || !H) { raf.current = requestAnimationFrame(draw); return }

      ctx.clearRect(0, 0, W, H)
      t.current += 0.012

      const channels = 5
      const gap = H / (channels + 1)

      for (let ch = 0; ch < channels; ch++) {
        const cy = gap * (ch + 1)
        const amp = 12 + ch * 3
        const freq = 0.025 + ch * 0.008
        const phase = ch * 1.3

        const alpha = 0.08 + (channels - ch) / channels * 0.18

        ctx.beginPath()
        for (let x = 0; x <= W; x += 2) {
          const tx = t.current - x * freq * 0.4
          const y = cy
            + amp * 0.6 * Math.sin(tx * 3.2 + phase)
            + amp * 0.3 * Math.sin(tx * 7.1 + phase * 1.5)
            + amp * 0.1 * Math.sin(tx * 15.3 + phase * 0.7)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(255,45,120,${alpha})`
        ctx.lineWidth = 1.5 - ch * 0.2
        ctx.stroke()
      }

      raf.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  )
}

// ─── Fact Card ─────────────────────────────────────────────────────────────────

function FactCard({ fact }) {
  const [expanded, setExpanded] = useState(false)
  const [slideIdx, setSlideIdx] = useState(0)

  const slide = fact.slides[slideIdx]

  function handleKey(e) {
    if (!expanded) return
    if (e.key === "ArrowRight") setSlideIdx(i => Math.min(i + 1, fact.slides.length - 1))
    if (e.key === "ArrowLeft")  setSlideIdx(i => Math.max(i - 1, 0))
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKey}
      style={{ outline: "none" }}
    >
      {/* Collapsed header */}
      <div
        onClick={() => { setExpanded(e => !e); setSlideIdx(0) }}
        style={{
          display: "grid",
          gridTemplateColumns: "100px 1fr auto",
          gap: 24,
          alignItems: "center",
          padding: "24px 28px",
          cursor: "pointer",
          borderBottom: expanded ? "none" : "1px solid var(--border)",
          background: expanded ? `${fact.accent}08` : "var(--bg)",
          transition: "background 0.2s",
        }}
        onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = "var(--bg-secondary)" }}
        onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = "var(--bg)" }}
      >
        {/* Stat */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: fact.accent, letterSpacing: "-1.5px", lineHeight: 1 }}>
            {fact.stat}
          </div>
          <div style={{ fontSize: 9, color: "var(--text-tertiary)", fontWeight: 300, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 3, lineHeight: 1.3 }}>
            {fact.statLabel}
          </div>
        </div>

        {/* Title + preview */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{
              fontSize: 10, fontWeight: 600, color: fact.accent,
              background: `${fact.accent}14`, border: `1px solid ${fact.accent}30`,
              borderRadius: 100, padding: "2px 9px",
            }}>EMG Fact</span>
            <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 300 }}>{fact.date}</span>
          </div>
          <div style={{ fontSize: "clamp(13px, 1.8vw, 15px)", fontWeight: 600, color: "var(--text)", lineHeight: 1.35, marginBottom: 4 }}>
            {fact.title}
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: 540 }}>
            {fact.preview}
          </p>
        </div>

        {/* Chevron */}
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          border: `1px solid ${expanded ? fact.accent + "50" : "var(--border)"}`,
          background: expanded ? `${fact.accent}12` : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
          flexShrink: 0,
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
            style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}>
            <path d="M2 3.5l3 3 3-3" stroke={expanded ? fact.accent : "var(--text-tertiary)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Expanded slides */}
      {expanded && (
        <div style={{ borderBottom: "1px solid var(--border)", borderTop: `1px solid ${fact.accent}25` }}>
          <div style={{
            padding: "32px 28px",
            background: `linear-gradient(135deg, ${fact.accent}06 0%, var(--bg) 100%)`,
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "start" }}>
              <div>
                <h3 style={{ fontSize: "clamp(16px, 2.2vw, 20px)", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.4px", lineHeight: 1.25, marginBottom: 16 }}>
                  {slide.heading}
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.8, margin: 0, maxWidth: 540 }}>
                  {slide.body}
                </p>

                {slide.stat && (
                  <div style={{
                    marginTop: 20, padding: "14px 18px",
                    background: `${fact.accent}08`,
                    border: `1px solid ${fact.accent}25`,
                    borderLeft: `3px solid ${fact.accent}`,
                    borderRadius: "0 10px 10px 0",
                    display: "inline-block",
                  }}>
                    {slide.stat.split("\n").map((line, i) => (
                      <div key={i} style={{
                        fontSize: i % 2 === 0 ? 18 : 11,
                        fontWeight: i % 2 === 0 ? 700 : 300,
                        color: i % 2 === 0 ? fact.accent : "var(--text-tertiary)",
                        lineHeight: 1.4,
                        letterSpacing: i % 2 === 0 ? "-0.5px" : "0.04em",
                        textTransform: i % 2 === 1 ? "uppercase" : "none",
                      }}>{line}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Slide navigation */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingTop: 4 }}>
                {fact.slides.map((_, i) => (
                  <button key={i} onClick={() => setSlideIdx(i)} style={{
                    width: i === slideIdx ? 6 : 5,
                    height: i === slideIdx ? 24 : 5,
                    borderRadius: 100,
                    background: i === slideIdx ? fact.accent : "var(--border)",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "all 0.2s",
                  }}/>
                ))}
              </div>
            </div>

            {/* Prev / Next */}
            {fact.slides.length > 1 && (
              <div style={{ display: "flex", gap: 8, marginTop: 24, alignItems: "center" }}>
                <button onClick={() => setSlideIdx(i => Math.max(i - 1, 0))} disabled={slideIdx === 0}
                  style={{ background: "none", border: `1px solid var(--border)`, borderRadius: 100, padding: "6px 16px", fontSize: 12, color: slideIdx === 0 ? "var(--text-tertiary)" : "var(--text-secondary)", cursor: slideIdx === 0 ? "default" : "pointer", fontFamily: "var(--font)", transition: "all 0.15s" }}
                  onMouseEnter={e => { if (slideIdx > 0) e.currentTarget.style.borderColor = fact.accent }}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >← Prev</button>
                <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 300 }}>
                  {slideIdx + 1} / {fact.slides.length}
                </span>
                <button onClick={() => setSlideIdx(i => Math.min(i + 1, fact.slides.length - 1))} disabled={slideIdx === fact.slides.length - 1}
                  style={{ background: "none", border: `1px solid var(--border)`, borderRadius: 100, padding: "6px 16px", fontSize: 12, color: slideIdx === fact.slides.length - 1 ? "var(--text-tertiary)" : "var(--text-secondary)", cursor: slideIdx === fact.slides.length - 1 ? "default" : "pointer", fontFamily: "var(--font)", transition: "all 0.15s" }}
                  onMouseEnter={e => { if (slideIdx < fact.slides.length - 1) e.currentTarget.style.borderColor = fact.accent }}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >Next →</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Journal Entry ─────────────────────────────────────────────────────────────

const TAG_MAP = {
  "Launch":     "#FF2D78",
  "Content":    "#8B5CF6",
  "Milestone":  "#10B981",
  "Open source":"#3B82F6",
  "Research":   "#F59E0B",
}

function JournalEntry({ entry, navigate, isLast }) {
  const [expanded, setExpanded] = useState(false)
  const accent = TAG_MAP[entry.tag] || entry.accent

  return (
    <div style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: "0 20px" }}>
      {/* Timeline column */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%", flexShrink: 0, marginTop: 18,
          background: accent, boxShadow: `0 0 8px ${accent}60`,
        }}/>
        {!isLast && (
          <div style={{ width: 1, flex: 1, background: "var(--border)", minHeight: 24, marginTop: 6 }}/>
        )}
      </div>

      {/* Content column */}
      <div style={{ paddingBottom: isLast ? 0 : 24 }}>
        <div
          onClick={() => setExpanded(e => !e)}
          style={{
            cursor: "pointer",
            padding: "14px 20px",
            borderRadius: 10,
            background: expanded ? `${accent}06` : "transparent",
            border: `1px solid ${expanded ? accent + "25" : "transparent"}`,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = "var(--bg-secondary)" }}
          onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = "transparent" }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 9, fontWeight: 700, color: accent,
              background: `${accent}15`, border: `1px solid ${accent}30`,
              borderRadius: 100, padding: "2px 8px", textTransform: "uppercase", letterSpacing: "0.06em",
            }}>{entry.tag}</span>
            <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 300 }}>{entry.date}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", lineHeight: 1.3, marginBottom: expanded ? 12 : 0 }}>
            {entry.title}
          </div>

          {/* Expanded body */}
          {expanded && (
            <div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.75, margin: "0 0 12px" }}>
                {entry.body}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 300 }}>{entry.meta}</span>
                {entry.link && (
                  <button onClick={e => { e.stopPropagation(); navigate(entry.link) }} style={{
                    background: "none", border: `1px solid ${accent}40`, color: accent,
                    borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 500,
                    cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = `${accent}12`}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >View →</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Blog() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* ── Hero ── */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: 380, display: "flex", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
        {/* LiquidChrome background */}
        <LiquidChrome baseColor={[0.07, 0.0, 0.18]} speed={0.10} amplitude={0.22} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

        {/* EMG pulse overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.55 }}>
          <EMGPulse />
        </div>

        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(3,0,18,0.72) 0%, rgba(3,0,18,0.60) 60%, rgba(3,0,18,0.88) 100%)", zIndex: 2 }}/>

        <div style={{ position: "relative", zIndex: 3, width: "100%", maxWidth: 860, margin: "0 auto", padding: "100px 32px 64px" }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,45,120,0.12)", border: "1px solid rgba(255,45,120,0.3)", borderRadius: 100, padding: "4px 14px", marginBottom: 20 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "heroPulse 2s infinite" }}/>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>EMG Facts & Project Updates</span>
            </div>
            <style>{`@keyframes heroPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>

            <h1 style={{ fontSize: "clamp(32px, 6vw, 58px)", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.05, color: "#fff", marginBottom: 18, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
              What's happening<br/>
              <span style={{ color: "var(--accent)" }}>at myojam.</span>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.70)", fontWeight: 300, lineHeight: 1.75, maxWidth: 460, marginBottom: 32 }}>
              EMG science explained in short form, and a running log of every launch, milestone, and decision since September 2024.
            </p>

            {/* Stat strip */}
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[
                [`${EMG_FACTS.length}`, "EMG fact series"],
                [`${JOURNAL.length}`, "project updates"],
                ["Sep 2024", "project start"],
              ].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>{val}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontWeight: 300, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px 80px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }}>

        {/* ── Left: EMG Facts ── */}
        <div>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <SectionPill>EMG Facts</SectionPill>
            </div>
            <h2 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 700, letterSpacing: "-0.8px", color: "var(--text)", marginBottom: 6 }}>
              The science, explained short.
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7, marginBottom: 28, maxWidth: 480 }}>
              Each fact unpacks one hard technical truth about surface EMG — the kind of thing that sounds simple until you look at the numbers. Click any card to read the full series.
            </p>
          </Reveal>

          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            {EMG_FACTS.map((fact) => (
              <FactCard key={fact.id} fact={fact} />
            ))}
          </div>

          {/* Bottom nav to education */}
          <Reveal delay={0.1}>
            <div style={{ marginTop: 20, padding: "18px 20px", background: "var(--bg-secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: 360 }}>
                Want to go deeper? The education hub has 11 full-length articles covering EMG neuroscience, signal processing, and machine learning.
              </p>
              <button onClick={() => navigate("/education")} style={{ flexShrink: 0, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 100, padding: "10px 22px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font)", boxShadow: "0 4px 14px rgba(255,45,120,0.28)", transition: "transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(255,45,120,0.4)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(255,45,120,0.28)" }}
              >Education hub →</button>
            </div>
          </Reveal>
        </div>

        {/* ── Right: Project Journal ── */}
        <div style={{ position: "sticky", top: 24 }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <SectionPill>Project journal</SectionPill>
            </div>
            <h2 style={{ fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, letterSpacing: "-0.6px", color: "var(--text)", marginBottom: 6 }}>
              Every step. Documented.
            </h2>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7, marginBottom: 24 }}>
              From the first frog-leg moment to v1.0.0 — every launch, milestone, and honest mistake.
            </p>
          </Reveal>

          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 18px", maxHeight: "72vh", overflowY: "auto" }}>
            {JOURNAL.map((entry, i) => (
              <Reveal key={entry.id} delay={i * 0.03}>
                <JournalEntry entry={entry} navigate={navigate} isLast={i === JOURNAL.length - 1} />
              </Reveal>
            ))}
          </div>

          {/* Changelog link */}
          <Reveal delay={0.15}>
            <button onClick={() => navigate("/changelog")} style={{ marginTop: 12, width: "100%", background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px", fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font)", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M3.5 4h5M3.5 6h5M3.5 8h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              Full technical changelog →
            </button>
          </Reveal>
        </div>
      </div>

      <Footer />
    </div>
  )
}
