import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { artOrigin } from "../../data/portfolio"
import { getSketches, type Sketch } from "../../data/sketchRepository"

export default function ModalArt() {
  const [sketches, setSketches] = useState<Sketch[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    getSketches().then(setSketches)
  }, [])

  const total = sketches.length
  const activeSketch = activeIndex !== null ? sketches[activeIndex] : null

  const closeLightbox = () => setActiveIndex(null)
  const prev = () =>
    setActiveIndex((i) => ((i ?? 0) - 1 + total) % total)
  const next = () =>
    setActiveIndex((i) => ((i ?? 0) + 1) % total)

  // Keyboard navigation for inline lightbox
  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        closeLightbox()
      } else if (e.key === "ArrowLeft") prev()
      else if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, total])

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-xs text-accent uppercase tracking-wider">
          Genesis
        </span>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          {artOrigin.title}
        </h2>
        <p className="mt-1 text-sm text-muted">{artOrigin.subtitle}</p>
      </div>

      {/* ── Sketch Gallery ── */}
      {sketches.length > 0 && (
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted">
            Sketchbook — tap to view
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {sketches.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`View ${s.title}`}
                className="group relative overflow-hidden rounded-lg border border-line bg-[#f3efe6] p-1.5 shadow-card transition-all duration-300 hover:border-accent hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  width={s.width}
                  height={s.height}
                  className="block h-auto w-full rounded-[3px] grayscale-[15%] transition-[filter,transform] duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <span className="mt-1.5 flex items-baseline justify-between gap-1 px-0.5 pb-1">
                  <span className="truncate text-[0.7rem] font-semibold text-[#1b1b1f] sm:text-xs">
                    {s.title}
                  </span>
                  <span className="hidden shrink-0 font-mono text-[0.6rem] uppercase tracking-wider text-[#5c5a55] sm:inline">
                    {s.category}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Inline Lightbox ── */}
      {activeSketch && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeSketch.title}, ${(activeIndex ?? 0) + 1} of ${total}`}
          className="fixed inset-0 z-[60] flex flex-col bg-black/92 px-4 py-4 md:px-10 md:py-8"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-caption text-text-secondary">
              {String((activeIndex ?? 0) + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close sketch"
              autoFocus
              className="grid size-11 place-items-center rounded-full border border-line-bright bg-surface/90 text-fg transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Image + caption */}
          <div className="flex min-h-0 flex-1 items-center gap-3 py-4 md:gap-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous sketch"
              className="hidden shrink-0 md:grid grid size-11 place-items-center rounded-full border border-line-bright bg-surface/90 text-fg transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronLeft className="size-5" />
            </button>
            <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 lg:flex-row lg:gap-10">
              <img
                key={activeSketch.id}
                src={activeSketch.src}
                alt={activeSketch.alt}
                decoding="async"
                className="min-h-0 max-h-[62vh] max-w-full rounded-[3px] bg-[#f3efe6] object-contain p-2 shadow-[0_30px_80px_-30px_rgb(0_0_0)] lg:max-h-[80vh] lg:max-w-[68%]"
              />
              <figcaption className="w-full max-w-sm">
                <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
                  {activeSketch.category}
                  {activeSketch.year ? ` · ${activeSketch.year}` : ""}
                </p>
                <h3 className="mt-2 text-h3 font-semibold text-fg">
                  {activeSketch.title}
                </h3>
                <p className="mt-2 text-body text-text-secondary">
                  {activeSketch.caption}
                </p>
              </figcaption>
            </figure>
            <button
              type="button"
              onClick={next}
              aria-label="Next sketch"
              className="hidden shrink-0 md:grid grid size-11 place-items-center rounded-full border border-line-bright bg-surface/90 text-fg transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* Mobile nav arrows */}
          <div className="flex justify-center gap-3 md:hidden">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous sketch"
              className="grid size-11 place-items-center rounded-full border border-line-bright bg-surface/90 text-fg transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next sketch"
              className="grid size-11 place-items-center rounded-full border border-line-bright bg-surface/90 text-fg transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Origin Facets ── */}
      <div className="space-y-4">
        {artOrigin.facets.map((fc) => (
          <div
            key={fc.title}
            className="rounded-xl border border-line bg-panel-elevated p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-base font-semibold text-fg">
                {fc.title}
              </h4>
              <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-accent">
                {fc.tag}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-fg/80">
              {fc.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
