# Changelog Convention — Maintenance Docket

This document describes the maintenance docket format used in `/changelog/`.

---

## Purpose

The `/changelog/` collection records completed small editorial and structural interventions against the archive. It is not a release log, a roadmap, or a task-management system.

`/releases/` records archive-state declarations and classification maturity.
`/changelog/` records what was actually done.

---

## Maintenance Identifier Format

```
0.1.NNNNN.task-slug
```

Example: `0.1.00324.sora-excision`

This is a maintenance docket identifier. It is not SemVer. It is not a release number. It does not imply version semantics.

NNNNN increments from 00001. Gaps are acceptable. Do not renumber existing entries for cosmetic consistency.

---

## Filename Convention

Files are named with a date prefix (consistent with the existing CHG-0001 naming pattern):

```
content/changelog/2026-08-07-docket-convention.md
content/changelog/2026-09-15-next-task-slug.md
```

The maintenance docket identifier (`0.1.NNNNN.task-slug`) lives in the entry body, not the filename. The Boris `id` field uses the standard collection form: `changelog/CHG-NNNN`.

New files must sort after `2026-04-22-init.md` to receive the correct CHG number from the ID allocator. Date-prefixed filenames satisfy this automatically for dates after 2026-04-22.

---

## Frontmatter

Standard Boris closed schema. No new keys.

```yaml
---
title: "Short descriptive title"
id: changelog/CHG-NNNN
parent: changelog
status: published
tags: ["changelog", ...]
---
```

Date, maintenance ID, and scope are body text, not YAML keys.

---

## Entry Shape

Each entry should contain approximately:

- **Maintenance ID** — the `0.1.NNNNN.task-slug` identifier
- **Date** — ISO 8601, YYYY-MM-DD
- **Scope** — collection(s) or path(s) affected
- **What changed** — concrete description of what was done
- **What was deliberately left alone** — what was explicitly not touched and why
- **Verification performed** — validation commands run and their outcomes
- **Unresolved follow-up** — anything discovered but not addressed (optional)

Keep entries short. One maintenance task, one record.

---

## Tone

Write like a records officer documenting maintenance because someone eventually asked.

Dry humor is welcome when it emerges naturally from the work.

**Acceptable:**
> Removed six image-generation presets. None were believed to be load-bearing.

> Duplicate heading removed. The underlying contradiction remains available.

**Not acceptable:**
> Enhanced coherence across the archive ecosystem.

> Leveraged best practices to comprehensively optimize the content surface.

---

## Trunk Count

Update the `Count:` line in `content/changelog.md` when adding a new entry. The count must be accurate at the time of the commit. A knowingly wrong count is not acceptable.

---

## Relationship to Releases

Maintenance docket entries do not constitute releases. A release in `/releases/` records classification maturity and archive-state declarations — not individual file edits.

A series of maintenance tasks may eventually inform a release declaration, but this connection is never automatic or required.
