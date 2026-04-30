import { useNavigate } from "react-router-dom"

const SOCIALS = [
  { icon:"fab fa-github",      href:"https://github.com/Jaden300/myojam",   label:"GitHub"    },
  { icon:"fab fa-linkedin-in", href:"https://linkedin.com/in/jaden-wong09", label:"LinkedIn"  },
  { icon:"fab fa-instagram",   href:"https://instagram.com/YOUR_HANDLE",    label:"Instagram" },
  { icon:"fab fa-x-twitter",   href:"https://x.com/YOUR_HANDLE",            label:"X"         },
  { icon:"fab fa-youtube",     href:"https://youtube.com/YOUR_CHANNEL",     label:"YouTube"   },
  { icon:"fab fa-tiktok",      href:"https://tiktok.com/@YOUR_HANDLE",     label:"TikTok"    },
]

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer style={{ borderTop:"1px solid var(--border)", background:"var(--bg-secondary)" }}>
      <div style={{ maxWidth:920, margin:"0 auto", padding:"48px 32px" }}>

        {/* Top row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:32, flexWrap:"wrap", marginBottom:40 }}>
          {/* Brand */}
          <div>
            <div onClick={()=>navigate("/")} style={{ fontSize:20, fontWeight:700, color:"var(--text)", letterSpacing:"-0.5px", marginBottom:8, cursor:"pointer" }}>myojam</div>
            <p style={{ fontSize:13, color:"var(--text-tertiary)", fontWeight:300, lineHeight:1.7, maxWidth:280, margin:0 }}>
              An open educational platform for learning EMG signal processing, gesture classification, and assistive technology.
            </p>
          </div>

          {/* Links */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px 40px" }}>
            {[
              ["Home",            "/"],
              ["Education hub",   "/education"],
              ["For educators",   "/educators"],
              ["Interactive tools","/demos"],
              ["About",           "/about"],
              ["Mission",         "/mission"],
              ["How it works",    "/how-it-works"],
              ["Research",        "/research"],
              ["Resources",       "/resources"],
              ["Blog",            "/blog"],
              ["Changelog",       "/changelog"],
            ].map(([label, path])=>(
              <span key={path} onClick={()=>navigate(path)} style={{ fontSize:13, color:"var(--text-tertiary)", fontWeight:300, cursor:"pointer", transition:"color 0.15s", whiteSpace:"nowrap" }}
                onMouseEnter={e=>e.currentTarget.style.color="var(--accent)"}
                onMouseLeave={e=>e.currentTarget.style.color="var(--text-tertiary)"}
              >{label}</span>
            ))}
          </div>
        </div>

        {/* Social icons */}
        <div style={{ display:"flex", gap:8, marginBottom:32 }}>
          {SOCIALS.map(s=>(
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label} style={{
              width:36, height:36, borderRadius:"50%",
              border:"1px solid var(--border)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"var(--text-tertiary)", fontSize:14, textDecoration:"none",
              transition:"all 0.2s"
            }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.color="var(--accent)"; e.currentTarget.style.transform="translateY(-3px)" }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text-tertiary)"; e.currentTarget.style.transform="translateY(0)" }}
            ><i className={s.icon}/></a>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, paddingTop:24, borderTop:"1px solid var(--border)" }}>
          <span style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300 }}>
            © 2026 myojam. MIT License.
          </span>
          <div style={{ display:"flex", gap:20 }}>
            <span onClick={()=>navigate("/privacy")} style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300, cursor:"pointer", transition:"color 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.color="var(--text)"}
              onMouseLeave={e=>e.currentTarget.style.color="var(--text-tertiary)"}
            >Privacy Policy</span>
            <span onClick={()=>navigate("/terms")} style={{ fontSize:12, color:"var(--text-tertiary)", fontWeight:300, cursor:"pointer", transition:"color 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.color="var(--text)"}
              onMouseLeave={e=>e.currentTarget.style.color="var(--text-tertiary)"}
            >Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}