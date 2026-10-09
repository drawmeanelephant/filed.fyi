# Archive presentation review

Presentation work is light formatting on archive records: restrained emphasis and
justified block spacing. Words, meaning, IDs, links, and poetry line structure
do not change. `AGENTS.md` and `rules.md` remain authoritative, and `content/`
remains the source of record.

## Roles

- **Worker agent**: takes one bounded assignment (a named set of records or one
  issue). Reads every assigned record in full before editing it, then edits by
  hand, one record at a time. Opens a PR to `main` with a per-record note: the
  file, one concrete observation with a line anchor, and whether it changed or
  stayed plain, with the reason.
- **Reviewer agent**: a separate agent that did not write the change. Reads the
  full PR diff, reads every changed record and at least one unchanged record in
  full, and posts a PR review: `APPROVE` or `REQUEST_CHANGES`, with specifics.
- **Maintainer**: sets scope and direction, changes this rubric, and resolves
  `needs decision` items.

## Read first

Before any presentation edit, read `AGENTS.md`, `rules.md`, and
`docs/working-with-filed.md`. Inspect `git status` and `.inbox/`, and preserve
unrelated work. Read nearby records for voice and layout, but they are not extra
edit targets. Search results, outlines, summaries, and another agent's notes do
not count as reading.

## Allowed and forbidden automation

Allowed: read-only search, inventory, diff, and count checks; existing builds,
tests, and validators; PR and issue administration.

Forbidden: bulk rewrite scripts, regex substitutions, formatter sweeps, loops
that edit files, automated emphasis selection, mass LLM rewrites, and
cross-record edit templates. Automation must not decide wording, emphasis, or
paragraph structure.

## Formatting rubric

- Emphasis: at most one genuine `**bold**` pivot per record, and only where the
  record earns it. No quota. Existing emphasis is not a reason to add more, and
  is not removed mechanically either.
- Block layout: spacing changes only where clearly justified. Leaving a good
  record unchanged is a successful review.
- Do not rewrite, correct, add, remove, reorder, or standardize words. Do not
  smooth over archival residue, contradictions, or numbering gaps.
- Keep unchanged: canonical IDs, paths, frontmatter, status, tags, relations,
  titles, link targets and labels, anchors, code spans, tables, quoted or
  documentary material, and existing markup.
- Poetry: preserve line and stanza structure, indentation, and two-space hard
  breaks exactly. No trailing-whitespace cleaning or paragraph reflow.
- Do not import Bin 8C, MA8C, or breeding-program vocabulary. Follow `rules.md`.
- Non-formatting defects are not fixed in a presentation PR. Open an issue,
  leave the record as it is, and mark it `needs decision` in the PR note.

## Merge gate

A presentation PR merges when all of these hold:

1. `./bin/validate_graph.sh` passes, and CI (`validate`, `publish-export`, and
   the aggregate `ci` check) is green.
2. Every assigned file has a per-record note, including unchanged files.
3. A reviewer agent other than the author has posted an `APPROVE` review, and
   there is no open `REQUEST_CHANGES`.
4. The reviewer's checklist (below) is complete.

Checklist for the reviewer:

- The diff touches only the assigned records (plus this PR's own changelog
  docket, if it has one).
- No word, order, ID, link, or frontmatter change. Only emphasis markers and
  block spacing differ.
- Each changed record has at most one new bold pivot, and it reads as a real
  pivot, not decoration.
- Poetry hard breaks and stanza structure are unchanged.
- At least one unchanged record was read in full and its note is specific.
- Notes are record-specific, not generic.

## Counts and changelog

Counts and maintenance dockets follow `docs/changelog-convention.md`. Count
reconciliation is a separate maintenance task. A presentation PR does not
change trunk counts unless it adds its own docket.

---

## Pass 2 — rich structure

Pass 2 issues are scoped slices of the same collections, but the unit of work
changes: instead of looking for a single bold pivot, the worker asks whether
the record's *content already implies a structure the Markdown does not
express*. The pass-1 cap on emphasis is lifted; the transforms below replace
it as the boundary.

All pass-1 invariants still hold: no word changes, no reordering, no new
prose, canonical IDs and frontmatter frozen, `## Related *` verse tails
untouched, `needs decision` for non-formatting defects, unchanged-is-success.

### Allowed transforms

Each transform must be earned by content already in the record. None are
quotas; most records will earn zero or one.

- **Identifier → code span.** Literal identifiers only: field names
  (`breedingProgram`), document codes (`SIDR-8C/AFT/01`), form numbers,
  hex tokens, file paths. Never names, titles, or prose emphasis. When in
  doubt, leave plain.
- **Enumeration → list.** A prose passage that enumerates discrete items
  (signatories, conditions, steps, substitutions) may be split into a list,
  item-for-item, with no added or altered wording. Comma-separated adjectives
  and rhetorical triads are not enumerations.
- **Field fragments → run-in labels.** Lead-in words the record already
  carries (`Action:`, `Comment:`, `Materials:`) may become `**Label:**`
  run-ins matching the house style. No new label text.
- **Preserved fragment → blockquote.** Verbatim filings, margin notes, and
  board minutes already set off or introduced as quotation may become `>`
  blocks. Scare-quotes, single terms, and in-scene dialogue stay inline.
- **Annex section → `<Details>` or `<Aside>`.** Boilerplate interpretation
  annexes ("Managed Absence Interpretation", "Interpretation Boundary
  Adjustment" and kin) may be wrapped in `<Details summary="…" id="…">` or
  `<Aside kind="…" id="…">`. The summary/kind text must reuse the existing
  heading or lead wording. Attribute vocabulary is compiler-allowlisted; run
  `boris check` and use only permitted values.
- **Tabular content → table.** Only where the content is already a matrix in
  fact (chronologies, score mappings, rosters). Expected to be rare.
- **Record mention → wiki link.** An unambiguous mention of another archive
  record's ID (`LLG-0072-SOMA`, `FREF-0900-CCC`) may become
  `[[canonical-id]]` or `[[canonical-id|label]]`. The label preserves the
  source spelling exactly; never normalize it. Targets are resolved against
  the frozen graph and a miss is a hard error — if the canonical ID cannot
  be confirmed, leave the text plain and note it in the PR note. This is the
  only transform that creates a graph edge; treat it as an evidence-layer
  claim, not decoration. Frontmatter `relations` are not touched. Natural-
  language references without an ID token are out of scope for pass 2 slices
  unless the slice says otherwise.
- **Provenance tail → footnote.** Where a source/attribution tail already
  exists at paragraph end, it may become `[^n]`. Rare; skip if uncertain.
- **Emphasis.** Bold and italic are uncapped but must still be earned;
  decorative emphasis remains out.

### Implementation notes (pilot findings)

Clarifications recorded from the lorelog pilot review (PR #966). These read
the transform list; they do not extend it.

- **Code spans follow token shape, not grammatical role.** A literal
  identifier token (`SIDR-8C/AFT/01`, `breedingProgram`, `PPC-9`,
  `0xDEADFILE`) may be code-spanned wherever it occurs, including as a
  sentence subject. Spaced title-case designations used as names
  (Condition Log 7, Internal Correction Notice 4C, CLD-8C) stay plain —
  they are names, not identifiers. Short form codes (`51-E`, `SOMA-72`,
  `COMA-19`) may be spanned; within one record, consistency matters more
  than the choice. Record the call in the PR note either way.
- **List splits keep punctuation inside the items.** Conjunctions,
  trailing periods, and connectors stay exactly where the source put
  them. Adding a lead-in colon to the surviving intro line is a permitted
  punctuation adjustment, not a word change.
- **`<Details>`/`<Aside>` `id` preserves the heading anchor.** When the
  wrapped section previously had a heading, the component `id` should
  reproduce the auto-derived anchor so existing `#…` links keep working.
- **The formal `APPROVE` must come from a different GitHub account than
  the PR author.** A comment review alone does not satisfy the merge
  gate's reviewer requirement.

### What does not change in pass 2

Words, meaning, order, IDs, frontmatter, verse structure, link targets.
Splitting a paragraph into a list is a formatting change; rewriting the
sentences inside it is not permitted. A record that earns no transform stays
unchanged and counts as a successful review.

### Merge gate (pass 2)

Items 1–3 of the pass-1 merge gate apply unchanged. The reviewer checklist
for a pass-2 PR is:

- The diff touches only the assigned records (plus this PR's own docket).
- No word, order, ID, or frontmatter change. Only Markdown structure differs.
- Every new construct uses a transform from the allowed list, and each one
  reads as earned, not decorative.
- List items are verbatim splits of the source prose.
- Block-quoted material is verbatim and was quotation in the source.
- Every wiki link resolves and its label preserves the source spelling.
- `<Details>`/`<Aside>` summaries reuse existing wording and compile under
  `boris check`.
- Verse tails and hard breaks are untouched.
- At least one unchanged record was read in full and its note is specific.
