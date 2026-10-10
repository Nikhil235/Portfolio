import Heading from "./Heading"
import Button from "../components/ui/Button"
import { profile } from "../data/portfolio"
import { Palette } from "lucide-react"

export default function About({
  onOpenSection,
}: {
  onOpenSection?: (s: string) => void
}) {
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad mx-auto max-w-6xl px-5 sm:px-6">
      <Heading id="about-title" n="03" title="About" />

      <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6 text-body-lg text-text-secondary">
          {profile.about.map((p, i) => (
            <p key={i} className="reveal">
              {p}
            </p>
          ))}

          <div className="reveal pt-4 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => onOpenSection?.("art")}
              iconLeft={<Palette size={15} className="text-accent" aria-hidden="true" />}
              className="font-mono text-xs"
            >
              See my art and illustration
            </Button>
          </div>
        </div>

        {/* Right column: stack */}
        <div className="space-y-8">
          <div className="reveal">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
              Tools I use every day
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-line bg-panel px-3 py-1.5 font-mono text-xs text-fg/90"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
