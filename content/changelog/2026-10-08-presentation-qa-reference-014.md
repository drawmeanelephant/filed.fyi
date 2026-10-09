---
title: "Presentation QA Reference 014: Read-First Review of Seven Records"
parent: changelog
status: published
tags: ["changelog", "reference", "presentation-qa"]
---

# Presentation QA Reference 014: Read-First Review of Seven Records

**Maintenance ID:** 0.1.00216.reference-014
**Date:** 2026-10-08
**Scope:** the seven `reference` records assigned by workload issue #785 — `forms/fref-0020-maps.md`, `forms/fref-0860-dexe.md`, `forms/fref-0870-qthr.md`, `fref-0030-avsg.md`, `fref-0040-avdn.md`, `fref-0050-avoc.md`, `fref-0060-acmn.md`

## What changed

- Read all seven assigned records in full, frontmatter through final line, including the Related Aphorisms/Haikus/Limericks residue appended to each.
- `forms/fref-0020-maps.md` line 11: bolded "nobody is prepared to call it missing" — the pivot clause of the doctrine definition, the moment absence becomes managed. Asterisks only.
- `forms/fref-0860-dexe.md` line 18: bolded "crossed into visible uptake while its execution basis has partially or fully withdrawn" — the fourth line of Core distinction, the only one that names the condition; the first three are foils. Asterisks only.
- `forms/fref-0870-qthr.md` line 17: bolded "operationally persuasive after it has ceased being operationally trustworthy" — the record's own Foundational rule. Asterisks only.
- `fref-0050-avoc.md` line 18: bolded "to prevent linguistic collisions between tools that already prefer calm" — the purpose statement's operative half, after the "not to falsify" foil. Asterisks only.
- `content/changelog.md`: trunk count incremented to match source after this docket.

## What was deliberately left alone

- All frontmatter, canonical IDs, tags, headings, `{#...}` anchors, tables, code spans, `:::note` containers, and quoted/documentary material.
- `fref-0030-avsg.md` — unchanged. Already carries eighteen bold spans (principle labels, phrasebook terms, addendum); existing emphasis is not permission to add more.
- `fref-0040-avdn.md` — unchanged. Fragmentary internal notes; the loose structure is the voice, and no sentence earns a pivot.
- `fref-0060-acmn.md` — unchanged. Extracted minutes; existing italics already mark the contested terms, and the dry one-line closers carry the record.
- All verse hard breaks, stanza spacing, and the blank-line-heavy residue blocks in every Related section. The post-snapshot hard-break restoration in the three `forms/` records (issue #824 work) was verified present and left byte-identical.
- Corpus residue observed and preserved: empty Related Haikus sections in `fref-0860-dexe.md` and `fref-0870-qthr.md`; `:::note` addendum containers (29 corpus files, including two assigned records); orphaned verse fragments after the addenda in `fref-0040-avdn.md` lines 50–54 and `fref-0050-avoc.md` lines 106–110; the divergent managed-absence acronym expansions between `fref-0020-maps.md` and `fref-0150-mapa.md` (inter-record contradiction, not a defect).

## Verification performed

- `git diff 8997eebee2a4e620c5dd47fcea97abf515c4cac6 HEAD` on all seven assigned paths: the three `forms/` records gained verse hard breaks since the snapshot (disclosed; preserved exactly); the other four are unchanged since snapshot.
- `BORIS_BIN=/Users/tbuddy/dev/filed.fyi/bin/boris ./bin/validate_graph.sh` passed.
- `python3 scripts/check_collection_counts.py` passed.
- Compiled-HTML check: each changed record's page gained exactly one `<strong>` pair; no stray asterisks; verse `<br />` breaks intact.

## Unresolved follow-up

- None flagged `needs decision`; all anomalies observed matched corpus-wide residue patterns.
