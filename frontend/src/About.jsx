import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import Footer from "./Footer"
import { Reveal, StaggerList, HoverCard, SectionPill } from "./Animate"
import AboutHelix from "./components/AboutHelix"

const VALUES = [
  {
    icon:"🔄",
    title:"Technology should adapt to people",
    body:"Most assistive tech forces users to conform to hardware constraints. We believe the opposite  -  the system should learn to understand you, not the other way around.",
  },
  {
    icon:"🌐",
    title:"Open source by default",
    body:"Every line of code, every model weight decision, every dataset choice is public. If myojam helps someone, we want them to be able to understand, modify, and build on it.",
  },
  {
    icon:"🔬",
    title:"Research-grade, human-scale",
    body:"The underlying science  -  EMG signal processing, gesture classification, real-time inference  -  is rigorous. But the experience should feel as simple as flexing a finger.",
  },
  {
    icon:"📚",
    title:"Education as infrastructure",
    body:"Technology without understanding is fragile. The education hub, lesson plans, and articles aren't extras  -  they're core to making myojam's work durable and reproducible.",
  },
]


const STATS = [
  { val:"84.85%", label:"Cross-subject accuracy", sub:"On held-out subjects never seen during training" },
  { val:"16,269", label:"Training windows",        sub:"From 10 subjects across Ninapro DB5" },
  { val:"11",     label:"Published articles",      sub:"Ranging from neuroscience to hardware guides" },
  { val:"MIT",    label:"License",                 sub:"Fully open  -  modify, fork, build on it" },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", overflowX:"clip" }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes orbFloat { from{transform:translateY(0)} to{transform:translateY(-28px)} }
      `}</style>
      <Navbar />

      {/* Hero */}
      <section style={{ position:"relative", padding:"120px 32px 80px", overflow:"hidden", minHeight:500, display:"flex", alignItems:"center" }}>
        {[
          ["360px","-80px","-60px",0,"rgba(255,45,120,0.18)"],
          ["260px","65%","40px",2,"rgba(139,92,246,0.14)"],
          ["200px","80%","200px",4,"rgba(59,130,246,0.12)"],
        ].map(([size,x,y,delay,color],i)=>(
          <div key={i} style={{ position:"absolute",width:size,height:size,borderRadius:"50%",background:color,left:x,top:y,filter:"blur(70px)",pointerEvents:"none",animation:`orbFloat 9s ${delay}s ease-in-out infinite alternate` }}/>
        ))}
        <div style={{ maxWidth:860, margin:"0 auto", position:"relative", zIndex:1, width:"100%" }}>
          <div style={{ animation:"fadeUp 0.6s ease" }}>
            <SectionPill>Open source · Assistive technology</SectionPill>
          </div>
          <h1 style={{ fontSize:"clamp(40px,6vw,72px)", fontWeight:600, letterSpacing:"-2.5px", lineHeight:1.04, color:"var(--text)", marginBottom:24, animation:"fadeUp 0.6s 0.1s ease both" }}>
            We believe muscle signals<br/>shouldn't be<br/><span style={{ color:"var(--accent)" }}>a barrier.</span>
          </h1>
          <p style={{ fontSize:18, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.75, maxWidth:580, marginBottom:0, animation:"fadeUp 0.6s 0.2s ease both" }}>
            myojam is an open-source project that lets people control a computer using surface EMG signals from their forearm  -  and an education platform teaching the science behind it. No keyboard, no mouse, no hands required.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background:"var(--bg-secondary)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <StaggerList items={STATS} columns={4} gap={0} renderItem={(s,i)=>(
            <div style={{ padding:"32px 28px", borderRight: i<3?"1px solid var(--border)":"none", textAlign:"center" }}>
              <div style={{ fontSize:30, fontWeight:700, color:"var(--accent)", letterSpacing:"-1.5px", marginBottom:6 }}>{s.val}</div>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300, lineHeight:1.5 }}>{s.sub}</div>
            </div>
          )}/>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding:"80px 32px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>Our mission</SectionPill>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
              <div>
                <h2 style={{ fontSize:"clamp(28px,4vw,42px)", fontWeight:600, letterSpacing:"-1.2px", color:"var(--text)", lineHeight:1.15, marginBottom:20 }}>
                  Make gesture-based control accessible, open, and free.
                </h2>
                <p style={{ fontSize:16, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.8, marginBottom:16 }}>
                  Starting with people who need it most  -  and building the educational resources to ensure the next generation of engineers understands both the technology and the humans it serves.
                </p>
                <p style={{ fontSize:16, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.8 }}>
                  myojam began as a personal research challenge and grew into something larger: a working platform, an education hub, an international competition, and a growing body of open documentation that anyone can build on.
                </p>
              </div>
              <div style={{ background:"var(--bg-secondary)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"32px" }}>
                <div style={{ fontSize:11, fontWeight:600, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:20 }}>What myojam is</div>
                {[
                  ["A gesture classifier","84.85% cross-subject accuracy on Ninapro DB5"],
                  ["A desktop app","Native macOS  -  connect a sensor, control your computer"],
                  ["An education hub","11 articles, 3 lesson plans, 5 interactive demos"],
                  ["A block coding env","myocode  -  EMG gestures as first-class events"],
                  ["An open platform","MIT licensed, fully documented, publicly built"],
                ].map(([title, sub])=>(
                  <div key={title} style={{ display:"flex", gap:12, marginBottom:14, alignItems:"flex-start" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--accent)", flexShrink:0, marginTop:6 }}/>
                    <div>
                      <div style={{ fontSize:14, fontWeight:500, color:"var(--text)" }}>{title}</div>
                      <div style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section style={{ background:"var(--bg-secondary)", borderTop:"1px solid var(--border)", padding:"80px 32px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>What we believe</SectionPill>
            <h2 style={{ fontSize:"clamp(28px,4vw,42px)", fontWeight:600, letterSpacing:"-1.2px", color:"var(--text)", marginBottom:48 }}>
              Four principles.
            </h2>
          </Reveal>
          <StaggerList items={VALUES} columns={2} gap={16} renderItem={v=>(
            <HoverCard style={{ background:"var(--bg)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"28px 32px" }}>
              <div style={{ fontSize:28, marginBottom:16 }}>{v.icon}</div>
              <div style={{ fontSize:16, fontWeight:600, color:"var(--text)", marginBottom:10 }}>{v.title}</div>
              <p style={{ fontSize:14, color:"var(--text-secondary)", lineHeight:1.75, fontWeight:300, margin:0 }}>{v.body}</p>
            </HoverCard>
          )}/>
        </div>
      </section>

      {/* Timeline — 3D helix */}
      <AboutHelix />

      {/* Open source CTA */}
      <section style={{ padding:"0 32px 80px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <Reveal>
            <div style={{ background:"linear-gradient(135deg, rgba(255,45,120,0.06) 0%, transparent 100%)", border:"1px solid rgba(255,45,120,0.15)", borderRadius:"var(--radius)", padding:"48px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:32, flexWrap:"wrap" }}>
              <div>
                <div style={{ fontSize:20, fontWeight:600, color:"var(--text)", letterSpacing:"-0.4px", marginBottom:8 }}>myojam is fully open source</div>
                <p style={{ fontSize:15, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, margin:0, maxWidth:480 }}>
                  Signal processing pipeline, ML model, React frontend, FastAPI backend, macOS desktop app  -  all public on GitHub under the MIT license.
                </p>
              </div>
              <a href="https://github.com/Jaden300/myojam" target="_blank" rel="noreferrer" style={{ background:"var(--accent)", color:"#fff", borderRadius:100, padding:"13px 28px", fontSize:15, fontWeight:500, textDecoration:"none", flexShrink:0, boxShadow:"0 4px 16px rgba(255,45,120,0.3)", transition:"transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow="0 8px 24px rgba(255,45,120,0.4)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 16px rgba(255,45,120,0.3)"}}
              >View on GitHub ↗</a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}