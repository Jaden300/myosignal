import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, SectionPill } from "./Animate"

const LOGS = [
  {
    version: "v0.1",
    date: "September 2024",
    tag: "Origin",
    tagColor: "#AEAEB2",
    title: "The idea",
    summary: "myojam starts as a personal challenge: can you build a working EMG classifier from scratch using only public data and consumer hardware?",
    entries: [
      { type:"milestone", text:"Project conceived as a personal research challenge" },
      { type:"milestone", text:"Discovered the Ninapro DB5 dataset  -  10 subjects, 16 channels, 200Hz, publicly available" },
      { type:"milestone", text:"Ordered first MyoWare 2.0 sensor and Arduino Uno R3" },
      { type:"note",      text:"At this point the project had no name, no website, and no clear end goal. Just curiosity about whether affordable hardware could do something clinically meaningful." },
    ],
  },
  {
    version: "v0.2",
    date: "October 2024",
    tag: "First signal",
    tagColor: "#3B82F6",
    title: "First working EMG acquisition",
    summary: "Hardware arrives. First muscle signal displayed on screen. The signal is noisy, inconsistent, and completely unclassified  -  but it's real EMG data.",
    entries: [
      { type:"milestone", text:"MyoWare 2.0 sensor wired to Arduino Uno R3" },
      { type:"milestone", text:"First raw EMG signal streamed to Serial Plotter at 200Hz" },
      { type:"milestone", text:"Bandpass filtering implemented (20–90Hz Butterworth) to clean the signal" },
      { type:"bug",       text:"Initial electrode placement was wrong  -  signal was cross-talk from a neighbouring muscle, not the target. Moved electrodes to muscle belly centre." },
      { type:"note",      text:"Seeing your own muscle signal on a screen for the first time is genuinely strange. It's abstract data with a very physical origin." },
    ],
  },
  {
    version: "v0.3",
    date: "November 2024",
    tag: "First model",
    tagColor: "#8B5CF6",
    title: "First gesture classifier",
    summary: "Feature extraction pipeline implemented. First Random Forest trained on Ninapro DB5 data. Accuracy on held-out data: 71.2%. Clearly improvable.",
    entries: [
      { type:"milestone", text:"MAV, RMS, ZC, WL features extracted across all 16 channels  -  64-feature vector" },
      { type:"milestone", text:"Random Forest trained on Subject 1 Exercise 1 data  -  6 gesture classes" },
      { type:"milestone", text:"71.2% cross-validated accuracy on initial model" },
      { type:"bug",       text:"Early model used rest windows as a 7th class, which dominated predictions. Removed rest class and added amplitude threshold instead." },
      { type:"improvement", text:"Hyperparameter search via RandomizedSearchCV  -  accuracy improved to 79.4%" },
    ],
  },
  {
    version: "v0.4",
    date: "December 2024",
    tag: "Cross-subject",
    tagColor: "#F97316",
    title: "Training across all 10 subjects",
    summary: "Model retrained on all 10 Ninapro subjects. Cross-subject accuracy reaches 84.85%. Pipeline generalises to people the model has never seen.",
    entries: [
      { type:"milestone", text:"Data pipeline expanded to load all 10 subjects from DB5" },
      { type:"milestone", text:"16,269 labelled EMG windows in training set" },
      { type:"milestone", text:"Cross-subject accuracy: 84.85%  -  model evaluated on held-out subjects never seen during training" },
      { type:"improvement", text:"Added per-subject normalisation to reduce inter-subject amplitude variance" },
      { type:"note",      text:"84.85% cross-subject is the number that ends up on the website. It's honest  -  no cherry-picking, no within-subject inflation. It means roughly 1 in 7 predictions is wrong, which is the real baseline." },
    ],
  },
  {
    version: "v0.5",
    date: "January 2025",
    tag: "Desktop app",
    tagColor: "#FF2D78",
    title: "macOS desktop application",
    summary: "First working desktop app built in PyQt6. Gesture predictions control actual mouse cursor and keyboard. The system works end-to-end for the first time.",
    entries: [
      { type:"milestone", text:"PyQt6 desktop app with real-time EMG waveform visualisation" },
      { type:"milestone", text:"6 gestures mapped to computer actions: cursor movement (4 directions), left click, spacebar" },
      { type:"milestone", text:"cliclick integration for mouse control without macOS accessibility bypass" },
      { type:"bug",       text:"PyQt6 + rumps combination caused trace trap crash on Python 3.13. Removed rumps entirely." },
      { type:"bug",       text:"pyobjc in venv broken on Apple Silicon Python 3.13  -  objc.arch attribute missing. Fixed by using system Python directly, no venv." },
      { type:"improvement", text:"Global keyboard listener via Quartz CGEventTap  -  works even when app is not in focus" },
    ],
  },
  {
    version: "v0.6",
    date: "February 2025",
    tag: "Web demo",
    tagColor: "#10B981",
    title: "Web demo launched",
    summary: "FastAPI backend deployed on Render. React frontend at myojam.com. Anyone can try the gesture classifier in a browser  -  no hardware required.",
    entries: [
      { type:"milestone", text:"FastAPI inference API deployed on Render  -  /predict, /sample, /gestures endpoints" },
      { type:"milestone", text:"React/Vite frontend with real-time EMG visualisation and gesture prediction" },
      { type:"milestone", text:"Dataset mode: loads real Ninapro windows so users can demo without hardware" },
      { type:"milestone", text:"Vercel deployment via GitHub CI, custom domain myojam.com via Namecheap" },
      { type:"improvement", text:"Three.js 3D hand model in the web demo  -  finger curl animation driven by channel MAV" },
      { type:"note",      text:"The web demo is deliberately hardware-optional. The goal is to make the system accessible to anyone curious about EMG, not just people who own a MyoWare sensor." },
    ],
  },
  {
    version: "v0.7",
    date: "March 2025",
    tag: "Polished",
    tagColor: "#F59E0B",
    title: "Design overhaul & education hub",
    summary: "Full site redesign. Education hub with 4 in-depth articles. Signal playground. AI chatbot powered by GPT-4o-mini. The project starts to look like a real product.",
    entries: [
      { type:"milestone", text:"Full site redesign  -  Apple-style typography, pink accent system, consistent var(--*) tokens" },
      { type:"milestone", text:"Education hub launched with 4 articles: EMG science, open-source history, Random Forest deep dive, Ninapro DB5 explainer" },
      { type:"milestone", text:"Signal playground  -  draw waveforms, watch feature extraction compute live" },
      { type:"milestone", text:"AI chatbot endpoint via GPT-4o-mini, jailbreak-hardened system prompt, streaming text UI" },
      { type:"milestone", text:"Newsletter popup, demo feedback form, careers page, corporations page" },
      { type:"improvement", text:"Shared animation system (Animate.jsx)  -  Reveal, StaggerList, HoverCard across all pages" },
      { type:"improvement", text:"SVG icon system replacing all emoji in navigation" },
    ],
  },
  {
    version: "v0.8",
    date: "April 2025",
    tag: "Interactive",
    tagColor: "#8B5CF6",
    title: "Demos, myocode & educators hub",
    summary: "Five interactive demos including the myocode block coding environment. Full educators hub with lesson plans, quizzes, and a resource library.",
    entries: [
      { type:"milestone", text:"Demos page with 5 interactive tools: live classifier, signal playground, gesture game, frequency analyzer, confusion matrix explorer" },
      { type:"milestone", text:"myocode  -  Scratch-like block coding with EMG gesture events, canvas drawing, sprite movement" },
      { type:"milestone", text:"Educators hub with 3 full lesson plans, curriculum alignment, differentiation strategies, and assessment rubrics" },
      { type:"milestone", text:"Multiple-choice quiz engine with per-question explanations, progress bar, and results review" },
      { type:"milestone", text:"7 new education articles spanning neuroscience, hardware, ethics, and signal processing" },
      { type:"improvement", text:"3D hand model rebuilt in QWebEngineView with pink skin, grey background, rotate toggle with lerp easing" },
      { type:"improvement", text:"Dropdown navbar with hover-triggered menus replacing flat link list" },
    ],
  },
]

const TYPE_CONFIG = {
  milestone:   { color:"#10B981", bg:"rgba(16,185,129,0.08)",  border:"rgba(16,185,129,0.2)",  icon:"✓", label:"Milestone" },
  bug:         { color:"#EF4444", bg:"rgba(239,68,68,0.06)",    border:"rgba(239,68,68,0.2)",    icon:"⚠", label:"Bug fixed" },
  improvement: { color:"#3B82F6", bg:"rgba(59,130,246,0.07)",   border:"rgba(59,130,246,0.2)",   icon:"↑", label:"Improvement" },
  note:        { color:"#AEAEB2", bg:"rgba(174,174,178,0.07)",  border:"rgba(174,174,178,0.2)",  icon:"✎", label:"Note" },
}

const STATS = [
  { val:"8",      label:"Versions shipped" },
  { val:"7mo",    label:"Development time" },
  { val:"16,269", label:"Training windows" },
  { val:"84.85%", label:"Peak accuracy" },
]

export default function Changelog() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState({ "v0.8": true }) // latest open by default
  const [filter, setFilter] = useState("all")

  function toggle(v) { setExpanded(e => ({ ...e, [v]: !e[v] })) }

  const filters = [
    { key:"all",         label:"All" },
    { key:"milestone",   label:"Milestones" },
    { key:"bug",         label:"Bugs fixed" },
    { key:"improvement", label:"Improvements" },
  ]

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes expandIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <Navbar />

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg, #f5f0ff 0%, #ffffff 60%)", borderBottom:"1px solid var(--border)", padding:"100px 32px 64px" }}>
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>Company history</SectionPill>
            <h1 style={{ fontSize:"clamp(36px,6vw,64px)", fontWeight:600, letterSpacing:"-2px", lineHeight:1.04, color:"var(--text)", marginBottom:24 }}>
              How myojam<br /><span style={{ color:"var(--accent)" }}>got here.</span>
            </h1>
            <p style={{ fontSize:17, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.75, maxWidth:520, marginBottom:48 }}>
              A complete development log  -  every version, every milestone, every bug that took too long to fix.
              Built in public, documented in public.
            </p>
          </Reveal>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, borderRadius:"var(--radius)", overflow:"hidden", border:"1px solid var(--border)" }}>
            {STATS.map((s,i) => (
              <div key={s.label} style={{ background:"rgba(255,255,255,0.7)", backdropFilter:"blur(8px)", padding:"24px 20px", borderRight: i<3 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize:28, fontWeight:700, color:"var(--accent)", letterSpacing:"-1px", marginBottom:4 }}>{s.val}</div>
                <div style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:760, margin:"0 auto", padding:"48px 32px 80px" }}>

        {/* Filter */}
        <div style={{ display:"flex", gap:8, marginBottom:40, flexWrap:"wrap" }}>
          {filters.map(f => (
            <button key={f.key} onClick={()=>setFilter(f.key)} style={{
              background: filter===f.key ? "var(--accent)" : "var(--bg-secondary)",
              color: filter===f.key ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${filter===f.key ? "var(--accent)" : "var(--border)"}`,
              borderRadius:100, padding:"6px 16px", fontSize:12,
              fontWeight: filter===f.key ? 500 : 400,
              cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.15s"
            }}>{f.label}</button>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ position:"relative" }}>
          {/* Vertical line */}
          <div style={{ position:"absolute", left:17, top:8, bottom:8, width:2, background:"linear-gradient(to bottom, var(--accent), var(--border))", borderRadius:1 }}/>

          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {[...LOGS].reverse().map((log, idx) => {
              const isOpen = expanded[log.version]
              const filteredEntries = filter === "all" ? log.entries : log.entries.filter(e => e.type === filter)
              if (filter !== "all" && filteredEntries.length === 0) return null

              return (
                <div key={log.version} style={{ paddingLeft:48, paddingBottom:40, position:"relative", animation:`fadeUp 0.5s ${idx*0.06}s ease both` }}>
                  {/* Version dot */}
                  <div style={{
                    position:"absolute", left:6, top:4,
                    width:24, height:24, borderRadius:"50%",
                    background: isOpen ? log.tagColor : "var(--bg)",
                    border:`2px solid ${log.tagColor}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:9, fontWeight:700, color: isOpen ? "#fff" : log.tagColor,
                    transition:"all 0.2s", cursor:"pointer", zIndex:1
                  }} onClick={()=>toggle(log.version)}>
                    {isOpen ? "−" : "+"}
                  </div>

                  {/* Card header */}
                  <div
                    onClick={()=>toggle(log.version)}
                    style={{ cursor:"pointer", paddingBottom:isOpen?0:0 }}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, flexWrap:"wrap" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:log.tagColor, fontFamily:"monospace" }}>{log.version}</span>
                      <span style={{ fontSize:11, fontWeight:500, color:log.tagColor, background:log.tagColor+"15", border:`1px solid ${log.tagColor}30`, borderRadius:100, padding:"2px 8px" }}>{log.tag}</span>
                      <span style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300 }}>{log.date}</span>
                    </div>

                    <div style={{ fontSize:18, fontWeight:600, color:"var(--text)", letterSpacing:"-0.3px", marginBottom:6, lineHeight:1.3 }}>{log.title}</div>
                    <p style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, margin:0, maxWidth:560 }}>{log.summary}</p>
                  </div>

                  {/* Expanded entries */}
                  {isOpen && (
                    <div style={{ marginTop:20, animation:"expandIn 0.2s ease" }}>
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {filteredEntries.map((entry, ei) => {
                          const tc = TYPE_CONFIG[entry.type] || TYPE_CONFIG.note
                          return (
                            <div key={ei} style={{ display:"flex", gap:12, alignItems:"flex-start", background:tc.bg, border:`1px solid ${tc.border}`, borderRadius:10, padding:"12px 16px" }}>
                              <div style={{ width:20, height:20, borderRadius:"50%", background:tc.color+"20", border:`1px solid ${tc.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:tc.color, fontWeight:700, flexShrink:0, marginTop:1 }}>
                                {tc.icon}
                              </div>
                              <div style={{ flex:1 }}>
                                <div style={{ fontSize:10, fontWeight:600, color:tc.color, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{tc.label}</div>
                                <div style={{ fontSize:13, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.65 }}>{entry.text}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* What's next */}
        <Reveal>
          <div style={{ marginTop:16, background:"linear-gradient(135deg, rgba(255,45,120,0.05) 0%, transparent 100%)", border:"1px solid rgba(255,45,120,0.15)", borderRadius:"var(--radius)", padding:"40px" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:16 }}>What's next</div>
            <h3 style={{ fontSize:20, fontWeight:600, color:"var(--text)", letterSpacing:"-0.4px", marginBottom:16 }}>The roadmap</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                ["Personal model retraining UI  -  guided calibration wizard in the desktop app"],
                ["Windows and Linux support  -  cross-platform input layer replacing cliclick and osascript"],
                ["Higher-density electrode support  -  32+ channel configurations for improved finger-level resolution"],
                ["Online learning  -  model updates incrementally as users correct misclassifications"],
                ["Community dataset  -  open call for personal EMG recordings to build a diverse training set"],
              ].map(([text], i) => (
                <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--accent)", flexShrink:0, marginTop:6, opacity:0.5+(i*0.1) }}/>
                  <div style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.65 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Open source note */}
        <Reveal delay={0.1}>
          <div style={{ marginTop:24, background:"var(--bg-secondary)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"32px", display:"flex", gap:24, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:600, color:"var(--text)", marginBottom:6 }}>Everything is public</div>
              <p style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, margin:0 }}>
                Every commit, every version, every decision described above is in the public GitHub repo under the MIT license. No private forks, no unreleased branches.
              </p>
            </div>
            <a href="https://github.com/Jaden300/myojam" target="_blank" rel="noreferrer" style={{ background:"var(--accent)", color:"#fff", borderRadius:100, padding:"11px 24px", fontSize:14, fontWeight:500, textDecoration:"none", flexShrink:0, boxShadow:"0 4px 16px rgba(255,45,120,0.3)", transition:"transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow="0 8px 24px rgba(255,45,120,0.4)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 16px rgba(255,45,120,0.3)"}}
            >View on GitHub ↗</a>
          </div>
        </Reveal>
      </div>
      <Footer />
    </div>
  )
}