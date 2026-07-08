# Rotkeeper Utility Scripts Directory

This directory contains the pipeline, scaffolding, formatting, and diagnostic scripts that maintain the structural integrity and static alignment of the **filed.fyi** archive.

---

## 🛠️ Scaffolding & Formatting Utilities

### 📜 `scaffold-poetry.mjs`
* **Purpose:** Scaffolds missing poetry stubs (Aphorisms, Haikus, and Limericks) for core documentation directories (`lorelog`, `mascots`, `reference`, `posts`, and `guides`).
* **Features:**
  * Uses exact, case-insensitive target naming conventions required by the grave audit (e.g., `hai-056-roboshirker.mdx` for haikus, `lim-roboshirker.mdx` for limericks, and `APH-056.roboshirker.mdx` for aphorisms).
  * Automatically seeds initial metadata (`relatedLorelog`, `relatedMascots`, `mascotRef`) in generated stubs based on the parent source type.

### 📜 `normalize-poetry-breaks.mjs`
* **Purpose:** Traverses poetry files (`src/content/limericks/` and `src/content/haikus/`) and normalizes all lines inside `<Limerick>` components to end with exactly two spaces (`  `), ensuring Markdown formatting correctly preserves line breaks.

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

### 📜 `audit-poetry-alignment.mjs`
* **Purpose:** Audits the reciprocity of poetry assignments, ensuring that when a case file (lorelog) references a haiku/limerick, the corresponding poetry file correctly anchors back to the parent.
* **Output:** `exports/poetry-alignment-audit.md`

### 📜 `audit-poetry.mjs`
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

### 📜 `boundary-audit.mjs`
* **Purpose:** Runs keyword proximity heuristics to group and map mascot files into access, care-delay, summary laundering, or rear-truth boundary shelves.
* **Output:** `exports/boundary-audit.md`

### 📜 `astro-diagnostic.mjs`
* **Purpose:** Pipelines raw frontmatter and body logs of active documents into segmented diagnostics.
* **Output:** `exports/diag-story-*.md` or `exports/diag-classify-*.md`

### 📜 `astro-book.mjs`
* **Purpose:** Packages and bundles collections into physical book structures for exports.
* **Output:** `exports/book-*.md`

---

## 🧠 RAG & Vector Pipeline

### 📜 `build-rag-graph.ts`
* **Purpose:** Processes all documents, breaks them down into semantic chunks, maps relationships, and builds a comprehensive RAG Knowledge Graph.
* **Output:** Saves graph files to `rag-dist/`

### 📜 `index-vectors.ts`
* **Purpose:** Encodes RAG graph chunks into vector embeddings and indexes them using a local LanceDB vector database.
* **Output:** Saves indexed data to `.rag/`

### 📜 `test-retriever.ts`
* **Purpose:** Query utility to test context retrieval from the LanceDB vector database.

---

## 🗃️ Archives

### 📂 `old_scripts/`
* **Purpose:** Holds obsolete scripts, one-time migration corrections, and legacy file versions for historical reference.
