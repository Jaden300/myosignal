import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Footer from "./Footer"
import { Reveal, SectionPill } from "./Animate"
import NeuralNoise from "./components/NeuralNoise"

const ARTICLES = [
  {
    slug: "/education/emg-explainer",
    tag: "Foundations",
    title: "The science of muscle-computer interfaces",
    summary: "What is EMG, how does surface signal acquisition work, and how does myojam turn a forearm twitch into a computer action? A full explainer from the biology up.",
    readTime: "8 min",
    author: "myojam team",
    date: "2026-04-06",
    dateLabel: "April 6, 2026",
    likes: 47,
    helpfulness: 1,
  },
  {
    slug: "/education/random-forest-emg",
    tag: "Machine Learning",
    title: "Why Random Forest? The classifier behind myojam",
    summary: "Why not a neural network? How ensemble tree methods handle noisy biomedical signals, and what the 84.85% cross-subject accuracy figure actually means in practice.",
    readTime: "7 min",
    author: "myojam team",
    date: "2026-03-15",
    dateLabel: "March 15, 2026",
    likes: 38,
    helpfulness: 2,
  },
  {
    slug: "/education/open-source-emg",
    tag: "Accessibility",
    title: "From lab to laptop: democratising EMG",
    summary: "EMG-based prosthetics have existed for 60 years. How open datasets, affordable hardware, and open-source tools are finally making muscle-computer control accessible.",
    readTime: "6 min",
    author: "myojam team",
    date: "2026-03-28",
    dateLabel: "March 28, 2026",
    likes: 31,
    helpfulness: 3,
  },
  {
    slug: "/education/ninapro-db5",
    tag: "Dataset",
    title: "Inside Ninapro DB5: the dataset that trains myojam",
    summary: "Where does the training data come from? What is Ninapro, what does DB5 contain, and what decisions went into turning 52 hand movements into a 6-class classifier?",
    readTime: "6 min",
    author: "myojam team",
    date: "2026-02-20",
    dateLabel: "February 20, 2026",
    likes: 24,
    helpfulness: 4,
  },
  {
    slug: "/education/muscle-memory",
    tag: "Neuroscience",
    title: "Muscle memory is real. It's just not in your muscles.",
    summary: "What neuroscientists actually mean by motor learning, how repetition reshapes the brain's motor cortex, and why gesture consistency matters more than raw model accuracy.",
    readTime: "5 min",
    author: "myojam team",
    date: "2026-01-14",
    dateLabel: "January 14, 2026",
    likes: 52,
    helpfulness: 5,
  },
  {
    slug: "/education/phantom-limb",
    tag: "Neuroscience",
    title: "The ghost in the electrode",
    summary: "Amputees generate measurable EMG from limbs they no longer have. This article explores what phantom limb signals reveal about cortical remapping and the future of prosthetic control.",
    readTime: "6 min",
    author: "myojam team",
    date: "2025-12-03",
    dateLabel: "December 3, 2025",
    likes: 61,
    helpfulness: 6,
  },
  {
    slug: "/education/why-emg-is-hard",
    tag: "Signal processing",
    title: "Why EMG is harder than it looks",
    summary: "Lab accuracy numbers are impressive. Real-world performance is not. A systematic breakdown of the six reasons EMG gesture classification keeps failing outside the lab.",
    readTime: "7 min",
    author: "myojam team",
    date: "2025-11-18",
    dateLabel: "November 18, 2025",
    likes: 44,
    helpfulness: 7,
  },
  {
    slug: "/education/build-your-own",
    tag: "Hardware",
    title: "Build your own EMG sensor for under $60",
    summary: "A complete weekend project guide: parts list, wiring, Arduino firmware, electrode placement, and signal quality checks. From zero to streaming muscle signals in an afternoon.",
    readTime: "8 min",
    author: "myojam team",
    date: "2025-10-30",
    dateLabel: "October 30, 2025",
    likes: 89,
    helpfulness: 8,
  },
  {
    slug: "/education/future-of-bci",
    tag: "Future",
    title: "After EMG: what comes next",
    summary: "Surface EMG is one point on a spectrum from skin-surface sensing to direct neural recording. Where the field is heading — high-density arrays, peripheral nerve interfaces, and motor cortex decoding.",
    readTime: "6 min",
    author: "myojam team",
    date: "2025-09-22",
    dateLabel: "September 22, 2025",
    likes: 73,
    helpfulness: 9,
  },
  {
    slug: "/education/ethics-of-emg",
    tag: "Ethics",
    title: "Who owns your muscle data?",
    summary: "EMG signals can identify you, reveal your health status, and expose conditions you don't know you have. As gesture interfaces go mainstream, these questions can't wait for regulation.",
    readTime: "5 min",
    author: "myojam team",
    date: "2025-08-14",
    dateLabel: "August 14, 2025",
    likes: 38,
    helpfulness: 10,
  },
  {
    slug: "/education/windowing-explained",
    tag: "Signal processing",
    title: "The art of cutting a signal into pieces",
    summary: "Window size, overlap, and step size are the least glamorous choices in EMG classification — and silently the most consequential. Here's what they actually control and why myojam made the choices it did.",
    readTime: "7 min",
    author: "myojam team",
    date: "2025-07-05",
    dateLabel: "July 5, 2025",
    likes: 29,
    helpfulness: 11,
  },
]

const TAG_COLORS = {
  "Foundations":       { bg:"rgba(255,45,120,0.08)",  border:"rgba(255,45,120,0.18)",  text:"#FF2D78"  },
  "Machine Learning":  { bg:"rgba(59,130,246,0.08)",  border:"rgba(59,130,246,0.18)",  text:"#3B82F6"  },
  "Accessibility":     { bg:"rgba(139,92,246,0.08)",  border:"rgba(139,92,246,0.18)",  text:"#8B5CF6"  },
  "Dataset":           { bg:"rgba(16,185,129,0.08)",  border:"rgba(16,185,129,0.18)",  text:"#10B981"  },
  "Neuroscience":      { bg:"rgba(245,158,11,0.08)",  border:"rgba(245,158,11,0.18)",  text:"#F59E0B"  },
  "Signal processing": { bg:"rgba(6,182,212,0.08)",   border:"rgba(6,182,212,0.18)",   text:"#06B6D4"  },
  "Hardware":          { bg:"rgba(132,204,22,0.08)",  border:"rgba(132,204,22,0.18)",  text:"#65A30D"  },
  "Future":            { bg:"rgba(168,85,247,0.08)",  border:"rgba(168,85,247,0.18)",  text:"#A855F7"  },
  "Ethics":            { bg:"rgba(236,72,153,0.08)",  border:"rgba(236,72,153,0.18)",  text:"#EC4899"  },
}

const SORT_OPTIONS = [
  { key: "latest",  label: "Latest"       },
  { key: "popular", label: "Most popular" },
  { key: "helpful", label: "Most helpful" },
]

function sorted(articles, key) {
  const a = [...articles]
  if (key === "latest")  return a.sort((x, y) => y.date.localeCompare(x.date))
  if (key === "popular") return a.sort((x, y) => y.likes - x.likes)
  if (key === "helpful") return a.sort((x, y) => x.helpfulness - y.helpfulness)
  return a
}

export default function Education() {
  const navigate = useNavigate()
  const [sortKey, setSortKey] = useState("latest")
  const [tagFilter, setTagFilter] = useState("All")

  const allTags = ["All", ...Object.keys(TAG_COLORS)]
  const filtered = tagFilter === "All" ? ARTICLES : ARTICLES.filter(a => a.tag === tagFilter)
  const displayed = sorted(filtered, sortKey)

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <style>{`
        .article-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .article-card:hover { transform: translateY(-4px) !important; box-shadow: 0 16px 40px rgba(0,0,0,0.1) !important; }
      `}</style>
      <Navbar />

      {/* ── Hero ── */}
      <div style={{ position:"relative", overflow:"hidden", borderBottom:"1px solid var(--border)", padding:"120px 32px 72px" }}>
        <NeuralNoise color={[0.06, 0.72, 0.56]} opacity={0.85} speed={0.0006} />
        <div style={{ position:"absolute", inset:0, background:"rgba(3,0,18,0.65)", zIndex:1 }}/>
        <div style={{ maxWidth:820, margin:"0 auto", position:"relative", zIndex:2 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:6,
            background:"rgba(255,255,255,0.08)", backdropFilter:"blur(8px)",
            border:"1px solid rgba(255,45,120,0.3)",
            borderRadius:100, padding:"5px 16px",
            fontSize:11, fontWeight:600, color:"var(--accent)",
            letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:32,
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--accent)", display:"inline-block" }}/>
            Education hub
          </div>
          <h1 style={{ fontSize:"clamp(36px,5.5vw,60px)", fontWeight:700, letterSpacing:"-0.03em", lineHeight:1.05, color:"#fff", marginBottom:24 }}>
            Learn about EMG<br/>
            <span style={{ color:"var(--accent)" }}>and assistive technology.</span>
          </h1>
          <p style={{ fontSize:17, lineHeight:1.75, color:"rgba(255,255,255,0.72)", fontWeight:300, maxWidth:"58ch" }}>
            In-depth articles on the science behind myojam — from how muscles generate electrical signals to how machine learning classifies them into computer actions.
          </p>
          <div style={{ display:"flex", gap:32, marginTop:40 }}>
            {[["11","articles"],["450+","total reads"],["9 topics","covered"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize:22, fontWeight:700, color:"#fff", letterSpacing:"-0.5px" }}>{val}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", fontWeight:300, textTransform:"uppercase", letterSpacing:"0.08em", marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Article list ── */}
      <div style={{ maxWidth:860, margin:"0 auto", padding:"48px 32px 80px" }}>

        {/* Controls */}
        <div style={{ marginBottom:36 }}>
          {/* Category filter */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
            {allTags.map(tag => {
              const active = tagFilter === tag
              const tc = TAG_COLORS[tag]
              const count = tag === "All" ? ARTICLES.length : ARTICLES.filter(a => a.tag === tag).length
              return (
                <button key={tag} onClick={() => setTagFilter(tag)} style={{
                  background: active ? (tc ? tc.bg : "var(--accent-soft)") : "transparent",
                  color: active ? (tc ? tc.text : "var(--accent)") : "var(--text-tertiary)",
                  border:`1px solid ${active ? (tc ? tc.border : "rgba(255,45,120,0.25)") : "var(--border)"}`,
                  borderRadius:100, padding:"5px 12px", fontSize:11,
                  fontWeight: active ? 600 : 300,
                  cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.15s",
                  display:"flex", alignItems:"center", gap:5,
                }}>
                  {tag}
                  <span style={{ background:"rgba(127,127,127,0.12)", borderRadius:100, padding:"1px 5px", fontSize:9, opacity:0.75 }}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Sort row */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300, textTransform:"uppercase", letterSpacing:"0.08em", marginRight:4 }}>Sort</span>
            {SORT_OPTIONS.map(opt => (
              <button key={opt.key} onClick={() => setSortKey(opt.key)} style={{
                background: sortKey===opt.key ? "var(--accent-soft)" : "transparent",
                border:`1px solid ${sortKey===opt.key ? "rgba(255,45,120,0.25)" : "var(--border)"}`,
                borderRadius:100, padding:"5px 14px", fontSize:12,
                fontWeight: sortKey===opt.key ? 500 : 300,
                color: sortKey===opt.key ? "var(--accent)" : "var(--text-tertiary)",
                cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.15s",
              }}>{opt.label}</button>
            ))}
            <span style={{ marginLeft:"auto", fontSize:12, color:"var(--text-tertiary)", fontWeight:300 }}>
              {displayed.length} article{displayed.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Card grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(360px, 1fr))", gap:14 }}>
          {displayed.map((a, i) => {
            const tc = TAG_COLORS[a.tag] || TAG_COLORS["Foundations"]
            const globalIdx = ARTICLES.findIndex(x => x.slug === a.slug)
            return (
              <Reveal key={a.slug} delay={i * 0.04}>
                <div
                  className="article-card"
                  onClick={() => navigate(a.slug)}
                  style={{
                    borderRadius:14, border:"1px solid var(--border)",
                    overflow:"hidden", cursor:"pointer", background:"var(--bg)",
                  }}
                >
                  {/* Cover strip */}
                  <div style={{
                    height:88, padding:"16px 20px",
                    background:`linear-gradient(135deg, ${tc.bg.replace("0.08","0.2")} 0%, var(--bg-secondary) 100%)`,
                    position:"relative", overflow:"hidden",
                    display:"flex", alignItems:"flex-end",
                    borderBottom:"1px solid var(--border)",
                  }}>
                    <span style={{
                      position:"absolute", right:12, top:-6,
                      fontSize:72, fontWeight:900, lineHeight:1,
                      color:tc.text, opacity:0.1, fontFamily:"monospace", userSelect:"none",
                    }}>
                      {String(globalIdx + 1).padStart(2, "0")}
                    </span>
                    <span style={{
                      position:"absolute", top:14, right:16,
                      fontSize:10, color:"var(--text-tertiary)", fontWeight:300,
                    }}>
                      {a.readTime} read
                    </span>
                    <span style={{
                      fontSize:10, fontWeight:600, color:tc.text,
                      background:tc.bg, border:`1px solid ${tc.border}`,
                      borderRadius:100, padding:"2px 10px",
                      letterSpacing:"0.05em", textTransform:"uppercase",
                      position:"relative", zIndex:1,
                    }}>
                      {a.tag}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding:"18px 20px" }}>
                    <h2 style={{ fontSize:15, fontWeight:600, color:"var(--text)", letterSpacing:"-0.2px", lineHeight:1.35, marginBottom:8 }}>
                      {a.title}
                    </h2>
                    <p style={{ fontSize:13, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.65, margin:"0 0 14px" }}>
                      {a.summary}
                    </p>
                    <div style={{ display:"flex", gap:10, alignItems:"center", borderTop:"1px solid var(--border)", paddingTop:12 }}>
                      <span style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300 }}>{a.dateLabel}</span>
                      <span style={{ marginLeft:"auto", fontSize:11, color:"var(--text-tertiary)", fontWeight:300 }}>♥ {a.likes}</span>
                      <span style={{ fontSize:12, color:tc.text, fontWeight:500 }}>Read →</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        {displayed.length === 0 && (
          <div style={{ textAlign:"center", padding:"64px 0", color:"var(--text-tertiary)", fontSize:14, fontWeight:300 }}>
            No articles in this category yet.
          </div>
        )}

        <p style={{ marginTop:48, fontSize:13, color:"var(--text-tertiary)", fontWeight:300, textAlign:"center", lineHeight:1.7, maxWidth:"50ch", margin:"48px auto 0" }}>
          More articles in progress — signal processing, ML for biosignals, and the future of assistive input.
        </p>
      </div>

      {/* ── Submit section ── */}
      <div style={{ borderTop:"1px solid var(--border)", background:"var(--bg-secondary)", padding:"64px 32px" }}>
        <div style={{ maxWidth:820, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:32, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16 }}>Contribute</div>
              <h2 style={{ fontSize:"clamp(22px,3vw,32px)", fontWeight:600, letterSpacing:"-0.025em", color:"var(--text)", marginBottom:12, lineHeight:1.2 }}>
                Submit your own article.
              </h2>
              <p style={{ fontSize:15, lineHeight:1.75, color:"var(--text-secondary)", fontWeight:300, maxWidth:"52ch", margin:0 }}>
                Written something about EMG, assistive technology, or myojam? We publish original work with full author credit.
              </p>
            </div>
            <button
              onClick={() => navigate("/submit-article")}
              style={{
                flexShrink:0, background:"var(--accent)", color:"#fff",
                border:"none", borderRadius:100, padding:"14px 32px",
                fontSize:15, fontWeight:500, fontFamily:"var(--font)", cursor:"pointer",
                boxShadow:"0 4px 16px rgba(255,45,120,0.3)", transition:"transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow="0 8px 24px rgba(255,45,120,0.4)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 16px rgba(255,45,120,0.3)"}}
            >
              Submit an article →
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
