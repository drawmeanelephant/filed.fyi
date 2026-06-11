# LEP4 Implementation Notes & Concerns

This document outlines structural, syntax, and schema concerns identified in the proposed additions in [LEP4.md](file:///Users/tbuddy/Documents/GitHub/filed.fyi/LEP4.md). These issues must be addressed before or during file generation to prevent Astro/MDX compilation failures and schema validation mismatches.

---

## 1. Critical Syntax & MDX Compilation Concerns

### Broken `<Broside>` Component Tags
In all four proposed mascot files, the `<Broside>` component uses an incorrect text-like syntax instead of proper JSX/MDX tag syntax. Because the closing `</Broside>` tag is present, the MDX compiler will throw syntax errors during build.

- **Mascot 432 (`432.afterimage-clerk.mdx`)**
  - *Proposed in LEP4:*
    ```markdown
    Broside typetip title="Registrar Note"
    Assumption active. Proof packet thinned. Continue only with provenance visible where possible.
    </Broside>
    ```
  - *Required Correction:*
    ```markdown
    <Broside type="tip" title="Registrar Note">
    Assumption active. Proof packet thinned. Continue only with provenance visible where possible.
    </Broside>
    ```

- **Mascot 433 (`433.sidecar-conflict-porter.mdx`)**
  - *Proposed in LEP4:*
    ```markdown
    Broside typenote title="Containment Note"
    Conflict relocated. Influence unchanged. Do not confuse dispersal with reduction.
    </Broside>
    ```
  - *Required Correction:*
    ```markdown
    <Broside type="note" title="Containment Note">
    Conflict relocated. Influence unchanged. Do not confuse dispersal with reduction.
    </Broside>
    ```

- **Mascot 434 (`434.obsolescence-steward.mdx`)**
  - *Proposed in LEP4:*
    ```markdown
    Broside typetip title="Registrar Note"
    Retirement declared. Support obligations ongoing. File as inherited dependency, not residue.
    </Broside>
    ```
  - *Required Correction:*
    ```markdown
    <Broside type="tip" title="Registrar Note">
    Retirement declared. Support obligations ongoing. File as inherited dependency, not residue.
    </Broside>
    ```

- **Mascot 435 (`435.driftlocked-policy-box.mdx`)**
  - *Proposed in LEP4:*
    ```markdown
    Broside typenote title="Containment Note"
    Repeated often enough, the exception stops asking permission.
    </Broside>
    ```
  - *Required Correction:*
    ```markdown
    <Broside type="note" title="Containment Note">
    Repeated often enough, the exception stops asking permission.
    </Broside>
    ```

---

## 2. Missing MDX Imports

In Astro MDX Content Collections, custom components used inside `.mdx` files must be imported explicitly unless configured globally (which they are not in `astro.config.mjs`).

None of the four proposed mascot files import `Broside`. To avoid compile-time "component not defined" errors, each mascot file needs the following import statement placed immediately after the frontmatter:

```markdown
---
[frontmatter details]
---

import { CollectionRegister, RelatedEntries, Broside, Limerick } from '@/components/mdx';
```

---

## 3. Schema Mismatches in Frontmatter

### Mascots: `versionLabel` vs `version`
All four proposed mascot files contain the field:
`versionLabel: candidacy carried forward`

However, the `mascots` schema in [src/content.config.ts](file:///Users/tbuddy/Documents/GitHub/filed.fyi/src/content.config.ts#L46) does not define a `versionLabel` field. Instead, it defines:
`version: z.union([z.string(), z.number().transform(String)]).nullable().optional()`

*Note:* `versionLabel` is a field reserved for the `lorelog` schema.
- **Correction:** Change the frontmatter field to `version: "candidacy carried forward"` in all mascot files.

### Mascot: `relatedEntries`
The mascot schema in `src/content.config.ts` does not define a `relatedEntries` array, unlike the `lorelog` schema. However, all four proposed mascot files list `relatedEntries` in their frontmatter.
- **Outcome:** Since Astro/Zod is not configured with `.strict()` for the mascot schema, these extra fields will be stripped during schema parsing. However, any code querying the `mascots` collection directly won't see them. If mascot pages ever need to dynamically link back to these entries, the schema in `src/content.config.ts` will need to be updated.

### Releases: `description` vs `summary`
In `v0.1.2-replacement-without-release.md` (under `releases/`), the frontmatter defines a multiline `description`.
However, the `releases` schema uses `logSchema`, which defines `summary: z.string().optional()` and does not include `description`.
- **Correction:** Rename the `description` key to `summary` in the release file frontmatter to align with the schema.

---

## 4. File-Path & Slug Consistency Checks

- **Case-Sensitivity:** The files in `lorelog/` are named in uppercase (e.g. `LLG-0414-WAD.mdx`), whereas the slugs specified in frontmatter are lowercase (e.g. `slug: lorelog/llg-0414-wad`). This is consistent with existing lorelog files in the codebase (which use uppercase file names but lowercase slugs).
- **Cross-Links Verification:** All `relatedEntries` and IDs specified in the proposed files correspond to valid, existing workspace files or the newly proposed files in LEP4. No orphan links will be created.
