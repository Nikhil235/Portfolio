import { useState, useEffect, useRef } from "react"
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  ShieldAlert,
  Cpu,
} from "lucide-react"
import { SwitchProfile, useKeySound } from "../hooks/useKeySound"

export type LightingMode = "tokens" | "cyber" | "rainbow" | "matrix"

interface KeyboardProps {
  pressed: Set<string>
  onKey: (k: string) => void
  onOpenSection: (sectionId: string) => void
  onRunDemo?: () => void
  soundEnabled: boolean
  onToggleSound: () => void
  soundProfile: SwitchProfile
  onChangeSoundProfile: (p: SwitchProfile) => void
}

export default function Keyboard({
  pressed,
  onKey,
  onOpenSection,
  onRunDemo,
  soundEnabled,
  onToggleSound,
  soundProfile,
  onChangeSoundProfile,
}: KeyboardProps) {
  const [lightingMode, setLightingMode] = useState<LightingMode>("tokens")
  const [rippleOrigin, setRippleOrigin] = useState<{
    row: number
    col: number
    time: number
  } | null>(null)
  const [matrixSeed, setMatrixSeed] = useState(0)
  const [hoveredToken, setHoveredToken] = useState<string | null>(null)

  const playClick = useKeySound()

  // Matrix rain flicker interval
  useEffect(() => {
    if (lightingMode !== "matrix") return
    const id = setInterval(() => {
      setMatrixSeed((s) => (s + 1) % 100)
    }, 120)
    return () => clearInterval(id)
  }, [lightingMode])

  // Trigger ripple effect on keypress
  const handleKeyPress = (k: string, rowIdx: number, colIdx: number) => {
    const isSpace = k === " "
    const isEnter = k.toUpperCase() === "ENTER"
    playClick(isSpace ? "space" : isEnter ? "enter" : "normal")
    setRippleOrigin({ row: rowIdx, col: colIdx, time: Date.now() })
    onKey(k)
  }

  // Row 1: Numbers & Escape
  const row1 = [
    {
      label: "ESC",
      code: "Escape",
      width: "flex-[1.2]",
      token: "color.action.danger",
      type: "danger",
    },
    { label: "1", code: "1", token: "token.primitive.blue" },
    { label: "2", code: "2", token: "token.primitive.blue" },
    { label: "3", code: "3", token: "token.primitive.blue" },
    { label: "4", code: "4", token: "token.primitive.blue" },
    { label: "5", code: "5", token: "token.primitive.blue" },
    { label: "6", code: "6", token: "token.primitive.blue" },
    { label: "7", code: "7", token: "token.primitive.blue" },
    { label: "8", code: "8", token: "token.primitive.blue" },
    { label: "9", code: "9", token: "token.primitive.blue" },
    { label: "0", code: "0", token: "token.primitive.blue" },
    { label: "-", code: "-", token: "token.primitive.blue" },
    { label: "=", code: "=", token: "token.primitive.blue" },
    {
      label: "BKSP",
      code: "Backspace",
      width: "flex-[1.8]",
      token: "color.feedback.amber",
      type: "warning",
    },
  ]

  // Row 2: Standard QWERTY
  const row2 = [
    {
      label: "TAB",
      code: "Tab",
      width: "flex-[1.5]",
      token: "token.semantic.layout",
    },
    { label: "Q", code: "q", token: "token.primitive.violet" },
    { label: "W", code: "w", token: "token.primitive.violet" },
    { label: "E", code: "e", token: "token.primitive.violet" },
    { label: "R", code: "r", token: "token.primitive.violet" },
    { label: "T", code: "t", token: "token.primitive.violet" },
    { label: "Y", code: "y", token: "token.primitive.violet" },
    { label: "U", code: "u", token: "token.primitive.violet" },
    { label: "I", code: "i", token: "token.primitive.violet" },
    { label: "O", code: "o", token: "token.primitive.violet" },
    { label: "P", code: "p", token: "token.primitive.violet" },
    { label: "[", code: "[", token: "token.semantic.syntax" },
    { label: "]", code: "]", token: "token.semantic.syntax" },
    {
      label: "\\",
      code: "\\",
      width: "flex-[1.2]",
      token: "token.semantic.syntax",
    },
  ]

  // Row 3: Home row
  const row3 = [
    {
      label: "CAPS",
      code: "CapsLock",
      width: "flex-[1.8]",
      token: "token.semantic.status",
    },
    { label: "A", code: "a", token: "token.primitive.violet" },
    { label: "S", code: "s", token: "token.primitive.violet" },
    { label: "D", code: "d", token: "token.primitive.violet" },
    { label: "F", code: "f", token: "token.primitive.violet", homing: true },
    { label: "G", code: "g", token: "token.primitive.violet" },
    { label: "H", code: "h", token: "token.primitive.violet" },
    { label: "J", code: "j", token: "token.primitive.violet", homing: true },
    { label: "K", code: "k", token: "token.primitive.violet" },
    { label: "L", code: "l", token: "token.primitive.violet" },
    { label: ";", code: ";", token: "token.semantic.syntax" },
    { label: "'", code: "'", token: "token.semantic.syntax" },
    {
      label: "DEL",
      code: "Delete",
      width: "flex-[1.5]",
      token: "color.action.danger",
      type: "danger",
    },
  ]

  // Row 4: Dedicated Navigation Keys (Just like Screenshot 28!)
  const row4 = [
    {
      label: "~/ ABOUT",
      sectionId: "about",
      code: "about",
      width: "flex-[1]",
      isNav: true,
    },
    {
      label: "~/ PROJECTS",
      sectionId: "projects",
      code: "projects",
      width: "flex-[1.1]",
      isNav: true,
    },
  ]

  // Row 5: Action & Origin Navigation Keys
  const row5 = [
    {
      label: "~/ STACK",
      sectionId: "stack",
      code: "stack",
      width: "flex-[1]",
      isNav: true,
    },
    {
      label: "~/ CONTACT",
      sectionId: "contact",
      code: "contact",
      width: "flex-[0.9]",
      isNav: true,
    },
  ]

  // Row 6: Bottom modifiers and giant glowing Enter key!
  const row6 = [
    {
      label: "CTRL",
      code: "Control",
      width: "flex-[1.2]",
      token: "token.modifier",
    },
    { label: "ALT", code: "Alt", width: "flex-[1.2]", token: "token.modifier" },
    {
      label: "SPACE",
      code: " ",
      width: "flex-[3.5]",
      token: "token.spacing.layout",
    },
    {
      label: "↵ ENTER",
      code: "Enter",
      width: "flex-[2.2]",
      isEnter: true,
      token: "action.primary.execute",
    },
    { label: "ALT", code: "Alt", width: "flex-[1.2]", token: "token.modifier" },
    {
      label: "CMD",
      code: "Meta",
      width: "flex-[1.2]",
      token: "token.modifier",
    },
  ]

  // Calculate distance for ripple effect
  const isKeyInRipple = (rIdx: number, cIdx: number) => {
    if (!rippleOrigin) return false
    const elapsed = Date.now() - rippleOrigin.time
    if (elapsed > 350) return false
    const dist = Math.sqrt(
      Math.pow(rIdx - rippleOrigin.row, 2) +
        Math.pow(cIdx - rippleOrigin.col, 2),
    )
    const currentRadius = (elapsed / 350) * 8
    return Math.abs(dist - currentRadius) < 1.2
  }

  // Keycap styling helper based on lighting mode
  const getKeycapStyle = (
    keyItem: {
      label: string
      code: string
      isNav?: boolean
      isEnter?: boolean
      token?: string
      type?: string
    },
    isActive: boolean,
    inRipple: boolean,
    rowIdx: number,
    colIdx: number,
  ) => {
    // Pressed state takes top priority
    if (isActive) {
      return "key-pressed bg-accent text-bg border-accent shadow-[0_0_15px_var(--accent-glow)]"
    }

    if (inRipple) {
      return "border-accent/80 bg-accent/25 text-accent shadow-[0_0_12px_var(--accent-glow)] scale-[1.02]"
    }

    // Enter Key
    if (keyItem.isEnter) {
      return "keycap-enter bg-gradient-to-r from-accent via-accent/90 to-accent text-bg font-bold border-accent text-xs tracking-wider"
    }

    // Special Navigation Keys
    if (keyItem.isNav) {
      return "border-line-bright bg-panel-elevated/90 text-fg hover:border-accent hover:text-accent font-semibold tracking-wide hover:shadow-[0_0_10px_var(--accent-soft)]"
    }

    // Lighting Mode: Design Tokens
    if (lightingMode === "tokens") {
      if (keyItem.type === "danger") {
        return "border-red-500/40 bg-red-950/20 text-red-400 hover:border-red-400"
      }
      if (keyItem.type === "warning") {
        return "border-amber-500/40 bg-amber-950/20 text-keyboard-warning hover:border-amber-400"
      }
      if (keyItem.token?.includes("violet")) {
        return "border-purple-500/30 bg-purple-950/15 text-purple-300 hover:border-purple-400"
      }
      if (keyItem.token?.includes("blue")) {
        return "border-sky-500/30 bg-sky-950/15 text-sky-300 hover:border-sky-400"
      }
    }

    // Lighting Mode: Rainbow wave
    if (lightingMode === "rainbow") {
      const hue = (rowIdx * 30 + colIdx * 25 + matrixSeed * 10) % 360
      return `border-[hsl(${hue},70%,40%)] text-[hsl(${hue},90%,70%)] bg-[hsl(${hue},40%,10%)] hover:border-white`
    }

    // Lighting Mode: Matrix Rain
    if (lightingMode === "matrix") {
      const isMatrixFlicker = (rowIdx * 7 + colIdx * 11 + matrixSeed) % 9 === 0
      if (isMatrixFlicker) {
        return "border-green-400 bg-green-950/40 text-green-300 shadow-[0_0_8px_rgba(74,222,128,0.4)]"
      }
      return "border-green-900/40 bg-[#08100a] text-green-700 hover:text-green-400"
    }

    // Default Cyber Mode
    return "border-line bg-panel text-muted hover:border-accent/50 hover:text-fg"
  }

  return (
    <div className="relative w-full select-none">
      {/* Keyboard CNC Aluminum Chassis */}
      <div className="relative rounded-3xl border border-line-bright/80 bg-gradient-to-b from-[#18181c] via-[#101013] to-[#0a0a0c] p-3.5 sm:p-5 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] transition-all">
        {/* Decorative corner screws (CNC look) */}
        <div className="pointer-events-none absolute left-3 top-3 font-mono text-[9px] text-muted/30">
          ⬡
        </div>
        <div className="pointer-events-none absolute right-3 top-3 font-mono text-[9px] text-muted/30">
          ⬡
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[9px] text-muted/30">
          ⬡
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 font-mono text-[9px] text-muted/30">
          ⬡
        </div>

        {/* OLED Top Bar Display inside Chassis */}
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-3 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="font-semibold text-fg">
              NIKHIL-65{" "}
              <span className="text-muted font-normal">· DESIGN-ENG DECK</span>
            </span>
            {hoveredToken && (
              <span className="hidden md:inline-block rounded bg-accent/15 px-2 py-0.5 text-[10px] text-accent animate-in fade-in">
                {hoveredToken}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Lighting Mode Selector */}
            <div className="flex items-center rounded-lg border border-line bg-bg/80 p-0.5 text-[10px]">
              {(["tokens", "cyber", "rainbow", "matrix"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    playClick()
                    setLightingMode(m)
                  }}
                  className={`rounded px-2 py-0.5 uppercase transition ${
                    lightingMode === m
                      ? "bg-accent/20 text-accent font-semibold"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Sound Profile Button */}
            <button
              onClick={() => {
                const next: SwitchProfile =
                  soundProfile === "thock"
                    ? "clicky"
                    : soundProfile === "clicky"
                      ? "linear"
                      : "thock"
                onChangeSoundProfile(next)
                playClick()
              }}
              className="flex items-center gap-1 rounded-lg border border-line bg-bg/80 px-2 py-1 text-[10px] text-muted hover:border-accent hover:text-accent transition"
              title="Change mechanical switch sound profile"
            >
              {soundEnabled ? (
                <Volume2 size={12} className="text-accent" />
              ) : (
                <VolumeX size={12} />
              )}
              <span className="uppercase">{soundProfile}</span>
            </button>

            {/* Auto-Demo Button */}
            {onRunDemo && (
              <button
                onClick={() => {
                  playClick()
                  onRunDemo()
                }}
                className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-accent/10 border border-accent/30 px-2.5 py-1 text-[10px] font-semibold text-accent hover:bg-accent hover:text-bg transition"
                title="Watch automatic typing sequence"
              >
                <Play size={10} className="fill-current" />
                <span>Auto Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Recessed Switch Plate Well */}
        <div className="rounded-2xl border border-black/80 bg-[#0d0d10] p-2 sm:p-2.5 shadow-inner">
          {/* Row 1 */}
          <div className="mb-1.5 flex gap-1.5">
            {row1.map((item, colIdx) => {
              const active =
                pressed.has(item.code.toUpperCase()) ||
                pressed.has(item.label.toUpperCase())
              const inRipple = isKeyInRipple(0, colIdx)
              return (
                <button
                  key={item.label}
                  type="button"
                  tabIndex={-1}
                  onMouseEnter={() => item.token && setHoveredToken(item.token)}
                  onMouseLeave={() => setHoveredToken(null)}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleKeyPress(item.code, 0, colIdx)
                  }}
                  className={`keycap-3d ${item.width ?? "flex-1"} h-8 sm:h-10 rounded-lg border font-mono text-[10px] sm:text-xs font-medium transition-all ${getKeycapStyle(
                    item,
                    active,
                    inRipple,
                    0,
                    colIdx,
                  )}`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* Row 2 */}
          <div className="mb-1.5 flex gap-1.5">
            {row2.map((item, colIdx) => {
              const active =
                pressed.has(item.code.toUpperCase()) ||
                pressed.has(item.label.toUpperCase())
              const inRipple = isKeyInRipple(1, colIdx)
              return (
                <button
                  key={item.label}
                  type="button"
                  tabIndex={-1}
                  onMouseEnter={() => item.token && setHoveredToken(item.token)}
                  onMouseLeave={() => setHoveredToken(null)}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleKeyPress(item.code, 1, colIdx)
                  }}
                  className={`keycap-3d ${item.width ?? "flex-1"} h-8 sm:h-10 rounded-lg border font-mono text-[10px] sm:text-xs font-medium transition-all ${getKeycapStyle(
                    item,
                    active,
                    inRipple,
                    1,
                    colIdx,
                  )}`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* Row 3 */}
          <div className="mb-2 flex gap-1.5">
            {row3.map((item, colIdx) => {
              const active =
                pressed.has(item.code.toUpperCase()) ||
                pressed.has(item.label.toUpperCase())
              const inRipple = isKeyInRipple(2, colIdx)
              return (
                <button
                  key={item.label}
                  type="button"
                  tabIndex={-1}
                  onMouseEnter={() => item.token && setHoveredToken(item.token)}
                  onMouseLeave={() => setHoveredToken(null)}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleKeyPress(item.code, 2, colIdx)
                  }}
                  className={`keycap-3d relative ${item.width ?? "flex-1"} h-8 sm:h-10 rounded-lg border font-mono text-[10px] sm:text-xs font-medium transition-all ${getKeycapStyle(
                    item,
                    active,
                    inRipple,
                    2,
                    colIdx,
                  )}`}
                >
                  {item.label}
                  {item.homing && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-2 rounded-full bg-muted/40" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Row 4: Dedicated Navigation Keys (Screenshot 28 Inspired!) */}
          <div className="mb-1.5 flex gap-1.5">
            {row4.map((item, colIdx) => {
              const active = pressed.has(item.code.toUpperCase())
              const inRipple = isKeyInRipple(3, colIdx)
              return (
                <button
                  key={item.label}
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleKeyPress(item.code, 3, colIdx)
                    if (item.sectionId) {
                      onOpenSection(item.sectionId)
                    }
                  }}
                  className={`keycap-3d ${item.width} h-9 sm:h-11 rounded-lg border font-mono text-[10px] sm:text-xs transition-all ${getKeycapStyle(
                    item,
                    active,
                    inRipple,
                    3,
                    colIdx,
                  )}`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* Row 5: Action & Origin Navigation Keys */}
          <div className="mb-2 flex gap-1.5">
            {row5.map((item, colIdx) => {
              const active = pressed.has(item.code.toUpperCase())
              const inRipple = isKeyInRipple(4, colIdx)
              return (
                <button
                  key={item.label}
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleKeyPress(item.code, 4, colIdx)
                    if (item.sectionId) {
                      onOpenSection(item.sectionId)
                    }
                  }}
                  className={`keycap-3d ${item.width} h-9 sm:h-11 rounded-lg border font-mono text-[10px] sm:text-xs transition-all ${getKeycapStyle(
                    item,
                    active,
                    inRipple,
                    4,
                    colIdx,
                  )}`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* Row 6: Master ENTER Key & Spacebar */}
          <div className="flex gap-1.5">
            {row6.map((item, colIdx) => {
              const active = pressed.has(item.code.toUpperCase())
              const inRipple = isKeyInRipple(5, colIdx)
              return (
                <button
                  key={`${item.code}-${colIdx}`}
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleKeyPress(item.code, 5, colIdx)
                  }}
                  className={`keycap-3d ${item.width} h-10 sm:h-12 rounded-lg border font-mono text-[10px] sm:text-xs transition-all ${getKeycapStyle(
                    item,
                    active,
                    inRipple,
                    5,
                    colIdx,
                  )}`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Chassis bottom subtitle / tactile indicator */}
        <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-muted">
          <span>
            Click any key or use your physical keyboard to trigger modals
          </span>
          <span className="hidden sm:inline">
            Sound:{" "}
            <strong className="text-accent">
              {soundEnabled ? "ON" : "MUTED"}
            </strong>
          </span>
        </div>
      </div>
    </div>
  )
}
