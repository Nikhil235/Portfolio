import Heading from "./Heading"
import { experience } from "../data/portfolio"

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="section-pad mx-auto max-w-6xl px-5 sm:px-6">
      <Heading id="experience-title" n="04" eyebrow="Experience" title="Where I've worked" />

      <div className="divide-y divide-line border-y border-line">
        {experience.map((e) => (
          <div
            key={e.company}
            className="reveal grid gap-3 py-10 md:grid-cols-[220px_1fr] md:gap-8"
          >
            <span className="font-mono text-caption text-text-tertiary">{e.period}</span>
            <div>
              <h3 className="text-h3 font-semibold text-text-primary">
                {e.role}{" "}
                <span className="text-accent font-medium">@ {e.company}</span>
              </h3>
              <p className="mt-3 max-w-2xl text-body text-text-secondary">
                {e.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
