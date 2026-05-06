# filed.fyi

Archive surface for collection-backed records.

Static delivery. Unstable classification.

Records are stored as content collections under fixed categories. Classification remains subject to revision, reinterpretation, renumbering, and linked refile events preserved in the archive state.

## Inventory

- mascots: system entities with renumbered and reclassified identities across commits
- lorelog: case records with evolving interpretation, cross-reference linkage, and non-stable filing relationships
- limericks: verse records emitted during structural changes, audits, migrations, and classification events
- haikus: compressed observation layer of system state residue

## Archive model

The archive is collection-backed and file-addressed.

Each record exists as a source document with frontmatter, body content, and optional links to related records. Cross-record association is explicit where declared and unresolved where not. Absence is preserved. Drift is preserved.

Git history is part of the archive state, including renames, deletions, migrations, reindexing events, and structural refactors. Prior classifications remain accessible through historical state.

## Structure

Built with Astro and Starlight.

Content definitions live in `src/content.config.ts`. Records are stored under `src/content/docs/`. Rendering is handled through collection-aware components and route layouts. Routes render content collections directly without transformation beyond mapping and layout components.

The archive does not depend on a CMS abstraction layer or runtime editorial interface.

## Record classes

### Mascots

Mascot records are entity files with identity fields, state markers, origin traces, failure lists, ceremonial tasks, and linked references where present.

Mascot identifiers may drift across archive history. Slug continuity is preferred but not guaranteed. Renumbering, reassignment, and reclassification are normal system operations and are preserved as archival conditions, not corrected as errors.

### Lorelog

Lorelog records are case files. They preserve incident framing, interpretive state, related entities, and cross-record citation surfaces where links have been declared.

A lorelog entry may outlast the classification it originally described. Interpretation may change without invalidating prior filings.

### Limericks

Limericks are archival byproducts and parallel filings. They are emitted during structural change, interpretive drift, audit activity, and classification instability.

They do not stabilize the archive. They record its movement.

### Haikus

Haikus operate as a compressed observation layer.

They retain minimal state. They do not explain. They mark residue.

## Record constraints

- Records remain addressable by slug, path, case number, or declared identifier
- Cross-record references must be explicit to be considered canonical
- Duplicate meaning is permitted; duplicate identifiers are not stable by default
- Renaming of identifiers is permitted only through explicit migration commits
- Deletion is permitted when preserved in archive history
- Structural refactors do not erase prior state
- Render status is descriptive, not corrective

## Git state

Git history is part of the archive state.

Renames, deletions, migrations, reindexing passes, and structural refactors are considered primary archival events rather than development noise. A commit may alter classification without resolving it. A clean tree does not imply a stable ontology.
Classifications are not guaranteed to persist across time.

## Rendering

The site is static. The records are not.

Astro and Starlight provide the delivery layer. Collection schemas, dossier components, and route mappings provide the retrieval surface.

## System note

This repository preserves content, linkage, and drift.

It does not guarantee final classification. It guarantees retained evidence of classification attempts.