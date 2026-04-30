# Filed & Forgotten

**Filed & Forgotten** is a haunted Astro + Starlight site about systems that kept running long after anyone was officially responsible for them.[file:8][file:1]  
It files obsolete mascots, lore logs, and poetic residue from software that refuses to shut down.[file:1]

> This is not a documentation site. This is a frozen filing cabinet that learned to haunt.[file:1]

[![Built with Astro & Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

---

## What is this?

This repo contains the source for [filed.fyi](https://filed.fyi), a static archive of:

- **Mascots** — error spirits and bureaucratic entities defined as rich frontmatter objects under `src/content/docs/mascots/`.[file:1]
- **Lorelog** — incident reports and schema-violation records rendered as expandable log cards from `src/lorelog/`.[file:1]
- **Haikus & Limericks** — small verse about database rot, hard determinism, compatibilism, and other forms of semantic mildew.[file:1]
- **Reference docs** — internal frameworks like the Lorelog-governed entropy docs and the TIME-Derived Concept Ingestion Pipeline.[file:1]

The site is built with **Astro 6** and **Starlight**, with Alpine.js for light interactivity and Tailwind 4 via the Vite plugin.[file:3][file:8]  
Starlight’s `PageTitle` slot is overridden so mascot pages render full dossiers instead of generic headings.[file:8][file:9]

---

## Project structure

Current structure (trimmed to the interesting bits):

```text
.
├── astro.config.mjs           # Astro + Starlight config + integrations
├── content.config.ts          # Astro content collections/schema
├── public/                    # Static assets
├── src/
│   ├── assets/                # Mascot and page art
│   ├── components/
│   │   ├── FormattedDate.astro
│   │   ├── LorelogCard.astro  # Expandable lorelog incident card
│   │   └── MascotRecord.astro # Mascot dossier + card (also PageTitle override)
│   ├── content/
│   │   ├── docs/
│   │   │   ├── changelog/     # Site change notes
│   │   │   ├── guides/        # Starlight-style guides
│   │   │   ├── haikus/        # Rot-in-the-database poetry
│   │   │   ├── limericks/     # Compatibilist / determinist limericks
│   │   │   ├── mascots/       # All mascot frontmatter + lore
│   │   │   ├── posts/         # Long-form transcripts and essays
│   │   │   ├── reference/     # Internal frameworks (BHDSS, TDCIP, etc.)
│   │   │   └── releases/      # Release notes
│   │   └── index.mdx          # Haunted homepage content
│   ├── lorelog/               # Lorelog entries as plain Markdown
│   ├── layouts/               # (Reserved for custom layouts)
│   ├── pages/
│   │   ├── lorelog/
│   │   │   ├── index.astro    # Lorelog listing
│   │   │   └── [slug].astro   # Individual lorelog entry route
│   │   └── mascots/
│   │       └── index.astro    # Mascot index (non-nav, experimental)
│   └── styles/
│       └── global.css         # Starlight theme layer + custom UI
├── deploy.sh                  # Deployment script(s)
├── ship.sh                    # Shipping helpers
├── package.json
├── package-lock.json
├── tsconfig.json
└── rules.md                   # “Filed & Forgotten” system constraints
```

Key integrations and dependencies:[file:3][file:8]

- `@astrojs/starlight` — docs shell that the archive lives inside.
- `@astrojs/alpinejs` — powers Lorelog expand/collapse via Alpine directives.
- `@tailwindcss/vite` + `tailwindcss` — design tokens and utilities.
- `starlight-site-graph` — site graph visualization.
- `lucide-astro` / `@lucide/astro` — icon set for cards and chips.
- `sharp` / `sass` — image and style pipeline support.

---

## Development

Run everything from the project root.

### Install

```bash
npm install
```

### Local development

```bash
npm run dev
# default: http://localhost:4321
```

### Build & preview

```bash
npm run build    # Build static site into ./dist
npm run preview  # Preview the built site locally
```

You can also use the Astro CLI directly:

```bash
npm run astro -- check
npm run astro -- sync
```

---

## Content model (high level)

- **Mascots** are defined as structured frontmatter in `src/content/docs/mascots/*.md` and rendered via `MascotRecord.astro` into dossier panels and index cards.[file:1][file:9]
- **Lorelog entries** live under `src/lorelog/*.md` and are rendered as interactive cards using `LorelogCard.astro` on `src/pages/lorelog/`.[file:1][file:9]
- Other collections (`haikus`, `limericks`, `reference`, `releases`) use more conventional Starlight doc rendering but share the same archive tone.[file:1]

If you’re adding new content, start by copying a nearby mascot or lorelog file and editing the frontmatter fields rather than improvising a new schema.

---

## Contributing

This project is primarily an art/fiction archive built on top of real-world failure patterns. If you want to contribute:

- New mascots: add a file under `src/content/docs/mascots/` and follow an existing frontmatter schema.[file:1]
- New incidents: add a `src/lorelog/LLG-XXXX-XXX.md` entry and use the established Lorelog fields (`severity`, `disposition`, `resolution`, etc.).[file:1][file:9]

Issues and PRs for content, lore corrections, and small presentation fixes are welcome. Large refactors should preserve the “static, flat-file archive” philosophy in `rules.md`.[file:2]

---

## License

See `LICENSE` if present. If not, treat this as a read-only archive of weird software lore unless otherwise clarified in the repo.