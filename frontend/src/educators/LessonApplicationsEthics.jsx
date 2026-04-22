import { useNavigate } from "react-router-dom"
import Navbar from "../Navbar"
import Footer from "../Footer"
import NeuralNoise from "../components/NeuralNoise"

const META = {
  grade: "Grades 7–11",
  subject: "Technology / Ethics / Biology",
  duration: "60 minutes",
  groupSize: "Pairs or small groups",
  materials: ["Computer with browser", "myojam.com/confusion", "myojam.com/frequency", "Sticky notes or whiteboard space", "Printed design brief (optional)"],
  standards: ["NGSS HS-ETS1-1 (Engineering design)", "ISTE 1.7 (Global collaborator)", "AP CS Principles: Global impact", "IB: Social and ethical implications of technology"],
}

const SECTIONS = [
  {
    num:"01", phase:"Hook", time:"8 min", color:"#8B5CF6",
    title:"What if your computer knew how you were moving?",
    body:"Open with a 2-minute think-pair-share: 'Name three situations where you can't use your hands to control a computer.' Students brainstorm individually, then share. Compile a list on the board: driving, surgery, physical disability, playing an instrument, holding something fragile. The point: the keyboard and mouse work for most people in most contexts - but not all people in all contexts. Ask: what would a more flexible input device look like?",
    activity:null,
    teacher:"The goal is to surface the access problem before introducing EMG. Students should feel the limitation. Avoid leading with prosthetics - let students arrive there on their own. The more diverse the list of scenarios, the richer the subsequent ethics discussion.",
  },
  {
    num:"02", phase:"Concept", time:"12 min", color:"#F97316",
    title:"EMG already exists in the world",
    body:"Introduce four real-world EMG application domains with brief descriptions. Prosthetics: myoelectric prosthetic arms decode forearm EMG to move robotic fingers - commercially available, used by thousands. Medical rehabilitation: EMG biofeedback helps stroke patients relearn muscle activation patterns they've lost. Gaming and XR: companies like Meta and Ctrl-Labs are building wristbands that let you control interfaces with subtle muscle movements. Research tools: neuroscientists use EMG to study fatigue, motor disorders, and how the nervous system adapts after injury. Each domain uses the same core technology - they differ in application, cost, and who has access.",
    activity:"Students write one question about each domain. These questions drive the discussion in section 4. Good questions: 'Who pays for it?', 'Does it work for everyone?', 'What happens to the data?'",
    teacher:"If students are familiar with Neuralink or BCI, situate it: EMG is non-invasive (no surgery). It measures peripheral electrical activity from outside the body. This makes it fundamentally more accessible than implanted devices - and raises different ethical questions.",
  },
  {
    num:"03", phase:"Exploration", time:"15 min", color:"#FF2D78",
    title:"What does 84% accuracy actually mean?",
    body:"Direct students to the Confusion Matrix Explorer (myojam.com/confusion). They explore the heatmap and click cells to read explanations. Focus students on two questions: find the gesture pair most commonly confused and read why. Then calculate: if this system controls a prosthetic hand, and it misclassifies one in six gestures on average, what does that mean in practice? Students then switch to the Frequency Analyzer (myojam.com/frequency) and observe how the bandpass filter affects different channels. Ask: why does the signal look different across channels?",
    activity:"Worksheet: (1) Which two gestures are most confused? Write the biomechanical reason. (2) If a user attempts 100 grasps per day, how many will be misclassified? (3) For a prosthetic hand, how serious is a 1-in-6 error rate? For a keyboard shortcut? For a surgical robot? The same number means very different things.",
    teacher:"This section builds quantitative intuition for accuracy in context. 84.85% sounds high until you frame it as 'fails 15 times in 100 attempts.' The surgical robot question is deliberately provocative - the right answer is that different applications demand different error tolerances, and a classifier that's fine for one use case is unacceptable for another.",
  },
  {
    num:"04", phase:"Discussion", time:"15 min", color:"#3B82F6",
    title:"Who benefits, who doesn't, and who decides?",
    body:"Use the questions students wrote in section 2 to structure a class discussion. Guide toward four ethical dimensions. Access: a basic myoelectric prosthetic costs $10,000–$50,000. Advanced bionic arms exceed $100,000. Who can afford this? How does insurance coverage vary? Data privacy: EMG signals are biometric data - they reveal health information about your muscles and nervous system. Who owns that data? What can it be used for? Accuracy across populations: the Ninapro database is predominantly young, able-bodied adults in lab settings. Does the model work equally well for older adults, people with muscle conditions, or people from different physical backgrounds? Consent: if your employer required EMG monitoring to track productivity or focus, would that be acceptable?",
    activity:"Small groups take one dimension each. They have 4 minutes to prepare a 60-second position statement. Each group presents; class can agree or disagree.",
    teacher:"There are no 'correct' positions here. The goal is structured reasoning, not consensus. Watch for false dichotomies ('EMG is good/bad') and push students toward nuance: 'Good for whom? Under what conditions? With what safeguards?' The data privacy point often produces the most animated discussion.",
  },
  {
    num:"05", phase:"Design challenge", time:"5 min", color:"#10B981",
    title:"Design brief: propose an EMG application",
    body:"In pairs, students draft a one-paragraph proposal for an EMG application. The proposal must address: who specifically would use it, what gesture set would be needed, what accuracy threshold is acceptable and why, and one risk or limitation they'd need to design around. Not every pair needs a fully worked idea - rough and honest is better than polished and superficial.",
    activity:"Proposals are shared in a 'gallery walk' if time permits, or collected as homework. Best proposals can seed a longer project: students flesh out the design brief, identify relevant datasets, and present to the class.",
    teacher:"Encourage unexpected applications: music interfaces, sports coaching, accessibility tools for non-hand disabilities. The point is transfer - students should leave understanding that the same technical pipeline can serve wildly different human needs.",
  },
  {
    num:"06", phase:"Exit ticket", time:"5 min", color:"#F59E0B",
    title:"One number, two contexts",
    body:"Students answer in writing: 'myojam's classifier achieves 84.85% accuracy. Describe one application where this would be acceptable and one where it would not be. Explain your reasoning in terms of consequences of error.' Collect these. They reveal whether students have moved from abstract accuracy to contextual evaluation - a key data literacy skill.",
    activity:"Exit ticket slip (half sheet). Optional follow-up: 'If you were asked to improve accuracy from 84.85% to 95%, name one approach from signal processing, one from the training dataset, and one from system design.'",
    teacher:"Strong exit tickets here show that students understand accuracy as a design variable, not just a performance metric. The follow-up extension question is excellent for identifying students who are ready to go deeper into the technical pipeline.",
  },
]

const DIFFERENTIATION = [
  { label:"Support", color:"#3B82F6", items:["Provide a pre-filled confusion matrix with the top 3 confused pairs highlighted","Use a simplified version of the design brief with sentence starters","Pair with a partner for all discussion activities"] },
  { label:"Extension", color:"#FF2D78", items:["Research the Ninapro database demographics and evaluate dataset bias","Calculate cost-per-gesture for a commercial myoelectric prosthetic","Write a one-page technology impact assessment for their proposed application"] },
  { label:"ELL support", color:"#10B981", items:["Vocabulary list: accuracy, biometric, prosthetic, electrode, classification","Diagram-based confusion matrix activity","Peer discussion in L1 permitted during the design challenge"] },
]

import Quiz from "./Quiz"

const QUIZ_QUESTIONS = [
  {
    question: "A myoelectric prosthetic hand costs $10,000–$50,000. Which of the following is the most direct barrier to access this creates?",
    options: ["The technology is too complicated for most users to learn","Most people cannot afford it without insurance coverage or subsidies","The accuracy is too low for real-world use","It only works for people who have lost a hand recently"],
    correct: 1,
    explanation: "Cost is the primary access barrier for myoelectric prosthetics. The technology works and is clinically effective - the limiting factor is that most health systems don't fully cover advanced prosthetics, leaving a large gap between what works in the lab and who can actually use it."
  },
  {
    question: "myojam's classifier achieves 84.85% cross-subject accuracy. In which application would this accuracy level be most clearly unacceptable?",
    options: ["A gaming controller that changes weapon using a wrist flex","A keyboard shortcut launcher triggered by a hand gesture","A surgical robot that performs incisions in response to surgeon gestures","An accessibility tool that scrolls a page up or down"],
    correct: 2,
    explanation: "For a surgical robot, a 15% error rate could cause direct physical harm. In contrast, a misclassified keyboard shortcut or scroll command is a nuisance that can be easily corrected. Applications must be evaluated against the consequences of errors, not just average accuracy."
  },
  {
    question: "EMG training data is collected primarily from young, able-bodied adults in laboratory settings. What is the most likely consequence of this for real-world performance?",
    options: ["The model will be more accurate in real-world settings than in the lab","The model may perform worse for older adults, people with muscle conditions, or those with different physical profiles","The model will reject all inputs from users not in the training set","The accuracy number on the dataset will be lower than the real-world accuracy"],
    correct: 1,
    explanation: "Machine learning models generalise from their training data. If the training population is narrow, the model may not capture the signal variability present in the broader real-world population. This is called dataset bias and is a well-documented problem in EMG research."
  },
  {
    question: "An EMG wristband product collects muscle signal data and uploads it to a cloud server for classification. What is the primary privacy concern?",
    options: ["The wristband might be physically uncomfortable to wear","EMG signals are biometric data that could reveal health and neurological information about the user","The cloud classification introduces too much latency for real-time use","The server costs make the product expensive to operate"],
    correct: 1,
    explanation: "EMG is biometric data. It can reveal information about muscle health, neurological conditions, fatigue, and physical state. Unlike a password, biometric data cannot be changed if compromised. Questions about who owns the data, how long it's stored, and who has access to it are serious design and legal considerations."
  },
  {
    question: "A student proposes an EMG application that controls a wheelchair using forearm gestures. Which accuracy threshold would be most appropriate to require before deployment?",
    options: ["50% - better than random, and the user can correct errors manually","70% - roughly equivalent to existing switch-based systems","95%+ because errors directly affect safety and mobility","Accuracy doesn't matter as long as the system is faster than alternatives"],
    correct: 2,
    explanation: "For mobility and safety-critical applications, error rates directly affect physical safety. A wheelchair that misclassifies 'turn right' as 'accelerate' could cause serious harm. High-stakes physical applications require significantly higher accuracy thresholds than convenience applications."
  },
  {
    question: "Which of the following best describes the difference between 'cross-subject accuracy' and 'within-subject accuracy' as it relates to a commercial EMG product?",
    options: ["Cross-subject accuracy only applies to research, not commercial products","Cross-subject accuracy measures whether the model works for new users who weren't in the training set - directly relevant to any commercial product","Within-subject accuracy is always higher because the user calibrates the device","The two metrics are identical for large enough datasets"],
    correct: 1,
    explanation: "A commercial product must work for arbitrary new purchasers. Cross-subject accuracy directly measures this generalisation ability. Within-subject accuracy measures how well the model works for people who were already in its training set - a much easier problem that doesn't reflect real-world deployment."
  },
  {
    question: "The Ninapro DB5 dataset was collected from 10 subjects performing gestures in a controlled laboratory setting. Which of the following would most improve the diversity of a future training dataset?",
    options: ["Recording the same 10 subjects for longer sessions","Collecting data from a broader range of ages, physical abilities, and real-world settings","Increasing the sampling rate from 200Hz to 2000Hz","Adding more gesture classes beyond the current 6"],
    correct: 1,
    explanation: "Dataset diversity is the most direct way to reduce demographic bias. Broader representation - more ages, abilities, body types, and recording conditions - produces models that generalise better across the real user population."
  },
  {
    question: "A company wants to use EMG armbands to monitor employee muscle activity during work shifts to detect fatigue. Which ethical concern is most directly raised?",
    options: ["The armbands might not be accurate enough to detect fatigue reliably","Continuous biometric monitoring in the workplace raises serious consent and privacy issues","The technology is too new to be used in commercial settings","EMG can only detect voluntary gestures, not involuntary fatigue signals"],
    correct: 1,
    explanation: "Continuous biometric monitoring in employment contexts raises fundamental questions about consent (is it truly voluntary if your job depends on it?), data ownership, and potential for discriminatory use. Many jurisdictions are beginning to regulate or restrict workplace biometric data collection."
  },
]

export default function LessonApplicationsEthics() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ position:"relative", overflow:"hidden", borderBottom:"1px solid var(--border)", padding:"100px 32px 56px" }}>
        <NeuralNoise color={[0.54, 0.36, 0.95]} opacity={0.85} speed={0.0006} />
        <div style={{ position:"absolute", inset:0, background:"rgba(3,0,18,0.65)", zIndex:1 }} />
        <div style={{ maxWidth:760, margin:"0 auto", position:"relative", zIndex:2 }}>
          <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
            <span onClick={()=>navigate("/educators")} style={{ fontSize:13, color:"#10B981", cursor:"pointer", fontWeight:400 }}>For educators</span>
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>→</span>
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)", fontWeight:300 }}>Lesson plan</span>
          </div>

          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
            {[META.grade, META.subject, `⏱ ${META.duration}`].map(tag=>(
              <span key={tag} style={{ fontSize:11, fontWeight:500, color:"#8B5CF6", background:"rgba(139,92,246,0.12)", border:"1px solid rgba(139,92,246,0.3)", borderRadius:100, padding:"4px 12px" }}>{tag}</span>
            ))}
          </div>

          <h1 style={{ fontSize:"clamp(28px,5vw,48px)", fontWeight:600, letterSpacing:"-1.5px", color:"#fff", lineHeight:1.08, marginBottom:20 }}>
            EMG in the real world:<br/><span style={{ color:"#8B5CF6" }}>applications and bioethics.</span>
          </h1>
          <p style={{ fontSize:16, color:"rgba(255,255,255,0.72)", fontWeight:300, lineHeight:1.75, maxWidth:580 }}>
            Students explore where EMG technology is already in use, examine what 84% accuracy means in different contexts, and debate who benefits - and who doesn't - when technology listens to your body.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:760, margin:"0 auto", padding:"56px 32px 80px" }}>

        {/* At a glance */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginBottom:56 }}>
          <div style={{ background:"var(--bg-secondary)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"24px" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"#8B5CF6", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:14 }}>Materials needed</div>
            {META.materials.map(m=>(
              <div key={m} style={{ fontSize:13, color:"var(--text-secondary)", fontWeight:300, marginBottom:6, display:"flex", gap:8 }}>
                <span style={{ color:"#8B5CF6", fontWeight:500 }}>✓</span>{m}
              </div>
            ))}
          </div>
          <div style={{ background:"var(--bg-secondary)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"24px" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"#8B5CF6", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:14 }}>Curriculum standards</div>
            {META.standards.map(s=>(
              <div key={s} style={{ fontSize:13, color:"var(--text-secondary)", fontWeight:300, marginBottom:6, display:"flex", gap:8 }}>
                <span style={{ color:"#8B5CF6", fontWeight:500 }}>→</span>{s}
              </div>
            ))}
          </div>
        </div>

        {/* Learning objectives */}
        <div style={{ background:"rgba(139,92,246,0.04)", border:"1px solid rgba(139,92,246,0.15)", borderLeft:"3px solid #8B5CF6", borderRadius:"0 var(--radius) var(--radius) 0", padding:"24px 28px", marginBottom:56 }}>
          <div style={{ fontSize:11, fontWeight:600, color:"#8B5CF6", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:14 }}>Learning objectives</div>
          {[
            "Students can name at least three real-world domains where EMG technology is deployed",
            "Students can evaluate classifier accuracy in terms of consequences of error for a given application",
            "Students can identify at least two ethical considerations in EMG-based products",
            "Students can propose an EMG application and articulate one design constraint or risk",
          ].map(o=>(
            <div key={o} style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:300, marginBottom:8, display:"flex", gap:10 }}>
              <span style={{ color:"#8B5CF6", fontWeight:600, fontSize:12, marginTop:2 }}>✓</span>{o}
            </div>
          ))}
        </div>

        {/* Lesson phases */}
        <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", marginBottom:24 }}>Lesson plan</div>
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {SECTIONS.map((s,i)=>(
            <div key={s.num} style={{ padding:"40px 0", borderBottom:i<SECTIONS.length-1?"1px solid var(--border)":"none" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:16 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:s.color+"18", border:`2px solid ${s.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:s.color, flexShrink:0 }}>{s.num}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, fontWeight:500, color:s.color, background:s.color+"15", borderRadius:100, padding:"2px 8px" }}>{s.phase}</span>
                    <span style={{ fontSize:11, color:"var(--text-tertiary)", fontWeight:300 }}>{s.time}</span>
                  </div>
                  <h3 style={{ fontSize:19, fontWeight:600, color:"var(--text)", letterSpacing:"-0.3px", marginBottom:12 }}>{s.title}</h3>
                  <p style={{ fontSize:14, color:"var(--text-secondary)", lineHeight:1.8, fontWeight:300, marginBottom:s.activity||s.teacher?16:0 }}>{s.body}</p>
                  {s.activity && (
                    <div style={{ background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.2)", borderLeft:"3px solid #3B82F6", borderRadius:"0 8px 8px 0", padding:"14px 18px", marginBottom:s.teacher?12:0 }}>
                      <div style={{ fontSize:11, fontWeight:600, color:"#3B82F6", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Student activity</div>
                      <p style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.7, fontWeight:300, margin:0 }}>{s.activity}</p>
                    </div>
                  )}
                  {s.teacher && (
                    <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)", borderLeft:"3px solid #F59E0B", borderRadius:"0 8px 8px 0", padding:"14px 18px" }}>
                      <div style={{ fontSize:11, fontWeight:600, color:"#F59E0B", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Teacher notes</div>
                      <p style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.7, fontWeight:300, margin:0 }}>{s.teacher}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Differentiation */}
        <div style={{ marginTop:56 }}>
          <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", marginBottom:20 }}>Differentiation strategies</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {DIFFERENTIATION.map(d=>(
              <div key={d.label} style={{ background:"var(--bg-secondary)", borderRadius:"var(--radius-sm)", border:"1px solid var(--border)", borderTop:`3px solid ${d.color}`, padding:"20px" }}>
                <div style={{ fontSize:12, fontWeight:600, color:d.color, marginBottom:12 }}>{d.label}</div>
                {d.items.map(item=>(
                  <div key={item} style={{ fontSize:12, color:"var(--text-secondary)", fontWeight:300, lineHeight:1.6, marginBottom:8, display:"flex", gap:6 }}>
                    <span style={{ color:d.color, fontWeight:600, fontSize:10, marginTop:2 }}>•</span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Assessment */}
        <div style={{ marginTop:40, background:"var(--bg-secondary)", borderRadius:"var(--radius)", border:"1px solid var(--border)", padding:"32px" }}>
          <div style={{ fontSize:11, fontWeight:600, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:16 }}>Assessment rubric</div>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:8, fontSize:12 }}>
            {[
              ["Criterion","Developing (1–2)","Proficient (3)","Extending (4)"],
              ["Names real-world applications","Names one domain","Names three domains with brief descriptions","Describes how EMG is used technically in each domain"],
              ["Evaluates accuracy in context","States a percentage","Links accuracy to error consequences in one context","Compares error tolerance across multiple applications"],
              ["Ethical reasoning","Identifies one concern","Explains two concerns with reasoning","Proposes a specific design or policy response to each concern"],
            ].map((row,ri)=>(
              row.map((cell,ci)=>(
                <div key={`${ri}-${ci}`} style={{ padding:"10px 12px", background: ri===0?"var(--accent-soft)":ci===0?"var(--bg)":"white", borderRadius:6, border:"1px solid var(--border)", fontSize:ri===0?11:12, fontWeight:ri===0||ci===0?500:300, color:ri===0?"var(--accent)":"var(--text-secondary)", lineHeight:1.5 }}>{cell}</div>
              ))
            ))}
          </div>
        </div>

        <Quiz
          title="EMG Applications & Ethics - quick check"
          questions={QUIZ_QUESTIONS}
          accentColor="#8B5CF6"
        />

        {/* Nav */}
        <div style={{ marginTop:40, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <button onClick={()=>navigate("/educators/lesson-gesture-classifier")} style={{ background:"transparent", color:"var(--text-secondary)", border:"1px solid var(--border-mid)", borderRadius:100, padding:"10px 24px", fontSize:13, fontFamily:"var(--font)", fontWeight:400, cursor:"pointer" }}>
            ← Previous: Gesture classifier
          </button>
          <button onClick={()=>navigate("/educators")} style={{ background:"#8B5CF6", color:"#fff", border:"none", borderRadius:100, padding:"10px 24px", fontSize:13, fontFamily:"var(--font)", fontWeight:500, cursor:"pointer" }}>
            Back to educator hub →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
