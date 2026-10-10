import { artOrigin } from "../../data/portfolio"

export default function ModalArt() {
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
