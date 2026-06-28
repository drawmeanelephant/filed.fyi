---
title: Reference Backlink Pass Audit
description: A structured defect list identifying docs/reference pages linked from lorelog entries that lack reciprocal backlinks, along with malformed links and misclassifications.
date: 2026-06-15
versionLabel: audit-report
tags:
  - reference
  - audit
  - backlinks
---

## Defect List: Reference Backlink Pass

### Category: Missing Backlinks
The following docs/reference pages are linked from lorelog entries, but lack reciprocal links in their `relatedLorelog` arrays:

- **Reference:** `fref-0260-bmdh` (linked from `LLG-0399-OCS`)
- **Reference:** `fref-0290-ocvh` (linked from `LLG-0399-OCS`, `OCV-0409-TSC`)

### Category: Malformed Link IDs
The following lorelogs contain links with an unnecessary `reference/` path prefix instead of just the ID:

- **Lorelog:** `LLG-0408-DTS-DEP` (contains `reference/fref-0070-aopt`, `reference/fref-0815-map`, `reference/fref-0823-tsrt`, `reference/fref-0825-vhcn`)
- **Lorelog:** `LLG-0409-IEL` (contains `reference/fref-0070-aopt`, `reference/fref-0823-tsrt`, `reference/fref-0824-ovaa`)
- **Lorelog:** `LLG-0410-BWS` (contains `reference/fref-0823-tsrt`, `reference/fref-0825-vhcn`, `reference/fref-0826-tsin`)
- **Lorelog:** `LLG-0411-RRC` (contains `reference/fref-0823-tsrt`, `reference/fref-0825-vhcn`, `reference/fref-0826-tsin`)
- **Lorelog:** `LLG-0414-WAD` (contains `reference/fref-0840-rwrr`)
- **Lorelog:** `LLG-0422-SCP` (contains `reference/fref-0840-rwrr`)
- **Lorelog:** `LLG-0427-RAC` (contains `reference/fref-0840-rwrr`)
- **Lorelog:** `LLG-0430-HBR` (contains `reference/fref-0840-rwrr`)
- **Lorelog:** `LLG-0441-TSR` (contains `reference/fref-0840-rwrr`)
- **Lorelog:** `OCV-0409-TSC` (contains `reference/fref-0290-ocvh`)

### Category: Misclassified Collection Links
The following lorelogs link to other lorelogs but incorrectly classify them under the `docs` collection:

- **Lorelog:** `LLG-0382-BPD` (links to `credits-gta` as `docs`, but it is a lorelog file `LLG-CREDITS-GTA.mdx`)
- **Lorelog:** `LLG-0385-CEB` (links to `ds-404-alpha` as `docs`, but it is a lorelog file `DS-404-ALPHA.mdx`)
- **Lorelog:** `LLG-SYS-8-REINDEX-01` (links to `LLG-MA-8C-PEPPY-01` as `docs`, but it is a lorelog file `LLG-MA-8C-PEPPY-01.mdx`)

### Category: Unresolved References
The following lorelogs link to reference IDs that do not match the expected filename slug format:

- **Lorelog:** `LLG-0410-BWS`, `LLG-0411-RRC` -> Reference ID: `fref-0826-tsin` (This refers to `trust-surface-index-note.mdx` which has caseNumber FREF-0826-TSIN)
