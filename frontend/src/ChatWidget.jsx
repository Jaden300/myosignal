import { useState, useRef, useEffect } from "react"

const API = import.meta.env.VITE_API_URL

const STARTERS = [
  "What is myojam?",
  "How do I use it?",
  "Do I need special hardware?",
  "Is it free?",
]

function SillyFace({ blinking }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" fill="#FF2D78"/>
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
      <path d="M9 17.5 Q14 22 19 17.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="7" cy="16" r="2" fill="rgba(255,255,255,0.25)"/>
      <circle cx="21" cy="16" r="2" fill="rgba(255,255,255,0.25)"/>
    </svg>
  )
}

function StreamingText({ text }) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  const idx = useRef(0)

  useEffect(() => {
    idx.current = 0
    setDisplayed("")
    setDone(false)
    if (!text) return
    const interval = setInterval(() => {
      idx.current++
      setDisplayed(text.slice(0, idx.current))
      if (idx.current >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, 8) // ~125 chars/sec  -  fast but visible
    return () => clearInterval(interval)
  }, [text])

  return <span>{displayed}{!done && <span style={{ opacity: 0.4 }}>▍</span>}</span>
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! 👋 I'm the myojam assistant. Ask me anything about the project, setup, or how it works!" }
  ])
  const [showStarters, setShowStarters] = useState(true)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [blinking, setBlinking] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) {
      setVisible(true)
    } else {
      const t = setTimeout(() => setVisible(false), 150)
      return () => clearTimeout(t)
    }
  }, [open])

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
  }, [messages, loading])

  async function send(text) {
    text = (text || input).trim()
    if (!text || loading) return
    setShowStarters(false)
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
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1; }
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
          transition: "transform 0.2s ease",
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
          width: 340, height: 500,
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
                {/* Stream only the latest assistant message */}
                {m.role === "assistant" && i === messages.length - 1
                  ? <StreamingText text={m.content} />
                  : m.content
                }
              </div>
            ))}

            {loading && (
              <div style={{
                alignSelf: "flex-start", background: "var(--bg-secondary)",
                borderRadius: "16px 16px 16px 4px", padding: "12px 16px",
                display: "flex", gap: 4
              }}>
                {[0, 0.15, 0.3].map((delay, i) => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "var(--accent)",
                    animation: `dotBounce 1s ${delay}s infinite`
                  }}/>
                ))}
              </div>
            )}

            {/* Starter prompts  -  only shown before first user message */}
            {showStarters && !loading && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {STARTERS.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    background: "var(--accent-soft)",
                    border: "1px solid rgba(255,45,120,0.2)",
                    borderRadius: 100, padding: "6px 12px",
                    fontSize: 12, color: "var(--accent)", fontWeight: 400,
                    cursor: "pointer", fontFamily: "var(--font)",
                    transition: "background 0.15s"
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,45,120,0.12)"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--accent-soft)"}
                  >{s}</button>
                ))}
              </div>
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
                fontFamily: "var(--font)", color: "var(--text)", outline: "none",
                transition: "border-color 0.15s"
              }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <button
              onClick={() => send()}
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