import { useNavigate, useLocation } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import Logo from "./Logo"
import { t } from "./i18n"
import { IconGear, IconBook, IconBulb, IconPeople, IconRocket, IconBuilding, IconCode, IconShield } from "./Icons"

function Dropdown({ label, items, pathname }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)
  const active = items.some(([, path]) => pathname === path)
  const timerRef = useRef(null)

  function handleMouseEnter() {
    clearTimeout(timerRef.current)
    setOpen(true)
  }

  function handleMouseLeave() {
    timerRef.current = setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <div ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position:"relative" }}>
      <button style={{
        background:"none", border:"none", cursor:"pointer",
        fontFamily:"var(--font)", fontSize:14, fontWeight:400, padding:0,
        color: active||open ? "var(--accent)" : "var(--text-secondary)",
        display:"flex", alignItems:"center", gap:4, transition:"color 0.15s"
      }}>
        {label}
        <span style={{
          fontSize:9,
          opacity:0.5,
          transform:open?"rotate(180deg)":"rotate(0deg)",
          transition:"transform 0.2s"
        }}>▾</span>
      </button>

      <div style={{
        position:"absolute",
        top:"calc(100% + 10px)",
        left:"50%",
        background:"rgba(255,255,255,0.97)",
        backdropFilter:"blur(20px)",
        border:"1px solid var(--border)",
        borderRadius:14,
        boxShadow:"0 8px 32px rgba(0,0,0,0.09)",
        minWidth:210,
        padding:"6px",
        zIndex:200,
        pointerEvents: open?"auto":"none",
        opacity: open?1:0,
        transform: open
          ? "translateX(-50%) translateY(0) scale(1)"
          : "translateX(-50%) translateY(-6px) scale(0.97)",
        transition:"opacity 0.15s ease, transform 0.15s ease",
      }}>
        {items.map(([label, path, Icon]) => (
          <button
            key={path}
            onClick={() => { navigate(path); setOpen(false) }}
            style={{
              display:"flex", alignItems:"center", gap:10,
              width:"100%", textAlign:"left",
              background: pathname===path ? "var(--accent-soft)" : "none",
              border:"none", borderRadius:10, padding:"9px 14px",
              cursor:"pointer", fontFamily:"var(--font)", fontSize:14,
              color: pathname===path ? "var(--accent)" : "var(--text-secondary)",
              transition:"background 0.12s, color 0.12s"
            }}
            onMouseEnter={e=>{
              if(pathname!==path){
                e.currentTarget.style.background="var(--bg-secondary)"
                e.currentTarget.style.color="var(--text)"
              }
            }}
            onMouseLeave={e=>{
              if(pathname!==path){
                e.currentTarget.style.background="none"
                e.currentTarget.style.color="var(--text-secondary)"
              }
            }}
          >
            <Icon size={15} color={pathname===path?"var(--accent)":"#AEAEB2"} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

function NavLink({ label, path, pathname, accent }) {
  const navigate = useNavigate()

  return (
    <span
      onClick={()=>navigate(path)}
      style={{
        fontSize:14,
        fontWeight: accent?600:400,
        cursor:"pointer",
        color: accent ? "var(--accent)" : pathname===path ? "var(--accent)" : "var(--text-secondary)",
        transition:"color 0.15s, opacity 0.15s"
      }}
      onMouseEnter={e=>e.currentTarget.style.opacity="0.7"}
      onMouseLeave={e=>e.currentTarget.style.opacity="1"}
    >
      {label}{accent?" ✦":""}
    </span>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      background:"rgba(255,255,255,0.88)",
      backdropFilter:"blur(20px)",
      borderBottom:"1px solid var(--border)",
      height:52, padding:"0 32px",
      display:"flex", alignItems:"center", justifyContent:"space-between"
    }}>
      <div onClick={()=>navigate("/")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
        <Logo size={26}/>
        <span style={{ fontWeight:600, fontSize:17, color:"var(--text)" }}>myojam</span>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:24 }}>
        <NavLink label={t("nav_demos")} path="/demos" pathname={pathname}/>

        <Dropdown label={t("nav_learn")} pathname={pathname} items={[
          [t("nav_howItWorks"),  "/how-it-works", IconGear],
          [t("nav_education"),   "/education",    IconBook],
          [t("nav_educators"),   "/educators",    IconPeople],
        ]}/>

        <Dropdown label={t("nav_company")} pathname={pathname} items={[
          [t("nav_about"),        "/about",             IconBulb],
          [t("nav_team"),         "/team",              IconPeople],
          [t("nav_careers"),      "/careers",           IconRocket],
          [t("nav_corporations"), "/corporations",      IconBuilding],
          ["Workplace policy",    "/workplace-policy",  IconShield],
          [t("nav_changelog"),    "/changelog",         IconCode],
          [t("nav_research"),     "/research",          IconBook],
        ]}/>

        <NavLink label={t("nav_contact")} path="/contact" pathname={pathname}/>
        <NavLink label={t("nav_elevate")} path="/elevate" pathname={pathname} accent={true}/>
      </div>
    </nav>
  )
}