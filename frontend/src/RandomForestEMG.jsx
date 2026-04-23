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

const ABSTRACT = "Random Forest classifiers have become the workhorse of EMG gesture recognition due to their robustness to noise, interpretability, and strong out-of-the-box performance on tabular feature data. This article examines why ensemble tree methods outperform simpler classifiers on biomedical signal data, how hyperparameter tuning affects cross-subject generalisation, and what the 84.85% accuracy figure achieved by myojam actually means in practice."

const SECTIONS = [
  {
    num: "01", tag: "Background", title: "Why not a neural network?",
    body: "Neural networks dominate most modern machine learning benchmarks, so it's reasonable to ask why myojam uses a Random Forest. The answer is practical: on tabular feature data - vectors of handcrafted statistics like MAV, RMS, ZC, and WL - Random Forests consistently match or outperform deep models while requiring orders of magnitude less training data and compute. With 16,269 training windows across 6 classes, a deep network would overfit aggressively without extensive regularisation and data augmentation. A Random Forest reaches competitive accuracy without any of that overhead. It's also interpretable: you can inspect which features matter most, something neural networks make difficult.",
    callout: null,
  },
  {
    num: "02", tag: "The algorithm", title: "How a Random Forest actually works",
    body: "A Random Forest is an ensemble of decision trees trained on random subsets of the training data (bagging) and random subsets of the features at each split (feature randomisation). Each tree learns a slightly different decision boundary, and the final prediction is the majority vote across all trees. This combination of diversity and aggregation dramatically reduces variance - the tendency to overfit - compared to a single deep tree. For EMG data, where the signal is inherently noisy and variable, this variance reduction is particularly valuable. myojam's classifier uses 500 trees with hyperparameters tuned via 100-configuration RandomizedSearchCV, optimising for cross-validated accuracy.",
    callout: "The key hyperparameters tuned: max_depth (limits tree complexity), min_samples_split (minimum samples to split a node), max_features (fraction of features considered at each split), and n_estimators (number of trees). More trees reduce variance but increase inference time - 500 was the sweet spot for <5ms latency.",
  },
  {
    num: "03", tag: "Feature importance", title: "Which features matter most?",
    body: "Random Forests provide a natural measure of feature importance: how much each feature reduces impurity (Gini or entropy) averaged across all trees and splits. For EMG gesture classification, waveform length (WL) and mean absolute value (MAV) consistently rank as the most discriminative features - WL captures the overall complexity and speed of muscle contraction, while MAV reflects activation intensity. Zero crossing rate (ZC), which approximates frequency content, is particularly useful for distinguishing between gestures with similar energy profiles but different oscillation rates. RMS contributes additional power information but is highly correlated with MAV, so its marginal contribution is lower.",
    callout: null,
  },
  {
    num: "04", tag: "Cross-subject generalisation", title: "What 84.85% actually means",
    body: "An 84.85% cross-subject accuracy means the model correctly classifies 84.85% of EMG windows from people it has never seen during training. This is a substantially harder challenge than within-subject accuracy, where the same person's data appears in both training and testing - a common source of inflated accuracy claims in EMG literature. Cross-subject performance drops because EMG signals vary between individuals due to differences in muscle anatomy, electrode placement, skin impedance, and muscle fibre composition. Achieving 84.85% without any per-user calibration is a meaningful result, though it means roughly 1 in 7 classifications is wrong in real-world use.",
    callout: "For comparison, within-subject accuracies on similar datasets often exceed 95%. The 10-point gap between within- and cross-subject performance is the key challenge myojam's future personal model training feature aims to close.",
  },
  {
    num: "05", tag: "Limitations", title: "Where Random Forests fall short",
    body: "Random Forests have real limitations for EMG classification. They don't model temporal dependencies - each window is classified independently, with no memory of what came before. A gesture transition produces a window that is partially one gesture and partially another, and the classifier has no way to handle this gracefully. They also don't naturally adapt to new users. A gradient boosting model or a recurrent neural network could potentially address the temporal issue, while online learning approaches (incrementally updating the model with new user data) could address the adaptation problem. These are the right directions for a more capable future system.",
    callout: null,
  },
]

export default function RandomForestEMG() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)", padding: "100px 32px 56px" }}>
        <NeuralNoise color={[0.30, 0.20, 0.85]} opacity={0.85} speed={0.0006} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,0,18,0.65)", zIndex: 1 }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
            <span onClick={() => navigate("/education")} style={{ fontSize: 13, color: "var(--accent)", cursor: "pointer" }}>Education</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>→</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>Random Forest & EMG</span>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,45,120,0.3)",
            borderRadius: 100, padding: "5px 16px",
            fontSize: 13, color: "var(--accent)", fontWeight: 500, marginBottom: 24
          }}>Machine Learning · 7 min read</div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 600,
            letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.08, marginBottom: 24
          }}>Why Random Forest?<br /><span style={{ color: "var(--accent)" }}>The classifier behind myojam.</span></h1>
          <p style={{
            fontSize: 17, color: "var(--text-secondary)", fontWeight: 300,
            lineHeight: 1.75, marginBottom: 36, maxWidth: 580
          }}>
            Why not a neural network? How do ensemble tree methods handle noisy biomedical signals,
            and what does the 84.85% cross-subject accuracy figure actually tell us?
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <FaceAvatar seed={1} size={40} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>myojam team</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>Founder & Lead Engineer · March 15, 2026</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px 80px" }}>
        {/* Abstract */}
        <div style={{
          background: "var(--bg-secondary)", borderRadius: "var(--radius)",
          border: "1px solid var(--border)", borderLeft: "3px solid var(--accent)",
          padding: "24px 28px", marginBottom: 56
        }}>
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
            Random Forest is not the most glamorous choice, but it's the right one for myojam's scale and constraints.
            It delivers competitive cross-subject accuracy without the data hunger of deep learning, trains in seconds,
            and runs inference in under 5ms. Understanding its limitations - no temporal modelling, no online adaptation  - 
            is equally important: they define exactly what future work needs to address.
          </p>
        </div>

        <ArticleBar
          url="https://myojam.com/education/random-forest-emg"
          title="Why Random Forest? The classifier behind myojam"
          citation={{ apa: `Wong, J. (2026, March 15). Why Random Forest? The classifier behind myojam. myojam. https://myojam.com/education/random-forest-emg` }}
          presetLikes={38}
          storageKey="like_rf_emg"
        />
        <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
          <button onClick={() => navigate("/education")} style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-mid)", borderRadius: 100, padding: "10px 24px", fontSize: 13, fontFamily: "var(--font)", fontWeight: 400, cursor: "pointer" }}>← Back to Education</button>
        </div>
      </div>
      <UpNext current="/education/random-forest-emg" />
      <Footer />
    </div>
  )
}