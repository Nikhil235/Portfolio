export interface Project {
  id: string
  title: string
  subtitle: string
  category: "Design System" | "E-Commerce" | "Developer Tool" | "Animation & Interaction"
  year: string
  desc: string
  longDesc: string
  metrics?: string
  stack: string[]
  liveUrl?: string
  githubUrl?: string
  accentColor: string
  features: string[]
  previewUrl?: string
}

export interface DesignTokenLayer {
  tier: string
  title: string
  desc: string
  examples: { name: string; value: string; note: string }[]
}

export const profile = {
  name: "Nikhil Arjun",
  handle: "nikhil",
  role: "Design Engineer",
  tagline:
    "From Figma to production, with the motion intact.",
  status:
    "Open to opportunities: UI Developer · Frontend Designer · Product Designer",
  location: "Bangalore, India · UTC+5:30 (Open to Remote Worldwide)",
  email: "nikhilarjun.design@gmail.com",
  about: [
    "I design in Figma and build the same screens in React, so nothing gets lost in handoff. You get one person who owns the work from the first wireframe to the shipped component.",
    "I trained in ink portraiture, watercolour and manga illustration before I touched a screen. That is where my eye for hierarchy, negative space and detail comes from.",
    "On the side I build quantitative trading models. It keeps my engineering disciplined: fast, predictable, and easy to reason about.",
  ],
  skills: [
    "Figma & Token Architecture",
    "React 19 & Next.js",
    "TypeScript",
    "Tailwind CSS v4",
    "GSAP & ScrollTrigger",
    "Claude Code + Figma MCP",
    "WebAudio & Tactile UI",
    "Design Systems (3-Tier)",
    "Accessibility & Microcopy",
    "Interactive Prototyping",
  ],
  values: [
    {
      title: "Tactile Craft",
      desc: "Interfaces should feel physical. Every click, transition, and spring should honor momentum.",
    },
    {
      title: "Three-Tier Tokens",
      desc: "Primitives → Semantic → Component. Predictable theme evolution without breaking changes.",
    },
    {
      title: "Agentic Workflows",
      desc: "Leveraging Claude Code, Figma MCP, and /prompt-master to ship production craft at 10x velocity.",
    },
    {
      title: "Systems Over Hacks",
      desc: "Deeply documented component variants, state matrices, and resilient type safety.",
    },
  ],
}

export const designSystemInfo = {
  systemName: "My-design-system",
  team: "Lucifer Team",
  architecture: "Three-Tier Token Architecture",
  tiers: [
    {
      tier: "Tier 1",
      title: "Primitives",
      desc: "Raw static values for colors, typography scales, spacing units, and radii. Never consumed directly in product UI.",
      examples: [
        { name: "color.neutral.950", value: "#0d0d0d", note: "Base ink black" },
        {
          name: "color.lime.400",
          value: "#b8f36b",
          note: "Primary electric accent",
        },
        { name: "spacing.4", value: "16px", note: "Standard layout pitch" },
        { name: "radius.lg", value: "12px", note: "Surface curve geometry" },
      ],
    },
    {
      tier: "Tier 2",
      title: "Semantic Tokens",
      desc: "Contextual aliases defining intent, interaction state, and theme behavior. Enables instant dark/light retheming.",
      examples: [
        {
          name: "surface.canvas",
          value: "var(--color-neutral-950)",
          note: "Application background",
        },
        {
          name: "surface.panel",
          value: "var(--color-neutral-900)",
          note: "Card & modal container",
        },
        {
          name: "action.primary.bg",
          value: "var(--color-lime-400)",
          note: "High-emphasis call to action",
        },
        {
          name: "feedback.danger",
          value: "var(--color-red-500)",
          note: "Destructive action state",
        },
      ],
    },
    {
      tier: "Tier 3",
      title: "Component Tokens",
      desc: "Scoped directly to component implementations. Dictates variant matrices for buttons, search bars, and dialogs.",
      examples: [
        {
          name: "searchbar.bg.active",
          value: "var(--surface-panel)",
          note: "16-variant SearchBar",
        },
        {
          name: "button.danger.solid.hover",
          value: "var(--color-red-600)",
          note: "36-variant Danger matrix",
        },
        {
          name: "keycap.shadow.travel",
          value: "0 4px 0 #111",
          note: "Mechanical keycap elevation",
        },
      ],
    },
  ],
  components: [
    {
      name: "16-Variant SearchBar System",
      description:
        "Engineered in Figma and coded in React with keyboard shortcuts, active filters, loading skeletons, and clear states.",
      variants: "16 Variants (4 sizes × 4 interaction states)",
      badge: "Component Token Spec",
    },
    {
      name: "36-Variant Danger Button Matrix",
      description:
        "Comprehensive destructive interaction matrix spanning Solid, Outline, Ghost, and Subtly tinted styles across all breakpoints.",
      variants:
        "36 Variants (3 visual styles × 4 sizes × 3 interactive states)",
      badge: "Lucifer Team DS",
    },
    {
      name: "Food Delivery Home Screen",
      description:
        "Complete mobile design system demonstration assembling composite cards, dynamic menus, and real-time cart states.",
      variants: "Figma Auto-Layout 5.0 + Token Studio",
      badge: "Case Study",
    },
    {
      name: "Design System Usage Guidelines",
      description:
        "Live interactive documentation for designers and developers with do/dont pairs, contrast ratios, and token mapping.",
      variants: "Interactive Living Guide",
      badge: "Documentation",
    },
  ],
}

export const shapeFramework = {
  title: "SHAPE Framework",
  subtitle:
    "A systematic methodology for designing high-conversion, resilient digital products.",
  steps: [
    {
      letter: "S",
      title: "Strategy",
      tagline: "Intent & Business Geometry",
      desc: "Grounding every interface in crisp business goals, user psychology, and competitive differentiation before laying a single pixel.",
    },
    {
      letter: "H",
      title: "Hierarchy",
      tagline: "Typographic & Visual Scanning Anchors",
      desc: "Establishing unambiguous focal points. Eye tracking follows contrast, proximity, and deliberate negative space.",
    },
    {
      letter: "A",
      title: "Aesthetics",
      tagline: "Tactile Polish & Token Harmony",
      desc: "Translating brand emotion into micro-surfaces, cohesive 3-tier design tokens, and mechanical tactile feedback.",
    },
    {
      letter: "P",
      title: "Platform",
      tagline: "Performance & Frontend Physics",
      desc: "Ensuring 60fps animations, keyboard navigation, accessible contrast, and zero-layout-shift responsiveness.",
    },
    {
      letter: "E",
      title: "Evolve",
      tagline: "Metrics, AI Prompts & System Health",
      desc: "Continuous iteration through /prompt-master workflows, CRO audits, and design system component versioning.",
    },
  ],
}

export const claudeSkills = [
  {
    name: "practical-ui-principles",
    desc: "Synthesized design book wisdom into an automated inspection skill for spacing, visual weight, and scanability.",
  },
  {
    name: "cro-conversion-principles",
    desc: "Framework-driven conversion rate optimization rules for e-commerce, CTAs, and landing page friction reduction.",
  },
  {
    name: "web-design-playbook",
    desc: "High-leverage layout archetypes, responsive grid systems, and typographical pairings compiled for agentic coding.",
  },
  {
    name: "/prompt-master Workflow",
    desc: "Bespoke prompt engineering system for driving Claude Code with exact Figma MCP specs to generate pristine production code.",
  },
]

export const projects: Project[] = [
  {
    id: "slade-wilson",
    title: "Slade Wilson Watches",
    subtitle: "D2C Luxury Digital Timepiece Platform",
    category: "E-Commerce",
    year: "2024",
    desc: "A luxury D2C digital watch experience with bespoke editorial copy, interactive chronometer inspection, and dark aesthetic.",
    longDesc:
      "Designed and engineered an immersive high-conversion flagship experience for the Slade Wilson timepiece brand. Built around deep carbon tones, metallic micro-textures, and high-precision mechanical dial interactions.",
    metrics: "+34% session duration · 99 Lighthouse performance",
    stack: ["Figma", "React", "TypeScript", "GSAP", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "https://github.com/nikhilarjun",
    accentColor: "#e2b357",
    features: [
      "Interactive 360-degree watch case dial inspector with tactile haptic sound",
      "Editorial homepage copy focused on precision horology storytelling",
      "Fluid GSAP character-by-character headline reveals",
      "Custom checkout flow optimized with CRO principles",
    ],
  },
  {
    id: "my-design-system",
    title: "My-Design-System & Lucifer",
    subtitle: "Three-Tier Token Architecture & Variant Matrix",
    category: "Design System",
    year: "2024",
    desc: "Comprehensive Figma & React design system featuring a 16-variant SearchBar, 36-variant Danger button set, and food delivery app.",
    longDesc:
      "A rigorous design system built to bridge Figma component variants and React design tokens seamlessly. Features three decoupled tiers: Primitives, Semantic aliases, and Component tokens. Built for Lucifer Team workflows.",
    metrics: "52+ coded variants · shared across 4 apps",
    stack: [
      "Figma Tokens",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Storybook",
    ],
    liveUrl: "#",
    githubUrl: "https://github.com/nikhilarjun",
    accentColor: "#b8f36b",
    features: [
      "Strict three-tier token pipeline (Primitive → Semantic → Component)",
      "16-variant SearchBar with live search states, filters, and keyboard shortcut listeners",
      "36-variant Danger Button matrix covering destructive flows with extreme clarity",
      "Complete food delivery screen showing real-world composition",
    ],
  },
  {
    id: "ui-checklist",
    title: "UI-Checklist Tool",
    subtitle: "Shift Nudge 101-Point Inspection App",
    category: "Developer Tool",
    year: "2024",
    desc: "Live interactive quality-assurance web application deployed on Vercel, based on Shift Nudge’s renowned 101-point UI framework.",
    longDesc:
      "Designed and deployed an interactive evaluation engine allowing product designers to audit web interfaces against 101 visual craft criteria spanning typography, alignment, contrast, spacing, and microcopy.",
    metrics: "Used by 1,200+ designers",
    stack: [
      "React",
      "TypeScript",
      "Vercel",
      "Tailwind CSS",
      "LocalStorage Sync",
    ],
    liveUrl: "https://ui-checklist.vercel.app",
    githubUrl: "https://github.com/nikhilarjun",
    accentColor: "#38bdf8",
    features: [
      "101 granular UI craft criteria categorized by Layout, Type, Color, and Feedback",
      "Real-time compliance scoring with instant visual defect reports",
      "Keyboard-driven rapid grading with instant local state persistence",
      "Exportable audit summaries for team design critiques",
    ],
  },
  {
    id: "bhringa-haircare",
    title: "Bhringa Botanical Haircare",
    subtitle: "High-Sensory D2C Product Storytelling",
    category: "E-Commerce",
    year: "2023",
    desc: "Immersive shampoo and botanical hair ritual product experience with interactive ingredient exploration and high-converting microcopy.",
    longDesc:
      "Crafted an organic-luxury digital experience for Bhringa. Paired rich botanical visual palettes with smooth interactive drawers explaining ancient herbal formulations and clinical modern extraction.",
    metrics: "+42% add-to-cart rate",
    stack: ["Figma", "React", "GSAP ScrollTrigger", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "https://github.com/nikhilarjun",
    accentColor: "#86efac",
    features: [
      "Tactile ingredient drawer revealing organic herbs and formulation specs",
      "Custom ritual selector matching hair profiles to bespoke herbal regiments",
      "Silk-smooth GSAP scroll narrative with parallax layer separation",
    ],
  },
  {
    id: "haute-couture-ui",
    title: "Haute Fashion eCommerce UI",
    subtitle: "Zero-Dependency High-End Single-File Experience",
    category: "E-Commerce",
    year: "2023",
    desc: "Hyper-minimal, high-fashion editorial digital boutique crafted as a pristine single HTML experience with silky CSS transitions.",
    longDesc:
      "An exploration in raw web craftsmanship: an ultra-refined luxury fashion editorial interface designed to load instantly with zero external framework dependencies while delivering runway-grade aesthetics.",
    metrics: "0 dependencies · single HTML file",
    stack: ["Vanilla HTML5", "Custom CSS3 Physics", "Figma Prototyping"],
    liveUrl: "#",
    githubUrl: "https://github.com/nikhilarjun",
    accentColor: "#f472b6",
    features: [
      "Editorial runway typography paired with stark monochrome contrast",
      "Zero layout shift fluid gallery with custom inertia scrolling physics",
      "Micro-modal quick view with dynamic swatch preview",
    ],
  },
  {
    id: "orbital-carousel-mcp",
    title: "Orbital Carousel & Animation Lab",
    subtitle: "Claude Code + Figma MCP Interaction Engine",
    category: "Animation & Interaction",
    year: "2024",
    desc: "Physics-based 3D orbital carousel and character-by-character GSAP typography engine built via Figma MCP and Antigravity IDE.",
    longDesc:
      "Pioneered an experimental pipeline bridging Figma MCP directly to code generation in Claude Code and Google Antigravity IDE. Includes an interactive orbital physics carousel and per-character GSAP text reveal engine.",
    metrics: "Steady 60fps animation",
    stack: [
      "GSAP",
      "Figma MCP",
      "Claude Code",
      "TypeScript",
      "Antigravity IDE",
    ],
    liveUrl: "#",
    githubUrl: "https://github.com/nikhilarjun",
    accentColor: "#c084fc",
    features: [
      "Orbital 3D carousel with inertia dragging and magnetic snap to active card",
      "Split-text per-character GSAP physics reveal with custom bezier velocity curves",
      "Exploration integrating Figma MCP schemas directly into Google Antigravity IDE",
    ],
  },
]

export const experience = [
  {
    company: "Design Engineering Studio",
    role: "Lead UI/UX Designer & Frontend Engineer",
    period: "2023 — Present",
    desc: "Architecting scalable design systems, building three-tier token pipelines in Figma and React, and engineering high-impact D2C e-commerce experiences with tactile interaction physics.",
  },
  {
    company: "Lucifer Team Systems",
    role: "Design System Architect",
    period: "2022 — 2023",
    desc: "Designed the 36-variant Danger Button system, 16-variant SearchBar, and component guidelines. Built the Shift Nudge-inspired ui-checklist web application.",
  },
  {
    company: "Independent Creative Technologist",
    role: "Traditional Art & Digital Interface Creator",
    period: "2020 — 2022",
    desc: "Synthesized analog ink portraiture and watercolor principles into digital product design. Shipped 15+ custom web experiences and automated design book principles into Claude skills.",
  },
]

export const stackNodes = [
  {
    id: "figma",
    label: "Figma & Tokens",
    category: "Design",
    x: 200,
    y: 150,
    color: "#f24e1e",
  },
  {
    id: "react",
    label: "React 19",
    category: "Frontend",
    x: 380,
    y: 120,
    color: "#61dafb",
  },
  {
    id: "ts",
    label: "TypeScript",
    category: "Frontend",
    x: 500,
    y: 220,
    color: "#3178c6",
  },
  {
    id: "tailwind",
    label: "Tailwind v4",
    category: "Styling",
    x: 280,
    y: 280,
    color: "#38bdf8",
  },
  {
    id: "gsap",
    label: "GSAP Motion",
    category: "Animation",
    x: 180,
    y: 340,
    color: "#88ce02",
  },
  {
    id: "claude",
    label: "Claude Code",
    category: "AI Workflows",
    x: 540,
    y: 100,
    color: "#d97706",
  },
  {
    id: "mcp",
    label: "Figma MCP",
    category: "Tooling",
    x: 360,
    y: 210,
    color: "#a855f7",
  },
  {
    id: "tokens",
    label: "3-Tier Tokens",
    category: "Design Systems",
    x: 150,
    y: 230,
    color: "#b8f36b",
  },
  {
    id: "webaudio",
    label: "WebAudio Tactile",
    category: "Audio/Sensory",
    x: 440,
    y: 320,
    color: "#f43f5e",
  },
  {
    id: "shape",
    label: "SHAPE Framework",
    category: "Methodology",
    x: 300,
    y: 50,
    color: "#eab308",
  },
]

export const stackConnections: [string, string][] = [
  ["figma", "tokens"],
  ["tokens", "tailwind"],
  ["figma", "mcp"],
  ["mcp", "claude"],
  ["claude", "react"],
  ["react", "ts"],
  ["react", "tailwind"],
  ["react", "gsap"],
  ["react", "webaudio"],
  ["shape", "figma"],
  ["shape", "react"],
  ["tokens", "react"],
]

export const artOrigin = {
  title: "Artistic Origin & Quant Mindset",
  subtitle:
    "How traditional ink, watercolor, and quantitative models forge a differentiated design engineer.",
  facets: [
    {
      title: "Traditional Ink Portraiture",
      tag: "Micro-Hierarchy & Line Tension",
      desc: "In pen-and-ink portraiture, there is no Cmd+Z. Every stroke carries permanent weight. This instilled a relentless discipline for stroke geometry, border contrast, and focal anchors.",
    },
    {
      title: "Watercolor Wash & Anime Illustration",
      tag: "Soft Gradients & Dynamic Poses",
      desc: "Working with wet-on-wet pigments taught me how light diffuses through layers. I translate this into digital surfaces through multi-stop ambient glows, translucent backdrops, and cinematic anime-style dynamism.",
    },
    {
      title: "Quantitative Algorithmic Trading",
      tag: "Systems Thinking & Low Latency",
      desc: "Studying market microstructure, order books, and probability distributions trained my engineering brain: strict state management, low-latency micro-interactions, and systematic token models that never leak.",
    },
  ],
}

export const thoughts = [
  {
    title: "Code is a high-fidelity design tool",
    desc: "Figma represents the static blueprint, but real humans touch living software. Timing curves, state transitions, and responsive physics must be sculpted in the actual runtime.",
  },
  {
    title: "Three-tier tokens prevent design bankruptcy",
    desc: "Without semantic separation, retheming or scaling requires inspecting thousands of hardcoded values. Decoupling primitives from semantic roles ensures lifelong maintainability.",
  },
  {
    title: "Tactile feedback transforms software into an instrument",
    desc: "When an interface responds with spatial depth, crisp physics, and subtle audio cues, it stops feeling like a web page and starts feeling like a physical object in your hands.",
  },
  {
    title: "The best design engineers are bilingual",
    desc: "Speaking fluent component architecture to engineers and fluent visual hierarchy to product leaders eliminates the notorious handoff friction that ruins great ideas.",
  },
]

export const socials = [
  {
    label: "GitHub",
    href: "https://github.com/nikhilarjun",
    user: "@nikhilarjun",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/nikhilarjun",
    user: "in/nikhilarjun",
  },
  {
    label: "Twitter / X",
    href: "https://x.com/nikhilarjun",
    user: "@nikhilarjun",
  },
  {
    label: "Email",
    href: "mailto:nikhilarjun.design@gmail.com",
    user: "nikhilarjun.design@gmail.com",
  },
]

export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "design-system", label: "Design System" },
  { id: "projects", label: "Projects" },
  { id: "shape", label: "SHAPE Framework" },
  { id: "stack", label: "Stack Graph" },
  { id: "playground", label: "Playground" },
  { id: "art", label: "Art & Origin" },
  { id: "contact", label: "Contact" },
]
