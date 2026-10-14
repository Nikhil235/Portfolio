import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Nav from "./components/Nav"
import CommandPalette from "./components/CommandPalette"
import SectionModal from "./components/SectionModal"
import GridBackground from "./components/GridBackground"
import CursorRingField from "./components/originkit/ui/cursor-ring-field"
import SketchbookBubble from "./components/sketchbook/SketchbookBubble"
import Hero from "./sections/Hero"
import About from "./sections/About"
import Projects from "./sections/Projects"
import Services from "./sections/Services"
import Experience from "./sections/Experience"
import Contact from "./sections/Contact"
import { SoundContext, SwitchProfile, playKeySound } from "./hooks/useKeySound"

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  // Sound is opt-in: unexpected audio is a top reason visitors bounce. Preference persists.
  const [soundEnabled, setSoundEnabled] = useState(
    () => localStorage.getItem("sound") === "on",
  )
  const [soundProfile, setSoundProfile] = useState<SwitchProfile>("thock")
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [activeModalSection, setActiveModalSection] = useState<string | null>(
    null,
  )
  const [accentColor, setAccentColor] = useState("#b8f36b")

  const toggleSound = useCallback(
    () =>
      setSoundEnabled((s) => {
        localStorage.setItem("sound", s ? "off" : "on")
        return !s
      }),
    [],
  )

  const playSound = useCallback(
    (keyType: "normal" | "space" | "enter" = "normal") => {
      if (soundEnabled) {
        playKeySound(soundProfile, keyType)
      }
    },
    [soundEnabled, soundProfile],
  )

  // Re-theme accent CSS variables in real time
  const handleAccentChange = useCallback(
    (colorHex: string) => {
      setAccentColor(colorHex)
      document.documentElement.style.setProperty("--accent", colorHex)

      // Convert hex to rgb for glow variables
      const hex = colorHex.replace("#", "")
      if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        document.documentElement.style.setProperty(
          "--accent-rgb",
          `${r}, ${g}, ${b}`,
        )
        document.documentElement.style.setProperty(
          "--accent-soft",
          `rgba(${r}, ${g}, ${b}, 0.15)`,
        )
        document.documentElement.style.setProperty(
          "--accent-glow",
          `rgba(${r}, ${g}, ${b}, 0.45)`,
        )
      }
    },
    [],
  )

  // Cmd+K palette listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // GSAP Entrance & ScrollTrigger animations
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    // Motion only where it guides attention; skipped entirely for reduced motion.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".hero-in", {
        y: 16,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "expo.out",
      })

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 16,
          opacity: 0,
          duration: 0.55,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <SoundContext.Provider
      value={{
        enabled: soundEnabled,
        toggle: toggleSound,
        profile: soundProfile,
        setProfile: setSoundProfile,
        play: playSound,
      }}
    >
      <div className="relative min-h-screen bg-bg text-fg selection:bg-accent selection:text-bg">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-toast)] focus:rounded-control focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
        >
          Skip to content
        </a>

        {/* Ambient Interactive Grid Background */}
        <GridBackground />

        {/* Originkit cursor ring field */}
        <CursorRingField
          colors={["#b8f36b", "#38bdf8", "#09090b"]}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            opacity: 0.38,
          }}
        />

        {/* Global Navigation */}
        <Nav
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenSection={(s) => setActiveModalSection(s)}
        />

        {/* Main Exhibition Sections */}
        <main id="main" className="relative z-10">
          <Hero
            onOpenSection={(s) => setActiveModalSection(s)}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            soundProfile={soundProfile}
            onChangeSoundProfile={setSoundProfile}
          />

          <Projects onOpenSection={(s) => setActiveModalSection(s)} />

          <Services />

          <About onOpenSection={(s) => setActiveModalSection(s)} />


          <Experience />

          <Contact onOpenSection={(s) => setActiveModalSection(s)} />
        </main>

        {/* Autonomous sketchbook easter egg */}
        <SketchbookBubble />

        {/* Command Palette */}
        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          onToggleSound={toggleSound}
          onOpenSection={(s) => setActiveModalSection(s)}
          onAccentChange={handleAccentChange}
        />

        {/* Interactive Section Modals (Screenshot 29-36 Inspiration) */}
        <SectionModal
          sectionId={activeModalSection}
          onClose={() => setActiveModalSection(null)}
          onNavigate={(s) => setActiveModalSection(s)}
          accentColor={accentColor}
          onAccentChange={handleAccentChange}
        />
      </div>
    </SoundContext.Provider>
  )
}
