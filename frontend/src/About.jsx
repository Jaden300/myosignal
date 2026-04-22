import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import Footer from "./Footer"
import { Reveal, StaggerList, HoverCard, SectionPill } from "./Animate"
import AboutHelix from "./components/AboutHelix"
import { t } from "./i18n"
import NeuralNoise from "./components/NeuralNoise"
import { IconRefresh, IconGlobe, IconMicroscope, IconBook } from "./Icons"

const VALUES = [
  {
    icon:IconBook,
    title:"Education as the mission",
    body:"The articles, lesson plans, and interactive tools aren't supplements to the project - they are the project. Understanding EMG is as important as building with it.",
  },
  {
    icon:IconGlobe,
    title:"Open source by default",
    body:"Every line of code, every model weight decision, every dataset choice is public. If myojam teaches someone, we want them to be able to understand, modify, and build on it.",
  },
  {
    icon:IconMicroscope,
    title:"Research-grade, human-scale",
    body:"The underlying science - EMG signal processing, gesture classification, real-time inference - is rigorous. But the experience of learning it should feel approachable from day one.",
  },
  {
    icon:IconRefresh,
    title:"Technology should adapt to people",
    body:"Assistive technology that requires users to conform to hardware constraints has it backwards. The platform should learn to understand people, not the other way around.",
  },
]


const STATS = [
  { val:"84.85%", label:"Cross-subject accuracy", sub:"On held-out subjects never seen during training" },
  { val:"11",     label:"Published articles",      sub:"From neuroscience to hardware guides" },
  { val:"3",      label:"Lesson plans",            sub:"Middle school through university" },
  { val:"MIT",    label:"License",                 sub:"Fully open - modify, fork, build on it" },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", overflowX:"clip" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <Navbar />

      {/* Hero */}
      <div style={{ position:"relative", overflow:"hidden", borderBottom:"1px solid var(--border)", padding:"120px 32px 90px", display:"flex", alignItems:"center", minHeight:500 }}>
        <NeuralNoise color={[0.49, 0.23, 0.93]} opacity={0.85} speed={0.0006} />
        <div style={{ position:"absolute", inset:0, background:"rgba(3,0,18,0.65)", zIndex:1 }}/>
        <div style={{ maxWidth:860, margin:"0 auto", position:"relative", zIndex:2, width:"100%" }}>
          <div style={{ animation:"fadeUp 0.6s ease" }}>
            <SectionPill>{t("about_pill")}</SectionPill>
          </div>
          <h1 style={{ fontSize:"clamp(40px,6vw,72px)", fontWeight:600, letterSpacing:"-2.5px", lineHeight:1.04, color:"#fff", marginBottom:24, animation:"fadeUp 0.6s 0.1s ease both" }}>
            {t("about_hero")}
          </h1>
          <p style={{ fontSize:18, color:"rgba(255,255,255,0.72)", fontWeight:300, lineHeight:1.75, maxWidth:580, marginBottom:0, animation:"fadeUp 0.6s 0.2s ease both" }}>
            {t("about_sub")}
          </p>
        </div>
      </div>

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
                  Make EMG education accessible, open, and free.
                </h2>
                <p style={{ fontSize:16, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.8, marginBottom:16 }}>
                  Starting with the students, teachers, and researchers who want to understand it - and building the resources to ensure the next generation of engineers grasps both the technology and the humans it serves.
                </p>
                <p style={{ fontSize:16, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.8 }}>
                  myojam began as a personal research challenge and grew into something larger: a working classifier, a published education platform, lesson plans in use in real classrooms, and a growing body of open documentation that anyone can build on.
                </p>
              </div>
              <div style={{ background:"var(--bg-secondary)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"32px" }}>
                <div style={{ fontSize:11, fontWeight:600, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:20 }}>What myojam is</div>
                {[
                  ["A gesture classifier","84.85% cross-subject accuracy on Ninapro DB5"],
                  ["An education hub","11 articles, 3 lesson plans, 4 interactive tools"],
                  ["A published research pipeline","Documented signal processing, feature extraction, and classification"],
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
              <div style={{ width:36, height:36, borderRadius:10, background:"var(--accent-soft)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}><v.icon size={20} color="var(--accent)" /></div>
              <div style={{ fontSize:16, fontWeight:600, color:"var(--text)", marginBottom:10 }}>{v.title}</div>
              <p style={{ fontSize:14, color:"var(--text-secondary)", lineHeight:1.75, fontWeight:300, margin:0 }}>{v.body}</p>
            </HoverCard>
          )}/>
        </div>
      </section>

      {/* Timeline - 3D helix */}
      <AboutHelix />

      {/* Open source CTA */}
      <section style={{ padding:"0 32px 80px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <Reveal>
            <div style={{ background:"linear-gradient(135deg, rgba(255,45,120,0.06) 0%, transparent 100%)", border:"1px solid rgba(255,45,120,0.15)", borderRadius:"var(--radius)", padding:"48px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:32, flexWrap:"wrap" }}>
              <div>
                <div style={{ fontSize:20, fontWeight:600, color:"var(--text)", letterSpacing:"-0.4px", marginBottom:8 }}>myojam is fully open source</div>
                <p style={{ fontSize:15, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, margin:0, maxWidth:480 }}>
                  Signal processing pipeline, ML model, React frontend, FastAPI backend - all public on GitHub under the MIT license.
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