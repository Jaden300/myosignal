import { useNavigate } from "react-router-dom"

const SOCIALS = [
  { icon: "fab fa-instagram",  href: "https://instagram.com/YOUR_HANDLE",   label: "Instagram" },
  { icon: "fab fa-linkedin-in",href: "https://linkedin.com/in/jaden-wong09", label: "LinkedIn" },
  { icon: "fab fa-x-twitter",  href: "https://x.com/YOUR_HANDLE",           label: "X" },
  { icon: "fab fa-youtube",    href: "https://youtube.com/YOUR_CHANNEL",     label: "YouTube" },
  { icon: "fab fa-github",     href: "https://github.com/Jaden300",         label: "GitHub" },
  { icon: "fab fa-tiktok",     href: "https://tiktok.com/@YOUR_HANDLE",     label: "TikTok" },
]

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "48px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>

          {/* Wordmark */}
          <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 300 }}>
            © 2026 Jaden Wong · Toronto, Ontario
          </div>

          {/* Social icons */}
          <div style={{ display: "flex", gap: 8 }}>
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                title={s.label}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-tertiary)", fontSize: 14,
                  transition: "border-color 0.2s, color 0.2s, transform 0.2s, background 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--gold)"
                  e.currentTarget.style.color = "var(--gold)"
                  e.currentTarget.style.transform = "translateY(-3px)"
                  e.currentTarget.style.background = "var(--gold-soft)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border)"
                  e.currentTarget.style.color = "var(--text-tertiary)"
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.background = "transparent"
                }}
              >
                <i className={s.icon}/>
              </a>
            ))}
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", gap: 24 }}>
            {[["myojam","https://myojam.com"],["Research","/research"]].map(([label, href]) => (
              href.startsWith("http")
                ? <a key={label} href={href} target="_blank" rel="noreferrer" className="ink-line" style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 300 }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-tertiary)"}
                  >{label}</a>
                : <span key={label} onClick={() => navigate(href)} className="ink-line" style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 300, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-tertiary)"}
                  >{label}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}