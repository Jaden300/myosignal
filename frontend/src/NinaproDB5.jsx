import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import Footer from "./Footer"
import UpNext from "./UpNext"
import ArticleBar from "./ArticleUtils"
import NeuralNoise from "./components/NeuralNoise"

function FaceAvatar({ seed, size = 48 }) {
  const skinTones = ["#f5dce4", "#e8c9a0", "#c8956c", "#8d5524", "#f5dce4"]
  const hairColors = ["#1a1a1a", "#4a2c0a", "#8B4513", "#FF2D78", "#2c2c2c"]
  const skin = skinTones[seed % skinTones.length]
  const hair = hairColors[(seed * 3) % hairColors.length]
  const eyeOffset = (seed % 3) - 1
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="38" fill="#FFF0F5" stroke="#FFD6E7" strokeWidth="1.5"/>
      <rect x="33" y="54" width="14" height="12" rx="4" fill={skin}/>
      <ellipse cx="40" cy="38" rx="20" ry="22" fill={skin}/>
      {seed % 3 === 0 && (<><ellipse cx="40" cy="20" rx="20" ry="10" fill={hair}/><rect x="20" y="18" width="40" height="10" fill={hair}/></>)}
      {seed % 3 === 1 && (<><ellipse cx="40" cy="20" rx="20" ry="10" fill={hair}/><rect x="20" y="18" width="6" height="22" rx="3" fill={hair}/><rect x="54" y="18" width="6" height="22" rx="3" fill={hair}/><rect x="20" y="18" width="40" height="8" fill={hair}/></>)}
      {seed % 3 === 2 && ([...Array(8)].map((_, i) => <circle key={i} cx={22 + i * 5.5} cy={18 + Math.sin(i) * 3} r="7" fill={hair}/>))}
      <ellipse cx={33 + eyeOffset} cy="37" rx="3.5" ry="4" fill="white"/>
      <ellipse cx={47 + eyeOffset} cy="37" rx="3.5" ry="4" fill="white"/>
      <circle cx={33 + eyeOffset} cy="37.5" r="2.2" fill="#1D1D1F"/>
      <circle cx={47 + eyeOffset} cy="37.5" r="2.2" fill="#1D1D1F"/>
      <circle cx={34 + eyeOffset} cy="36.5" r="0.7" fill="white"/>
      <circle cx={48 + eyeOffset} cy="36.5" r="0.7" fill="white"/>
      <path d={`M ${29+eyeOffset} 31 Q ${33+eyeOffset} 29 ${37+eyeOffset} 31`} stroke="#1D1D1F" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d={`M ${43+eyeOffset} 31 Q ${47+eyeOffset} 29 ${51+eyeOffset} 31`} stroke="#1D1D1F" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 40 39 Q 38 44 36 45 Q 40 46.5 44 45 Q 42 44 40 39" fill="none" stroke={skin === "#f5dce4" ? "#e8b8c8" : "#a06040"} strokeWidth="1.2" strokeLinecap="round"/>
      <path d={seed % 2 === 0 ? "M 34 50 Q 40 55 46 50" : "M 33 50 Q 40 56 47 50"} stroke="#1D1D1F" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

const ABSTRACT = "The Ninapro database is one of the most widely cited public benchmarks in EMG gesture recognition research. This article examines what DB5 contains, how its recording protocol was designed, the specific subset myojam uses, and the methodological choices involved in extracting a clean 6-class classification problem from a dataset originally spanning 52 hand movements."

const SECTIONS = [
  {
    num: "01", tag: "Overview", title: "What is the Ninapro database?",
    body: "Ninapro (Non-Invasive Adaptive Prosthetics) is a public dataset created by researchers at the University of Applied Sciences and Arts Western Switzerland, designed specifically to support the development of dexterous myoelectric prosthetic hands. The database has grown through multiple iterations: DB1 through DB9 each feature different subject populations, electrode configurations, and movement sets. The overarching goal was to create a standardised benchmark that would allow researchers worldwide to compare algorithms fairly - something the field had sorely lacked before its creation in 2012.",
    callout: null,
  },
  {
    num: "02", tag: "DB5 specifically", title: "What DB5 contains",
    body: "Database 5 (DB5) contains recordings from 10 intact subjects (5 male, 5 female, ages 29.9 ± 3.9 years) performing 52 hand movements across three exercise protocols. Exercise 1 covers 12 basic finger movements. Exercise 2 covers 17 wrist and hand movements. Exercise 3 covers 23 grasping and functional movements. Each movement was performed 6 times, alternating between 5-second contraction windows and 3-second rest periods. EMG was recorded at 200Hz using the Myo armband - a consumer-grade 8-electrode sleeve - providing 16 channels of differential surface EMG from the forearm.",
    callout: "The Myo armband used in DB5 is now discontinued, but its 8 dual-channel electrode configuration at 200Hz remains a useful benchmark for consumer-grade EMG research. myojam's hardware setup (MyoWare 2.0 + Arduino) approximates this at lower cost with single-channel acquisition.",
  },
  {
    num: "03", tag: "myojam's subset", title: "Which movements we use and why",
    body: "From DB5's 52 movements, myojam uses 6: individual flexions of the index, middle, ring, and pinky fingers, thumb flexion, and full fist closure. These were chosen from Exercise 1 for three reasons. First, they map naturally to distinct assistive computer actions - four directional cursor movements, a click, and a spacebar press. Second, they are biomechanically distinct enough for a cross-subject classifier to discriminate reliably. Third, they are representable by the 16 channels available in DB5 without requiring the higher-resolution recordings that finger-level precision typically demands.",
    callout: null,
  },
  {
    num: "04", tag: "Data pipeline", title: "From raw .mat files to training windows",
    body: "DB5 data is distributed as MATLAB .mat files containing raw EMG arrays and label vectors. The restimulus field provides the ground-truth label for each sample - 0 for rest, 1–52 for the corresponding movement. myojam's build pipeline loads the S1_E1_A1.mat file (Subject 1, Exercise 1, Acquisition 1), filters for labels 1–6 (the six target gestures), extracts all contiguous 200-sample windows where the label is non-zero and stable, computes the 64-feature vectors, and passes them to the Random Forest trainer. The same pipeline runs on Render at deploy time to retrain the model in the cloud environment.",
    callout: "Using only Subject 1, Exercise 1 for the live demo (rather than all 10 subjects) keeps the Render build time under 3 minutes while still providing a representative EMG signal for visualisation. The classifier itself is trained on all 10 subjects.",
  },
  {
    num: "05", tag: "Limitations", title: "What DB5 can't tell us",
    body: "DB5 was recorded in controlled laboratory conditions with subjects seated, arm at rest, performing deliberate isolated movements on cue. Real-world EMG use looks very different: arms in motion, gestures blending into each other, fatigue building over a session, and electrode placement varying between uses. DB5 also doesn't include amputee subjects - a significant gap given that assistive technology is the primary intended application. These limitations don't invalidate DB5 as a benchmark, but they mean that performance on DB5 is an optimistic upper bound on what a deployed system would achieve without additional calibration and adaptation.",
    callout: null,
  },
]

export default function NinaproDB5() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)", padding: "100px 32px 56px" }}>
        <NeuralNoise color={[0.10, 0.65, 0.45]} opacity={0.85} speed={0.0006} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,0,18,0.65)", zIndex: 1 }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
            <span onClick={() => navigate("/education")} style={{ fontSize: 13, color: "var(--accent)", cursor: "pointer" }}>Education</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>→</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>Ninapro DB5</span>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,45,120,0.3)",
            borderRadius: 100, padding: "5px 16px",
            fontSize: 13, color: "var(--accent)", fontWeight: 500, marginBottom: 24
          }}>Dataset · 6 min read</div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 600,
            letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.08, marginBottom: 24
          }}>Inside Ninapro DB5:<br /><span style={{ color: "var(--accent)" }}>the dataset that trains myojam.</span></h1>
          <p style={{
            fontSize: 17, color: "var(--text-secondary)", fontWeight: 300,
            lineHeight: 1.75, marginBottom: 36, maxWidth: 580
          }}>
            Where does the training data come from? What is Ninapro, what does DB5 contain,
            and what decisions went into turning 52 hand movements into a 6-class classifier?
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <FaceAvatar seed={1} size={40} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>myojam team</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>Founder & Lead Engineer · February 20, 2026</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px 80px" }}>
        <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius)", border: "1px solid var(--border)", borderLeft: "3px solid var(--accent)", padding: "24px 28px", marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Abstract</div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, fontWeight: 300, margin: 0, fontStyle: "italic" }}>{ABSTRACT}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {SECTIONS.map((s, i) => (
            <div key={s.num} style={{ padding: "48px 0", borderBottom: i < SECTIONS.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "var(--accent)", flexShrink: 0 }}>{s.num}</div>
                <span style={{ fontSize: 11, fontWeight: 500, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.tag}</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.4px", marginBottom: 16 }}>{s.title}</h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, fontWeight: 300, marginBottom: s.callout ? 24 : 0 }}>{s.body}</p>
              {s.callout && (
                <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,45,120,0.3)", borderLeft: "3px solid var(--accent)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", padding: "16px 20px" }}>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, fontWeight: 400, margin: 0 }}>{s.callout}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 56, background: "var(--bg-secondary)", borderRadius: "var(--radius)", padding: "40px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Conclusion</div>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
            Ninapro DB5 is a well-constructed benchmark that has enabled years of reproducible EMG research.
            Its open availability is the reason myojam can exist at all without conducting original data collection.
            Understanding what it contains - and where its limitations lie - is essential to interpreting any
            results built on top of it. The 84.85% cross-subject accuracy myojam reports is meaningful precisely
            because it's measured on held-out subjects using a standardised protocol, not on cherry-picked windows
            from the training set.
          </p>
        </div>

        <ArticleBar
          url="https://myojam.com/education/ninapro-db5"
          title="Inside Ninapro DB5: the dataset that trains myojam"
          citation={{ apa: `Wong, J. (2026, February 20). Inside Ninapro DB5: The dataset that trains myojam. myojam. https://myojam.com/education/ninapro-db5` }}
          presetLikes={24}
          storageKey="like_ninapro"
        />
        <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
          <button onClick={() => navigate("/education")} style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-mid)", borderRadius: 100, padding: "10px 24px", fontSize: 13, fontFamily: "var(--font)", fontWeight: 400, cursor: "pointer" }}>← Back to Education</button>
        </div>
      </div>
      <UpNext current="/education/ninapro-db5" />
      <Footer />
    </div>
  )
}