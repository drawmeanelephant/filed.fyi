---
title: "Frontpage Structure, Theme Pass, and Host Files"
parent: changelog
status: published
tags: ["changelog", "cantilever", "frontpage", "accessibility", "hosting", "publishing"]
---

# Frontpage Structure, Theme Pass, and Host Files

**Maintenance ID:** 0.1.00029.frontpage-structure
**Date:** 2026-09-28
**Scope:** themes/cantilever, scripts/filed-build.sh, content/index.md, THEME-NOTES.md, changelog

---

## What changed

- **Navigation drawer ships closed.** On screens up to 960px the frontpage opened on an expanded menu; the first heading sat near y=721 on a 390px phone. The drawer is now closed in the markup. `cantilever.js` opens it above 960px, where it reads as a sidebar. Its summary is visible whenever it is closed, so the menu is reachable without JavaScript.
- **The frontpage has its own layout.** `index` is routed to `layouts/frontpage.html` by an `id:index` layout rule. It carries the record and a plain list of the collections. The sidebar, the one-item breadcrumb, and the rail that repeated the title are gone. The site name now appears once in the header and once as the H1.
- **Head metadata.** The frontpage has a description, a canonical URL, Open Graph tags, `theme-color`, a favicon, and `generator` set to Boris. Other layouts gained `theme-color`, the favicon, and the generator.
- **Accessibility.** The brand link is named "Filed & Forgotten home", not "Cantilever Docs home". An ARIA attribute the search input did not support was removed. Sidebar group labels are no longer `<h2>` elements ahead of the page's `<h1>`. `--muted` moved from `#7c8379` (3.43:1 on paper) to `#5c6358` (5.46:1). No visible text renders below 12px. On-page contents links have a 24px minimum target.
- **Smaller corrections.** The empty children block no longer draws a rule above the footer. The "Press / to focus" hint and its key cap only appear where a fine pointer is present. The record count is localised. The frontpage `<title>` no longer says the name twice. `content/index.md` changed only its existing `title` value, from capitals to "Filed & Forgotten".
- **Theme pass.** One type scale and one spacing scale replace the ad-hoc sizes. The reading measure (`--max-read`, 40rem) binds on the record column; the old 70ch paragraph cap computed wider than its column and never applied. Heading tracking is -0.03em for H1 and -0.02em for H2. The phone header keeps the tagline. The dead page-turn strip and the navigation rules written for `{{nav}}`, which Cantilever does not use, were removed.
- **Host files.** `themes/cantilever/hosting/` holds `404.html` and `robots.txt`. `filed-build.sh` copies them into the output after certification. Before this, Cloudflare Pages had no `404.html` and answered every unknown path, `/404.html`, and `/robots.txt` with the frontpage and status 200.

## What was deliberately left alone

- No record IDs, parents, relations, or frontmatter keys were added, removed, or renamed.
- No aphorism feed or recent-entries section was added. Neither exists in the content model, and neither was wanted.
- The host files are outside the Boris evidence set. Boris makes no claim about them, and the build refuses to copy them over any file Boris certified.
- `scripts/filed-publish.sh` was not changed. Its `site/` export is not what Cloudflare Pages deploys.
- The search status is still a polite live region that announces the record count on load. That is a behaviour change for another pass.
- Scrollable `<pre>` blocks with long lines still cannot be reached by keyboard (axe `scrollable-region-focusable`). That predates this pass.

## Verification performed

- `./bin/validate_graph.sh` against Boris main `4a1ff01`: graph diagnostics passed; 2,348 pages compiled; verse-residue check, HTML ID audit (0 duplicates), and publication certification passed; host files added outside the certified set.
- The frontpage search index still holds only the record ("FILED & FORGOTTEN", "Entry Protocol"). The collection index and the rail are excluded. The index lists 2,342 documents, as before.
- axe-core 4.12 on `index.html`, `mascots.html`, `lorelog/LLG-0409-PRE.html`, and `reference/FREF-0080-SRBP.html` at 1440px: 0 violations on the first three. The earlier target-size violation on LLG-0409-PRE's rail is cleared. FREF-0080 reports one `scrollable-region-focusable` on a `<pre>` whose 90-character line overflowed before this pass as well. The only incomplete results are the decorative, `aria-hidden` brand mark and search icon.
- Rendered at 390, 768, and 1440px, including touch emulation at 390. At 390 the frontpage H1 sits under the header instead of below the menu. The touch status reads "Search 2,342 records." with no key hint. No visible text measured below 12px on the sampled pages, including table pages with inline code.
- Against a local stand-in for Pages not-found handling: `/robots.txt` 200 `text/plain`; `/definitely-not-a-real-path-12345/` and `/lorelog/nope/deeper` 404 with the 404 page, styled, with search loaded at depth.
- `python3 scripts/test_*.py`: seven of eight pass. `test_content_audit_policy.py` fails one check: the committed `metadata/content-audit-policy/summary.json` counts 1,688 poetry records, and fresh generation counts 1,716. This branch does not touch poetry records or that metadata; the drift is already on `main`.

## Unresolved follow-up

- `404.html` duplicates the frontpage header by hand. If the header changes, the 404 page must change with it.
- The no-JavaScript search form still submits to `/_boris/search/`, which has no page and now answers 404.
