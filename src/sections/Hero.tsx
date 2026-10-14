import { useEffect, useState, useRef } from "react"
import {
  Terminal as TerminalIcon,
  CornerDownLeft,
  Play,
  ArrowRight,
} from "lucide-react"
import Button from "../components/ui/Button"
import SplitFlap from "../components/ui/SplitFlap"
import Keyboard from "../components/Keyboard"
import { profile, sections } from "../data/portfolio"
import { SwitchProfile, useKeySound } from "../hooks/useKeySound"

const norm = (k: string) => {
  if (k === "Meta") return "CMD"
  if (k === "Control") return "CTRL"
  if (k === "CapsLock") return "CAPS"
  if (k === "Backspace") return "BKSP"
  if (k === "Enter") return "ENTER"
  if (k === " ") return "SPACE"
  return k.toUpperCase()
}

interface HeroProps {
  onOpenSection: (sectionId: string) => void
  soundEnabled: boolean
  onToggleSound: () => void
  soundProfile: SwitchProfile
  onChangeSoundProfile: (p: SwitchProfile) => void
}

export default function Hero({
  onOpenSection,
  soundEnabled,
  onToggleSound,
  soundProfile,
  onChangeSoundProfile,
}: HeroProps) {
  const [pressed, setPressed] = useState<Set<string>>(new Set())
  const [cmd, setCmd] = useState("")
  const cmdRef = useRef("")
  const [out, setOut] = useState<string[]>([
    "> whoami",
    "Nikhil Arjun — Design Engineer",
    "I design interfaces and build them for production.",
    "> explore",
    "[ projects ]  [ design-system ]  [ contact ]",
  ])
  const [isTypingDemo, setIsTypingDemo] = useState(false)
  const click = useKeySound()

  const runCommand = (raw: string) => {
    const c = raw.trim().toLowerCase()
    if (!c) {
      // If empty enter pressed, open projects or design system
      onOpenSection("design-system")
      setOut((o) => [
        ...o.slice(-3),
        "$ <enter>",
        "→ Opening ~/design-system...",
      ])
      return
    }

    if (c === "help") {
      setOut((o) => [
        ...o.slice(-3),
        `$ ${raw}`,
        "Available: about, design-system (ds), projects, shape, stack, playground, art, contact, clear",
      ])
      return
    }

    if (c === "clear") {
      setOut([])
      return
    }

    // Direct section aliases
    const aliases: Record<string, string> = {
      ds: "design-system",
      tokens: "design-system",
      work: "projects",
      skills: "stack",
      framework: "shape",
      origin: "art",
      experiments: "playground",
    }

    const targetSectionId = aliases[c] || c
    const validSection = sections.find((s) => s.id === targetSectionId)

    if (validSection) {
      onOpenSection(validSection.id)
      setOut((o) => [
        ...o.slice(-3),
        `$ ${raw}`,
        `→ Launching ~/${validSection.id}...`,
      ])
    } else {
      setOut((o) => [
        ...o.slice(-3),
        `$ ${raw}`,
        `command not found: "${c}". Type "help" or click navigation keys.`,
      ])
    }
  }

  const press = (k: string) => {
    const isSpace = k === " " || k === "SPACE"
    const isEnter = k === "Enter" || k === "ENTER"
    click(isSpace ? "space" : isEnter ? "enter" : "normal")

    const K = norm(k)
    setPressed((p) => new Set(p).add(K))
    setTimeout(() => {
      setPressed((p) => {
        const n = new Set(p)
        n.delete(K)
        return n
      })
    }, 150)

    if (k === "Backspace" || k === "BKSP") {
      cmdRef.current = cmdRef.current.slice(0, -1)
      setCmd(cmdRef.current)
    } else if (k === "Enter" || k === "ENTER") {
      // Run outside any state updater: it updates App state (setState-in-render otherwise).
      const current = cmdRef.current
      cmdRef.current = ""
      setCmd("")
      runCommand(current)
    } else if (k.length === 1) {
      cmdRef.current = (cmdRef.current + k.toLowerCase()).slice(0, 35)
      setCmd(cmdRef.current)
    }
  }

  // Auto-demo typing animation sequence
  const runAutoDemo = () => {
    if (isTypingDemo) return
    setIsTypingDemo(true)
    cmdRef.current = ""
    setCmd("")
    const target = "design-system"
    let idx = 0

    const interval = setInterval(() => {
      if (idx < target.length) {
        const char = target[idx]
        press(char)
        idx++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          press("Enter")
          setIsTypingDemo(false)
        }, 300)
      }
    }, 90)
  }

  // Global physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      // Never hijack keys meant for focused controls, dialogs, or shortcuts.
      if (
        target.closest("input, textarea, select, [contenteditable], [role='dialog']") ||
        (e.key === "Enter" && target.closest("button, a")) ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.key === "Tab" ||
        e.key === " " ||
        e.key.startsWith("Arrow") ||
        e.key === "Escape"
      ) {
        return
      }

      // Only active while the hero is on screen
      if (window.scrollY > window.innerHeight * 0.7) return

      if (e.key === "Backspace") e.preventDefault()

      press(e.key)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center pb-20 pt-28 lg:pt-32"
    >
      <div className="relative mx-auto grid w-full max-w-7xl gap-16 px-5 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
        <div className="hero-in space-y-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 font-mono text-eyebrow text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Available for UI Developer &amp; Product Design roles
          </p>

          <div>
            <h1 id="hero-title" className="text-display font-extrabold tracking-tight text-text-primary">
              <SplitFlap text={profile.name} />
            </h1>
            <p className="mt-4 font-mono text-body-lg text-accent">{profile.role}</p>
            <p className="mt-5 max-w-xl text-body-lg text-text-secondary">{profile.tagline}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button href="#projects" size="lg" iconRight={<ArrowRight size={18} />}>
              View selected work
            </Button>
            <Button href="#contact" size="lg" variant="secondary">
              Get in touch
            </Button>
          </div>

          {/* Proof: concrete numbers a recruiter can scan in 5s */}
          <dl className="grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
            {[
              ["6", "products designed & built"],
              ["52+", "variants across 4 apps"],
              ["1.2k", "designers using UI Checklist"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="text-h3 font-semibold text-text-primary">{n}</dd>
                <p aria-hidden className="mt-1 text-caption text-text-tertiary">{l}</p>
              </div>
            ))}
          </dl>

          {/* Mobile quick workstation triggers */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:hidden font-mono text-xs">
            <span className="text-[11px] text-text-tertiary w-full">Quick workstation launch:</span>
            <button
              type="button"
              onClick={() => onOpenSection("design-system")}
              className="inline-flex min-h-[44px] items-center rounded-control border border-border bg-surface px-3.5 py-2 text-text-secondary hover:border-accent hover:text-accent transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              ~/design-system
            </button>
            <button
              type="button"
              onClick={() => onOpenSection("projects")}
              className="inline-flex min-h-[44px] items-center rounded-control border border-border bg-surface px-3.5 py-2 text-text-secondary hover:border-accent hover:text-accent transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              ~/case-studies
            </button>
            <button
              type="button"
              onClick={() => onOpenSection("stack")}
              className="inline-flex min-h-[44px] items-center rounded-control border border-border bg-surface px-3.5 py-2 text-text-secondary hover:border-accent hover:text-accent transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              ~/stack-graph
            </button>
          </div>
        </div>

        {/* Right Column: live terminal and interactive mechanical keyboard */}
        <div className="hero-in hidden w-full space-y-6 md:block" aria-label="Interactive keyboard: type a command to explore" role="group">
          {/* Live Terminal Emulator */}
          <div className="hidden overflow-hidden rounded-card border border-border bg-surface font-mono text-xs lg:block">
            {/* Terminal Top Window Bar */}
            <div className="flex items-center justify-between border-b border-line bg-[#151519] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-muted">
                  {profile.handle}@macbook — zsh (interactive)
                </span>
              </div>
              <button
                onClick={runAutoDemo}
                className="inline-flex items-center gap-1 rounded bg-accent/15 px-2 py-0.5 text-[10px] text-accent hover:bg-accent hover:text-bg transition"
                title="Run auto typing sequence"
              >
                <Play size={9} className="fill-current" /> Demo
              </button>
            </div>

            {/* Terminal Body */}
            <div aria-live="polite" className="h-36 space-y-1 overflow-y-auto p-4 text-[11px] leading-relaxed">
              {out.map((line, i) => (
                <p
                  key={i}
                  className={
                    line.startsWith("$")
                      ? "text-fg font-semibold"
                      : line.startsWith("→")
                        ? "text-accent"
                        : "text-muted"
                  }
                >
                  {line}
                </p>
              ))}

              {/* Active command prompt */}
              <div className="flex items-center pt-1 text-fg">
                <span className="text-accent mr-2 font-bold">❯</span>
                <span className="font-medium">{cmd}</span>
                <span className="caret ml-1 inline-block h-3.5 w-2 bg-accent translate-y-0.5" />
              </div>
            </div>

            {/* Prompt footer hint */}
            <div className="flex items-center justify-between border-t border-line/60 bg-[#0d0d10] px-4 py-2 text-[10px] text-muted">
              <span>Type a command or click any key to launch</span>
              <span className="flex items-center gap-1">
                press{" "}
                <kbd className="rounded border border-line px-1 text-[9px]">
                  ENTER
                </kbd>
              </span>
            </div>
          </div>

          <Keyboard
            pressed={pressed}
            onKey={press}
            onOpenSection={onOpenSection}
            onRunDemo={runAutoDemo}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
            soundProfile={soundProfile}
            onChangeSoundProfile={onChangeSoundProfile}
          />
        </div>
      </div>

    </section>
  )
}
