import { useState, useRef, useEffect } from "react"

const API = import.meta.env.VITE_API_URL

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm the myojam assistant. Ask me anything about the project, setup, or how it works." }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const newMessages = [...messages, { role: "user", content: text }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now." }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 200,
          width: 52, height: 52, borderRadius: "50%",
          background: "var(--accent)", border: "none",
          boxShadow: "0 4px 24px rgba(255,45,120,0.4)",
          cursor: "pointer", fontSize: 22,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s"
        }}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 88, right: 24, zIndex: 200,
          width: 340, height: 480,
          background: "var(--bg)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", boxShadow: "0 8px 48px rgba(0,0,0,0.12)",
          display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 10
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: "var(--accent)"
            }}/>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>myojam assistant</span>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "16px",
            display: "flex", flexDirection: "column", gap: 10
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "82%",
                background: m.role === "user" ? "var(--accent)" : "var(--bg-secondary)",
                color: m.role === "user" ? "#fff" : "var(--text)",
                borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding: "10px 14px", fontSize: 13, lineHeight: 1.6, fontWeight: 300
              }}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: "flex-start", background: "var(--bg-secondary)",
                borderRadius: "16px 16px 16px 4px", padding: "10px 14px",
                fontSize: 13, color: "var(--text-tertiary)"
              }}>…</div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 14px", borderTop: "1px solid var(--border)",
            display: "flex", gap: 8
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask something…"
              style={{
                flex: 1, background: "var(--bg-secondary)",
                border: "1px solid var(--border)", borderRadius: 100,
                padding: "8px 14px", fontSize: 13,
                fontFamily: "var(--font)", color: "var(--text)", outline: "none"
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: "var(--accent)", color: "#fff", border: "none",
                borderRadius: "50%", width: 34, height: 34,
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: 14, opacity: loading || !input.trim() ? 0.5 : 1
              }}
            >↑</button>
          </div>
        </div>
      )}
    </>
  )
}