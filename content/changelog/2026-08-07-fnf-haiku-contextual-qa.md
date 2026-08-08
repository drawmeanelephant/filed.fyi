---
title: "Contextual Haiku QA — Detached Generation-Batch Verse Removed"
parent: changelog
status: published
tags: ["changelog", "maintenance", "haikus", "mascots", "lorelog", "reference"]
---

# Contextual Haiku QA — Detached Generation-Batch Verse Removed

**Maintenance ID:** 0.1.00025.fnf-haiku-contextual-qa
**Date:** 2026-08-07
**Scope:** content/mascots (one record), content/reference (two records), content/lorelog (four records), plus their paired haiku satellites under content/haikus/

---

## What changed

Ran a small contextual-quality pass over haiku, using the standard test: if a haiku were silently moved to an unrelated mascot, lorelog, or reference record, would anybody notice? Removed **25 haiku across 7 source records** — the contiguous verse tails that failed the test at high confidence. Each removal was a *whole batch tail*; the topic-grounded haiku at the head of every affected section were left in place.

All 25 removed haiku belonged to one shared generation batch that circulated across unrelated records in near-identical variants. The batch's vocabulary (jurisdiction, scapegoat, sealed ledger, throttle, chassis, thermal, heat) describes machinery, objects, and consequences none of the seven host records ever contain. It was already duplicated in records where the same idiom *is* grounded (see preserved examples below), which is what made the detached copies identifiable.

Per record:

| Record | Haiku removed | Contextual reason |
|--------|--------------|-------------------|
| `mascots/403.htaccessius-the-doorman.md` | 2 | Access-control gatekeeper record (`.htaccess`, `User-Agent`, `RewriteBase`, 403). The two thermal haiku ("Throttle cools the core / chassis rests in cold design…", "Heat is chased away…") describe throttling/chassis/heat machinery the record never mentions. |
| `reference/fref-0840-rwrr.md` | 4 | Replacement-Without-Release doctrine (inherited-basis drift, distributed nonresolution). Batch tail (jurisdiction/scapegoat/ledger, throttle/chassis, blame-routing, heat) has no supporting object or consequence in the doctrine. |
| `reference/fref-0841-rwin.md` | 4 | Replacement-Without-Release index note. Same batch, no supporting content. |
| `lorelog/LLG-0020-COMA19-PBC.md` | 4 | COMA-19 rest-phrasebook record. Batch tail (jurisdiction/scapegoat/ledger, throttle/chassis) unrelated to rest-request language narrowing. |
| `lorelog/LLG-0052-MFX.md` | 4 | Form 51-E meta-feeling exclusion. Batch tail (jurisdiction, chassis, thermal limits, ledger) absent from the record's content. |
| `lorelog/LLG-0115-TNS.md` | 4 | Tone Normalization Sweep. Batch tail (throttle, chassis, thermal systems, scapegoat) absent from the record's content. |
| `lorelog/LLG-0218-FSD.md` | 3 | Form Shadow Doubling. Batch tail (throttle/heated core, blame/jurisdiction/ledger, sealed records) absent from the record's content. |

Each haiku satellite under `content/haikus/` was edited to match its source record's embedded "Related Haikus"/"Haiku Log" section, so no verse record diverges from its host.

## What was deliberately left alone

- **Limericks and aphorisms: untouched.** No limerick or aphorism text was changed anywhere in this pass.
- No haiku was rewritten, re-grounded, or replaced. Where the source offered no evidence to anchor a weak haiku, the poem was removed rather than rescued by invention.
- No haiku *records* were deleted — all seven haiku satellites remain, with their grounded verse intact. The `content/haikus.md` trunk count (563) is unchanged.
- **Preserved after source review — poems that looked generic but are grounded:**
  - Boily McPlaterton's final five haiku (throttle, fans, metal, chassis, melt): preserved. Boily is a thermal-incident mascot; throttle, fan RPM, casing, and meltdown appear throughout his record ("TEMP_SPIKE: escalating to autonomous throttling", "FAN_OVERRIDE_ENGAGED: user response too slow", "The chassis held. Its dignity did not.").
  - Blamey McTypoface's scapegoat/ledger tail: preserved. Scapegoating is his documented function ("SCAPEGOAT_FOUND: signature match confirmed"; "Jurisdictional overlap acknowledged. Scapegoat selection processed").
  - Bricky Goldbricksworth's "Jurisdiction shifts / scapegoat found in margins…" and "Validation ends…" haiku: preserved. The same idiom recurs in the record's own internal verse sections (Rest Phrasebook Narrowed, Shadow Doubling Chain).
  - Kindy McExistentialCrisis's Haiku Log batch: preserved. The record's internal verse sections reuse the throttle/jurisdiction/scapegoat idiom repeatedly; the haiku are consistent with the record's own voice even though the lines are shared with other files.
  - The "Document the truth / The manual stands unchanged / Quiet policy" trio (with "Paper still remains") repeated across the civic reference haiku set: preserved. The collection is deliberately tagged `civic-benevolence` / `procedural-echo`; a shared refrain across a deliberately tagged collection is not high-confidence residue.
- The identical batch verse remains inside `mascots/005.bricky-goldbricksworth.md` and `mascots/019.kindy-mcexistentialcrisis.md` internal sections, and in `hai-004-boily-mcplaterton.md` / `hai-019-kindy-mcexistentialcrisis.md` — records that can ground it. This pass removed only the detached copies.

## Files touched

- `content/mascots/403.htaccessius-the-doorman.md`
- `content/haikus/hai-013-htaccessius-the-doorman.md`
- `content/reference/fref-0840-rwrr.md`
- `content/haikus/hai-fref-0840-rwrr.md`
- `content/reference/fref-0841-rwin.md`
- `content/haikus/hai-fref-0841-rwin.md`
- `content/lorelog/LLG-0020-COMA19-PBC.md`
- `content/haikus/hai-llg-0020-coma19-pbc.md`
- `content/lorelog/LLG-0052-MFX.md`
- `content/haikus/hai-llg-0052-mfx.md`
- `content/lorelog/LLG-0115-TNS.md`
- `content/haikus/hai-llg-0115-tns.md`
- `content/lorelog/LLG-0218-FSD.md`
- `content/haikus/hai-llg-0218-fsd.md`
- `content/changelog.md` — trunk count updated (34 → 35 records)
- `content/changelog/2026-08-07-fnf-haiku-contextual-qa.md` — this record

## Verification performed

- `./bin/validate_graph.sh` passed (Filed graph, form IDs, HTML IDs, and publication checks).
- Residue scan: none of the 25 removed haiku lines remain in the 14 target files (grep exit 1, no matches).
- Seam inspection: each edited verse section now joins its preceding grounded haiku directly to the next section heading with a single blank line; no stray blank runs, no orphaned headings.
- Haiku satellite and source-record embedded sections were verified to match after editing.

## Unresolved follow-up

- None within scope. The grounded copies of the batch verse (Kindy, Bricky, Boily) were reviewed and preserved; no further record showed a high-confidence contextual failure.
