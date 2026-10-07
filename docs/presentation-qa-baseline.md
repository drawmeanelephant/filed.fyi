# Archive Presentation QA: read-first baseline v1

This is the shared presentation contract for
[#609](https://github.com/drawmeanelephant/filed.fyi/issues/609).
`AGENTS.md` and `rules.md` remain authoritative. Do not weaken the reading
requirement to increase throughput. Scripts and this document are not a second
content authority; `content/` remains the source of record.

## Baseline scope and approval

Publishing is not approval. Until this document is merged and explicitly
approved, #609 remains the shared acceptance contract. The coordinator must
link the baseline PR, merged commit, and explicit maintainer approval back to
#609 before any pilot starts. The maintainer, not the worker, approves it.

The baseline task owns only this document, narrow governance pointers, and its
required maintenance docket/trunk update. It does not sweep, repair, or reformat
archive records. Count/history reconciliation belongs to
[#611](https://github.com/drawmeanelephant/filed.fyi/issues/611), which depends
on #609 and must finish before pilot release.

## Population and bounded assignments

Snapshot: `8997eebee2a4e620c5dd47fcea97abf515c4cac6`. It contains exactly
2,267 committed Markdown pages under `content/`, including nested reference
pages and all 11 root pages.

| Collection | Snapshot files | Bounded reading workloads |
|---|---:|---:|
| aphorisms | 542 | 22 |
| changelog | 62 | 7 |
| guides | 3 | 1 |
| haikus | 520 | 22 |
| limericks | 551 | 32 |
| lorelog | 189 | 29 |
| mascots | 249 | 42 |
| posts | 9 | 2 |
| reference | 128 | 25 |
| releases | 3 | 1 |
| trunks | 11 | 2 |

These are assignments, not a canonical registry or compiler schema. No file
loses coverage because its name is irregular, it already has emphasis, it
seems repetitive, or it is long. Previously edited records remain in the
read-first population. Later additions belong to the final delta audit.

Cap each workload at 25 poetry files or 10 other files and roughly 1,600 source
lines / 7,000 words, whichever binds first. An oversized record gets its own
issue and still must be read in full. These are sizing caps, never edit quotas.

## Read first, one record at a time

Work only on the supplied single workload issue, this baseline, and repository
guidance. Do not enumerate the milestone/backlog, choose another issue, sweep
the archive, or replace the assignment with a repository-wide pass. If given
only a milestone or giant task list, stop and request one specific workload
issue. Stop after that issue; do not select the next task.

1. Read `AGENTS.md`, `README.md`, `rules.md`, `docs/working-with-filed.md`, and
   `docs/changelog-convention.md` in full. Inspect git status and `.inbox/`;
   preserve unrelated work.
2. Read every assigned file in full, frontmatter through final line, including
   related-residue appendices and existing formatting. Page through long files.
   Search results, heading outlines, summaries, snippets, token counts, and
   another agent's summary are not full reading.
3. Before editing each file, write a concrete observation about that record
   with a file/line anchor. Decide whether a formatting change is justified.
   Read nearby records in full for local context only, not as extra edit targets.
4. Make only individual, record-specific edits after reading that record. Do
   not delegate assigned reading to another agent.
5. Reread each edited record and review its diff. Preserve voice, ambiguity,
   contradictions, numbering gaps, incomplete sentences, and intentional
   duplicates. Review unchanged records too; “the rest are similar” is not
   evidence.

### Allowed and forbidden automation

Allowed: read-only inventory, search, diff and count checks; existing builds,
tests and protective validators; PR/issue administration.

Forbidden: bulk rewrite scripts, regex substitutions, formatter sweeps, loops
over files to edit them, automated emphasis selection, mass LLM rewrites, and
cross-record edit templates. Automation must not decide wording, emphasis,
paragraph structure, or archive-record edits. Do not add framework tooling,
content-rewrite scripts, or another content authority.

Neither a passing script, all-green CI, nor generated reading claims prove
reading or editorial quality. Report real blockers instead of claiming success.

## Restrained formatting rubric

- Improve presentation only where this record earns it: restrained inline
  emphasis and clearly justified Markdown block spacing/layout. Bold is at
  most one genuine pivot per record, not a quota. There is no fixed italics
  count. Leaving a good record unchanged is a successful review.
- Do not rewrite, correct, add, remove, reorder, paraphrase, or standardize
  words. Do not smooth over archival residue.
- Preserve canonical IDs, paths, frontmatter, status/tags/relations, titles,
  link targets/labels, anchors, code/backtick spans, tables, existing markup,
  and quoted/documentary material by default. Changing a protected region
  requires an explicit, narrow maintainer decision, not an interpretation of
  this issue.
- Preserve poetry line/stanza structure, indentation, and two-space hard
  breaks exactly. Never run a trailing-whitespace cleaner or paragraph reflow.
- Never import Bin 8C/MA8C or breeding-program vocabulary by mood or proximity.
  Follow `rules.md`.
- Existing emphasis is not permission to add more. Do not mechanically remove
  earlier emphasis either. Raise a record-specific concern if rebalancing
  needs approval.
- A real non-formatting defect is `needs decision`. Keep the issue open until
  the maintainer resolves or explicitly waives it. Do not silently expand scope
  or manufacture metadata or links.

## Per-file evidence and no-change completion

Provide one row for every exact assigned path, including unchanged files:

| File | Read in full | Disposition | Specific observation with line anchor | Formatting decision and reason | PR/review evidence |
|---|---|---|---|---|---|
| each exact assigned path | yes, only after full reading | changed / reviewed unchanged / needs decision | a concrete record detail with file/line anchor, not its filename/title or a generic claim | why it changed or stayed plain | link or no-change review evidence |

If reading is blocked, say so; do not mark it read. Copy-pasted observations,
blanket “all read,” generated batch summaries, and checkbox-only sign-offs are
insufficient. Report reviewed, changed, unchanged, and needs-decision totals
separately and reconcile them against the exact assignment. Do not hide unread
files in those totals.

A reviewer must challenge generic evidence and spot-check both edited and
unchanged records. Evidence is accountable review, not mathematical proof of
reading.

For no-change work, provide full per-file evidence and validation/review results
to the coordinator. Do not create an empty PR or artificial docket to show
activity. The coordinator verifies the evidence before closing.

## Delivery and validation gates

- Start a fresh branch from current `main`. The snapshot defines the assigned
  population, not permission to apply stale patches. If an assigned file
  changed since the snapshot, reread the current file, inspect the intervening
  diff, and disclose it. Stop on a move, removal, or identity change.
- Edit only assigned paths. A substantive PR may also add its own maintenance
  docket and update `content/changelog.md` through the finalization lane below.
  Follow the repository's maintenance commit/docket convention.
- Changed records require a PR to `main` referencing the workload issue,
  per-file reasoning, complete read evidence, and an independent reviewer.
  Never commit generated outputs or compiler binaries.
- Run `./bin/validate_graph.sh` and report its exact outcome and any compiler
  or environment blocker. Provision the pinned Boris compiler with
  `./scripts/ensure-boris.sh --provision` when needed. Do not substitute another
  generator or report a missing-compiler run as passed.
- Changed work requires successful `validate`, `publish-export`, and aggregate
  `ci` checks before merge. These are separate from editorial acceptance.
- Inspect every changed record's compiled article for accidental emphasis or
  delimiters, broken hard breaks, paragraph/stanza changes, and navigation or
  anchor damage. Check representative desktop and mobile pages, including the
  largest/riskiest record and one deliberately left unchanged. Report exact
  pages, viewport sizes, and results, not an unperformed rendered-review claim.
- Close only when every assigned file has complete evidence, any substantive
  PR is merged, review and validation requirements are met, and every
  `needs decision` is resolved or explicitly waived by the maintainer.

## Shared maintenance finalization lane

#611 owns current collection/README count reconciliation, historical coverage
discrepancies, and the maintainer-approved disposition of legacy numbering
residue. Do not infer “read” from “changed,” invent historical review evidence,
or rewrite old verification into success. Preserve historical paths and IDs.
Repeated maintenance sequence numbers with different full docket strings are
not canonical record-ID collisions; do not renumber established identities.

The coordinator serializes shared maintenance finalization, not assigned
reading. Do not have every workload edit trunks at once:

1. Rebase the workload branch on current `main` at finalization. Inspect incoming
   changes and resolve shared-file conflicts without discarding another docket.
2. Check the maintenance sequences already claimed on current `main` and in
   incoming coordinated work. Choose an unclaimed sequence for this PR's new
   docket then, not a pre-reserved canonical ID. If claimed before merge, change
   only this unmerged docket's maintenance sequence, not historical identities.
3. Recount the actual changelog source records, including the new docket, and
   set `content/changelog.md` to that count. Never apply a blind `+1` to a stale
   trunk total. Counts come from Markdown source, including nested records,
   not old narrative totals or a new allocator/registry.
4. Review the shared-file diff and rerun validation after conflict resolution.
   If `main` changes again, repeat finalization before merge. Require the CI
   gates and independent review; leave unrelated reconciliation to #611.

## Reusable single-issue launch prompt

Hand the worker only its own issue, this baseline, and repository guidance,
not the milestone/index. Do not ask it to select or batch-process backlog tasks.

> Work only on the single workload issue I give you. Read this shared baseline and repository guidance, then read every explicitly assigned record in full before editing it. Do not enumerate the milestone/backlog or choose another task. Write a concrete, anchored observation and formatting decision for each file, including unchanged files. No bulk rewrite scripts, formatter/regex sweeps, automated emphasis, or delegated reading. Keep scope exact, report real validation/rendered-review results, and stop after this issue. If no single workload issue was supplied, stop and request one.
