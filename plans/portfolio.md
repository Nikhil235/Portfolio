# Plan: Terminal-Inspired Interactive Developer Portfolio

## Context
- Fresh scaffold: React 19, Vite 8, Tailwind v4 (`@tailwindcss/vite`), `src/App.tsx`, `src/main.tsx`, `src/index.css`. No `public/` directory yet.
- Reference screenshots show these key ideas: a near-black background with a faint square grid and occasional softly lit tiles; a hero on the left with a large name in a pastel-violet accent, a `$ projects▍` prompt line and a small faux browser window ("eesha.dev"); a 3D-ish dark **virtual keyboard** on the right (QWERTY keys, big section keys ABOUT / SKILLS / PROJECTS / STACK / PLAYGROUND / THOUGHTS / CONTACT, a wide white ENTER, and a "Key sounds: off" pill underneath). Sections open as `~/ Section` dialogs with a "Close · esc" button.
- The brief asks for scrollable sections plus a Cmd+K palette. **Decision:** keep both. The hero keyboard and the typed prompt match the reference interaction, the content lives in real scrolled sections (good for SEO and accessibility), and the command palette is the universal launcher. Section headings use the reference's `~/ About` style.

## Dependencies
Add `gsap` and `lucide-react`. Do not add any other runtime dependencies.

## Design tokens (`src/index.css`, `@theme`)
- `--color-bg #0d0d0d`, `--color-surface #161616`, `--color-surface-2 #1d1d1d`, `--color-fg #f5f5f0`, `--color-muted #929292`, `--color-line #2a2a2a`, and `--color-accent #b8f36b`. The accent is a single CSS variable, so the playground swatches can re-theme the site.
- Fonts: Geist (sans) and JetBrains Mono (mono), loaded through a Google Fonts `@import` at the top of the CSS.
- Use a fixed background grid made with CSS `linear-gradient` lines at 64px. Add about 8 randomly placed "lit" tiles that fade slowly. Disable the tiles when reduced motion is on.
- Base styles: `scroll-behavior: smooth` (disabled when reduced motion is on), `:focus-visible` accent outline, `::selection` accent.

## File structure (JSX, as the brief requests; remove `App.tsx` and use `App.jsx`, then update `main.tsx`'s import)
```
src/
  App.jsx                  // state: paletteOpen, soundOn, accent; renders all of the parts below
  components/
    Navbar.jsx             // name/logo, links (≥md), availability dot, "⌘K" trigger; mobile: logo + Search button (44px)
    CommandPalette.jsx
    VirtualKeyboard.jsx    // hero keyboard; keys press visually on real keydown
    TerminalPrompt.jsx     // "$ " input; typing a command + Enter runs it
    ProjectCard.jsx
    SectionHeading.jsx     // "~/ Title" + optional description, mono index
    GridBackground.jsx
    SoundToggle.jsx
    Footer.jsx
  sections/ Hero, About, Projects, Skills, Experience, Contact (.jsx)
  data/
    site.js               // name, role, email, socials, resumeUrl: ALL replaceable placeholders in one place
    commands.js           // builds command list from site.js + section ids
    projects.js, skills.js, experience.js
  hooks/
    useKeyboardShortcuts.js
    useKeySound.js         // WebAudio synthesized click
    useReveal.js           // GSAP ScrollTrigger reveal, gsap.context cleanup
    usePrefersReducedMotion.js
public/
  resume.pdf               // real, valid one-page sample PDF (generated with a small hand-written PDF file)
  og.png is not used; meta tags go in index.html
```

## Content (sample, clearly replaceable)
- `site.js`: name "Alex Morgan" (placeholder), role "Frontend Developer / Builder / Problem Solver", `email: "hello@example.com"`, github `https://github.com/`, linkedin `https://www.linkedin.com/`, `resumeUrl: "/resume.pdf"`. The comment at the top says that all of these values should be replaced.
- Projects: 6 entries `{ id, title, category, description, tech[], image, live, source?, caseStudy?, status, featured }`. Previews are Unsplash product/workspace photographs inside a reusable browser-chrome frame (three dots + URL bar), loaded with `loading="lazy"`, and `w=1200&fm=webp` parameters. Link values point to placeholders such as `https://example.com`. The source link is omitted when null, so there are no broken buttons.
- Skills: the 5 categories from the brief, shown as label chips without proficiency bars.
- Experience: 4 entries mixing a sample freelance role, an open-source project and learning milestones, each with role, organization, dates, 2–3 bullets.
- About: 3 short paragraphs, 4 trait chips, a specialization list, and a portrait-slot Unsplash image (grayscale).

## Hero (reference layout)
- On large screens, use 2 columns: the left contains `HELLO, WORLD.` (mono, accent), `Hi, I'm <accent>Name.</accent>` (clamp 3rem–6.5rem, tracking -0.04em, leading 0.95), the role line with `·` separators, the supporting line, `TerminalPrompt`, and the faux browser hint box ("Select a key or type a command, then press ↵ ENTER"). The right contains `VirtualKeyboard` and the "Key sounds: off" toggle below it.
- On mobile (<lg), hide the QWERTY rows. Show the section keys as a 2-column grid of large buttons plus ENTER, so the interface is intentional rather than shrunk.
- Keyboard behavior: clicking a section key selects it (highlighted, and the prompt shows `$ about`). ENTER runs the selected command. Physical keydown animates the matching letter key without capturing typing.
- Use a GSAP timeline entrance: label → heading (y 24) → role → text → interface. Use 0.55s, 0.1s stagger, and `power3.out`. With reduced motion, show everything immediately. A subtle scroll indicator ("scroll" + 1px line) sits at the bottom.

## Command palette (core)
- Commands: `{ id, label, group: 'Navigate'|'Links'|'Actions', keywords[], icon, shortcut?, run(ctx) }`. Home, About, Projects, Skills, Experience, Contact (scroll to the matching id); Download resume (programmatic `<a download href="/resume.pdf">`); GitHub / LinkedIn / Email (`window.open(url,'_blank','noopener')` / `mailto:`); Toggle sound; Copy email (clipboard API with a toast); and Change accent.
- Filtering: a case-insensitive match on label and keywords that ranks prefix matches first and keeps the original order within groups. "proj" → Projects.
- Keyboard: ↑/↓ wrap around, Home/End, and Enter runs the active command only when the results are not empty. Esc closes. Mouse hover sets the active item, and click or tap runs it. When the query changes, reset the active index to 0 and scroll the active item into view.
- Opening: the nav button, the hero "⌘K" hint, Cmd/Ctrl+K (toggle), and `/` when the focus is not in an input, textarea or contenteditable element.
- A11y: `role="dialog" aria-modal aria-label="Command palette"`, combobox input (`role="combobox" aria-expanded aria-controls aria-activedescendant`) + `role="listbox"` / `role="option" aria-selected`. Lock body scroll, trap focus (Tab cycles between the input and the close button), and restore focus to the opener when the palette closes. Clicking the backdrop closes it. Empty state: "No commands found." plus a hint.
- Layout: centered at `max-w-[640px]`, `top-[12vh]`. On mobile, use `inset-x-3 top-3` and `max-h-[70dvh]` so the on-screen keyboard has room. Include a footer with `↑↓ navigate · ↵ select · esc close` hints (hidden on touch).
- Motion: a 180ms opacity and scale animation from 0.98 to 1, applied with CSS classes and an unmount delay.
- Running a section command closes the palette and, on the next frame, calls `scrollIntoView({behavior: reduced ? 'auto':'smooth'})`. A fixed nav offset is applied through `scroll-margin-top`.

## Sections
- Each section has an `id`, an `aria-labelledby` heading, `SectionHeading` (`~/ About`, index `01`), and the content max width is 1200px with `px-5 md:px-10`.
- About: 12-column asymmetric layout with text in columns 1–7 and a portrait plus specialization list in columns 9–12.
- Projects: 2 featured large cards (spanning 2 columns on lg) followed by a 3-column grid. Hover effects: image scale 1.03 over 500ms, border changes to the accent at 40% opacity, and the arrow moves 4px to the right. Links are real `<a>` elements with an icon and `aria-label`, so the content stays visible without hover.
- Skills: 5 rows, each with a mono category label on the left and chips separated by hairline borders.
- Experience: a timeline list with dates in mono on the left, and the role, organization and bullets on the right.
- Contact: a large "Let's build something." heading, an email button (accent fill), LinkedIn, GitHub, and Resume buttons, and a copy-email button. **No form**, so there are no fake submissions. A form can be added later with Formspree if the user wants one.
- Footer: © year, "Built with React & GSAP", "Press ⌘K anywhere".

## Sound
`useKeySound`: lazily create an `AudioContext` when the first key is pressed after sound is enabled. Use a 30ms square/triangle blip with a gain of 0.04 and a quick decay, with slight pitch variation. Sound plays on virtual-key presses, palette navigation and command execution, never while the user types in fields. Sound is off by default and the setting is saved in `localStorage`. The toggle shows "Key sounds: off/on" with `aria-pressed`.

## Motion and accessibility details
- `useReveal`: a ScrollTrigger animation at `start: 'top 85%'` with `y: 24` → 0 and opacity, a 0.5s duration, and a stagger for `[data-reveal]` children. It runs once. Cleanup uses `ctx.revert()`. With reduced motion, skip it.
- Headings: one `h1` in the hero and `h2` headings in sections. Add a skip link. Give the browser-frame images `alt` text.
- `index.html`: title "Alex Morgan — Frontend Developer", meta description, `theme-color #0d0d0d`, and an SVG favicon in `public/`.
- Prevent overflow with `overflow-x: clip` on the body and `min-w-0` on grid children.

## Verification
1. Run `pnpm build`. It must succeed.
2. Check the preview: Cmd/Ctrl+K and `/` open the palette. Typing "proj" shows Projects. Arrow keys, Enter (which scrolls), Esc, and backdrop clicks work. "zzz" shows the empty state and Enter does nothing.
3. Check that the virtual keyboard selection and ENTER work, that typing `about`+Enter works in the prompt, that sound toggles on and off, that resume.pdf downloads, and that external links open in a new tab.
4. Check at 375px, 768px, and 1440px that there is no horizontal scroll, that the mobile palette is usable, and that reduced-motion emulation shows content without animation.
