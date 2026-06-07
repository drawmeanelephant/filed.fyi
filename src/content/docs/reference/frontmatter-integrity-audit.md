---
title: Frontmatter Integrity Audit
description: Observational dashboard tracking schema rot, metadata collapse, and tag fragmentation across the archive.
date: 2026-06-07
tags:
  - reference
  - audit
  - integrity
  - schema-rot
---

# Frontmatter Integrity Audit

This report tracks the physical degradation of the archive's metadata. As automated maintenance scripts process the archive, they occasionally leave behind schema rot—empty arrays collapsing into null vectors, or multiline strings fracturing into orphaned tag fragments.

We do not correct these. We observe them as geological formations of institutional decay.

## Null Vectors

Arrays that have collapsed and now explicitly contain `null`.

| File | Field | Status |
|---|---|---|
| `008.cssandra-cascade.mdx` | `knownFailures` | Collapsed |
| `008.cssandra-cascade.mdx` | `ceremonialTasks` | Collapsed |
| `009.draft-file-derrick.mdx` | `knownFailures` | Collapsed |
| `009.draft-file-derrick.mdx` | `ceremonialTasks` | Collapsed |
| `014.htmlie-structura.mdx` | `knownFailures` | Collapsed |
| `014.htmlie-structura.mdx` | `ceremonialTasks` | Collapsed |
| `025.ami-ghostbyte.mdx` | `knownFailures` | Collapsed |
| `025.ami-ghostbyte.mdx` | `ceremonialTasks` | Collapsed |
| `027.comrade-kernelov.mdx` | `knownFailures` | Collapsed |
| `027.comrade-kernelov.mdx` | `ceremonialTasks` | Collapsed |
| `028.genny-compileheart.mdx` | `knownFailures` | Collapsed |
| `028.genny-compileheart.mdx` | `ceremonialTasks` | Collapsed |
| `029.haikool-breeze.mdx` | `knownFailures` | Collapsed |
| `029.haikool-breeze.mdx` | `ceremonialTasks` | Collapsed |
| `030.holy-doswell.mdx` | `knownFailures` | Collapsed |
| `030.holy-doswell.mdx` | `ceremonialTasks` | Collapsed |
| `035.tizzy-blinkensync.mdx` | `knownFailures` | Collapsed |
| `035.tizzy-blinkensync.mdx` | `ceremonialTasks` | Collapsed |
| `039.patchy-mxcli.mdx` | `knownFailures` | Collapsed |
| `039.patchy-mxcli.mdx` | `ceremonialTasks` | Collapsed |
| `040.pngbert-flatly.mdx` | `knownFailures` | Collapsed |
| `040.pngbert-flatly.mdx` | `ceremonialTasks` | Collapsed |
| `042.robots-dot-txt.mdx` | `knownFailures` | Collapsed |
| `042.robots-dot-txt.mdx` | `ceremonialTasks` | Collapsed |
| `053.tabby-fields.mdx` | `knownFailures` | Collapsed |
| `053.tabby-fields.mdx` | `ceremonialTasks` | Collapsed |
| `054.hammy-navstack.mdx` | `knownFailures` | Collapsed |
| `054.hammy-navstack.mdx` | `ceremonialTasks` | Collapsed |
| `418.teapotta-protocol.mdx` | `knownFailures` | Collapsed |
| `418.teapotta-protocol.mdx` | `ceremonialTasks` | Collapsed |
| `503.servicey-unavailabelle.mdx` | `knownFailures` | Collapsed |
| `503.servicey-unavailabelle.mdx` | `ceremonialTasks` | Collapsed |


## Tag Fragmentation

Orphaned string fragments and misquoted scalars found trapped in the `tags` array.

| File | Fragment |
|---|---|
| `010.forbiddy-noentry.mdx` | `which she will not share."` |
| `016.jay-skript.mdx` | `catastrophic at scale."` |
| `017.jpegsey-artifactor.mdx` | `slightly out of focus."` |
| `017.jpegsey-artifactor.mdx` | `but present.*"` |
| `018.kafkey-errorhandler.mdx` | `distributed."` |
| `026.bea-crashwell.mdx` | `in front of someone with a working camera."` |
| `042.robots-dot-txt.mdx` | `and then have the crawler leave. This is the correct outcome. It almost never happens."` |
| `042.robots-dot-txt.mdx` | `which Bricky considers either admirable or alarming depending on the day."` |
| `044.spooler-gremlin.mdx` | `conditionally."` |

**Total Structural Anomalies:** 41
