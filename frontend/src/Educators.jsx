import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal, StaggerList, HoverCard, SectionPill } from "./Animate"
import NeuralNoise from "./components/NeuralNoise"
import Quiz from "./educators/Quiz"
import ContactForm from "./components/ContactForm"
import { IconBolt, IconBrain, IconPuzzle, IconBook, IconMicroscope, IconGear, IconLaptop, IconBarChart, IconHandshake, IconMedical } from "./Icons"

const LESSONS = [
  {
    slug: "/educators/lesson-emg-basics",
    grade: "Grades 9–12",
    subject: "Biology / Physics",
    duration: "75 min",
    title: "What is EMG? Reading muscle signals in the classroom",
    summary: "Students discover how surface electromyography works, explore real EMG waveforms from the Ninapro dataset, and connect the biology of motor neurons to measurable electrical signals.",
    objectives: ["Understand the electrochemical basis of muscle contraction", "Interpret EMG waveform features", "Connect neuroscience to engineering applications"],
    color: "#FF2D78",
    icon: IconBolt,
  },
  {
    slug: "/educators/lesson-gesture-classifier",
    grade: "Grades 10–12 / Intro university",
    subject: "Computer Science / Data Science",
    duration: "90 min",
    title: "Teaching a machine to read gestures",
    summary: "A hands-on introduction to supervised machine learning using EMG gesture data. Students extract features, visualise decision boundaries, and understand why cross-subject generalisation is hard.",
    objectives: ["Understand supervised classification", "Extract time-domain features from signals", "Evaluate model performance using confusion matrices"],
    color: "#3B82F6",
    icon: IconBrain,
  },
  {
    slug: "/educators/lesson-applications-ethics",
    grade: "Grades 7–11",
    subject: "Technology / Ethics / Biology",
    duration: "60 min",
    title: "EMG in the real world: applications and bioethics",
    summary: "Students explore where EMG technology is deployed today, evaluate what 84% accuracy means in different contexts, and debate who benefits - and who doesn't - when technology listens to your body.",
    objectives: ["Identify real-world EMG applications", "Evaluate accuracy in terms of error consequences", "Reason about access, privacy, and bias in biometric technology"],
    color: "#8B5CF6",
    icon: IconPuzzle,
  },
  {
    slug: "/educators/resources",
    grade: "All levels",
    subject: "Cross-curricular",
    duration: "Reference",
    title: "Educator resource library",
    summary: "Printable handouts, slide deck templates, assessment rubrics, dataset downloads, and links to curriculum standards. Everything you need to run myojam lessons without starting from scratch.",
    objectives: ["Ready-to-print materials", "Curriculum alignment guides", "Assessment frameworks"],
    color: "#10B981",
    icon: IconBook,
  },
]

const SUBJECTS = [
  { icon: IconMicroscope, label:"Biology", desc:"Motor neurons, muscle contraction, the neuromuscular junction - EMG makes the invisible visible." },
  { icon: IconGear, label:"Physics", desc:"Signal amplitude, frequency, noise filtering - real physics in a biological context." },
  { icon: IconLaptop, label:"Computer Science", desc:"Classification, feature extraction, event-driven programming, machine learning fundamentals." },
  { icon: IconBarChart, label:"Data Science", desc:"Real 16-channel, 200Hz datasets. Students clean, visualise, and model genuine research data." },
  { icon: IconHandshake, label:"Ethics", desc:"Biometric data, accessibility, who benefits from technology - rich ethical discussion material." },
  { icon: IconMedical, label:"Health & Technology", desc:"Assistive technology, motor impairment, and the engineering of prosthetics and interfaces." },
]

const TEASER_QUESTIONS = [
  {
    question: "Surface EMG electrodes measure electrical activity in:",
    options: ["The brain","Muscle fibres beneath the skin","Blood vessels","The peripheral nerves directly"],
    correct: 1,
    explanation: "Surface electrodes pick up the summed electrical activity of muscle fibre action potentials through the skin. They don't directly record brain or nerve signals - those require more invasive approaches."
  },
  {
    question: "myojam achieves what cross-subject classification accuracy?",
    options: ["72.3%","84.85%","91.2%","78.5%"],
    correct: 1,
    explanation: "myojam's Random Forest classifier achieves 84.85% accuracy on subjects it has never seen before, trained on the Ninapro DB5 dataset across 10 subjects and 6 gesture classes."
  },
  {
    question: "Which myojam tool lets you see exactly which gestures the classifier confuses - and why?",
    options: ["The signal playground","The gesture reaction game","The EMG frequency analyzer","The confusion matrix explorer"],
    correct: 3,
    explanation: "The confusion matrix explorer shows an interactive heatmap of cross-subject accuracy. Clicking any cell reveals how often one gesture is mistaken for another, along with the biomechanical reason - making it a powerful tool for understanding classifier limitations."
  },
]

export default function Educators() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", overflowX:"clip" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes orbFloat { from{transform:translateY(0)} to{transform:translateY(-28px)} }
      `}</style>
      <Navbar />

      {/* Hero */}
      <section style={{ position:"relative", padding:"120px 32px 80px", overflow:"hidden", borderBottom:"1px solid var(--border)" }}>
        <NeuralNoise color={[0.06, 0.72, 0.40]} opacity={0.85} speed={0.0006} />
        <div style={{ position:"absolute", inset:0, background:"rgba(3,0,18,0.65)", zIndex:1 }} />
        <div style={{ maxWidth:860, margin:"0 auto", position:"relative", zIndex:2 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.08)", backdropFilter:"blur(8px)", border:"1px solid rgba(16,185,129,0.35)", borderRadius:100, padding:"6px 16px", fontSize:13, color:"#10B981", fontWeight:500, marginBottom:32, animation:"fadeUp 0.6s ease" }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:"#10B981",display:"inline-block" }}/>
            Free · Open access · Curriculum-aligned
          </div>
          <h1 style={{ fontSize:"clamp(40px,6vw,72px)", fontWeight:600, letterSpacing:"-2.5px", lineHeight:1.04, color:"#fff", marginBottom:24, animation:"fadeUp 0.6s 0.1s ease both" }}>
            Bring EMG science<br/>into your<br/><span style={{ color:"#10B981" }}>classroom.</span>
          </h1>
          <p style={{ fontSize:18, color:"rgba(255,255,255,0.72)", fontWeight:300, lineHeight:1.75, maxWidth:560, marginBottom:44, animation:"fadeUp 0.6s 0.2s ease both" }}>
            Ready-to-run lesson plans, real datasets, and interactive tools for teaching
            neuroscience, machine learning, and assistive technology - from middle school to university.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", animation:"fadeUp 0.6s 0.3s ease both" }}>
            <a href="#lessons" style={{ background:"#10B981", color:"#fff", borderRadius:100, padding:"14px 36px", fontSize:15, fontWeight:500, textDecoration:"none", boxShadow:"0 4px 24px rgba(16,185,129,0.35)", transition:"transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow="0 8px 32px rgba(16,185,129,0.45)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 24px rgba(16,185,129,0.35)"}}
            >Browse lesson plans ↓</a>
            <button onClick={()=>navigate("/educators/resources")} style={{ background:"rgba(255,255,255,0.08)", backdropFilter:"blur(8px)", color:"#fff", border:"1px solid rgba(255,255,255,0.2)", borderRadius:100, padding:"14px 28px", fontSize:15, fontWeight:400, cursor:"pointer", fontFamily:"var(--font)", transition:"border-color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(16,185,129,0.5)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.2)"}
            >Resource library →</button>
          </div>
        </div>
      </section>

      {/* Subject areas */}
      <section style={{ background:"var(--bg-secondary)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"64px 32px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>Cross-curricular</SectionPill>
            <h2 style={{ fontSize:"clamp(24px,4vw,38px)", fontWeight:600, letterSpacing:"-1px", color:"var(--text)", marginBottom:40 }}>
              One project, six subject areas.
            </h2>
          </Reveal>
          <StaggerList items={SUBJECTS} columns={3} gap={12} renderItem={s=>(
            <HoverCard style={{ background:"var(--bg)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"24px" }}>
              <div style={{ width:44, height:44, borderRadius:10, background:"var(--accent-soft)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}><s.icon size={22} color="var(--accent)" /></div>
              <div style={{ fontSize:15, fontWeight:600, color:"var(--text)", marginBottom:6 }}>{s.label}</div>
              <p style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.65, fontWeight:300, margin:0 }}>{s.desc}</p>
            </HoverCard>
          )}/>
        </div>
      </section>

      {/* Curriculum alignment */}
      <section style={{ borderBottom:"1px solid var(--border)", padding:"64px 32px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>Standards alignment</SectionPill>
            <h2 style={{ fontSize:"clamp(22px,3.5vw,34px)", fontWeight:600, letterSpacing:"-1px", color:"var(--text)", marginBottom:12 }}>
              Mapped to curriculum standards.
            </h2>
            <p style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.75, marginBottom:36, maxWidth:520 }}>
              All three lessons are aligned to major curriculum frameworks. The table below shows which standards each lesson supports — use it when writing your unit plan or seeking administration approval.
            </p>
            <div style={{ border:"1px solid var(--border)", borderRadius:"var(--radius)", overflow:"hidden" }}>
              {/* Header */}
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", background:"var(--bg-secondary)", borderBottom:"1px solid var(--border)" }}>
                {["Standard / Framework", "L1 — EMG Basics", "L2 — Classifier", "L3 — Ethics"].map((h,i) => (
                  <div key={h} style={{ padding:"12px 18px", fontSize:11, fontWeight:600, color:i===0?"var(--text)":["#FF2D78","#3B82F6","#8B5CF6"][i-1], textTransform:"uppercase", letterSpacing:"0.06em", borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>{h}</div>
                ))}
              </div>
              {[
                {
                  framework: "Ontario Science (Gr 9–12)",
                  sub: "Biology SBI3U · Physics SPH3U",
                  l1: "SBI3U — E2.1, E2.4 (nerve impulse, muscle contraction)",
                  l2: "SPH3U — data analysis, signal processing",
                  l3: "SNC2D — technology and society",
                },
                {
                  framework: "NGSS (US)",
                  sub: "HS-LS1, HS-PS4, HS-ETS1",
                  l1: "HS-LS1-2 (cell specialisation, electrical signalling)",
                  l2: "HS-PS4-5 (data analysis, pattern recognition)",
                  l3: "HS-ETS1-1 (criteria, constraints, societal impact)",
                },
                {
                  framework: "IB Biology / Computer Science",
                  sub: "SL/HL Topic 6 · CS Option D",
                  l1: "Topic 6.5 — neurons and synapses",
                  l2: "CS Option D — machine learning, pattern recognition",
                  l3: "Topic 11.4 — bioethics and medical technology",
                },
                {
                  framework: "AP Computer Science Principles",
                  sub: "Big Ideas 2, 4, 5",
                  l1: "—",
                  l2: "BI-4 (algorithms), BI-2 (data representation)",
                  l3: "BI-5 (societal impacts of computing)",
                },
                {
                  framework: "Cambridge IGCSE / A-Level",
                  sub: "Biology · Computer Science",
                  l1: "A-Level Bio — Chapter 15 (coordination)",
                  l2: "IGCSE CS — Section 2 (data, algorithms)",
                  l3: "A-Level Bio — Chapter 16 (nervous system + ethics)",
                },
              ].map(({ framework, sub, l1, l2, l3 }, ri) => (
                <div key={framework} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", borderBottom: ri < 4 ? "1px solid var(--border)" : "none", background: ri % 2 === 0 ? "var(--bg)" : "var(--bg-secondary)" }}>
                  <div style={{ padding:"14px 18px", borderRight:"1px solid var(--border)" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:3 }}>{framework}</div>
                    <div style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300 }}>{sub}</div>
                  </div>
                  {[l1, l2, l3].map((val, ci) => (
                    <div key={ci} style={{ padding:"14px 18px", fontSize:11, color: val === "—" ? "var(--text-tertiary)" : "var(--text-secondary)", fontWeight: val === "—" ? 300 : 300, lineHeight:1.55, borderRight: ci < 2 ? "1px solid var(--border)" : "none" }}>{val}</div>
                  ))}
                </div>
              ))}
            </div>
            <p style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300, lineHeight:1.6, marginTop:12 }}>
              Alignment verified against published curriculum documents. Contact us if you'd like a detailed mapping for a framework not listed above.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Lesson plans */}
      <section id="lessons" style={{ padding:"64px 32px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>Lesson plans</SectionPill>
            <h2 style={{ fontSize:"clamp(24px,4vw,38px)", fontWeight:600, letterSpacing:"-1px", color:"var(--text)", marginBottom:40 }}>
              Ready to teach this week.
            </h2>
          </Reveal>
          <StaggerList items={LESSONS} columns={1} gap={16} renderItem={lesson=>(
            <HoverCard color={lesson.color+"20"} onClick={()=>navigate(lesson.slug)} style={{ background:"var(--bg-secondary)", borderRadius:"var(--radius)", border:"1px solid var(--border)", overflow:"hidden", cursor:"pointer" }}>
              <div style={{ background:`linear-gradient(135deg, ${lesson.color}10 0%, transparent 100%)`, borderBottom:"1px solid var(--border)", padding:"28px 32px", display:"flex", gap:20, alignItems:"flex-start" }}>
                <div style={{ width:52, height:52, borderRadius:14, background:lesson.color+"18", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><lesson.icon size={24} color={lesson.color} /></div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
                    <span style={{ fontSize:11, fontWeight:500, color:lesson.color, background:lesson.color+"15", border:`1px solid ${lesson.color}30`, borderRadius:100, padding:"3px 10px" }}>{lesson.grade}</span>
                    <span style={{ fontSize:11, fontWeight:400, color:"var(--text-tertiary)", background:"var(--bg)", border:"1px solid var(--border)", borderRadius:100, padding:"3px 10px" }}>{lesson.subject}</span>
                    <span style={{ fontSize:11, fontWeight:400, color:"var(--text-tertiary)", background:"var(--bg)", border:"1px solid var(--border)", borderRadius:100, padding:"3px 10px" }}>⏱ {lesson.duration}</span>
                  </div>
                  <h3 style={{ fontSize:19, fontWeight:600, color:"var(--text)", letterSpacing:"-0.3px", marginBottom:8, lineHeight:1.3 }}>{lesson.title}</h3>
                  <p style={{ fontSize:14, color:"var(--text-secondary)", lineHeight:1.7, fontWeight:300, margin:0 }}>{lesson.summary}</p>
                </div>
                <span style={{ fontSize:18, color:"var(--text-tertiary)", flexShrink:0, marginTop:4 }}>→</span>
              </div>
              <div style={{ padding:"16px 32px", display:"flex", gap:8, flexWrap:"wrap" }}>
                {lesson.objectives.map(o=>(
                  <span key={o} style={{ fontSize:12, color:"var(--text-secondary)", background:"var(--bg)", border:"1px solid var(--border)", borderRadius:100, padding:"4px 12px", fontWeight:300 }}>✓ {o}</span>
                ))}
              </div>
            </HoverCard>
          )}/>
        </div>
      </section>

      {/* Teaser quiz */}
      <section style={{ padding:"0 32px 48px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <Reveal>
            <SectionPill>Test yourself</SectionPill>
            <h2 style={{ fontSize:"clamp(22px,3vw,32px)", fontWeight:600, letterSpacing:"-0.8px", color:"var(--text)", marginBottom:8 }}>
              How much do you already know?
            </h2>
            <p style={{ fontSize:15, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, marginBottom:0 }}>
              A 3-question preview. Full quizzes are inside each lesson.
            </p>
          </Reveal>
          <Quiz title="EMG & myojam - quick preview" questions={TEASER_QUESTIONS} accentColor="#10B981" />
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"0 32px 80px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <Reveal>
            <div style={{ background:"linear-gradient(135deg, rgba(16,185,129,0.08) 0%, transparent 100%)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:"var(--radius)", padding:"48px", textAlign:"center" }}>
              <h3 style={{ fontSize:24, fontWeight:600, color:"var(--text)", letterSpacing:"-0.5px", marginBottom:12 }}>Have a suggestion or want to contribute?</h3>
              <p style={{ fontSize:15, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.7, maxWidth:440, margin:"0 auto 28px" }}>
                We're actively developing new lesson plans. If you've used myojam in a classroom and want to share what worked, we'd love to hear from you.
              </p>
              <ContactForm
                source="educators"
                namePlaceholder="Your name"
                emailPlaceholder="your@email.com"
                messagePlaceholder="Tell us how you used myojam in your classroom and what worked."
                submitLabel="Share your experience"
                padding="20px 0 0"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}