---
title: Tailwind Migration
description: Removal of utility-class residue and transition to a static archival styling system for mascot records.
---

# Tailwind Migration

This document records the removal of Tailwind CSS patterns from the Filed & Forgotten system and the consolidation of styling into a controlled, static archive layer.

Tailwind was not “integrated.” It spread.

It is now being extracted.

---

## 🧱 Current State of Contamination

The codebase currently contains:

- Inline utility classes embedded in Astro templates
- Inconsistent visual styling across mascot pages
- Mixed responsibility between structure (Astro/Starlight) and styling (Tailwind remnants)
- No single authority governing “how a mascot card looks”

The result is visual fragmentation disguised as flexibility.

It is not flexible. It is inconsistent.

---

## 📦 Target Architecture

All mascot rendering must pass through a single structural component:

### `MascotCard.astro`

This component is now the only valid representation layer for mascots.

Responsibilities:

- Render mascot metadata consistently
- Apply static, scoped styling only
- Accept structured data (no ad-hoc layout logic)
- Display classification status via Lucide icon mapping

No page-level styling overrides are permitted.

---

## 🧾 Data Model (Required Standard)

Each mascot entry must conform to a flat-file schema:

```ts
type MascotRecord = {
  name: string
  originSystem: string
  status: 'active' | 'deprecated' | 'orphaned' | 'corrupted' | 'unknown'
  lastSeen?: string
  tags: string[]
  image: string
  notes: string
}