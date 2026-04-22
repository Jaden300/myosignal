import { useState, useEffect, useRef } from "react"
import { IconLink } from "./Icons"

function HeartBurst({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 900)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 400,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <style>{`
        @keyframes heartPop {
          0%   { transform: scale(0);   opacity: 1; }
          50%  { transform: scale(1.4); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes heartFloat {
          0%   { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-80px) scale(0.5); opacity: 0; }
        }
      `}</style>
      <div style={{ position: "relative", width: 0, height: 0 }}>
        {/* Big central heart */}
        <div style={{
          position: "absolute", fontSize: 80, color: "#FF2D78",
          transform: "translate(-50%, -50%)",
          animation: "heartPop 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards"
        }}>♥</div>
        {/* Floating mini hearts */}
        {[[-40,-30],[ 40,-20],[-20,-60],[30,-55],[0,-20],[-50,10],[50,5]].map(([x,y], i) => (
          <div key={i} style={{
            position: "absolute", fontSize: 16 + Math.random() * 12,
            color: "#FF2D78", opacity: 0,
            left: x, top: y,
            animation: `heartFloat 0.8s ${i * 0.06}s ease-out forwards`
          }}>♥</div>
        ))}
      </div>
    </div>
  )
}

function ShareModal({ url, title, onClose }) {
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const modalBtnStyle = {
    display: "flex", alignItems: "center", gap: 12,
    background: "var(--bg-secondary)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)", padding: "14px 16px",
    cursor: "pointer", fontFamily: "var(--font)", width: "100%",
    transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease",
    textAlign: "left",
  }

  function btnHover(e) {
    e.currentTarget.style.transform = "scale(1.02)"
    e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,45,120,0.1)"
    e.currentTarget.style.borderColor = "rgba(255,45,120,0.25)"
  }
  function btnLeave(e) {
    e.currentTarget.style.transform = "scale(1)"
    e.currentTarget.style.boxShadow = "none"
    e.currentTarget.style.borderColor = "var(--border)"
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--bg)", borderRadius: "var(--radius)",
        border: "1px solid var(--border)", padding: "32px",
        width: 340, boxShadow: "0 16px 64px rgba(0,0,0,0.15)",
        animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>Share this article</span>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: 18,
            color: "var(--text-tertiary)", cursor: "pointer", lineHeight: 1,
            transition: "transform 0.15s", borderRadius: "50%", width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={copyLink} style={{
            ...modalBtnStyle,
            background: copied ? "var(--accent-soft)" : "var(--bg-secondary)",
            border: `1px solid ${copied ? "rgba(255,45,120,0.2)" : "var(--border)"}`,
          }}
            onMouseEnter={btnHover} onMouseLeave={btnLeave}
          >
            <span style={{ fontSize: 20, display:"flex", alignItems:"center" }}>{copied ? "✓" : <IconLink size={18} />}</span>
            <span style={{ fontSize: 14, color: copied ? "var(--accent)" : "var(--text)" }}>
              {copied ? "Link copied!" : "Copy article link"}
            </span>
          </button>

          <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank")}
            style={modalBtnStyle} onMouseEnter={btnHover} onMouseLeave={btnLeave}
          >
            <span style={{ fontSize: 20 }}>𝕏</span>
            <span style={{ fontSize: 14, color: "var(--text)" }}>Share on X / Twitter</span>
          </button>

          <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")}
            style={modalBtnStyle} onMouseEnter={btnHover} onMouseLeave={btnLeave}
          >
            <span style={{ fontSize: 20 }}>in</span>
            <span style={{ fontSize: 14, color: "var(--text)" }}>Share on LinkedIn</span>
          </button>

          {navigator.share && (
            <button onClick={() => navigator.share({ title, url })}
              style={modalBtnStyle} onMouseEnter={btnHover} onMouseLeave={btnLeave}
            >
              <span style={{ fontSize: 20 }}>↗</span>
              <span style={{ fontSize: 14, color: "var(--text)" }}>More (iMessage, Instagram…)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function CiteModal({ citation, onClose }) {
  const [copied, setCopied] = useState(false)

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--bg)", borderRadius: "var(--radius)",
        border: "1px solid var(--border)", padding: "32px",
        width: 440, boxShadow: "0 16px 64px rgba(0,0,0,0.15)",
        animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>Cite this article</span>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: 18,
            color: "var(--text-tertiary)", cursor: "pointer",
            transition: "transform 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >✕</button>
        </div>
        <div style={{
          background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)", padding: "16px", marginBottom: 16
        }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>APA 7th edition</div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, fontWeight: 300, margin: 0, fontFamily: "monospace" }}>
            {citation.apa}
          </p>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(citation.apa); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          style={{
            width: "100%", background: copied ? "var(--accent-soft)" : "var(--accent)",
            color: copied ? "var(--accent)" : "#fff",
            border: copied ? "1px solid rgba(255,45,120,0.2)" : "none",
            borderRadius: 100, padding: "11px",
            fontFamily: "var(--font)", fontSize: 14, fontWeight: 500,
            cursor: "pointer", transition: "all 0.2s, transform 0.15s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {copied ? "✓ Copied to clipboard" : "Copy citation"}
        </button>
      </div>
    </div>
  )
}

export default function ArticleBar({ url, title, citation, presetLikes, storageKey }) {
  const [showShare, setShowShare] = useState(false)
  const [showCite, setShowCite] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(presetLikes)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored === "true") { setLiked(true); setLikes(presetLikes + 1) }
  }, [])

  function toggleLike() {
    const next = !liked
    setLiked(next)
    setLikes(next ? presetLikes + 1 : presetLikes)
    localStorage.setItem(storageKey, next ? "true" : "false")
    if (next) setBurst(true)
  }

  const btnStyle = {
    display: "flex", alignItems: "center", gap: 8,
    background: "var(--bg-secondary)", border: "1px solid var(--border)",
    borderRadius: 12, padding: "10px 16px",
    cursor: "pointer", fontFamily: "var(--font)",
    fontSize: 13, color: "var(--text-secondary)", fontWeight: 400,
    transition: "all 0.15s, transform 0.15s",
  }

  function barHover(e) { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.borderColor = "rgba(255,45,120,0.3)" }
  function barLeave(e) { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "var(--border)" }

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
        <button onClick={toggleLike} style={{
          ...btnStyle,
          background: liked ? "var(--accent-soft)" : "var(--bg-secondary)",
          border: liked ? "1px solid rgba(255,45,120,0.2)" : "1px solid var(--border)",
          color: liked ? "var(--accent)" : "var(--text-secondary)",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06)"; if (!liked) e.currentTarget.style.borderColor = "rgba(255,45,120,0.3)" }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; if (!liked) e.currentTarget.style.borderColor = "var(--border)" }}
        >
          <span style={{ fontSize: 16, transition: "transform 0.2s", display: "inline-block" }}>{liked ? "♥" : "♡"}</span>
          <span>{likes} {likes === 1 ? "like" : "likes"}</span>
        </button>

        <button onClick={() => setShowShare(true)} style={btnStyle} onMouseEnter={barHover} onMouseLeave={barLeave}>
          <span style={{ fontSize: 16 }}>↗</span><span>Share</span>
        </button>

        <button onClick={() => setShowCite(true)} style={btnStyle} onMouseEnter={barHover} onMouseLeave={barLeave}>
          <span style={{ fontSize: 16 }}>❝</span><span>Cite</span>
        </button>
      </div>

      {burst && <HeartBurst onDone={() => setBurst(false)} />}
      {showShare && <ShareModal url={url} title={title} onClose={() => setShowShare(false)} />}
      {showCite && <CiteModal citation={citation} onClose={() => setShowCite(false)} />}
    </>
  )
}