# Working With Filed — A Practical Guide

This is the practical companion to `AGENTS.md` (operational rules) and `rules.md`
(philosophy and containment). It answers the question: *how do I actually make a
change to this site?*

Read it once, then use it as a checklist.

---

## 1. Orientation

Filed (`filed.fyi`) is a **production static Markdown archive** compiled by
**Boris**, a Zig static site compiler. There is no Node, no Astro, no build
framework — Boris reads `content/`, follows a graph model, and emits HTML into
`dist/cantilever/`, which is deployed to Cloudflare Pages.

Three structural facts matter for every edit:

- **Records are Markdown files** under `content/`, grouped into collections
  (aphorisms, mascots, lorelog, reference, posts, changelog, releases).
- **Each collection has a trunk** (`content/aphorisms.md`, `content/mascots.md`,
  ...) that lists the collection and maintains a hand-edited `Count: N records.`
  line.
- **Identity comes from paths or explicit `id:` overrides.** IDs are permanent.
  Never rename, renumber, or reuse one.

The next two sections explain what Boris actually understands, so that Filed's
conventions are never mistaken for compiler behavior.

---

## 2. How Boris sees this archive

Filed has collections, dockets, reference numbers, mascots, and archival
conventions. Boris does not know what any of those things mean. Boris sees a
smaller set of structural primitives.

A **page** has a canonical identity. By default that identity comes from its
source path; an explicit `id:` replaces the path-derived identity. Filed places
stronger permanence rules on those identities than Boris itself does. Follow
Filed's identity conventions even when the compiler would permit something else.

A page with no `parent` is a **Trunk**. A page with a `parent` is a
**Satellite**, and that parent must resolve to a Trunk. `parent` is structural:
it determines the document graph used for hierarchy, navigation, breadcrumbs,
and related projections. Do not use `parent` merely to say that two records
concern the same subject.

`relations` are **semantic edges**, not hierarchy and not build dependencies.
Use them only when the relationship itself is part of the archive's meaning.
The supported relation vocabulary is defined by Boris and the repository's
Boris workflow documentation (`docs/FILED-BORIS-LLM-WORKFLOW.md`). Absence of a
relation is valid; never manufacture one merely to make the graph look fuller.

Boris also understands references that are not `relations`:

- `[[entity-id]]`, `[[entity-id|label]]`, and heading-target forms create
  author-visible links resolved against the frozen Boris graph.
- `{{include path}}` transcludes Markdown source. Missing targets and include
  cycles are errors.
- `<Aside>` and `<Details>` are bounded in-page components. They remain part of
  the containing page and never become archive records or graph nodes.
- A page may own local files in a sibling `<page>.assets/` tree. Those files
  belong to the page's publication surface; they are not records and must not
  be given invented archive metadata.

Think about the intended meaning before choosing a mechanism:

- **hierarchy → `parent`**
- **semantic assertion → `relations`**
- **reader-facing cross-reference → wiki link**
- **shared source text → include**
- **local callout/disclosure → Aside or Details**
- **page-owned image/file → sibling `.assets/` tree**

Do not substitute one mechanism for another merely because they eventually
produce hyperlinks.

---

## 3. Validation has layers

Treat a validation failure according to the layer that produced it.

**Boris diagnostics** define compiler validity: source syntax, frontmatter
grammar, identity shape, graph structure, references, includes, components,
assets, layouts, and publication behavior.

**Filed validation** adds archive policy: collection conventions, trunk counts,
maintenance dockets, containment rules, relationship-review policy, and any
other repository-specific obligations.

**Helper scripts and generated reports are evidence and orchestration, not
independent content authorities.** They may detect a Filed-policy violation,
but they must not silently redefine canonical IDs, invent metadata, or create a
second database that the Markdown corpus must obey.

When a wrapper disagrees with Boris, determine which rule is actually intended
before changing content to satisfy the wrapper.

---

## 4. Frontmatter: Boris grammar vs Filed policy

Boris has a closed frontmatter grammar. The supported keys are:

`id`, `title`, `parent`, `status`, `tags`, `relations`, `published_at`, `summary`.

Boris accepts the statuses `draft`, `published`, and `archived`. Filed may use
a narrower subset for particular collections; follow the collection convention
rather than inventing another status.

`published_at` is a strict UTC publication timestamp and requires a non-empty
`summary`. Do not add either simply because the fields exist.

Boris does not require every page to have an explicit `id:` or `title:`. Filed
conventions may require them for particular record classes. When this guide
says a field is required by Filed, that is an archive rule, not a claim about
Boris's parser.

### Filed policy in practice

- The corpus overwhelmingly uses `published` and `archived`. A handful of
  `draft` records exist in `reference/`. A few residue statuses
  (`nominal`, `external`, `revised`) survive from earlier eras — do not add new
  statuses, and do not normalize the residue.
- `published_at` and `summary` are not currently used anywhere in `content/`.
  Do not introduce them without a Filed-policy reason.
- No wiki links, `{{include}}` transclusions, `<Aside>`/`<Details>`, or
  `.assets/` trees exist in the corpus yet. They are valid Boris mechanisms;
  use them only when the meaning genuinely calls for them (§2).
- `tags` are lowercase strings. `relations` use the small vocabulary documented
  in `docs/FILED-BORIS-LLM-WORKFLOW.md` (`relates_to`, `implements`,
  `depends_on`, `supersedes`).
- **Do not invent keys.** Unknown keys are build errors. Never add legacy
  Astro-era metadata (`updatedAt`, etc.), JSX/MDX, or executable expressions.

---

## 5. The Loop — how changes actually land

Recent history follows a consistent pattern. Every substantive change:

1. **Branch.** Name it `maintenance/FNF-MECH-NNN`, `maintenance/FNF-VOICE-NNN`,
   or, for agent work, `freebuff/<short-slug>-<uuid>`.
2. **Edit.** Keep the diff surgical. Preserve unrelated work in progress.
3. **Validate locally.**
   ```sh
   ./bin/validate_graph.sh
   ```
   This runs Boris graph diagnostics plus a full Cantilever compile. It must
   pass before anything ships. Diagnose failures by layer (§3) before changing
   content.
4. **Record the work** in `content/changelog/` (see §6) with a maintenance ID
   `0.1.NNNNN.task-slug`, and bump the trunk count.
5. **Commit** with a `maint(area): description (0.1.NNNNN.task-slug)` message,
   e.g. `maint(tags): high-confidence tag hygiene pass (0.1.00024.fnf-mech-016)`.
6. **Open a PR to `main`.** CI runs two jobs that must both pass:
   - `validate` — provisions Boris, runs provisioner regression tests, runs
     `./bin/validate_graph.sh`, uploads the site artifact.
   - `publish-export` — runs relationship-repair regressions, runs
     `./scripts/filed-publish.sh`, and **fails if
     `reports/relationship-integrity.md` shows FINDINGS**.

A maintenance docket entry is not a release. `/releases/` records
archive-state declarations; `/changelog/` records what was actually done.

---

## 6. Collection conventions

### ID and filename patterns

| Collection | Example path | Filename pattern | `id:` override pattern |
|---|---|---|---|
| Aphorisms | `content/aphorisms/APH-400.bad-request-bob.md` | `APH-NNN.slug.md` | `aphorisms/APH-0NNN` (4-digit padded) |
| Mascots | `content/mascots/400.bad-request-bob.md` | `NNN.slug.md` | `mascots/M-0NNN` (4-digit padded) |
| Lorelog | `content/lorelog/LLG-0001-NAV.md` | `LLG-NNNN-SLUG.md` | `lorelog/LLG-NNNN-SLUG` |
| Reference | `content/reference/fref-0340-tsab.md` | `fref-NNNN-slug.md` | `reference/FREF-NNNN-SLUG` |
| Posts | `content/posts/FFP-0380.md` | `FFP-NNNN.md` | `posts/FFP-NNNN` |
| Changelog | `content/changelog/2026-08-07-docket-convention.md` | `YYYY-MM-DD-task-slug.md` | none — derived from path |
| Releases | `content/releases/v0.1.2-replacement-without-release.md` | `vX.Y.Z-slug.md` | `releases/REL-NNNN` |

Notes:

- Boris derives the canonical ID from the source path by default. An explicit
  `id:` frontmatter override is only needed when a stable identity independent
  of the path is desired (all collections except changelog use them in practice).
- The corpus contains historical irregularity (lowercase `fref-`, `aph-LLG-`,
  odd numbering gaps, APH entries that are really mascot pages). **Preserve it.**
  Match the dominant pattern of the collection you are editing; never "fix"
  IDs or normalize residue for consistency.
- Changelog IDs are never overridden; the maintenance identifier
  (`0.1.NNNNN.task-slug`) lives in the **body**, not the filename or frontmatter.

### A worked example — changelog entry

The changelog is where you record your own work. See
`docs/changelog-convention.md` for the full spec; the shape is:

```markdown
---
title: "Short descriptive title"
parent: changelog
status: published
tags: ["changelog", ...]
---

# Short descriptive title

**Maintenance ID:** 0.1.00024.task-slug
**Date:** 2026-08-07
**Scope:** collection or path affected

## What changed
- Concrete description of what was done.

## What was deliberately left alone
- What was explicitly not touched, and why.

## Verification performed
- `./bin/validate_graph.sh` passed with no errors.

## Unresolved follow-up
- Anything discovered but not addressed (optional).
```

### A worked example — content record

```markdown
---
title: "Example Record Title"
id: reference/FREF-9999-EXMP
parent: reference
status: published
tags: ["reference"]
---

# Example Record Title

Body text in the archival voice. Dry. Records-officer tone.
```

---

## 7. Git hygiene

**Committed:** `content/`, `themes/`, `scripts/`, `docs/`, `metadata/`,
`reports/`, `.github/`, `AGENTS.md`, `README.md`, `rules.md`, `wrangler.jsonc`.

**Never commit** (build artifacts and local state, all gitignored):

```
dist/  publish/  site/  out/  outputs/  exports/
bin/boris*  .zig-cache/  .zig-global-cache/  .tools/
filed-boris-2026-08-02/  .freebuff/  .inbox/  *.log  .DS_Store  Thumbs.db
```

- `bin/boris*` are local compiler binaries. Provision them with
  `./scripts/ensure-boris.sh`; they must never enter git.
- `.freebuff/` is local agent workspace state. It is gitignored; leave it out
  of commits.
- `.inbox/` is the drop folder for handing files to the agent: paste exports,
  notes, reference material, anything to ingest. It is gitignored and never
  committed. Check it at the start of a task. Files there are **inputs**, not
  archive content — nothing in `.inbox/` may become canon on its own.
- Use targeted staging (`git add <files>`) — never `git add -A` — and preserve
  unrelated work in progress.

---

## 8. Commands

| Command | What it does |
|---|---|
| `./scripts/ensure-boris.sh --provision` | Provision the Boris compiler binary (network build; pass `--provision` or set `BORIS_AUTO_PROVISION=1`). |
| `./bin/validate_graph.sh` | **The gate.** Boris `check` + full Cantilever compile. Run before every completion. |
| `./preview.sh` | Build and serve locally at `http://localhost:8000`. |
| `./scripts/filed-build.sh` | Production HTML build into `dist/cantilever/`. |
| `./scripts/filed-publish.sh` | Publish exports: HTML, IR, RAG, Context, sitemap, `llms.txt` into `publish/`. |
| `./scripts/clean-binaries.sh` | Remove stale compiler binaries from `bin/`. |
| `python3 scripts/test_*.py` | Python regression suites (relationship repair, tag roundtrip, verse residue, etc.). |

If Boris isn't on PATH, pass it explicitly: `BORIS_BIN=/path/to/boris ./bin/validate_graph.sh`.

---

## 9. Rules of thumb

- **Run `./bin/validate_graph.sh` before declaring anything complete.** Report
  the exact commands and results you ran — no generic success claims.
- **Diagnose by layer (§3).** Before changing content to satisfy a wrapper
  script, decide whether the failure is a Boris diagnostic or a Filed-policy
  check, and which rule is actually intended.
- **Never invent metadata.** Missing links and unlinked states are valid
  archive conditions. Restraint is a feature.
- **Voice.** Dry, records-officer tone. Dry humor welcome when it emerges
  naturally. "Leveraged best practices to comprehensively optimize the content
  surface" is not acceptable; "Removed six image-generation presets. None were
  believed to be load-bearing" is.
- **Containment.** Respect the Bin 8C and breeding-program containment
  directives in `rules.md`. Do not let records inherit that terminology by
  tonal resemblance.
- **Trunk counts are hand-maintained.** If you add a record, update the
  `Count: N records.` line in its trunk to match reality at commit time.
- **Maintenance IDs can collide.** Branches merge concurrently; if your
  `0.1.NNNNN` was claimed on `main` while you worked, renumber rather than
  conflict.

---

## 10. Where the docs live

| Doc | Role |
|---|---|
| `AGENTS.md` | Canonical operational guide for coding agents. |
| `rules.md` | Philosophy, identity rules, containment directives. |
| `README.md` | Build commands, deployment, repository layout. |
| `docs/changelog-convention.md` | Maintenance docket format spec. |
| `docs/FILED-BORIS-LLM-WORKFLOW.md` | Graph-aware editing workflow and `relations` guidance. |
| `docs/cloudflare-deployment.md` | Deployment details. |
| `GEMINI.md` | Model pointer file (see AGENTS.md, rules.md, README.md). |
| `CLAUDE-MISSION.md` | **Historical** styling brief predating the Boris takeover — do not treat as active instructions. |

When docs conflict, `AGENTS.md` and the executable validation scripts win.
