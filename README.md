# Filed & Forgotten

**Filed & Forgotten** is a haunted Starlight/Astro site about systems that kept running long after anyone should have been maintaining them.[file:8][file:1]  
It archives error mascots, bureaucratic lore logs, and poetic residue from software that refuses to shut down.[file:1]

> Nothing here is being published. It is being filed.[file:1]

[![Built with Astro & Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

---

## What is this?

This repo contains the source for [filed.fyi](https://filed.fyi), a static archive of:

- **Mascots** — personified failure states with frontmatter-rich dossiers (corruption level, rot affinity, haiku logs, ceremonial tasks, etc.).[file:1]
- **Lorelog** — incident reports, schema violations, and bureaucratic after-action records rendered as expandable log cards.[file:1][file:9]
- **Haikus & Limericks** — small poetic artifacts about rot, hard determinism, compatibilist free will, and error states.[file:1]
- **Guides & Posts** — occasional prose about the archive and its operating assumptions.[file:1]

The site runs on **Astro 6** with **Starlight** as the docs framework, plus Alpine.js islands and Tailwind 4 via the Vite plugin.[file:3][file:8]  
Starlight’s `PageTitle` slot is overridden to render mascot dossiers instead of boring headings.[file:8][file:9]

---

## Project structure

This is a standard Starlight project with custom content collections for mascots, lorelog, and verse.[file:8][file:1]

```text
.
├── public/                     # Static assets (favicons, etc.)
├── src/
│   ├── components/
│   │   ├── MascotRecord.astro  # Mascot dossier + card renderer
│   │   └── LorelogCard.astro   # Expandable incident log card
│   ├── content/
│   │   └── docs/
│   │       ├── mascots/        # Mascot frontmatter + lore
│   │       ├── lorelog/        # Incident reports
│   │       ├── haikus/         # Database rot poetry
│   │       ├── limericks/      # Free-will and determinism verse
│   │       ├── guides/         # Site and process notes
│   │       └── posts/          # Longer-form experiments
│   ├── styles/
│   │   └── global.css          # Starlight theme hooks + custom UI
│   └── content.config.ts       # Astro content collections/schema
├── astro.config.mjs            # Astro + Starlight + integrations
├── package.json                # Dependencies + scripts
└── tsconfig.json               # TypeScript config
```

Key integrations:[file:3][file:8]

- `@astrojs/starlight` — documentation shell for the archive.
- `@astrojs/alpinejs` — powers collapsible Lorelog sections.
- `@tailwindcss/vite` + `tailwindcss` — utility layer and theme tokens.
- `starlight-site-graph` — visual graph of site content.
- `lucide-astro` / `@lucide/astro` — iconography for mascots and logs.

---

## Development

All commands run from the repo root:

| Command           | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| `npm install`    | Install dependencies.                                        |
| `npm run dev`    | Start dev server (default: `http://localhost:4321`).         |
| `npm run build`  | Build the static site to `./dist/`.                          |
| `npm run preview`| Preview the production build locally.                        |
| `npm run astro`  | Run Astro CLI commands (`astro check`, `astro sync`, etc.). |

This is a static site: no runtime database, no serverless functions, just built artifacts.

---

## Contributing / extending

There is no stable API surface. Everything here is a filing ritual.

If you want to add to the archive:

- Use existing mascot and lorelog entries in `src/content/docs/mascots/` and `src/content/docs/lorelog/` as templates.[file:1]
- Keep frontmatter structured: treat corruption levels, rot affinities, and emotional buffers as first-class fields, not prose.[file:1]
- Remember: the archive misfiles with conviction and treats “last known good state” as a feeling, not a timestamp.[file:1]

Bug reports, lore corrections, and new mascot drafts are welcome via issues or PRs.

---

## License

See `LICENSE` if 