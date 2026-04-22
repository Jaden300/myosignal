import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Footer from "./Footer"
import { Reveal, StaggerList, HoverCard, SectionPill } from "./Animate"
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
    summary: "Surface EMG is one point on a spectrum from skin-surface sensing to direct neural recording. Where the field is heading - high-density arrays, peripheral nerve interfaces, and motor cortex decoding.",
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
    summary: "Window size, overlap, and step size are the least glamorous choices in EMG classification - and silently the most consequential. Here's what they actually control and why myojam made the choices it did.",
    readTime: "7 min",
    author: "myojam team",
    date: "2025-07-05",
    dateLabel: "July 5, 2025",
    likes: 29,
    helpfulness: 11,
  },
]

// Tag colours - distinct per category so scanning works without reading
// Source: NN/G - use bright colors for important items, muted for less important
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
  { key: "latest",  label: "Latest"        },
  { key: "popular", label: "Most popular"  },
  { key: "helpful", label: "Most helpful"  },
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
  const displayed = sorted(ARTICLES, sortKey)

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <Navbar />

      {/* ── BANNER
          Spacing: 120px top, 72px bottom - generous breathing room per NN/G:
          "An element with more space around it receives more attention."
          Max-width 68ch on paragraphs - typography guideline, 70-80 chars per line.
      */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)", padding: "120px 32px 72px" }}>
        <NeuralNoise color={[0.06, 0.72, 0.56]} opacity={0.85} speed={0.0006} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,0,18,0.65)", zIndex: 1 }} />
        <div style={{ maxWidth:820, margin:"0 auto", position: "relative", zIndex: 2 }}>

          <div style={{
            display:"inline-flex", alignItems:"center", gap:6,
            background:"rgba(255,255,255,0.08)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,45,120,0.3)",
            borderRadius:100, padding:"5px 16px",
            fontSize:11, fontWeight:600, color:"var(--accent)",
            letterSpacing:"0.06em", textTransform:"uppercase",
            marginBottom:32,
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--accent)", display:"inline-block" }}/>
            Education hub
          </div>

          <h1 style={{
            fontSize:"clamp(36px, 5.5vw, 60px)",
            fontWeight:700,
            letterSpacing:"-0.03em",
            lineHeight:1.05,
            color:"#fff",
            marginBottom:24,
          }}>
            Learn about EMG<br/>
            <span style={{ color:"var(--accent)" }}>and assistive technology.</span>
          </h1>

          <p style={{
            fontSize:17,
            lineHeight:1.75,
            color:"rgba(255,255,255,0.72)",
            fontWeight:300,
            maxWidth:"58ch",
            marginBottom:0,
          }}>
            In-depth articles on the science behind myojam - from how muscles generate
            electrical signals to how machine learning classifies them into computer actions.
          </p>

          <div style={{ display:"flex", gap:32, marginTop:40 }}>
            {[
              ["11", "articles"],
              ["450+", "total reads"],
              ["5 topics", "covered"],
            ].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize:22, fontWeight:700, color:"#fff", letterSpacing:"-0.5px" }}>{val}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", fontWeight:300, textTransform:"uppercase", letterSpacing:"0.08em", marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ARTICLE LIST */}
      <div style={{ maxWidth:820, margin:"0 auto", padding:"48px 32px 80px" }}>

        {/* Sort bar - secondary UI, kept visually quiet per Refactoring UI:
            Secondary actions should be clear but low contrast */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:40 }}>
          <span style={{
            fontSize:11, color:"var(--text-tertiary)", fontWeight:400,
            textTransform:"uppercase", letterSpacing:"0.08em", marginRight:4,
          }}>Sort</span>
          {SORT_OPTIONS.map(opt => (
            <button key={opt.key} onClick={() => setSortKey(opt.key)} style={{
              background: sortKey===opt.key ? "var(--accent-soft)" : "transparent",
              border: `1px solid ${sortKey===opt.key ? "rgba(255,45,120,0.25)" : "var(--border)"}`,
              borderRadius:100,
              padding:"5px 14px",
              fontSize:12,
              fontWeight: sortKey===opt.key ? 500 : 300,
              color: sortKey===opt.key ? "var(--accent)" : "var(--text-tertiary)",
              cursor:"pointer",
              fontFamily:"var(--font)",
              transition:"all 0.15s",
            }}>{opt.label}</button>
          ))}
        </div>

        {/* Article cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {displayed.map((a, i) => {
            const tc = TAG_COLORS[a.tag] || TAG_COLORS["Foundations"]
            return (
              <Reveal key={a.slug} delay={i * 0.04}>
                {/* Card - border-bottom divider pattern, no card background on most
                    Source: NN/G Medium example - "thoughtful typography system,
                    spacing, and consistent left alignment makes it easy to read" */}
                <div
                  onClick={() => navigate(a.slug)}
                  style={{
                    padding:"28px 0",
                    borderBottom:"1px solid var(--border)",
                    cursor:"pointer",
                    display:"flex",
                    gap:24,
                    alignItems:"flex-start",
                    transition:"background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,45,120,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Article number - visual anchor on left, quiet */}
                  <div style={{
                    fontSize:12,
                    color:"var(--text-tertiary)",
                    fontWeight:300,
                    width:24,
                    flexShrink:0,
                    paddingTop:3,
                    fontVariantNumeric:"tabular-nums",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Main content */}
                  <div style={{ flex:1 }}>

                    {/* Metadata row - grouped close together per Gestalt proximity principle
                        Source: NN/G - "minimal white space between related items makes
                        their relationship clear" */}
                    <div style={{
                      display:"flex",
                      alignItems:"center",
                      gap:10,
                      marginBottom:10,
                      flexWrap:"wrap",
                    }}>
                      <span style={{
                        fontSize:10,
                        fontWeight:600,
                        color: tc.text,
                        background: tc.bg,
                        border: `1px solid ${tc.border}`,
                        borderRadius:100,
                        padding:"2px 10px",
                        letterSpacing:"0.05em",
                        textTransform:"uppercase",
                      }}>
                        {a.tag}
                      </span>
                      <span style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300 }}>{a.readTime} read</span>
                      <span style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300 }}>{a.dateLabel}</span>
                    </div>

                    {/* Title - clear size jump from metadata above
                        Source: NN/G - "use 2-3 typeface sizes to indicate content importance"
                        Tight tracking on the heading per Apple HIG */}
                    <h2 style={{
                      fontSize:18,
                      fontWeight:600,
                      color:"var(--text)",
                      letterSpacing:"-0.02em",
                      lineHeight:1.3,
                      marginBottom:10,
                    }}>
                      {a.title}
                    </h2>

                    {/* Summary - clearly subordinate: smaller, lighter, more line-height
                        Source: Refactoring UI - use color to reinforce hierarchy,
                        not just size alone */}
                    <p style={{
                      fontSize:14,
                      lineHeight:1.7,
                      color:"var(--text-secondary)",
                      fontWeight:300,
                      maxWidth:"62ch",
                      margin:0,
                    }}>
                      {a.summary}
                    </p>

                    {/* Like count - farthest down the hierarchy, tertiary treatment */}
                    <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300 }}>
                        ♥ {a.likes} likes
                      </span>
                    </div>
                  </div>

                  {/* Arrow - rightmost, secondary, quiet */}
                  <span style={{
                    fontSize:18,
                    color:"var(--text-tertiary)",
                    flexShrink:0,
                    marginTop:4,
                    transition:"color 0.15s, transform 0.15s",
                  }}>→</span>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Footer note - tertiary, centered, max width constrained */}
        <p style={{
          marginTop:48,
          fontSize:13,
          color:"var(--text-tertiary)",
          fontWeight:300,
          textAlign:"center",
          lineHeight:1.7,
          maxWidth:"50ch",
          marginLeft:"auto",
          marginRight:"auto",
        }}>
          More articles in progress - signal processing, ML for biosignals, and the future of assistive input.
        </p>
      </div>

      {/* ── SUBMIT SECTION
          Separated from the list with generous top margin - NN/G:
          "increased space between each chunk creates hierarchical spatial pattern" */}
      <div style={{
        borderTop:"1px solid var(--border)",
        background:"var(--bg-secondary)",
        padding:"64px 32px",
      }}>
        <div style={{ maxWidth:820, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:32, flexWrap:"wrap" }}>
            <div>
              <div style={{
                fontSize:11, fontWeight:600, color:"var(--accent)",
                textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16,
              }}>Contribute</div>
              <h2 style={{
                fontSize:"clamp(22px,3vw,32px)",
                fontWeight:600,
                letterSpacing:"-0.025em",
                color:"var(--text)",
                marginBottom:12,
                lineHeight:1.2,
              }}>Submit your own article.</h2>
              <p style={{
                fontSize:15,
                lineHeight:1.75,
                color:"var(--text-secondary)",
                fontWeight:300,
                maxWidth:"52ch",
                margin:0,
              }}>
                Written something about EMG, assistive technology, or myojam?
                We publish original work with full author credit.
              </p>
            </div>
            <button
              onClick={() => navigate("/submit-article")}
              style={{
                flexShrink:0,
                background:"var(--accent)", color:"#fff",
                border:"none", borderRadius:100,
                padding:"14px 32px", fontSize:15, fontWeight:500,
                fontFamily:"var(--font)", cursor:"pointer",
                boxShadow:"0 4px 16px rgba(255,45,120,0.3)",
                transition:"transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(255,45,120,0.4)" }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(255,45,120,0.3)" }}
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