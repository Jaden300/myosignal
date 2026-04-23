import { useNavigate } from "react-router-dom"

const META = {
  "/education/emg-explainer":        { tag:"Foundations",  title:"The science of muscle-computer interfaces",     time:"8 min"  },
  "/education/why-emg-is-hard":      { tag:"Signal proc.", title:"Why EMG is harder than it looks",               time:"7 min"  },
  "/education/muscle-memory":        { tag:"Neuroscience", title:"What actually is muscle memory?",               time:"5 min"  },
  "/education/phantom-limb":         { tag:"Neuroscience", title:"The neuroscience of phantom limb sensation",    time:"6 min"  },
  "/education/ethics-of-emg":        { tag:"Ethics",       title:"Who owns your muscle data?",                    time:"7 min"  },
  "/education/future-of-bci":        { tag:"Future",       title:"After EMG: what comes next in BCI",             time:"6 min"  },
  "/education/build-your-own":       { tag:"Hardware",     title:"Build your own EMG sensor for under $60",       time:"8 min"  },
  "/education/open-source-emg":      { tag:"Open source",  title:"The state of open-source EMG",                  time:"6 min"  },
  "/education/random-forest-emg":    { tag:"ML",           title:"Why Random Forest works so well for EMG",       time:"7 min"  },
  "/education/windowing-explained":  { tag:"Signal proc.", title:"Windowing: how raw EMG becomes features",       time:"5 min"  },
  "/education/ninapro-db5":          { tag:"Dataset",      title:"Ninapro DB5: the benchmark explained",          time:"8 min"  },
  "/research/paper":                 { tag:"Research",     title:"myojam: the full technical report",             time:"15 min" },
  "/research/classifier-analysis":   { tag:"Research",     title:"Feature engineering and classifier comparison", time:"20 min" },
  "/research/variability-review":    { tag:"Research",     title:"Origins of inter-subject sEMG variability: a structured review", time:"25 min" },
  "/research/windowing-analysis":    { tag:"Research",     title:"Window duration, overlap, and the prosthetic feasibility gap",    time:"22 min" },
}

const RELATED = {
  "/education/emg-explainer":        ["/education/why-emg-is-hard",     "/education/muscle-memory"],
  "/education/why-emg-is-hard":      ["/education/windowing-explained", "/education/random-forest-emg"],
  "/education/muscle-memory":        ["/education/phantom-limb",        "/education/emg-explainer"],
  "/education/phantom-limb":         ["/education/muscle-memory",       "/education/ethics-of-emg"],
  "/education/ethics-of-emg":        ["/education/future-of-bci",       "/education/open-source-emg"],
  "/education/future-of-bci":        ["/education/ethics-of-emg",       "/education/open-source-emg"],
  "/education/build-your-own":       ["/education/emg-explainer",       "/education/open-source-emg"],
  "/education/open-source-emg":      ["/education/build-your-own",      "/research/paper"],
  "/education/random-forest-emg":    ["/education/windowing-explained", "/research/paper"],
  "/education/windowing-explained":  ["/education/why-emg-is-hard",     "/education/random-forest-emg"],
  "/education/ninapro-db5":          ["/education/open-source-emg",     "/education/random-forest-emg"],
  "/research/paper":                 ["/research/classifier-analysis",  "/education/random-forest-emg"],
  "/research/classifier-analysis":   ["/research/variability-review",   "/education/windowing-explained"],
  "/research/variability-review":    ["/research/windowing-analysis",    "/research/classifier-analysis"],
  "/research/windowing-analysis":    ["/research/variability-review",    "/education/windowing-explained"],
}

const TAG_COLOR = {
  "Foundations":  "#3B82F6",
  "Signal proc.": "#8B5CF6",
  "Neuroscience": "#10B981",
  "Ethics":       "#F59E0B",
  "Future":       "#EF4444",
  "Hardware":     "#6366F1",
  "Open source":  "#14B8A6",
  "ML":           "#FF2D78",
  "Dataset":      "#6B7280",
  "Research":     "#3B82F6",
}

export default function UpNext({ current }) {
  const navigate = useNavigate()
  const slugs = RELATED[current] || []
  if (slugs.length === 0) return null

  return (
    <div style={{ borderTop:"1px solid var(--border)", background:"var(--bg-secondary)", padding:"48px 32px" }}>
      <div style={{ maxWidth:720, margin:"0 auto" }}>
        <div style={{ fontSize:11, fontWeight:600, color:"var(--text-tertiary)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:20 }}>
          Up next
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {slugs.map(slug => {
            const m = META[slug]
            if (!m) return null
            const color = TAG_COLOR[m.tag] || "var(--accent)"
            return (
              <div
                key={slug}
                onClick={() => navigate(slug)}
                style={{ background:"var(--bg)", border:"1px solid var(--border)", borderRadius:"var(--radius)", padding:"20px 24px", cursor:"pointer", transition:"border-color 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 16px ${color}18` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none" }}
              >
                <div style={{ display:"flex", gap:8, marginBottom:10, alignItems:"center" }}>
                  <span style={{ fontSize:11, fontWeight:500, color, background:`${color}14`, border:`1px solid ${color}30`, borderRadius:100, padding:"2px 10px", flexShrink:0 }}>{m.tag}</span>
                  <span style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300 }}>{m.time}</span>
                </div>
                <div style={{ fontSize:15, fontWeight:600, color:"var(--text)", lineHeight:1.35, marginBottom:8 }}>{m.title}</div>
                <div style={{ fontSize:13, color, fontWeight:500 }}>Read →</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
