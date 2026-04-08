import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, StaggerList, HoverCard, SectionPill } from "./Animate"

const DEADLINE = new Date("2026-04-30T23:59:59")

const TRACKS = [
  {
    icon:"⚡", color:"#FF2D78",
    title:"Engineering & Innovation",
    desc:"Build a novel EMG-based application, device, or interface. Could be assistive technology, a game, a research tool, or something entirely new. Judged on technical execution, originality, and real-world impact potential.",
    deliverables:["Working prototype or simulation","Technical documentation","5-minute demo video"],
  },
  {
    icon:"🧬", color:"#8B5CF6",
    title:"Research & Science",
    desc:"Original research on EMG signal processing, gesture classification, neural interfaces, or adjacent biomedical topics. Academic rigour required. Data-driven, reproducible, and clearly communicated.",
    deliverables:["Research paper (2,000–5,000 words)","Dataset or code (if applicable)","Presentation slide deck"],
  },
  {
    icon:"🎨", color:"#3B82F6",
    title:"Design & Accessibility",
    desc:"Design a system, service, or experience that uses EMG technology to improve accessibility for people with motor impairments. Judged on empathy, usability, feasibility, and clarity of vision.",
    deliverables:["Design prototype or mockup","User research summary","Impact statement"],
  },
  {
    icon:"📚", color:"#10B981",
    title:"Education & Outreach",
    desc:"Create an educational resource, curriculum unit, workshop, or public communication project that teaches EMG concepts. For teachers, students, and science communicators.",
    deliverables:["Educational materials","Pilot evidence or target audience analysis","5-minute walkthrough video"],
  },
]

const PRIZES = [
  {
    place:"1st place",
    perTrack:true,
    rewards:["International recognition on myojam.com","Certificate of Excellence signed by myojam team","Featured case study on the myojam education hub","Open-source contribution credit in the myojam repository"],
    color:"#F59E0B",
    icon:"🥇",
  },
  {
    place:"2nd place",
    perTrack:true,
    rewards:["International recognition on myojam.com","Certificate of Achievement","Honourable mention in myojam's annual report"],
    color:"#AEAEB2",
    icon:"🥈",
  },
  {
    place:"3rd place",
    perTrack:true,
    rewards:["Certificate of Merit","Community recognition across myojam channels"],
    color:"#CD7F32",
    icon:"🥉",
  },
  {
    place:"Grand Prix",
    perTrack:false,
    rewards:["Best overall submission across all tracks","Permanent feature on myojam.com homepage","Direct mentorship session with the myojam founding team","myojam Grand Prix trophy (digital, printable certificate)"],
    color:"#FF2D78",
    icon:"🏆",
  },
]

const TIMELINE = [
  { date:"Now", label:"Registrations open", done:true },
  { date:"April 15, 2026", label:"Submission window opens", done:false },
  { date:"April 30, 2026", label:"Submission deadline (11:59 PM EST)", done:false },
  { date:"May 7, 2026", label:"Judging period", done:false },
  { date:"May 15, 2026", label:"Winners announced", done:false },
]

const CRITERIA = [
  { label:"Impact", weight:"30%", desc:"Does this make a meaningful difference — to a user, a field, or a classroom?" },
  { label:"Originality", weight:"25%", desc:"Is this a genuinely new idea, approach, or application? Not just an implementation of the obvious." },
  { label:"Execution", weight:"25%", desc:"Is it well-built, well-written, or well-designed? Does it actually work?" },
  { label:"Communication", weight:"20%", desc:"Is the submission clear, compelling, and accessible to a non-expert judge?" },
]

const FAQS = [
  { q:"Who can enter?", a:"Anyone, anywhere in the world. Students, researchers, educators, hobbyists, professionals. Individual or team entries (up to 4 members) are both welcome." },
  { q:"Is there an entry fee?", a:"No. ELEVATE is completely free to enter. This is a community challenge, not a commercial event." },
  { q:"Do I need EMG hardware?", a:"Not necessarily. Software-only submissions, simulations, design prototypes, and educational materials are all valid. The Engineering track benefits from hardware, but it isn't required." },
  { q:"Can I enter multiple tracks?", a:"Yes, but each submission is evaluated independently. Submit a separate entry for each track you want to compete in." },
  { q:"What format are submissions?", a:"All submissions go through the form below. You'll upload files or provide links to hosted materials (GitHub, Google Drive, YouTube, etc.)." },
  { q:"How are winners selected?", a:"A panel of judges from the myojam team scores all submissions against the four criteria. Judges' decisions are final. All entrants receive written feedback." },
  { q:"When will I hear back?", a:"All entrants will receive confirmation within 48 hours of submission. Winners are announced May 15, 2026 on this page and across myojam's channels." },
]

function Countdown() {
  const [time, setTime] = useState({ days:0, hours:0, mins:0, secs:0 })

  useEffect(() => {
    function tick() {
      const diff = DEADLINE - new Date()
      if (diff <= 0) { setTime({ days:0, hours:0, mins:0, secs:0 }); return }
      setTime({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000)  / 60000),
        secs:  Math.floor((diff % 60000)    / 1000),
      })
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
      {[["days", time.days], ["hours", time.hours], ["mins", time.mins], ["secs", time.secs]].map(([label, val]) => (
        <div key={label} style={{ textAlign:"center", minWidth:72 }}>
          <div style={{ fontSize:48, fontWeight:700, color:"var(--accent)", letterSpacing:"-2px", lineHeight:1, fontVariantNumeric:"tabular-nums" }}>
            {String(val).padStart(2,"0")}
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:300, marginTop:4 }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

export default function Elevate() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", overflow:"hidden" }}>
      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes orbFloat  { from{transform:translateY(0) scale(1)} to{transform:translateY(-36px) scale(1.06)} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes shimmer   { from{background-position:200% center} to{background-position:-200% center} }
        @keyframes faqOpen   { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <Navbar />

      {/* ── HERO */}
      <section style={{ position:"relative", minHeight:640, display:"flex", alignItems:"center", overflow:"hidden", background:"linear-gradient(160deg, #0a0010 0%, #1a0030 40%, #12001a 100%)" }}>
        {/* Orbs */}
        {[
          ["500px","-120px","-80px",0,"rgba(255,45,120,0.35)"],
          ["350px","60%","80px",2,"rgba(139,92,246,0.25)"],
          ["280px","85%","220px",4,"rgba(59,130,246,0.2)"],
          ["200px","20%","300px",6,"rgba(255,45,120,0.15)"],
        ].map(([size,x,y,delay,color],i)=>(
          <div key={i} style={{ position:"absolute",width:size,height:size,borderRadius:"50%",background:color,left:x,top:y,filter:"blur(80px)",pointerEvents:"none",animation:`orbFloat 10s ${delay}s ease-in-out infinite alternate` }}/>
        ))}

        <div style={{ maxWidth:900, margin:"0 auto", padding:"140px 32px 100px", position:"relative", zIndex:1, width:"100%" }}>
          {/* Pre-badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,45,120,0.15)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,45,120,0.3)", borderRadius:100, padding:"6px 18px", fontSize:12, color:"rgba(255,180,200,0.9)", fontWeight:500, marginBottom:36, animation:"fadeUp 0.6s ease" }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:"#FF2D78",display:"inline-block",animation:"pulse 1.5s infinite" }}/>
            Registrations open · Deadline April 30, 2026
          </div>

          {/* Title */}
          <div style={{ animation:"fadeUp 0.6s 0.1s ease both" }}>
            <div style={{ fontSize:"clamp(13px,2vw,15px)", fontWeight:500, color:"rgba(255,255,255,0.5)", letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:16 }}>
              Presented by myojam
            </div>
            <h1 style={{ fontSize:"clamp(56px,10vw,112px)", fontWeight:800, letterSpacing:"-4px", lineHeight:0.95, marginBottom:20, background:"linear-gradient(135deg, #ffffff 0%, #ff9ec4 50%, #c084fc 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              ELEVATE
            </h1>
            <div style={{ fontSize:"clamp(14px,2vw,17px)", color:"rgba(255,255,255,0.55)", fontWeight:300, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:40 }}>
              Emerging Leaders in EMG · Ventures · Assistive Technology · Engineering
            </div>
          </div>

          <p style={{ fontSize:"clamp(16px,2vw,19px)", color:"rgba(255,255,255,0.7)", fontWeight:300, lineHeight:1.75, maxWidth:600, marginBottom:56, animation:"fadeUp 0.6s 0.2s ease both" }}>
            An international competition for students, researchers, and innovators building the future of EMG-based human-computer interaction. Four tracks. Open to the world. Free to enter.
          </p>

          {/* Countdown */}
          <div style={{ marginBottom:56, animation:"fadeUp 0.6s 0.25s ease both" }}>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:300, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:20, textAlign:"center" }}>
              Submission deadline
            </div>
            <Countdown />
          </div>

          {/* CTAs */}
          <div style={{ display:"flex", gap:14, flexWrap:"wrap", animation:"fadeUp 0.6s 0.3s ease both" }}>
            <a href="#register" style={{ background:"linear-gradient(135deg, #FF2D78 0%, #c026d3 100%)", color:"#fff", borderRadius:100, padding:"16px 40px", fontSize:16, fontWeight:600, textDecoration:"none", boxShadow:"0 8px 32px rgba(255,45,120,0.5)", transition:"transform 0.2s, box-shadow 0.2s", letterSpacing:"-0.2px" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.05)";e.currentTarget.style.boxShadow="0 12px 48px rgba(255,45,120,0.65)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 8px 32px rgba(255,45,120,0.5)"}}
            >Register now — it's free</a>
            <a href="#tracks" style={{ background:"rgba(255,255,255,0.08)", backdropFilter:"blur(12px)", color:"rgba(255,255,255,0.85)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:100, padding:"16px 32px", fontSize:16, fontWeight:400, textDecoration:"none", transition:"border-color 0.2s, background 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.14)";e.currentTarget.style.borderColor="rgba(255,255,255,0.3)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"}}
            >View tracks ↓</a>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP */}
      <div style={{ background:"#0d001a", borderBottom:"1px solid rgba(255,45,120,0.15)" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
          {[
            ["4","Competition tracks"],
            ["∞","Open to all countries"],
            ["$0","Entry fee"],
            ["Apr 30","Submission deadline"],
          ].map(([val,label],i)=>(
            <div key={i} style={{ padding:"28px 24px", textAlign:"center", borderRight: i<3?"1px solid rgba(255,255,255,0.06)":"none" }}>
              <div style={{ fontSize:28, fontWeight:700, color:"#FF2D78", letterSpacing:"-1px", marginBottom:4 }}>{val}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:300 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT */}
      <section style={{ padding:"80px 32px", background:"var(--bg)" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>About ELEVATE</SectionPill>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:600, letterSpacing:"-1.5px", color:"var(--text)", marginBottom:20, lineHeight:1.1 }}>
              A global stage for the next generation of neural interface innovators.
            </h2>
            <p style={{ fontSize:16, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.8, maxWidth:660, marginBottom:0 }}>
              ELEVATE is myojam's annual international challenge. We believe the most important advances in EMG and assistive technology won't come from large institutions — they'll come from curious individuals with a laptop, a dataset, and a problem worth solving. ELEVATE exists to find those people, recognise their work, and give it an international platform.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── TRACKS */}
      <section id="tracks" style={{ padding:"0 32px 80px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>Competition tracks</SectionPill>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:600, letterSpacing:"-1.5px", color:"var(--text)", marginBottom:12, lineHeight:1.1 }}>
              Four ways to compete.
            </h2>
            <p style={{ fontSize:16, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, marginBottom:48, maxWidth:560 }}>
              Choose the track that fits your skills. You can enter multiple tracks with separate submissions.
            </p>
          </Reveal>
          <StaggerList items={TRACKS} columns={2} gap={16} renderItem={track=>(
            <HoverCard color={track.color+"25"} style={{ background:"var(--bg-secondary)", borderRadius:"var(--radius)", border:"1px solid var(--border)", overflow:"hidden" }}>
              <div style={{ background:`linear-gradient(135deg, ${track.color}10 0%, transparent 100%)`, borderBottom:"1px solid var(--border)", padding:"28px 28px 24px" }}>
                <div style={{ width:52, height:52, borderRadius:14, background:track.color+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:16 }}>{track.icon}</div>
                <div style={{ fontSize:11, fontWeight:600, color:track.color, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>Track</div>
                <h3 style={{ fontSize:19, fontWeight:600, color:"var(--text)", letterSpacing:"-0.3px", marginBottom:10 }}>{track.title}</h3>
                <p style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, margin:0 }}>{track.desc}</p>
              </div>
              <div style={{ padding:"18px 28px" }}>
                <div style={{ fontSize:11, fontWeight:500, color:"var(--text-tertiary)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Required deliverables</div>
                {track.deliverables.map(d=>(
                  <div key={d} style={{ display:"flex", gap:8, marginBottom:6, fontSize:13, color:"var(--text-secondary)", fontWeight:300 }}>
                    <span style={{ color:track.color, fontWeight:600 }}>✓</span>{d}
                  </div>
                ))}
              </div>
            </HoverCard>
          )}/>
        </div>
      </section>

      {/* ── PRIZES */}
      <section style={{ background:"var(--bg-secondary)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"80px 32px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>Recognition</SectionPill>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:600, letterSpacing:"-1.5px", color:"var(--text)", marginBottom:12 }}>
              What winners receive.
            </h2>
            <p style={{ fontSize:15, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, marginBottom:48, maxWidth:520 }}>
              Prizes are awarded per-track (1st, 2nd, 3rd in each of the four tracks) plus a single Grand Prix for the best overall submission.
            </p>
          </Reveal>
          <StaggerList items={PRIZES} columns={2} gap={16} renderItem={prize=>(
            <HoverCard color={prize.color+"20"} style={{ background:"var(--bg)", borderRadius:"var(--radius)", border:`1px solid ${prize.color}30`, borderTop:`3px solid ${prize.color}`, padding:"28px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <span style={{ fontSize:28 }}>{prize.icon}</span>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:prize.color }}>{prize.place}</div>
                  {prize.perTrack && <div style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300 }}>Awarded in each track</div>}
                </div>
              </div>
              {prize.rewards.map(r=>(
                <div key={r} style={{ display:"flex", gap:8, marginBottom:8, fontSize:13, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.6 }}>
                  <span style={{ color:prize.color, fontWeight:600, flexShrink:0 }}>→</span>{r}
                </div>
              ))}
            </HoverCard>
          )}/>
        </div>
      </section>

      {/* ── JUDGING CRITERIA */}
      <section style={{ padding:"80px 32px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>How submissions are judged</SectionPill>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:600, letterSpacing:"-1.5px", color:"var(--text)", marginBottom:48 }}>
              Four criteria. All submissions evaluated equally.
            </h2>
          </Reveal>
          <StaggerList items={CRITERIA} columns={2} gap={12} renderItem={(c,i)=>(
            <HoverCard style={{ background:"var(--bg-secondary)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"28px", display:"flex", gap:20, alignItems:"flex-start" }}>
              <div style={{ width:56, height:56, borderRadius:14, background:"var(--accent-soft)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:"var(--accent)", flexShrink:0 }}>{c.weight}</div>
              <div>
                <div style={{ fontSize:16, fontWeight:600, color:"var(--text)", marginBottom:6 }}>{c.label}</div>
                <p style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.65, margin:0 }}>{c.desc}</p>
              </div>
            </HoverCard>
          )}/>
        </div>
      </section>

      {/* ── TIMELINE */}
      <section style={{ background:"var(--bg-secondary)", borderTop:"1px solid var(--border)", padding:"80px 32px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>Timeline</SectionPill>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:600, letterSpacing:"-1.5px", color:"var(--text)", marginBottom:48 }}>
              Key dates.
            </h2>
          </Reveal>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:17, top:8, bottom:8, width:2, background:"linear-gradient(to bottom, var(--accent), var(--border))", borderRadius:1 }}/>
            {TIMELINE.map((item,i)=>(
              <div key={i} style={{ paddingLeft:52, paddingBottom:i<TIMELINE.length-1?32:0, position:"relative", opacity:item.done?1:0.75 }}>
                <div style={{ position:"absolute", left:6, top:2, width:24, height:24, borderRadius:"50%", background: item.done ? "var(--accent)" : "var(--bg)", border:`2px solid ${item.done ? "var(--accent)" : "var(--border)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color: item.done ? "#fff" : "var(--text-tertiary)", fontWeight:700 }}>
                  {item.done ? "✓" : i+1}
                </div>
                <div style={{ fontSize:12, color:"var(--accent)", fontWeight:500, marginBottom:4 }}>{item.date}</div>
                <div style={{ fontSize:15, fontWeight: item.done ? 600 : 400, color:"var(--text)" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ */}
      <section style={{ padding:"80px 32px" }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>FAQ</SectionPill>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:600, letterSpacing:"-1.5px", color:"var(--text)", marginBottom:48 }}>
              Common questions.
            </h2>
          </Reveal>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {FAQS.map((faq,i)=>(
              <div key={i} style={{ background:"var(--bg-secondary)", border:"1px solid var(--border)", borderRadius:"var(--radius-sm)", overflow:"hidden", transition:"border-color 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,45,120,0.25)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}
              >
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 22px", background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font)", textAlign:"left" }}>
                  <span style={{ fontSize:15, fontWeight:500, color:"var(--text)" }}>{faq.q}</span>
                  <span style={{ fontSize:18, color:"var(--accent)", fontWeight:300, flexShrink:0, marginLeft:12, transform: openFaq===i?"rotate(45deg)":"rotate(0)", transition:"transform 0.2s" }}>+</span>
                </button>
                {openFaq===i && (
                  <div style={{ padding:"0 22px 18px", animation:"faqOpen 0.2s ease" }}>
                    <p style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.75, margin:0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTRATION */}
      <section id="register" style={{ background:"linear-gradient(160deg, #0a0010 0%, #1a0030 100%)", padding:"80px 32px", position:"relative", overflow:"hidden" }}>
        {[["400px","-80px","-60px","rgba(255,45,120,0.25)"],["300px","70%","40px","rgba(139,92,246,0.2)"]].map(([size,x,y,color],i)=>(
          <div key={i} style={{ position:"absolute",width:size,height:size,borderRadius:"50%",background:color,left:x,top:y,filter:"blur(80px)",pointerEvents:"none" }}/>
        ))}
        <div style={{ maxWidth:700, margin:"0 auto", position:"relative", zIndex:1 }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:40 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,180,200,0.7)", textTransform:"uppercase", letterSpacing:"0.2em", marginBottom:16 }}>Register for ELEVATE 2026</div>
              <h2 style={{ fontSize:"clamp(28px,5vw,48px)", fontWeight:700, letterSpacing:"-1.5px", color:"white", marginBottom:16, lineHeight:1.1 }}>
                Ready to compete?
              </h2>
              <p style={{ fontSize:16, color:"rgba(255,255,255,0.55)", fontWeight:300, lineHeight:1.75, maxWidth:480, margin:"0 auto" }}>
                Registration takes 2 minutes. Submissions open April 15. Deadline April 30. All are welcome.
              </p>
            </div>
          </Reveal>
          <div style={{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(20px)", borderRadius:"var(--radius)", border:"1px solid rgba(255,255,255,0.1)", overflow:"hidden", padding:"0 24px" }}>
            <iframe
              src="https://tally.so/embed/ELEVATE_FORM_ID?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
              width="100%"
              height="520"
              frameBorder="0"
              title="ELEVATE registration"
              style={{ display:"block", filter:"invert(0)" }}
            />
          </div>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.3)", textAlign:"center", marginTop:20, fontWeight:300 }}>
            By registering you agree to myojam's Terms of Service and the ELEVATE competition rules. Your data is used only to administer this competition.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}