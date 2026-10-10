import { useState } from "react"
import { ArrowUpRight, CheckCircle2, ExternalLink } from "lucide-react"
import { projects, type Project } from "../../data/portfolio"
import { useKeySound } from "../../hooks/useKeySound"

export default function ModalProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const playClick = useKeySound()

  return (
    <div className="space-y-6">
      <div>
        <span className="font-mono text-xs text-accent uppercase tracking-wider">
          Case Studies &amp; Work
        </span>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Selected Design Engineering Projects
        </h2>
        <p className="mt-1 text-sm text-muted">
          Click any project card to inspect deep interaction details, system architecture, and live links.
        </p>
      </div>

      {/* Detailed View if selected */}
      {selectedProject ? (
        <div className="rounded-xl border border-line bg-panel-elevated p-6 space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <button
              onClick={() => {
                playClick()
                setSelectedProject(null)
              }}
              className="font-mono text-xs text-accent hover:underline flex items-center gap-1 min-h-[36px]"
            >
              ← Back to all projects
            </button>
            <span className="font-mono text-xs text-muted">
              {selectedProject.year} · {selectedProject.category}
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-fg">
              {selectedProject.title}
            </h3>
            <p className="mt-1 font-mono text-sm text-accent">
              {selectedProject.subtitle}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fg/80">
              {selectedProject.longDesc}
            </p>
          </div>

          {selectedProject.metrics && (
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-3.5 font-mono text-xs text-accent">
              ⚡ Key Result: {selectedProject.metrics}
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted">
              // Architectural Highlights
            </h4>
            <ul className="space-y-1.5 text-xs text-fg/80">
              {selectedProject.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2
                    size={13}
                    className="text-accent mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {selectedProject.stack.map((s) => (
              <span
                key={s}
                className="rounded bg-bg px-2.5 py-1 font-mono text-xs text-muted border border-line"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-line font-mono text-xs">
            {selectedProject.liveUrl && selectedProject.liveUrl !== "#" && (
              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-bg font-medium hover:brightness-110"
              >
                Visit Live App <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            )}
            {selectedProject.githubUrl && (
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-line px-4 py-2 text-fg hover:border-accent hover:text-accent"
              >
                GitHub Spec <ExternalLink size={13} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      ) : (
        /* Projects Grid */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                playClick()
                setSelectedProject(p)
              }}
              className="group flex flex-col text-left rounded-xl border border-line bg-panel-elevated p-4 transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {/* Browser mock topbar */}
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-muted/40" />
                  <span className="h-2 w-2 rounded-full bg-muted/40" />
                  <span className="h-2 w-2 rounded-full bg-muted/40" />
                </div>
                <span className="font-mono text-[10px] text-muted">
                  {p.category}
                </span>
              </div>

              {/* Accent Color Band */}
              <div
                className="mt-3 h-1.5 w-12 rounded-full"
                style={{ backgroundColor: p.accentColor }}
                aria-hidden="true"
              />

              <h3 className="mt-3 text-lg font-semibold text-fg group-hover:text-accent transition">
                {p.title}
              </h3>
              <p className="mt-1 text-xs text-muted line-clamp-2">
                {p.desc}
              </p>

              <div className="mt-auto pt-4 flex flex-wrap gap-1 font-mono text-[10px] text-muted">
                {p.stack.slice(0, 3).map((st) => (
                  <span
                    key={st}
                    className="rounded bg-bg px-1.5 py-0.5"
                  >
                    {st}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
