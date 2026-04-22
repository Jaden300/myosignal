import { useNavigate } from "react-router-dom"
import Navbar from "../Navbar"
import Footer from "../Footer"
import { Reveal, HoverCard, SectionPill } from "../Animate"
import NeuralNoise from "../components/NeuralNoise"

const LINKS = [
  { label:"Ninapro DB5 dataset", desc:"Full publicly available EMG dataset used to train myojam's classifier.", href:"http://ninapro.hevs.ch/", cat:"Dataset" },
  { label:"myojam GitHub", desc:"Full open-source codebase including signal processing pipeline and ML training scripts.", href:"https://github.com/Jaden300/myojam", cat:"Code" },
  { label:"Signal playground", desc:"Interactive signal drawing and feature extraction tool.", href:"https://myojam.com/playground", cat:"Tool" },
  { label:"Confusion matrix explorer", desc:"Interactive heatmap of classifier performance.", href:"https://myojam.com/confusion", cat:"Tool" },
  { label:"EMG frequency analyzer", desc:"Load real Ninapro windows and visualise the bandpass filter across all 16 channels.", href:"https://myojam.com/frequency", cat:"Tool" },
  { label:"Gesture reaction game", desc:"A timed gesture-matching game for building intuition around the 6 gesture classes.", href:"https://myojam.com/game", cat:"Tool" },
]

const CAT_COLORS = { Dataset:"#3B82F6", Code:"#8B5CF6", Tool:"#10B981" }

export default function EducatorResources() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <Navbar />

      <div style={{ position:"relative", overflow:"hidden", borderBottom:"1px solid var(--border)", padding:"100px 32px 64px" }}>
        <NeuralNoise color={[0.06, 0.72, 0.40]} opacity={0.85} speed={0.0006} />
        <div style={{ position:"absolute", inset:0, background:"rgba(3,0,18,0.65)", zIndex:1 }} />
        <div style={{ maxWidth:860, margin:"0 auto", position:"relative", zIndex:2 }}>
          <div style={{ display:"flex", gap:8, marginBottom:24 }}>
            <span onClick={()=>navigate("/educators")} style={{ fontSize:13, color:"#10B981", cursor:"pointer" }}>For educators</span>
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>→</span>
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)", fontWeight:300 }}>Resource library</span>
          </div>
          <Reveal>
            <SectionPill>Free · Open access</SectionPill>
            <h1 style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:600, letterSpacing:"-1.5px", color:"#fff", marginBottom:20, lineHeight:1.08 }}>
              Educator resource library.
            </h1>
            <p style={{ fontSize:17, color:"rgba(255,255,255,0.72)", fontWeight:300, lineHeight:1.7, maxWidth:520 }}>
              Datasets, tools, and open-source code for teaching EMG signal processing, gesture classification, and assistive technology. Everything linked here is free and publicly available.
            </p>
          </Reveal>
        </div>
      </div>

      <div style={{ maxWidth:860, margin:"0 auto", padding:"56px 32px 80px" }}>

        {/* External links */}
        <Reveal>
          <div style={{ fontSize:16, fontWeight:600, color:"var(--text)", marginBottom:20 }}>Datasets, tools & code</div>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:56 }}>
          {LINKS.map(link=>(
            <HoverCard key={link.label} color="rgba(255,45,120,0.08)" onClick={()=>window.open(link.href,"_blank")} style={{ background:"var(--bg-secondary)", borderRadius:"var(--radius-sm)", border:"1px solid var(--border)", padding:"18px 20px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:11, fontWeight:500, color:CAT_COLORS[link.cat]||"var(--accent)", background:(CAT_COLORS[link.cat]||"var(--accent)")+"15", borderRadius:100, padding:"2px 8px" }}>{link.cat}</span>
                </div>
                <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", marginBottom:4 }}>{link.label}</div>
                <p style={{ fontSize:12, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.6, margin:0 }}>{link.desc}</p>
              </div>
              <span style={{ fontSize:16, color:"var(--text-tertiary)", marginLeft:12, flexShrink:0 }}>↗</span>
            </HoverCard>
          ))}
        </div>

        {/* Curriculum alignment */}
        <Reveal>
          <div style={{ background:"var(--bg-secondary)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"32px" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:20 }}>Curriculum alignment</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
              {[
                { framework:"NGSS", codes:["HS-LS1-2 (Cell communication)","HS-PS4-1 (Waves and EMFs)","HS-ETS1-2 (Engineering design)"] },
                { framework:"AP / IB", codes:["AP Biology: Nervous system","AP CS Principles: Data & analysis","IB Biology: Neural signalling"] },
                { framework:"Common Core / provincial", codes:["Mathematical reasoning","Data interpretation","Scientific communication"] },
              ].map(fw=>(
                <div key={fw.framework}>
                  <div style={{ fontSize:12, fontWeight:600, color:"var(--text)", marginBottom:10 }}>{fw.framework}</div>
                  {fw.codes.map(c=>(
                    <div key={c} style={{ fontSize:12, color:"var(--text-secondary)", fontWeight:300, marginBottom:6, lineHeight:1.5 }}>{c}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div style={{ marginTop:32, textAlign:"center" }}>
          <button onClick={()=>navigate("/educators")} style={{ background:"transparent", color:"var(--text-secondary)", border:"1px solid var(--border-mid)", borderRadius:100, padding:"10px 24px", fontSize:13, fontFamily:"var(--font)", fontWeight:400, cursor:"pointer" }}>
            ← Back to educator hub
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
