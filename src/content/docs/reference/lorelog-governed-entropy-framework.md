---
title: Lorelog Governed Entropy Framework
description: Future-state reference for keeping lorelog entries increasingly entangled without flattening their archival decay.
---

The lorelog is a self-indexing bureaucratic decay field, not a correctness-oriented database.

This framework governs future edits, new entries, and explicit graph repair. It does not authorize a full retrospective cleanup.

## Structural model

- Prefer exact existing file stems in `relatedEntries`.
- Preserve legacy drift when it is already canon and not actively obstructive.
- Treat malformed historical references as archival residue unless a touched file needs repair.

## Soft shape for touched entries

- Aim for one precedent anchor when a meaningful precedent exists.
- Aim for one sibling or cluster relation when the entry belongs to a visible class.
- Allow zero or one future echo when absence is part of the filing's logic.

Sparse records remain valid. Infra-rot and orphan-class entries may keep only one resolvable relation.

## Hard anchors

- Directive-conflict entries should retain a link to `LLG-0300-SC-X` or `LLG-0330-TDE`.
- Classification-rot and managed-absence entries should retain a link to `LLG-0318-SRO`.
- Infra-rot entries should preserve at least minimal local coherence with nearby navigation, schema, or freshness failures.

## Mascot posture

- `mascotRef` remains the primary mascot field.
- Mascots act first as jurisdictional witnesses.
- They may also behave as contradictory certifiers, interpretive filters, memory artifacts, or audit residue.
- Do not enforce one mascot to one stable function.

Mascot consistency matters at system level more than at sentence level.

## Tag posture

- Prefer four or five tags on new or intentionally revised entries.
- Allow singleton tags when they read as emergent, unstable, or not yet absorbed into a larger class.
- Consolidate only when the change materially improves cluster legibility.

## Repair threshold

Perform graph repair only when one of the following is true:

- the file is already being intentionally edited
- a supposedly resolvable reference is broken
- a hub or anchor entry has become too thin to support nearby filings

When repairing, prefer swapping or adding one or two `relatedEntries` over rewriting prose.
