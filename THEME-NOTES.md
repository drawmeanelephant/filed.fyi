# 🏢 Filed & Forgotten Archive — Theme System Notes

This document describes the visual system design, the theme variants, the intentionally absent/removed elements, and preview instructions for the central archive registry.

---

## 🎨 Visual System Design

Rather than simulating a modern SaaS product documentation site, the interface is designed as an **honest archival viewer** for the Filed & Forgotten registry. The visual layout uses clean grid spacing, semantic HTML, and focuses purely on high-fidelity document reading and structured metadata.

### 🏛️ The Three Static Theme Variants

1. **Light Theme (`themes/corp-vendor` -> `dist/corp`)**
   - **Concept:** Warm paper and ink.
   - **Background:** Warm linen/cream background (`#f6f3eb`) with a pure soft white page card (`#fefdfb`).
   - **Typography:** Serif body text (Lora/Georgia) for high-contrast reading, paired with clean Outfit sans-serif for headings, metadata labels, and navigation.
   - **Accents:** Restrained terracotta red-oxide (`#8b3c2a`) for links, hover states, and active page indications.

2. **Dark Theme (`themes/google-material` -> `dist/material`)**
   - **Concept:** Retro microfiche viewer / dark system terminal.
   - **Background:** Deep void black background (`#09090b`) with a soft dark card container (`#121215`).
   - **Typography:** Crisp zinc white text (`#f4f4f7`) with warm slate-toned descriptions, using the same serif/sans structural pairing.
   - **Accents:** Retro system amber/bronze (`#f59e0b`) for interactive links and active selections, providing excellent contrast and a technical archive aesthetic.

3. **Pride Theme (`themes/cozy-typepad` -> `dist/cozy`)**
   - **Concept:** Celebratory pride archive.
   - **Background:** Soft orchid/cream pastel background (`#faf5fa`) with a clean white page base.
   - **Details:** Features a fixed 6px pride rainbow stripe running across the absolute top edge of the window.
   - **Typography:** High-contrast deep indigo text (`#1e1b4b`) and royal purple descriptions.
   - **Accents:** Vibrant pink (`#db2777`) for interactive states and lavender selections.

### Cantilever typography

Cantilever uses a self-hosted editorial type system:

- **Crimson Pro** variable 400–900 supplies the brand, page titles, and section headings.
- **Plus Jakarta Sans** variable 400–800 supplies body copy, navigation, search, and interface labels.
- **IBM Plex Mono** regular/medium/semibold supplies code, shortcuts, and archive metadata.

The theme ships Latin and Latin-ext WOFF2 subsets under
`themes/cantilever/assets/fonts/`, with the upstream SIL Open Font License file
beside each family and a provenance note in `assets/fonts/README.md`. CSS
fallback stacks preserve legibility if a browser cannot load WOFF2.

---

## 🚪 Intentionally Absent & Replaced Controls (Before vs. After)

All fake, non-functional "cosplay" UI elements present in the original templates have been stripped out. The archive search is the intentional exception: it is now a real Boris-backed progressive enhancement in the Cantilever header. The table below outlines these adjustments:

| Component | Before (Cosplay UI) | After (Archival UI) | Reason / outcome |
|---|---|---|---|
| **Global Alert Bar** | Restricted warnings: `CONFIDENTIAL CONFIDENTIAL CONFIDENTIAL // ENTERPRISE DATA PORTAL // SLA: PLATINUM` | **Removed completely.** | Cosmetic noise that distracted from the actual archival text and entity metadata. |
| **Search Box** | Non-functional, disabled `Filter index registry...` input with magnifying glass icon in sidebar. | **Replaced with a live, centered archive search control.** | The Cantilever theme now consumes Boris’s rendered search index, links to matching page sections, and keeps collection navigation as the no-JavaScript fallback. |
| **Version Selector** | Fake dropdown showing `v0.6.1-PRO (LTS)`, `v0.6.0-BETA`, etc. | **Removed completely.** | Dead select menu with no backend versions to switch to. |
| **SLA Badges & Uptime** | Dynamic-looking text asserting `SLA ACTIVE: 99.998% UPTIME` and `SLA: PLATINUM` flags. | **Removed completely.** | Invented brand semantics with zero system tracking. |
| **Print Button** | Active button executing JS `window.print()` in breadcrumb action bar. | **Removed completely.** | Redundant control (native browser printing works out of the box via standard print stylesheets if needed). |
| **Useless Links** | Footer links to fake corporate SLA sheets, Support desks, and security audits. | **Simplified to build metadata.** | Links went to dead `#` hashes, cluttering the footer. |

---

## 🗜️ Reduced Navigation Weight

To prevent the entire 500+ document tree from flooding every page's visual space:
- **Trunk Accordions via CSS:** The sidebar site navigation (`{{nav}}`) hides satellite directories by default.
- **Active Path Expansion:** Using the CSS `:has(.is-current)` parent selector, the satellites of a trunk are displayed *only* when that trunk is the active page, or when one of its child satellites is active.
- **Local Context:** Trunk pages list their children cleanly inside the body (`{{children}}`), and Satellite pages display functional breadcrumbs (`{{breadcrumb}}`) back to their parent trunk.

---

## 🚀 Local Preview Instructions

You can build and preview the three theme variants locally by compiling each output directory.

### 1. Build the Themes
Run the validation script to compile all targets:
```bash
./bin/validate_graph.sh
```

### 2. Start the Local Server
Start a local HTTP server to view the outputs:
```bash
python3 -m http.server 8000 --directory dist
```
Now, you can inspect each theme by visiting the following URLs in your browser:

### 3. Representative Preview Pages

- **Home / Trunk Page:**
  - *Light Theme:* [http://localhost:8000/corp/index.html](http://localhost:8000/corp/index.html)
  - *Dark Theme:* [http://localhost:8000/material/index.html](http://localhost:8000/material/index.html)
  - *Pride Theme:* [http://localhost:8000/cozy/index.html](http://localhost:8000/cozy/index.html)

- **Trunk Page with Children (e.g. Changelog):**
  - *Light Theme:* [http://localhost:8000/corp/changelog.html](http://localhost:8000/corp/changelog.html)
  - *Dark Theme:* [http://localhost:8000/material/changelog.html](http://localhost:8000/material/changelog.html)

- **Satellite Page (e.g. Initial Restoration):**
  - *Light Theme:* [http://localhost:8000/corp/changelog/2026-04-22-init.html](http://localhost:8000/corp/changelog/2026-04-22-init.html)

- **Long-form Lore Page (with Table of Contents and heavy prose):**
  - *Light Theme:* [http://localhost:8000/corp/lorelog/llg-0400-scas.html](http://localhost:8000/corp/lorelog/llg-0400-scas.html)
  - *Dark Theme:* [http://localhost:8000/material/lorelog/llg-0400-scas.html](http://localhost:8000/material/lorelog/llg-0400-scas.html)
