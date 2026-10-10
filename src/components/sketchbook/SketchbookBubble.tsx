import { Pause, Play, X } from "lucide-react"
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react"
import useReducedMotion from "../../hooks/useReducedMotion"
import { bubbleMotionConfig, getPageIntensity } from "./bubbleMotionConfig"
import { SketchMotionController } from "./SketchMotionController"

// Gallery code + images are not loaded until the bubble is first opened.
const SketchbookOverlay = lazy(() => import("./SketchbookOverlay"))

type Pref = "moving" | "paused" | "hidden"
type Phase = "idle" | "bursting" | "open" | "forming"
const PREF_KEY = "sketchbook-bubble:pref"
const BURST_MS = 420
const FORM_MS = 520
const DROPS = Array.from({ length: 9 }, (_, i) => ({ a: i * 40 + (i % 2 ? 12 : -6), d: 58 + (i % 3) * 14 }))

function readPref(): Pref {
  const v = localStorage.getItem(PREF_KEY)
  return v === "paused" || v === "hidden" ? v : "moving"
}

export default function SketchbookBubble() {
  const reduced = useReducedMotion()
  const btnRef = useRef<HTMLButtonElement>(null)
  const shadowRef = useRef<HTMLSpanElement>(null)
  const ctrlRef = useRef<SketchMotionController | null>(null)
  const [phase, setPhase] = useState<Phase>("idle")
  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  const [pref, setPrefState] = useState<Pref>(readPref)
  const [showControls, setShowControls] = useState(false)
  const mobileOff =
    !bubbleMotionConfig.enabledOnMobile && window.innerWidth < bubbleMotionConfig.breakpoints.mobile
  const animated = !reduced && !mobileOff && pref !== "hidden"

  const setPref = (p: Pref) => {
    localStorage.setItem(PREF_KEY, p)
    setPrefState(p)
  }

  useEffect(() => {
    const t = window.setTimeout(() => setShowControls(true), bubbleMotionConfig.controlsDelayMs)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const el = btnRef.current
    if (!animated || !el) return
    const ctrl = new SketchMotionController(el, shadowRef.current, bubbleMotionConfig, getPageIntensity())
    ctrlRef.current = ctrl
    return () => {
      ctrl.destroy()
      ctrlRef.current = null
      el.style.transform = ""
    }
  }, [animated])

  useEffect(() => {
    const c = ctrlRef.current
    if (!c) return
    if (pref === "paused") c.pause("user")
    else c.resume("user")
  }, [pref, animated])

  useEffect(() => {
    const c = ctrlRef.current
    if (!c || !bubbleMotionConfig.pauseWhenOverlayOpen) return
    if (phase !== "idle") c.pause("overlay")
    else c.resume("overlay")
  }, [phase])

  const hold = (reason: string) => () => bubbleMotionConfig.pauseOnHover && ctrlRef.current?.pause(reason)
  const release = (reason: string) => () => ctrlRef.current?.resume(reason)

  const handleOpen = () => {
    if (phase !== "idle") return
    ctrlRef.current?.pause("overlay")
    const r = btnRef.current!.getBoundingClientRect()
    setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
    setPhase("bursting")
    window.setTimeout(() => setPhase("open"), reduced ? 160 : BURST_MS)
  }

  const handleClosed = useCallback(() => {
    setPhase("forming")
    requestAnimationFrame(() => btnRef.current?.focus({ preventScroll: true }))
    window.setTimeout(() => setPhase("idle"), FORM_MS)
  }, [])

  const pill =
    "flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 py-2 font-mono text-xs text-text-secondary transition-colors hover:bg-surface-raised hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"

  return (
    <>
      {pref !== "hidden" && (
        <button
          ref={btnRef}
          type="button"
          aria-label="Open sketchbook"
          aria-haspopup="dialog"
          aria-expanded={phase === "open"}
          onClick={handleOpen}
          onPointerEnter={hold("hover")}
          onPointerLeave={release("hover")}
          onFocus={hold("focus")}
          onBlur={release("focus")}
          className={`sketch-bubble group fixed z-[39] size-[88px] rounded-full outline-none will-change-transform sm:size-[104px] lg:size-[120px] ${
            animated ? "left-0 top-0" : "bottom-[max(4.5rem,calc(env(safe-area-inset-bottom)+3.5rem))] right-6"
          } ${phase === "bursting" ? "sb-pop" : ""} ${phase === "open" ? "pointer-events-none opacity-0" : ""} ${
            phase === "forming" ? "sb-form" : ""
          }`}
        >
          <span className="sketch-bubble__face relative grid size-full place-items-center rounded-full">
            {/* Soap-bubble film: clear centre, iridescent rim, two specular highlights */}
            <span aria-hidden="true" className="sketch-bubble__film absolute inset-0 rounded-full" />
            <span aria-hidden="true" className="absolute left-[18%] top-[14%] h-[22%] w-[34%] -rotate-[30deg] rounded-full bg-white/55 blur-[2px]" />
            <span aria-hidden="true" className="absolute bottom-[16%] right-[20%] size-[9%] rounded-full bg-white/40 blur-[1px]" />
            <span className="relative font-mono text-[0.7rem] uppercase tracking-[0.2em] text-fg/85 sm:text-[0.75rem]">sketch</span>
          </span>
          <span
            ref={shadowRef}
            aria-hidden="true"
            className="sb-shadow pointer-events-none absolute inset-x-4 -bottom-3 -z-10 h-1/4 rounded-full bg-black/40 blur-lg"
            style={{ transform: "translate3d(0, 8px, 0)" }}
          />
          {phase === "bursting" && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-0">
              <span className="sb-ring absolute inset-0 rounded-full" />
              {DROPS.map((d, i) => (
                <span
                  key={i}
                  className="sb-drop absolute left-1/2 top-1/2 size-1.5 rounded-full"
                  style={{ ["--a" as string]: `${d.a}deg`, ["--d" as string]: `${d.d}px` }}
                />
              ))}
            </span>
          )}
          <span
            role="tooltip"
            className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-control border border-line-bright bg-surface-raised px-3 py-1.5 font-mono text-caption text-fg opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            Open Sketchbook
          </span>
        </button>
      )}

      {/* Visitor control: appears after a few seconds, choice persists */}
      <div
        className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[39] flex items-center rounded-full border border-line bg-surface/85 p-0.5 shadow-card backdrop-blur transition-opacity duration-500 ${
          showControls && phase === "idle" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showControls}
      >
        {pref === "hidden" ? (
          <button type="button" className={pill} onClick={() => setPref("moving")} tabIndex={showControls ? 0 : -1}>
            <Play className="size-3" aria-hidden="true" /> Show sketchbook
          </button>
        ) : (
          <>
            {!reduced && (
              <button
                type="button"
                className={pill}
                onClick={() => setPref(pref === "paused" ? "moving" : "paused")}
                aria-pressed={pref === "paused"}
                tabIndex={showControls ? 0 : -1}
              >
                {pref === "paused" ? <Play className="size-3" aria-hidden="true" /> : <Pause className="size-3" aria-hidden="true" />}
                {pref === "paused" ? "Resume" : "Pause"}
              </button>
            )}
            <button type="button" className={pill} onClick={() => setPref("hidden")} aria-label="Hide sketchbook bubble" tabIndex={showControls ? 0 : -1}>
              <X className="size-3" aria-hidden="true" /> Hide
            </button>
          </>
        )}
      </div>

      {phase === "open" && (
        <Suspense fallback={null}>
          <SketchbookOverlay origin={origin} reducedMotion={reduced} onClosed={handleClosed} />
        </Suspense>
      )}
    </>
  )
}
