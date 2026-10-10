import { useState, useContext, useEffect } from "react"
import { Command, Menu, Volume2, VolumeX, X, Search } from "lucide-react"
import { SoundContext } from "../hooks/useKeySound"
import { profile } from "../data/portfolio"
import Button from "./ui/Button"

const navLinks = [
  { href: "#projects", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
]

export default function Nav({
  onOpenPalette,
  onOpenSection,
}: {
  onOpenPalette: () => void
  onOpenSection?: (id: string) => void
}) {
  const { enabled, toggle, profile: soundProfile } = useContext(SoundContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mobileMenuOpen])

  const iconBtnClass =
    "inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-control border border-border bg-surface px-3 text-text-secondary transition-colors duration-[var(--dur-micro)] hover:border-border-strong hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"

  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-nav)] border-b border-border/60 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 font-mono text-xs sm:px-6">
        {/* Brand / Home */}
        <a
          href="#home"
          className="flex min-h-[44px] items-center gap-1 text-text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md py-1"
        >
          <span className="font-semibold tracking-tight text-sm">~/{profile.handle}</span>
          <span className="text-accent text-sm" aria-hidden="true">
            _
          </span>
          <span className="sr-only">, back to top</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-control px-3.5 py-2 font-mono text-xs text-text-secondary transition-colors hover:text-accent hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[40px] inline-flex items-center"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions Toolbar */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={
              enabled
                ? `Keyboard sound on (${soundProfile}). Click to turn off`
                : "Keyboard sound off. Click to turn on"
            }
            className={iconBtnClass}
          >
            {enabled ? (
              <Volume2 size={16} className="text-accent" aria-hidden="true" />
            ) : (
              <VolumeX size={16} aria-hidden="true" />
            )}
            <span className="hidden uppercase sm:inline text-[11px] font-medium">
              {enabled ? soundProfile : "off"}
            </span>
          </button>

          {/* Command Palette Trigger (Desktop) */}
          <button
            onClick={onOpenPalette}
            aria-label="Open command palette"
            aria-keyshortcuts="Control+K Meta+K"
            className={`${iconBtnClass} hidden sm:inline-flex`}
          >
            <Command size={14} aria-hidden="true" />
            <span className="font-medium">K</span>
          </button>

          {/* Search Trigger for Mobile */}
          <button
            onClick={onOpenPalette}
            aria-label="Search portfolio"
            className={`${iconBtnClass} sm:hidden`}
          >
            <Search size={16} aria-hidden="true" />
          </button>

          {/* Primary CTA */}
          <Button href="#contact" size="sm" className="hidden sm:inline-flex font-sans min-h-[44px]">
            Hire me
          </Button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className={`${iconBtnClass} md:hidden`}
          >
            {mobileMenuOpen ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Menu size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="md:hidden border-b border-border bg-bg/95 px-5 py-6 backdrop-blur-xl animate-in slide-in-from-top-2 duration-150 shadow-2xl"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-2 font-mono text-sm">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-control px-4 py-2 text-text-primary hover:bg-surface hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 border-t border-border mt-3 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-muted px-4 block">
                Interactive Modals
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { id: "design-system", label: "Design System" },
                  { id: "shape", label: "SHAPE Framework" },
                  { id: "stack", label: "Stack Constellation" },
                  { id: "art", label: "Art & Origin" },
                ].map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onOpenSection?.(sec.id)
                    }}
                    className="flex min-h-[44px] items-center justify-center rounded-control border border-border bg-surface px-3 py-2 text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors text-center"
                  >
                    {sec.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-2">
              <Button
                href="#contact"
                size="md"
                fullWidth
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans"
              >
                Hire me
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
