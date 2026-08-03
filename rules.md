# Filed & Forgotten — System & Archival Rules

## 1. Core Philosophy

* **Static, Flat-File Archive**: The archive is stored directly in plain Markdown files under `content/`.
* **Minimal Abstraction**: Avoid abstraction layers, custom macros, or design-system bureaucracy. Prefer duplication and clarity over complex structural patterns.
* **Readable CSS**: Keep CSS readable, direct, and straightforward within `themes/cantilever/`. Avoid utility-class sprawl, deeply nested class hierarchies, or complex naming frameworks that require separate manuals to decipher.
* **Single Maintainer Principle**: Design and maintain all systems for long-term maintainability by a single tired maintainer.
* **Preserve Archival Weirdness**: Retain historical voice, deliberate ambiguity, and archival irregularities. Do not smooth over contradictions or normalize intentional residue merely to make the archive appear uniform.

## 2. Boris Graph & Identity Rules

* **Stable Identifiers**: Record IDs (`id`) represent permanent, canonical identities—not casual or ephemeral slugs. Do not rename, renumber, or reuse IDs.
* **Structural Hierarchy**: `parent` specifies structural container hierarchy.
* **Semantic Linkage**: `relations` declare semantic cross-references between records.
* **Closed Frontmatter Schema**: Unknown or arbitrary YAML frontmatter keys are build errors. Do not introduce legacy Astro metadata (such as `updatedAt`), custom frontmatter keys, or MDX directives.
* **Restraint in Citing & Metadata**: Do not invent synthetic relations, doctrine, or metadata solely to give an impression of completeness. Missing metadata and unlinked states are valid archive conditions.

## 3. Archival Containment Directives

* **Bin 8C / MA8C Containment**: Do not reference Bin 8C or MA8C unless the record explicitly involves self-indexing, interpretive custody drift, hazardous intentional misfiling, or cluster-level presence.
* **Breeding Program Containment**: Do not reference breeding governance unless the record explicitly involves refuge classification, labor refusal, gratitude alignment, or consent-loop persistence.
* **Shared Mood Is Not Jurisdiction**: Do not permit records to inherit Bin 8C or breeding program terminology merely due to tonal resemblance, proximity, or affectionate self-reference.
