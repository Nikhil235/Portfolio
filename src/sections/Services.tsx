import { Layers, MousePointerClick, Workflow } from "lucide-react"
import Heading from "./Heading"

// Feature -> benefit: each item says what the hiring team gets, then points to the proof.
const BENEFITS = [
  {
    icon: Workflow,
    title: "Designs that survive handoff",
    body: "I design in Figma and build it myself in React and TypeScript, so what ships matches what was approved.",
    proof: "My-Design-System: 52+ coded variants",
  },
  {
    icon: MousePointerClick,
    title: "Interfaces that convert",
    body: "Clear hierarchy, honest copy and fast pages, checked against CRO and accessibility principles.",
    proof: "Bhringa: +42% add-to-cart rate",
  },
  {
    icon: Layers,
    title: "Systems your team can scale",
    body: "Tokens and documented components that let new screens ship faster without the UI drifting.",
    proof: "UI-Checklist: used by 1,200+ designers",
  },
]

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-pad mx-auto max-w-6xl px-5 sm:px-6">
      <Heading id="services-title" n="02" eyebrow="How I help" title="What your team gets" />
      <ul className="grid gap-5 md:grid-cols-3">
        {BENEFITS.map((b) => (
          <li key={b.title} className="reveal flex flex-col rounded-card border border-border bg-surface p-6 sm:p-7">
            <b.icon size={22} className="text-accent" aria-hidden />
            <h3 className="mt-5 text-h3 font-semibold text-text-primary">{b.title}</h3>
            <p className="mt-2 text-body text-text-secondary">{b.body}</p>
            <p className="mt-auto pt-6 font-mono text-caption text-text-tertiary">
              <span className="text-accent">Proof:</span> {b.proof}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
