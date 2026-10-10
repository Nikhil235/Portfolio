/**
 * Sketch media repository.
 *
 * The gallery only talks to this module, never to file paths. Today it is backed by
 * seed metadata + localStorage; swap the internals for a CMS/API/Supabase call and the
 * UI keeps working. `src` may be any URL (CDN upload, signed URL, /public path).
 */
export type Sketch = {
  id: string
  src: string
  title: string
  category: string
  caption: string
  year?: number
  alt: string
  width?: number
  height?: number
  order: number
}

export type SketchInput = Omit<Sketch, "id" | "order"> & { order?: number }

const STORAGE_KEY = "sketchbook:v1"
const base = import.meta.env.BASE_URL

// Seed data mirrors the uploads in /public/media/sketches. Replace with your upload workflow.
const seed: Sketch[] = [
  { id: "s-helm", src: `${base}media/sketches/sketch-03.jpg`, title: "Captain at the Helm", category: "Ink", caption: "Fine-liner hatching on Jack Sparrow, with a graphite Mark armour and a Hala Madrid stencil underneath.", alt: "Ink drawing of Jack Sparrow at a ship's wheel, surrounded by other sketches", order: 0, width: 1600, height: 720 },
  { id: "s-blue", src: `${base}media/sketches/sketch-05.jpg`, title: "Blue Flame", category: "Colour", caption: "Saturated marker work on a Super Saiyan Blue trio, beside a split-face Naruto in pen.", alt: "Coloured drawing of Dragon Ball characters with blue hair next to an ink Naruto portrait", order: 1, width: 1600, height: 720 },
  { id: "s-contrast", src: `${base}media/sketches/sketch-04.jpg`, title: "Studies in Contrast", category: "Graphite / Ink", caption: "Soft graphite portraiture next to a hard-edged Neymar stencil. Same week, opposite tools.", alt: "Graphite portrait of a woman and a black ink stencil of Neymar", order: 2, width: 1600, height: 720 },
  { id: "s-construct", src: `${base}media/sketches/sketch-06.jpg`, title: "Construction Lines", category: "Pencil study", caption: "Left unfinished on purpose. The guides are the interesting part.", alt: "Loose pencil portrait study with visible construction lines", order: 3, width: 720, height: 1600 },
  { id: "s-splash", src: `${base}media/sketches/sketch-07.jpg`, title: "Watercolour Splash", category: "Mixed media", caption: "Messi in splattered watercolour, Scrat in charcoal, and a half-Goku half-Jiren ink piece.", alt: "Watercolour Messi, charcoal Scrat and an ink split-face Goku drawing", order: 4, width: 1600, height: 720 },
  { id: "s-stencil", src: `${base}media/sketches/sketch-02.jpg`, title: "Beckham / Mark III", category: "Stencil", caption: "Two ways to fake depth: pure black shapes on the left, cross-hatching on the right.", alt: "Black stencil portrait of Beckham beside an ink Iron Man drawing", order: 5, width: 1600, height: 720 },
  { id: "s-rally", src: `${base}media/sketches/sketch-01.jpg`, title: "Rally", category: "Mixed media", caption: "Nadal mid-roar in watercolour, stacked over a dense Goku panel and a two-tone stencil.", alt: "Watercolour tennis player above an ink Dragon Ball panel and a stencil face", order: 6, width: 720, height: 1600 },
]

type Listener = (sketches: Sketch[]) => void
const listeners = new Set<Listener>()

function read(): Sketch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Sketch[]
  } catch {
    /* fall through to seed */
  }
  return seed
}

function write(list: Sketch[]) {
  const sorted = [...list].sort((a, b) => a.order - b.order)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted))
  } catch {
    /* storage unavailable: keep in-memory only */
  }
  listeners.forEach((l) => l(sorted))
  return sorted
}

export async function getSketches(): Promise<Sketch[]> {
  return [...read()].sort((a, b) => a.order - b.order)
}

export async function createSketch(input: SketchInput): Promise<Sketch> {
  const list = read()
  const sketch: Sketch = { ...input, id: crypto.randomUUID(), order: input.order ?? list.length }
  write([...list, sketch])
  return sketch
}

export async function updateSketch(id: string, patch: Partial<SketchInput>): Promise<Sketch | undefined> {
  const list = read().map((s) => (s.id === id ? { ...s, ...patch } : s))
  write(list)
  return list.find((s) => s.id === id)
}

export async function deleteSketch(id: string): Promise<void> {
  write(read().filter((s) => s.id !== id))
}

export async function reorderSketches(ids: string[]): Promise<Sketch[]> {
  const byId = new Map(read().map((s) => [s.id, s]))
  return write(ids.flatMap((id, order) => (byId.has(id) ? [{ ...byId.get(id)!, order }] : [])))
}

export function subscribeSketches(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
