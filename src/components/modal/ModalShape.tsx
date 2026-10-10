import { Sparkles } from "lucide-react"
import { claudeSkills, shapeFramework } from "../../data/portfolio"

export default function ModalShape() {
  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-xs text-accent uppercase tracking-wider">
          Product Methodology
        </span>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          {shapeFramework.title}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {shapeFramework.subtitle}
        </p>
      </div>

      {/* SHAPE Steps */}
      <div className="space-y-3">
        {shapeFramework.steps.map((st) => (
          <div
            key={st.letter}
            className="flex items-start gap-4 rounded-xl border border-line bg-panel-elevated p-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/15 font-mono text-xl font-bold text-accent">
              {st.letter}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-semibold text-fg">
                  {st.title}
                </h4>
                <span className="font-mono text-xs text-muted">
                  — {st.tagline}
                </span>
              </div>
              <p className="mt-1 text-xs text-fg/80 leading-relaxed">
                {st.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Claude Skills & Agentic Coding */}
      <div className="space-y-3 pt-4 border-t border-line">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" aria-hidden="true" />
          <h3 className="font-mono text-sm font-semibold text-fg">
            Agentic Coding Skills &amp; /prompt-master
          </h3>
        </div>
        <p className="text-xs text-muted">
          I transformed prominent design principles and CRO literature into automated Claude skills for production consistency.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {claudeSkills.map((sk) => (
            <div
              key={sk.name}
              className="rounded-lg border border-line bg-bg p-3.5 font-mono text-xs"
            >
              <div className="font-semibold text-accent">{sk.name}</div>
              <p className="mt-1 text-[11px] text-muted leading-relaxed font-sans">
                {sk.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
