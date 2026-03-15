import { useNavigate, useLocation } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const links = [
    ["Home", "/"],
    ["How It Works", "/how-it-works"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ]

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      borderBottom: "1px solid var(--border)",
      background: "rgba(7,7,10,0.92)",
      backdropFilter: "blur(16px)",
      height: 58, padding: "0 40px",
      display: "flex", alignItems: "center", justifyContent: "space-between"
    }}>
      <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <span style={{
          fontFamily: "var(--font)", fontWeight: 800,
          fontSize: 18, letterSpacing: "-0.5px"
        }}>
          MYO<span style={{ color: "var(--accent)" }}>METRO</span>
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {links.map(([label, path]) => (
          <span key={label} onClick={() => navigate(path)} style={{
            fontFamily: "var(--mono)", fontSize: 11,
            letterSpacing: "0.08em", cursor: "pointer",
            color: pathname === path ? "var(--accent)" : "var(--text2)",
            transition: "color 0.15s",
            borderBottom: pathname === path ? "1px solid var(--accent)" : "1px solid transparent",
            paddingBottom: 2
          }}>{label.toUpperCase()}</span>
        ))}
        <a href="https://github.com/Jaden300/myosignal"
          target="_blank" rel="noreferrer"
          style={{
            fontFamily: "var(--mono)", fontSize: 11,
            letterSpacing: "0.08em", color: "var(--text2)",
            textDecoration: "none"
          }}>GITHUB ↗</a>
        <button onClick={() => navigate("/demo")} style={{
          background: "var(--accent)", color: "#000",
          border: "none", borderRadius: 4,
          padding: "7px 16px", fontSize: 12,
          fontFamily: "var(--mono)", fontWeight: 700,
          letterSpacing: "0.06em", cursor: "pointer"
        }}>OPEN DEMO →</button>
      </div>
    </nav>
  )
}