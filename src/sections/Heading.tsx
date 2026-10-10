import type { ReactNode } from "react"

/** Section header: numbered eyebrow, title, optional supporting copy and action. */
export default function Heading({
  n,
  title,
  eyebrow,
  intro,
  action,
  id,
}: {
  n: string
  title: string
  eyebrow?: string
  intro?: string
  action?: ReactNode
  id?: string
}) {
  return (
    <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
      <div className="max-w-2xl">
        <p className="font-mono text-eyebrow uppercase tracking-[0.16em] text-accent">
          {n} <span className="text-text-tertiary">/ {eyebrow ?? title}</span>
        </p>
        <h2 id={id} className="mt-3 text-h2 font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        {intro && <p className="mt-4 text-body-lg text-text-secondary">{intro}</p>}
      </div>
      {action}
    </div>
  )
}
