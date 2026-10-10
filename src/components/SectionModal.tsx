import { useEffect, useRef } from "react"
import ModalHeader from "./modal/ModalHeader"
import ModalAbout from "./modal/ModalAbout"
import ModalDesignSystem from "./modal/ModalDesignSystem"
import ModalProjects from "./modal/ModalProjects"
import ModalShape from "./modal/ModalShape"
import ModalStack from "./modal/ModalStack"
import ModalPlayground from "./modal/ModalPlayground"
import ModalArt from "./modal/ModalArt"
import ModalContact from "./modal/ModalContact"
import { useKeySound } from "../hooks/useKeySound"

interface SectionModalProps {
  sectionId: string | null
  onClose: () => void
  onNavigate: (sectionId: string) => void
  accentColor: string
  onAccentChange: (color: string) => void
}

export default function SectionModal({
  sectionId,
  onClose,
  onNavigate,
  accentColor,
  onAccentChange,
}: SectionModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const playClick = useKeySound()

  // Remember previous focus and lock scroll
  useEffect(() => {
    if (!sectionId) return

    previousActiveElement.current = document.activeElement as HTMLElement
    const { body, documentElement } = document
    const scrollbarGap = window.innerWidth - documentElement.clientWidth
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight

    body.style.overflow = "hidden"
    body.style.paddingRight = `${scrollbarGap}px`

    // Focus the first focusable element inside the modal
    requestAnimationFrame(() => {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable && focusable.length > 0) {
        focusable[0].focus()
      }
    })

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
      previousActiveElement.current?.focus()
    }
  }, [sectionId])

  // Handle ESC and Tab focus trap
  useEffect(() => {
    if (!sectionId) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        playClick()
        onClose()
      } else if (e.key === "Tab") {
        const dialog = dialogRef.current
        if (!dialog) return
        const focusables = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusables.length) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [sectionId, onClose, playClick])

  if (!sectionId) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-section-title"
      className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center bg-black/80 px-3 py-4 sm:px-4 sm:py-8 backdrop-blur-md animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          playClick()
          onClose()
        }
      }}
    >
      <div
        ref={dialogRef}
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl"
      >
        {/* Top Header Bar */}
        <ModalHeader
          sectionId={sectionId}
          onClose={onClose}
          onNavigate={onNavigate}
        />

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {sectionId === "about" && <ModalAbout />}
          {sectionId === "design-system" && <ModalDesignSystem />}
          {sectionId === "projects" && <ModalProjects />}
          {sectionId === "shape" && <ModalShape />}
          {sectionId === "stack" && <ModalStack />}
          {sectionId === "playground" && (
            <ModalPlayground
              accentColor={accentColor}
              onAccentChange={onAccentChange}
            />
          )}
          {sectionId === "art" && <ModalArt />}
          {sectionId === "contact" && <ModalContact />}
        </div>
      </div>
    </div>
  )
}
