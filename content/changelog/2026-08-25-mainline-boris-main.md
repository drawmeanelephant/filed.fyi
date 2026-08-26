---
title: "Boris Compiler Mainlined off Afterparty"
parent: changelog
status: published
tags: ["changelog", "boris", "publishing", "rag-export", "relationship-integrity", "ci"]
---

# Boris Compiler Mainlined off Afterparty

**Maintenance ID:** 0.1.00028.mainline-boris-main
**Date:** 2026-08-25
**Scope:** metadata, scripts, .github, docs, changelog

---

## What changed

- **Compiler pin moved to Boris main.** `metadata/boris-version.json` now pins `drawmeanelephant/boris` at `4a1ff01c4b6a40f5578f4475c73b65ea6340737d` on `main` (the former `afterparty` branch was merged upstream; the previous pin `eb496442` is its merge base, 710 commits behind). The provisioner fallback default in `scripts/ensure-boris.sh` and the deployment workflow's `BORIS_BRANCH` follow.
- **Publish pipeline adapted to boris-rag schema 2.** Boris's redesigned RAG export emits verbatim working-context packs (`working-N.md` + manifest) and no longer produces derived per-page `related` fields. `scripts/repair_relationships.py` therefore repairs the context bundle only; RAG packs are read-only by design. `scripts/validate_relationships.py` now parses pack documents by their `<!-- boris-rag-doc: ... -->` markers and audits each record's own frontmatter `relations` declarations for verbatim fidelity, document completeness, duplicates, self-links, and malformed values. The old RAG/context target-set disagreement check was retired as meaningless under the new surface split.
- **Integrity semantics restated.** Context remains the provenance-rich projection carrying the full canonical set (recovered pre-migration declarations, legacy `relatedEntries`, resolving Markdown cross-references, current frontmatter relations). RAG packs carry exactly what the source declares — no promotion, no invention.
- **Regression suite rewritten for the new surfaces.** `scripts/test_relationship_repair.py` now covers context-repair idempotency and pack-based parity (missing relation from a pack copy, missing record from packs entirely, unexpected pack edges, duplicate document occurrences, surface counts).
- **Local build helper renamed.** `scripts/build-boris-afterparty.sh` became `scripts/build-boris-main.sh`; its worktree contract and artifact root follow the merged branch.

## What was deliberately left alone

- No content records, IDs, relations edges, or parent assignments were touched. The relationship corpus is byte-identical; only export validation moved.
- `metadata/relationship-map.jsonl`, `metadata/relationship-recovery.json`, and `scripts/recover_relationships.py` are unchanged; the recovery manifest remains the committed ground truth.
- Historical reports that cite specific afterparty-era compiler commits (`reports/content-audit-policy.md`, `reports/literal-newline-haiku-normalization.md`) and `metadata/migration.json` keep their provenance references; they describe past runs, not present configuration.
- The deploy workflow still tracks a branch ref rather than an immutable SHA. Pin-by-branch is the existing pattern; tightening it is recorded as follow-up, not smuggled in here.

## Verification performed

- `./bin/validate_graph.sh` against Boris main `4a1ff01`: graph diagnostics passed; full Cantilever compile succeeded; verse-residue, HTML ID audit, and certification checks passed.
- `./scripts/filed-publish.sh` against the same binary: 1,334 context pages repaired; relationship integrity **PASS — 0 findings**; 2,356 canonical relationships across 1,334 records exported to context; all 70 frontmatter-declared relations verified verbatim across 2,344 pack documents; recovery check PASS; `llms.txt` exported and UTF-8 valid.
- `python3 scripts/test_relationship_repair.py`: 34/34 checks pass.
- `python3 scripts/test_ensure_boris.py`: passes (reads branch/commit from the updated config).

## Unresolved follow-up

- Consider pinning deploy builds to an immutable Boris commit instead of a moving branch head.
- The complete-corpus RAG mode (`--rag --complete`) now exposes `graph/relations.md` and a catalog; whether Filed should publish it alongside working packs remains undecided.

## Provisioning note

The previous pinned commit no longer compiles on hosts without CMake (its ApexMarkdown vendor step requires it); the new pin builds clean with Zig alone. Hosts that had local `eb496442` binaries must re-provision or set `BORIS_BIN`.
