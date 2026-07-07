---
title: "HTML Build Output Audit"
date: 2026-07-07
updatedAt: 2026-07-07
total_files_audited: 596
duplicate_failures_count: 0
broken_links_count: 11
object_leaks_count: 0
---

# HTML Build Output Audit Report

This audit traverses the compiled HTML files in `dist/` to ensure structural integrity and check for output leakage or ghost routing.

## Summary

| Metric | Count | Status |
|--------|-------|--------|
| Total HTML files audited | 596 | — |
| Duplicate Poem Wrapper IDs | 0 | ✅ PASS |
| Object Leaks (`[object Object]`) | 0 | ✅ PASS |
| Broken Local Links / Ghost Routing | 11 | 🔴 FAIL |

---

## 🔴 Duplicate Loop Failures

No duplicate poem IDs found.

## 🔴 Truncation Leak Failures (`[object Object]` Leaks)

No leaked object tokens found.

## 🔴 Ghost Routing / Broken Links Failures

| Source Page | Linked Route | Resolved Path Checked |
|-------------|--------------|------------------------|
| `guides/gratitude-drift/index.html` | `/mascots/233.gratitude-latch` | `mascots/233.gratitude-latch` |
| `guides/gratitude-drift/index.html` | `/mascots/246.thankyou-ash` | `mascots/246.thankyou-ash` |
| `guides/gratitude-drift/index.html` | `/mascots/283.aftercare-vellum` | `mascots/283.aftercare-vellum` |
| `guides/managed-absence-and-forms/index.html` | `/mascots/422.form-sister-pale` | `mascots/422.form-sister-pale` |
| `guides/managed-absence-and-forms/index.html` | `/mascots/011.formee-formeson` | `mascots/011.formee-formeson` |
| `guides/managed-absence-and-forms/index.html` | `/mascots/410.vacancy-notice` | `mascots/410.vacancy-notice` |
| `guides/mascot-containment-and-breeding/index.html` | `/mascots/061.parvovirus-p` | `mascots/061.parvovirus-p` |
| `guides/mascot-containment-and-breeding/index.html` | `/mascots/248.attestation-mole` | `mascots/248.attestation-mole` |
| `guides/mascot-containment-and-breeding/index.html` | `/mascots/208.og-kushkeeper` | `mascots/208.og-kushkeeper` |
| `reference/fref-0030-avsg/index.html` | `/mascots/013.htaccessius-the-doorman` | `mascots/013.htaccessius-the-doorman` |
| `reference/fref-0120-dcsc/index.html` | `/mascots/027.comrade-kernelov` | `mascots/027.comrade-kernelov` |

