import { profile } from "../../data/portfolio"

export default function ModalAbout() {
  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-xs text-accent uppercase tracking-wider">
          Profile &amp; Philosophy
        </span>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          {profile.name}
        </h2>
        <p className="mt-2 font-mono text-sm text-accent">
          {profile.role} · Bangalore, India (Open to Remote Worldwide)
        </p>
      </div>

      <div className="space-y-4 text-base leading-relaxed text-fg/80">
        {profile.about.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* Core Values / Tags */}
      <div className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          // Core Philosophy &amp; Values
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {profile.values.map((v) => (
            <div
              key={v.title}
              className="rounded-xl border border-line bg-panel-elevated p-4"
            >
              <h4 className="font-mono text-sm font-semibold text-accent">
                {v.title}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Hunt */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 font-mono text-xs text-fg">
        <span className="font-semibold text-accent">
          ● Structured Search Status:
        </span>{" "}
        Actively seeking full-time or contract positions as a{" "}
        <strong className="text-accent">UI Developer</strong>,{" "}
        <strong className="text-accent">Frontend Designer</strong>, or{" "}
        <strong className="text-accent">
          Product Designer (Design Systems)
        </strong>
        .
      </div>
    </div>
  )
}
