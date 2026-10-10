import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRight,
  Copy,
  ExternalLink,
  Search,
  Volume2,
  Palette,
} from "lucide-react"
import { profile, sections, socials } from "../data/portfolio"
import { useKeySound } from "../hooks/useKeySound"

type Item = {
  id: string
  group: string
  label: string
  icon: typeof ArrowRight
  run: () => void
}

export default function CommandPalette({
  open,
  onClose,
  onToggleSound,
  onOpenSection,
  onAccentChange,
}: {
  open: boolean
  onClose: () => void
  onToggleSound: () => void
  onOpenSection: (s: string) => void
  onAccentChange: (c: string) => void
}) {
  const [q, setQ] = useState("")
  const [idx, setIdx] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const click = useKeySound()

  const items: Item[] = useMemo(
    () => [
      // Sections
      ...sections.slice(1).map((s) => ({
        id: s.id,
        group: "Navigation",
        label: `Go to ${s.label} modal`,
        icon: ArrowRight,
        run: () => onOpenSection(s.id),
      })),

      // Actions
      {
        id: "email",
        group: "Actions",
        label: `Copy email (${profile.email})`,
        icon: Copy,
        run: () => navigator.clipboard?.writeText(profile.email),
      },
      {
        id: "sound",
        group: "Actions",
        label: "Toggle mechanical keyboard sound",
        icon: Volume2,
        run: onToggleSound,
      },

      // Themes
      {
        id: "theme-lime",
        group: "Themes",
        label: "Switch Accent: Electric Lime (#b8f36b)",
        icon: Palette,
        run: () => onAccentChange("#b8f36b"),
      },
      {
        id: "theme-cyan",
        group: "Themes",
        label: "Switch Accent: Cyber Cyan (#38bdf8)",
        icon: Palette,
        run: () => onAccentChange("#38bdf8"),
      },
      {
        id: "theme-violet",
        group: "Themes",
        label: "Switch Accent: Neon Violet (#c084fc)",
        icon: Palette,
        run: () => onAccentChange("#c084fc"),
      },
      {
        id: "theme-sunset",
        group: "Themes",
        label: "Switch Accent: Sunset Peach (#fb923c)",
        icon: Palette,
        run: () => onAccentChange("#fb923c"),
      },

      // Socials & External
      {
        id: "ui-checklist",
        group: "Live Apps",
        label: "Open ui-checklist on Vercel",
        icon: ExternalLink,
        run: () => window.open("https://ui-checklist.vercel.app", "_blank"),
      },
      ...socials.map((s) => ({
        id: s.label,
        group: "Links",
        label: `Open ${s.label} (${s.user})`,
        icon: ExternalLink,
        run: () => window.open(s.href, "_blank"),
      })),
    ],
    [onToggleSound, onOpenSection, onAccentChange],
  )

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(q.toLowerCase()),
  )

  useEffect(() => {
    if (open) {
      setQ("")
      setIdx(0)
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      setTimeout(() => input.current?.focus(), 0)
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [open])

  useEffect(() => setIdx(0), [q])

  if (!open) return null

  const onKeyDown = (e: React.KeyboardEvent) => {
    click()
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setIdx((i) => (i + 1) % Math.max(filtered.length, 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setIdx((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1))
    } else if (e.key === "Enter" && filtered[idx]) {
      filtered[idx].run()
      onClose()
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  let lastGroup = ""

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 px-4 pt-[10vh] sm:pt-[15vh] backdrop-blur-md animate-in fade-in duration-150"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-panel font-mono shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={16} className="text-muted" aria-hidden="true" />
          <input
            ref={input}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-autocomplete="list"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a command or search sections..."
            className="h-12 flex-1 bg-transparent text-xs text-fg outline-none placeholder:text-muted"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-muted">
            ESC
          </kbd>
        </div>

        <ul id="command-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-xs text-muted">
              No matching commands.
            </li>
          )}
          {filtered.map((it, i) => {
            const header =
              it.group !== lastGroup ? (lastGroup = it.group) : null
            const Icon = it.icon
            return (
              <li key={it.id} role="none">
                {header && (
                  <div className="px-3 pb-1 pt-3 text-[10px] uppercase tracking-widest text-muted">
                    {header}
                  </div>
                )}
                <button
                  role="option"
                  aria-selected={i === idx}
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => {
                    it.run()
                    onClose()
                  }}
                  className={`flex w-full min-h-[40px] items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition ${
                    i === idx
                      ? "bg-accent/15 text-accent font-semibold"
                      : "text-fg hover:bg-bg"
                  }`}
                >
                  <Icon size={14} className="shrink-0" aria-hidden="true" />
                  <span className="truncate">{it.label}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-wrap items-center justify-between border-t border-line px-4 py-2.5 text-[10px] text-muted">
          <div className="flex gap-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
          <span className="hidden sm:inline">⌘K anywhere</span>
        </div>
      </div>
    </div>
  )
}
