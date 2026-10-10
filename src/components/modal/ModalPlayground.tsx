import { useRef, useState } from "react"
import { Sliders, Sparkles } from "lucide-react"
import { useKeySound } from "../../hooks/useKeySound"

interface ModalPlaygroundProps {
  accentColor: string
  onAccentChange: (color: string) => void
}

const SWATCHES = [
  { name: "Electric Lime", hex: "#b8f36b" },
  { name: "Cyber Cyan", hex: "#38bdf8" },
  { name: "Neon Violet", hex: "#c084fc" },
  { name: "Sunset Peach", hex: "#fb923c" },
  { name: "Monolith Silver", hex: "#f5f5f5" },
]

export default function ModalPlayground({
  accentColor,
  onAccentChange,
}: ModalPlaygroundProps) {
  const magneticRef = useRef<HTMLButtonElement>(null)
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 })
  const playClick = useKeySound()

  // Magnetic button physics
  const onMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = magneticRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    setMagneticPos({ x: dx * 0.35, y: dy * 0.35 })
  }

  const onMagneticLeave = () => {
    setMagneticPos({ x: 0, y: 0 })
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-xs text-accent uppercase tracking-wider">
          Live Experiments
        </span>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          UI Craft Playground
        </h2>
        <p className="mt-1 text-sm text-muted">
          Hands-on interactive micro-interactions, theme re-theming, and magnetic physics.
        </p>
      </div>

      {/* Widget 1: Realtime Site Theme Switcher */}
      <div className="rounded-xl border border-line bg-panel-elevated p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-accent" aria-hidden="true" />
          <h3 className="font-mono text-sm font-semibold text-fg">
            Accent Color — Re-theme this entire portfolio
          </h3>
        </div>
        <p className="text-xs text-muted">
          Click a swatch to instantly re-calculate CSS theme variables, glows, and keycap illumination.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          {SWATCHES.map((sw) => (
            <button
              key={sw.hex}
              onClick={() => {
                playClick()
                onAccentChange(sw.hex)
              }}
              className="group flex flex-col items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-1"
            >
              <div
                className={`h-10 w-10 rounded-full transition-transform group-hover:scale-110 ${
                  accentColor.toLowerCase() === sw.hex.toLowerCase()
                    ? "ring-4 ring-white/30 scale-110 shadow-lg"
                    : ""
                }`}
                style={{ backgroundColor: sw.hex }}
              />
              <span className="font-mono text-[10px] text-muted">
                {sw.name.split(" ")[1]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Widget 2: Magnetic Button */}
      <div className="rounded-xl border border-line bg-panel-elevated p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" aria-hidden="true" />
          <h3 className="font-mono text-sm font-semibold text-fg">
            Magnetic Button Physics
          </h3>
        </div>
        <p className="text-xs text-muted">
          Leans dynamically toward the cursor using vector proximity, snapping back with spring inertia.
        </p>

        <div
          onMouseMove={onMagneticMove}
          onMouseLeave={onMagneticLeave}
          className="flex h-36 w-full items-center justify-center rounded-lg border border-line bg-bg"
        >
          <button
            ref={magneticRef}
            onClick={() => playClick()}
            style={{
              transform: `translate(${magneticPos.x}px, ${magneticPos.y}px)`,
              transition:
                magneticPos.x === 0 && magneticPos.y === 0
                  ? "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  : "none",
            }}
            className="rounded-xl bg-accent px-6 py-3 font-mono text-sm font-semibold text-bg shadow-lg shadow-accent/25 transition-colors hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Hover near me
          </button>
        </div>
      </div>
    </div>
  )
}
