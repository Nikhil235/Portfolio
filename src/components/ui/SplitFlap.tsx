import { useCallback, useEffect, useRef, useState } from "react"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const rand = () => CHARS[(Math.random() * CHARS.length) | 0]

/**
 * Split-flap (Solari board) text. On hover/focus each letter flips through
 * random glyphs left-to-right, then lands on the real letter.
 * The real letter is always rendered invisibly underneath to lock width (no layout shift).
 */
export default function SplitFlap({ text, className = "" }: { text: string; className?: string }) {
  const [shown, setShown] = useState<string[]>(() => text.split(""))
  const [flips, setFlips] = useState<number[]>(() => text.split("").map(() => 0))
  const timers = useRef<number[]>([])
  const running = useRef(false)

  const clear = () => {
    timers.current.forEach((t) => clearTimeout(t))
    timers.current = []
  }
  useEffect(() => clear, [])

  const run = useCallback(() => {
    if (running.current) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    running.current = true
    clear()
    const letters = text.split("")
    let remaining = letters.length

    letters.forEach((ch, i) => {
      if (ch === " ") { remaining--; return }
      const cycles = 5 + i // later letters flip longer: a left-to-right cascade
      for (let c = 0; c <= cycles; c++) {
        timers.current.push(
          window.setTimeout(() => {
            setShown((s) => {
              const n = [...s]
              n[i] = c === cycles ? ch : rand()
              return n
            })
            setFlips((f) => {
              const n = [...f]
              n[i]++
              return n
            })
            if (c === cycles && --remaining === 0) running.current = false
          }, i * 35 + c * 100),
        )
      }
    })
  }, [text])

  return (
    <span
      onMouseEnter={run}
      onFocus={run}
      tabIndex={-1}
      className={`inline-block cursor-default ${className}`}
    >
      <span className="sr-only">{text}</span>
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i} aria-hidden>
            {" "}
          </span>
        ) : (
          <span key={i} aria-hidden className="flap-cell relative inline-block">
            <span className="invisible">{ch}</span>
            <span key={flips[i]} className={`absolute inset-0 text-center ${flips[i] ? "flap-anim" : ""}`}>
              {shown[i]}
            </span>
          </span>
        ),
      )}
    </span>
  )
}
