import { useEffect, useRef, useState } from "react"
import { stackNodes, stackConnections } from "../../data/portfolio"

export default function ModalStack() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height

    const nodes = stackNodes.map((n, i) => {
      const angle = (i / stackNodes.length) * Math.PI * 2
      const radius = Math.min(w, h) * 0.35
      return {
        ...n,
        currentX: w / 2 + Math.cos(angle) * radius,
        currentY: h / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }
    })

    const render = () => {
      ctx.clearRect(0, 0, w, h)

      // Draw connections
      stackConnections.forEach(([fromId, toId]) => {
        const fromNode = nodes.find((n) => n.id === fromId)
        const toNode = nodes.find((n) => n.id === toId)
        if (!fromNode || !toNode) return

        const isHighlighted = hoveredNode === fromId || hoveredNode === toId

        ctx.beginPath()
        ctx.moveTo(fromNode.currentX, fromNode.currentY)
        ctx.lineTo(toNode.currentX, toNode.currentY)
        ctx.strokeStyle = isHighlighted
          ? "rgba(184, 243, 107, 0.75)"
          : "rgba(255, 255, 255, 0.08)"
        ctx.lineWidth = isHighlighted ? 2 : 1
        ctx.stroke()
      })

      // Draw and update nodes
      nodes.forEach((node) => {
        node.currentX += node.vx
        node.currentY += node.vy

        if (node.currentX < 40 || node.currentX > w - 40) node.vx *= -1
        if (node.currentY < 40 || node.currentY > h - 40) node.vy *= -1

        const isHovered = hoveredNode === node.id

        // Node Glow
        if (isHovered) {
          ctx.beginPath()
          ctx.arc(node.currentX, node.currentY, 18, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(184, 243, 107, 0.25)"
          ctx.fill()
        }

        // Node Circle
        ctx.beginPath()
        ctx.arc(node.currentX, node.currentY, isHovered ? 8 : 6, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Label
        ctx.font = isHovered ? "600 12px monospace" : "500 11px monospace"
        ctx.fillStyle = isHovered ? "#ffffff" : "#92929e"
        ctx.textAlign = "center"
        ctx.fillText(node.label, node.currentX, node.currentY + 20)
      })

      animId = requestAnimationFrame(render)
    }

    render()

    const handleMouseMove = (e: MouseEvent) => {
      const bound = canvas.getBoundingClientRect()
      const mx = e.clientX - bound.left
      const my = e.clientY - bound.top

      let found: string | null = null
      nodes.forEach((node) => {
        const dx = node.currentX - mx
        const dy = node.currentY - my
        if (Math.sqrt(dx * dx + dy * dy) < 25) {
          found = node.id
        }
      })
      setHoveredNode(found)
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [hoveredNode])

  return (
    <div className="space-y-6">
      <div>
        <span className="font-mono text-xs text-accent uppercase tracking-wider">
          System Constellation
        </span>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Interactive Technology Constellation
        </h2>
        <p className="mt-1 text-sm text-muted">
          Everything connects. Move your pointer over nodes to illuminate reciprocal dependencies.
        </p>
      </div>

      {/* Interactive Canvas Graph */}
      <div className="relative h-80 w-full overflow-hidden rounded-xl border border-line bg-black">
        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-crosshair"
          aria-label="Interactive technology graph canvas"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs sm:grid-cols-4">
        <div className="rounded-lg border border-line bg-panel-elevated p-3">
          <span className="text-muted block text-[10px]">DESIGN</span>
          <span className="font-semibold text-fg">Figma + Tokens</span>
        </div>
        <div className="rounded-lg border border-line bg-panel-elevated p-3">
          <span className="text-muted block text-[10px]">ENGINEERING</span>
          <span className="font-semibold text-fg">React 19 + TS</span>
        </div>
        <div className="rounded-lg border border-line bg-panel-elevated p-3">
          <span className="text-muted block text-[10px]">MOTION</span>
          <span className="font-semibold text-fg">GSAP + Physics</span>
        </div>
        <div className="rounded-lg border border-line bg-panel-elevated p-3">
          <span className="text-muted block text-[10px]">AI AGENTS</span>
          <span className="font-semibold text-fg">Claude + MCP</span>
        </div>
      </div>
    </div>
  )
}
