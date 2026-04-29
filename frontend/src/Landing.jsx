import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef, useMemo } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, StaggerList, HoverCard, SectionPill } from "./Animate"
import Threads from "./Threads"
import SplitText from "./components/SplitText"
import SignalModel3D from "./components/SignalModel3D"
import { t } from "./i18n"
import { IconBook, IconGraduate, IconBolt, IconMicroscope } from "./Icons"

const ALL_READS = [
  { slug:"/education/emg-explainer",       tag:"Foundations",  title:"The science of muscle-computer interfaces",       time:"8 min",  desc:"How motor neurons, muscle fibres, and surface electrodes turn movement into electrical data." },
  { slug:"/education/why-emg-is-hard",     tag:"Signal proc.", title:"Why EMG is harder than it looks",                 time:"7 min",  desc:"Noise, placement variability, and individual anatomy - the three problems that make EMG genuinely hard." },
  { slug:"/education/future-of-bci",       tag:"Future",       title:"After EMG: what comes next in BCI",               time:"6 min",  desc:"From implanted electrodes to non-invasive ultrasound - what the next decade of neural interfaces looks like." },
  { slug:"/education/build-your-own",      tag:"Hardware",     title:"Build your own EMG sensor for under $60",         time:"8 min",  desc:"MyoWare 2.0, an Arduino, and a breadboard: everything you need for a working surface EMG sensor." },
  { slug:"/education/muscle-memory",       tag:"Neuroscience", title:"What actually is muscle memory?",                 time:"5 min",  desc:"Motor cortex plasticity, cerebellar loops, and why 'muscle memory' is stored in your brain, not your muscles." },
  { slug:"/education/phantom-limb",        tag:"Neuroscience", title:"The neuroscience of phantom limb sensation",      time:"6 min",  desc:"What amputees' phantom sensations reveal about how the brain constructs and maintains a body image." },
  { slug:"/education/ethics-of-emg",       tag:"Ethics",       title:"Who owns your muscle data?",                     time:"7 min",  desc:"Consent, ownership, and corporate control of neuromuscular data - the questions the field rarely asks." },
  { slug:"/education/windowing-explained", tag:"Signal proc.", title:"Windowing: how raw EMG becomes ML features",      time:"5 min",  desc:"Sliding windows, overlap ratios, and why this single preprocessing decision shapes everything downstream." },
  { slug:"/education/random-forest-emg",   tag:"ML",           title:"Why Random Forest works so well for EMG",         time:"7 min",  desc:"Ensemble learning, feature subspace randomisation, and why RF consistently beats deep nets on tabular EMG data." },
  { slug:"/education/open-source-emg",     tag:"Open source",  title:"The state of open-source EMG",                   time:"6 min",  desc:"Ninapro, OpenBCI, and the researchers building the infrastructure for reproducible biosignal science." },
  { slug:"/research/paper",                tag:"Research",     title:"myojam: the full technical report",               time:"15 min", desc:"84.85% cross-subject accuracy from a 64-feature Random Forest on Ninapro DB5 - every decision documented." },
  { slug:"/research/classifier-analysis",  tag:"Research",     title:"Feature engineering and classifier comparison",   time:"20 min", desc:"RF vs SVM vs k-NN vs LDA under rigorous LOSO cross-validation, with feature importance analysis." },
  { slug:"/research/variability-review",   tag:"Research",     title:"Origins of inter-subject sEMG variability",       time:"25 min", desc:"A structured review of electrode displacement, fatigue, session effects, and the mitigation strategies that work." },
  { slug:"/research/windowing-analysis",   tag:"Research",     title:"Window duration, overlap, and the prosthetic feasibility gap", time:"22 min", desc:"Why no window size simultaneously satisfies both the latency and accuracy requirements for 200 Hz prosthetic control." },
]

const STATS = [
  { val:"84.85%", label:"Cross-subject accuracy",  sub:"Tested on unseen individuals" },
  { val:"11",     label:"Published articles",       sub:"From neuroscience to hardware" },
  { val:"3",      label:"Lesson plans",             sub:"Middle school to university" },
  { val:"MIT",    label:"Open source license",      sub:"Free to use, fork, and build on" },
]

const PILLARS = [
  {
    slug:"/education",
    icon:IconBook,
    color:"#3B82F6",
    title:"Education hub",
    sub:"11 in-depth articles",
    desc:"From the biology of muscle contraction to the ethics of biometric data - rigorously written, openly published, free forever.",
  },
  {
    slug:"/educators",
    icon:IconGraduate,
    color:"#8B5CF6",
    title:"For educators",
    sub:"Ready-to-teach lesson plans",
    desc:"Full lesson plans with datasets, worksheets, and curriculum alignment. From middle school to university, no hardware required.",
  },
  {
    slug:"/demos",
    icon:IconBolt,
    color:"#FF2D78",
    title:"Interactive tools",
    sub:"4 hands-on tools",
    desc:"Signal playground, frequency analyzer, confusion matrix explorer, and a gesture reaction game - all in your browser.",
  },
  {
    slug:"/research",
    icon:IconMicroscope,
    color:"#10B981",
    title:"Open research",
    sub:"Fully documented pipeline",
    desc:"The complete signal processing pipeline, trained model weights, and training data - published, reproducible, MIT licensed.",
  },
]

const ARTICLES = [
  { slug:"/education/emg-explainer",    tag:"Foundations",   title:"The science of muscle-computer interfaces",     time:"8 min" },
  { slug:"/education/why-emg-is-hard",  tag:"Signal proc.",  title:"Why EMG is harder than it looks",               time:"7 min" },
  { slug:"/education/future-of-bci",    tag:"Future",        title:"After EMG: what comes next",                    time:"6 min" },
  { slug:"/education/build-your-own",   tag:"Hardware",      title:"Build your own EMG sensor for under $60",       time:"8 min" },
]

const ROTATING_TEXTS = [
  "surface EMG.",
  "gesture recognition.",
  "muscle-computer interfaces.",
  "open neuroscience.",
  "bioelectric signals.",
  "signal processing.",
  "machine learning.",
  "assistive technology.",
  "real EMG data.",
  "the neuromuscular system.",
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{ padding:"20px 24px", background:"var(--bg)", cursor:"pointer", borderBottom:"1px solid var(--border)", transition:"background 0.15s", userSelect:"none" }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary)"}
      onMouseLeave={e => e.currentTarget.style.background = "var(--bg)"}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
        <div style={{ fontSize:14, fontWeight:500, color:"var(--text)", lineHeight:1.5 }}>{q}</div>
        <div style={{ fontSize:18, color:"var(--accent)", flexShrink:0, lineHeight:1, transition:"transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</div>
      </div>
      {open && (
        <p style={{ fontSize:13, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.75, margin:"12px 0 0", paddingRight:24 }}>{a}</p>
      )}
    </div>
  )
}

function HeroHeading() {
  const [index, setIndex]     = useState(0)
  const [key, setKey]         = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const holdTime = 1500
    const fadeOut  = 300

    const cycle = () => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % ROTATING_TEXTS.length)
        setKey(k => k + 1)
        setVisible(true)
      }, fadeOut)
    }

    const charCount  = ROTATING_TEXTS[index].length
    const animTime   = charCount * 38 + 700
    const totalCycle = animTime + holdTime

    const timer = setTimeout(cycle, totalCycle)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <h1 style={{
      fontSize: "clamp(48px,8vw,96px)",
      fontWeight: 700,
      letterSpacing: "-3.5px",
      lineHeight: 1.1,
      color: "var(--text)",
      marginBottom: 28,
    }}>
      Explore the science of<br/>
      <span style={{
        display: "inline-block",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
        minHeight: "1.1em",
      }}>
        <SplitText
          key={key}
          text={ROTATING_TEXTS[index]}
          delay={38}
          duration={0.55}
          from={{ opacity: 0, y: 32 }}
          to={{ opacity: 1, y: 0 }}
          tag="span"
          style={{ color: "#FF2D78" }}
        />
      </span>
    </h1>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const todaysRead = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000)
    return ALL_READS[day % ALL_READS.length]
  }, [])

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <Navbar />

      {/* ── HERO */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", background:"linear-gradient(160deg, #ffffff 0%, #fff0f5 50%, #f5f0ff 100%)" }}>
        <div style={{ position:"absolute", inset:0, zIndex:0, opacity:0.6 }}>
          <Threads
            color={[1, 0.18, 0.47]}
            amplitude={2.6}
            distance={0}
            enableMouseInteraction={false}
          />
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:180, background:"linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(255,240,245,0.85) 50%, rgba(245,240,255,0.85) 100%)", zIndex:1, pointerEvents:"none" }}/>

        <div style={{ maxWidth:920, margin:"0 auto", padding:"140px 32px 120px", position:"relative", zIndex:1, width:"100%" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,45,120,0.2)", borderRadius:100, padding:"6px 18px", fontSize:13, color:"var(--accent)", fontWeight:500, marginBottom:36, animation:"fadeUp 0.6s ease", boxShadow:"0 2px 12px rgba(255,45,120,0.1)" }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:"var(--accent)",display:"inline-block",animation:"pulse 2s infinite" }}/>
            {t("landing_badge")}
          </div>

          <HeroHeading />

          <p style={{ fontSize:"clamp(17px,2.5vw,21px)", color:"var(--text)", fontWeight:400, lineHeight:1.75, maxWidth:600, marginBottom:48, animation:"fadeUp 0.6s 0.2s ease both" }}>
            {t("landing_sub")}
          </p>

          <div style={{ display:"flex", gap:12, flexWrap:"wrap", animation:"fadeUp 0.6s 0.3s ease both" }}>
            <button onClick={()=>navigate("/education")} style={{ background:"var(--accent)", color:"#fff", border:"none", borderRadius:100, padding:"15px 40px", fontSize:16, fontFamily:"var(--font)", fontWeight:600, cursor:"pointer", boxShadow:"0 4px 24px rgba(255,45,120,0.35)", transition:"transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow="0 8px 32px rgba(255,45,120,0.5)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 24px rgba(255,45,120,0.35)"}}
            >{t("landing_try")}</button>
            <button onClick={()=>navigate("/educators")} style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)", color:"var(--text)", border:"1px solid var(--border-mid)", borderRadius:100, padding:"15px 32px", fontSize:16, fontFamily:"var(--font)", fontWeight:400, cursor:"pointer", transition:"border-color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,45,120,0.3)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border-mid)"}
            >{t("landing_science")}</button>
          </div>
        </div>
      </section>

      {/* ── STATS */}
      <section style={{ background:"var(--bg-secondary)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <StaggerList items={STATS} columns={4} gap={0} renderItem={(s,i)=>(
            <div style={{ padding:"32px 24px", textAlign:"center", borderRight: i<3?"1px solid var(--border)":"none" }}>
              <div style={{ fontSize:32, fontWeight:700, color:"var(--accent)", letterSpacing:"-1.5px", marginBottom:6 }}>{s.val}</div>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300, letterSpacing:"0.04em", textTransform:"uppercase" }}>{s.sub}</div>
            </div>
          )}/>
        </div>
      </section>

      {/* ── TODAY'S READ */}
      <section style={{ padding:"0 32px" }}>
        <div style={{ maxWidth:920, margin:"0 auto", padding:"28px 0" }}>
          <Reveal>
            <div
              onClick={()=>navigate(todaysRead.slug)}
              style={{ display:"flex", alignItems:"center", gap:0, background:"var(--bg-secondary)", border:"1px solid var(--border)", borderLeft:"3px solid var(--accent)", borderRadius:"var(--radius)", overflow:"hidden", cursor:"pointer", transition:"box-shadow 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(255,45,120,0.08)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
            >
              <div style={{ padding:"18px 22px", borderRight:"1px solid var(--border)", flexShrink:0 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.15em", whiteSpace:"nowrap" }}>Today's Read</div>
                <div style={{ fontSize:10, color:"var(--text-tertiary)", fontWeight:300, marginTop:2, whiteSpace:"nowrap" }}>Updated daily</div>
              </div>
              <div style={{ flex:1, padding:"18px 22px", minWidth:0 }}>
                <div style={{ display:"flex", gap:8, marginBottom:5, alignItems:"center" }}>
                  <span style={{ fontSize:11, fontWeight:500, color:"var(--accent)", background:"var(--accent-soft)", border:"1px solid rgba(255,45,120,0.15)", borderRadius:100, padding:"2px 10px", flexShrink:0 }}>{todaysRead.tag}</span>
                  <span style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300 }}>{todaysRead.time} read</span>
                </div>
                <div style={{ fontSize:15, fontWeight:600, color:"var(--text)", marginBottom:2, lineHeight:1.3 }}>{todaysRead.title}</div>
                <div style={{ fontSize:13, color:"var(--text-tertiary)", fontWeight:300, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{todaysRead.desc}</div>
              </div>
              <div style={{ padding:"18px 22px", flexShrink:0, fontSize:18, color:"var(--accent)", opacity:0.7 }}>→</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 3D SIGNAL MODEL */}
      <SignalModel3D />

      {/* ── PILLARS */}
      <section style={{ padding:"80px 32px" }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>{t("pillars_label")}</SectionPill>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:600, letterSpacing:"-1.5px", color:"var(--text)", marginBottom:12 }}>
              {t("pillars_title")}
            </h2>
            <p style={{ fontSize:16, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, maxWidth:520, marginBottom:48 }}>
              {t("pillars_sub")}
            </p>
          </Reveal>
          <StaggerList items={PILLARS} columns={2} gap={16} renderItem={p=>(
            <HoverCard color={p.color+"20"} onClick={()=>navigate(p.slug)} style={{ background:"var(--bg-secondary)", borderRadius:"var(--radius)", border:"1px solid var(--border)", overflow:"hidden", cursor:"pointer" }}>
              <div style={{ background:`linear-gradient(135deg, ${p.color}10 0%, transparent 100%)`, borderBottom:"1px solid var(--border)", padding:"28px 28px 24px" }}>
                <div style={{ width:52, height:52, borderRadius:14, background:p.color+"18", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}><p.icon size={24} color={p.color} /></div>
                <div style={{ fontSize:11, fontWeight:500, color:p.color, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>{p.sub}</div>
                <h3 style={{ fontSize:20, fontWeight:600, color:"var(--text)", letterSpacing:"-0.4px", marginBottom:10 }}>{p.title}</h3>
                <p style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, margin:0 }}>{p.desc}</p>
              </div>
              <div style={{ padding:"16px 28px", display:"flex", justifyContent:"flex-end" }}>
                <span style={{ fontSize:14, fontWeight:500, color:p.color }}>Explore →</span>
              </div>
            </HoverCard>
          )}/>
        </div>
      </section>

      {/* ── RECENT ARTICLES */}
      <section style={{ background:"var(--bg-secondary)", borderTop:"1px solid var(--border)", padding:"80px 32px" }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <Reveal>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:40, gap:16, flexWrap:"wrap" }}>
              <div>
                <SectionPill>{t("articles_label")}</SectionPill>
                <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:600, letterSpacing:"-1.5px", color:"var(--text)", marginBottom:0 }}>
                  {t("articles_title")}
                </h2>
              </div>
              <button onClick={()=>navigate("/education")} style={{ background:"none", border:"1px solid var(--border-mid)", borderRadius:100, padding:"10px 24px", fontSize:14, color:"var(--text-secondary)", fontFamily:"var(--font)", cursor:"pointer", transition:"border-color 0.15s, color 0.15s", flexShrink:0 }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border-mid)";e.currentTarget.style.color="var(--text-secondary)"}}
              >{t("articles_all")}</button>
            </div>
          </Reveal>
          <StaggerList items={ARTICLES} columns={2} gap={12} renderItem={a=>(
            <HoverCard onClick={()=>navigate(a.slug)} style={{ background:"var(--bg)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"24px 28px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                  <span style={{ fontSize:11, fontWeight:500, color:"var(--accent)", background:"var(--accent-soft)", border:"1px solid rgba(255,45,120,0.15)", borderRadius:100, padding:"3px 10px" }}>{a.tag}</span>
                  <span style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300, alignSelf:"center" }}>{a.time}</span>
                </div>
                <div style={{ fontSize:15, fontWeight:600, color:"var(--text)", lineHeight:1.4 }}>{a.title}</div>
              </div>
              <span style={{ fontSize:16, color:"var(--text-tertiary)", flexShrink:0, marginTop:4 }}>→</span>
            </HoverCard>
          )}/>
        </div>
      </section>

      {/* ── THE EMG PIPELINE */}
      <section style={{ padding:"80px 32px" }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>{t("how_label")}</SectionPill>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:600, letterSpacing:"-1.5px", color:"var(--text)", marginBottom:48 }}>
              {t("how_title")}
            </h2>
          </Reveal>
          <StaggerList items={[
            [t("how_step1_title"), t("how_step1_body")],
            [t("how_step2_title"), t("how_step2_body")],
            [t("how_step3_title"), t("how_step3_body")],
            [t("how_step4_title"), t("how_step4_body")],
          ]} columns={2} gap={16} renderItem={([title,body],i)=>(
            <HoverCard style={{ background:"var(--bg-secondary)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"28px 32px" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"var(--accent-soft)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"var(--accent)", marginBottom:16 }}>
                {String(i+1).padStart(2,"0")}
              </div>
              <div style={{ fontSize:16, fontWeight:600, color:"var(--text)", marginBottom:10 }}>{title}</div>
              <p style={{ fontSize:14, color:"var(--text-secondary)", lineHeight:1.75, fontWeight:300, margin:0 }}>{body}</p>
            </HoverCard>
          )}/>
          <Reveal>
            <div style={{ marginTop:24, textAlign:"center" }}>
              <button onClick={()=>navigate("/how-it-works")} style={{ background:"none", border:"1px solid var(--border-mid)", borderRadius:100, padding:"10px 28px", fontSize:14, color:"var(--text-secondary)", fontFamily:"var(--font)", cursor:"pointer", transition:"border-color 0.15s, color 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border-mid)";e.currentTarget.style.color="var(--text-secondary)"}}
              >Full technical walkthrough →</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── KEY FINDINGS */}
      <section style={{ background:"var(--bg-secondary)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"80px 32px" }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>Results</SectionPill>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:600, letterSpacing:"-1.5px", color:"var(--text)", marginBottom:12 }}>
              What the data shows.
            </h2>
            <p style={{ fontSize:16, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, maxWidth:520, marginBottom:48 }}>
              Real numbers from a cross-subject evaluation on Ninapro DB5 — tested on people the model has never seen.
            </p>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            {/* Per-gesture accuracy */}
            <Reveal>
              <div style={{ background:"var(--bg)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"28px 32px" }}>
                <div style={{ fontSize:11, fontWeight:600, color:"var(--text-tertiary)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:20 }}>Per-gesture recall (cross-subject)</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {[
                    { label:"Index flex",  val:88, color:"#FF2D78" },
                    { label:"Fist",        val:87, color:"#EF4444" },
                    { label:"Thumb flex",  val:87, color:"#F59E0B" },
                    { label:"Middle flex", val:83, color:"#3B82F6" },
                    { label:"Pinky flex",  val:82, color:"#10B981" },
                    { label:"Ring flex",   val:80, color:"#8B5CF6" },
                  ].map(r => (
                    <div key={r.label} style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:76, fontSize:12, color:"var(--text-secondary)", fontWeight:300, textAlign:"right", flexShrink:0 }}>{r.label}</div>
                      <div style={{ flex:1, height:6, background:"var(--border)", borderRadius:100, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${r.val}%`, background:r.color, borderRadius:100 }}/>
                      </div>
                      <div style={{ width:36, fontSize:12, fontWeight:600, color:r.color, flexShrink:0 }}>{r.val}%</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:16, fontSize:11, color:"var(--text-tertiary)", fontWeight:300 }}>Mean: 84.85%  ·  LOSO evaluation  ·  10 subjects</div>
              </div>
            </Reveal>

            {/* Classifier comparison + callouts */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <Reveal>
                <div style={{ background:"var(--bg)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"24px 28px" }}>
                  <div style={{ fontSize:11, fontWeight:600, color:"var(--text-tertiary)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Classifier comparison</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                    {[
                      { name:"Random Forest", val:84.85, color:"#FF2D78", best:true },
                      { name:"SVM (RBF)",     val:82.30, color:"#3B82F6", best:false },
                      { name:"k-NN",          val:76.40, color:"#F59E0B", best:false },
                      { name:"LDA",           val:71.80, color:"#AEAEB2", best:false },
                    ].map(c => (
                      <div key={c.name} style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:100, fontSize:12, color: c.best ? "var(--text)" : "var(--text-secondary)", fontWeight: c.best ? 600 : 300, flexShrink:0 }}>{c.name}</div>
                        <div style={{ flex:1, height:5, background:"var(--border)", borderRadius:100, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${(c.val/90)*100}%`, background:c.color, borderRadius:100 }}/>
                        </div>
                        <div style={{ width:44, fontSize:12, fontWeight: c.best ? 700 : 300, color:c.color, flexShrink:0 }}>{c.val}%</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:12, fontSize:11, color:"var(--text-tertiary)", fontWeight:300 }}>All: LOSO · Ninapro DB5 · 10 subjects</div>
                </div>
              </Reveal>

              {[
                { label:"Cross-subject gap", val:"84.85% vs ~96%", sub:"Cross-subject vs. within-subject — the 11 pp reality of real-world deployment", color:"#F59E0B" },
                { label:"Prosthetic threshold", val:"< 300 ms", sub:"Required latency for natural prosthetic control. Achievable accuracy at that window: ~65%", color:"#EF4444" },
              ].map((item, i) => (
                <Reveal key={item.label} delay={i * 0.05}>
                  <div style={{ background:"var(--bg)", border:"1px solid var(--border)", borderLeft:`3px solid ${item.color}`, borderRadius:"0 var(--radius) var(--radius) 0", padding:"16px 20px" }}>
                    <div style={{ fontSize:10, fontWeight:600, color:item.color, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:3 }}>{item.label}</div>
                    <div style={{ fontSize:20, fontWeight:700, color:"var(--text)", letterSpacing:"-0.5px", marginBottom:3 }}>{item.val}</div>
                    <div style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300, lineHeight:1.5 }}>{item.sub}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal>
            <div style={{ marginTop:24, textAlign:"center" }}>
              <button onClick={() => navigate("/research")} style={{ background:"none", border:"1px solid var(--border-mid)", borderRadius:100, padding:"10px 28px", fontSize:14, color:"var(--text-secondary)", fontFamily:"var(--font)", cursor:"pointer", transition:"border-color 0.15s, color 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border-mid)";e.currentTarget.style.color="var(--text-secondary)"}}
              >Read the full research →</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SOCIAL */}
      <section style={{ padding:"0 32px 0", marginBottom:0 }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <Reveal>
            <div style={{ background:"var(--bg-secondary)", border:"1px solid var(--border)", borderRadius:"var(--radius)", padding:"32px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:24, flexWrap:"wrap" }}>
              <div>
                <div style={{ fontSize:10, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.2em", marginBottom:6 }}>Follow the project</div>
                <div style={{ fontSize:16, fontWeight:600, color:"var(--text)", letterSpacing:"-0.3px" }}>Stay connected as myojam grows.</div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                {[
                  { icon:"fab fa-github",      href:"https://github.com/Jaden300/myojam",          label:"GitHub"    },
                  { icon:"fab fa-linkedin-in",  href:"https://linkedin.com/in/jaden-wong09",        label:"LinkedIn"  },
                  { icon:"fab fa-instagram",    href:"https://instagram.com/YOUR_HANDLE",           label:"Instagram" },
                  { icon:"fab fa-x-twitter",    href:"https://x.com/YOUR_HANDLE",                  label:"X"         },
                  { icon:"fab fa-youtube",      href:"https://youtube.com/YOUR_CHANNEL",            label:"YouTube"   },
                  { icon:"fab fa-tiktok",       href:"https://tiktok.com/@YOUR_HANDLE",            label:"TikTok"    },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label} style={{
                    width:44, height:44, borderRadius:"50%",
                    border:"1px solid var(--border)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"var(--text-secondary)", fontSize:16,
                    background:"var(--bg)", transition:"all 0.2s"
                  }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.color="var(--accent)"; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(255,45,120,0.2)" }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text-secondary)"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none" }}
                  ><i className={s.icon}/></a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ */}
      <section style={{ padding:"64px 32px 0" }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>Common questions</SectionPill>
            <h2 style={{ fontSize:"clamp(24px,3.5vw,36px)", fontWeight:600, letterSpacing:"-1px", color:"var(--text)", marginBottom:40 }}>
              Frequently asked.
            </h2>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(400px, 1fr))", gap:2, border:"1px solid var(--border)", borderRadius:"var(--radius)", overflow:"hidden" }}>
            {[
              {
                q:"Do I need EMG hardware to use myojam?",
                a:"No. All four browser tools — Signal Playground, Frequency Analyzer, Confusion Matrix Explorer, and Gesture Reaction Game — run entirely in your browser using real Ninapro DB5 data. The desktop app requires a MyoWare 2.0 sensor and Arduino, but the website works without any hardware.",
              },
              {
                q:'What does "84.85% accuracy" actually mean?',
                a:"It's cross-subject accuracy: the model was trained on 9 subjects and tested on the 10th, repeated across all 10 subjects (leave-one-subject-out). The 84.85% is the mean across all 10 folds. It reflects how well the classifier works on people it has never seen — the realistic, hard metric.",
              },
              {
                q:"What gestures does myojam recognize?",
                a:"Six hand gestures: index finger flex, middle finger flex, ring finger flex, pinky finger flex, thumb flex, and full fist. These were chosen for biomechanical distinctiveness and natural mapping to computer control actions like scroll, click, and navigate.",
              },
              {
                q:"Is myojam free? Can I use it commercially?",
                a:"Yes. Every part of myojam — the classifier, desktop app, website, research, lesson plans, and datasets — is released under the MIT licence. You can use it, modify it, and build on it commercially with no restrictions beyond attribution.",
              },
              {
                q:"How does the classifier run without an internet connection?",
                a:"The trained Random Forest model is bundled inside the desktop app as a .pkl file and loaded locally. No API calls, no cloud inference. The entire signal processing pipeline — filter, windowing, feature extraction, prediction — runs on your machine.",
              },
              {
                q:"Why is there a gap between 84.85% and clinical-grade accuracy?",
                a:"Lab benchmarks assume consistent electrode placement, controlled posture, and deliberate isolated movements. Real-world conditions introduce placement shifts between sessions (−5 to −15pp), limb position changes, co-contraction, and fatigue. Closing this gap is an active open problem — we document it honestly in the research.",
              },
            ].map(({ q, a }, i) => (
              <FAQItem key={i} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA */}
      <section style={{ padding:"0 32px 80px" }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <Reveal>
            <div style={{ background:"linear-gradient(135deg, rgba(255,45,120,0.06) 0%, rgba(139,92,246,0.06) 100%)", border:"1px solid rgba(255,45,120,0.15)", borderRadius:"var(--radius)", padding:"56px 48px", textAlign:"center" }}>
              <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:600, letterSpacing:"-1.5px", color:"var(--text)", marginBottom:16 }}>
                {t("cta_title")}
              </h2>
              <p style={{ fontSize:16, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.75, maxWidth:480, margin:"0 auto 36px" }}>
                {t("cta_sub")}
              </p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                <button onClick={()=>navigate("/education")} style={{ background:"var(--accent)", color:"#fff", border:"none", borderRadius:100, padding:"14px 36px", fontSize:15, fontFamily:"var(--font)", fontWeight:600, cursor:"pointer", boxShadow:"0 4px 24px rgba(255,45,120,0.3)", transition:"transform 0.15s, box-shadow 0.15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow="0 8px 32px rgba(255,45,120,0.45)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 24px rgba(255,45,120,0.3)"}}
                >{t("cta_demos")}</button>
                <button onClick={()=>navigate("/education")} style={{ background:"none", color:"var(--text)", border:"1px solid var(--border-mid)", borderRadius:100, padding:"14px 28px", fontSize:15, fontFamily:"var(--font)", fontWeight:400, cursor:"pointer", transition:"border-color 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,45,120,0.3)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border-mid)"}
                >{t("cta_articles")}</button>
                <button onClick={()=>navigate("/educators")} style={{ background:"none", color:"#8B5CF6", border:"1px solid rgba(139,92,246,0.3)", borderRadius:100, padding:"14px 28px", fontSize:15, fontFamily:"var(--font)", fontWeight:400, cursor:"pointer", transition:"border-color 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="#8B5CF6"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(139,92,246,0.3)"}
                >{t("cta_educators")}</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Desktop app download */}
      <section style={{ borderTop:"1px solid var(--border)", background:"var(--bg-secondary)", padding:"64px 32px" }}>
        <div style={{ maxWidth:860, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", gap:40, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:11, fontWeight:600, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>macOS Desktop App</div>
            <h2 style={{ fontSize:"clamp(22px,3.5vw,36px)", fontWeight:600, letterSpacing:"-1px", color:"var(--text)", lineHeight:1.1, marginBottom:16 }}>
              The future of EMG,<br/>in your hands.
            </h2>
            <p style={{ fontSize:15, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.75, maxWidth:440, marginBottom:0 }}>
              Real-time gesture classification from a surface EMG sensor — running locally on your Mac, powered by a Random Forest with 84.85% cross-subject accuracy. Live waveform, 3D hand model, session tracking.
            </p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, flexShrink:0 }}>
            <button
              onClick={() => navigate("/download")}
              style={{ background:"var(--accent)", color:"#fff", borderRadius:100, padding:"14px 32px", fontSize:15, fontWeight:500, border:"none", fontFamily:"var(--font)", cursor:"pointer", display:"flex", alignItems:"center", gap:8, justifyContent:"center", transition:"opacity 0.15s, transform 0.15s", boxShadow:"0 4px 20px rgba(255,45,120,0.3)" }}
              onMouseEnter={e => { e.currentTarget.style.opacity="0.88"; e.currentTarget.style.transform="scale(1.03)" }}
              onMouseLeave={e => { e.currentTarget.style.opacity="1"; e.currentTarget.style.transform="scale(1)" }}
            >
              <svg width="15" height="15" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v7M3 5l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Get the desktop app →
            </button>
            <div style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300, textAlign:"center" }}>
              v1.0.0 · ~295 MB · macOS 12+ · MIT licence
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
