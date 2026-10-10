import type { BubbleMotionConfig } from "./bubbleMotionConfig"

type Mode = "desktop" | "tablet" | "mobile"
type Frame = { x: number; y: number; rot: number; scale: number; vx: number; vy: number }

const TAU = Math.PI * 2
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Deterministic requestAnimationFrame controller. Position is a pure function of loop
 * progress, so pausing/resuming never jumps. Pauses are immediate; resumes ease in.
 * Only writes `transform` (compositor-friendly).
 */
export class SketchMotionController {
  private progress = Math.random() * 0.2
  private speed = 0
  private raf = 0
  private last = 0
  private reasons = new Set<string>()
  private timers = new Map<string, number>()
  private vw = 0
  private vh = 0
  private safeBottom = 0
  private safeRight = 0
  private probe: HTMLDivElement
  private pos = { x: 0, y: 0 }

  constructor(
    private el: HTMLElement,
    private shadow: HTMLElement | null,
    private config: BubbleMotionConfig,
    private intensity: "full" | "subtle" = "full",
  ) {
    this.probe = document.createElement("div")
    this.probe.style.cssText =
      "position:fixed;visibility:hidden;pointer-events:none;padding-bottom:env(safe-area-inset-bottom,0px);padding-right:env(safe-area-inset-right,0px)"
    document.body.appendChild(this.probe)
    this.measure()
    window.addEventListener("resize", this.measure)
    window.addEventListener("scroll", this.onScroll, { passive: true })
    window.addEventListener("pointermove", this.onPointerMove, { passive: true })
    window.addEventListener("pointerdown", this.onInteract, { passive: true })
    window.addEventListener("keydown", this.onInteract)
    document.addEventListener("visibilitychange", this.onVisibility)
    this.render(this.frameAt(this.progress))
    this.start()
  }

  get mode(): Mode {
    const { tablet, mobile } = this.config.breakpoints
    return this.vw < mobile ? "mobile" : this.vw < tablet ? "tablet" : "desktop"
  }

  pause(reason: string) {
    this.reasons.add(reason)
    this.speed = 0 // stop immediately, no drift
  }

  resume(reason: string) {
    this.reasons.delete(reason)
    this.start()
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.timers.forEach((t) => clearTimeout(t))
    window.removeEventListener("resize", this.measure)
    window.removeEventListener("scroll", this.onScroll)
    window.removeEventListener("pointermove", this.onPointerMove)
    window.removeEventListener("pointerdown", this.onInteract)
    window.removeEventListener("keydown", this.onInteract)
    document.removeEventListener("visibilitychange", this.onVisibility)
    this.probe.remove()
  }

  private pauseFor(reason: string, ms: number) {
    this.pause(reason)
    clearTimeout(this.timers.get(reason))
    this.timers.set(reason, window.setTimeout(() => this.resume(reason), ms))
  }

  private onScroll = () => this.pauseFor("scroll", this.config.scrollPauseMs)
  private onInteract = () => this.pauseFor("interaction", this.config.interactionPauseMs)

  private onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return
    const half = this.config.size[this.mode] / 2
    const near = Math.hypot(e.clientX - (this.pos.x + half), e.clientY - (this.pos.y + half)) < this.config.cursorAvoidRadius
    if (near && !this.reasons.has("cursor")) this.pause("cursor")
    else if (!near && this.reasons.has("cursor")) this.resume("cursor")
  }

  private measure = () => {
    this.vw = window.innerWidth
    this.vh = window.innerHeight
    const cs = getComputedStyle(this.probe)
    this.safeBottom = parseFloat(cs.paddingBottom) || 0
    this.safeRight = parseFloat(cs.paddingRight) || 0
    if (!this.raf) this.render(this.frameAt(this.progress))
  }

  private onVisibility = () => {
    if (document.hidden) {
      this.pause("hidden")
      cancelAnimationFrame(this.raf)
      this.raf = 0
    } else this.resume("hidden")
  }

  private start() {
    if (this.raf || document.hidden || this.reasons.size) return
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  private tick = (now: number) => {
    const dt = Math.min(now - this.last, 64)
    this.last = now
    if (this.reasons.size) {
      this.raf = 0
      return
    }
    // Gentle ~600ms ease back up to full speed.
    this.speed += (1 - this.speed) * (1 - Math.exp(-dt / 600))
    const subtle = this.intensity === "subtle" ? this.config.subtle.durationMultiplier : 1
    const duration = this.config.duration * this.config.durationMultiplier[this.mode] * subtle
    this.progress = (this.progress + (dt * this.speed) / duration) % 1
    this.render(this.frameAt(this.progress))
    this.raf = requestAnimationFrame(this.tick)
  }

  private position(p: number) {
    const c = this.config
    const mode = this.mode
    const size = c.size[mode]
    const m = c.edgeMargin[mode]
    const range = this.intensity === "subtle" ? c.subtle.rangeMultiplier : 1
    const maxX = this.vw - size - m - this.safeRight
    const maxY = this.vh - size - m - this.safeBottom - c.bottomClearance
    const w = Math.min(c.area[mode].width, this.vw * c.areaMaxFraction.width) * range
    const h = Math.min(c.area[mode].height, this.vh * c.areaMaxFraction.height) * range
    const minX = Math.max(m, maxX - w)
    const minY = Math.max(c.topClearance + m, maxY - h)
    const rx = (maxX - minX) / 2
    const ry = (maxY - minY) / 2
    const cx = minX + rx
    const cy = minY + ry
    const t = p * TAU
    const tiny = this.vw < c.tinyViewport.width || this.vh < c.tinyViewport.height

    if (c.pathStyle === "edge" || tiny || this.intensity === "subtle") {
      // Hug the right edge; breathe inward only slightly.
      return {
        x: maxX - rx * 0.35 * (0.5 + 0.5 * Math.sin(2 * t + 0.6)),
        y: cy + ry * (0.85 * Math.sin(t) + 0.15 * Math.sin(3 * t + 0.4)),
      }
    }

    // Small closed loop of layered harmonics inside the corner zone.
    return {
      x: cx + rx * (0.7 * Math.sin(t + 0.3) + 0.3 * Math.sin(2 * t + 1.9)),
      y: cy + ry * (0.65 * Math.sin(2 * t) + 0.35 * Math.cos(3 * t + 0.8)),
    }
  }

  private frameAt(p: number): Frame {
    const a = this.position(p)
    const b = this.position((p + 0.0015) % 1)
    const t = p * TAU
    const [r0, r1] = this.config.rotationRange
    const [s0, s1] = this.config.scaleRange
    return {
      ...a,
      vx: b.x - a.x,
      vy: b.y - a.y,
      rot: lerp(r0, r1, 0.5 + 0.5 * Math.sin(3 * t + 0.4)),
      scale: lerp(s0, s1, 0.5 + 0.5 * Math.sin(5 * t + 1.7)),
    }
  }

  private render(f: Frame) {
    this.pos = { x: f.x, y: f.y }
    this.el.style.transform = `translate3d(${f.x.toFixed(2)}px, ${f.y.toFixed(2)}px, 0)`
    const face = this.el.firstElementChild as HTMLElement | null
    if (face) face.style.transform = `rotate(${f.rot.toFixed(2)}deg) scale(${f.scale.toFixed(3)})`
    if (this.shadow) {
      const len = Math.hypot(f.vx, f.vy) || 1
      const sx = (-f.vx / len) * 4
      const sy = 8 + (-f.vy / len) * 3
      this.shadow.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) scale(${(2 - f.scale).toFixed(3)})`
    }
  }
}
