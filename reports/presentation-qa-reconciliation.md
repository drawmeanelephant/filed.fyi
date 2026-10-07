# Presentation QA: count and prior-coverage correction

Issue #611. Audited on 2026-10-06 against `main` commit
`0075e8f055a4c5f3ebb97f467b3521405a6cb66e` (baseline PR #801).
The milestone snapshot remains
`8997eebee2a4e620c5dd47fcea97abf515c4cac6`; it is not the current tree.
This report corrects bookkeeping, not record formatting or earlier verification.

## Current source census

Every trunk was read in full. Counts come from actual Markdown source files,
recursively, not old docket populations or declared trunk totals.

| Source | Declaration before | Actual before this docket | Declaration after |
|---|---:|---:|---:|
| `content/aphorisms.md:13` | 563 | 542 | 542 |
| `content/changelog.md:19` | 63 | 63 | 64 |
| `content/guides.md:13` | 3 | 3 | 3 |
| `content/haikus.md:13` | 577 | 520 | 520 |
| `content/limericks.md:13` | 576 | 551 | 551 |
| `content/lorelog.md:13` | 187 | 189 | 189 |
| `content/mascots.md:13` | 249 | 249 | 249 |
| `content/posts.md:13` | 9 | 9 | 9 |
| `content/reference.md:13` | 128 | 128 | 128 |
| `content/releases.md:13` | 3 | 3 | 3 |
| `content/index.md` | no count | home trunk | no count |
| README pages | 2,265 | 2,268 | 2,269 |
| README trunks | 11 “collection trunks” | 11 roots | 11 trunk pages |
| README satellites | 2,254 | 2,257 | 2,258 |

Reference has 79 direct and 49 nested records, totaling 128. The 11 roots
comprise the home page and **ten** collection roots. Adding this corrective
docket increases actual pages and satellites by one; it does not add a trunk.
The snapshot had 2,267 pages / 11 trunks / 2,256 satellites. #609 added the
baseline docket and corrected changelog's stale declaration 61 → 63. Its
snapshot population table remains historical evidence and was not rewritten.

## Historical coverage, claims are not reading evidence

All 13 aphorism and eight limerick emphasis dockets were read in full, as was
the baseline docket. Net changes were inventoried against each merge's **first
parent**, not its branch tip or accumulated stack. Poetry changes were all
modifications, with no added, deleted, or renamed poetry records.

`reports/presentation-qa-prior-coverage.tsv` names all 527 exact paths in the
reconstructed endpoint intervals, plus the two trunks explicitly mentioned
by the first runs. It records the immutable merge, PR, net-change status, and
**unknown** historical reading for each path. It is evidence, not an assignment
registry, canonical identity allocator, or a reading certificate.

For aphorisms, intervals use case-folded path order with exact spelling retained,
matching the dockets' interleaving of lowercase mirrors. Limerick runs use
case-sensitive path order, matching their first 200 upper-prefix records.
These are explicit reconstruction choices, not proof of earlier agents'
sorting commands. No single ambiguous ordinal watermark defines coverage.

In the table, “claimed” is the docket's changed-record count. “Interval” is the
reconstructed source population, not a verified reviewed count. “Read unknown”
applies to every interval record, including every modified record. The two
trunks add two more unknown-reading paths outside these interval counts.

| Run | PR | Merge | Claimed changed | Interval | Net changed | Net unchanged | Read unknown |
|---|---:|---|---:|---:|---:|---:|---:|
| Aphorisms 01 | 585 | `11f29818` | 24 | 24 | 24 | 0 | 24 |
| Aphorisms 02 | 586 | `1ceeb6c8` | 25 | 25 | 25 | 0 | 25 |
| Aphorisms 03 | 587 | `961e708b` | 25 | 25 | 25 | 0 | 25 |
| Aphorisms 04 | 588 | `d8cbd98d` | 25 | 25 | 25 | 0 | 25 |
| Aphorisms 05 | 589 | `e54dd404` | 25 | 25 | 25 | 0 | 25 |
| Aphorisms 06 | 591 | `23cce3f6` | 25 | 25 | 25 | 0 | 25 |
| Aphorisms 07 | 593 | `ad13b768` | 25 | 25 | 25 | 0 | 25 |
| Aphorisms 08 | 595 | `3791aaf1` | 25 | 25 | 25 | 0 | 25 |
| Aphorisms 09 | 597 | `d444a15c` | 25 | 25 | 25 | 0 | 25 |
| Aphorisms 10 | 598 | `de6c0f16` | 25 | 25 | 25 | 0 | 25 |
| Aphorisms 11 | 601 | `93f8c878` | 25 | 25 | 25 | 0 | 25 |
| Aphorisms 12 | 603 | `b7dcbb54` | 25 | 26 | 26 | 0 | 26 |
| Aphorisms 13 | 608 | `d78d8f31` | 25 | 25 | 23 | 2 | 25 |
| Limericks 01 | 592 | `6abe1dc1` | 25 | 25 | 25 | 0 | 25 |
| Limericks 02 | 594 | `a09f05fe` | 19 | 25 | 19 | 6 | 25 |
| Limericks 03 | 596 | `22a25230` | 21 | 25 | 21 | 4 | 25 |
| Limericks 04 | 599 | `127f857a` | 25 | 25 | 25 | 0 | 25 |
| Limericks 05 | 600 | `921f2a72` | 25 | 25 | 25 | 0 | 25 |
| Limericks 06 | 602 | `78b32ec6` | 23 | 25 | 23 | 2 | 25 |
| Limericks 07 | 604 | `7bb03962` | 25 | 25 | 25 | 0 | 25 |
| Limericks 08 | 605 | `8997eebe` | 25 | 25 | 25 | 0 | 25 |
| **Poetry total** | | | **512** | **525** | **511** | **14** | **525** |

Historical reviewed count verified by this audit: **0**. Historical
reviewed-unchanged count verified: **0**, not 14. Twelve unchanged limericks
were claimed as read/left plain, but those claims are not independently
verified here. The two unchanged aphorisms have contradictory coverage claims.
All other current source pages have unknown earlier reading too; absence from
this limited emphasis inventory says nothing about other historical edits.
Every page, including already emphasized pages, remains in the milestone's
new read-first population. Later dockets require the final delta audit.

### Exact discrepancies and corrective resume evidence

- #603 and its docket say 25 touched. `b7dcbb54^1..b7dcbb54` modifies **26**.
  The case-folded inclusive interval is
  `content/aphorisms/APH-FREF-0280-CBND.md` through
  `content/aphorisms/APH-FREF-0580-CMPS.md`. Neither duplicate-numbered
  spelling at 0560/0570 may be dropped to make the arithmetic fit.
- #608 and its docket say 25 touched. `d78d8f31^1..d78d8f31` modifies **23**.
  `content/aphorisms/APH-fref-0650-pbc.md` and
  `content/aphorisms/APH-fref-0661-agbx.md` are **inside** the inclusive
  0590–0790 interval, unchanged by the merge, and **reading unknown**.
  They must receive their own exact-path read evidence, not be skipped when
  a later reader starts at `content/aphorisms/APH-FREF-0800-SCRL.md`.
  The supposedly “beyond” lowercase paths
  `content/aphorisms/aph-fref-0635-wwlv.md` and
  `content/aphorisms/aph-fref-0636-wcr.md` were actually modified by #608.
- #603's extra path shifts the later ordinal arithmetic: with the aphorisms
  trunk counted first, 0580 is position 301, 0590 is 302, 0790 is 326, and
  0800 is 327 in the reconstructed order. Preserve exact paths, not the old
  claims that 0580/0790 were positions 300/325.
- Limericks 05 says resume at `content/limericks/LIM-LLG-0382-ITS.md`;
  the next actual path, covered by run 06, is
  `content/limericks/LIM-LLG-0382-BPD.md`. Run 06 says resume at
  `content/limericks/LIM-LLG-0401-AMS.md`; run 07 actually starts at
  `content/limericks/LIM-LLG-0400-SCAS.md`. Run 07's
  `content/limericks/LIM-LLG-0823-PRS.md` continuation differs from run 08's
  actual start `content/limericks/LIM-LLG-0824-GBC.md`.
  The three incorrect continuation targets do not exist at those merges.
- #599 already corrected run 03's continuation from nonexistent
  `LIM-LLG-0326-CRS.md` to `LIM-LLG-0323-LC04.md`. That historical docket
  modification is present in the first-parent diff, separate from its 25
  poetry changes; no fresh historical rewrite was made here.
- Aphorisms 07's prose says 290/291 “close the run,” although its watermark
  and actual last changed path are 296. Its merge added a docket without
  changing the trunk count: actual changelog 48 → 49, declaration 48 → 48.
  Subsequent merges through #605 retained a one-record deficit (61 declared /
  62 actual at the snapshot). Concurrent limerick merges also make several
  aphorism dockets' narrated trunk transitions differ from their merge diffs.
- The repeated 2,246 population and queue remainders are a start-era narrative,
  not a current census or proof of completed reading. Earlier validation and
  byte-check claims are preserved as historical assertions. Asterisk-strip
  equality is not syntax-aware preservation evidence; this audit does not
  promote those old checks into stronger guarantees or rerun them as old success.

## Historical numbering disposition

The maintainer explicitly approved preservation in this #611 session on
2026-10-06. Preserve repeated sequences **00002, 00008, 00015, 00024, and
00037–00043**, established full docket strings, files, and canonical IDs.
The three 00002 declarations include `fnf-id-001`, `fnf-mech-001`, and
`fnf-mech-002`; the older other pairs are `fnf-id-008`/`fnf-mech-008`,
`fnf-poet-001`/`fnf-voice-001`, and `fnf-mech-016`/`reference-authority`.
00037–00043 pair aphorism runs 07–13 with limerick runs 01–07.
These are maintenance **sequence** repetitions, not canonical record-ID
collisions. Legacy `FNF-*` declarations without a modern numeric string
remain unchanged too. New work must choose an unclaimed sequence at
finalization. 00046 was unclaimed on the audited `main`, not reserved against
#610 or any other incoming work.

## One shared finalization lane

The coordinator serializes finalization only; workload reading stays independent.
Use the lane already established in `docs/presentation-qa-baseline.md`:

1. Fetch current `main` and rebase the workload branch. Inspect incoming changes
   and resolve shared-file conflicts without losing another docket or review.
2. Check declared maintenance sequences on current `main` **and** incoming
   coordinated PRs. Choose an unclaimed sequence for the new, unmerged docket.
   Renumber only that unmerged docket if another branch claims it first.
3. Count actual source after adding every incoming docket, including nested
   records. Update only stale `Count:` lines and justified README totals.
   No blind increment, allocator, or parallel trunk edits.
4. Run `python3 scripts/check_collection_counts.py`, then
   `./bin/validate_graph.sh` after conflict resolution. If `main` moves, repeat.
   Require independent review and passing `validate`, `publish-export`, and
   aggregate `ci` checks before merge.

The new count check reads the working source tree, so a new uncommitted docket
is counted. It checks the ten collection declarations and README totals. It
does not parse Boris identities, validate graph semantics, prove reading, or
rewrite files; Boris remains the graph authority. #610's scope/preservation
validator, baseline usage, and CI wiring are deliberately untouched.

## Reproduction and validation

Run from the repository root:

```sh
python3 scripts/check_collection_counts.py
python3 scripts/test_collection_counts.py
git diff --stat b7dcbb54^1 b7dcbb54 -- content/aphorisms/
git diff --name-status --no-renames d78d8f31^1 d78d8f31 -- content/aphorisms/
git diff 127f857a^1 127f857a -- content/changelog/2026-10-06-editorial-emphasis-pass-limericks-03.md
git ls-tree -r --name-only 8997eebe -- content/
git diff --check
./bin/validate_graph.sh
```

The evidence-table regressions compare each merge's exact poetry-change set
with its first-parent diff and keep every historical reading value unknown.
Historical Git verification explicitly skips if those objects are unavailable
in a shallow checkout; it must run with full history for acceptance.

Executed local validation:

| Command | Outcome |
|---|---|
| `./scripts/ensure-boris.sh` | Initially failed: no local compiler available. |
| `./scripts/ensure-boris.sh --provision` | Provisioned pinned Boris `07dc0d3cc101d86682ec92e06ba00edef9d90c75` using Zig 0.16.0. |
| `python3 scripts/test_collection_counts.py` | 11 tests passed; no skips, including full-history coverage comparison. |
| `python3 scripts/check_collection_counts.py` | All ten collection counts and README totals passed: 2,269 pages / 11 trunks / 2,258 satellites. |
| `./bin/validate_graph.sh` | Graph diagnostics, local Markdown links, full Cantilever build, verse residue, zero duplicate HTML IDs, and byte-for-byte publication certification passed. |
| `git diff --check` | Passed, no whitespace errors. |
| `git ls-remote origin refs/heads/main` | Still `0075e8f055a4c5f3ebb97f467b3521405a6cb66e` at finalization. |

Compiled-article DOM checks used the existing embedded preview tab, file URLs
under `dist/cantilever/`, and `agent-browser` navigation, viewport, and evaluation
commands. Checked `/aphorisms.html`, `/changelog.html`, `/haikus.html`,
`/limericks.html`, `/lorelog.html`,
`/changelog/2026-10-06-presentation-qa-reconciliation.html`, and deliberately
unchanged `/reference.html` at **1440×900** and **390×844**. Correct counts and
headings rendered; trunks stayed plain; the docket retained only its metadata
label emphasis. No horizontal overflow or unresolved in-page anchor was found.
No poetry layout was changed. The initial stale tab binding and blocked
new-tab operation were recovered by selecting the existing blank preview tab.
No screenshot-based visual review is claimed.

No open #610/guardrails PR was returned by the scoped incoming-PR check at
finalization; its unpublished work is unknown and still requires coordination.
Remote CI and independent review remain merge gates, not claims this local
report can supply. No PR was published or issue closed by this local task,
and no pilot approval is implied.
