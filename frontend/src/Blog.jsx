import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, SectionPill } from "./Animate"
import LiquidChrome from "./components/LiquidChrome"

const CYAN   = "#06B6D4"
const BLUE   = "#3B82F6"
const PURPLE = "#8B5CF6"
const GREEN  = "#10B981"
const AMBER  = "#F59E0B"
const PINK   = "#FF2D78"

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, vis]
}

// ── EMG Hero Canvas ───────────────────────────────────────────────────────────
function EMGPulse() {
  const canvasRef = useRef(null)
  const raf = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d")
    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    })
    ro.observe(canvas)
    const phases = [0,1.3,2.6,3.9,5.2], freqs = [1.2,1.7,0.9,1.4,1.1]
    let t = 0
    function draw() {
      const W = canvas.offsetWidth, H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)
      for (let c = 0; c < 5; c++) {
        const cy = H / 6 * (c + 1), amp = (H / 6) * 0.38
        ctx.filter = `blur(2px)`
        ctx.strokeStyle = `rgba(255,45,120,${0.06 + c * 0.03})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        for (let x = 0; x < W; x++) {
          const y = cy + amp * 0.6 * Math.sin(x * 0.025 * freqs[c] + phases[c] + t * freqs[c])
                      + amp * 0.3 * Math.sin(x * 0.06  + phases[c] * 1.5 + t * 0.7)
          x === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
        }
        ctx.stroke()
        ctx.filter = "none"
        ctx.strokeStyle = `rgba(255,45,120,${0.18 + c * 0.04})`
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let x = 0; x < W; x++) {
          const y = cy + amp * 0.6 * Math.sin(x * 0.025 * freqs[c] + phases[c] + t * freqs[c])
                      + amp * 0.3 * Math.sin(x * 0.06  + phases[c] * 1.5 + t * 0.7)
          x === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
        }
        ctx.stroke()
        phases[c] += 0.018
      }
      t += 0.012
      raf.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { ro.disconnect(); cancelAnimationFrame(raf.current) }
  }, [])
  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}/>
}

// ── Card 1: The 300ms Wall ────────────────────────────────────────────────────
const WIN_DATA = [
  { w:100,  a:62.4  }, { w:200, a:68.2  }, { w:300,  a:73.1  },
  { w:400,  a:76.8  }, { w:600, a:80.4  }, { w:800,  a:83.2  },
  { w:1000, a:84.85 }, { w:1500,a:85.1  }, { w:2000, a:85.3  },
]

function WindowChart({ vis }) {
  const W=300, H=140, PL=36, PR=12, PT=12, PB=28
  const CW=W-PL-PR, CH=H-PT-PB
  const tx = w => PL + (w/2000)*CW
  const ty = a => PT + (1-(a-55)/35)*CH
  const lineD = WIN_DATA.map((p,i)=>`${i===0?"M":"L"}${tx(p.w)},${ty(p.a)}`).join(" ")
  const areaD = `${lineD} L${tx(2000)},${ty(55)} L${tx(100)},${ty(55)} Z`
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
      <defs>
        <linearGradient id="cwGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CYAN} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={CYAN} stopOpacity="0"/>
        </linearGradient>
        <clipPath id="cwClip"><rect x={PL} y={PT} width={CW} height={CH}/></clipPath>
      </defs>
      {[65,70,75,80,85].map(a=>(
        <g key={a}>
          <line x1={PL} x2={PL+CW} y1={ty(a)} y2={ty(a)} stroke={`${CYAN}10`}/>
          <text x={PL-3} y={ty(a)+4} textAnchor="end" fill={`${CYAN}50`} fontSize={7.5}>{a}%</text>
        </g>
      ))}
      {/* 80% clinical threshold */}
      <line x1={PL} x2={PL+CW} y1={ty(80)} y2={ty(80)} stroke={`${GREEN}55`} strokeWidth={1} strokeDasharray="4,3"/>
      <text x={PL+CW-2} y={ty(80)-3} textAnchor="end" fill={`${GREEN}80`} fontSize={7}>80% target</text>
      {/* 300ms deadline */}
      <line x1={tx(300)} x2={tx(300)} y1={PT} y2={PT+CH} stroke="rgba(239,68,68,0.55)" strokeWidth={1.5} strokeDasharray="4,3"/>
      <text x={tx(300)+3} y={PT+8} fill="rgba(239,68,68,0.75)" fontSize={7}>300ms</text>
      {/* Area */}
      <path d={areaD} fill="url(#cwGrad)" clipPath="url(#cwClip)" opacity={vis?1:0} style={{ transition:"opacity 0.5s 0.6s" }}/>
      {/* Line */}
      <path d={lineD} fill="none" stroke={CYAN} strokeWidth={2} clipPath="url(#cwClip)"
        strokeDasharray={380} strokeDashoffset={vis?0:380}
        style={{ transition:"stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1) 0.2s" }}
        strokeLinecap="round" strokeLinejoin="round"/>
      {WIN_DATA.map((p,i)=>(
        <circle key={i} cx={tx(p.w)} cy={ty(p.a)} r={p.w===1000?5:3}
          fill={p.w===1000?CYAN:"transparent"} stroke={p.w===1000?CYAN:`${CYAN}60`} strokeWidth={1.5}
          opacity={vis?1:0} style={{ transition:`opacity 0.3s ${0.9+i*0.07}s` }}/>
      ))}
      {[0,500,1000,1500,2000].map(w=>(
        <text key={w} x={tx(w)} y={H-3} textAnchor="middle" fill={`${CYAN}35`} fontSize={7}>{w}ms</text>
      ))}
    </svg>
  )
}

function LatencyCard() {
  const [open, setOpen] = useState(false)
  const [chartRef, chartVis] = useInView(0.05)
  const [gaugeVis, setGaugeVis] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGaugeVis(true), 700); return () => clearTimeout(t) }, [])

  return (
    <div style={{ border:`1px solid ${CYAN}25`, borderRadius:16, overflow:"hidden", marginBottom:20, background:"var(--bg)" }}>
      <div style={{ display:"grid", gridTemplateColumns:"110px 1fr" }}>
        {/* Dark left panel */}
        <div style={{ background:"linear-gradient(160deg,#001920,#000E14)", padding:"28px 20px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", borderRight:`1px solid ${CYAN}18` }}>
          <div style={{ fontSize:52, fontWeight:800, color:CYAN, letterSpacing:"-3px", lineHeight:1 }}>300</div>
          <div style={{ fontSize:12, fontWeight:700, color:`${CYAN}70`, letterSpacing:"0.15em", textTransform:"uppercase" }}>ms</div>
          <div style={{ fontSize:8.5, color:`${CYAN}45`, textTransform:"uppercase", letterSpacing:"0.1em", marginTop:6, textAlign:"center", lineHeight:1.6 }}>the<br/>hard wall</div>
        </div>

        <div style={{ padding:"22px 22px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <span style={{ fontSize:9.5, fontWeight:700, color:CYAN, background:`${CYAN}14`, border:`1px solid ${CYAN}30`, borderRadius:100, padding:"2px 9px" }}>EMG Fact · Apr 2025</span>
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:7, letterSpacing:"-0.3px", lineHeight:1.3 }}>
            The 300ms wall: real-time EMG has a latency problem
          </div>
          <p style={{ fontSize:12, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.65, margin:"0 0 14px" }}>
            For a prosthetic limb to feel natural, the detect-classify-move loop must finish in under 300ms. Longer and the hand stops feeling like yours.
          </p>
          {/* Mini gauge always visible */}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:8.5, fontWeight:600, color:`${CYAN}70`, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>End-to-end latency</div>
            <div style={{ position:"relative", paddingBottom:14 }}>
              <div style={{ display:"flex", height:8, borderRadius:4, overflow:"hidden" }}>
                <div style={{ flex:3, background:`${GREEN}28`, borderRight:`1px solid ${GREEN}40` }}/>
                <div style={{ flex:3, background:`${AMBER}18`, borderRight:`1px solid ${AMBER}35` }}/>
                <div style={{ flex:4, background:"rgba(239,68,68,0.12)" }}/>
              </div>
              <div style={{ position:"absolute", top:-3, left:gaugeVis?"64%":"0%", transform:"translateX(-50%)", transition:"left 1.3s cubic-bezier(0.22,1,0.36,1) 0.5s" }}>
                <div style={{ width:14, height:14, borderRadius:"50%", background:CYAN, border:"2px solid rgba(255,255,255,0.88)", boxShadow:`0 0 10px ${CYAN}90` }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", position:"absolute", bottom:0, left:0, right:0 }}>
                <span style={{ fontSize:7.5, color:GREEN, fontWeight:600 }}>0</span>
                <span style={{ fontSize:7.5, color:AMBER, fontWeight:600 }}>300ms</span>
                <span style={{ fontSize:7.5, color:CYAN, fontWeight:700 }}>~640ms</span>
                <span style={{ fontSize:7.5, color:"rgba(239,68,68,0.55)" }}>1s+</span>
              </div>
            </div>
          </div>
          <button onClick={()=>setOpen(o=>!o)} style={{ background:"none", border:`1px solid ${CYAN}30`, borderRadius:100, padding:"5px 14px", fontSize:11, color:CYAN, cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.background=`${CYAN}12`}
            onMouseLeave={e=>e.currentTarget.style.background="none"}
          >{open?"Collapse ↑":"Full analysis ↓"}</button>
        </div>
      </div>

      {open && (
        <div ref={chartRef} style={{ borderTop:`1px solid ${CYAN}18`, padding:"28px 24px", background:`${CYAN}04` }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:28, alignItems:"start" }}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"var(--text)", marginBottom:10, letterSpacing:"-0.2px" }}>Window size vs. classification accuracy</div>
              <WindowChart vis={chartVis}/>
            </div>
            <div style={{ paddingTop:4 }}>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--text)", marginBottom:8 }}>You can't have both</div>
              <p style={{ fontSize:11.5, color:"var(--text-secondary)", lineHeight:1.75, fontWeight:300, marginBottom:14 }}>
                A 100ms window gives 62.4% accuracy. A 1000ms window gives 84.85%. But a 1000ms window takes at least 1000ms to fill — already 3× past the deadline before processing begins. Every window shorter than ~600ms fails to cross the 80% clinical threshold.
              </p>
              <div style={{ padding:"12px 16px", background:`${CYAN}08`, border:`1px solid ${CYAN}20`, borderLeft:`3px solid ${CYAN}`, borderRadius:"0 10px 10px 0", display:"grid", gap:6 }}>
                {[["100ms window","62.4% accuracy"],["300ms window","73.1% — below clinical"],["1000ms window","84.85% — myojam's point"]].map(([a,b])=>(
                  <div key={a} style={{ display:"flex", justifyContent:"space-between", gap:12 }}>
                    <span style={{ fontSize:11, fontWeight:600, color:CYAN }}>{a}</span>
                    <span style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Card 2: Cross-Subject Failure ─────────────────────────────────────────────
const SUBJECTS = [
  { id:1, cross:87.2, intra:96.4 }, { id:2, cross:79.3, intra:94.8 },
  { id:3, cross:91.4, intra:97.2 }, { id:4, cross:82.6, intra:95.6 },
  { id:5, cross:88.9, intra:96.8 }, { id:6, cross:76.1, intra:93.2 },
  { id:7, cross:90.2, intra:97.5 }, { id:8, cross:83.7, intra:95.1 },
  { id:9, cross:78.4, intra:94.0 }, { id:10, cross:85.0,intra:96.1 },
]

function SubjectDots({ vis }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
      {SUBJECTS.map((s,i) => (
        <div key={s.id} style={{ textAlign:"center", opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(8px)", transition:`opacity 0.35s ${0.3+i*0.06}s, transform 0.35s ${0.3+i*0.06}s` }}>
          {/* Person icon */}
          <svg width={28} height={28} viewBox="0 0 28 28" style={{ margin:"0 auto", display:"block" }}>
            <circle cx={14} cy={9} r={5} fill={s.cross < 81 ? `${BLUE}60` : BLUE}/>
            <path d={`M4,27 Q4,18 14,18 Q24,18 24,27`} fill={s.cross < 81 ? `${BLUE}60` : BLUE}/>
          </svg>
          {/* Accuracy bar */}
          <div style={{ height:3, background:"rgba(59,130,246,0.12)", borderRadius:99, marginTop:4, overflow:"hidden" }}>
            <div style={{ height:"100%", background: s.cross < 81 ? `${BLUE}60` : BLUE, borderRadius:99, width: vis?`${(s.cross-60)/40*100}%`:"0%", transition:`width 0.7s cubic-bezier(0.22,1,0.36,1) ${0.5+i*0.05}s` }}/>
          </div>
          <div style={{ fontSize:7.5, color:`${BLUE}90`, marginTop:2, fontWeight:600 }}>{s.cross.toFixed(1)}%</div>
        </div>
      ))}
    </div>
  )
}

function CrossSubjectCard() {
  const [open, setOpen] = useState(false)
  const [cardRef, cardVis] = useInView(0.1)

  return (
    <div ref={cardRef} style={{ border:`1px solid ${BLUE}25`, borderRadius:16, overflow:"hidden", marginBottom:20, background:"var(--bg)" }}>
      {/* Header: subject grid */}
      <div style={{ background:`linear-gradient(135deg,${BLUE}06,transparent)`, padding:"22px 22px 16px", borderBottom:`1px solid ${BLUE}14` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, marginBottom:16 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ fontSize:9.5, fontWeight:700, color:BLUE, background:`${BLUE}14`, border:`1px solid ${BLUE}30`, borderRadius:100, padding:"2px 9px" }}>EMG Fact · Apr 2025</span>
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:6, letterSpacing:"-0.3px", lineHeight:1.3 }}>
              Why your classifier fails on new people
            </div>
            <p style={{ fontSize:12, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.65, margin:0, maxWidth:400 }}>
              84.85% cross-subject accuracy means roughly <strong style={{ color:BLUE, fontWeight:600 }}>1 in 7</strong> gesture predictions is wrong — and it degrades when the model sees someone it never trained on.
            </p>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:38, fontWeight:800, color:BLUE, letterSpacing:"-2px", lineHeight:1 }}>1 in 7</div>
            <div style={{ fontSize:9, color:`${BLUE}60`, textTransform:"uppercase", letterSpacing:"0.08em", lineHeight:1.5 }}>predictions<br/>wrong</div>
          </div>
        </div>
        {/* Subject accuracy grid */}
        <div>
          <div style={{ fontSize:8.5, fontWeight:600, color:`${BLUE}60`, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Per-subject cross-subject accuracy (10 subjects, Ninapro DB5)</div>
          <SubjectDots vis={cardVis}/>
        </div>
      </div>

      <div style={{ padding:"14px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
        <div style={{ display:"flex", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:BLUE }}/>
            <span style={{ fontSize:10, color:"var(--text-tertiary)" }}>≥81% cross-subject</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:`${BLUE}55` }}/>
            <span style={{ fontSize:10, color:"var(--text-tertiary)" }}>&lt;81% — harder subjects</span>
          </div>
        </div>
        <button onClick={()=>setOpen(o=>!o)} style={{ background:"none", border:`1px solid ${BLUE}30`, borderRadius:100, padding:"5px 14px", fontSize:11, color:BLUE, cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.15s" }}
          onMouseEnter={e=>e.currentTarget.style.background=`${BLUE}12`}
          onMouseLeave={e=>e.currentTarget.style.background="none"}
        >{open?"Collapse ↑":"Why it happens ↓"}</button>
      </div>

      {open && (
        <div style={{ borderTop:`1px solid ${BLUE}18`, padding:"24px 22px", background:`${BLUE}04` }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:28 }}>
            {/* Variance comparison SVG */}
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"var(--text)", marginBottom:10 }}>Intra- vs cross-subject variance</div>
              <svg width="100%" viewBox="0 0 260 120" style={{ overflow:"visible" }}>
                <defs>
                  <linearGradient id="intraG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={PURPLE} stopOpacity="0.4"/>
                    <stop offset="100%" stopColor={PURPLE} stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="crossG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BLUE} stopOpacity="0.4"/>
                    <stop offset="100%" stopColor={BLUE} stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Y axis labels */}
                {[70,80,90,100].map(v=>(
                  <g key={v}>
                    <text x={26} y={10+(1-(v-65)/40)*100+4} textAnchor="end" fill="rgba(59,130,246,0.4)" fontSize={7.5}>{v}%</text>
                    <line x1={28} x2={260} y1={10+(1-(v-65)/40)*100} y2={10+(1-(v-65)/40)*100} stroke="rgba(59,130,246,0.06)"/>
                  </g>
                ))}
                {/* Intra-subject: tight cluster ~94-97.5% */}
                {SUBJECTS.map((s,i)=>{
                  const y = 10+(1-(s.intra-65)/40)*100
                  const x = 140+i*11
                  return <circle key={s.id} cx={x} cy={y} r={4} fill={PURPLE} opacity={0.75}/>
                })}
                <text x={200} y={6} textAnchor="middle" fill={`${PURPLE}90`} fontSize={8} fontWeight={600}>intra-subject</text>
                {/* Cross-subject: spread 76-91% */}
                {SUBJECTS.map((s,i)=>{
                  const y = 10+(1-(s.cross-65)/40)*100
                  const x = 35+i*11
                  return <circle key={s.id} cx={x} cy={y} r={4} fill={BLUE} opacity={0.75}/>
                })}
                <text x={90} y={6} textAnchor="middle" fill={`${BLUE}90`} fontSize={8} fontWeight={600}>cross-subject</text>
                {/* Average lines */}
                <line x1={30} x2={130} y1={10+(1-(84.85-65)/40)*100} y2={10+(1-(84.85-65)/40)*100} stroke={`${BLUE}60`} strokeDasharray="4,3" strokeWidth={1.5}/>
                <line x1={140} x2={258} y1={10+(1-(96.1-65)/40)*100} y2={10+(1-(96.1-65)/40)*100} stroke={`${PURPLE}60`} strokeDasharray="4,3" strokeWidth={1.5}/>
              </svg>
            </div>
            <div style={{ paddingTop:4 }}>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--text)", marginBottom:8 }}>The fix isn't more data</div>
              <p style={{ fontSize:11.5, color:"var(--text-secondary)", lineHeight:1.75, fontWeight:300, marginBottom:12 }}>
                Within-subject accuracy inflates numbers — train and test on the same person and you get 95%+. But that's memorisation. Cross-subject is the real test: does it work for someone it's never seen?
              </p>
              <p style={{ fontSize:11.5, color:"var(--text-secondary)", lineHeight:1.75, fontWeight:300 }}>
                The real solution is domain adaptation — teaching the model to adjust to a new user's signal distribution in real time. That's the unsolved problem that makes EMG interfaces hard to ship at scale.
              </p>
              <div style={{ marginTop:14, padding:"10px 14px", background:`${BLUE}08`, border:`1px solid ${BLUE}20`, borderLeft:`3px solid ${BLUE}`, borderRadius:"0 8px 8px 0", display:"flex", justifyContent:"space-between" }}>
                <div><div style={{ fontSize:16, fontWeight:700, color:BLUE }}>84.85%</div><div style={{ fontSize:9, color:"var(--text-tertiary)" }}>cross-subject avg</div></div>
                <div style={{ textAlign:"right" }}><div style={{ fontSize:16, fontWeight:700, color:PURPLE }}>~96.1%</div><div style={{ fontSize:9, color:"var(--text-tertiary)" }}>intra-subject avg</div></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Card 3: Forearm Anatomy ───────────────────────────────────────────────────
function ForearmSVG({ size = 200 }) {
  const S = size
  return (
    <svg width={S} height={S * 1.15} viewBox="0 0 200 230" style={{ display:"block" }}>
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`${PURPLE}18`}/>
          <stop offset="100%" stopColor={`${PURPLE}06`}/>
        </radialGradient>
        <radialGradient id="m1g"><stop offset="0%" stopColor={`${PURPLE}55`}/><stop offset="100%" stopColor={`${PURPLE}22`}/></radialGradient>
        <radialGradient id="m2g"><stop offset="0%" stopColor={`${PINK}45`}/><stop offset="100%" stopColor={`${PINK}18`}/></radialGradient>
        <radialGradient id="m3g"><stop offset="0%" stopColor={`${BLUE}45`}/><stop offset="100%" stopColor={`${BLUE}18`}/></radialGradient>
        <radialGradient id="m4g"><stop offset="0%" stopColor={`${CYAN}45`}/><stop offset="100%" stopColor={`${CYAN}18`}/></radialGradient>
        <radialGradient id="m5g"><stop offset="0%" stopColor={`${AMBER}45`}/><stop offset="100%" stopColor={`${AMBER}18`}/></radialGradient>
        <radialGradient id="m6g"><stop offset="0%" stopColor={`${GREEN}40`}/><stop offset="100%" stopColor={`${GREEN}15`}/></radialGradient>
      </defs>
      {/* Outer skin boundary */}
      <ellipse cx={100} cy={115} rx={72} ry={90} fill="url(#skinGrad)" stroke={`${PURPLE}35`} strokeWidth={1.5}/>
      {/* Fascia layer */}
      <ellipse cx={100} cy={115} rx={58} ry={75} fill="none" stroke={`${PURPLE}20`} strokeWidth={1} strokeDasharray="4,3"/>
      {/* Muscle groups */}
      <ellipse cx={88}  cy={90}  rx={18} ry={22} fill="url(#m1g)" stroke={`${PURPLE}40`} strokeWidth={1}/>
      <ellipse cx={118} cy={88}  rx={16} ry={20} fill="url(#m2g)" stroke={`${PINK}35`} strokeWidth={1}/>
      <ellipse cx={78}  cy={128} rx={14} ry={18} fill="url(#m3g)" stroke={`${BLUE}35`} strokeWidth={1}/>
      <ellipse cx={122} cy={125} rx={15} ry={19} fill="url(#m4g)" stroke={`${CYAN}35`} strokeWidth={1}/>
      <ellipse cx={100} cy={150} rx={12} ry={14} fill="url(#m5g)" stroke={`${AMBER}35`} strokeWidth={1}/>
      <ellipse cx={100} cy={110} rx={8}  ry={10} fill="url(#m6g)" stroke={`${GREEN}35`} strokeWidth={1}/>
      {/* Ulna bone */}
      <ellipse cx={82} cy={115} rx={5} ry={6} fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth={1}/>
      {/* Radius bone */}
      <ellipse cx={118} cy={115} rx={6} ry={7} fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth={1}/>
      {/* Electrode dots on skin surface */}
      {[[-1,0],[1,-0.4],[0.7,0.8],[-0.7,0.8],[0,-1]].map(([ex,ey],i)=>{
        const angle = (i / 5) * Math.PI * 2 - Math.PI/2
        const ex2 = 100 + Math.cos(angle) * 68
        const ey2 = 115 + Math.sin(angle) * 86
        return (
          <g key={i}>
            <circle cx={ex2} cy={ey2} r={6} fill={PURPLE} opacity={0.9} stroke="rgba(255,255,255,0.6)" strokeWidth={1.5}/>
            <circle cx={ex2} cy={ey2} r={3} fill="rgba(255,255,255,0.5)"/>
          </g>
        )
      })}
      {/* Cross-talk dashed lines */}
      <line x1={88} y1={95} x2={118} y2={92} stroke={`${PINK}50`} strokeWidth={1} strokeDasharray="3,2"/>
      <line x1={78} y1={130} x2={122} y2={128} stroke={`${BLUE}50`} strokeWidth={1} strokeDasharray="3,2"/>
      {/* Labels */}
      <text x={72} y={84}  textAnchor="middle" fill={`${PURPLE}CC`} fontSize={7} fontWeight={600}>FDS</text>
      <text x={128} y={82} textAnchor="middle" fill={`${PINK}CC`} fontSize={7} fontWeight={600}>FDP</text>
      <text x={63}  y={128} textAnchor="middle" fill={`${BLUE}CC`} fontSize={7} fontWeight={600}>ECU</text>
      <text x={136} y={125} textAnchor="middle" fill={`${CYAN}CC`} fontSize={7} fontWeight={600}>ECRL</text>
      <text x={100} y={162} textAnchor="middle" fill={`${AMBER}CC`} fontSize={7} fontWeight={600}>FCR</text>
    </svg>
  )
}

function ForearmCard() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ border:`1px solid ${PURPLE}25`, borderRadius:16, overflow:"hidden", marginBottom:20, background:"var(--bg)" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto" }}>
        <div style={{ padding:"24px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <span style={{ fontSize:9.5, fontWeight:700, color:PURPLE, background:`${PURPLE}14`, border:`1px solid ${PURPLE}30`, borderRadius:100, padding:"2px 9px" }}>EMG Fact · Apr 2025</span>
          </div>
          <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:8 }}>
            <div style={{ fontSize:48, fontWeight:800, color:PURPLE, letterSpacing:"-3px", lineHeight:1 }}>20+</div>
            <div style={{ fontSize:11, color:`${PURPLE}70`, fontWeight:500 }}>muscles</div>
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:8, letterSpacing:"-0.3px", lineHeight:1.3 }}>
            Your forearm controls 5 fingers with 20+ muscles
          </div>
          <p style={{ fontSize:12, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.65, marginBottom:14 }}>
            Surface EMG electrodes sit on skin — underneath are 20+ muscles packed in a space smaller than your hand. A 2cm electrode picks up the summed field of 2–3 muscles simultaneously.
          </p>
          {/* Muscle list mini */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
            {[["FDS",PURPLE],["FDP",PINK],["ECU",BLUE],["ECRL",CYAN],["FCR",AMBER],["FCU",GREEN]].map(([n,c])=>(
              <div key={n} style={{ fontSize:9.5, fontWeight:600, color:c, background:`${c}12`, border:`1px solid ${c}25`, borderRadius:6, padding:"2px 8px" }}>{n}</div>
            ))}
            <div style={{ fontSize:9.5, color:"var(--text-tertiary)", padding:"2px 4px" }}>+14 more</div>
          </div>
          <button onClick={()=>setOpen(o=>!o)} style={{ background:"none", border:`1px solid ${PURPLE}30`, borderRadius:100, padding:"5px 14px", fontSize:11, color:PURPLE, cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.background=`${PURPLE}12`}
            onMouseLeave={e=>e.currentTarget.style.background="none"}
          >{open?"Collapse ↑":"See anatomy ↓"}</button>
        </div>
        {/* Always-visible forearm SVG */}
        <div style={{ padding:"16px 20px 16px 0", display:"flex", alignItems:"center", borderLeft:`1px solid ${PURPLE}15` }}>
          <ForearmSVG size={120}/>
        </div>
      </div>

      {open && (
        <div style={{ borderTop:`1px solid ${PURPLE}18`, padding:"28px 24px", background:`${PURPLE}04` }}>
          <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:32, alignItems:"start" }}>
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:`${PURPLE}80`, marginBottom:8 }}>Forearm cross-section</div>
              <ForearmSVG size={180}/>
              <div style={{ marginTop:10, display:"grid", gap:4 }}>
                {[["●","FDS / FDP","Finger flexors — share a muscle belly", PURPLE],["●","ECU / ECRL","Wrist extensors — side-by-side", BLUE],["○","Ulna + Radius","Bone — no electrical signal", "rgba(255,255,255,0.4)"],["⬤","Electrode","5 of 16 shown here", "rgba(255,255,255,0.7)"]].map(([s,n,d,c])=>(
                  <div key={n} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:10, color:c }}>{s}</span>
                    <span style={{ fontSize:10, fontWeight:600, color:"var(--text)" }}>{n}</span>
                    <span style={{ fontSize:9.5, color:"var(--text-tertiary)" }}>— {d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--text)", marginBottom:8 }}>The cross-talk problem</div>
              <p style={{ fontSize:11.5, color:"var(--text-secondary)", lineHeight:1.75, fontWeight:300, marginBottom:14 }}>
                The flexor digitorum superficialis (FDS) has four separate tendon slips — one for each finger. But the muscle belly is shared. Bending your middle finger also partially activates the fibres next to your index and ring finger tendons.
              </p>
              <p style={{ fontSize:11.5, color:"var(--text-secondary)", lineHeight:1.75, fontWeight:300, marginBottom:14 }}>
                This is cross-talk — the dashed lines in the diagram. A 2cm surface electrode picks up the summed electrical field of every motor unit within detection range, often spanning 2–3 muscles.
              </p>
              <div style={{ padding:"12px 14px", background:`${PURPLE}08`, border:`1px solid ${PURPLE}20`, borderLeft:`3px solid ${PURPLE}`, borderRadius:"0 8px 8px 0" }}>
                <div style={{ fontSize:14, fontWeight:700, color:PURPLE, marginBottom:2 }}>16 channels</div>
                <div style={{ fontSize:11, color:"var(--text-tertiary)", lineHeight:1.5 }}>Ninapro DB5 uses 16 electrodes distributed around the forearm. More channels = more spatial diversity, letting a 64-feature vector (4 features × 16 channels) separate gestures that would otherwise look identical in the signal.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Card 4: Frequency / Signal-to-Noise ──────────────────────────────────────
function FreqSpectrumSVG({ filtered = false, vis = true, compact = false }) {
  const W = compact ? 220 : 320
  const H = compact ? 80  : 130
  const PL = 8, PR = 8, PT = 8, PB = compact ? 14 : 22
  const CW = W-PL-PR, CH = H-PT-PB

  const freq = Array.from({ length: 200 }, (_,i) => i)
  function rawPow(f) {
    const muscle    = 0.85 * Math.exp(-Math.pow(f-80,2) / (2*45*45))
    const motion    = f < 22 ? 0.55 * Math.exp(-f/5) : 0
    const powerline = 0.42 * Math.exp(-Math.pow(f-50,2) / (2*1.8*1.8))
    const noise     = 0.07
    return Math.min(1, muscle + motion + powerline + noise)
  }
  function filtPow(f) {
    if (f < 20 || f > 90) return 0.02
    if (f >= 48 && f <= 52) return 0.015
    return rawPow(f) * 0.88
  }
  const pow = filtered ? filtPow : rawPow
  const pts = freq.map(f => ({ f, p: pow(f) }))
  const tx = f => PL + (f/199)*CW
  const ty = p => PT + (1-p)*CH
  const pathD = pts.map((p,i)=>`${i===0?"M":"L"}${tx(p.f)},${ty(p.p)}`).join(" ")
  const areaD = `${pathD} L${tx(199)},${ty(0)} L${tx(0)},${ty(0)} Z`

  const color = filtered ? GREEN : CYAN

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
      <defs>
        <linearGradient id={`fg${filtered?1:0}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
        <clipPath id={`fc${filtered?1:0}`}><rect x={PL} y={PT} width={CW} height={CH}/></clipPath>
      </defs>

      {!filtered && !compact && (
        <>
          {/* Motion artifact zone */}
          <rect x={PL} y={PT} width={tx(20)-PL} height={CH} fill="rgba(239,68,68,0.08)" clipPath={`url(#fc0)`}/>
          {/* Useful band */}
          <rect x={tx(20)} y={PT} width={tx(90)-tx(20)} height={CH} fill={`${GREEN}08`} clipPath={`url(#fc0)`}/>
          {/* Noise zone */}
          <rect x={tx(90)} y={PT} width={tx(199)-tx(90)} height={CH} fill="rgba(100,100,100,0.05)" clipPath={`url(#fc0)`}/>
        </>
      )}
      {filtered && !compact && (
        <rect x={tx(20)} y={PT} width={tx(90)-tx(20)} height={CH} fill={`${GREEN}10`} clipPath={`url(#fc1)`}/>
      )}

      <path d={areaD} fill={`url(#fg${filtered?1:0})`} clipPath={`url(#fc${filtered?1:0})`}
        opacity={vis?1:0} style={{ transition:"opacity 0.6s 0.4s" }}/>
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} clipPath={`url(#fc${filtered?1:0})`}
        strokeDasharray={600} strokeDashoffset={vis?0:600}
        style={{ transition:"stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1) 0.2s" }}/>

      {!compact && (
        <>
          {[0,50,100,150,200].map(f=>(
            <text key={f} x={tx(f)} y={H-2} textAnchor="middle" fill={`${color}45`} fontSize={7}>{f}Hz</text>
          ))}
          {!filtered && (
            <>
              <text x={tx(10)}  y={PT+10} textAnchor="middle" fill="rgba(239,68,68,0.7)" fontSize={7}>motion</text>
              <text x={tx(55)}  y={PT+10} textAnchor="middle" fill={`${GREEN}80`} fontSize={7}>useful</text>
              <text x={tx(145)} y={PT+10} textAnchor="middle" fill="rgba(150,150,150,0.6)" fontSize={7}>noise</text>
              <text x={tx(50)}  y={ty(0.42)-6} textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize={7.5} fontWeight={600}>50Hz spike</text>
            </>
          )}
          {filtered && (
            <text x={tx(55)} y={PT+10} textAnchor="middle" fill={`${GREEN}80`} fontSize={7}>20–90Hz band preserved</text>
          )}
        </>
      )}
    </svg>
  )
}

function FrequencyCard() {
  const [open, setOpen] = useState(false)
  const [cardRef, cardVis] = useInView(0.1)

  return (
    <div ref={cardRef} style={{ border:`1px solid ${GREEN}25`, borderRadius:16, overflow:"hidden", marginBottom:20, background:"var(--bg)" }}>
      {/* Full-width spectrum strip - always visible */}
      <div style={{ background:"#001208", padding:"20px 22px 14px", borderBottom:`1px solid ${GREEN}18` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, marginBottom:14 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:9.5, fontWeight:700, color:GREEN, background:`${GREEN}20`, border:`1px solid ${GREEN}35`, borderRadius:100, padding:"2px 9px" }}>EMG Fact · Mar 2025</span>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff", letterSpacing:"-0.3px" }}>Raw forearm EMG spectrum — before filtering</div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:32, fontWeight:800, color:GREEN, letterSpacing:"-1.5px", lineHeight:1 }}>20–90</div>
            <div style={{ fontSize:9, color:`${GREEN}60`, textTransform:"uppercase", letterSpacing:"0.08em" }}>Hz useful band</div>
          </div>
        </div>
        <FreqSpectrumSVG filtered={false} vis={cardVis}/>
        <div style={{ display:"flex", gap:16, marginTop:6, flexWrap:"wrap" }}>
          {[["red","Motion artefacts 0–20Hz"],["rgba(16,185,129,0.8)","Useful band 20–90Hz"],["rgba(150,150,150,0.55)","Thermal noise 90Hz+"]].map(([c,l])=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:8, height:2, background:c, borderRadius:1 }}/>
              <span style={{ fontSize:8.5, color:"rgba(255,255,255,0.45)" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"14px 22px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <p style={{ fontSize:12, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.65, margin:0, maxWidth:500 }}>
          The gesture information lives between 20–90Hz. The 50Hz powerline spike sits right in the middle and needs a notch filter. Everything else is motion artefact or thermal noise.
        </p>
        <button onClick={()=>setOpen(o=>!o)} style={{ flexShrink:0, background:"none", border:`1px solid ${GREEN}30`, borderRadius:100, padding:"5px 14px", fontSize:11, color:GREEN, cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.15s", marginLeft:16 }}
          onMouseEnter={e=>e.currentTarget.style.background=`${GREEN}12`}
          onMouseLeave={e=>e.currentTarget.style.background="none"}
        >{open?"Collapse ↑":"See after filter ↓"}</button>
      </div>

      {open && (
        <div style={{ borderTop:`1px solid ${GREEN}18`, background:"#001208", padding:"22px 22px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:20 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:"rgba(239,68,68,0.8)", marginBottom:8 }}>Before: raw signal</div>
              <FreqSpectrumSVG filtered={false} vis={cardVis}/>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:GREEN, marginBottom:8 }}>After: 4th-order Butterworth 20–90Hz</div>
              <FreqSpectrumSVG filtered={true} vis={cardVis}/>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div style={{ padding:"12px 14px", background:`${GREEN}08`, border:`1px solid ${GREEN}20`, borderLeft:`3px solid ${GREEN}`, borderRadius:"0 8px 8px 0" }}>
              <div style={{ fontSize:13, fontWeight:700, color:GREEN, marginBottom:3 }}>4th-order Butterworth</div>
              <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>Maximally flat passband — doesn't distort the signal within 20–90Hz, only attenuates outside. –40 dB/decade rolloff. 50Hz notch removes powerline.</div>
            </div>
            <div style={{ padding:"12px 14px", background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", borderLeft:"3px solid rgba(239,68,68,0.7)", borderRadius:"0 8px 8px 0" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"rgba(239,68,68,0.9)", marginBottom:3 }}>What gets removed</div>
              <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>DC offset from skin-electrode interface. Electrode movement artefacts below 20Hz. Amplifier thermal noise above 90Hz. The 50Hz powerline interference spike.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Card 5: History Timeline ──────────────────────────────────────────────────
const MILESTONES = [
  { year:"1791", icon:"⚡", color:AMBER, title:"Galvani", detail:"Luigi Galvani discovers 'animal electricity' — a frog's leg twitches when touched with two metals. Foundational insight of electrophysiology." },
  { year:"1849", icon:"🔬", color:"#E8A030", title:"Du Bois-Reymond", detail:"Emil du Bois-Reymond makes the first intentional EMG recording — detecting action potentials from human muscle contraction." },
  { year:"1940s", icon:"📡", color:"#D4922A", title:"Surface EMG", detail:"First practical surface EMG recordings. Early systems required large electrodes; almost exclusively clinical diagnostic tools." },
  { year:"1960s", icon:"🦾", color:"#C07820", title:"Myoelectric arm", detail:"First commercial myoelectric prosthetic arm — single-DOF hook controlled by bicep contraction. Core principle identical to myojam." },
  { year:"2012",  icon:"💾", color:"#F59E0B", title:"Ninapro DB5", detail:"Ninapro DB5 released: 10 subjects, 16 channels, 53 gesture classes. The first large-scale public EMG benchmark." },
  { year:"2025",  icon:"🚀", color:AMBER,    title:"myojam", detail:"84.85% cross-subject accuracy on Ninapro DB5. Open education platform, 11 articles, 3 lesson plans, desktop app." },
]

function HistoryCard() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(5)
  const [cardRef, cardVis] = useInView(0.1)

  return (
    <div ref={cardRef} style={{ border:`1px solid ${AMBER}25`, borderRadius:16, overflow:"hidden", marginBottom:20, background:"var(--bg)" }}>
      {/* Horizontal timeline - always visible */}
      <div style={{ background:`linear-gradient(135deg,#14100200,#0A0800)`, padding:"24px 24px 18px", borderBottom:`1px solid ${AMBER}18` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, marginBottom:18 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ fontSize:9.5, fontWeight:700, color:AMBER, background:`${AMBER}18`, border:`1px solid ${AMBER}35`, borderRadius:100, padding:"2px 9px" }}>EMG Fact · Mar 2025</span>
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", letterSpacing:"-0.3px", lineHeight:1.3 }}>EMG science is older than you think</div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:38, fontWeight:800, color:AMBER, letterSpacing:"-2px", lineHeight:1 }}>1791</div>
            <div style={{ fontSize:9, color:`${AMBER}60`, textTransform:"uppercase", letterSpacing:"0.08em" }}>Galvani's discovery</div>
          </div>
        </div>

        {/* Horizontal timeline */}
        <div style={{ position:"relative", paddingBottom:36 }}>
          {/* Line */}
          <div style={{ position:"absolute", top:14, left:0, right:0, height:2, background:`linear-gradient(90deg,${AMBER}15,${AMBER}60,${AMBER}15)`, borderRadius:99 }}/>
          {/* Progress fill */}
          <div style={{ position:"absolute", top:14, left:0, height:2, background:AMBER, borderRadius:99,
            width: cardVis ? "100%" : "0%", transition:"width 1.8s cubic-bezier(0.22,1,0.36,1) 0.3s" }}/>
          {/* Nodes */}
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            {MILESTONES.map((m,i) => (
              <div key={m.year} onClick={() => setActive(i)} style={{ display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", flex:1 }}>
                <div style={{
                  width:28, height:28, borderRadius:"50%",
                  background: active===i ? m.color : `${m.color}20`,
                  border:`2px solid ${active===i ? m.color : m.color+"40"}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, transition:"all 0.25s",
                  boxShadow: active===i ? `0 0 12px ${m.color}70` : "none",
                  opacity: cardVis ? 1 : 0,
                  transform: cardVis ? "scale(1)" : "scale(0.4)",
                  transitionDelay: `${0.3 + i * 0.15}s`,
                }}>
                  {m.icon}
                </div>
                <div style={{ fontSize:8.5, fontWeight:700, color: active===i ? m.color : `${m.color}60`, marginTop:6, textAlign:"center", lineHeight:1.3 }}>{m.year}</div>
              </div>
            ))}
          </div>
          {/* Active detail */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0 }}>
            <div style={{ fontSize:10, color:"var(--text-tertiary)", textAlign:"center", fontStyle:"italic", lineHeight:1.5 }}>
              <strong style={{ color:AMBER, fontStyle:"normal" }}>{MILESTONES[active].title}</strong> — {MILESTONES[active].detail.slice(0,90)}…
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"14px 22px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <p style={{ fontSize:12, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.65, margin:0, maxWidth:500 }}>
          234 years from Galvani's frog to myojam's classifier. Click any node above to explore each milestone.
        </p>
        <button onClick={()=>setOpen(o=>!o)} style={{ flexShrink:0, background:"none", border:`1px solid ${AMBER}30`, borderRadius:100, padding:"5px 14px", fontSize:11, color:AMBER, cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.15s", marginLeft:16 }}
          onMouseEnter={e=>e.currentTarget.style.background=`${AMBER}12`}
          onMouseLeave={e=>e.currentTarget.style.background="none"}
        >{open?"Collapse ↑":"Full history ↓"}</button>
      </div>

      {open && (
        <div style={{ borderTop:`1px solid ${AMBER}18`, padding:"24px 22px", background:`${AMBER}04` }}>
          <div style={{ display:"grid", gap:12 }}>
            {MILESTONES.map((m,i) => (
              <div key={m.year} style={{ display:"grid", gridTemplateColumns:"64px 1fr", gap:16, alignItems:"start" }}>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:700, color:m.color, letterSpacing:"-0.5px" }}>{m.year}</div>
                  <div style={{ fontSize:9, color:`${m.color}60`, textTransform:"uppercase", letterSpacing:"0.06em" }}>{m.title}</div>
                </div>
                <div style={{ paddingLeft:16, borderLeft:`2px solid ${m.color}30`, paddingTop:2, paddingBottom:i<MILESTONES.length-1?12:0 }}>
                  <div style={{ fontSize:11.5, color:"var(--text-secondary)", lineHeight:1.7, fontWeight:300 }}>{m.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Journal ───────────────────────────────────────────────────────────────────
const TAG_MAP = { "Launch":PINK, "Content":PURPLE, "Milestone":GREEN, "Open source":BLUE, "Research":AMBER }

const JOURNAL = [
  { id:"n9", tag:"Launch",      date:"Apr 27, 2025", title:"The desktop app is back — completely rebuilt",    body:"Rebuilt from scratch: dark theme, live waveform, 3D hand model, session tracking. Animated confidence bars, rotating 3D hand that reflects your gesture in real time.",             meta:"v1.0 · macOS 12+ · ~295 MB · MIT",     link:"/download"  },
  { id:"n8", tag:"Content",     date:"Apr 22, 2025", title:"Lesson 3: applications and bioethics",           body:"EMG in the Real World — grades 7–11. Students use the confusion matrix explorer to calculate what 84.85% accuracy means in prosthetics vs keyboard shortcuts. Usually surprising.", meta:"60 min · Grades 7–11 · No hardware",    link:"/educators" },
  { id:"n7", tag:"Milestone",   date:"Apr 10, 2025", title:"11 articles and counting",                      body:"Crossed 11 published articles: neuromuscular junction, windowing, bioethics, phantom limb, and more. Started as build notes, turned into something genuinely useful.",             meta:"11 articles · 9 topics · 450+ reads",   link:"/education" },
  { id:"n6", tag:"Launch",      date:"Mar 18, 2025", title:"The educators hub is live",                     body:"Three full lesson plans. Curriculum standards. Differentiation. Assessment rubrics. Built-in quizzes. Designed for a teacher with 75 minutes and a class new to EMG.",              meta:"3 plans · Grades 7–uni · Free",         link:"/educators" },
  { id:"n5", tag:"Milestone",   date:"Mar 4, 2025",  title:"1,000 unique visitors",                         body:"Most traffic from the education hub — people finding articles via search. A handful of teachers reached out about classroom use. That's the whole point.",                          meta:"Search-driven · Education hub",         link:null         },
  { id:"n4", tag:"Launch",      date:"Feb 20, 2025", title:"Four tools. No hardware.",                      body:"Signal playground, confusion matrix explorer, frequency analyzer, gesture game — all running in browser on real Ninapro data. No sensor required.",                                meta:"4 tools · Browser-only · Real data",    link:"/demos"     },
  { id:"n3", tag:"Launch",      date:"Feb 5, 2025",  title:"myojam.com is live",                            body:"FastAPI on Render. React/Vite on Vercel. Classifier accessible in browser for the first time — no MyoWare sensor required.",                                                     meta:"FastAPI · Render · Vite · Vercel",      link:null         },
  { id:"n2", tag:"Open source", date:"Jan 14, 2025", title:"Everything is open source",                     body:"Signal pipeline, ML model, React frontend, FastAPI backend — all on GitHub. MIT license. No private forks, no login, no waitlist.",                                               meta:"MIT · GitHub · Full source",            link:null         },
  { id:"n1", tag:"Research",    date:"Dec 18, 2024", title:"84.85% — and we mean it",                      body:"Cross-subject accuracy — tested on people never seen during training. Real generalisation. 1 in 7 predictions still wrong. That's the honest baseline.",                          meta:"16,269 windows · 10 subjects · LOSO",   link:"/research/paper" },
]

function JournalEntry({ entry, navigate, isLast }) {
  const [open, setOpen] = useState(false)
  const color = TAG_MAP[entry.tag] || PINK

  return (
    <div style={{ display:"grid", gridTemplateColumns:"16px 1fr", gap:"0 16px" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ width:10, height:10, borderRadius:"50%", background:color, boxShadow:`0 0 7px ${color}60`, flexShrink:0, marginTop:16 }}/>
        {!isLast && <div style={{ width:1, flex:1, background:"var(--border)", minHeight:20, marginTop:5 }}/>}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : 20 }}>
        <div onClick={()=>setOpen(o=>!o)} style={{ cursor:"pointer", padding:"12px 16px", borderRadius:9, background:open?`${color}06`:"transparent", border:`1px solid ${open?color+"22":"transparent"}`, transition:"all 0.2s" }}
          onMouseEnter={e=>{ if(!open) e.currentTarget.style.background="var(--bg-secondary)" }}
          onMouseLeave={e=>{ if(!open) e.currentTarget.style.background="transparent" }}
        >
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5, flexWrap:"wrap" }}>
            <span style={{ fontSize:9, fontWeight:700, color, background:`${color}15`, border:`1px solid ${color}30`, borderRadius:100, padding:"2px 8px", textTransform:"uppercase", letterSpacing:"0.06em" }}>{entry.tag}</span>
            <span style={{ fontSize:10.5, color:"var(--text-tertiary)", fontWeight:300 }}>{entry.date}</span>
          </div>
          <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", lineHeight:1.3, marginBottom: open ? 10 : 0 }}>{entry.title}</div>
          {open && (
            <div>
              <p style={{ fontSize:12, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, margin:"0 0 10px" }}>{entry.body}</p>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                <span style={{ fontSize:10.5, color:"var(--text-tertiary)", fontWeight:300 }}>{entry.meta}</span>
                {entry.link && (
                  <button onClick={e=>{ e.stopPropagation(); navigate(entry.link) }} style={{ background:"none", border:`1px solid ${color}40`, color, borderRadius:100, padding:"3px 11px", fontSize:10.5, fontWeight:500, cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=`${color}12`}
                    onMouseLeave={e=>e.currentTarget.style.background="none"}
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

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Blog() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <style>{`@keyframes heroPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      <Navbar/>

      {/* Hero */}
      <div style={{ position:"relative", overflow:"hidden", minHeight:380, display:"flex", alignItems:"center", borderBottom:"1px solid var(--border)" }}>
        <LiquidChrome baseColor={[0.07, 0.0, 0.18]} speed={0.10} amplitude={0.22} style={{ position:"absolute", inset:0, zIndex:0 }}/>
        <div style={{ position:"absolute", inset:0, zIndex:1, opacity:0.5 }}><EMGPulse/></div>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(3,0,18,0.72),rgba(3,0,18,0.60) 60%,rgba(3,0,18,0.88))", zIndex:2 }}/>
        <div style={{ position:"relative", zIndex:3, width:"100%", maxWidth:960, margin:"0 auto", padding:"100px 32px 64px" }}>
          <Reveal>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,45,120,0.12)", border:"1px solid rgba(255,45,120,0.3)", borderRadius:100, padding:"4px 14px", marginBottom:20 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:PINK, display:"inline-block", animation:"heroPulse 2s infinite" }}/>
              <span style={{ fontSize:11, fontWeight:600, color:PINK, letterSpacing:"0.06em", textTransform:"uppercase" }}>EMG Facts & Project Journal</span>
            </div>
            <h1 style={{ fontSize:"clamp(32px,6vw,58px)", fontWeight:700, letterSpacing:"-2px", lineHeight:1.05, color:"#fff", marginBottom:18 }}>
              What's happening<br/><span style={{ color:PINK }}>at myojam.</span>
            </h1>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.65)", fontWeight:300, lineHeight:1.75, maxWidth:460, marginBottom:32 }}>
              Five deep dives into EMG science — each with its own data visualization — and a running log of every launch and milestone since September 2024.
            </p>
            <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
              {[["5","EMG fact series"],["9","project updates"],["Sep 2024","project start"]].map(([v,l])=>(
                <div key={l}>
                  <div style={{ fontSize:20, fontWeight:700, color:"#fff", letterSpacing:"-0.5px" }}>{v}</div>
                  <div style={{ fontSize:9.5, color:"rgba(255,255,255,0.4)", fontWeight:300, textTransform:"uppercase", letterSpacing:"0.08em", marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ maxWidth:1140, margin:"0 auto", padding:"52px 32px 80px", display:"grid", gridTemplateColumns:"1fr 360px", gap:48, alignItems:"start" }}>

        {/* Left: EMG Fact cards */}
        <div>
          <Reveal>
            <SectionPill>EMG Facts</SectionPill>
            <h2 style={{ fontSize:"clamp(18px,2.5vw,26px)", fontWeight:700, letterSpacing:"-0.7px", color:"var(--text)", marginBottom:6 }}>Five hard truths about surface EMG.</h2>
            <p style={{ fontSize:13, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, marginBottom:28, maxWidth:500 }}>
              Each card has a unique visualization. Every number is from the actual Ninapro DB5 dataset or published EMG literature.
            </p>
          </Reveal>
          <LatencyCard/>
          <CrossSubjectCard/>
          <ForearmCard/>
          <FrequencyCard/>
          <HistoryCard/>
          <Reveal delay={0.1}>
            <div style={{ marginTop:4, padding:"16px 20px", background:"var(--bg-secondary)", borderRadius:12, border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
              <p style={{ fontSize:12.5, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.6, margin:0, maxWidth:360 }}>
                Want to go deeper? 11 full-length articles cover EMG neuroscience, signal processing, and ML.
              </p>
              <button onClick={()=>navigate("/education")} style={{ flexShrink:0, background:"var(--accent)", color:"#fff", border:"none", borderRadius:100, padding:"9px 20px", fontSize:12.5, fontWeight:500, cursor:"pointer", fontFamily:"var(--font)", boxShadow:`0 4px 14px ${PINK}28`, transition:"transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow=`0 8px 20px ${PINK}40` }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow=`0 4px 14px ${PINK}28` }}
              >Education hub →</button>
            </div>
          </Reveal>
        </div>

        {/* Right: Project Journal */}
        <div style={{ position:"sticky", top:24 }}>
          <Reveal>
            <SectionPill>Project journal</SectionPill>
            <h2 style={{ fontSize:"clamp(16px,2vw,21px)", fontWeight:700, letterSpacing:"-0.6px", color:"var(--text)", marginBottom:5 }}>Every step. Documented.</h2>
            <p style={{ fontSize:11.5, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, marginBottom:20 }}>
              From first classifier to v1.0 desktop app — every launch, milestone, and honest mistake.
            </p>
          </Reveal>
          <div style={{ background:"var(--bg-secondary)", border:"1px solid var(--border)", borderRadius:12, padding:"18px 16px", maxHeight:"72vh", overflowY:"auto" }}>
            {JOURNAL.map((entry,i) => (
              <Reveal key={entry.id} delay={i * 0.03}>
                <JournalEntry entry={entry} navigate={navigate} isLast={i===JOURNAL.length-1}/>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <button onClick={()=>navigate("/changelog")} style={{ marginTop:10, width:"100%", background:"none", border:"1px solid var(--border)", borderRadius:10, padding:"11px", fontSize:12, color:"var(--text-secondary)", fontFamily:"var(--font)", cursor:"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.color="var(--accent)" }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text-secondary)" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M3.5 4h5M3.5 6h5M3.5 8h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              Full technical changelog →
            </button>
          </Reveal>
        </div>
      </div>

      <Footer/>
    </div>
  )
}
