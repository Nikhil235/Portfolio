import { ArrowUpRight } from "lucide-react"
import Heading from "./Heading"
import Button from "../components/ui/Button"
import { projects, type Project } from "../data/portfolio"
import { useKeySound } from "../hooks/useKeySound"

function ProjectCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <article className="reveal group relative flex h-full flex-col rounded-card border border-border bg-surface p-6 shadow-[var(--shadow-card)] transition-[border-color,box-shadow,transform] duration-[var(--dur-micro)] ease-[var(--ease-standard)] hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-card-hover)] focus-within:border-border-strong sm:p-7">
      <div className="flex items-center justify-between font-mono text-eyebrow text-text-tertiary">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.accentColor }} aria-hidden />
          {p.category}
        </span>
        <span>{p.year}</span>
      </div>

      <h3 className="mt-5 text-h3 font-semibold tracking-tight text-text-primary">
        {/* Stretched link: whole card is clickable, but one real focusable control */}
        <button onClick={onOpen} className="text-left after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none">
          {p.title}
        </button>
      </h3>
      <p className="mt-2 text-body text-text-secondary">{p.desc}</p>

      {p.metrics && (
        <p className="mt-5 border-l-2 pl-3 text-caption font-medium text-text-primary" style={{ borderColor: p.accentColor }}>
          {p.metrics}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
        <ul className="flex flex-wrap gap-1.5 font-mono text-[11px] text-text-tertiary" aria-label="Stack">
          {p.stack.slice(0, 3).map((s) => (
            <li key={s} className="rounded-md border border-border px-2 py-0.5">
              {s}
            </li>
          ))}
        </ul>
        <span className="inline-flex shrink-0 items-center gap-1 text-caption font-semibold text-text-secondary transition-colors group-hover:text-accent" aria-hidden>
          Case study <ArrowUpRight size={14} className="transition-transform duration-[var(--dur-micro)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
      {/* Visible focus ring for the stretched link */}
      <span className="pointer-events-none absolute inset-0 rounded-card ring-accent ring-offset-2 ring-offset-bg group-has-[button:focus-visible]:ring-2" aria-hidden />
    </article>
  )
}

export default function Projects({ onOpenSection }: { onOpenSection?: (s: string) => void }) {
  const click = useKeySound()
  const open = () => {
    click()
    onOpenSection?.("projects")
  }

  return (
    <section id="projects" aria-labelledby="projects-title" className="section-pad mx-auto max-w-6xl px-5 sm:px-6">
      <Heading
        id="projects-title"
        n="01"
        eyebrow="Work"
        title="Selected projects"
        intro="Design systems, D2C storefronts and tools I designed in Figma and shipped in code."
        action={
          <Button variant="secondary" onClick={open} iconRight={<ArrowUpRight size={16} />}>
            Browse all case studies
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} p={p} onOpen={open} />
        ))}
      </div>
    </section>
  )
}
