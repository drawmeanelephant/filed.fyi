---
title: "Issue Follow-Ups: Crosslinks, Frontpage, and Host Files"
parent: changelog
status: published
tags: ["changelog", "lorelog", "frontpage", "publishing"]
---

# Issue Follow-Ups: Crosslinks, Frontpage, and Host Files

**Maintenance ID:** 0.1.00030.issue-followups
**Date:** 2026-09-29
**Scope:** lorelog relations, `content/index.md`, Cantilever, Boris build pin

## What changed

- Added the requested navigation, DOGE-origin, MA/8C, Hygiene 7-B, and metrics-theatre relations for issues #563, #565, #568, and #572.
- Reworked the frontpage around a short archive description, a curated Recent entries list, and the collection index; no aphorism feed was added.
- Pinned Boris to `07dc0d3cc101d86682ec92e06ba00edef9d90c75`, which includes the static HTML rebuild and proof-pack schema fixes.
- Passed `themes/cantilever/hosting/` to Boris with `--static-dir` so `404.html` and `robots.txt` enter the certified artifact inventory. Removed the post-certification copy step.
- Updated the theme notes and the prior frontpage docket to describe the certified static-file path.

## What was deliberately left alone

- No issues were closed or changed remotely.
- No Boris source or hosted deployment configuration was changed.
- No dynamic recent-entry generator was introduced; the frontpage list remains editorially curated.

## Verification performed

- `./bin/validate_graph.sh` with Boris `07dc0d3cc101d86682ec92e06ba00edef9d90c75`: graph diagnostics passed; 2,246 source pages compiled; verse-residue check passed; HTML ID audit found zero duplicates; publication certification passed.
- The final full-build comparison against Boris `4a1ff01c`: 2,273 files before and 2,274 after; one added docket page, no removed files, and 24 changed files. Changes were limited to the intended content, page, search, sitemap, and proof artifacts.
- The static-file inventory contained exactly one `404.html` and one `robots.txt`, both committed as `static-file` artifacts from `static-files`.
- Seven of eight `scripts/test_*.py` suites passed. `scripts/test_content_audit_policy.py` fails its two committed-artifact freshness checks. This change does not modify its poetry-ownership inputs.

## Unresolved follow-up

- Regenerate the committed content-audit policy metadata in a separate change, then rerun `scripts/test_content_audit_policy.py`.
