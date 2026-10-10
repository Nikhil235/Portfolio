import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react"

export type SwitchProfile = "thock" | "clicky" | "linear"

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume()
  }
  return audioCtx
}

export function playKeySound(
  profile: SwitchProfile = "thock",
  keyType: "normal" | "space" | "enter" = "normal",
) {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const now = ctx.currentTime

    if (profile === "thock") {
      // Deep mechanical thock sound: low pass, resonant pop + woody transient
      const osc = ctx.createOscillator()
      const noiseGain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      // Primary body tone
      const baseFreq =
        keyType === "space"
          ? 140
          : keyType === "enter"
            ? 180
            : 260 + (Math.random() * 40 - 20)
      osc.type = "triangle"
      osc.frequency.setValueAtTime(baseFreq * 1.8, now)
      osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.035)

      // Filter to give that warm lubed switch thock
      filter.type = "lowpass"
      filter.frequency.setValueAtTime(900, now)
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.05)

      noiseGain.gain.setValueAtTime(0.18, now)
      noiseGain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + (keyType === "space" ? 0.08 : 0.05),
      )

      osc.connect(filter).connect(noiseGain).connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.09)

      // Subtle click transient at the very onset
      const clickOsc = ctx.createOscillator()
      const clickGain = ctx.createGain()
      clickOsc.type = "sine"
      clickOsc.frequency.setValueAtTime(1400, now)
      clickOsc.frequency.exponentialRampToValueAtTime(120, now + 0.015)
      clickGain.gain.setValueAtTime(0.08, now)
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02)
      clickOsc.connect(clickGain).connect(ctx.destination)
      clickOsc.start(now)
      clickOsc.stop(now + 0.025)
    } else if (profile === "clicky") {
      // Crisp tactile blue click
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "square"
      const baseFreq = 2200 + Math.random() * 500
      osc.frequency.setValueAtTime(baseFreq, now)
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.025)
      gain.gain.setValueAtTime(0.07, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.045)
    } else {
      // Linear soft muted tap
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(380, now)
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.03)
      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.04)
    }
  } catch {}
}

export interface SoundContextType {
  enabled: boolean
  toggle: () => void
  profile: SwitchProfile
  setProfile: (p: SwitchProfile) => void
  play: (keyType?: "normal" | "space" | "enter") => void
}

export const SoundContext = createContext<SoundContextType>({
  enabled: true,
  toggle: () => {},
  profile: "thock",
  setProfile: () => {},
  play: () => {},
})

export function useKeySound() {
  const { enabled, profile, play } = useContext(SoundContext)
  const ref = useRef({ enabled, profile })
  useEffect(() => {
    ref.current = { enabled, profile }
  }, [enabled, profile])

  return useCallback((keyType: "normal" | "space" | "enter" = "normal") => {
    if (ref.current.enabled) {
      playKeySound(ref.current.profile, keyType)
    }
  }, [])
}
