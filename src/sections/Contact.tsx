import { useState } from "react"
import { Check, Copy, Send, CheckCircle2, ArrowUpRight } from "lucide-react"
import Heading from "./Heading"
import Field from "../components/ui/Field"
import Button from "../components/ui/Button"
import { profile, socials } from "../data/portfolio"
import { useKeySound } from "../hooks/useKeySound"

export default function Contact({
  onOpenSection,
}: {
  onOpenSection?: (s: string) => void
}) {
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "message", string>>>({})
  const click = useKeySound()

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const name = String(f.get("name") ?? "").trim()
    const email = String(f.get("email") ?? "").trim()
    const message = String(f.get("message") ?? "").trim()
    const next: typeof errors = {}

    if (!name) next.name = "Add your name so I know who to reply to."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email like name@company.com."
    if (message.length < 10) next.message = "Add a sentence about the role or project (at least 10 characters)."

    setErrors(next)
    if (Object.keys(next).length) {
      click()
      return
    }

    click()
    const subject = encodeURIComponent(`Hello from ${name}`)
    const body = encodeURIComponent(`${message}\n\n${name} (${email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const copy = () => {
    click()
    navigator.clipboard?.writeText(profile.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl px-5 sm:px-6 pb-20 pt-28">
      <Heading id="contact-title" n="05" eyebrow="Contact" title="Get in touch" />

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <h3 className="reveal text-4xl font-extrabold leading-tight tracking-tight text-fg sm:text-5xl lg:text-6xl">
            Have a project in mind?{" "}
            <span className="text-accent">
              Let’s build something remarkable.
            </span>
          </h3>

          <p className="reveal max-w-lg text-base leading-relaxed text-muted">
            Hiring a <strong className="text-fg">UI Developer</strong>,{" "}
            <strong className="text-fg">Frontend Designer</strong> or{" "}
            <strong className="text-fg">Product Designer</strong>? I'm open to
            full-time and contract roles, based in Bangalore and happy to work
            remotely. You'll hear back within 1 working day.
          </p>

          <div className="reveal flex flex-wrap items-center gap-3 pt-4 font-mono text-xs">
            <Button
              href={`mailto:${profile.email}`}
              size="lg"
              iconRight={<Send size={15} aria-hidden="true" />}
              onClick={() => click()}
            >
              Email me
            </Button>
            <button
              onClick={copy}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-control border border-line bg-surface px-4 py-3 text-fg hover:border-accent hover:text-accent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              <span aria-live="polite">{copied ? "Copied" : profile.email}</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="reveal rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <h4 className="font-mono text-sm font-semibold text-fg mb-1">
            Prefer to write here?
          </h4>
          <p className="mb-5 text-xs text-muted">
            3 short fields. Sending opens your email app with it filled in.
          </p>

          {sent ? (
            <div className="rounded-xl border border-accent/30 bg-accent/10 p-6 font-mono text-xs text-accent space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 size={16} aria-hidden="true" /> Your email is ready
              </div>
              <p className="text-fg/80">
                Your email app should have opened with your message. If it
                didn't, write to{" "}
                <a className="underline underline-offset-4" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={submit}
              className="space-y-4"
            >
              <Field
                label="Name"
                name="name"
                type="text"
                autoComplete="name"
                required
                error={errors.name}
                placeholder="e.g. Maya Lin"
              />

              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                error={errors.email}
                placeholder="e.g. maya@company.design"
              />

              <Field
                label="What are you hiring for?"
                name="message"
                multiline={true}
                rows={3}
                required
                error={errors.message}
                placeholder="Tell me about your product, team, or challenge..."
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                iconRight={<Send size={14} aria-hidden="true" />}
              >
                Send message
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-28 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8 font-mono text-xs text-muted">
        <div>
          <span className="text-fg font-semibold">{profile.name}</span> ·{" "}
          {profile.role}
        </div>

        <div className="flex flex-wrap gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition flex items-center gap-1 min-h-[44px]"
            >
              <span>{s.label}</span>
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          ))}
        </div>

        <div>
          press{" "}
          <kbd className="rounded border border-line px-1.5 py-0.5 text-fg">
            ⌘K
          </kbd>{" "}
          for command palette
        </div>
      </footer>
    </section>
  )
}
