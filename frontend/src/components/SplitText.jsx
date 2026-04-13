import { useEffect, useRef, useState } from "react"

export default function SplitText({
  text,
  delay = 40,
  duration = 0.6,
  ease = "cubic-bezier(0.22, 1, 0.36, 1)",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  tag = "span",
  style = {},
  onComplete,
}) {
  const chars = text.split("")
  const [triggered, setTriggered] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    setTriggered(false)
    const timer = setTimeout(() => setTriggered(true), 30)
    return () => clearTimeout(timer)
  }, [text])

  useEffect(() => {
    if (!triggered || !onComplete) return
    const totalTime = (chars.length * delay) + (duration * 1000)
    const t = setTimeout(onComplete, totalTime)
    return () => clearTimeout(t)
  }, [triggered, text])

  const Tag = tag

  return (
    <Tag style={{ display: "inline-block", ...style }}>
      {chars.map((char, i) => (
        <span
          key={`${text}-${i}`}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
            opacity: triggered ? to.opacity ?? 1 : from.opacity ?? 0,
            transform: triggered
              ? `translateY(${to.y ?? 0}px)`
              : `translateY(${from.y ?? 40}px)`,
            transition: `opacity ${duration}s ${ease} ${i * delay}ms, transform ${duration}s ${ease} ${i * delay}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  )
}