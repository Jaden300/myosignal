import { useState } from "react"

const API = import.meta.env.VITE_API_URL
const MSG_MAX = 600

const FORM_STYLES = `
  @keyframes cfPop   { from{transform:scale(0.55);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes cfCheck { to{stroke-dashoffset:0} }
  @keyframes cfSpin  { to{transform:rotate(360deg)} }
  .cf-input::placeholder, .cf-textarea::placeholder { color: var(--text-tertiary); opacity: 0.55; }
  .cf-input::-webkit-input-placeholder, .cf-textarea::-webkit-input-placeholder { color: var(--text-tertiary); opacity: 0.55; }
`

function FieldLabel({ children, focused, required }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.09em",
      textTransform: "uppercase", marginBottom: 7, userSelect: "none",
      color: focused ? "var(--accent)" : "var(--text-tertiary)",
      transition: "color 0.15s",
    }}>
      {children}
      {required && <span style={{ color: "var(--accent)", marginLeft: 3, opacity: 0.7 }}>*</span>}
    </div>
  )
}

function FieldInput({ label, type = "text", required, value, onChange, placeholder, autoComplete }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <FieldLabel focused={focused} required={required}>{label}</FieldLabel>
      <input
        className="cf-input"
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: focused ? "rgba(255,45,120,0.018)" : "var(--bg)",
          border: `1px solid ${focused ? "rgba(255,45,120,0.38)" : "var(--border)"}`,
          borderLeft: `2.5px solid ${focused ? "var(--accent)" : "rgba(0,0,0,0.05)"}`,
          borderRadius: 10,
          padding: "11px 14px 11px 13px",
          fontSize: 14,
          color: "var(--text)",
          fontFamily: "var(--font)",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s, border-left-color 0.15s",
          boxShadow: focused
            ? "0 0 0 3px rgba(255,45,120,0.07), 0 1px 3px rgba(0,0,0,0.06)"
            : "0 1px 2px rgba(0,0,0,0.04)",
        }}
      />
    </div>
  )
}

function FieldTextarea({ label, required, value, onChange, placeholder, rows = 5 }) {
  const [focused, setFocused] = useState(false)
  const count = value.length
  const nearLimit = count > MSG_MAX * 0.8
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <FieldLabel focused={focused} required={required}>{label}</FieldLabel>
        <span style={{
          fontSize: 10, fontFamily: "monospace",
          color: nearLimit ? "var(--accent)" : "var(--text-tertiary)",
          opacity: count === 0 ? 0.45 : 1,
          transition: "color 0.2s, opacity 0.2s",
          marginBottom: 7,
        }}>
          {count}/{MSG_MAX}
        </span>
      </div>
      <textarea
        className="cf-textarea"
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={MSG_MAX}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: focused ? "rgba(255,45,120,0.018)" : "var(--bg)",
          border: `1px solid ${focused ? "rgba(255,45,120,0.38)" : "var(--border)"}`,
          borderLeft: `2.5px solid ${focused ? "var(--accent)" : "rgba(0,0,0,0.05)"}`,
          borderRadius: 10,
          padding: "11px 14px 11px 13px",
          fontSize: 14,
          color: "var(--text)",
          fontFamily: "var(--font)",
          outline: "none",
          boxSizing: "border-box",
          resize: "vertical",
          lineHeight: 1.65,
          minHeight: 120,
          transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s, border-left-color 0.15s",
          boxShadow: focused
            ? "0 0 0 3px rgba(255,45,120,0.07), 0 1px 3px rgba(0,0,0,0.06)"
            : "0 1px 2px rgba(0,0,0,0.04)",
        }}
      />
    </div>
  )
}

function SuccessState({ padding }) {
  return (
    <div style={{ padding, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 18, paddingTop: 44, paddingBottom: 44 }}>
      <div style={{
        width: 58, height: 58, borderRadius: "50%",
        background: "rgba(255,45,120,0.09)",
        border: "1.5px solid rgba(255,45,120,0.22)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "cfPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}>
        <svg width={26} height={26} viewBox="0 0 26 26" fill="none">
          <polyline
            points="4,13 10,19 22,7"
            stroke="var(--accent)" strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={44} strokeDashoffset={44}
            style={{ animation: "cfCheck 0.38s 0.28s cubic-bezier(0.4,0,0.2,1) forwards" }}
          />
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 6, letterSpacing: "-0.3px" }}>
          Message sent
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.65 }}>
          We'll get back to you shortly.
        </div>
      </div>
    </div>
  )
}

export default function ContactForm({
  source = "contact",
  namePlaceholder = "Your name",
  emailPlaceholder = "your@email.com",
  messagePlaceholder = "Your message",
  submitLabel = "Send message",
  showMessage = true,
  padding = "28px 32px",
}) {
  const [fields, setFields] = useState({ name: "", email: "", message: "", website: "" })
  const [status, setStatus] = useState("idle")
  const [errorMsg, setErrorMsg] = useState("")

  function set(key) { return e => setFields(f => ({ ...f, [key]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, source }),
      })
      if (!res.ok) throw new Error()
      setStatus("success")
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <>
        <style>{FORM_STYLES}</style>
        <SuccessState padding={padding} />
      </>
    )
  }

  const isLoading = status === "loading"

  return (
    <>
      <style>{FORM_STYLES}</style>
      <form onSubmit={handleSubmit} style={{ padding, display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Honeypot */}
        <input
          type="text" name="website" value={fields.website} onChange={set("website")}
          tabIndex={-1} autoComplete="off" aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden", opacity: 0 }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FieldInput
            label="Name" required value={fields.name}
            onChange={set("name")} placeholder={namePlaceholder} autoComplete="name"
          />
          <FieldInput
            label="Email" type="email" required value={fields.email}
            onChange={set("email")} placeholder={emailPlaceholder} autoComplete="email"
          />
        </div>

        {showMessage && (
          <FieldTextarea
            label="Message" required value={fields.message}
            onChange={set("message")} placeholder={messagePlaceholder}
          />
        )}

        {status === "error" && (
          <div style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "10px 14px",
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.18)",
            borderLeft: "2.5px solid #ef4444",
            borderRadius: 10,
          }}>
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <circle cx={7} cy={7} r={6} stroke="#ef4444" strokeWidth={1.5}/>
              <line x1={7} y1={4} x2={7} y2={7.5} stroke="#ef4444" strokeWidth={1.5} strokeLinecap="round"/>
              <circle cx={7} cy={10} r={0.8} fill="#ef4444"/>
            </svg>
            <span style={{ fontSize: 13, color: "#ef4444", fontWeight: 400 }}>{errorMsg}</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14 }}>
          {!showMessage && (
            <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 300 }}>
              No spam, ever.
            </span>
          )}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: isLoading ? "var(--bg-secondary)" : "var(--accent)",
              color: isLoading ? "var(--text-secondary)" : "#fff",
              border: `1px solid ${isLoading ? "var(--border)" : "transparent"}`,
              borderRadius: 100,
              padding: "11px 28px",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--font)",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 8,
              transition: "transform 0.15s, box-shadow 0.15s, background 0.15s, color 0.15s",
              boxShadow: isLoading ? "none" : "0 4px 14px rgba(255,45,120,0.28)",
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              if (!isLoading) {
                e.currentTarget.style.transform = "scale(1.03)"
                e.currentTarget.style.boxShadow = "0 6px 22px rgba(255,45,120,0.42)"
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.boxShadow = isLoading ? "none" : "0 4px 14px rgba(255,45,120,0.28)"
            }}
          >
            {isLoading ? (
              <>
                <svg
                  width={14} height={14} viewBox="0 0 14 14" fill="none"
                  style={{ animation: "cfSpin 0.75s linear infinite" }}
                >
                  <circle cx={7} cy={7} r={5.5} stroke="currentColor" strokeWidth={1.5}
                    strokeDasharray="22 12" strokeLinecap="round"/>
                </svg>
                Sending…
              </>
            ) : submitLabel}
          </button>
        </div>
      </form>
    </>
  )
}
