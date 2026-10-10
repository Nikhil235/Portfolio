import { useState } from "react"
import { Check, CheckCircle2, Copy, Send } from "lucide-react"
import { profile, socials } from "../../data/portfolio"
import { useKeySound } from "../../hooks/useKeySound"

export default function ModalContact() {
  const [emailCopied, setEmailCopied] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const playClick = useKeySound()

  const copyEmail = () => {
    playClick()
    navigator.clipboard?.writeText(profile.email)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 1600)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    playClick()
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = String(fd.get("name") || "")
    const email = String(fd.get("email") || "")
    const message = String(fd.get("message") || "")

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`)
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setFormSent(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-xs text-accent uppercase tracking-wider">
          Get in Touch
        </span>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Let's craft something remarkable.
        </h2>
        <p className="mt-1 text-sm text-muted">
          Available for UI Developer, Frontend Designer, and Product Design roles.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
        <button
          onClick={copyEmail}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-accent px-4 py-2.5 font-semibold text-bg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {emailCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          <span aria-live="polite">{emailCopied ? "Copied to clipboard" : profile.email}</span>
        </button>

        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center rounded-md border border-line px-3.5 py-2 text-muted transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {s.label}
          </a>
        ))}
      </div>

      {/* Direct Message Form */}
      <div className="rounded-xl border border-line bg-panel-elevated p-6 space-y-4">
        <h3 className="font-mono text-sm font-semibold text-fg">
          Direct Dispatch
        </h3>

        {formSent ? (
          <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 p-4 font-mono text-xs text-accent">
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>Message prepared! Opening your mail client with {profile.email}.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-3 text-xs font-mono"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="name"
                type="text"
                required
                placeholder="Your name"
                className="min-h-[44px] rounded-md border border-line bg-bg px-3.5 py-2.5 text-fg outline-none focus:border-accent transition"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Your email"
                className="min-h-[44px] rounded-md border border-line bg-bg px-3.5 py-2.5 text-fg outline-none focus:border-accent transition"
              />
            </div>
            <textarea
              name="message"
              rows={3}
              required
              placeholder="What are we building?"
              className="w-full rounded-md border border-line bg-bg p-3.5 text-fg outline-none focus:border-accent font-sans text-sm transition"
            />
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 font-semibold text-bg transition hover:brightness-110 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Send size={13} aria-hidden="true" /> Send Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
