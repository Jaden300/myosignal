import { useState } from "react"

const API = import.meta.env.VITE_API_URL

const inputStyle = {
  width: "100%",
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 14,
  color: "var(--text)",
  fontFamily: "var(--font)",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
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
  const [status, setStatus] = useState("idle") // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("")

  function set(key) {
    return e => setFields(f => ({ ...f, [key]: e.target.value }))
  }

  function focusBorder(e) { e.target.style.borderColor = "var(--accent)" }
  function blurBorder(e)  { e.target.style.borderColor = "var(--border)"  }

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
      <div style={{ padding, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12, color: "var(--accent)" }}>✓</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
          Message sent
        </div>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 300, margin: 0 }}>
          We'll get back to you shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding, display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Honeypot - invisible to humans, filled by bots */}
      <input
        type="text"
        name="website"
        value={fields.website}
        onChange={set("website")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden", opacity: 0 }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <input
          required
          type="text"
          placeholder={namePlaceholder}
          value={fields.name}
          onChange={set("name")}
          style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
        <input
          required
          type="email"
          placeholder={emailPlaceholder}
          value={fields.email}
          onChange={set("email")}
          style={inputStyle}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </div>

      {showMessage && (
        <textarea
          required
          placeholder={messagePlaceholder}
          value={fields.message}
          onChange={set("message")}
          rows={5}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      )}

      {status === "error" && (
        <p style={{ fontSize: 13, color: "#ef4444", margin: 0, fontWeight: 400 }}>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          alignSelf: "flex-start",
          background: "var(--accent)",
          color: "#fff",
          border: "none",
          borderRadius: 100,
          padding: "11px 28px",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "var(--font)",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          opacity: status === "loading" ? 0.7 : 1,
          boxShadow: "0 4px 14px rgba(255,45,120,0.28)",
          transition: "transform 0.15s, box-shadow 0.15s, opacity 0.15s",
        }}
        onMouseEnter={e => { if (status !== "loading") { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,45,120,0.4)" } }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(255,45,120,0.28)" }}
      >
        {status === "loading" ? "Sending…" : submitLabel}
      </button>
    </form>
  )
}
