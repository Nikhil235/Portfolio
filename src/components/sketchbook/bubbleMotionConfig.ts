/** Single source of truth for the Sketchbook Bubble's personality. */
export const bubbleMotionConfig = {
  /** ms per gentle journey (loop) on desktop. Keep within 25–40s. Tablet/mobile multiply this. */
  duration: 32000,
  /** "organic" = small wandering loop inside the corner zone; "edge" = slow drift along the right edge. */
  pathStyle: "organic" as "organic" | "edge",
  pauseOnHover: true,
  pauseWhenOverlayOpen: true,
  rotationRange: [-4, 4] as [number, number],
  scaleRange: [0.97, 1.03] as [number, number],
  enabledOnMobile: true,
  /**
   * Movement zone, anchored to the bottom-right corner (away from the nav, the hero
   * headline and the primary CTAs on the left). Values are px and also capped by
   * `areaMaxFraction` of the viewport.
   */
  area: {
    desktop: { width: 320, height: 260 },
    tablet: { width: 220, height: 200 },
    mobile: { width: 120, height: 150 },
  },
  areaMaxFraction: { width: 0.3, height: 0.4 },
  /** Pause while the cursor is within this many px of the bubble's centre. */
  cursorAvoidRadius: 170,
  /** Pause during scrolling, resuming this long after the last scroll event. */
  scrollPauseMs: 900,
  /** Pause after any click/keypress elsewhere on the page. */
  interactionPauseMs: 1600,
  /** Delay before the Pause / Hide control appears. */
  controlsDelayMs: 4000,
  /** Space kept free under the zone for the Pause / Hide control (px). */
  bottomClearance: 52,
  /** Fixed nav height to stay clear of (px). */
  topClearance: 72,
  breakpoints: { tablet: 1024, mobile: 640 },
  /** Below either dimension the path collapses to the "edge" style. */
  tinyViewport: { width: 380, height: 560 },
  durationMultiplier: { desktop: 1, tablet: 1.15, mobile: 1.25 },
  edgeMargin: { desktop: 32, tablet: 24, mobile: 16 },
  size: { desktop: 120, tablet: 104, mobile: 88 },
  /**
   * Page intensity. "full" on the landing page; "subtle" (edge drift, half range,
   * slower) everywhere else such as project/detail pages.
   */
  landingPaths: ["/", "/index.html"],
  subtle: { durationMultiplier: 1.3, rangeMultiplier: 0.5 },
}

export type BubbleMotionConfig = typeof bubbleMotionConfig

export function getPageIntensity(config: BubbleMotionConfig = bubbleMotionConfig): "full" | "subtle" {
  const path = window.location.pathname.replace(import.meta.env.BASE_URL.replace(/\/$/, ""), "") || "/"
  return config.landingPaths.includes(path) ? "full" : "subtle"
}
