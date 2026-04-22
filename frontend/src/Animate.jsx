import { useEffect, useRef, useState } from "react"

export function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

// Single element that fades+slides up on scroll
export function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.55s ${delay}s ease, transform 0.55s ${delay}s ease`,
      ...style
    }}>
      {children}
    </div>
  )
}

// Staggered children - wraps an array of items
export function StaggerList({ items, renderItem, gap = 16, columns = 1 }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap
    }}>
      {items.map((item, i) => (
        <div key={i} style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(28px)",
          transition: `opacity 0.5s ${i * 0.09}s ease, transform 0.5s ${i * 0.09}s ease`
        }}>
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  )
}

// Hover card - adds lift + shadow + optional border glow on hover
export function HoverCard({ children, color = "rgba(255,45,120,0.2)", style = {}, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 48px ${color}` : "none",
        cursor: onClick ? "pointer" : "default",
        ...style
      }}
    >
      {children}
    </div>
  )
}

// Icon badge used in section headers
export function IconBadge({ icon, color = "#FF2D78", bg = "rgba(255,45,120,0.1)" }) {
  return (
    <div style={{
      width: 44, height: 44, borderRadius: 14, flexShrink: 0,
      background: bg, display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: 20
    }}>{icon}</div>
  )
}

// Section label pill (like "Our mission")
export function SectionPill({ children }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "var(--accent-soft)", border: "1px solid rgba(255,45,120,0.15)",
      borderRadius: 100, padding: "5px 16px",
      fontSize: 13, color: "var(--accent)", fontWeight: 500, marginBottom: 20
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }}/>
      {children}
    </div>
  )
}