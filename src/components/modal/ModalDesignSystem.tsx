import { useState } from "react"
import { Check, Copy, Filter, Loader2, Search } from "lucide-react"
import { designSystemInfo } from "../../data/portfolio"
import { useKeySound } from "../../hooks/useKeySound"

export default function ModalDesignSystem() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [searchSize, setSearchSize] = useState<"sm" | "md" | "lg">("md")
  const [searchState, setSearchState] = useState<"default" | "active" | "loading" | "filter">("default")
  const [searchQuery, setSearchQuery] = useState("")

  const [dangerStyle, setDangerStyle] = useState<"solid" | "outline" | "ghost">("solid")
  const [dangerSize, setDangerSize] = useState<"sm" | "md" | "lg">("md")
  const [dangerLoading, setDangerLoading] = useState(false)

  const playClick = useKeySound()

  const copyToken = (val: string) => {
    playClick()
    navigator.clipboard?.writeText(val)
    setCopiedToken(val)
    setTimeout(() => setCopiedToken(null), 1500)
  }

  return (
    <div className="space-y-10">
      <div>
        <span className="font-mono text-xs text-accent uppercase tracking-wider">
          Design Architecture
        </span>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          {designSystemInfo.systemName}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Engineered under the{" "}
          <span className="text-accent">{designSystemInfo.team}</span> with a
          strict three-tier token pipeline: Primitives, Semantic aliases, and
          Component tokens.
        </p>
      </div>

      {/* Three-Tier Token Architecture Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-sm font-semibold text-fg">
            Three-Tier Token Pipeline
          </h3>
          <span className="font-mono text-xs text-muted">
            Click token to copy
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {designSystemInfo.tiers.map((tier) => (
            <div
              key={tier.tier}
              className="flex flex-col justify-between rounded-xl border border-line bg-panel-elevated p-5"
            >
              <div>
                <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-accent">
                  {tier.tier}
                </span>
                <h4 className="mt-3 text-base font-semibold text-fg">
                  {tier.title}
                </h4>
                <p className="mt-1.5 text-xs text-muted leading-relaxed">{tier.desc}</p>
              </div>

              <div className="mt-5 space-y-2">
                {tier.examples.map((ex) => (
                  <button
                    key={ex.name}
                    onClick={() => copyToken(ex.name)}
                    className="group flex w-full items-center justify-between rounded-md border border-line bg-bg px-2.5 py-1.5 text-left font-mono text-[11px] transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <span className="truncate">{ex.name}</span>
                    {copiedToken === ex.name ? (
                      <Check size={12} className="text-accent shrink-0" aria-label="Copied" />
                    ) : (
                      <Copy size={12} className="text-muted group-hover:text-accent shrink-0" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 16-Variant SearchBar Interactive Component */}
      <div className="rounded-xl border border-line bg-panel-elevated p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="rounded bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent">
              Interactive Spec
            </span>
            <h3 className="mt-1.5 text-lg font-semibold text-fg">
              16-Variant SearchBar System
            </h3>
            <p className="text-xs text-muted">
              Engineered with keyboard listener shortcuts, active tag filters, and clear states.
            </p>
          </div>

          {/* Size toggles */}
          <div className="flex items-center gap-1 rounded-lg border border-line bg-bg p-1 font-mono text-xs">
            {(["sm", "md", "lg"] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  playClick()
                  setSearchSize(s)
                }}
                className={`rounded px-2.5 py-1 transition ${
                  searchSize === s
                    ? "bg-accent text-bg font-semibold"
                    : "text-muted hover:text-fg"
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* State selector chips */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-muted">States:</span>
          {(["default", "active", "loading", "filter"] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                playClick()
                setSearchState(st)
              }}
              className={`rounded-md border px-2.5 py-1 transition ${
                searchState === st
                  ? "border-accent bg-accent/15 text-accent font-semibold"
                  : "border-line text-muted hover:text-fg"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Live Interactive SearchBar */}
        <div className="rounded-lg border border-line bg-bg p-6 flex flex-col items-center justify-center">
          <div
            className={`relative flex items-center w-full max-w-md rounded-lg border transition-all ${
              searchState === "active"
                ? "border-accent ring-2 ring-accent/20 bg-panel"
                : "border-line bg-panel hover:border-line-bright"
            } ${
              searchSize === "sm"
                ? "h-9 px-3 text-xs"
                : searchSize === "lg"
                  ? "h-12 px-5 text-base"
                  : "h-11 px-4 text-sm"
            }`}
          >
            {searchState === "loading" ? (
              <Loader2
                size={searchSize === "sm" ? 14 : 18}
                className="animate-spin text-accent mr-2.5 shrink-0"
                aria-hidden="true"
              />
            ) : (
              <Search
                size={searchSize === "sm" ? 14 : 18}
                className="text-muted mr-2.5 shrink-0"
                aria-hidden="true"
              />
            )}

            {searchState === "filter" && (
              <span className="mr-2 inline-flex items-center gap-1 rounded bg-accent/20 px-2 py-0.5 font-mono text-[11px] text-accent">
                <Filter size={10} aria-hidden="true" /> In: Components
              </span>
            )}

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search design system components..."
              className="flex-1 bg-transparent text-fg placeholder:text-muted/60 outline-none"
            />

            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-line bg-bg px-1.5 py-0.5 font-mono text-[10px] text-muted">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* 36-Variant Danger Button Matrix */}
      <div className="rounded-xl border border-line bg-panel-elevated p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="rounded bg-red-500/20 px-2 py-0.5 font-mono text-[11px] text-red-400">
              Destructive Interaction Spec
            </span>
            <h3 className="mt-1.5 text-lg font-semibold text-fg">
              36-Variant Danger Button Matrix
            </h3>
            <p className="text-xs text-muted">
              Created for the Lucifer team to standardize high-risk actions with zero ambiguity.
            </p>
          </div>

          {/* Style toggles */}
          <div className="flex items-center gap-1 rounded-lg border border-line bg-bg p-1 font-mono text-xs">
            {(["solid", "outline", "ghost"] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  playClick()
                  setDangerStyle(st)
                }}
                className={`rounded px-2.5 py-1 transition ${
                  dangerStyle === st
                    ? "bg-red-500 text-white font-semibold"
                    : "text-muted hover:text-fg"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className="text-muted">Size:</span>
          {(["sm", "md", "lg"] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => {
                playClick()
                setDangerSize(sz)
              }}
              className={`rounded px-2 py-1 border transition ${
                dangerSize === sz
                  ? "border-red-400 text-red-400"
                  : "border-line text-muted"
              }`}
            >
              {sz.toUpperCase()}
            </button>
          ))}
          <button
            onClick={() => setDangerLoading((l) => !l)}
            className="ml-auto rounded border border-line px-2.5 py-1 text-muted hover:text-fg"
          >
            Toggle Loading: {dangerLoading ? "ON" : "OFF"}
          </button>
        </div>

        <div className="rounded-lg border border-line bg-bg p-6 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => playClick()}
            className={`inline-flex items-center gap-2 rounded-lg font-mono font-medium transition-all ${
              dangerSize === "sm"
                ? "px-3 py-1.5 text-xs"
                : dangerSize === "lg"
                  ? "px-6 py-3 text-base"
                  : "px-4 py-2 text-sm"
            } ${
              dangerStyle === "solid"
                ? "bg-red-600 text-white shadow-lg shadow-red-900/30 hover:bg-red-500 active:scale-95"
                : dangerStyle === "outline"
                  ? "border border-red-500 text-red-400 hover:bg-red-500/10 active:scale-95"
                  : "text-red-400 hover:bg-red-500/15 active:scale-95"
            }`}
          >
            {dangerLoading && (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            )}
            Delete Repository
          </button>
        </div>
      </div>

      {/* Food Delivery Screen & Usage Guidelines */}
      <div className="grid gap-4 sm:grid-cols-2">
        {designSystemInfo.components.slice(2).map((comp) => (
          <div
            key={comp.name}
            className="rounded-xl border border-line bg-panel-elevated p-5"
          >
            <span className="font-mono text-[11px] text-accent">
              {comp.badge}
            </span>
            <h4 className="mt-2 text-base font-semibold text-fg">
              {comp.name}
            </h4>
            <p className="mt-1 text-xs text-muted leading-relaxed">
              {comp.description}
            </p>
            <div className="mt-4 font-mono text-[11px] text-accent">
              ✓ {comp.variants}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
