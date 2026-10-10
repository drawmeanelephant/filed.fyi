# Spec-Compliance Manifest — CommonMark/GFM Feature Census (Pass C1)

**Date:** 2026-10 (audit session; corpus changelog timeline runs through 2026-10-20)
**Scope:** Canonical `content/` corpus only. `content/spec-lab*` (21 records, issue-#1040 / C10 testbed, gitignored) and `content/probe-*` are **excluded** from all census counts.
**Corpus size:** 2,540 canonical records (11 trunks + 2,529 satellites).
**Compiler:** Boris, pinned to commit `07dc0d3cc101d86682ec92e06ba00edef9d90c75` (`metadata/boris-version.json`, Zig 0.16.0). No `bin/boris` binary exists in this checkout; the binary is provisioned via `scripts/ensure-boris.sh`/`BORIS_BIN` in equipped environments.

## Methodology and evidence tiers

All census numbers are **record-level counts** (files containing ≥1 occurrence), not raw match counts, unless labeled otherwise. Boris-behavior classifications use the required verdict vocabulary:

- `PARSES-RENDERED` — syntax compiles to semantic HTML
- `PARSES-NOOP` — syntax accepted, produces no observable output
- `HARD-FAIL` — build/check diagnostic; compilation aborts or is gated
- `UNPARSED-LITERAL` — syntax emits as literal text

**Evidence tier per verdict:**
- **[verified]** — observed in compiled `dist/cantilever/` HTML per changelog QA dockets (compiled-article inspection), or structurally proven by the build gate.
- **[contract]** — documented Boris/CommonMark behavior; probe not executable in this environment.
- **[unverified]** — no compiled-output evidence found; expected behavior noted.

**Environment limitation:** this audit ran without an executable Boris binary and without permission to run `boris check`, `boris build`, `./bin/validate_graph.sh`, or `scripts/filed-build.sh`. The probe protocol is specified in §6 for execution by a Boris-equipped agent. No live probe results are claimed.

## 1. Frontmatter schema census (closed schema)

Observed top-level frontmatter keys across all 2,540 canonical records:

| Key | Records | Notes |
|---|---|---|
| `title` | 2,540 | universal |
| `id` | 2,540 | universal (explicit canonical IDs; Boris defaults to path-derived identity otherwise) |
| `parent` | 2,523 | absent on trunk pages |
| `status` | ~2,540 | values: `published` 1,474 / `archived` 1,061 / `draft` 5 / `nominal` 4 / `external` 2 / `revised` 1 (census includes a few in-body quoted `status:` lines) |
| `tags` | ~2,540 | near-universal |
| `relations` | ~776 entries | vocabulary observed: `relates_to=` only (776 edges) |
| `published_at` | **0** | schema-legal, unused |
| `summary` | **0** | schema-legal, unused |
| Any non-schema key | **0** | zero violations in 2,540 records |

Schema contract: `AGENTS.md` §4 — "Only key-value attributes recognized by the Boris compiler frontmatter schema are permitted. Unknown keys will trigger build or validation failures." `rules.md` §2 — "Unknown keys are build errors." The `post-migration-integrity.md` report confirms Boris reports frontmatter violations as findings. The zero-violation census across 2,540 records is consistent with **hard enforcement** — any unknown key could not have survived the build gate.

## 2. Block-level feature census

| Feature | Canon records | Exemplars | Boris verdict | Status |
|---|---|---|---|---|
| ATX headings `#`–`######` | 2,538 | universal | PARSES-RENDERED [verified] | used |
| Heading anchor suffix `{#slug}` | 531 | `lorelog/LLG-0339-SIRC.md` `### … {#silent-interval-review-chamber-2}`; `LLG-0381-OPTOUT.md` `{#breeding-program-opt-out-2/-3}` | PARSES-RENDERED → `id` attr [verified — consumed by `scripts/verse_stage.py`, audited by `audit_html_ids.py`] | used — largely migration-era `-2`/`-3` duplicate-slug disambiguation on `###` headings; **load-bearing for HTML-ID uniqueness** |
| Setext headings (`===`/`---` under text) | 1 live (+1 historical incident) | `mascots/009.draft-file-derrick.md` (`**Slogan:**` line then `---` — latent H2 trap); historical: `reference/fref-0180-tdci.md` incident documented in `changelog/2026-10-08-reference-019` | PARSES-RENDERED as H2 [verified — the fref-0180 incident proved `---` under a text line renders `<h2>` and swallows the following `---` separator's `<hr>`] | used (1) — **latent hazard class**: any `---` directly under a text line is a setext heading, not an `<hr>` |
| Thematic breaks `---` / `***` / `___` | ~215 (`---` convention, blank-line-separated) | `reference/fref-0150-mapa.md` (5 body `---` rules), `mascots/019`, `mascots/937` (after-blockquote `---`) | PARSES-RENDERED `<hr>` [verified — "paragraph + `<hr>`" in compiled notes] | used |
| Fenced code ` ``` ` blocks | 66 | `reference/fref-0900-ccc.md`, `lorelog/LLG-0317-RLS.md` | PARSES-RENDERED `<pre><code>` [verified] | used |
| Fences with info strings | 14 (3 bare, 11 `text`) | `fref-0900-ccc` ` ```text ` | PARSES-RENDERED [verified] | used |
| `~~~` fences | 0 | — | unexercised | absent |
| Indented code blocks | ~1–2 ambiguous | `mascots/019` `    a` line — intended verse indentation, renders as `<pre><code>` per CommonMark | PARSES-RENDERED (likely) [unverified] | rare/ambiguous — verse indents of exactly 4 spaces are a known hazard |
| Pipe tables (GFM delimiter rows) | 22 | `reference/fref-0900-ccc.md`, `reference/fref-0661-agbx.md`, `fref-0920/0921/0922/0923`, `lorelog/LLG-0352/0370/0450/0451/0452/0939`, `reference/empathegy-*` ×4, `mascots/090`, `mascots/436`, changelogs ×3 | PARSES-RENDERED `<table>/<td>` [verified — "renders as a real table in compiled HTML", lorelog-001] | used |
| Grid/ASCII tables | 0 | — | unsupported (not CommonMark) | absent |
| Definition lists (`Term`/`:` extension syntax) | 0 | — | unsupported extension; would emit literal | absent |
| Raw `<dl>/<dt>/<dd>` | 0 | — | expected PARSES-RENDERED as CommonMark type-6 HTML block [contract] | absent |
| Unordered lists `-` | 675 | ubiquitous | PARSES-RENDERED [verified] | used |
| `*` bullets | 13 | — | PARSES-RENDERED | used |
| `+` bullets | 0 | — | unexercised | absent |
| Ordered lists `N.` | 119 | `reference/empathegy-*`, `posts/` | PARSES-RENDERED [verified] | used |
| Nested/indented list items | 46–93 (depth-dependent) | `mascots/*` stat blocks | PARSES-RENDERED [verified] | used |
| Task lists `- [ ]`/`- [x]` | **16 records, ~100 bullet-prefixed markers** (+ bare `[ ]` lines in `LLG-0355`) | `lorelog/LLG-0351-DOGE-INTAKE.md` (28 items), `LLG-0355-GEX-2R` (bare `[ ]`), `LLG-0401-GLP`, `reference/fref-0140-ocvs` (8), `mascots/005.bricky` (7), `mascots/201/203–206/211/216–221` (4–5 each) | marker emission UNVERIFIED; QA-docket language ("literal `[x]`/`[ ]` addendum markers", "bare `[ ]` checkbox lines") indicates **UNPARSED-LITERAL** markers inside `<li>` [unverified — `<input>` vs literal unresolved; spec-lab `tasklists.md` is the designed test] | used — live corpus, render semantics pending |
| Blockquotes `>` | 165 (multiline ≥2 `>` lines: 122) | `mascots/*` docket quotes, `fref-0920` | PARSES-RENDERED [verified] | used |
| Lazy continuation (paragraph/list) | latent, exercised corpus-wide | `mascots/019` para-then-list | VERIFIED absorbed into preceding `<li>` — "paragraph lazy continuation — verified in compiled HTML" | used |
| List interruption | latent | same as above | PARSES per CommonMark [verified via lazy-continuation evidence] | used |
| Two-space hard breaks | ~339 records (verse sections) + prose | `haikus/*`, `limericks/*`, `mascots/*` verse | PARSES-RENDERED `<br />` [verified — "verse `<br />` structure" in dockets; enforced by `fix_verse_hard_breaks.py`] | used — **protected convention** |
| Backslash hard breaks | 0 | — | unexercised in canon | absent |
| HTML comments `<!-- -->` | 1 | — | PARSES-NOOP expected [contract] | rare |
| `:::note`/`:::` export fences | 0 live (29 files historically; remediated to `<Aside>`) | historical: lorelog-001 docket | UNPARSED-LITERAL [verified — "render as literal paragraphs archive-wide"]; now **build-gated/prohibited** shape | absent-by-gate |
| Math `$…$` / `$$…$$` | 0 (literal `$WIN_NT$` tokens in `mascots/036.whistlin-winstinct.md` and `limericks/lim-whistlin-winstinct.md` are prose, not math) | — | expected UNPARSED-LITERAL under core CommonMark [unverified] | absent |
| Raw HTML blocks (`<div>`, `<pre>`, etc.) | ~1 | `mascots/019` (`<div>`, `<pre>` lines) | PARSES-RENDERED passthrough per CommonMark type-6 [partially verified — "pre-existing `<u>`/`<em>` intact" in compiled pages] | rare |
| `<Aside>` component | **33 records** (32 `kind="note"` allowlisted value + variants) | `lorelog/LLG-0352`, `LLG-0450`, `LLG-0939` (lorelog ×20), `mascots` ×5, `reference` ×5, `aphorisms` ×1, `changelog` ×2 | PARSES-RENDERED as bounded Boris component [verified — "the addendum renders inside the `<aside>` component"] | used — **Boris-native island, corpus-proven `kind="note"`** |
| `<Details>` component | ~4 | `lorelog/LLG-0811-EG`, `LLG-0322-FTD` (`summary=`/`id=` attributes) | PARSES-RENDERED as bounded disclosure component [verified] | used — **`summary`/`id` attribute pair is the documented precedent** |
| `<Redacted>` / `<Seal>` | 0 | — | NOT Boris-native; expected raw-tag passthrough or HARD-FAIL under component validation [unverified — designed spec-lab `raw-html.md` case] | absent |
| `{{include path}}` transclusion | 0 | — | documented Boris mechanism; missing target/include cycle = hard error; **path-resolution semantics unverified** (spec-lab keeps it quoted) | legal-unused |
| Inline/structural `status:`-style body keys | n/a | `fref-0923` quotes non-standard value | n/a — body prose, not frontmatter | n/a |

## 3. Inline feature census

| Feature | Canon records | Exemplars | Boris verdict | Status |
|---|---|---|---|---|
| Emphasis `**…**`, `*…*`, `__…__`, `_…_` | ~900+ (928 files start a line with emphasis; pervasive inline) | universal | PARSES-RENDERED `<strong>/<em>` [verified — "exactly one `<strong>` per changed page, zero literal `**`"] | used |
| Inline code spans `` `…` `` | 451 | universal | PARSES-RENDERED `<code>` [verified] | used |
| Strikethrough `~~…~~` | **1** | `lorelog/LLG-0405-MEL.md` (`~~pause~~`, `~~stop~~`, `~~refuse~~`, lines 75–77) | UNVERIFIED — dockets call it "struck marginalia"/"struck-through marginalia"; `<del>` vs literal `~~` unresolved. Under core CommonMark it must emit literal | used (1) — render semantics pending |
| Wiki links `[[id]]`, `[[id\|label]]`, `[[coll/id]]` | ~1,170 records | ubiquitous; per-collection targets: lorelog 404, limericks 369, reference 191, mascots 139, haikus 59, aphorisms 35, changelog 2 records | PARSES-RENDERED `<a href>` [verified]; **missing target = `EREFERENCEMISSING` hard error** [contract — spec-lab trunk + workflow docs] | used — resolved against frozen graph |
| Wiki links with heading targets `[[id#frag]]` | **0** | — (changelog 2026-10-20 documents a `/fref-0900-poet/#map-annex` URL target resolved in output, but no `[[…#…]]` form exists in canon today) | mechanism documented; unexercised in canon | legal-unused |
| Inline links `[text](url)` | ~26–38 | `mascots/019` (Wikipedia), `mascots/027` (kernel.org), `guides/*` ×3 (legacy `.md` relative targets — audit-monitored) | PARSES-RENDERED `<a>` [verified] | used |
| Empty-label links `[](url)` | ~10 | `mascots/019`, `033`, `039`, `062`, `205`, `206` | PARSES-RENDERED [verified] | used |
| Reference-style links `[t][ref]` | 0 | — | unexercised | absent |
| Angle-bracket autolinks `<http://…>` | 0 | — | PARSES-RENDERED expected (core CommonMark) [contract] | legal-unused |
| Bare URLs (GFM autolink extension) | **1** | `mascots/033.planny-f-pipe.md` — `https://9p.io/plan9/` | UNVERIFIED — GFM autolink extension presence unknown; expected literal if core-only | used (1) |
| Images `![alt](src)` | 0 | — | unexercised | absent |
| Footnote references `[^n]` | **5 live-residue records** (52 markers) + changelog prose describing the residue | `reference/fref-0150-mapa.md` (22× `[^1]`), `reference/fref-0160-maii.md` (22× `[^1]`), `lorelog/map-inc-14.md` (6× `[^1]`), `mascots/672.map-72-absentia.md` (2× `[^1]`); `reference/fref-0920-rab.md` `[^map]` (defined) | UNPARSED-LITERAL [verified — compiled output emits `[^1]` literally inside `<p>`/`<li>`, "dangling-footnote" class documented in lorelog-029/`workflow-residue-inventory.md`] | residue — **the known dangling cluster** |
| Footnote definitions `[^n]:` | 1 | `fref-0920-rab.md`: `[^map]: MAP handling remains defined by FREF-0815-MAP.` | compiles clean (record ships); emit form UNVERIFIED — likely literal paragraph or consumed-noop | residue-pair |
| Attribute syntax `{.class}` / `{#id}` inline / `{:…}` | 0 | — | unsupported (Kramdown/Pandoc-style); `{#slug}` is **heading-suffix only** [contract] | absent |
| Entity references `&lt;` `&amp;` `&#8239;` | ~30+ | `mascots/021.markie-d-down.md`, `014.htmlie-structura.md`, `008.cssandra-cascade.md`, `limericks/lim-markie-d-down.md` (escaped-tag verse) | PARSES-RENDERED → decoded glyphs [contract-standard; load-bearing — escaped tags in verse depend on decoding] | used |
| Backslash escapes `\&`, `\[`, `\-` | ~15 | `mascots/019` `M\&A`, changelogs | PARSES-RENDERED [contract-verified standard] | used |
| Inline raw HTML `<u>`, `<sub>`, `<br>`, `<em>`, `<strong>`, `<code>`, `<hr>`, `<table>`, `<td>`, `<marquee>`-style custom tags in verse | ~15–20 | `mascots/019`, `062`, `033`, `937`/`938` HTML-themed verse | PARSES-RENDERED passthrough [verified — "pre-existing `<u>`/`<em>` intact" in compiled pages; unknown tags emit as raw inline HTML] | used — **the mascot "HTML-entity" conceit depends on this** |

## 4. Quantified residue findings

### 4.1 Dangling footnote residue (the "MAP-Annex" cluster)

| Record | `[^1]` markers | `[^1]:` definition | Status |
|---|---|---|---|
| `reference/fref-0150-mapa.md` | 22 | 0 | dangling — emits literally (verified) |
| `reference/fref-0160-maii.md` | 22 | 0 | dangling — emits literally (verified) |
| `lorelog/map-inc-14.md` | 6 | 0 | dangling |
| `mascots/672.map-72-absentia.md` | 2 | 0 | dangling |
| `reference/fref-0920-rab.md` | 1 `[^map]` | 1 `[^map]:` present | only defined pair in canon |

**Total: 52 dangling `[^1]` markers across 4 records; zero `[^1]:` definitions anywhere in canon.** Changelog records additionally *describe* this residue (e.g., `changelog/*map-annex*` dockets) but are prose references, not usage — excluded from the feature count. Consequence if a footnote extension is ever enabled: 52 markers would resolve to `#fn-1`-style anchors with no definitions — a rendering change and audit risk, so C2 must treat the corpus as **pre-contaminated**, not clean.

### 4.2 Task-list corpus verification

16 canon records carry `- [ ]`/`- [x]` task-list syntax (~100 bullet-prefixed markers; `LLG-0351` alone holds 28). This revises the earlier estimate of ~28 records **downward** — the 28 figure was the single-record marker count in `LLG-0351`, not a record count. `LLG-0355-GEX-2R` additionally carries **bare `[ ]` checkbox lines** with no bullet marker — outside the `- [ ]` pattern and counted separately. Changelog dockets describe these as "literal `[x]`/`[ ]` addendum markers" and "bare `[ ]` checkbox lines", consistent with **UNPARSED-LITERAL** emission, but no compiled-`<input>` evidence was found either way. Definitive verdict requires the spec-lab `tasklists.md` build.

### 4.3 Custom-element inventory

- `<Aside>`: 33 records (allowlisted `kind="note"` on 32 — the corpus-proven value).
- `<Details>`: ~4 records (`summary` + `id` attributes, LLG-0811-EG precedent).
- `<Redacted>`, `<Seal>`: **0 records** — proposed component names with no corpus presence and no evidence of Boris support.

## 5. Frontmatter-key probe results (proposed keys)

Probes could **not be executed** (no Boris binary; exec permissions unavailable). Classification below is from the documented schema contract — each proposed key is absent from all 2,540 records today (verified, §1).

| Proposed key | Predicted verdict | Basis |
|---|---|---|
| `Footnotes:` | **HARD-FAIL** | Closed-schema contract: unknown keys are build errors (AGENTS.md §4, rules.md §2). 0 non-schema keys survive in canon. |
| `Definition-List:` | **HARD-FAIL** | same |
| `Checklist:` | **HARD-FAIL** | same |
| `HTML-Island:` | **HARD-FAIL** | same |

**Implication:** feature flags cannot be delivered through frontmatter under the closed schema. If a C-pass needs per-record metadata, the legal-unused schema keys (`published_at`, `summary`) are the only available hooks, and neither is semantically a feature flag — flag-style enablement requires a Boris schema change (upstream) or a body-level convention instead.

## 6. Body-syntax probe protocol (for a Boris-equipped agent)

The following probe recipe was designed but not executed. A single record exercises all candidate syntax; then `boris check` and a scratch build classify each feature.

```sh
# 1. Create content/probe-c1-body.md with minimal frontmatter:
#    ---\ntitle: "C1 Body Probe"\nparent: reference\nstatus: draft\n---
#    Body: <dl><dt>Term</dt><dd>Def</dd></dl>; footnote pair [^1]/[^1]:;
#    $$..$$ display math and $..$ inline math; {.class} and {#id} inline
#    attributes; a grid table (+---+); a `~~~` fence; <http://autolink>;
#    - [ ] task items; ~~strike~~; ![img](x); [ref][r] link + [r]: url.
# 2. Validate:
boris check --input content --format json     # capture exact diagnostics
# 3. Build to scratch (never the production dist/cantilever):
BORIS_BIN=boris CONTENT_DIR=content DIST_DIR=dist/c1-probe ./scripts/filed-build.sh
# 4. Inspect dist/c1-probe HTML; classify each feature.
# 5. Frontmatter-key probes (one file each):
#    content/probe-c1-footnotes.md        adds  Footnotes: enabled
#    content/probe-c1-definition-list.md  adds  Definition-List: enabled
#    content/probe-c1-checklist.md        adds  Checklist: enabled
#    content/probe-c1-html-island.md      adds  HTML-Island: enabled
boris check --input content --format json     # per probe; record diagnostic
# 6. Teardown:
rm content/probe-c1-*.md && rm -rf dist/c1-probe
```

The fleet's `content/spec-lab/` testbed (issue #1040, class C10) already documents *expected* rendering for every feature in this manifest — observed results from that testbed supersede the `[unverified]`/`[contract]` cells above when they land.

## 7. C2–C9 readiness recommendations

| Pass | Scope | Readiness | Rationale |
|---|---|---|---|
| C2 Footnotes | `[^n]`/`[^n]:` support | **blocked + contaminated** | Boris emits markers literally today [verified]; footnote semantics need a Boris extension (upstream enablement). Corpus is pre-contaminated: 52 dangling `[^1]` in 4 records would change rendering on enablement. If enabled, expect broken `#fn-*` anchors (no definitions) rather than clean activation — needs a residue-remediation decision first (content pass, not silent). |
| C3 Definition lists | `Term`/`:` syntax or `<dl>` | **enhancement-ready via raw HTML / native blocked** | Zero corpus usage. Raw `<dl>/<dt>/<dd>` blocks should already passthrough as CommonMark type-6 HTML [contract] — usable today without Boris changes. Native `:`-syntax extension blocked upstream. |
| C4 Tables | pipe tables, grid tables | **enhancement (already live)** | 22 records render real `<table>` today [verified] — enablement is done. Work is coverage/styling/a11y enhancement. Grid tables remain unsupported (0 corpus). |
| C5 Task lists | `- [ ]`/`- [x]` → checkbox inputs | **verification pass — likely enhancement** | 16 live records. If GFM task-list extension is off, markers emit literal (docket-evidenced) — content reads fine; a presentation pass decides whether literal markers or checkbox inputs are desired. If inputs render already, this is purely cosmetic. Enablement, if desired, is a Boris extension flag. |
| C6 Attributes | `{.class #id}` general attrs | **blocked upstream / heading anchors live** | `{#slug}` heading-suffix anchors are Boris-native and load-bearing in 531 records (duplicate-slug disambiguation). General Kramdown/Pandoc attribute syntax unsupported, 0 corpus. Extension requires Boris changes; risk: `{.class}` text today emits literal — safe to add later. |
| C7 HTML islands | raw HTML + custom elements | **partially live / new components blocked-unknown** | `<Aside>`/`<Details>` render today (33/4 records, verified); inline raw HTML passes through (verified); `<dl>`-style block HTML expected passthrough. `<Redacted>`/`<Seal>` have 0 corpus and unknown Boris disposition (passthrough vs hard-fail) — needs the spec-lab `raw-html.md` observed result before any corpus use. |
| C8 Math | `$…$`/`$$…$$` | **blocked upstream** | 0 corpus, no extension evidence; expected literal emission. Requires Boris extension; zero corpus impact on enablement (clean). |
| C9 Autolinks | `<url>` + bare URLs | **ready — mostly already works** | Angle-bracket autolinks are core CommonMark → expected PARSES-RENDERED; 0 corpus (legal-unused). Bare-URL autolinking is a GFM extension — 1 corpus record (`mascots/033`), unverified, expected literal. Verification pass only; corpus impact trivially small. |

## 8. Validation status

- `./bin/validate_graph.sh`: **NOT RUN** — no executable Boris binary in this environment and shell execution for build/validation commands was unavailable. Per AGENTS.md §7, a Boris-equipped agent must run it before declaring pass closure.
- `python3 scripts/check_collection_counts.py`: not run (no exec for scripts); canon count established by direct file enumeration (2,540 = 11 trunks + 2,529 satellites).
- No canonical files were modified; no commits were made by this audit. Parallel C10-fleet worktree changes observed during the session (a moving target: `M .gitignore`, `M scripts/check_collection_counts.py`, `?? reports/retrofit-soul-manifest.md`, plus the gitignored `content/spec-lab*` testbed; an earlier `M README.md` was integrated/committed mid-session) were preserved untouched.

## 9. Post-audit build verification — spec-lab observed results (Boris 0.8.2)

The C10 testbed (`content/spec-lab/`, 20 records) was built under `BORIS_BIN=/Users/tbuddy/.local/bin/boris`; `./bin/validate_graph.sh` passed with the testbed present, and emitted HTML was inspected. These observed results supersede `[unverified]`/`[contract]` cells above.

### 9.1 Feature verdicts — observed in `dist/cantilever/spec-lab/`

| Feature | Observed verdict | Evidence |
|---|---|---|
| Footnote refs + definitions `[^n]`/`[^n]:` | **PARSES-RENDERED** | `<sup class="footnote-ref">`, `class="footnote-backref"`, `data-footnote-backref-idx` emitted; defined pairs render with backlinks. Dangling markers (`[^absent]`) emit literally — spec-correct. |
| Definition lists `Term` + `: def` | **PARSES-RENDERED** | `<dl>`/`<dt>`/`<dd>` emitted from extension syntax ("Term being defined", "Second term", "Shared term one" all became `<dt>`). The native extension is **enabled**, not blocked. |
| Raw `<dl>/<dt>/<dd>` | PARSES-RENDERED | verbatim passthrough (type-6 HTML block), as predicted. |
| Task lists `- [ ]`/`- [x]` | **UNPARSED-LITERAL** | Zero `<input>` elements emitted; `[ ]`/`[x]` remain literal text inside `<li>`. GFM task-list extension is **off**. |
| Strikethrough `~~x~~` | **PARSES-RENDERED** | `<del>` emitted (2×); `~single~` and unclosed `~~` literal, as expected. |
| Heading `{#id}` anchor | PARSES-RENDERED | `id="sl-attr-heading"` emitted — re-confirms §2 finding. |
| `{.class}` / inline `{#id}` / block attrs | UNPARSED-LITERAL | all non-heading attribute forms emit literally. |
| Angle autolinks `<https://>` | PARSES-RENDERED | `<a href>` with entity-escaped query. |
| **Custom URI schemes** `<filed://…>` | **PARSES-RENDERED** | `href="filed://mascots/M-0400"` emitted — archive-internal schemes work **today**, no registry work needed. |
| Invalid scheme `<a:b>` | UNPARSED-LITERAL | correct spec behavior. |
| Math `$…$`/`$$…$$` | UNPARSED-LITERAL | `$$` emits literally; no math pipeline. |
| Non-schema frontmatter key | **HARD-FAIL (observed)** | `error: EFRONTMATTER: probe-c1-keys.md:5:1: unsupported frontmatter key` — compiler error, not a finding. Probed live; the §5 contract prediction is confirmed. |

### 9.2 Corrected C2–C9 readiness

| Pass | Superseded verdict | Corrected readiness |
|---|---|---|
| C2 Footnotes | ~~blocked + contaminated~~ | **READY — content pass only.** Rendering infrastructure is already live. The 52 dangling markers stay literal until definitions exist; C2 is a residue-policy decision (define vs. preserve-as-residue), not enablement. |
| C3 Definition lists | ~~native blocked upstream~~ | **READY — pure content work.** Both extension syntax and raw `<dl>` render today. No Boris change needed. |
| C4 Tables | enhancement (already live) | confirmed live (22 records). |
| C5 Task lists | verification pass | **BLOCKED UPSTREAM** — extension off; checkbox rendering needs Boris enablement. Corpus reads acceptably as literal until then. |
| C6 Attributes | blocked upstream / heading anchors live | confirmed: `{#id}` heading anchors only; block/inline/class attributes literal. |
| C7 HTML islands | partially live | confirmed live for raw HTML + `<Aside>`/`<Details>`; `<Redacted>`/`<Seal>` remain unprobed (0 corpus). |
| C8 Math | blocked upstream | confirmed literal. |
| C9 Autolinks | ready | **READY — stronger than expected.** Custom schemes (`filed://`, `lorelog://`, `mascot://`, `ref://`) render natively; the "registry" is a content-convention pass, not compiler work. |

### 9.3 Net pass-4 impact

Three of the eight transform classes (C2, C3, C9) required **no Boris work at all** — the pipeline already exceeds the issue's premises. Genuine upstream dependencies remain only for C5 (task lists), C8 (math), and C6-class attribute extensions. All proposed frontmatter feature-flag keys (`Footnotes:`, `Definition-List:`, `Checklist:`, `HTML-Island:`) are confirmed dead under the closed schema; feature conventions must be body-level or a Boris schema extension.

## Appendix A — commands executed (read-only census)

```sh
find content -name '*.md' | wc -l                                   # 2540 canon
grep -rhoE '^status: [a-z]+' content | sort | uniq -c               # status census
grep -rlc '^|.*|' content --exclude spec-lab                        # pipe-table files → 22
grep -rln '\[\^' content | grep -v spec-lab                         # footnote-marker files
grep -c '\[\^1\]' content/reference/fref-0150-mapa.md               # 22 markers, 0 defs
grep -rlE '^[[:space:]]*[-*+] \[[ xX]\]' content                    # task-list files → 16
grep -rln '~~' content --exclude-dir spec-lab                       # strikethrough → LLG-0405-MEL
grep -rln '<Aside\|<Details\|<Redacted\|<Seal' content              # component census
grep -rln 'https\?://[^)>]' content                                 # bare URLs → mascots/033
grep -rln '\[\[' content                                            # wiki links → ~1170
grep -rlE '^#+.* \{#' content                                       # heading anchors → 531
grep -rln '^```' content                                            # fences → 66 (14 info strings)
grep -rln '&[a-z#0-9]+;' content                                    # entities ~30+
grep -rln 'published_at:\|summary:' content                         # 0 — legal-unused keys
grep -rn '^Footnotes:\|^Definition-List:\|^Checklist:\|^HTML-Island:' content  # 0
git status --short                                                  # preserve parallel work
```
