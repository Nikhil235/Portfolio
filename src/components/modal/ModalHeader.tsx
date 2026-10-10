import { useKeySound } from "../../hooks/useKeySound"

interface ModalHeaderProps {
  sectionId: string
  onClose: () => void
  onNavigate: (sectionId: string) => void
}

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "design-system", label: "DS" },
  { id: "projects", label: "Projects" },
  { id: "shape", label: "SHAPE" },
  { id: "stack", label: "Stack" },
  { id: "playground", label: "Playground" },
  { id: "art", label: "Art" },
  { id: "contact", label: "Contact" },
]

export default function ModalHeader({
  sectionId,
  onClose,
  onNavigate,
}: ModalHeaderProps) {
  const playClick = useKeySound()

  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5 sm:px-6 font-mono text-xs bg-[#111114]">
      {/* Window Controls & Current Section Title */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
        </span>
        <span id="modal-section-title" className="font-semibold text-fg tracking-tight">
          ~/ {sectionId.replace("-", " ")}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Navigation Tabs (desktop/tablet) */}
        <nav aria-label="Modal sections" className="hidden gap-1 sm:flex">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                playClick()
                onNavigate(s.id)
              }}
              className={`rounded px-2.5 py-1 text-[11px] transition min-h-[32px] ${
                sectionId === s.id
                  ? "bg-accent/15 text-accent font-semibold"
                  : "text-muted hover:text-fg hover:bg-surface-raised"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Close Button */}
        <button
          onClick={() => {
            playClick()
            onClose()
          }}
          aria-label="Close dialog"
          className="flex min-h-[36px] items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1 text-muted transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span>Close</span>
          <kbd className="rounded bg-bg px-1 text-[10px]" aria-hidden="true">esc</kbd>
        </button>
      </div>
    </div>
  )
}
