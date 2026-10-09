---
title: "Needs-decision disposition: bounded defect repairs, ruled residue, 46 issues cleared"
parent: changelog
status: published
tags: ["changelog", "presentation-qa", "maintenance", "disposition"]
---

# Needs-decision disposition: bounded defect repairs, ruled residue, 46 issues cleared

**Maintenance ID:** 0.1.00245.needs-decision-disposition
**Date:** 2026-10-09
**Scope:** all open `needs decision` flags carried under the #833 umbrella — 46 review issues across `content/limericks/`, `content/lorelog/`, `content/mascots/`, `content/aphorisms/`, and `content/reference/`

This docket adjudicates every outstanding `needs decision` flag from the archive-wide presentation-QA pass. The maintainer direction was to close the backlog — fixing the unambiguous subset under a slightly expanded scope and ruling the rest as sanctioned archival residue. Three classes of edit were applied; everything else is explicitly waived below.

## What changed

### 1. Verse hard breaks — mascot and residue regions (extends the #824 convention)

The `fix_verse_hard_breaks.py` contract covered `limericks/`, `haikus/`, and `## Related *` residue regions only. Workers repeatedly flagged mascot-internal verse that compiles run-on while sibling records render `<br>` per line. Scope extended to flagged regions in mascot `## Haiku`/`## Haiku Records`/`## Haiku Log`, `## Limerick Log`-family sections, and `>`-quoted verse — additive two-space breaks on non-final stanza lines only, plus blank-line/`>` separators where stanzas were fused:

- `005.bricky-goldbricksworth.md` — Ceremonial Limericks blockquote (2 fused stanzas separated, breaks added), Bricky Roast Queue (4 merged quotes), 11 Haiku Log stanzas, 8 Limerick Log stanza groups (issues #729).
- `006.cass-d-failure.md` — `### RoboShirker` section, 6 stanzas (#730).
- `008.cssandra-cascade.md` — `## Haiku` (6 stanzas, `***`-separated), Council Limericks blockquote (6 stanzas) (#730).
- `011.formee-formeson.md` — 4 Supersession Reflection Loop stanzas (#731).
- `014.htmlie-structura.md` — Haiku Records stanza (#731).
- `039.patchy-mxcli.md` — Council + Archived Limericks blockquotes (12 stanzas), Haiku 3 (#737).
- `041.reboota-thrice.md` — Haiku Records stanza (#737).
- `045.strutter-crashley.md` — 4 residue verse sections incl. embedded `>` quote lines (#738).
- `046.svgon-the-line.md` — Haiku Records stanza; Quote Fragments blockquote (5 quotes) with `_Filed under:` tagline detached onto its own line/paragraph (#738).
- `048.twiggy-snipsnark.md` — 4 fused stanzas separated and broken (#738).
- `211.apex-goldbricker.md` — Ceremonial Limericks blockquote (2 stanzas) + Limerick Log (5 stanzas) (#746).
- `325.peppy-clerk.md` — stub-limerick log, 10 stanzas (#761).
- `400.bad-request-bob.md` — final 3 stanzas (#762).
- `403.htaccessius-the-doorman.md` — 2 fused stanzas separated (#762).
- `405.method-not-allowed-mel.md` — 4 stanzas (#763).
- `503.servicey-unavailabelle.md` — Haiku Records stanza (#768).
- `023.modrewrite-gremblin.md` — `📜 Limerick Log` 2 fused stanzas separated (#734).

### 2. Word-level defects (unambiguous, individually verified)

- Mid-line `\` artifacts — the residue of a lost line break inside limerick verse, rendering literally. Split at the backslash into the two intended verse lines (hard break on the first, stanza-final tail preserved) at `LLG-0356:157`, `LLG-0358:108`, `LLG-0365:101`, `LLG-0365:124`, and the verbatim mirrors `LIM-LLG-0356:63`, `LIM-LLG-0358:23`, `LIM-LLG-0365:23`, `LIM-LLG-0365:46`, `019.kindy-mcexistentialcrisis.md` ×4 (#708, #709).
- `Offormat` → `Of format` — `LLG-0367-BAIT-B3A.md` limerick line (#710).
- `corrrelated` → `correlated` — `LLG-0833-GTA.md:15` (#722).
- `relatedLorelog` → `related Lorelog` — flattened reference token in prose, 9 mascot records: `005`, `019`, `050`, `065`, `070`, `072`, `226`, `301`, `404` (#748, #757, #763).
- `the truths subordinate placement` → `the truth's subordinate placement` — `fref-0540-anxt.md` (#774).
- `the systems ability` → `the system's ability` — `fref-0560-asar.md` (the record's own aphorism layer preserves the apostrophe) (#774).
- `We received the complain,` → `complaint,` — `fref-0550-apan.md` (#774).
- `The Registers purpose` → `The Register's purpose` — `fref-0610-cthr.md` (#776).

### 3. Punctuation and structure normalization

- `?.` → `?` — doubled terminal punctuation on question-form aphorisms, corpus-wide generation artifact. 13 sites: `LLG-0387`, `LLG-0820-MCR`, `LLG-0389-AKL`, `DS-404-ALPHA`, `LLG-0390-KCL`, `LLG-0379-ROBOT-MEMO`, the six verbatim `APH-*` mirrors, and `041.reboota-thrice.md` (#712, #713).
- Lone curly quotes normalized to each file's majority style: `’`→`'` in `lim-fref-0200-cbac:46`, `lim-fref-0300-clob:37`, `lim-fref-0370-dcst:72`, `lim-fref-0420-ancl:44`, `lim-lc-04:41`, `LLG-0392-RCS:164`, `LIM-LLG-0392-RCS:56`, and `lim-updatey-delaybot` (apostrophes :76/:85 plus `“soon,”`→`"soon,"` :86); mirror case `'`→`’` for `protocol's` in `lim-variance-pastor:53` (#687, #690, #697, #713).
- `*Kindy:_` → `_Kindy:_` — mixed emphasis delimiters rendering literally; matches the sibling `_Bricky:_` line (`021.markie-d-down.md`) (#734).
- Stray unmatched `*` removed — `060.courier-rat.md` `Undelivered,*"` inside the quoted limerick (#740).
- Setext-heading artifact: blank line inserted before the terminal `---` rule in `LLG-0389-AKL`, `LLG-0390-HAP`, `LLG-0391-RCD`, `LLG-0392-SGL` — the closing sentence was compiling as an `<h2>` instead of `paragraph + <hr>`; matches the `LLG-0380`/`LLG-0399` convention (#713).
- Orphaned `RelatedEntries` bare tokens deleted — `LLG-0446-OQF:61`, `LLG-0447-SLA:67`; they compiled as stray apparatus paragraphs (#719, carried on #944).

## Ruled as sanctioned residue — waived, no edit

These classes are deliberate archival character, collection-level conventions, or defects a presentation pass cannot repair without inventing words. Each was flagged by a worker and is now waived:

- **Ingest-era emphasis density/saturation** — `lim-formee-formeson`, `lim-jay-skript`, `lim-moveda-permanently`, `lim-unanswered-knock`, `lim-zooki-lockjaw`, `lim-strutter-crashley` (56 bolds + the `(**No it doesn't.**)` in-verse aside), `lim-melody-errorflood`, `LLG-0383-RAW` and its `068.veritas-rituallis.md` mirror, `024.moveda-permanently.md`, `042.robots-dot-txt.md`. Existing emphasis is not rebalanced.
- **Irreparable word-level residue** — word gaps in `lim-kindy-mcexistentialcrisis` L118–119 (redaction-as-residue), truncated `companionship-regime sub.` (`226`), truncated `…sometimes mak` (`fref-0580-cmps:145`), `went silent and stoke` (`lim-the-half-held-breath:53`), `codebase *erode*` verb strain, the fused sentence at `LLG-0833-GTA:24–25`, `Appeared excessive than real` (`LLG-0846-SIP:237`), verbatim duplicated aphorisms (`014`) and the repeated-couplet 8-line stanza (`015`). Preserved; any repair needs authored wording.
- **Collection-level conventions** — the stat-block run-on convention (74–111 mascot records; dominant form), unbolded/bare-text stat lines in the `424`/`429`/`431`/`451` minority, orphaned one-item stat bullets (`016`, `018`, `042`, `044`, `408`, `409` et al.), `>`-blockquote testimony layout where unflagged, indented-limerick conventions (`301` B-lines, `229`, `006:303–304`), `### Limerick N` flat-paragraph layout (`418.teapotta-protocol`), dual punctuated/unpunctuated limerick batches (`313`–`317`, `319`), stanza-final break inconsistency, `***` haiku separators, mid-word enjambments, empty residue headings, `NOTE TO POST-SINGULARITY REVIEW BOARD` 4-space block (`039`), `058.yamteams` mixed-markup stat region.
- **Structural/first-use declines** — first `<Details>` annex proposed for `LLG-0338-SBI` declined (no precedent, annex is on-theme); `LLG-08xx-EPS:58` margin note left plain (ambiguous quote/narration boundary); `lim-yamteams` curly-quote stretch L129–200 kept as register drift.
- **Frontmatter/tagging** — `profane`-tag candidacy for `lim-witness-felt`, `lim-whistlin-winstinct`, `lim-winona-crashington`: frontmatter is protected; recorded here for the maintainer's tagging discretion, not edited.
- **Informational notes, no action** — `GEX-2R` (no canonical ID), `LLG-0000-NULL` (no record in graph), stanza-gap runs, and pass-2 sequencing notes.

## Issues cleared by this docket

Fixed or verified-complete: #687, #690, #691, #707, #708, #709, #710, #712, #713, #719, #722 (typo fixed; two residue flags waived), #729, #730, #731, #734, #737, #738, #740, #746, #748, #757, #761, #762, #763, #768, #774, #776, #790, #936, #940, #942, #943, #944.
Waived as residue/convention: #686, #692, #696, #697 (2 of 3 fixed), #698, #732, #741, #765, #766, #775, #938, #946; the waived items inside #690/#697/#722/#748/#757/#763 are also covered above.
The #833 umbrella remains open as the standing tracker; every leaf flag it carried is now resolved or waived.

## What was deliberately left alone

All frontmatter, canonical IDs, tags, relations, titles, `{#…}` anchors, and every record not named above. No emphasis was added or removed anywhere. All edits are whitespace-only verse breaks, the twelve `\` splits, the bounded word fixes listed, punctuation normalization, the `---` blank lines, the `_Filed under` detach, and the two `RelatedEntries` token removals.

## Verification performed

- `python3 scripts/check_collection_counts.py` — PASS; `content/changelog.md` `Count:` and README totals recounted to actuals.
- `BORIS_BIN=<local> ./bin/validate_graph.sh` — passed: count census, verse-residue check, Boris graph diagnostics, full Cantilever compile, HTML ID audit, Filed certification.
- Compiled-article spot checks on `dist/cantilever/`: verse `<br>` structure restored in the repaired regions; `Offormat`/`relatedLorelog`/`?.`/`RelatedEntries` fixes render as intended; no literal `*` or `\` leakage.
