import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useEffect, useRef } from "react"
import type { Sketch } from "../../data/sketchRepository"

type Props = {
  sketches: Sketch[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

/** Keyboard (Esc / arrows) is handled by the parent overlay so keys never double-fire. */
export default function SketchLightbox({ sketches, index, onClose, onNavigate }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const sketch = sketches[index]
  const total = sketches.length
  useEffect(() => closeRef.current?.focus(), [])

  const ctrl =
    "grid size-11 place-items-center rounded-full border border-line-bright bg-surface/90 text-fg transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${sketch.title}, ${index + 1} of ${total}`}
      className="sketch-lightbox fixed inset-0 z-[52] flex flex-col bg-black/92 px-4 py-4 md:px-10 md:py-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-caption text-text-secondary">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close sketch" className={ctrl}>
          <X className="size-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-3 py-4 md:gap-6">
        <button type="button" onClick={() => onNavigate((index - 1 + total) % total)} aria-label="Previous sketch" className={`${ctrl} hidden shrink-0 md:grid`}>
          <ChevronLeft className="size-5" />
        </button>
        <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 lg:flex-row lg:gap-10">
          <img
            key={sketch.id}
            src={sketch.src}
            alt={sketch.alt}
            decoding="async"
            className="sketch-lightbox__img min-h-0 max-h-[62vh] max-w-full rounded-[3px] bg-[#f3efe6] object-contain p-2 shadow-[0_30px_80px_-30px_rgb(0_0_0)] lg:max-h-[80vh] lg:max-w-[68%]"
          />
          <figcaption className="w-full max-w-sm">
            <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
              {sketch.category}
              {sketch.year ? ` · ${sketch.year}` : ""}
            </p>
            <h3 className="mt-2 text-h3 font-semibold text-fg">{sketch.title}</h3>
            <p className="mt-2 text-body text-text-secondary">{sketch.caption}</p>
          </figcaption>
        </figure>
        <button type="button" onClick={() => onNavigate((index + 1) % total)} aria-label="Next sketch" className={`${ctrl} hidden shrink-0 md:grid`}>
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="flex justify-center gap-3 md:hidden">
        <button type="button" onClick={() => onNavigate((index - 1 + total) % total)} aria-label="Previous sketch" className={ctrl}>
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={() => onNavigate((index + 1) % total)} aria-label="Next sketch" className={ctrl}>
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  )
}
