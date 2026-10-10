import { useEffect, useRef } from "react"

interface Tile {
  x: number
  y: number
  alpha: number
  targetAlpha: number
  color: string
}

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Decorative only: skip on reduced motion and touch-first devices to save battery.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    )
      return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const gridSize = 48
    let cols = Math.ceil(width / gridSize)
    let rows = Math.ceil(height / gridSize)

    const tiles: Map<string, Tile> = new Map()

    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      cols = Math.ceil(width / gridSize)
      rows = Math.ceil(height / gridSize)
    }
    window.addEventListener("resize", onResize)

    // Trigger random ambient tile lights
    const ambientInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        const c = Math.floor(Math.random() * cols)
        const r = Math.floor(Math.random() * rows)
        const key = `${c},${r}`
        const current = tiles.get(key)
        if (!current || current.alpha < 0.05) {
          tiles.set(key, {
            x: c * gridSize,
            y: r * gridSize,
            alpha: 0,
            targetAlpha: 0.12 + Math.random() * 0.15,
            color:
              Math.random() > 0.8
                ? "rgba(184, 243, 107, "
                : "rgba(255, 255, 255, ",
          })
        }
      }
    }, 280)

    const onMouseMove = (e: MouseEvent) => {
      const c = Math.floor(e.clientX / gridSize)
      const r = Math.floor(e.clientY / gridSize)
      const key = `${c},${r}`
      tiles.set(key, {
        x: c * gridSize,
        y: r * gridSize,
        alpha: 0.35,
        targetAlpha: 0,
        color: "rgba(184, 243, 107, ",
      })
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true })

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw subtle grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)"
      ctx.lineWidth = 1

      ctx.beginPath()
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()

      // Render glowing tiles
      tiles.forEach((tile, key) => {
        // Interpolate alpha
        tile.alpha += (tile.targetAlpha - tile.alpha) * 0.08
        if (tile.alpha < 0.01 && tile.targetAlpha === 0) {
          tiles.delete(key)
          return
        }

        ctx.fillStyle = `${tile.color}${tile.alpha})`
        ctx.fillRect(tile.x + 1, tile.y + 1, gridSize - 2, gridSize - 2)

        // When target is reached, fade out
        if (Math.abs(tile.alpha - tile.targetAlpha) < 0.02) {
          tile.targetAlpha = 0
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    // Pause the loop while the tab is hidden
    const onVisibility = () => {
      cancelAnimationFrame(animationFrameId)
      if (!document.hidden) animationFrameId = requestAnimationFrame(render)
    }
    document.addEventListener("visibilitychange", onVisibility)

    render()

    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("visibilitychange", onVisibility)
      clearInterval(ambientInterval)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
      aria-hidden="true"
    />
  )
}
