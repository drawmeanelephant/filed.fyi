# Workflow Residue Inventory — Filed & Forgotten Archive

**Status:** report-only inventory. No content was removed, moved, rewritten, or quarantined.
**Branch:** `audit/workflow-residue-inventory` (fresh from `origin/main`, base commit `b5cd8a5c`)
**Date:** 2026-08-05
**Scope:** all source Markdown (`content/`), metadata, scripts, reports, themes, docs, and generated-output configuration.

---

## 1. Method

Every finding was produced by:

1. Deterministic `ripgrep` scans for the declared search targets (Sora, presets, generation, prompts, TODO/TBD/stub, placeholder, `web:[n]` markers, local absolute paths, `src/content` and `.mdx` pre-migration references, `node scripts/` commands, HTML comments, `<Aside>` MDX components, agent files, migration/scratch references).
2. Full-record reads before classification (rules: no classification from keyword match alone; mascots mentioning Sora are not automatically removable; fictional bureaucratic workflows are not production residue).
3. Git-history provenance (`git log`, `git log -S`) to distinguish deliberate lore from campaign scaffolding.
4. Live-site verification of render/export semantics against the deployed archive (`sitemap.xml`, page fetches).

No finding was classified from a keyword match alone. Full search commands are listed in the appendix.

---

## 2. Provenance — how this residue got here

Git history documents an explicit **poetry-generation subagent campaign** ("JULES-POET") and a later, partial cleanup:

| Evidence | Commit |
|---|---|
| Campaign commits: `Append haikus for JULES-POET-04 TRIVIALITY_ELEVATION`, `feat: generate BUREAU_ASH aphorisms for JULES-POET-12`, `feat(content): append BUREAUCRATIC_DESPAIR limericks to JULES-POET-11 targets`, `chore: append structural gap haikus per JULES-POET-03 directive`, `feat: run poetry-prompt-princess script and fix remote duplicate closing tags` | `4d6d8e73`, `664a2b48`, `f9030588`, `73ca3780`, `906d1bae`, `c59a3e72` |
| Quarantine step: `refactor(content): quarantine poetry subagent manifests and clean duplicate/malformed tags (Steps 5 & 6)` — moved the fref-0900-poet original plus fref-0901…fref-0918 into `src/content-residue/workflow/reference/*.quarantined.md` | `a3acce06` |
| Quarantine step: `refactor(content): quarantine Sora scaffolding and condense inflated tags (Steps 7 & 8)` — moved `*.generated.md` Sora scaffolding for ~100 mascots into `src/content-residue/workflow/generation/mascots/` | `9b12f986` |
| The Astro→Boris migration recreated the 18 fref-090x records **from the quarantined copies**, restoring them as published archive records tagged `scratchpad` + `prompt-addendum` (see `reports/tag-roundtrip-fix.md` §3) | `8e7db007` |

Conclusion: the quarantine of the poetry subagent manifests (Steps 5 & 6) and Sora scaffolding (Steps 7 & 8) was **reversed by the migration** for the reference manifests, and the Sora `## Sora Prompts` / `## Sora Preset` sections remain in 101 mascots. The current tree is therefore a *post-quarantine, partially restored* state.

---

## 3. Render / export semantics (evidence)

| Surface | Semantics | Evidence |
|---|---|---|
| Public render | All `content/` records compile to HTML at `https://filed.fyi/<collection>/<CANONICAL-ID>.html`, including `status: archived` pages. | Live sitemap contains `FREF-0900-POET`, `FREF-0901-APIV`, `HAI-0056`, `M-0014`, `APH-FREF-0901-APIV`; 2,260 URLs total. |
| Sitemap | All pages except the 5 `status: draft` records (`fref-0200-cbac`, `fref-0400-metr`, `fref-0070-aopt`, `fref-0410-sclb`, `fref-0420-ancl`). Drafts still render. | Live sitemap (2,260 vs 2,265 pages), consistent with `reports/post-migration-integrity.md` §“sitemap under-reports by 5 pages”. |
| RAG / Context / IR exports | `scripts/filed-publish.sh` runs `--rag-dir`, `--context-dir`, `--out ir` over the entire `content/` tree — **every record, regardless of status**. | `scripts/filed-publish.sh` |
| llms.txt | Generated from `content/` by the publish script; live deployment serves an HTML fallback at `/llms.txt`, so live membership could not be verified. Expected scope: all non-draft pages. | live check + `scripts/filed-publish.sh` |
| Repo-root / docs / reports / scripts / metadata / themes / `.github` | Outside the archive surface: never rendered, never exported. | publish pipeline inputs are `content/` only |

Status counts in corpus: 1,273 published, 987 archived, 5 draft, 4 nominal, 2 external, 1 revised.

---

## 4. Classification definitions

- **KEEP** — Intentional archival fiction whose workflow language is part of the artifact (including fictional bureaucratic workflows and mascots that mention Sora).
- **QUARANTINE** — Authentic production residue worth preserving for provenance but inappropriate in the primary archive surface.
- **REMOVE** — Pure temporary garbage with no archival, historical, or diagnostic value.
- **REVIEW** — Ambiguous cases where production process and intentional lore are entangled.

Confidence: high / medium / low.

---

## 5. Findings

### Cluster A — JULES-POET poetry campaign manifests (highest signal)

These are the strongest workflow-residue findings in the corpus. All are self-labeled in their own tags (`scratchpad`, `prompt-addendum`), contain literal agent system-prompts, command the agent to run scripts (`node scripts/audit-poetry-vectors.mjs`, which **does not exist** in this repo), and point at pre-migration paths (`src/content/docs/reference/fref-0900-poet.mdx`, `.mdx` target filenames).

#### A1. `content/reference/fref-0900-poet.md` — the campaign manifest

| Field | Value |
|---|---|
| Record ID | `reference/FREF-0900-POET` (collection: reference) |
| Section / lines | Frontmatter (`title: "Poetry Audit Report"`, `status: archived`, `tags: ["reference","audit","poetry","historical-residue"]`); H1 “Poetry Collection Audit & Agent Scratchpad Manifest” (line 9); “Active Subagent Flight Manifest” table (lines 14–31, JULES-POET-01…12 with `.mdx` targets and tone labels); archive totals & coverage matrices (lines 40–150); “Stub: Poetry Audit Report” (line 303) |
| Matching phrase | “Agent Scratchpad Manifest”, “dynamically calculated subagent staging routes”, “The active coordination directives are stored out-of-bounds” |
| Why it is residue | Its primary function is documenting how generated content was made: a live manifest of the poetry campaign, its 12 subagents, their injected tones, and their target files. |
| Renders publicly? | Yes (verified in live sitemap as `FREF-0900-POET`) |
| Enters exports? | RAG/Context/IR: yes. Sitemap: yes. llms.txt: expected yes (unverified live) |
| Inbound links | None (the 18 prompt-addendum records mention it only as plain text inside code blocks, `src/content/docs/reference/fref-0900-poet.mdx`) |
| Outbound links / relations | None; no `relations:` declared |
| Echo records | `haikus/HAI-FREF-0900-POET`, `aphorisms/APH-FREF-0900-POET`, `limericks/LIM-FREF-0900-POET` (all published) |
| Classification | **QUARANTINE** (confidence: high) — already marked `archived` + tagged `historical-residue`, i.e. quarantined in place. Per the brief, do **not** relocate it in this pass. |
| Smallest defensible next action | Leave in place; formalize the quarantine decision (e.g., document the manifest as provenance-only and strip the live flight manifest table from the rendered page, or move to an out-of-bounds scratch location in a future pass). |

#### A2. `content/reference/fref-0901-apiv.md` … `fref-0918-qmcl.md` — the 18 prompt-addendum records

| Field | Value (per record; template-identical) |
|---|---|
| Record IDs | `reference/FREF-0901-APIV` … `reference/FREF-0918-QMCL` (collection: reference; all `status: published`) |
| Section / lines | Frontmatter `tags: ["reference","scratchpad","prompt-addendum"]` (line 6); “🤖 System Directive Instruction Block” fenced block (≈ lines 16–49); “📊 Monitored Target Coordinates” (lists `.mdx` files); “Stub: …” headings ×3 in appended verse |
| Matching phrase | “You are a specialized routine compiling records…” / “You are a highly structured, unbothered mainframe script…” / “You are a cold qualitative telemetry sensor…”; “Execute the central poetry audit script via the terminal”; “Open the generated markdown report at `src/content/docs/reference/fref-0900-poet.mdx`”; “Run `node scripts/audit-poetry-vectors.mjs`” (12 of 18 records); “Read their current contents completely”; “FORBIDDEN WORDS: bug, glitch, coffee, coding…” |
| Why it is residue | The instruction blocks are literal, operational agent prompts for generating poetry into the archive — they describe production workflow, not lore. They reference deleted tooling (`scripts/audit-poetry-vectors.mjs` does not exist), pre-migration paths, and instruct an agent to read target files. The bureaucratic protocol framing (Allocation Protocol / Compliance Ledger / Restoration Directive / Qualitative Matrix) is lore, but it wraps production instructions. This is the textbook REVIEW case: production process and intentional lore entangled. |
| Renders publicly? | Yes (verified: `FREF-0901-APIV` in live sitemap) — the instruction block renders as a visible code block on filed.fyi |
| Enters exports? | RAG/Context/IR: yes. Sitemap: yes. llms.txt: expected yes |
| Inbound links | 0 for 17 of 18; **`FREF-0916-QMBA` has exactly 1**: `guides/gratitude-drift.md:17` → `[Qualitative Matrix BUREAU_ASH (Telemetry Gap)](../reference/fref-0916-qmba.md)` |
| Outbound links / relations | None; no `relations:` declared in any of the 18 |
| Classification | **REVIEW** (confidence: high), with a quarantine lean: the “System Directive Instruction Block” + “Monitored Target Coordinates” are the quarantine component; the generated verses appended below are campaign output. |
| Smallest defensible next action | Move the fenced instruction block and target-coordinate list out of the rendered archive surface (out-of-bounds scratch or `content-residue`-style provenance), retaining the protocol titles and appended verse, or degrade the instruction text into lore. Do the same for all 18 records. |

Representative reads: `fref-0901-apiv`, `fref-0902-clls`, `fref-0904-rdcr`, `fref-0912-rdrv`, `fref-0918-qmcl` (full files); all 18 confirmed template-identical via line-level scans.

#### A3. The 57 echo records (`hai-*`, `APH-*`, `LIM-*` for fref-0900…0918)

| Field | Value |
|---|---|
| Records | 19 × `content/haikus/hai-fref-09xx.md`, 19 × `content/aphorisms/APH-fref-09xx.md`, 19 × `content/limericks/LIM-fref-09xx.md` — all `status: published` |
| Matching phrase | Titles “Stub: Allocation Protocol INDEX_VAULT (Dense Overdrift)” etc.; several bodies are the campaign placeholder verse “Awaiting context / The record is totally bare / Pending binding soon” |
| Why it is residue | These are the campaign’s per-record output slots: stub-titled poetry pages generated by (or reserved for) the JULES-POET subagents. Titles encode the campaign’s gap-type vocabulary, not lore. |
| Renders publicly? | Yes (verified: `HAI-0056`… no — `APH-FREF-0901-APIV` in sitemap; all 57 published) |
| Enters exports? | Yes (all surfaces) |
| Inbound links | None |
| Classification | **REVIEW** (confidence: high) — campaign products; disposition depends on whether the archive intends to keep empty stub poems as artifact (see “Awaiting context” cluster). |
| Smallest defensible next action | Inventory the 57; for the pure “Awaiting context” placeholders, decide remove-vs-retain as a single policy; the id-map already records their “Stub:” titles. |

### Cluster B — “Awaiting context” placeholder verse (108 files)

| Field | Value |
|---|---|
| Records | 108 files across haikus, lorelog, mascots, posts, reference (incl. all 15 fref-0901+ reference records, their haiku echoes, and stub haiku pages like `hai-056-roboshirker`) |
| Matching phrase | “Awaiting context / The record is totally bare / Pending binding soon” (also “Awaiting procedural interpretation.”) |
| Why it is residue | The canonical placeholder verse the campaign used whenever appended verse was not generated. It describes the *generation workflow’s* pending state, not archive content. |
| Renders publicly? | Yes (e.g. `haikus/HAI-0056` is a published page titled “Stub: RoboShirker” with only this verse) |
| Enters exports? | Yes |
| Inbound links | None for the placeholder pages |
| Classification | **REVIEW** (confidence: medium). The placeholder has diagnostic value (documents the campaign’s incompleteness) but zero lore content; `reports/post-migration-integrity.md` already flagged this class as needing “a separate editorial audit.” |
| Smallest defensible next action | Treat as one policy decision: either retain as archival evidence of the campaign (KEEP, documented), or remove the placeholder verse from published pages (REMOVE). Do not decide per-file in isolation. |

### Cluster C — Sora prompts / presets (mascots)

| Finding | Classification | Confidence |
|---|---|---|
| **Corpus aggregate:** 101 mascots carry a `## Sora Prompts` section; 98 carry a `## Sora Preset` (or `### Sora Preset`) section. The large majority use the lore format (**Scene / Style / Text / Mood** bullets, e.g. `M-0422`, `M-0423`, `M-0040`) describing the mascot’s fictional generated portrait, plus a preset token like `` `preset_422_formsister` ``. These are intentional archival fiction: the mascots are “Sora-rendered” in-universe, and the sections are part of the mascot record format. **KEEP.** | KEEP | high |
| `content/mascots/057.zhuzhing-ping.md` (“## Sora Prompts”, ≈ line 44) contains a raw, unlabelled style-descriptor blob (“surreal mascot spirit, glitchy design assistant with floating UI brushes…”) — reads like a pasted image-generation style string rather than the Scene/Style/Text/Mood lore format. **REVIEW** | REVIEW | medium |
| `content/mascots/937.blinko-chompframe.md` (lines 73–79, `### 🎨 Sora Prompts`) uses imperative generation instructions (“1. Generate a glitchy mascot from a failed 1990s gas station snack campaign…”) — a prompt list, not lore prose. **REVIEW** | REVIEW | low |
| `content/posts/coma-observation-transcript.md:59` — Bricky dialogue referencing a “Sora preset”. Fictional dialogue. **KEEP** | KEEP | high |
| `content/mascots/005.bricky-goldbricksworth.md` — “Sora prompt log”, “Sora had rendered him fully” lore. **KEEP**; `content/limericks/lim-modrewrite-gremblin.md:76` and `content/mascots/023.modrewrite-gremblin.md` “Sora Render Lore” — fiction. **KEEP** | KEEP | high |

Per the brief: mascots mentioning Sora are **not** automatically removable; 101/101 here read as intentional fiction, with the two exceptions above.

### Cluster D — `_TBD_` template fields (six mascots)

| Record | Lines | Matching phrase | Status |
|---|---|---|---|
| `mascots/014.htmlie-structura.md` (`M-0014`) | 13, 17, 18 | `_TBD_`, `- Email: _TBD_`, `- Homepage: _TBD_` | archived |
| `mascots/021.markie-d-down.md` (`M-0021`) | 45, 65, 66 | `_TBD_` Biography; `Email: _TBD_`, `Homepage: _TBD_` | archived |
| `mascots/035.tizzy-blinkensync.md` (`M-0035`) | 18 | `_TBD_` Biography | archived |
| `mascots/040.pngbert-flatly.md` (`M-0040`) | 18 | `_TBD_` Biography | archived |
| `mascots/041.reboota-thrice.md` (`M-0041`) | 50 | `_TBD_` Addendum Comments | archived |
| `mascots/418.teapotta-protocol.md` (`M-0418`) | 19 | `_TBD_` Biography | archived |

- **Why residue:** unfilled template placeholders from the mascot record template (biography / contact / addendum fields never completed). Pure placeholder garbage. Other `_TBD_`/`TODO` matches in the corpus (e.g. `mascots/039.patchy-mxcli.md` “TODO: Clarify”, `mascots/223.placeholder-witness.md` “TBD is me”, `mascots/072.deprecatia-fade.md` “TODO: clean up later”) are in-universe content and are **KEEP**.
- **Renders publicly?** Yes (archived pages render; `M-0014` verified in live sitemap). **Enters exports?** Yes.
- **Inbound links:** none. **Relations:** none.
- **Classification: REMOVE** (confidence: high) ×6.
- **Smallest defensible next action:** delete the `_TBD_` placeholder lines (or replace with the record’s actual values) in these six files.

### Cluster E — legacy Starlight `<Aside kind="note">` MDX components (29 files)

| Field | Value |
|---|---|
| Records | 29 files: 27 × `content/reference/*` (incl. `fref-0180-tdci.md:418`), plus `content/lorelog/DS-404-ALPHA.md:87` and `content/mascots/938.vantage-hollow.md:25` |
| Matching phrase | `<Aside kind="note">` wrapping **“Archivist's Addendum”** blocks |
| Why it is residue | A legacy Starlight MDX component syntax surviving in source markdown. The wrapped text is lore (archivist's addenda), but the wrapper is a dead component that Boris cannot render as authored; it leaks as an unknown HTML element. |
| Renders publicly? | Yes (the tag and/or raw text renders in HTML) |
| Enters exports? | Yes |
| Classification | **REVIEW** (confidence: high) — syntax residue around intentional content. |
| Smallest defensible next action | Convert the `<Aside kind="note">…</Aside>` wrappers to a Boris-native blockquote/note form in the 29 files (mechanical, deterministic). |

### Cluster F — `content/reference/fref-0180-tdci.md` — TIME pipeline document

| Field | Value |
|---|---|
| Record ID | `reference/FREF-0180-TDCI` (published) |
| Section / lines | Whole record; esp. “Pipeline (Last Known Good)”, “Image Generation Constraints” (line 259), “Seed Preservation Protocol” (≈ 280), “Minimum Viable Artifact” (≈ 330), “Saturation Indicators” / “Hard Stop Clause” (≈ 360–375: “Stop generating new material if…”, “cease generation immediately”), “Filed under: `/time_ingestion/` `/pre_decay/`”, “Output Templates (Reusable)”, `<Aside kind="note">` (418) |
| Matching phrase | “external structured generation (TIME AI)”, “Deterministic image generation”, “Not image prompts (yet)”, “This is **pre-rot material**” |
| Why it is residue | A “last known good” document describing how archive material was generated (TIME-AI concept ingestion → degradation → artifact conversion → mascot ingestion). It mixes real operational instructions with in-universe margins (“Bricky margin: …”). Production and lore are entangled throughout; it also carries the legacy `<Aside>` component. |
| Renders publicly? / exports | Yes / yes |
| Inbound links | 0. Outbound: 1 Markdown link (`fref-0030-avsg.md` inside the Aside). Relations: none |
| Classification | **REVIEW** (confidence: high) |
| Smallest defensible next action | Quarantine the pipeline/“last known good” operational sections to provenance, keeping the in-universe margins; convert the `<Aside>` block; or explicitly re-file the whole record as archived provenance. |

### Cluster G — in-universe workflow & audit records (KEEP)

| Record | Why KEEP | Confidence |
|---|---|---|
| `reference/fref-0850-mard.md` (“Mascot Review Workflow & Doctrinal Refinement Strategy”) | Fictional memo from “The Assurance Desk” defining mascot-review tiers, four conditions, “The Stop Rule”. Bureaucratic workflow fiction — explicitly protected by the brief. | high |
| `reference/audits/fref-audt-cont.md`, `fref-audt-intg.md`, `fref-audt-case.md` | In-universe “operational engines” audit records with fictional entry dates (“System Entry Date: 2026-07-13”) and suite telemetry. `fref-audt-case.md` is the closest to genuine migration data (it tables pre-migration `.mdx` caseNumber issues for the 54 fref-090x echo records, lines 19–86), but it is styled as lore; note its `.mdx`/`caseNumber` references as pre-migration residue within fiction. | medium |
| `reference/fref-0380-lbkp.md` | In-universe doctrine for converting “tool-generated analyses” into controlled mutations. Fictional bureaucratic process. | medium |
| `mascots/019.kindy-mcexistentialcrisis.md` (“🔮 Expansion Protocols”, ≈ lines 170–183) | “The following systems have been flagged for future integration” — fictional system names (“Verification Error Gallery”, “Form 51-E-Variants Registry”…), closes “pending emotional bandwidth…”. Future-integration language used as fiction. | high |
| `releases/v0.1.1-trust-surface-residue.md` | Intentional release naming “Trust Surface Residue”; archived. | high |

### Cluster H — dangling pre-migration path in lore

| Field | Value |
|---|---|
| Record | `content/mascots/075.anlas-appenhancer.md` (`M-0075`), line 123 |
| Matching phrase | “From his dedicated limerick cluster (see `limericks/075.anlas-appenhancerlimerick.mdx`):” — a backticked pre-migration filename that does not exist (actual file: `lim-anlas-appenhancer.md`) |
| Classification | **REVIEW** (confidence: low) — a dangling pre-migration reference inside otherwise-lore text. |
| Smallest action | Fix or drop the backticked path. |

### Cluster I — repo-root and operational files (outside the archive surface; all KEEP)

| File | Finding | Classification |
|---|---|---|
| `AGENTS.md`, `CLAUDE-MISSION.md`, `GEMINI.md` | Agent instruction/manifest files at repo root. `GEMINI.md:5–7` contains **local absolute paths** (`file:///Users/tbuddy/Documents/antigravity/proud-brahmagupta/filed.fyi/…`) — machine-local paths that will not resolve on other checkouts. | KEEP (operational; never rendered/exported). Note: absolute paths are stale-on-other-machines; prefer relative refs. |
| `THEME-NOTES.md` | `http://localhost:8000/…` preview URLs (lines 91–104) — dev-doc pointers. | KEEP |
| `docs/FILED-FYI-V08-DOGFOOD.md` | Dogfood test doc with `/private/tmp/...` absolute paths and build commands (lines 66–89) — historical evidence of a one-time run. | KEEP (note: contains temporary paths + stale “26 custom src/pages index routes” claims elsewhere) |
| `docs/FILED-BORIS-LLM-WORKFLOW.md`, `docs/FILED-FYI-DESIGN-BRIEF.md`, `docs/FILED-FYI-V08-GAP-MANIFEST.json`, `docs/cloudflare-deployment.md` | Migration/LLM workflow docs; the design brief and gap manifest are provenance for migration guardrails. | KEEP |
| `metadata/migration.json`, `metadata/id-map.jsonl` | Migration scratch metadata. `id-map.jsonl` carries “Stub: …” titles for the 54 fref-090x echo records (lines 451–469 etc.) — metadata mirror of stub content. | KEEP (medium) |
| `scripts/fix_tag_truncation.py`, `scripts/test_tag_roundtrip.py`, `scripts/filed-migration-ci.sh`, `scripts/filed_ids.py`, `scripts/audit_*.py` | Migration-repair and validation tooling. `fix_tag_truncation.py` references `scratch/pre-tree` and `content-residue/workflow/*.quarantined.md` (lines 26–27, 41, 67, 190) — one-shot repair tool whose scratch layout no longer exists; retained for provenance. | KEEP |
| `reports/post-migration-integrity.md`, `reports/tag-roundtrip-fix.md` | Existing audits; they already flag stub/placeholder residue as needing an editorial audit (which this report performs) and document the quarantined-copy provenance. | KEEP |
| `.github/workflows/{ci,deploy,auto-merge}.yml`, `wrangler.jsonc`, `themes/*` | CI/deploy configuration and themes. `themes/cantilever/layouts/*.html:6` emits `<meta name="generator" content="Filed.fyi migration (Boris)">` — renders publicly as a meta tag; intentional build metadata. | KEEP |

---

## 6. Summary counts

### Findings by classification (51 findings total)

| Classification | Count |
|---|---|
| KEEP | 19 |
| QUARANTINE | 1 |
| REMOVE | 6 |
| REVIEW | 25 |

### Findings by collection

| Collection | Findings |
|---|---|
| reference | 26 (fref-0900-poet; 18 prompt-addendum records; fref-0180-tdci; fref-0850-mard; 3 audits; fref-0380-lbkp; `<Aside>` legacy-component cluster) |
| mascots | 13 (Sora corpus aggregate; zhuzhing; blinko; coma transcript; bricky/gremblin lore; 6 × `_TBD_`; kindy; anlas) |
| haikus | 1 (“Awaiting context” cross-collection cluster; primary locus in stub haiku pages) |
| haikus/aphorisms/limericks (echo records) | 1 (the 57 fref-090x echo records) |
| releases | 1 (v0.1.1-trust-surface-residue) |
| repo-root / docs / metadata / scripts / reports / themes / workflows | 9 |

### Surface counts

| Metric | Count |
|---|---|
| Findings that render publicly | 42 (all content findings) |
| Findings that enter RAG/Context/IR exports | 42 |
| Findings in sitemap (non-draft) | 42 |
| Findings in llms.txt | unverified live (deployment serves HTML fallback); expected 42 |
| Records with inbound links | 1 (`FREF-0916-QMBA` ← `guides/gratitude-drift.md:17`) |
| Records with no inbound links | 41 finding-rows; the fref-090x cluster specifically: 76 records (19 reference + 57 echoes) have zero inbound links and zero `relations:` |
| High-confidence quarantine candidates | 19 (fref-0900-poet + the 18 System Directive Instruction Blocks) |
| High-confidence removal candidates | 6 (`_TBD_` template fields) |

---

## 7. Ten highest-confidence action candidates (no actions taken)

1. **`fref-0900-poet`** — QUARANTINE the live “Active Subagent Flight Manifest” out of the rendered page (record already `archived`/`historical-residue`). *high*
2. **`fref-0901-apiv`** — remove the “System Directive Instruction Block” + “Monitored Target Coordinates” from the rendered surface (quarantine to provenance). *high*
3. **`fref-0902-clls` … `fref-0918-qmcl` (17 records)** — same treatment, applied as one mechanical pass; the instruction blocks reference deleted tooling (`audit-poetry-vectors.mjs`), pre-migration paths, and self-labeled `scratchpad`/`prompt-addendum` tags that leak into RAG/context exports. *high*
4. **`fref-0180-tdci`** — REVIEW: quarantine the “Last Known Good” pipeline sections, retain in-universe margins, convert the `<Aside>` block. *high*
5. **`_TBD_` fields in 6 archived mascots** (`M-0014`, `M-0021`, `M-0035`, `M-0040`, `M-0041`, `M-0418`) — REMOVE the placeholder lines. *high*
6. **`<Aside kind="note">` in 29 files** — convert the legacy Starlight component to Boris-native blockquote/note syntax. *high*
7. **“Awaiting context” placeholder pages** (e.g. `haikus/HAI-0056` “Stub: RoboShirker”) — one policy decision: retain as campaign evidence or remove; do not decide per-file. *high*
8. **The 57 fref-090x echo records** — inventory and align disposition with the “Awaiting context” policy. *high*
9. **`mascots/057.zhuzhing-ping.md`** — rewrite or remove the raw pasted image-generation style string in its Sora Prompts section. *medium*
10. **`mascots/075.anlas-appenhancer.md:123`** — drop the dangling pre-migration `.mdx` backtick path. *low*

---

## 8. Validation performed

| Check | Command | Result |
|---|---|---|
| Identity / form-ID policy | `python3 scripts/filed_ids.py --root content --map metadata/id-map.jsonl` | `validated 2265 pages; no files changed` — PASS |
| Markdown link audit | `python3 scripts/audit_markdown_links.py content` | `Markdown link audit: all local Markdown links resolve` — PASS |
| Tag round-trip regression | `python3 scripts/test_tag_roundtrip.py` | `PASS — all named tags round-trip unchanged and no corrupt fragments remain` |
| Full graph + build gate | `BORIS_BIN=… ./bin/validate_graph.sh` (Boris graph diagnostics + Cantilever compile of 2,265 pages + HTML-ID audit + publication proof checks) | `HTML ID audit: 0 pages with duplicate IDs; 0 duplicate occurrences` / `Filed build passed: dist/cantilever` / `🎉 Filed graph, form IDs, HTML IDs, and publication checks passed.` — PASS |

The compile also confirmed the canonical render paths for the audited cluster (e.g. `dist/cantilever/reference/FREF-0901-APIV.html` … `FREF-0918-QMCL.html`), matching the live sitemap evidence. Content was not modified by this PR, so these results reflect the unchanged corpus.

---

## 9. Limitations

- **Archived-page semantics:** verified that archived pages render and appear in the sitemap (live sitemap check); internal `draft` vs `archived` rendering is otherwise per the compiler default.
- **llms.txt:** live deployment serves an HTML fallback at `/llms.txt`; membership could not be verified live. Expected scope stated from the publish pipeline.
- **“Awaiting context” and echo clusters** are counted as aggregate findings; per-file dispositions are deferred to a policy decision, not enumerated row-by-row here.
- The 5 `status: draft` records were noted but are not workflow residue findings.
- This report is deliberately conservative: the brief’s KEEP/QUARANTINE/REMOVE/REVIEW rules were applied strictly; ambiguous verse-campaign content defaults to REVIEW rather than REMOVE.

---

## Appendix — deterministic search targets

Patterns searched across `content/`, `metadata/`, `scripts/`, `reports/`, `docs/`, `themes/`, `.github/`, and root files (ripgrep, case-insensitive where noted):

`Sora`, `preset`, `generat`, `prompt`, `TODO|TBD|FIXME|Stub`, `placeholder`, `web:[`, `localhost|127.0.0.1|file://|/Users/|/tmp/|/var/|/private/tmp`, `AGENTS|agent manifest|agent instructions`, `workflow`, `scratch`, `migration`, `poet|JULES-POET`, `fref-0900|fref-0901…fref-0918`, `<!--` (HTML comments — **zero** in `content/`), `src/content`, `\.mdx`, `node scripts/`, `<Aside|kind=|:::|<Tabs|<TabItem|import`, `future integration|future work|coming soon`, `out-of-bounds`, `content-residue|quarantin`, `relations:` (zero `relations:` declarations in the entire corpus).

Explicit negatives: **no** `web:[n]` markers anywhere; **no** HTML-comment hidden blocks in `content/`; **no** `.freebuff`/`scratch`/`content-residue` directories in the current tree (they exist only in pre-migration history and tooling references).
