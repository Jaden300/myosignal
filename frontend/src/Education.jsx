import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom"
import Footer from "./Footer"

const SECTIONS = [
  {
    num: "01",
    tag: "The basics",
    title: "What is EMG?",
    body: "Electromyography (EMG) is the measurement of electrical activity produced by skeletal muscles. When your brain tells a muscle to contract, it sends an electrical signal down a motor neuron. That signal causes muscle fibres to depolarise — producing a tiny voltage change detectable right through your skin. Surface EMG (sEMG) captures this using adhesive electrodes placed on the skin surface. No needles, no punctures — just electrodes picking up the electrical chatter of your muscles as you move.",
    callout: null,
  },
  {
    num: "02",
    tag: "The signal",
    title: "What does an EMG signal look like?",
    body: "At rest, an EMG signal is mostly noise — a faint, random flutter around zero. When you flex a finger, a burst of activity erupts: rapid oscillations between roughly −1mV and +1mV, lasting as long as the contraction. The more forcefully you contract, the more motor units fire simultaneously, and the larger and more complex the burst becomes. The signal is also contaminated by powerline interference (50/60Hz hum), motion artefacts from electrode movement, and cross-talk from neighbouring muscles — which is why filtering is essential before any analysis.",
    callout: "The human EMG frequency band of interest sits between 20Hz and 500Hz. myojam uses a 20–90Hz bandpass filter to isolate the most gesture-discriminative content while rejecting noise.",
  },
  {
    num: "03",
    tag: "Our hardware",
    title: "How MyoWare 2.0 fits in",
    body: "Medical-grade EMG systems cost thousands of dollars and require trained clinicians to operate. The MyoWare 2.0 is a consumer-grade muscle sensor that makes surface EMG accessible for hobbyists, students, and researchers on a budget. It amplifies and rectifies the raw differential EMG signal from bipolar electrodes into a single analogue output voltage — simple enough for an Arduino to read over a standard analogue pin.",
    callout: "Important caveat: MyoWare 2.0 is not a medical device and is not intended for clinical use. myojam uses it to demonstrate and explore EMG-based assistive technology concepts — not for diagnosis or treatment.",
  },
  {
    num: "04",
    tag: "Signal processing",
    title: "From raw signal to clean data",
    body: "The raw signal from the Arduino arrives at 200 samples per second (200Hz). Before classification, it goes through two processing steps. First, a 4th-order Butterworth bandpass filter removes frequencies below 20Hz (DC drift, motion artefacts) and above 90Hz (high-frequency noise). Second, the cleaned signal is cut into overlapping 200-sample windows — each representing one second of muscle activity — with 50-sample steps between windows. This sliding window approach gives the classifier a fresh snapshot of the forearm roughly every 250ms.",
    callout: null,
  },
  {
    num: "05",
    tag: "Machine learning",
    title: "Teaching a computer to read gestures",
    body: "Raw waveforms are hard to classify directly — they vary too much between people, sessions, and electrode placements. Instead, myojam extracts four time-domain features from each of the 16 electrode channels per window: Mean Absolute Value (average signal energy), Root Mean Square (signal power), Zero Crossing rate (frequency content proxy), and Waveform Length (signal complexity). This compresses each window into a 64-number vector that captures the essential character of the muscle activation pattern. A Random Forest classifier — an ensemble of 500 decision trees — then maps that vector to one of 6 gesture classes. Trained on 16,269 labelled windows from 10 subjects in the public Ninapro DB5 dataset, it achieves 84.85% cross-subject accuracy.",
    callout: "Cross-subject accuracy matters because it tests whether the model works on people it has never seen before — a much harder and more realistic challenge than testing on the same people it trained on.",
  },
  {
    num: "06",
    tag: "The bigger picture",
    title: "EMG as assistive technology",
    body: "For people with limited hand or arm mobility — from spinal cord injuries to ALS to stroke — traditional input devices like keyboards and mice can be inaccessible or impossible to use. EMG-based interfaces offer an alternative: control a computer through subtle muscle contractions that don't require fine motor control or physical contact with a device. Commercial prosthetic hands have used EMG control for decades. What myojam explores is whether the same principle — read muscles, infer intent, execute action — can be made accessible, affordable, and open-source for broader assistive technology applications.",
    callout: null,
  },
  {
    num: "07",
    tag: "The future",
    title: "Where this technology is going",
    body: "Consumer EMG is still early. Current limitations include electrode placement variability (signals differ every time you put them on), cross-talk between muscles, and the need for per-user calibration. Research directions include deep learning models that adapt to individual users in real time, higher-density electrode arrays that resolve finer finger movements, and dry electrodes that don't require conductive gel. As hardware improves and machine learning matures, EMG interfaces have the potential to become a mainstream assistive modality — and possibly a general-purpose input method for everyone.",
    callout: "myojam is a starting point: a working, open-source proof of concept showing that affordable EMG gesture classification is possible today with off-the-shelf hardware and public datasets.",
  },
]

export default function Education() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "120px 32px 80px" }}>

        {/* Header */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "var(--accent-soft)", border: "1px solid rgba(255,45,120,0.15)",
          borderRadius: 100, padding: "5px 16px",
          fontSize: 13, color: "var(--accent)", fontWeight: 500, marginBottom: 32
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }}/>
          Educational resource
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 600,
          letterSpacing: "-2px", lineHeight: 1.05, marginBottom: 28, color: "var(--text)"
        }}>
          The science behind<br />
          <span style={{ color: "var(--accent)" }}>muscle-computer interfaces.</span>
        </h1>

        <p style={{
          fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.75,
          fontWeight: 300, marginBottom: 72
        }}>
          How does a computer know which finger you're flexing? What is EMG,
          and what role does consumer hardware like the MyoWare 2.0 play in making
          assistive technology more accessible? This page explains the full picture —
          from the biology of muscle signals to the machine learning that classifies them.
        </p>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {SECTIONS.map((s, i) => (
            <div key={s.num} style={{
              padding: "48px 0",
              borderBottom: i < SECTIONS.length - 1 ? "1px solid var(--border)" : "none"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "var(--accent-soft)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 600, color: "var(--accent)", flexShrink: 0
                }}>{s.num}</div>
                <span style={{
                  fontSize: 11, fontWeight: 500, color: "var(--accent)",
                  textTransform: "uppercase", letterSpacing: "0.06em"
                }}>{s.tag}</span>
              </div>

              <h2 style={{
                fontSize: 22, fontWeight: 600, color: "var(--text)",
                letterSpacing: "-0.4px", marginBottom: 16
              }}>{s.title}</h2>

              <p style={{
                fontSize: 15, color: "var(--text-secondary)",
                lineHeight: 1.8, fontWeight: 300, marginBottom: s.callout ? 24 : 0
              }}>{s.body}</p>

              {s.callout && (
                <div style={{
                  background: "var(--accent-soft)",
                  border: "1px solid rgba(255,45,120,0.15)",
                  borderLeft: "3px solid var(--accent)",
                  borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                  padding: "16px 20px"
                }}>
                  <p style={{
                    fontSize: 13, color: "var(--text-secondary)",
                    lineHeight: 1.7, fontWeight: 400, margin: 0
                  }}>{s.callout}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 64, background: "var(--bg-secondary)",
          borderRadius: "var(--radius)", padding: "40px",
          border: "1px solid var(--border)", textAlign: "center"
        }}>
          <h3 style={{
            fontSize: 20, fontWeight: 600, color: "var(--text)",
            letterSpacing: "-0.3px", marginBottom: 12
          }}>See it running live</h3>
          <p style={{
            fontSize: 14, color: "var(--text-secondary)",
            lineHeight: 1.7, fontWeight: 300, marginBottom: 24, maxWidth: 400, margin: "0 auto 24px"
          }}>
            No hardware needed. Load real EMG data from the Ninapro dataset and watch
            the classifier predict gestures in real time.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/demo")} style={{
              background: "var(--accent)", color: "#fff", border: "none",
              borderRadius: 100, padding: "13px 32px", fontSize: 15,
              fontFamily: "var(--font)", fontWeight: 500, cursor: "pointer",
              boxShadow: "0 4px 24px rgba(255,45,120,0.3)"
            }}>Try the demo</button>
            <button onClick={() => navigate("/how-it-works")} style={{
              background: "transparent", color: "var(--text)",
              border: "1px solid var(--border-mid)", borderRadius: 100,
              padding: "13px 28px", fontSize: 15,
              fontFamily: "var(--font)", fontWeight: 400, cursor: "pointer"
            }}>Technical details</button>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}