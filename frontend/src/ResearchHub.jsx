import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, SectionPill } from "./Animate"
import NeuralNoise from "./components/NeuralNoise"

const PAPER = {
  type: "Technical Report",
  date: "April 2026",
  access: "Open Access",
  license: "MIT",
  doi: null,
  title: "myojam: Open-Source Surface EMG Gesture Classification for Assistive Human-Computer Interaction",
  authors: [{ name: "myojam Research Team", affil: "myojam Project, Independent Research, Toronto, Ontario, Canada" }],
  abstract: "We present myojam, an open-source surface electromyography (sEMG) gesture classification system achieving 84.85% cross-subject accuracy across six hand gesture classes on the Ninapro DB5 benchmark. The system employs a Random Forest classifier trained on 64-dimensional time-domain feature vectors extracted from 200-sample sliding windows across 16 electrode channels at 200 Hz. Training data comprises 16,269 labelled windows from 10 intact-limb subjects. We describe the complete signal processing pipeline, hyperparameter optimisation procedure, and cross-subject evaluation protocol, and discuss implications for accessible assistive technology. All code, trained models, and documentation are released under the MIT licence.",
  keywords: ["Surface electromyography", "Gesture classification", "Random Forest", "Assistive technology", "Human-computer interaction", "Ninapro", "Signal processing", "Motor unit"],
  sections: 6,
  figures: 3,
  references: 4,
  results: [
    { label: "Index flex",  val: 88, color: "#FF2D78" },
    { label: "Fist",        val: 87, color: "#EF4444" },
    { label: "Thumb flex",  val: 87, color: "#F59E0B" },
    { label: "Pinky flex",  val: 82, color: "#10B981" },
    { label: "Middle flex", val: 83, color: "#3B82F6" },
    { label: "Ring flex",   val: 80, color: "#8B5CF6" },
  ],
}

const BIBTEX = `@techreport{wong2026myojam,
  title     = {myojam: Open-Source Surface EMG Gesture Classification
               for Assistive Human-Computer Interaction},
  author    = {myojam Research Team},
  year      = {2026},
  month     = {April},
  institution = {myojam Project},
  url       = {https://myojam.com/research/paper},
  note      = {MIT Licence. Code: https://github.com/Jaden300/myojam}
}`

const VALUES = [
  {
    color: "#10B981",
    title: "Open access by default",
    body: "The full paper, all data, and the trained model are publicly available at no cost, with no login required. Research that costs money to read cannot serve the community it claims to benefit.",
  },
  {
    color: "#3B82F6",
    title: "Reproducible by design",
    body: "Every number in the paper - every accuracy figure, every hyperparameter, every evaluation decision - can be reproduced from the public codebase. No unreleased data, no hidden preprocessing steps.",
  },
  {
    color: "#8B5CF6",
    title: "Built on public data",
    body: "The Ninapro DB5 dataset is publicly available and widely used. Using it means the benchmark is independently verifiable and directly comparable to other published work.",
  },
]

export default function ResearchHub() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [abstractOpen, setAbstractOpen] = useState(false)

  function copyCite() {
    navigator.clipboard.writeText(BIBTEX).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <Navbar />

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)", padding: "100px 32px 72px" }}>
        <NeuralNoise color={[0.06, 0.44, 0.86]} opacity={0.85} speed={0.0006} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,0,18,0.70)", zIndex: 1 }} />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal>
            <SectionPill>Research</SectionPill>
            <h1 style={{ fontSize: "clamp(36px,6vw,64px)", fontWeight: 600, letterSpacing: "-2px", lineHeight: 1.04, color: "#fff", marginBottom: 20 }}>
              The research<br /><span style={{ color: "#3B82F6" }}>behind myojam.</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", fontWeight: 300, lineHeight: 1.75, maxWidth: 520, marginBottom: 44 }}>
              Open-access technical documentation of the signal processing pipeline, machine learning methodology, and evaluation protocol that powers myojam's gesture classifier.
            </p>
          </Reveal>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              ["4", "Technical reports"],
              ["84.85%", "Cross-subject accuracy"],
              ["Open", "Access"],
              ["MIT", "License"],
            ].map(([val, label]) => (
              <div key={label} style={{ animation: "fadeUp 0.5s ease both" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>{val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 300, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explorer CTA banner */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)", padding: "20px 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,45,120,0.12)", border: "1px solid rgba(255,45,120,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>⬡</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 1 }}>Interactive Research Explorer</div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 300 }}>4 animated visualizations — feasibility gap, classifier race, LOSO folds, feature importance</div>
            </div>
          </div>
          <button onClick={() => navigate("/research/explorer")} style={{
            background: "var(--accent)", color: "#fff", border: "none",
            borderRadius: 100, padding: "10px 22px", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font)", flexShrink: 0,
            boxShadow: "0 4px 16px rgba(255,45,120,0.25)", transition: "transform 0.15s, box-shadow 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,45,120,0.35)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,45,120,0.25)" }}
          >Explore the data →</button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "64px 32px 80px" }}>

        {/* Reading guide */}
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <SectionPill>Reading guide</SectionPill>
            <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 600, letterSpacing: "-0.8px", color: "var(--text)", marginBottom: 8 }}>
              How the four reports connect
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.75, marginBottom: 28, maxWidth: 540 }}>
              Each report answers a different question. Read them in order for the full picture, or jump to the one that matches your interest.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {[
                { step:"01", label:"Start here", title:"Technical Report", question:"What was built, how, and what accuracy did it achieve?", path:"/research/paper", color:"#FF2D78", note:"Core methodology · Results · 6 sections" },
                { step:"02", label:"Then read", title:"Classifier Analysis", question:"Why Random Forest? How does it compare to SVM, k-NN, and LDA?", path:"/research/classifier-analysis", color:"#8B5CF6", note:"Model comparison · Feature importance" },
                { step:"03", label:"Then read", title:"Windowing Analysis", question:"How does window size affect the accuracy-latency tradeoff?", path:"/research/windowing-analysis", color:"#3B82F6", note:"Window size · Overlap · Latency" },
                { step:"04", label:"Finally", title:"Variability Review", question:"What breaks down in real-world deployment — and why?", path:"/research/variability-review", color:"#10B981", note:"Robustness · Domain adaptation · Gap analysis" },
              ].map(({ step, label, title, question, path, color, note }, i) => (
                <div key={step} onClick={() => navigate(path)} style={{
                  padding: "22px 20px",
                  borderRight: i < 3 ? "1px solid var(--border)" : "none",
                  background: "var(--bg)",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  borderTop: `3px solid ${color}`,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${color}06`}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--bg)"}
                >
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                    <span style={{ fontSize:10, fontWeight:700, color, background:`${color}15`, border:`1px solid ${color}30`, borderRadius:100, padding:"2px 8px" }}>{step}</span>
                    <span style={{ fontSize:10, color:"var(--text-tertiary)", fontWeight:300 }}>{label}</span>
                  </div>
                  <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:8, lineHeight:1.3 }}>{title}</div>
                  <p style={{ fontSize:11, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.6, margin:"0 0 10px" }}>{question}</p>
                  <div style={{ fontSize:10, color:"var(--text-tertiary)", fontWeight:300 }}>{note}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Findings at a glance */}
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <SectionPill>Findings at a glance</SectionPill>
            <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 600, letterSpacing: "-0.8px", color: "var(--text)", marginBottom: 32 }}>
              What the numbers show
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

              {/* Classifier comparison */}
              <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "24px 28px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>Classifier comparison — Ninapro DB5</div>
                {[
                  { label: "Random Forest", val: 84.85, color: "#FF2D78" },
                  { label: "SVM (RBF)",     val: 82.30, color: "#8B5CF6" },
                  { label: "k-NN (k=5)",    val: 76.40, color: "#3B82F6" },
                  { label: "LDA",           val: 71.80, color: "#10B981" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color }}>{val}%</span>
                    </div>
                    <div style={{ height: 6, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 4, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 16, fontSize: 11, color: "var(--text-tertiary)", fontWeight: 300, lineHeight: 1.6 }}>
                  10-fold cross-validation · 10 subjects · 6-class gesture recognition · window size 200 samples
                </div>
              </div>

              {/* Key findings */}
              <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 12 }}>
                {[
                  { val: "84.85%", label: "Cross-subject accuracy", sub: "Random Forest on held-out subjects never seen during training", color: "#FF2D78" },
                  { val: "32pp",   label: "Cross-subject gap",       sub: "Intra-subject ~96% vs cross-subject 84.85% — unsolved open problem", color: "#F59E0B" },
                  { val: "1,250ms", label: "Optimal window",        sub: "Window size where accuracy peaks before motion blur degrades signal", color: "#8B5CF6" },
                  { val: "<300ms", label: "Prosthetic threshold",   sub: "End-to-end latency required for natural prosthetic feel", color: "#3B82F6" },
                ].map(({ val, label, sub, color }) => (
                  <div key={label} style={{
                    border: `1px solid ${color}20`,
                    borderLeft: `3px solid ${color}`,
                    borderRadius: "2px 8px 8px 2px",
                    background: `${color}08`,
                    padding: "12px 16px",
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color, letterSpacing: "-1px", flexShrink: 0, lineHeight: 1.2, paddingTop: 2 }}>{val}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 300, lineHeight: 1.5 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </Reveal>

        {/* Paper card */}
        <Reveal>
          <div style={{ borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden", marginBottom: 48, background: "var(--bg-secondary)" }}>

            {/* Header band */}
            <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.10) 0%, transparent 100%)", borderBottom: "1px solid var(--border)", padding: "32px 40px 28px" }}>
              {/* Badges */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: "#3B82F6", background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 100, padding: "3px 12px" }}>{PAPER.type}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: "#10B981", background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 100, padding: "3px 12px" }}>{PAPER.access}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: "var(--accent)", background: "var(--accent-soft)", border: "1px solid rgba(255,45,120,0.2)", borderRadius: 100, padding: "3px 12px" }}>{PAPER.license} Licence</span>
                <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 300, alignSelf: "center" }}>{PAPER.date}</span>
              </div>

              {/* Title */}
              <h2 style={{ fontSize: "clamp(18px,2.8vw,26px)", fontWeight: 700, color: "var(--text)", lineHeight: 1.25, letterSpacing: "-0.5px", marginBottom: 16, fontFamily: "Georgia, 'Times New Roman', serif", maxWidth: 680 }}>
                {PAPER.title}
              </h2>

              {/* Authors */}
              <div style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 400, marginBottom: 4 }}>
                {PAPER.authors.map(a => a.name).join(", ")}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 300, fontStyle: "italic" }}>
                {PAPER.authors[0].affil}
              </div>
            </div>

            {/* Abstract */}
            <div style={{ padding: "28px 40px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.10em", marginBottom: 12, fontFamily: "Georgia, serif" }}>Abstract</div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85, fontWeight: 300, fontFamily: "Georgia, 'Times New Roman', serif", margin: 0 }}>
                {PAPER.abstract}
              </p>
            </div>

            {/* Keywords */}
            <div style={{ padding: "20px 40px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", marginRight: 10 }}>Keywords</span>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 300, fontStyle: "italic" }}>
                {PAPER.keywords.join("  ·  ")}
              </span>
            </div>

            {/* Per-gesture accuracy */}
            <div style={{ padding: "28px 40px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Per-gesture recall (cross-subject)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 480 }}>
                {PAPER.results.map(r => (
                  <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 76, fontSize: 12, color: "var(--text-secondary)", fontWeight: 300, textAlign: "right", flexShrink: 0 }}>{r.label}</div>
                    <div style={{ flex: 1, height: 7, background: "var(--border)", borderRadius: 100, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${r.val}%`, background: r.color, borderRadius: 100 }} />
                    </div>
                    <div style={{ width: 36, fontSize: 12, fontWeight: 600, color: r.color, flexShrink: 0 }}>{r.val}%</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-tertiary)", fontWeight: 300 }}>Mean accuracy: 84.85%  ·  LOSO cross-validation  ·  10 subjects</div>
            </div>

            {/* Paper metadata */}
            <div style={{ padding: "20px 40px", borderBottom: "1px solid var(--border)", display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[
                [`${PAPER.sections} sections`, "Full paper"],
                [`${PAPER.figures} figures`, "Including confusion matrix"],
                [`${PAPER.references} references`, "Cited literature"],
                ["16,269 windows", "Training data"],
              ].map(([val, sub]) => (
                <div key={val}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.3px" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 300, marginTop: 2 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ padding: "24px 40px", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={() => navigate("/research/paper")} style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 100, padding: "12px 28px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font)", boxShadow: "0 4px 16px rgba(59,130,246,0.3)", transition: "transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(59,130,246,0.4)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(59,130,246,0.3)" }}
              >Read full paper →</button>
              <button onClick={copyCite} style={{ background: copied ? "rgba(16,185,129,0.10)" : "var(--bg)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "var(--border)"}`, borderRadius: 100, padding: "12px 24px", fontSize: 14, fontWeight: 400, color: copied ? "#10B981" : "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.2s" }}>
                {copied ? "✓ Copied" : "Copy BibTeX"}
              </button>
              <a href="https://github.com/Jaden300/myojam" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 300, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-tertiary)"}
              >View source code ↗</a>
            </div>
          </div>
        </Reveal>

        {/* Second paper card */}
        <Reveal delay={0.05}>
          <div style={{ borderRadius:"var(--radius)", border:"1px solid var(--border)", overflow:"hidden", marginBottom:48, background:"var(--bg-secondary)" }}>
            <div style={{ background:"linear-gradient(135deg, rgba(139,92,246,0.10) 0%, transparent 100%)", borderBottom:"1px solid var(--border)", padding:"32px 40px 28px" }}>
              <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, fontWeight:500, color:"#8B5CF6", background:"rgba(139,92,246,0.12)", border:"1px solid rgba(139,92,246,0.25)", borderRadius:100, padding:"3px 12px" }}>Technical Report</span>
                <span style={{ fontSize:11, fontWeight:500, color:"#10B981", background:"rgba(16,185,129,0.10)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:100, padding:"3px 12px" }}>Open Access</span>
                <span style={{ fontSize:11, fontWeight:500, color:"var(--accent)", background:"var(--accent-soft)", border:"1px solid rgba(255,45,120,0.2)", borderRadius:100, padding:"3px 12px" }}>MIT Licence</span>
                <span style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300, alignSelf:"center" }}>April 2026</span>
              </div>
              <h2 style={{ fontSize:"clamp(16px,2.4vw,22px)", fontWeight:700, color:"var(--text)", lineHeight:1.3, letterSpacing:"-0.4px", marginBottom:16, fontFamily:"Georgia, 'Times New Roman', serif", maxWidth:680 }}>
                Cross-Subject sEMG Gesture Classification: Feature Engineering and Classifier Comparison on the Ninapro DB5 Benchmark
              </h2>
              <div style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:400, marginBottom:4 }}>myojam Research Team</div>
              <div style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300, fontStyle:"italic" }}>myojam Project, Independent Research, Toronto, Ontario, Canada</div>
            </div>

            <div style={{ padding:"28px 40px", borderBottom:"1px solid var(--border)" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"var(--text)", textTransform:"uppercase", letterSpacing:"0.10em", marginBottom:12, fontFamily:"Georgia, serif" }}>Abstract</div>
              <p style={{ fontSize:14, color:"var(--text-secondary)", lineHeight:1.85, fontWeight:300, fontFamily:"Georgia, 'Times New Roman', serif", margin:0 }}>
                A systematic evaluation of four classical machine learning classifiers - Random Forest, SVM (RBF), k-NN, and LDA - for cross-subject sEMG gesture recognition on Ninapro DB5. All classifiers operate on a 64-dimensional time-domain feature vector across 16 channels under leave-one-subject-out evaluation. Random Forest achieves 84.85% mean cross-subject accuracy, outperforming SVM by 2.55 pp, k-NN by 8.45 pp, and LDA by 13.05 pp. Per-fold analysis identifies inter-subject physiological variability as the dominant performance bottleneck. Feature importance analysis via MDI highlights MAV and RMS as the primary discriminative features and localises the most informative electrode positions.
              </p>
            </div>

            <div style={{ padding:"20px 40px", borderBottom:"1px solid var(--border)" }}>
              <span style={{ fontSize:11, fontWeight:600, color:"var(--text)", marginRight:10 }}>Keywords</span>
              <span style={{ fontSize:12, color:"var(--text-secondary)", fontWeight:300, fontStyle:"italic" }}>
                Cross-subject generalisation  ·  Random Forest  ·  SVM  ·  Feature importance  ·  LOSO evaluation  ·  Ninapro DB5
              </span>
            </div>

            <div style={{ padding:"20px 40px", borderBottom:"1px solid var(--border)", display:"flex", gap:32, flexWrap:"wrap" }}>
              {[
                ["8 sections", "Full paper"],
                ["4 figures", "Interactive charts"],
                ["12 references", "Cited literature"],
                ["4 classifiers", "Systematically compared"],
              ].map(([val, sub]) => (
                <div key={val}>
                  <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", letterSpacing:"-0.3px" }}>{val}</div>
                  <div style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300, marginTop:2 }}>{sub}</div>
                </div>
              ))}
            </div>

            <div style={{ padding:"24px 40px", display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
              <button onClick={()=>navigate("/research/classifier-analysis")} style={{ background:"#8B5CF6", color:"#fff", border:"none", borderRadius:100, padding:"12px 28px", fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"var(--font)", boxShadow:"0 4px 16px rgba(139,92,246,0.3)", transition:"transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(139,92,246,0.4)" }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(139,92,246,0.3)" }}
              >Read full paper →</button>
              <a href="https://github.com/Jaden300/myojam" target="_blank" rel="noreferrer" style={{ fontSize:13, color:"var(--text-tertiary)", fontWeight:300, textDecoration:"none", transition:"color 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.color="var(--accent)"}
                onMouseLeave={e=>e.currentTarget.style.color="var(--text-tertiary)"}
              >View source code ↗</a>
            </div>
          </div>
        </Reveal>

        {/* Third paper card */}
        <Reveal delay={0.10}>
          <div style={{ borderRadius:"var(--radius)", border:"1px solid var(--border)", overflow:"hidden", marginBottom:48, background:"var(--bg-secondary)" }}>
            <div style={{ background:"linear-gradient(135deg, rgba(16,185,129,0.10) 0%, transparent 100%)", borderBottom:"1px solid var(--border)", padding:"32px 40px 28px" }}>
              <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, fontWeight:500, color:"#10B981", background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:100, padding:"3px 12px" }}>Structured Review</span>
                <span style={{ fontSize:11, fontWeight:500, color:"#10B981", background:"rgba(16,185,129,0.10)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:100, padding:"3px 12px" }}>Open Access</span>
                <span style={{ fontSize:11, fontWeight:500, color:"var(--accent)", background:"var(--accent-soft)", border:"1px solid rgba(255,45,120,0.2)", borderRadius:100, padding:"3px 12px" }}>MIT Licence</span>
                <span style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300, alignSelf:"center" }}>April 2026</span>
              </div>
              <h2 style={{ fontSize:"clamp(16px,2.4vw,22px)", fontWeight:700, color:"var(--text)", lineHeight:1.3, letterSpacing:"-0.4px", marginBottom:16, fontFamily:"Georgia, 'Times New Roman', serif", maxWidth:680 }}>
                Origins and Mitigation of Inter-Subject and Inter-Session Variability in Surface Electromyographic Gesture Classification: A Structured Review
              </h2>
              <div style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:400, marginBottom:4 }}>myojam Research Team</div>
              <div style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300, fontStyle:"italic" }}>myojam Project, Independent Research, Toronto, Ontario, Canada</div>
            </div>

            <div style={{ padding:"28px 40px", borderBottom:"1px solid var(--border)" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"var(--text)", textTransform:"uppercase", letterSpacing:"0.10em", marginBottom:12, fontFamily:"Georgia, serif" }}>Abstract</div>
              <p style={{ fontSize:14, color:"var(--text-secondary)", lineHeight:1.85, fontWeight:300, fontFamily:"Georgia, 'Times New Roman', serif", margin:0 }}>
                Variability in surface electromyographic (sEMG) signals across subjects and sessions remains the principal obstacle preventing laboratory-grade gesture classifiers from achieving reliable real-world deployment. This structured review synthesises evidence from 15 peer-reviewed publications to characterise the physiological, mechanical, and temporal origins of this variability, quantify its impact on classification accuracy, and evaluate signal-level, feature-level, and model-level mitigation strategies. Under within-subject evaluation, state-of-the-art classifiers report accuracies approaching 95%; under cross-subject, cross-session, cross-limb-position evaluation the same classifiers decline to 63%, a gap of 32 percentage points attributable in roughly equal measure to motor unit anatomy, electrode placement mechanics, and session-specific recording conditions. The present review finds that no single mitigation strategy closes this gap in isolation; cumulative application of standardised placement, whitening normalisation, session-adaptive calibration, and domain-adversarial training is estimated to recover 10.3 percentage points under realistic deployment conditions.
              </p>
            </div>

            <div style={{ padding:"20px 40px", borderBottom:"1px solid var(--border)" }}>
              <span style={{ fontSize:11, fontWeight:600, color:"var(--text)", marginRight:10 }}>Keywords</span>
              <span style={{ fontSize:12, color:"var(--text-secondary)", fontWeight:300, fontStyle:"italic" }}>
                Inter-subject variability  ·  sEMG  ·  Gesture classification  ·  Domain adaptation  ·  Motor unit anatomy  ·  Transfer learning
              </span>
            </div>

            <div style={{ padding:"20px 40px", borderBottom:"1px solid var(--border)", display:"flex", gap:32, flexWrap:"wrap" }}>
              {[
                ["9 sections", "Full review"],
                ["3 figures", "Interactive taxonomy & charts"],
                ["15 references", "Peer-reviewed sources"],
                ["32 pp gap", "Documented accuracy loss"],
              ].map(([val, sub]) => (
                <div key={val}>
                  <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", letterSpacing:"-0.3px" }}>{val}</div>
                  <div style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300, marginTop:2 }}>{sub}</div>
                </div>
              ))}
            </div>

            <div style={{ padding:"24px 40px", display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
              <button onClick={()=>navigate("/research/variability-review")} style={{ background:"#10B981", color:"#fff", border:"none", borderRadius:100, padding:"12px 28px", fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"var(--font)", boxShadow:"0 4px 16px rgba(16,185,129,0.3)", transition:"transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(16,185,129,0.4)" }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(16,185,129,0.3)" }}
              >Read full review →</button>
              <a href="https://github.com/Jaden300/myojam" target="_blank" rel="noreferrer" style={{ fontSize:13, color:"var(--text-tertiary)", fontWeight:300, textDecoration:"none", transition:"color 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.color="var(--accent)"}
                onMouseLeave={e=>e.currentTarget.style.color="var(--text-tertiary)"}
              >View source code ↗</a>
            </div>
          </div>
        </Reveal>

        {/* Fourth paper card */}
        <Reveal delay={0.15}>
          <div style={{ borderRadius:"var(--radius)", border:"1px solid var(--border)", overflow:"hidden", marginBottom:48, background:"var(--bg-secondary)" }}>
            <div style={{ background:"linear-gradient(135deg, rgba(6,182,212,0.10) 0%, transparent 100%)", borderBottom:"1px solid var(--border)", padding:"32px 40px 28px" }}>
              <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, fontWeight:500, color:"#06B6D4", background:"rgba(6,182,212,0.12)", border:"1px solid rgba(6,182,212,0.25)", borderRadius:100, padding:"3px 12px" }}>Empirical Study</span>
                <span style={{ fontSize:11, fontWeight:500, color:"#10B981", background:"rgba(16,185,129,0.10)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:100, padding:"3px 12px" }}>Open Access</span>
                <span style={{ fontSize:11, fontWeight:500, color:"var(--accent)", background:"var(--accent-soft)", border:"1px solid rgba(255,45,120,0.2)", borderRadius:100, padding:"3px 12px" }}>MIT Licence</span>
                <span style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300, alignSelf:"center" }}>April 2026</span>
              </div>
              <h2 style={{ fontSize:"clamp(16px,2.4vw,22px)", fontWeight:700, color:"var(--text)", lineHeight:1.3, letterSpacing:"-0.4px", marginBottom:16, fontFamily:"Georgia, 'Times New Roman', serif", maxWidth:680 }}>
                Temporal Segmentation Parameters in Surface Electromyographic Gesture Classification: A Systematic Empirical Analysis of Window Duration, Overlap Ratio, and Increment Selection
              </h2>
              <div style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:400, marginBottom:4 }}>myojam Research Team</div>
              <div style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300, fontStyle:"italic" }}>myojam Project, Independent Research, Toronto, Ontario, Canada</div>
            </div>

            <div style={{ padding:"28px 40px", borderBottom:"1px solid var(--border)" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"var(--text)", textTransform:"uppercase", letterSpacing:"0.10em", marginBottom:12, fontFamily:"Georgia, serif" }}>Abstract</div>
              <p style={{ fontSize:14, color:"var(--text-secondary)", lineHeight:1.85, fontWeight:300, fontFamily:"Georgia, 'Times New Roman', serif", margin:0 }}>
                A systematic ablation of window duration (100 ms to 2000 ms) for cross-subject sEMG classification on Ninapro DB5 under LOSO evaluation. Accuracy increases from 62.4% at 100 ms to a peak of 85.3% at 1250 ms before declining at 2000 ms due to stationarity violation. A formal latency-accuracy analysis identifies a prosthetic feasibility gap: no window duration simultaneously satisfies the ≤300 ms clinical latency threshold and ≥80% accuracy requirement for 200 Hz hardware. Overlap ratio does not affect per-window accuracy; 75% overlap is recommended for decision rate. Five-window majority voting recovers 1.8 pp at the cost of 1000 ms additional latency.
              </p>
            </div>

            <div style={{ padding:"20px 40px", borderBottom:"1px solid var(--border)" }}>
              <span style={{ fontSize:11, fontWeight:600, color:"var(--text)", marginRight:10 }}>Keywords</span>
              <span style={{ fontSize:12, color:"var(--text-secondary)", fontWeight:300, fontStyle:"italic" }}>
                Window duration  ·  Overlap ratio  ·  EMG latency  ·  Prosthetic feasibility gap  ·  Majority voting  ·  Real-time control
              </span>
            </div>

            <div style={{ padding:"20px 40px", borderBottom:"1px solid var(--border)", display:"flex", gap:32, flexWrap:"wrap" }}>
              {[
                ["9 sections", "Full paper"],
                ["3 figures", "Charts & SVG diagrams"],
                ["15 references", "Cited literature"],
                ["8 conditions", "Window durations tested"],
              ].map(([val, sub]) => (
                <div key={val}>
                  <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", letterSpacing:"-0.3px" }}>{val}</div>
                  <div style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300, marginTop:2 }}>{sub}</div>
                </div>
              ))}
            </div>

            <div style={{ padding:"24px 40px", display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
              <button onClick={()=>navigate("/research/windowing-analysis")} style={{ background:"#06B6D4", color:"#fff", border:"none", borderRadius:100, padding:"12px 28px", fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"var(--font)", boxShadow:"0 4px 16px rgba(6,182,212,0.3)", transition:"transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(6,182,212,0.4)" }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(6,182,212,0.3)" }}
              >Read full paper →</button>
              <a href="https://github.com/Jaden300/myojam" target="_blank" rel="noreferrer" style={{ fontSize:13, color:"var(--text-tertiary)", fontWeight:300, textDecoration:"none", transition:"color 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.color="var(--accent)"}
                onMouseLeave={e=>e.currentTarget.style.color="var(--text-tertiary)"}
              >View source code ↗</a>
            </div>
          </div>
        </Reveal>

        {/* Research values */}
        <Reveal>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>Our commitments</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 56 }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border)", borderTop: `3px solid ${v.color}`, padding: "24px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>{v.title}</div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, fontWeight: 300, margin: 0 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Citation block */}
        <Reveal delay={0.1}>
          <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "28px 32px", marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Cite this work</div>
              <button onClick={copyCite} style={{ background: copied ? "rgba(16,185,129,0.10)" : "var(--bg)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "var(--border)"}`, borderRadius: 100, padding: "5px 14px", fontSize: 11, fontWeight: 500, color: copied ? "#10B981" : "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.2s" }}>
                {copied ? "✓ Copied" : "Copy BibTeX"}
              </button>
            </div>
            <pre style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap", fontFamily: "monospace", margin: 0 }}>{BIBTEX}</pre>
          </div>
        </Reveal>

        {/* Resources CTA */}
        <Reveal delay={0.15}>
          <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, transparent 100%)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: "var(--radius)", padding: "36px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Want to go deeper?</div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7, margin: 0, maxWidth: 440 }}>
                The resources page links to the foundational papers, public datasets, and software libraries that underpin this work and the broader EMG research field.
              </p>
            </div>
            <button onClick={() => navigate("/resources")} style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 100, padding: "12px 24px", fontSize: 14, fontWeight: 400, cursor: "pointer", fontFamily: "var(--font)", flexShrink: 0, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#3B82F6"; e.currentTarget.style.color = "#3B82F6" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)" }}
            >Browse resources →</button>
          </div>
        </Reveal>
      </div>

      <Footer />
    </div>
  )
}
