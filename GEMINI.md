# GEMINI.md

## Project Overview
**filed.fyi (Filed & Forgotten)** is a static, collection-backed archive designed to preserve records of system entities (mascots), case files (lorelog), and archival residue (limericks, haikus). The project emphasizes long-term maintainability through a "flat-file" philosophy, avoiding unnecessary abstractions and frameworks.

- **Stack:** Astro 6.x, Starlight, Lucide.
- **Architecture:** Static delivery of Markdown/MDX content collections.
- **Philosophy:** Static, flat-file archive. Minimal abstraction. Prefer duplication over complex design systems. Git history is considered part of the archival state.

## Core Commands
- `npm run dev`: Starts the Astro development server.
- `npm run build`: Builds the static site for production.
- `npm run preview`: Previews the production build locally.

## Development Conventions & Constraints
- **Minimal Abstraction:** Adhere to the rules in `rules.md`. Avoid "enterprise scalable" architectures.
- **Surgical Updates:** When modifying content or components, maintain the "archival" feel. Do not "correct" historical records unless performing an explicit migration.
- **Content-First:** The project revolves around its content collections. Ensure schemas in `src/content.config.ts` are respected.
- **Vanilla CSS:** Prefer plain CSS in `src/styles/global.css` or scoped styles over utility-first frameworks.

## Content Structure
Records are stored in `src/content/docs/` and categorized into several key collections:

- **Mascots (`mascots/`):** System entities with complex state markers and lore.
- **Lorelog (`lorelog/`):** Case files preserving incident framing and interpretive state.
- **Archive Residue:** `limericks/`, `haikus/`, `aphorisms/`.
- **System Logs:** `changelog/`, `releases/`, `posts/`.
- **Reference:** Technical documentation and system directives.

### Concept Routing & Shelving
The archive uses a flat-file, tag-based taxonomy for clustering files into "shelves" or "concepts" (e.g., `core-doctrines`, `operational-engines`). 
- **Declaration:** Files self-declare their membership using a `concepts` string array in their frontmatter. Do not create central mapping files.
- **Rendering:** Route threshold pages (e.g., `src/pages/concepts/*.astro`) dynamically list these files using `<CollectionRegister filterConcept="concept-name" />`.

## Key Components & Mappers
- **Components:** Located in `src/components/`. Used within MDX via `src/components/mdx.ts`.
  - `CollectionRegister`: Lists items within a collection. Supports filtering by filepath via `filterPrefix` or by metadata tags via `filterConcept`.
  - `RelatedEntries`: Displays linked records.
  - `Limerick`: Specialized rendering for verse records.
- **Mappers:** Located in `src/lib/mappers/`. Used to transform Zod-validated collection data for display (e.g., mapping enums to CSS classes for badges).

## Testing & Validation
- **Markdown Linting:** Use `npm run lint` (via `markdownlint-cli`) to ensure content consistency.
- **Type Checking:** Run `tsc` to validate TypeScript and Astro content schemas.
- **Schema Validation:** Astro automatically validates content against schemas in `src/content.config.ts` during build and dev.
