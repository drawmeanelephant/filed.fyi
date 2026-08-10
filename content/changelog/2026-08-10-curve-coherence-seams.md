---
title: "Curve-Coherence Seam Cohort Filed"
parent: changelog
status: published
tags: ["changelog", "curve-coherence-capitalism", "empathegy", "seam-survey", "relations", "boris"]
---

# Curve-Coherence Seam Cohort Filed

**Maintenance ID:** 0.1.00026.curve-coherence-seams
**Date:** 2026-08-10
**Scope:** lorelog, mascots, reference, haikus, limericks, themes/cantilever, metadata/

---

## What changed

- Added **LLG-0450-SEAMS-PRESENT-TENSE** (ten-seam survey of the dystopian present) and **LLG-0451-JIGGLER-EMPATHEGY-BRIDGE** (jiggler economics ↔ Empathegy curve-coherence) to the lorelog.
- Added **FREF-0900-CCC** (Curve-Coherence Capitalism) as governing doctrine in the reference layer.
- Added eleven seam mascots — **M-0436 Jiggler Jimmy through M-0446 Climate Cliff** — one failure signature per seam, with embedded aphorisms, haiku logs, and limerick logs.
- Added fourteen haiku and fourteen limerick companion records, including the archive's first mascot limerick companions (previously 0% coverage), mirroring the verse embedded in each record.
- **First corpus-wide use of Boris `relations`:** every new record declares semantic edges (survey ↔ bridge ↔ doctrine ↔ canon like LLG-0811-EG, FREF-0430-EASP, LLG-0387-SURV-NOP, M-0226), and poetry companions relate to their subjects. Backlinks are derived, not authored.
- Wired the new Boris **`{{relations}}` / `{{backlinks}}` layout slots** into `themes/cantilever` (main + compact) and styled the emitted `semantic-relation--<kind>` lists.
- Bumped the Boris compiler pin to `eb496442c6f2` (relations limit 16 → 128, open kind grammar, HTML relation slots) and rebuilt `bin/boris`.

## What was deliberately left alone

- The seam cohort was renumbered to **436–446** because the artifact numbering (285–295) collided with existing mascots; existing IDs were untouched.
- No new frontmatter keys were introduced. The 35 curve-coherence aphorisms were distributed as embedded "Related Aphorisms" sections only; no standalone APH records were minted.
- The other three themes (`corp-vendor`, `cozy-typepad`, `google-material`) were not touched; only the production Cantilever layout gained relation slots.
- Relation edges stay sparse (`relates_to` only) per archival restraint; no synthetic kinds were introduced despite the compiler's new open kind grammar.

## Verification performed

- `./bin/validate_graph.sh` passed with no errors after the compiler pin bump (baseline) and again with the full cohort in place.
- Boris graph diagnostics confirmed all relation targets resolve; no `ERELATIONMISSING` findings.
- HTML output inspected: `{{relations}}` and `{{backlinks}}` render on relation-bearing pages; pages without relations emit an empty (hidden) section.

## Unresolved follow-up

- The remaining three themes could gain relation slots if the archive ever needs them; the corpus-wide adoption of `relations` on legacy records (and its backlink payoff) is a candidate for a future maintenance pass.
- A release declaration (`releases/v0.1.3-curve-coherence`) remains available if the maintainers wish to record the doctrine's classification maturity.
