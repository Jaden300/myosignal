import { useState, useRef, useEffect } from "react"

const API = import.meta.env.VITE_API_URL

function SillyFace({ blinking }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" fill="#FF2D78"/>
      {/* Eyes */}
      {blinking ? (
        <>
          <rect x="7.5" y="12" width="4" height="1.5" rx="1" fill="white"/>
          <rect x="16.5" y="12" width="4" height="1.5" rx="1" fill="white"/>
        </>
      ) : (
        <>
          <circle cx="9.5" cy="12.5" r="2" fill="white"/>
          <circle cx="18.5" cy="12.5" r="2" fill="white"/>
          <circle cx="10" cy="12.5" r="1" fill="#1D1D1F"/>
          <circle cx="19" cy="12.5" r="1" fill="#1D1D1F"/>
        </>
      )}
      {/* Smile */}
      <path d="M9 17.5 Q14 22 19 17.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Rosy cheeks */}
      <circle cx="7" cy="16" r="2" fill="rgba(255,255,255,0.25)"/>
      <circle cx="21" cy="16" r="2" fill="rgba(255,255,255,0.25)"/>
    </svg>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! 👋 I'm the myojam assistant. Ask me anything about the project, setup, or how it works!" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [blinking, setBlinking] = useState(false)
  const bottomRef = useRef(null)

  // Handle open/close animation
  useEffect(() => {
    if (open) {
      setVisible(true)
    } else {
      const t = setTimeout(() => setVisible(false), 150)
      return () => clearTimeout(t)
    }
  }, [open])

  // Random blink
  useEffect(() => {
    const blink = () => {
      setBlinking(true)
      setTimeout(() => setBlinking(false), 120)
      setTimeout(blink, 2000 + Math.random() * 3000)
    }
    const t = setTimeout(blink, 1500)
    return () => clearTimeout(t)
  }, [])

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
      setMessages(prev => [...prev, { role: "assistant", content: "Oops, having trouble connecting right now. Try again in a sec!" }])
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @keyframes chatOpen {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes chatClose {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to   { opacity: 0; transform: scale(0.92) translateY(12px); }
        }
        @keyframes popIn {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 200,
          width: 52, height: 52, borderRadius: "50%",
          background: "transparent", border: "none",
          cursor: "pointer", padding: 0,
          boxShadow: "0 4px 24px rgba(255,45,120,0.4)",
          borderRadius: "50%",
          animation: open ? "none" : "popIn 0.3s ease",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {open
          ? <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "var(--accent)", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 18, color: "white"
            }}>✕</div>
          : <SillyFace blinking={blinking} />
        }
      </button>

      {/* Chat window */}
      {visible && (
        <div style={{
          position: "fixed", bottom: 88, right: 24, zIndex: 200,
          width: 340, height: 480,
          background: "var(--bg)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", boxShadow: "0 8px 48px rgba(0,0,0,0.12)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          transformOrigin: "bottom right",
          animation: open
            ? "chatOpen 0.15s cubic-bezier(0.34,1.56,0.64,1) forwards"
            : "chatClose 0.15s ease forwards",
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 10,
            background: "var(--bg)"
          }}>
            <SillyFace blinking={blinking} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>myojam assistant</div>
              <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 300 }}>always here to help ✦</div>
            </div>
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
                borderRadius: "16px 16px 16px 4px", padding: "10px 16px",
                fontSize: 18, letterSpacing: 2
              }}>
                <span style={{ animation: "popIn 0.8s infinite" }}>·</span>
                <span style={{ animation: "popIn 0.8s 0.15s infinite" }}>·</span>
                <span style={{ animation: "popIn 0.8s 0.3s infinite" }}>·</span>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 14px", borderTop: "1px solid var(--border)",
            display: "flex", gap: 8, background: "var(--bg)"
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
                fontFamily: "var(--font)", color: "var(--text)", outline: "none",
                transition: "border-color 0.15s"
              }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: "var(--accent)", color: "#fff", border: "none",
                borderRadius: "50%", width: 34, height: 34, flexShrink: 0,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                fontSize: 14, opacity: loading || !input.trim() ? 0.4 : 1,
                transition: "opacity 0.15s, transform 0.15s"
              }}
              onMouseEnter={e => { if (!loading && input.trim()) e.currentTarget.style.transform = "scale(1.1)" }}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >↑</button>
          </div>
        </div>
      )}
    </>
  )
}