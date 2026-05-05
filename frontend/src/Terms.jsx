import Navbar from "./Navbar"
import Footer from "./Footer"
import { Reveal } from "./Animate"
import NeuralNoise from "./components/NeuralNoise"

export default function Terms() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)", padding: "100px 32px 64px" }}>
        <NeuralNoise color={[0.35, 0.35, 0.75]} opacity={0.85} speed={0.0006} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,0,18,0.65)", zIndex: 1 }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 600, letterSpacing: "-1.5px", color: "#fff", marginBottom: 8, lineHeight: 1.1 }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 300, marginBottom: 0 }}>
            Last updated: May 2025
          </p>
        </div>
      </div>

      <Reveal>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px 80px" }}>

          {[
            {
              title: "1. Acceptance",
              body: "By accessing or using myojam (the \"Service\"), you agree to be bound by these Terms. If you do not agree, do not use the Service."
            },
            {
              title: "2. Description of Service",
              body: "myojam is an open-source electromyographic gesture classification platform for research and assistive technology purposes. It includes a web-based demo, desktop applications for macOS, Windows, and Linux, and associated documentation."
            },
            {
              title: "3. Medical Disclaimer",
              body: "myojam is not a medical device and is not approved by Health Canada, the FDA, or any other regulatory body. It is not intended to diagnose, treat, cure, or prevent any medical condition. Do not rely on myojam for medical or safety-critical applications."
            },
            {
              title: "4. Use of the Service",
              body: "You agree to use the Service only for lawful purposes. You may not use the Service in any way that could damage, disable, or impair the Service or interfere with any other party's use of it."
            },
            {
              title: "5. Open Source License",
              body: "The myojam codebase is released under the MIT License. You are free to use, copy, modify, and distribute the code subject to the terms of that license. The MIT License is available in the GitHub repository."
            },
            {
              title: "6. No Warranty",
              body: "The Service is provided \"as is\" without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or accurate."
            },
            {
              title: "7. Limitation of Liability",
              body: "To the maximum extent permitted by law, myojam and its contributors shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Service."
            },
            {
              title: "8. Changes to Terms",
              body: "We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated date. Continued use of the Service after changes constitutes acceptance of the new Terms."
            },
            {
              title: "9. Contact",
              body: "Questions about these Terms can be directed through the Contact page."
            },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: 36 }}>
              <h2 style={{
                fontSize: 17,
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: 10
              }}>
                {section.title}
              </h2>

              <p style={{
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                fontWeight: 300
              }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <Footer />
    </div>
  )
}