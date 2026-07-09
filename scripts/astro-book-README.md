# Astro Book Packaging Pipeline (`scripts/astro-book.mjs`)

This document describes the compilation and segmentation rules used by the packaging pipeline (`scripts/astro-book.mjs`) to consolidate the project's source code, configurations, documentation, and archival contents into context-size-safe reference books.

The pipeline processes files matching standard code and document extensions (excluding standard caches, builds, and dependencies) and routes them into the following segmented books within the `exports/` directory.

---

## 📚 Segmentation Rules & Target Books

### 1. Project Core Book (`exports/book-core.md` / `exports/book-core-part*.md`)
Contains the primary documentation and archival records, ensuring clean context isolation from verse and magic layers.
* **Target Folders:**
  - `src/content/docs/changelog/`
  - `src/content/docs/guides/`
  - `src/content/docs/lorelog/`
  - `src/content/docs/mascots/`
  - `src/content/docs/posts/`
  - `src/content/docs/reference/` (excluding `reference/empathegy`)
  - `src/content/docs/releases/`
  - Root documents directly under `src/content/docs/` (e.g. `index.mdx`)
* **Exclusions:**
  - Excludes all poetry files (`limericks`, `aphorisms`, `haikus`).
  - Excludes all files containing `magic` in their paths.
  - Excludes default system patterns (e.g. `node_modules`, `dist`, `.astro`, `reference/empathegy`).

### 2. Project Poetry Book (`exports/book-poetry.md` / `exports/book-poetry-part*.md`)
Houses all historical archive residue (verse format) isolated from the rest of the documentation.
* **Target Folders:**
  - `src/content/aphorisms/`
  - `src/content/haikus/`
  - `src/content/limericks/`
* **Exclusions:**
  - Excludes all files containing `magic` in their paths.
  - Excludes default system patterns.

### 3. Project Architecture Bones (`exports/book-bones.md`)
Consolidates the active web application codebase, design styles, layouts, pages, and components.
* **Target Folders:**
  - `src/components/`
  - `src/layouts/`
  - `src/styles/`
  - `src/pages/`
  - `src/lib/`
* **Exclusions:**
  - Excludes all files containing `magic` in their paths.
  - Excludes default system patterns.

### 4. Project Blueprint & Configs (`exports/book-blueprint.md`)
Groups general project guidelines and base system configuration files.
* **Target Folders / Patterns:**
  - Root project configuration files: `tsconfig.*`, `package.json`, `package-lock.json`, `astro.config.*`, `content.config.ts`, `*.config.*`.
  - Root markdown guidelines: `README.md`, `rules.md`, `GEMINI.md`.
* **Exclusions:**
  - Excludes `node_modules` configurations.
  - Excludes all files containing `magic` in their paths.
  - Excludes default system patterns.

### 5. Project Magic Codex (`exports/book-magic.md` / `exports/book-magic-part*.md`)
*New dedicated book segment.* Isolates high-volume, highly specialized technical domain assets and project scripts to prevent contextual bloating of general core documentation.
* **Target Patterns:**
  - Files under the `/scripts/` folder.
  - Any valid file path in the project containing `magic` (case-insensitive) in its name or folder path.
* **Exclusions:**
  - Excludes default system patterns (e.g. `node_modules`, `dist`, `.astro`).

---

## ⚙️ Core Configuration Details

* **Chunk Size Limit:** Approx `500 KB` (`CHUNK_SIZE_LIMIT = 500 * 1024`). Files exceeding this size are split into sequentially indexed parts (e.g., `-part1`, `-part2`, etc.) to prevent LLM context exhaustion.
* **Default Excludes:** The following directories/patterns are ignored globally:
  - `node_modules`
  - `public`
  - `dist`
  - `.git`
  - `.astro`
  - `.cache`
  - `exports`
  - `.rag`
  - `reference/empathegy`
  - `.turbo`
  - `.vercel`
