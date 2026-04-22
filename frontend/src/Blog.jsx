import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, SectionPill } from "./Animate"
import NeuralNoise from "./components/NeuralNoise"

const POSTS = [
  // ── EMG Fact posts ─────────────────────────────────────────────────────────
  {
    id: "f4",
    tag: "EMG Facts",
    tagColor: "#3B82F6",
    title: "Why your classifier fails on new people",
    date: "April 2025",
    cover: {
      bg: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
      accent: "#3B82F6",
      label: "1 in 7",
      sublabel: "predictions wrong",
    },
    slides: [
      {
        bg: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
        accent: "#3B82F6",
        heading: "Why your classifier fails on new people",
        body: "myojam hits 84.85% cross-subject accuracy. That sounds solid - until you realise it means roughly 1 in 7 gesture predictions is wrong. And it gets worse when the model sees someone it's never trained on.",
        stat: null,
      },
      {
        bg: "linear-gradient(135deg, #1a2744 0%, #0d1b35 100%)",
        accent: "#60A5FA",
        heading: "The problem is between-person variability",
        body: "Every person's forearm is slightly different. Different muscle mass, different electrode placement, different tendon geometry. A Random Forest trained on 10 subjects encodes their specific signal patterns - not the universal pattern underneath.",
        stat: null,
      },
      {
        bg: "linear-gradient(135deg, #152238 0%, #0a1525 100%)",
        accent: "#93C5FD",
        heading: "Cross-subject accuracy is the honest test",
        body: "Within-subject accuracy inflates numbers. If you train on Subject 1's data and test on Subject 1's data, you get 95%+. But that's not a product - that's memorisation. Cross-subject is the real question: does it work for someone it's never seen before?",
        stat: "84.85%\ncross-subject\nvs ~96%\nwithin-subject",
      },
      {
        bg: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
        accent: "#3B82F6",
        heading: "The fix isn't more training data",
        body: "More subjects helps, but the real solution is domain adaptation - teaching the model to adjust to a new user's signal distribution in real time. That's the unsolved problem that makes EMG interfaces hard to ship at scale.",
        stat: null,
      },
    ],
  },
  {
    id: "f3",
    tag: "EMG Facts",
    tagColor: "#8B5CF6",
    title: "Your forearm has 20+ muscles for 5 fingers",
    date: "April 2025",
    cover: {
      bg: "linear-gradient(135deg, #2d1b69 0%, #1a0f3d 100%)",
      accent: "#8B5CF6",
      label: "20+",
      sublabel: "muscles in your forearm",
    },
    slides: [
      {
        bg: "linear-gradient(135deg, #2d1b69 0%, #1a0f3d 100%)",
        accent: "#8B5CF6",
        heading: "Your forearm has 20+ muscles controlling 5 fingers",
        body: "Surface EMG electrodes sit on your forearm skin - but underneath are over 20 muscles packed into a space smaller than your hand. Getting a clean signal from any one of them is an engineering problem.",
        stat: null,
      },
      {
        bg: "linear-gradient(135deg, #231555 0%, #130d35 100%)",
        accent: "#A78BFA",
        heading: "Flexor digitorum superficialis: the troublemaker",
        body: "The flexor digitorum superficialis has four separate tendon slips - one for each finger (index through pinky). But the muscle belly is shared. Bending your middle finger also partially activates the fibres next to your index and ring finger tendons. This is cross-talk, and it's why finger gestures blur together in the EMG signal.",
        stat: null,
      },
      {
        bg: "linear-gradient(135deg, #1d1248 0%, #0f0a28 100%)",
        accent: "#C4B5FD",
        heading: "Surface electrodes average over everything",
        body: "A 2cm surface electrode picks up the summed electrical field of every motor unit within detection range - often spanning 2–3 muscles. This is the core reason surface EMG gesture classification is hard. You're trying to decode individual finger movements from a blended signal.",
        stat: "2 cm\nelectrode picks up\n2–3 muscles\nof cross-talk",
      },
      {
        bg: "linear-gradient(135deg, #2d1b69 0%, #1a0f3d 100%)",
        accent: "#8B5CF6",
        heading: "16 channels helps, but doesn't solve it",
        body: "Ninapro DB5 uses 16 electrodes distributed around the forearm. More channels means more spatial diversity in the signal - different electrodes capture different muscle contributions. That's what lets a 64-feature vector (4 features × 16 channels) separate gestures that would otherwise look identical.",
        stat: null,
      },
    ],
  },
  {
    id: "f2",
    tag: "EMG Facts",
    tagColor: "#10B981",
    title: "The signal-to-noise problem in surface EMG",
    date: "March 2025",
    cover: {
      bg: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
      accent: "#10B981",
      label: "20–90 Hz",
      sublabel: "the useful band",
    },
    slides: [
      {
        bg: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
        accent: "#10B981",
        heading: "The signal you want lives in a narrow band",
        body: "A raw forearm EMG signal contains frequencies from 0 Hz to over 500 Hz. But the gesture information you actually need lives between roughly 20 and 90 Hz. Everything else is noise - and there's a lot of it.",
        stat: null,
      },
      {
        bg: "linear-gradient(135deg, #043d2f 0%, #011f19 100%)",
        accent: "#34D399",
        heading: "What's contaminating the signal",
        body: "Below 20 Hz: electrode movement artefacts - every tiny shift of skin under the sensor creates a low-frequency voltage spike. DC offset from the skin-electrode interface. Above 90 Hz: amplifier thermal noise. Power line interference at 50/60 Hz sits right in the middle of your useful band and needs a notch filter to remove.",
        stat: null,
      },
      {
        bg: "linear-gradient(135deg, #033327 0%, #011811 100%)",
        accent: "#6EE7B7",
        heading: "The Butterworth bandpass filter",
        body: "myojam applies a 4th-order Butterworth bandpass filter at 20–90 Hz. Butterworth was chosen because it has a maximally flat passband - it doesn't distort the signal within the band of interest, only attenuates outside it. The result: gesture-relevant information passes through, most noise doesn't.",
        stat: "4th order\nButterworth\n20–90 Hz\n-40 dB/decade rolloff",
      },
      {
        bg: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
        accent: "#10B981",
        heading: "You can see this live",
        body: "The EMG Frequency Analyzer tool loads real Ninapro windows and shows you the frequency spectrum before and after the bandpass filter - across all 16 channels. The 50/60 Hz powerline spike is usually the most dramatic thing to watch disappear.",
        stat: null,
      },
    ],
  },
  {
    id: "f1",
    tag: "EMG Facts",
    tagColor: "#F59E0B",
    title: "EMG science is older than you think",
    date: "March 2025",
    cover: {
      bg: "linear-gradient(135deg, #451a03 0%, #1c0a00 100%)",
      accent: "#F59E0B",
      label: "1791",
      sublabel: "Galvani's discovery",
    },
    slides: [
      {
        bg: "linear-gradient(135deg, #451a03 0%, #1c0a00 100%)",
        accent: "#F59E0B",
        heading: "EMG science started in 1791",
        body: "Luigi Galvani discovered 'animal electricity' by noticing that a frog's leg twitched when touched with two different metals. He didn't understand what he'd found, but he'd demonstrated that biological tissue conducts electricity - the foundational insight of electrophysiology.",
        stat: null,
      },
      {
        bg: "linear-gradient(135deg, #3b1602 0%, #170800 100%)",
        accent: "#FCD34D",
        heading: "Surface EMG took another 150 years",
        body: "The first practical surface EMG recordings weren't made until the 1940s. Early systems required large, inconvenient electrodes and produced signals that were almost impossible to analyse without specialised equipment. For decades, EMG was almost exclusively a clinical diagnostic tool - not a control interface.",
        stat: "1940s\nfirst practical\nsurface EMG\nrecordings",
      },
      {
        bg: "linear-gradient(135deg, #2d1001 0%, #100600 100%)",
        accent: "#FDE68A",
        heading: "Myoelectric prosthetics in the 1960s",
        body: "The first commercial myoelectric prosthetic arm appeared in the 1960s - a single-degree-of-freedom hook controlled by a bicep contraction. It sounds primitive, but the core principle is identical to what myojam does: detect a muscle signal, map it to a computer action.",
        stat: null,
      },
      {
        bg: "linear-gradient(135deg, #451a03 0%, #1c0a00 100%)",
        accent: "#F59E0B",
        heading: "The Ninapro database changed everything",
        body: "Before Ninapro (2012), there was no large-scale public EMG dataset for gesture classification research. Labs were each collecting their own small datasets, making results impossible to compare. Ninapro DB5 - 10 subjects, 16 channels, 53 gesture classes - became the standard benchmark. myojam's classifier is trained and evaluated on it.",
        stat: null,
      },
    ],
  },

  // ── News posts ──────────────────────────────────────────────────────────────
  {
    id: "n8",
    tag: "Content",
    tagColor: "#8B5CF6",
    title: "Lesson 3 is here: applications and bioethics",
    date: "April 22, 2025",
    cover: {
      bg: "linear-gradient(135deg, #2d1b69 0%, #1a0f3d 100%)",
      accent: "#8B5CF6",
      label: "Lesson 3",
      sublabel: "just dropped",
    },
    slides: [
      {
        bg: "linear-gradient(135deg, #2d1b69 0%, #1a0f3d 100%)",
        accent: "#8B5CF6",
        heading: "Lesson 3 is here: applications and bioethics",
        body: "The third lesson plan just dropped. \"EMG in the Real World: Applications & Bioethics\" is designed for grades 7–11 and asks the question every technology class should ask: who benefits from this, and who doesn't?",
        stat: null,
      },
      {
        bg: "linear-gradient(135deg, #231555 0%, #130d35 100%)",
        accent: "#A78BFA",
        heading: "What students do in the lesson",
        body: "Students use the confusion matrix explorer to calculate what 84.85% accuracy means in a prosthetics context versus a keyboard shortcut - and they're usually surprised how different those answers are. Then a structured ethics discussion: access, data privacy, dataset bias, workplace monitoring.",
        stat: "60 min\nGrades 7–11\nNo hardware\nrequired",
      },
    ],
  },
  {
    id: "n7",
    tag: "Milestone",
    tagColor: "#10B981",
    title: "11 articles and counting",
    date: "April 10, 2025",
    cover: {
      bg: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
      accent: "#10B981",
      label: "11",
      sublabel: "published articles",
    },
    slides: [
      {
        bg: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
        accent: "#10B981",
        heading: "11 articles and counting",
        body: "The education hub crossed 11 published articles this month - covering the neuromuscular junction, windowing, the ethics of biometric data, phantom limb research, and more. They started as notes from the build process and turned into something we're genuinely proud of.",
        stat: null,
      },
    ],
  },
  {
    id: "n6",
    tag: "Launch",
    tagColor: "#FF2D78",
    title: "The educators hub is live",
    date: "March 18, 2025",
    cover: {
      bg: "linear-gradient(135deg, #4a0020 0%, #200010 100%)",
      accent: "#FF2D78",
      label: "Live",
      sublabel: "educators hub",
    },
    slides: [
      {
        bg: "linear-gradient(135deg, #4a0020 0%, #200010 100%)",
        accent: "#FF2D78",
        heading: "The educators hub is live",
        body: "Three full lesson plans. Curriculum standards. Differentiation strategies. Assessment rubrics. Built-in quizzes. The educators hub is the part of this project we spent the most time on. Designed for a teacher who has 75 minutes and a class who's never heard of EMG.",
        stat: "3 lesson plans\nGrades 7–university\nFree · Open access",
      },
    ],
  },
  {
    id: "n5",
    tag: "Milestone",
    tagColor: "#10B981",
    title: "1,000 unique visitors",
    date: "March 4, 2025",
    cover: {
      bg: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
      accent: "#10B981",
      label: "1,000",
      sublabel: "unique visitors",
    },
    slides: [
      {
        bg: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
        accent: "#10B981",
        heading: "1,000 unique visitors",
        body: "Crossed 1,000 unique visitors this week. Most traffic is coming through the education hub - people finding the articles via search. A handful of teachers have already reached out about using myojam in class. That's the whole point.",
        stat: null,
      },
    ],
  },
  {
    id: "n4",
    tag: "Launch",
    tagColor: "#FF2D78",
    title: "Four tools. No hardware.",
    date: "February 20, 2025",
    cover: {
      bg: "linear-gradient(135deg, #4a0020 0%, #200010 100%)",
      accent: "#FF2D78",
      label: "4 tools",
      sublabel: "browser only",
    },
    slides: [
      {
        bg: "linear-gradient(135deg, #4a0020 0%, #200010 100%)",
        accent: "#FF2D78",
        heading: "Four tools. No hardware.",
        body: "Everything in the interactive tools section runs in your browser using real Ninapro data. No sensor, no setup. The signal playground, confusion matrix explorer, frequency analyzer, and gesture reaction game - all free, all open source.",
        stat: null,
      },
    ],
  },
  {
    id: "n3",
    tag: "Launch",
    tagColor: "#FF2D78",
    title: "myojam.com is live",
    date: "February 5, 2025",
    cover: {
      bg: "linear-gradient(135deg, #3d0017 0%, #1a0009 100%)",
      accent: "#FF2D78",
      label: "Live",
      sublabel: "myojam.com",
    },
    slides: [
      {
        bg: "linear-gradient(135deg, #3d0017 0%, #1a0009 100%)",
        accent: "#FF2D78",
        heading: "myojam.com is live",
        body: "After months of building locally, myojam.com went live today. FastAPI backend on Render. React/Vite frontend on Vercel. The classifier is accessible in a browser for the first time - no MyoWare sensor required.",
        stat: null,
      },
    ],
  },
  {
    id: "n2",
    tag: "Announcement",
    tagColor: "#3B82F6",
    title: "Everything is open source",
    date: "January 14, 2025",
    cover: {
      bg: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
      accent: "#3B82F6",
      label: "MIT",
      sublabel: "fully open source",
    },
    slides: [
      {
        bg: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
        accent: "#3B82F6",
        heading: "Everything is open source",
        body: "Signal processing pipeline, ML model, React frontend, FastAPI backend - all on GitHub under the MIT license. No private forks, no login required, no waitlist. If you spot something wrong in an article, open a PR.",
        stat: null,
      },
    ],
  },
  {
    id: "n1",
    tag: "Research",
    tagColor: "#F59E0B",
    title: "84.85% - and we mean it",
    date: "December 18, 2024",
    cover: {
      bg: "linear-gradient(135deg, #451a03 0%, #1c0a00 100%)",
      accent: "#F59E0B",
      label: "84.85%",
      sublabel: "cross-subject accuracy",
    },
    slides: [
      {
        bg: "linear-gradient(135deg, #451a03 0%, #1c0a00 100%)",
        accent: "#F59E0B",
        heading: "84.85% - and we mean it",
        body: "The classifier hit 84.85% cross-subject accuracy. Cross-subject means tested on people it had never seen during training - real generalisation, not inflated within-subject numbers. One in seven predictions is still wrong. That's the honest baseline and it's the number on the website.",
        stat: "16,269\ntraining windows\n10 subjects\n6 gesture classes",
      },
    ],
  },
]

const ALL_TAGS = ["All", "EMG Facts", "Launch", "Milestone", "Announcement", "Research", "Content"]

function CoverCard({ post, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      style={{
        cursor:"pointer",
        aspectRatio:"1/1",
        borderRadius:12,
        overflow:"hidden",
        position:"relative",
        background: post.cover.bg,
        transform: hovered ? "scale(1.02)" : "scale(1)",
        transition:"transform 0.2s ease",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.35)" : "0 2px 12px rgba(0,0,0,0.15)",
      }}
    >
      {/* Background glow */}
      <div style={{
        position:"absolute", inset:0,
        background:`radial-gradient(circle at 30% 40%, ${post.cover.accent}30 0%, transparent 65%)`,
        pointerEvents:"none"
      }}/>

      {/* Large decorative label */}
      <div style={{
        position:"absolute", bottom:16, left:16, right:16,
        fontSize:"clamp(32px,5vw,52px)", fontWeight:800,
        color: post.cover.accent,
        letterSpacing:"-2px", lineHeight:1, opacity:0.18,
        pointerEvents:"none",
        userSelect:"none"
      }}>
        {post.cover.label}
      </div>

      {/* Content */}
      <div style={{ position:"relative", zIndex:1, height:"100%", display:"flex", flexDirection:"column", padding:20 }}>
        {/* Tag */}
        <span style={{
          fontSize:10, fontWeight:600, color:post.cover.accent,
          background: post.cover.accent+"22",
          border:`1px solid ${post.cover.accent}40`,
          borderRadius:100, padding:"3px 10px",
          alignSelf:"flex-start",
          letterSpacing:"0.04em"
        }}>{post.tag}</span>

        {/* Spacer */}
        <div style={{ flex:1 }} />

        {/* Stat label */}
        <div>
          <div style={{ fontSize:"clamp(24px,4vw,36px)", fontWeight:800, color:post.cover.accent, letterSpacing:"-1px", lineHeight:1, marginBottom:4 }}>
            {post.cover.label}
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", fontWeight:300, letterSpacing:"0.03em", textTransform:"uppercase", marginBottom:12 }}>
            {post.cover.sublabel}
          </div>
          <div style={{ fontSize:13, fontWeight:500, color:"rgba(255,255,255,0.9)", lineHeight:1.4, letterSpacing:"-0.2px" }}>
            {post.title}
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div style={{
        position:"absolute", inset:0,
        background:"rgba(0,0,0,0.25)",
        opacity: hovered ? 1 : 0,
        transition:"opacity 0.2s",
        display:"flex", alignItems:"center", justifyContent:"center",
        pointerEvents:"none"
      }}>
        <div style={{ fontSize:13, fontWeight:500, color:"#fff", letterSpacing:"0.04em", textTransform:"uppercase" }}>
          View post
        </div>
      </div>

      {/* Slide count indicator */}
      {post.slides.length > 1 && (
        <div style={{ position:"absolute", top:12, right:12, display:"flex", gap:3 }}>
          {post.slides.map((_,i) => (
            <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:"rgba(255,255,255,0.6)" }}/>
          ))}
        </div>
      )}
    </div>
  )
}

function Modal({ post, onClose }) {
  const [slideIdx, setSlideIdx] = useState(0)
  const slide = post.slides[slideIdx]
  const total = post.slides.length

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") setSlideIdx(i => Math.min(i + 1, total - 1))
      if (e.key === "ArrowLeft")  setSlideIdx(i => Math.max(i - 1, 0))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, total])

  return (
    <div
      onClick={onClose}
      style={{
        position:"fixed", inset:0, zIndex:1000,
        background:"rgba(0,0,0,0.85)",
        backdropFilter:"blur(8px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:24
      }}
    >
      {/* Modal card */}
      <div
        onClick={e=>e.stopPropagation()}
        style={{
          width:"100%", maxWidth:500,
          borderRadius:20,
          overflow:"hidden",
          boxShadow:"0 32px 96px rgba(0,0,0,0.6)",
          position:"relative"
        }}
      >
        {/* Slide */}
        <div style={{
          background: slide.bg,
          minHeight:560,
          display:"flex", flexDirection:"column",
          padding:"40px 40px 32px",
          position:"relative",
        }}>
          {/* Glow */}
          <div style={{
            position:"absolute", inset:0,
            background:`radial-gradient(circle at 25% 30%, ${slide.accent}25 0%, transparent 60%)`,
            pointerEvents:"none"
          }}/>

          {/* Tag + date */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32, position:"relative", zIndex:1 }}>
            <span style={{
              fontSize:11, fontWeight:600, color:slide.accent,
              background:slide.accent+"22", border:`1px solid ${slide.accent}40`,
              borderRadius:100, padding:"3px 10px",
            }}>{post.tag}</span>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:300 }}>{post.date}</span>
          </div>

          {/* Content */}
          <div style={{ flex:1, position:"relative", zIndex:1 }}>
            <h2 style={{
              fontSize:"clamp(20px,3vw,26px)", fontWeight:700,
              color:"#fff", lineHeight:1.2, letterSpacing:"-0.5px",
              marginBottom:20
            }}>
              {slide.heading}
            </h2>
            <p style={{
              fontSize:15, color:"rgba(255,255,255,0.75)",
              lineHeight:1.75, fontWeight:300
            }}>
              {slide.body}
            </p>

            {slide.stat && (
              <div style={{
                marginTop:24, padding:"16px 20px",
                background:"rgba(255,255,255,0.07)",
                border:"1px solid rgba(255,255,255,0.1)",
                borderLeft:`3px solid ${slide.accent}`,
                borderRadius:"0 10px 10px 0"
              }}>
                {slide.stat.split("\n").map((line,i) => (
                  <div key={i} style={{
                    fontSize: i%2===0 ? 18 : 12,
                    fontWeight: i%2===0 ? 700 : 300,
                    color: i%2===0 ? slide.accent : "rgba(255,255,255,0.5)",
                    lineHeight:1.4,
                    letterSpacing: i%2===0 ? "-0.5px" : "0.03em",
                    textTransform: i%2===1 ? "uppercase" : "none"
                  }}>{line}</div>
                ))}
              </div>
            )}
          </div>

          {/* Slide dots */}
          {total > 1 && (
            <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:32, position:"relative", zIndex:1 }}>
              {post.slides.map((_,i)=>(
                <button
                  key={i}
                  onClick={()=>setSlideIdx(i)}
                  style={{
                    width: i===slideIdx ? 20 : 7,
                    height:7, borderRadius:100,
                    background: i===slideIdx ? slide.accent : "rgba(255,255,255,0.25)",
                    border:"none", cursor:"pointer", padding:0,
                    transition:"all 0.2s"
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Navigation strip */}
        {total > 1 && (
          <div style={{
            background:"rgba(0,0,0,0.9)",
            borderTop:"1px solid rgba(255,255,255,0.08)",
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"12px 24px"
          }}>
            <button
              onClick={()=>setSlideIdx(i=>Math.max(i-1,0))}
              disabled={slideIdx===0}
              style={{
                background:"none", border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:100, padding:"6px 16px", fontSize:12,
                color: slideIdx===0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
                cursor: slideIdx===0 ? "default" : "pointer",
                fontFamily:"var(--font)", transition:"all 0.15s"
              }}
            >← Prev</button>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)", fontWeight:300 }}>
              {slideIdx+1} / {total}
            </span>
            <button
              onClick={()=>setSlideIdx(i=>Math.min(i+1,total-1))}
              disabled={slideIdx===total-1}
              style={{
                background:"none", border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:100, padding:"6px 16px", fontSize:12,
                color: slideIdx===total-1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
                cursor: slideIdx===total-1 ? "default" : "pointer",
                fontFamily:"var(--font)", transition:"all 0.15s"
              }}
            >Next →</button>
          </div>
        )}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position:"absolute", top:24, right:24,
          background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)",
          borderRadius:"50%", width:36, height:36,
          color:"#fff", fontSize:16, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"background 0.15s"
        }}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.2)"}
        onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}
      >✕</button>
    </div>
  )
}

export default function Blog() {
  const navigate = useNavigate()
  const [activeTag, setActiveTag] = useState("All")
  const [selected, setSelected]   = useState(null)

  const filtered = POSTS.filter(p => activeTag === "All" || p.tag === activeTag)

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ position:"relative", overflow:"hidden", borderBottom:"1px solid var(--border)", padding:"100px 32px 64px" }}>
        <NeuralNoise color={[0.85, 0.10, 0.30]} opacity={0.85} speed={0.0006} />
        <div style={{ position:"absolute", inset:0, background:"rgba(3,0,18,0.65)", zIndex:1 }}/>
        <div style={{ maxWidth:860, margin:"0 auto", position:"relative", zIndex:2 }}>
          <Reveal>
            <SectionPill>Updates</SectionPill>
            <h1 style={{ fontSize:"clamp(36px,6vw,64px)", fontWeight:600, letterSpacing:"-2px", lineHeight:1.04, color:"#fff", marginBottom:20 }}>
              What's happening<br/><span style={{ color:"var(--accent)" }}>at myojam.</span>
            </h1>
            <p style={{ fontSize:17, color:"rgba(255,255,255,0.72)", fontWeight:300, lineHeight:1.75, maxWidth:500 }}>
              Launches, milestones, and EMG facts. Tap any post to read it.
            </p>
          </Reveal>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"48px 32px 80px" }}>

        {/* Tag filter */}
        <div style={{ display:"flex", gap:8, marginBottom:36, flexWrap:"wrap" }}>
          {ALL_TAGS.map(tag => (
            <button key={tag} onClick={()=>setActiveTag(tag)} style={{
              background: activeTag===tag ? "var(--accent)" : "var(--bg-secondary)",
              color: activeTag===tag ? "#fff" : "var(--text-secondary)",
              border:`1px solid ${activeTag===tag ? "var(--accent)" : "var(--border)"}`,
              borderRadius:100, padding:"6px 16px", fontSize:12,
              fontWeight: activeTag===tag ? 500 : 400,
              cursor:"pointer", fontFamily:"var(--font)", transition:"all 0.15s"
            }}>{tag}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {filtered.map(post => (
            <CoverCard key={post.id} post={post} onClick={()=>setSelected(post)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"64px 0", color:"var(--text-tertiary)", fontSize:14, fontWeight:300 }}>
            No posts in this category yet.
          </div>
        )}

        {/* CTA */}
        <Reveal delay={0.2}>
          <div style={{ marginTop:56, background:"linear-gradient(135deg, rgba(255,45,120,0.05) 0%, transparent 100%)", border:"1px solid rgba(255,45,120,0.15)", borderRadius:"var(--radius)", padding:"40px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:24, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:16, fontWeight:600, color:"var(--text)", marginBottom:8 }}>Stay in the loop</div>
              <p style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, margin:0, maxWidth:400 }}>
                Updates also go out on Instagram. The full technical history is in the changelog.
              </p>
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <a href="https://instagram.com/YOUR_HANDLE" target="_blank" rel="noreferrer" style={{ background:"var(--bg-secondary)", color:"var(--text-secondary)", border:"1px solid var(--border)", borderRadius:100, padding:"10px 20px", fontSize:13, fontWeight:400, textDecoration:"none", transition:"all 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text-secondary)"}}
              >Instagram ↗</a>
              <button onClick={()=>navigate("/changelog")} style={{ background:"var(--accent)", color:"#fff", border:"none", borderRadius:100, padding:"10px 20px", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"var(--font)", boxShadow:"0 4px 16px rgba(255,45,120,0.25)", transition:"transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow="0 8px 24px rgba(255,45,120,0.35)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 16px rgba(255,45,120,0.25)"}}
              >Full changelog →</button>
            </div>
          </div>
        </Reveal>
      </div>

      {selected && <Modal post={selected} onClose={()=>setSelected(null)} />}

      <Footer />
    </div>
  )
}
