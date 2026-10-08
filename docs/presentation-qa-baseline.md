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
