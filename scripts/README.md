# Rotkeeper Utility Scripts Directory

This directory contains the pipeline, scaffolding, formatting, and diagnostic scripts that maintain the structural integrity and static alignment of the **filed.fyi** archive.

---

## 🛠️ Scaffolding & Formatting Utilities

### 📜 `scaffold-poetry.mjs`
* **Purpose:** Scaffolds missing poetry stubs (Aphorisms, Haikus, and Limericks) for core documentation directories (`lorelog`, `mascots`, `reference`, `posts`, and `guides`).
* **Features:**
  * Uses exact, case-insensitive target naming conventions required by the grave audit (e.g., `hai-056-roboshirker.mdx` for haikus, `lim-roboshirker.mdx` for limericks, and `APH-056.roboshirker.mdx` for aphorisms).
  * Automatically seeds initial metadata (`relatedLorelog`, `relatedMascots`, `mascotRef`) in generated stubs based on the parent source type.

---

## 🔍 Diagnostic & Audit Pipelines

### 📜 `astro-grave-audit.mjs` (Run via: `npm run audit:graves`)
* **Purpose:** Runs the "Rotkeeper Grave Audit" to ensure:
  1. No duplicate mascot numbers are declared (**Keyspace Collisions**).
  2. Core documents are aligned with their respective companion poetry files (**Asymmetrical Tombs**).
  3. No dangling, unused poetry stubs exist without matching core files (**Orphan Poems**).
* **Output:** `exports/grave-audit.md`

### 📜 `astro-dist-audit.mjs`
* **Purpose:** Scans the compiled production bundle (`dist/`) after running `npm run build` to verify HTML links, routes, tag pages, and layout sanity are fully resolved.
* **Output:** `exports/html-output-audit.md`

### 📜 `astro-casenum-audit.mjs`
* **Purpose:** Scans the archive to validate all case numbers (`caseNumber: LLG-XXX-XXX`) for uniqueness, uniqueness of references, reciprocity checks, and flags malformed identifiers.
* **Output:** `exports/casenum-audit-full.md` and `exports/casenum-audit-duplicates.md`

### 📜 `audit-poetry-alignment.mjs` (Run via: `npm run audit:poetry-alignment`)
* **Purpose:** Audits the reciprocity of poetry assignments, ensuring that when a case file (lorelog) references a haiku/limerick, the corresponding poetry file correctly anchors back to the parent.
* **Usage:** `node scripts/audit-poetry-alignment.mjs [--json] [--fix-preview] [--batch N] [--collection X]`
  * `--json`: Output machine-readable JSON instead of markdown.
  * `--fix-preview`: Show suggested frontmatter fixes (does not write changes).
  * `--batch N`: Only process batch N (each batch = 30 poems).
  * `--collection X`: Only process collection X (`haikus` | `limericks` | `aphorisms`).
* **Output:** `exports/poetry-alignment-audit.md`

### 📜 `audit-poetry.mjs` (Run via: `npm run audit:poetry`)
* **Purpose:** Generates the master poet registry manifest file for the static site.
* **Output:** `src/content/docs/reference/fref-0900-poet.mdx`

### 📜 `audit-containment.mjs`
* **Purpose:** Ensures any core file referencing highly restricted clusters (such as `Bin 8C` or the `Breeding Program`) contains the mandatory jurisdictional metadata tags in its frontmatter.
* **Output:** `exports/containment-audit.md`

### 📜 `audit-frontmatter-integrity.mjs`
* **Purpose:** Flags frontmatter structure issues (Null vectors/empty arrays collapsing into literal string `"null"`, and tag string fragmentation/stray quotes).
* **Output:** `exports/frontmatter-integrity-audit.md`

### 📜 `audit-mascot-assurance.mjs`
* **Purpose:** Performs weight triage on mascots (classifying files as Ghost, Thin, Adequate, or Substantial based on bytes) and logs metadata field coverage gaps.
* **Output:** `exports/mascot-assurance-audit.md`

### 📜 `audit-form-numbers.mjs` (Run via: `npm run audit:forms`)
* **Purpose:** Validates form number structures across all collections.
* **Output:** Standard terminal logs and build checks.

### 📜 `boundary-audit.mjs`
* **Purpose:** Runs keyword proximity heuristics to group and map mascot files into access, care-delay, summary laundering, or rear-truth boundary shelves.
* **Output:** `exports/boundary-audit.md`

### 📜 `governance-suite.mjs` (Run via: `npm run audit:governance`)
* **Purpose:** Orchestrates case number, containment, and frontmatter integrity audits to generate standard reference documents.
* **Output:** Emits MDX files inside `src/content/docs/reference/audits/` (e.g., `fref-audt-case.mdx`).

### 📜 `check-box-telemetry.mjs` (Run via: `npm run audit:all`)
* **Purpose:** Orchestrates full diagnostics suite pre-runs and compiles a unified sandbox cleanup report.
* **Output:** `exports/unified-cleanup-report.md` and `exports/litter-telemetry.json`.

### 📜 `track-waste.mjs` (Run via: `npm run track -- --add` or `npm run track -- --clear`)
* **Purpose:** Simple utility to track and manage un-scooped litter metrics in sandbox telemetry.
* **Usage:**
  * `npm run track -- --add` - Increment un-scooped turds.
  * `npm run track -- --clear` - Reset tracking to zero.

### 📜 `poetry-prompt-princess.js`
* **Purpose:** Specialized helper script to generate structured prompt contexts and statistics for LLM-based poetry tasks.

### 📜 `migrate-poetry-frontmatter.mjs`
* **Purpose:** Normalizes and migrates old poetry parent reference keys (e.g. `relatedLorelog`, `relatedMascots`) to unified `parentEntry` fields.
* **Usage:** `node scripts/migrate-poetry-frontmatter.mjs [--dry]`

### 📜 `astro-diagnostic.mjs`
* **Purpose:** Pipelines raw frontmatter and body logs of active documents into segmented diagnostics.
* **Output:** `exports/diag-story-*.md` or `exports/diag-classify-*.md`

### 📜 `astro-book.mjs` (Run via: `npm run archive`)
* **Purpose:** Packages and bundles collections into physical book structures for exports.
* **Output:** `exports/book-*.md`


---


## 🗃️ Archives

### 📂 `one-off/`
* **Purpose:** Holds obsolete scripts, one-time migration corrections, and legacy/temporary file versions for historical reference.
* **Scripts:**
  * 📜 `dedupe-frontmatter.mjs` — Deduplicates array fields and objects in frontmatter.
  * 📜 `normalize-poetry-breaks.mjs` — Traverses poetry and normalizes line breaks inside `<Limerick>` components.
  * 📜 `normalize-version-fields.mjs` — Harmonizes `version` and `versionLabel` frontmatter fields.
  * 📜 `weaponize-missing-forms.mjs` — Injects case numbers and related lorelog links based on file basenames.
