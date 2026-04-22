import { useState, useRef, useEffect } from "react"
import { motion } from "motion/react"

const API = import.meta.env.VITE_API_URL

const STARTERS = [
  "What is myojam?",
  "How does it work?",
  "Do I need hardware?",
  "Is it free?",
]

// Shining "Thinking…" text while waiting for response
function ThinkingText() {
  return (
    <motion.span
      style={{
        background: "linear-gradient(110deg, #888 30%, #fff 50%, #888 70%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontSize: 13,
        fontWeight: 400,
      }}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
    >
      Thinking…
    </motion.span>
  )
}

// Streams text character-by-character
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
    }, 8)
    return () => clearInterval(interval)
  }, [text])

  return <span>{displayed}{!done && <span style={{ opacity: 0.35 }}>▍</span>}</span>
}

// Clean minimal chat bubble icon
function ChatIcon({ size = 20, color = "white" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M3 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7l-4 3V4z"
        fill={color}
        fillOpacity={0.9}
      />
    </svg>
  )
}

// Send arrow icon
function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 2L7.5 13M7.5 2L3 6.5M7.5 2L12 6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm the myojam assistant. Ask me anything about the project, how it works, or how to get started." }
  ])
  const [showStarters, setShowStarters] = useState(true)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) {
      setVisible(true)
    } else {
      const t = setTimeout(() => setVisible(false), 180)
      return () => clearTimeout(t)
    }
  }, [open])

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
      setMessages(prev => [...prev, { role: "assistant", content: "Having trouble connecting right now. Please try again in a moment." }])
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @keyframes chatOpen {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes chatClose {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to   { opacity: 0; transform: scale(0.94) translateY(10px); }
        }
        .chat-input::placeholder { color: var(--text-tertiary); }
        .chat-input:focus { outline: none; border-color: var(--accent) !important; }
        .starter-btn:hover { background: rgba(255,45,120,0.1) !important; }
      `}</style>

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        title={open ? "Close chat" : "Ask myojam assistant"}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 200,
          width: 48, height: 48, borderRadius: "50%",
          background: open ? "#333" : "var(--accent)",
          border: "none", cursor: "pointer", padding: 0,
          boxShadow: open
            ? "0 2px 12px rgba(0,0,0,0.25)"
            : "0 4px 20px rgba(255,45,120,0.35)",
          transition: "background 0.2s, box-shadow 0.2s, transform 0.15s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {open
          ? <span style={{ color: "white", fontSize: 16, lineHeight: 1 }}>✕</span>
          : <ChatIcon size={20} color="white" />
        }
      </button>

      {/* Chat window */}
      {visible && (
        <div style={{
          position: "fixed", bottom: 84, right: 24, zIndex: 200,
          width: 348, height: 480,
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          boxShadow: "0 12px 48px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          transformOrigin: "bottom right",
          animation: open
            ? "chatOpen 0.18s cubic-bezier(0.34,1.4,0.64,1) forwards"
            : "chatClose 0.18s ease forwards",
        }}>

          {/* Header */}
          <div style={{
            padding: "14px 16px",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <ChatIcon size={16} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.2px" }}>
                  myojam assistant
                </div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 300 }}>
                  Powered by GPT-4o mini
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px 14px 8px",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "84%",
                background: m.role === "user" ? "var(--accent)" : "var(--bg-secondary)",
                color: m.role === "user" ? "#fff" : "var(--text)",
                borderRadius: m.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                padding: "9px 13px",
                fontSize: 13, lineHeight: 1.6, fontWeight: 300,
              }}>
                {m.role === "assistant" && i === messages.length - 1
                  ? <StreamingText text={m.content} />
                  : m.content
                }
              </div>
            ))}

            {/* Thinking state - shining text */}
            {loading && (
              <div style={{
                alignSelf: "flex-start",
                background: "var(--bg-secondary)",
                borderRadius: "14px 14px 14px 3px",
                padding: "10px 14px",
              }}>
                <ThinkingText />
              </div>
            )}

            {/* Starter prompts */}
            {showStarters && !loading && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {STARTERS.map(s => (
                  <button
                    key={s}
                    className="starter-btn"
                    onClick={() => send(s)}
                    style={{
                      background: "var(--accent-soft)",
                      border: "1px solid rgba(255,45,120,0.18)",
                      borderRadius: 100, padding: "5px 11px",
                      fontSize: 12, color: "var(--accent)", fontWeight: 400,
                      cursor: "pointer", fontFamily: "var(--font)",
                      transition: "background 0.15s",
                    }}
                  >{s}</button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid var(--border)",
            display: "flex", gap: 8, alignItems: "center",
          }}>
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask something…"
              style={{
                flex: 1,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 100,
                padding: "8px 14px",
                fontSize: 13,
                fontFamily: "var(--font)",
                color: "var(--text)",
                transition: "border-color 0.15s",
              }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                background: "var(--accent)",
                border: "none", borderRadius: "50%",
                width: 32, height: 32, flexShrink: 0,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.35 : 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "opacity 0.15s, transform 0.15s",
              }}
              onMouseEnter={e => { if (!loading && input.trim()) e.currentTarget.style.transform = "scale(1.1)" }}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <SendIcon />
            </button>
          </div>

        </div>
      )}
    </>
  )
}
