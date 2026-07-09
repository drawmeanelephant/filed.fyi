---
Title: Routine - Containment Breach Audit
Author: Antigravity
Date: 2026-06-19
---

# Routine: Containment Breach Audit

**Goal:** Ensure that the specific constraints regarding "Bin 8C" and "Breeding Program" containment are strictly observed across the archive, preventing thematic contamination.

## Task Details
1. Search the codebase for references to "Bin 8C", "MA8C", "breeding governance", "labor refusal", etc.
2. Verify each reference against the rules defined in `rules.md`:
   - Bin 8C/MA8C is ONLY allowed for: self-indexing, interpretive custody drift, hazardous intentional misfiling, or cluster-level presence.
   - Breeding Program is ONLY allowed for: refuge classification, labor refusal, gratitude alignment, or consent-loop persistence.
3. If a record uses these terms purely for "shared mood" or "affectionate self-reference", edit the phrasing to remove the thematic contamination while preserving the record's primary intent.
4. Log any contained breaches in `.jules/notes/containment-log.md`.
5. Add a short entry to `.jules/index.md`.

## Boundaries
- Do not delete files; only surgically alter the language violating the containment protocol.
- Do not sanitize legitimate, rule-abiding references to these topics.

## Verification
- Review the edited file to ensure it still reads in the correct institutional voice without relying on the forbidden jurisdictional terms.

## Commit
Use: `🗂️ Index: containment audit on [files]`
