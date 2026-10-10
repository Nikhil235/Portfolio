import gsap from "gsap"
import { X } from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { getSketches, subscribeSketches, type Sketch } from "../../data/sketchRepository"
import SketchCard from "./SketchCard"
import SketchLightbox from "./SketchLightbox"

type Props = {
  origin: { x: number; y: number }
  reducedMotion: boolean
  onClosed: () => void
}

// Hand-placed slots for the desktop "pinned to the desk" composition. Repeats every
// PAGE px so any number of uploads works. left/width in %, top in px.
const SLOTS = [
  { l: 1, t: 30, w: 36, r: -3.5, z: 2 },
  { l: 39, t: 0, w: 31, r: 2.5, z: 3 },
  { l: 72, t: 70, w: 27, r: -2, z: 2 },
  { l: 6, t: 330, w: 19, r: 2.2, z: 4, portrait: true },
  { l: 30, t: 300, w: 38, r: -1.2, z: 5 },
  { l: 71, t: 380, w: 28, r: 3.4, z: 3 },
  { l: 45, t: 560, w: 18, r: -3, z: 6, portrait: true },
]
const PAGE = 820

export default function SketchbookOverlay({ origin, reducedMotion, onClosed }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inkRef = useRef<SVGSVGElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [sketches, setSketches] = useState<Sketch[] | null>(null)
  const [active, setActive] = useState<number | null>(null)
  const closing = useRef(false)

  useEffect(() => {
    getSketches().then(setSketches)
    const unsub = subscribeSketches(setSketches)
    return () => void unsub()
  }, [])

  // Lock page scroll without layout shift.
  useEffect(() => {
    const { body, documentElement } = document
    const gap = window.innerWidth - documentElement.clientWidth
    const prev = { o: body.style.overflow, p: body.style.paddingRight }
    body.style.overflow = "hidden"
    body.style.paddingRight = `${gap}px`
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      body.style.overflow = prev.o
      body.style.paddingRight = prev.p
    }
  }, [])

  const radius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  )

  // Ink reveal: clip-path circle grows from the bubble, an ink ring races ahead of it.
  useLayoutEffect(() => {
    const root = rootRef.current!
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.2 })
        return
      }
      const at = `${origin.x}px ${origin.y}px`
      gsap
        .timeline()
        .fromTo(root, { clipPath: `circle(0px at ${at})` }, { clipPath: `circle(${radius}px at ${at})`, duration: 0.9, ease: "expo.inOut" })
        .fromTo(inkRef.current, { scale: 0.05, opacity: 1 }, { scale: 1, opacity: 0, duration: 1, ease: "expo.out" }, 0.1)
        .from(".sb-head > *", { y: 14, opacity: 0, stagger: 0.06, duration: 0.5, ease: "expo.out" }, 0.45)
    }, root)
    return () => ctx.revert()
  }, [origin.x, origin.y, radius, reducedMotion])

  // Cards enter once data arrives.
  useLayoutEffect(() => {
    if (!sketches || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from(".sb-card-wrap", {
        y: 28,
        opacity: 0,
        rotate: (i) => (i % 2 ? 4 : -4),
        duration: 0.7,
        stagger: 0.07,
        ease: "expo.out",
        delay: 0.5,
        clearProps: "transform,opacity",
      })
    }, rootRef)
    return () => ctx.revert()
  }, [sketches, reducedMotion])

  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    const root = rootRef.current!
    if (reducedMotion) {
      gsap.to(root, { opacity: 0, duration: 0.18, onComplete: onClosed })
      return
    }
    const at = `${origin.x}px ${origin.y}px`
    gsap.to(root, { clipPath: `circle(0px at ${at})`, duration: 0.6, ease: "expo.inOut", onComplete: onClosed })
  }, [onClosed, origin.x, origin.y, reducedMotion])

  const total = sketches?.length ?? 0

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        if (active !== null) setActive(null)
        else close()
      } else if (active !== null && total && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault()
        setActive((i) => ((i ?? 0) + (e.key === "ArrowRight" ? 1 : -1) + total) % total)
      } else if (e.key === "Tab") {
        // Keep focus inside whichever dialog is on top.
        const scope = document.querySelector<HTMLElement>(active !== null ? ".sketch-lightbox" : ".sketchbook-overlay")
        const nodes = scope?.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])")
        if (!nodes?.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [active, close, total])

  const lastActive = useRef<number | null>(null)
  const openSketch = (i: number) => {
    lastActive.current = i
    setActive(i)
  }
  const closeLightbox = () => {
    setActive(null)
    const i = lastActive.current
    requestAnimationFrame(() => rootRef.current?.querySelectorAll<HTMLElement>(".sketch-card")[i ?? 0]?.focus())
  }

  const pages = Math.max(1, Math.ceil(total / SLOTS.length))

  return (
    <>
      <div
        ref={rootRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sketchbook-title"
        className="sketchbook-overlay fixed inset-0 z-[var(--z-overlay)] overflow-y-auto overscroll-contain bg-bg"
      >
        <svg
          ref={inkRef}
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="pointer-events-none fixed origin-center"
          style={{ left: origin.x - radius, top: origin.y - radius, width: radius * 2, height: radius * 2 }}
        >
          <path
            d="M100 6c38 1 70 24 86 54 14 27 10 64-10 89-21 27-58 45-93 40C47 185 16 160 8 125 0 92 13 52 40 28 56 14 77 5 100 6Z"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.4"
          />
        </svg>

        {/* Ruled-paper texture in the brand's line colour */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 opacity-60"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 31px, rgb(255 255 255 / 0.035) 31px 32px), radial-gradient(ellipse at 20% 0%, rgba(var(--accent-rgb), 0.06), transparent 55%)",
          }}
        />

        <div className="relative mx-auto max-w-[1280px] px-5 pb-24 pt-6 md:px-10 md:pt-10">
          <header className="sb-head sticky top-0 z-40 -mx-5 flex items-start justify-between gap-6 bg-gradient-to-b from-bg via-bg/90 to-transparent px-5 pb-8 pt-2 md:-mx-10 md:px-10">
            <div>
              <p className="font-mono text-eyebrow uppercase tracking-[0.18em] text-accent">~/sketchbook</p>
              <h2 id="sketchbook-title" className="relative mt-2 inline-block text-h1 font-bold tracking-tight text-fg">
                Off the clock
                <svg aria-hidden="true" viewBox="0 0 300 14" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full">
                  <path d="M3 9c40-6 90-7 140-4s100 4 154-3" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </h2>
              <p className="mt-5 max-w-md text-body text-text-secondary">
                Pen, graphite and the occasional watercolour. Where I practice seeing before I practice building.
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close sketchbook"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-line-bright bg-surface text-fg transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="size-5" />
            </button>
          </header>

          {sketches && total === 0 && (
            <p className="py-24 text-center font-mono text-caption text-text-tertiary">No sketches uploaded yet.</p>
          )}

          {/* Desktop: scattered desk composition */}
          {sketches && total > 0 && (
            <div className="relative hidden md:block" style={{ height: pages * PAGE + 120 }}>
              {sketches.map((s, i) => {
                const slot = SLOTS[i % SLOTS.length]
                const page = Math.floor(i / SLOTS.length)
                const isPortrait = (s.height ?? 1) > (s.width ?? 1)
                return (
                  <div
                    key={s.id}
                    className="sb-card-wrap absolute"
                    style={{
                      left: `${slot.l}%`,
                      top: slot.t + page * PAGE,
                      width: `${isPortrait && !slot.portrait ? slot.w * 0.6 : slot.w}%`,
                      zIndex: slot.z,
                    }}
                  >
                    <SketchCard sketch={s} index={i} onOpen={openSketch} variant="scatter" tilt={slot.r} />
                  </div>
                )
              })}
            </div>
          )}

          {/* Mobile: vertical scrapbook */}
          {sketches && total > 0 && (
            <ol className="flex flex-col gap-10 md:hidden">
              {sketches.map((s, i) => (
                <li key={s.id} className={`sb-card-wrap ${i % 2 ? "ml-6" : "mr-6"}`}>
                  <SketchCard sketch={s} index={i} onOpen={openSketch} variant="scrapbook" />
                  <p className="mt-3 px-1 text-caption text-text-secondary">{s.caption}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {sketches && active !== null && sketches[active] && (
        <SketchLightbox sketches={sketches} index={active} onClose={closeLightbox} onNavigate={setActive} />
      )}
    </>
  )
}
