import type { Sketch } from "../../data/sketchRepository"

type Props = {
  sketch: Sketch
  index: number
  onOpen: (index: number) => void
  variant: "scatter" | "scrapbook"
  tilt?: number
  style?: React.CSSProperties
}

export default function SketchCard({ sketch, index, onOpen, variant, tilt, style }: Props) {
  const angle = tilt ?? (index % 2 ? 1.6 : -1.4)
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`View ${sketch.title}`}
      className={`sketch-card group/card block rounded-[4px] bg-[#f3efe6] p-2.5 pb-0 text-left text-[#1b1b1f] shadow-[0_18px_40px_-18px_rgb(0_0_0/0.9)] outline-none transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg ${
        variant === "scatter"
          ? "relative w-full hover:shadow-[0_30px_60px_-20px_rgb(0_0_0/0.95)]"
          : "relative w-full"
      }`}
      style={{ ...style, ["--tilt" as string]: `${angle}deg` }}
    >
      {/* Masking tape */}
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-3deg] bg-[#e9e3cf]/75 shadow-sm"
        style={{ clipPath: "polygon(3% 0, 97% 4%, 100% 100%, 0 94%)" }}
      />
      <span className="block overflow-hidden bg-[#ddd8cc]">
        <img
          src={sketch.src}
          alt={sketch.alt}
          loading="lazy"
          decoding="async"
          width={sketch.width}
          height={sketch.height}
          className="block h-auto w-full grayscale-[15%] transition-[filter,transform] duration-700 group-hover/card:scale-[1.03] group-hover/card:grayscale-0"
        />
      </span>
      <span className="flex items-baseline justify-between gap-3 px-1 py-3">
        <span className="text-[0.95rem] font-semibold leading-tight">{sketch.title}</span>
        <span className="shrink-0 font-mono text-[0.68rem] uppercase tracking-wider text-[#5c5a55]">
          {sketch.category}
          {sketch.year ? ` · ${sketch.year}` : ""}
        </span>
      </span>
    </button>
  )
}
