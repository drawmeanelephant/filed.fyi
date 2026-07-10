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

### 2. Project Aphorisms Book (`exports/book-poetry-aphorisms.md` / `exports/book-poetry-aphorisms-part*.md`)
Houses all historical aphorism archive residue isolated from the rest of the documentation.
* **Target Folders:**
  - `src/content/aphorisms/`
* **Exclusions:**
  - Excludes all files containing `magic` in their paths.
  - Excludes default system patterns.

### 3. Project Limericks Book (`exports/book-poetry-limericks.md` / `exports/book-poetry-limericks-part*.md`)
Houses all historical limerick archive residue isolated from the rest of the documentation.
* **Target Folders:**
  - `src/content/limericks/`
* **Exclusions:**
  - Excludes all files containing `magic` in their paths.
  - Excludes default system patterns.

### 4. Project Haikus Book (`exports/book-poetry-haikus.md` / `exports/book-poetry-haikus-part*.md`)
Houses all historical haiku archive residue isolated from the rest of the documentation.
* **Target Folders:**
  - `src/content/haikus/`
* **Exclusions:**
  - Excludes all files containing `magic` in their paths.
  - Excludes default system patterns.

### 5. Project Architecture Bones (`exports/book-bones.md`)
Consolidates the active web application codebase, design styles, layouts, pages, and components.
*Segmentation is disabled for this book.*
* **Target Folders:**
  - `src/components/`
  - `src/layouts/`
  - `src/styles/`
  - `src/pages/`
  - `src/lib/`
* **Exclusions:**
  - Excludes files inside `/scripts/` folder.
  - Excludes all files containing `magic` in their paths.
  - Excludes default system patterns.

### 6. Project Blueprint & Configs (`exports/book-blueprint.md`)
Groups general project guidelines and base system configuration files at the root level of the workspace.
*Segmentation is disabled for this book.*
* **Target Folders / Patterns:**
  - Root project configuration files: `tsconfig.*`, `package.json`, `package-lock.json`, `astro.config.*`, `content.config.ts`, `*.config.*`.
  - Root markdown guidelines: `README.md`, `rules.md`, `GEMINI.md`.
* **Exclusions:**
  - Excludes files inside `/scripts/` or other subdirectories (strictly matches files at the root level).
  - Excludes `node_modules` configurations.
  - Excludes all files containing `magic` in their paths.
  - Excludes default system patterns.

### 7. Project Magic Codex (`exports/book-magic.md` / `exports/book-magic-part*.md`)
*New dedicated book segment.* Isolates high-volume, highly specialized technical domain assets and project scripts to prevent contextual bloating of general core documentation.
* **Target Patterns:**
  - Files under the `/scripts/` folder.
  - Any valid file path in the project containing `magic` (case-insensitive) in its name or folder path.
* **Exclusions:**
  - Excludes default system patterns (e.g. `node_modules`, `dist`, `.astro`).

---

## ⚙️ Core Configuration Details

* **Chunk Size Limit:** Segmented books are split dynamically:
  - Part 1 is capped at approx `100 KB` (`100 * 1024` bytes) to keep the initial document smaller without cutting off any file blocks.
  - Subsequent parts are capped at approx `500 KB` (`500 * 1024` bytes) to prevent LLM context exhaustion.
  - Segmentation is disabled entirely for Project Architecture Bones and Project Blueprint & Configs.
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
