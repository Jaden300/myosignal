export default function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Outer ring */}
      <circle cx="16" cy="16" r="14.5" stroke="#FF2D78" strokeWidth="1.2" strokeOpacity="0.3"/>
      {/* EMG signal path through center */}
      <path
        d="M4 16 L8 16 L10 10 L12 22 L14 13 L16 19 L18 16 L22 16 L24 11 L26 16 L28 16"
        stroke="#FF2D78"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Center pulse dot */}
      <circle cx="16" cy="16" r="2" fill="#FF2D78"/>
    </svg>
  )
}