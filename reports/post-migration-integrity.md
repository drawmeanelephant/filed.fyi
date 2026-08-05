# Post-Migration Integrity Audit — filed.fyi

**Date:** 2026-08-04
**Audit scope:** Source corpus `content/` (2,265 Markdown files) → rendered site `dist/cantilever/` (2,265 HTML pages + `_boris/` assets).
**Migration audited:** Astro/Starlight → Boris (Zig static compiler). This repository no longer contains Astro, Starlight, `package.json`, `astro.config.*`, or `.mdx` sources; the current build system is `./bin/boris` plus the Python validation scripts in `scripts/`. Findings below describe the post-migration Boris-built site.
**Content integrity:** `git status --short content/` reports **0 changes** — no archive prose was modified during this audit. Audit tooling was run from `/tmp` and writes nothing under `content/`.

---

## Build Command and Result

**Clean build executed (successful):**

```sh
rm -rf dist/cantilever
BORIS_JOBS=4 ./scripts/filed-build.sh
```

The canonical build script performs, in order:

1. `python3 scripts/filed_ids.py --root content --map metadata/id-map.jsonl` — form-ID policy validation (**passed**; 2,265 pages validated, no files changed).
2. `python3 scripts/audit_markdown_links.py content` — Markdown relative-link audit (**passed**).
3. Rejection gate for legacy `:::note[` authoring syntax (**passed**; none present).
4. `./bin/boris --input content --theme themes/cantilever --html-dir dist/cantilever --sitemap --site-url https://filed.fyi` with 10 compact-layout rules, `--jobs 4`.
5. `python3 scripts/audit_html_ids.py dist/cantilever` — duplicate HTML-ID audit (**passed**; 0 pages with duplicate IDs).

**Result:** exit code `0` — "Filed build passed: dist/cantilever". Wall time ~50.6 s. `dist/cantilever/_boris/proof/checks.json` reports `artifact-integrity: passed`, `rendered-html: passed`, `rendered-search: passed`.

**Graph diagnostics:** `./bin/boris check --input content --format json` reports 2,265 pages, 11 roots, 2,254 satellites, and 2,265 `unreferenced_page` findings with **0 non-baseline findings**. All 2,265 pages are flagged `unreferenced_page` because Boris `check` counts only explicit `relations`, not `parent` edges; `bin/validate_graph.sh` documents this as the accepted baseline (`unreferenced_page` is whitelisted there). It is **not** an orphan signal — see §7 for the reachability crawl that resolves this.

---

## 1. Build Failures

**None.**

The production build succeeds from a clean `dist/` on the current checkout. No errors or warnings were emitted by `filed-build.sh`; the only warning-adjacent output is the documented `unreferenced_page` baseline from `boris check` (see above), which `validate_graph.sh` explicitly tolerates.

*Reproduction:*
```sh
rm -rf dist/cantilever && ./scripts/filed-build.sh; echo $?   # -> 0
./bin/boris check --input content --format json 2>/dev/null | jq '[.findings[]? | select(.code != "unreferenced_page")] | length'   # -> 0
```

## 2. Broken Routes

**No source file fails to produce its expected route.**

For each of the 2,265 Markdown sources, the expected route was computed from its `id` frontmatter (`{id}.html`, e.g. `content/reference/fref-0050-avoc.md` with `id: reference/FREF-0050-AVOC` → `dist/cantilever/reference/FREF-0050-AVOC.html`; trunk `content/reference.md` → `dist/cantilever/reference.html`). **0 sources** lacked their expected route file, and **0 rendered routes** lacked a matching source.

**Observation (not a defect): sitemap under-reports by 5 pages.** `sitemap.xml` contains 2,260 URLs vs. 2,265 rendered pages. The 5 omissions are all `status: draft` records — a pattern consistent with a sitemap draft-filter (Boris renders the pages but does not list them). If the intent is for drafts to be indexable, this is behavior to confirm against the generator; if sitemap completeness is the goal, the draft filter is the lever.

| Route | Source | Frontmatter status |
|---|---|---|
| `reference/FREF-0070-AOPT.html` | `content/reference/fref-0070-aopt.md` | `draft` |
| `reference/FREF-0200-CBAC.html` | `content/reference/fref-0200-cbac.md` | `draft` |
| `reference/FREF-0400-METR.html` | `content/reference/fref-0400-metr.md` | `draft` |
| `reference/FREF-0410-SCLB.html` | `content/reference/fref-0410-sclb.md` | `draft` |
| `reference/FREF-0420-ANCL.html` | `content/reference/fref-0420-ancl.md` | `draft` |

*Reproduction:*
```sh
python3 - <<'EOF'
import re
from pathlib import Path
D = Path('dist/cantilever')
pages = {p.relative_to(D).as_posix() for p in D.rglob('*.html') if not p.relative_to(D).as_posix().startswith('_boris/')}
sm = set(re.findall(r'<loc>https://filed\.fyi/([^<]+)</loc>', (D/'sitemap.xml').read_text()))
print(sorted(pages - sm))   # -> the 5 draft routes above
EOF
```

## 3. Broken Links

**None found in source or rendered output.**

- **Markdown relative links** (`scripts/audit_markdown_links.py content`): "all local Markdown links resolve" — exit 0. The only non-`.md` local link targets in source are prose mentions (inline code), not links.
- **Rendered HTML links** (crawl of every `href`/`src` in all 2,265 HTML pages): 0 targets resolve to a non-existent local file. This includes relative links (`../assets/cantilever.css`), root-relative links (`/index.html`, `/reference.html`, `/_boris/search/…`), and fragment anchors.
- **Extension-less or route-style hrefs:** the only non-`.html` local targets are the theme asset bundle (`assets/cantilever.css`, `assets/cantilever.js`) and `_boris/search/` — all present.

*Reproduction:*
```sh
python3 scripts/audit_markdown_links.py content; echo $?        # -> 0
python3 - <<'EOF'
import re
from pathlib import Path
from urllib.parse import urlsplit
D = Path('dist/cantilever')
bad = []
for p in D.rglob('*.html'):
    if p.relative_to(D).as_posix().startswith('_boris/'): continue
    for h in re.findall(r'(?:href|src)="([^"]+)"', p.read_text()):
        u = urlsplit(h)
        if u.scheme or u.netloc or h.startswith(('#','mailto:','tel:','javascript:','data:')): continue
        clean = h.split('#')[0].split('?')[0]
        if not clean: continue
        r = D/clean.lstrip('/') if clean.startswith('/') else p.parent/clean
        if not r.is_file(): bad.append((str(p.relative_to(D)), h))
print(len(bad), bad[:5])   # -> 0
EOF
```

## 4. Missing Assets

**None.**

- **Images/static assets referenced from Markdown:** every `![…](…)` / `[…](…)` target in `content/` resolves to a real file. 0 missing (the audit keyed on `.png/.jpg/.jpeg/.gif/.svg/.webp/.avif/.ico/.css/.js/.woff2/.pdf` targets; source contains no broken asset references — filenames like `` `reboota-thrice.png` `` appear in inline code, not as links).
- **Assets referenced from rendered HTML:** every `href`/`src` in the 2,265 pages pointing at `assets/`, `_boris/`, etc. resolves. 0 missing.

*Reproduction:*
```sh
python3 - <<'EOF'
import re
from pathlib import Path
from urllib.parse import urlsplit
C, D = Path('content'), Path('dist/cantilever')
ext = re.compile(r'\.(png|jpe?g|gif|svg|webp|avif|ico|css|js|woff2?|ttf|pdf)$', re.I)
missing = []
for src in C.rglob('*.md'):
    for t in re.findall(r'\]\(([^)]+)\)', src.read_text()):
        t2 = t.strip().split('#')[0].split('?')[0]
        if not t2 or urlsplit(t2).scheme or not ext.search(t2): continue
        r = C/t2.lstrip('/') if t2.startswith('/') else src.parent/t2
        if not r.is_file(): missing.append((str(src.relative_to(C)), t))
print('missing md assets:', len(missing))
EOF
# Plus the rendered-HTML asset pass from §3 (same resolver); both report 0.
```

## 5. Metadata Problems

### 5a. Duplicate IDs — **none**

All 2,265 `id` values are unique and conform to `metadata/id-policy.json` (validated by `filed_ids.py`: "validated 2265 pages; no files changed"). No route collisions, since routes are derived 1:1 from IDs.

*Reproduction:* `python3 scripts/filed_ids.py --root content --map metadata/id-map.jsonl; echo $?   # -> 0`

### 5b. Duplicate slugs — **none**

No two source files share a lowercase file stem (e.g. `content/reference/fref-0160-maii.md` vs `content/reference/0160-maii.md` would collide; none do).

### 5c. Duplicate titles — **577 cross-collection groups (by design) + 7 within-collection groups (real)**

**Context:** of the 577 total duplicate-title groups, 570 are pure cross-collection reuse — the archive deliberately reuses mascot character names across collections, so the same character appears as an aphorism, haiku, limerick, mascot, and lorelog record (288 groups span 4 collections, 134 span 3, and 155 span 2). This is intentional cross-linking, not corruption.

**Real finding — 7 of the 577 groups also duplicate within a single collection** (same collection, same `title`, distinct IDs → ambiguous human-readable identity):

| Collection | Duplicated title | Sources |
|---|---|---|
| `aphorisms` | `htaccessius the doorman` | `content/aphorisms/APH-013.htaccessius-the-doorman.md`, `content/aphorisms/APH-403.htaccessius-the-doorman.md` |
| `aphorisms` | `managed absence spine` | `content/aphorisms/APH-FREF-0020-MAPS.md`, `content/aphorisms/aph-fref-0815-map.md` |
| `haikus` | `service continuity listening board` | `content/haikus/hai-fref-0410-sclb.md`, `content/haikus/hai-llg-0821-scl.md` |
| `haikus` | `metrics of care` | `content/haikus/hai-fref-0400-metr.md`, `content/haikus/hai-fref-0740-moc.md`, `content/haikus/hai-llg-0820-mcr.md` |
| `limericks` | `continuity worship` | `content/limericks/LIM-FREF-0620-CWSH.md`, `content/limericks/LIM-LLG-0403-CWR.md` |
| `limericks` | `metrics of care` | `content/limericks/LIM-FREF-0740-MOC.md`, `content/limericks/lim-fref-0400-metr.md` |
| `reference` | `metrics of care` | `content/reference/empathegy/fref-0740-moc.md`, `content/reference/fref-0400-metr.md` |

Note the cross-cutting `metrics of care` duplication appears in three collections at once (haikus ×3, limericks ×2, reference ×2), suggesting a repeated migration artifact rather than a single deliberate echo.

*Reproduction:*
```sh
python3 - <<'EOF'
import json, re
from collections import Counter, defaultdict
from pathlib import Path
FIELD = re.compile(r'^([A-Za-z_][A-Za-z0-9_]*):[ \t]*(.*?)(?:\r?\n)?$', re.M)
titles = defaultdict(list)
for p in Path('content').rglob('*.md'):
    fm = {m.group(1): m.group(2).strip().strip('"') for m in FIELD.finditer(p.read_text().split('---')[1])}
    if fm.get('title'): titles[fm['title'].lower()].append(p.as_posix())
for t, srcs in titles.items():
    by = Counter(s.split('/')[1] for s in srcs)
    if any(n > 1 for n in by.values()):
        print(t, {c: n for c, n in by.items() if n > 1})
EOF
```

### 5d. Sitemap gap — see §2 (5 draft pages intentionally excluded).

## 6. Structural Markdown Problems

### 6a. Heading hierarchy — **54 pages with H3 headings that skip a level (no H2 parent)**

Every one of the 54 instances is the same pattern: a page opens with `# H1` (the title) followed directly by `### H3` subheadings, with no `## H2` between (54 `H1->H3` jumps; zero `H4` skips detected). Distribution by collection: **lorelog 31, mascots 13, reference 8, posts 1, limericks 1**.

Full list (route → source):

**lorelog (31)**
- `lorelog/LLG-0414-WAD.html` → `content/lorelog/LLG-0414-WAD.md`
- `lorelog/LLG-0003.html` → `content/lorelog/LLG-BHDSS-TOAST.md` (H1 → 5× H3; verified in source: `# BHDSS Toast Overflow…` then `### The Toast Effect` …)
- `lorelog/LLG-0446-OQF.html` → `content/lorelog/LLG-0446-OQF.md`
- `lorelog/LLG-0399-OCS.html` → `content/lorelog/LLG-0399-OCS.md`
- `lorelog/LLG-0430-HBR.html` → `content/lorelog/LLG-0430-HBR.md`
- `lorelog/LLG-0367-BAIT-B3A.html` → `content/lorelog/LLG-0367-BAIT-B3A.md`
- `lorelog/LLG-0447-SLA.html` → `content/lorelog/LLG-0447-SLA.md`
- `lorelog/LLG-MA8C-0006.html` → `content/lorelog/LLG-MA8C-06.md`
- `lorelog/LLG-0009.html` → `content/lorelog/LLG-TDCIP-OVERCOH.md`
- `lorelog/LLG-0352-DOGE-RUBRIC.html` → `content/lorelog/LLG-0352-DOGE-RUBRIC.md`
- `lorelog/LLG-0369-DOGE-SWAB.html` → `content/lorelog/LLG-0369-DOGE-SWAB.md`
- `lorelog/LLG-0357-DOGE-RID.html` → `content/lorelog/LLG-0357-DOGE-RID.md`
- `lorelog/LLG-0371-BAIT-B2B.html` → `content/lorelog/LLG-0371-BAIT-B2B.md`
- `lorelog/LLG-0373-DOGE-W5.html` → `content/lorelog/LLG-0373-DOGE-W5.md`
- `lorelog/LLG-0408-DTS-DEP.html` → `content/lorelog/LLG-0408-DTS-DEP.md`
- `lorelog/LLG-0008.html` → `content/lorelog/LLG-IA-8C-ANNEX.md`
- `lorelog/LLG-0370-XEV.html` → `content/lorelog/LLG-0370-XEV.md`
- `lorelog/LLG-0374-DOGE-LA.html` → `content/lorelog/LLG-0374-DOGE-LA.md`
- `lorelog/LLG-0359-DOGE-AFTERCARE.html` → `content/lorelog/LLG-0359-DOGE-AFTERCARE.md`
- `lorelog/LLG-0372-BAIT-B5.html` → `content/lorelog/LLG-0372-BAIT-B5.md`
- `lorelog/LLG-0365-BAIT-B2A.html` → `content/lorelog/LLG-0365-BAIT-B2A.md`
- `lorelog/LLG-0366-BAIT-B4A.html` → `content/lorelog/LLG-0366-BAIT-B4A.md`
- `lorelog/LLG-0358-DOGE-W3.html` → `content/lorelog/LLG-0358-DOGE-W3.md`
- `lorelog/LLG-0361-DOGE-STAMP-DRIFT.html` → `content/lorelog/LLG-0361-DOGE-STAMP-DRIFT.md`
- `lorelog/LLG-0819-K.html` → `content/lorelog/LLG-0819-K.md`
- `lorelog/LLG-0368-RAGE-AQ.html` → `content/lorelog/LLG-0368-RAGE-AQ.md`
- `lorelog/LLG-0400-TRIAD.html` → `content/lorelog/LLG-0400-TRIAD.md`
- `lorelog/LLG-0422-SCP.html` → `content/lorelog/LLG-0422-SCP.md`
- `lorelog/LLG-0427-RAC.html` → `content/lorelog/LLG-0427-RAC.md`
- `lorelog/LLG-04XX-CLIN-0404.html` → `content/lorelog/LLG-04xx-CLIN-404.md`
- `lorelog/LLG-0441-TSR.html` → `content/lorelog/LLG-0441-TSR.md`

**mascots (13)**
- `mascots/M-0021.html` → `content/mascots/021.markie-d-down.md`
- `mascots/M-0276.html` → `content/mascots/276.mandate-lace.md`
- `mascots/M-0266.html` → `content/mascots/266.warm-hold-music.md`
- `mascots/M-0320.html` → `content/mascots/320.quiet-surplus.md`
- `mascots/M-0253.html` → `content/mascots/253.local-option-ghost.md`
- `mascots/M-0269.html` → `content/mascots/269.policy-afterglow.md`
- `mascots/M-0301.html` → `content/mascots/301.friendrick-the-extant.md`
- `mascots/M-0248.html` → `content/mascots/248.attestation-mole.md`
- `mascots/M-0280.html` → `content/mascots/280.ribbon-latency.md`
- `mascots/M-0296.html` → `content/mascots/296.gown-of-recognition.md`
- `mascots/M-0259.html` → `content/mascots/259.drift-lapel.md`
- `mascots/M-0672.html` → `content/mascots/672.map-72-absentia.md`
- `mascots/M-0937.html` → `content/mascots/937.blinko-chompframe.md`

**reference (8)**
- `reference/FREF-0001.html` → `content/reference/audits/fref-audt-case.md`
- `reference/FREF-0002.html` → `content/reference/audits/fref-audt-cont.md`
- `reference/FREF-0003.html` → `content/reference/audits/fref-audt-intg.md`
- `reference/FREF-0120-DCSC.html` → `content/reference/fref-0120-dcsc.md`
- `reference/FREF-0150-MAPA.html` → `content/reference/fref-0150-mapa.md`
- `reference/FREF-0160-MAII.html` → `content/reference/fref-0160-maii.md`
- `reference/FREF-0320-CSEQ.html` → `content/reference/fref-0320-cseq.md`
- `reference/FREF-0875-DLAB.html` → `content/reference/fref-0875-dlab.md`

**posts (1)**
- `posts/FFP-0383.html` → `content/posts/FFP-0383.md`

**limericks (1)**
- `limericks/LIM-0077.html` → `content/limericks/lim-datty-puritas.md`

*Reproduction:*
```sh
python3 - <<'EOF'
import re
from pathlib import Path
D = Path('dist/cantilever')
for p in D.rglob('*.html'):
    rel = p.relative_to(D).as_posix()
    if rel.startswith('_boris/'): continue
    m = re.search(r'<main[^>]*>(.*?)</main>', p.read_text(), re.S)
    h = [(int(lv), re.sub(r'<[^>]+>','',lbl).strip()) for lv, lbl in re.findall(r'<h([1-6])[^>]*>(.*?)</h\1>', m.group(1) if m else '', re.S)]
    for i in range(1, len(h)):
        if h[i][0] > h[i-1][0] + 1:
            print(rel, f'H{h[i][0]} "{h[i][1][:50]}" jumps from H{h[i-1][0]}')
            break
EOF
```

### 6b. Blank or appendix-only entries — **none**

Zero pages render literally blank, and zero pages' bodies consist solely of generated appendices ("Related Aphorisms/Haikus/Limericks", TOC, navigation). Every page carries at least some authored content before its generated appendix sections; the smallest bodies are the intentional trunk indexes, e.g. `posts.html` with its "Count: N records." line.

This is a structural test only. Placeholder and low-substance records were not evaluated by this test, and the presence of authored content is not evidence that a record is substantively complete: a stub verse (e.g. the "Awaiting context" haiku in `content/haikus/hai-056-roboshirker.md`) still counts as authored content here. Phrases such as "Awaiting context", "Stub:", "_TBD_", and similar residue require a separate editorial audit.

*Reproduction:*
```sh
python3 - <<'EOF'
import re
from pathlib import Path
D = Path('dist/cantilever')
for p in D.rglob('*.html'):
    rel = p.relative_to(D).as_posix()
    if rel.startswith('_boris/'): continue
    m = re.search(r'<article[^>]*>(.*?)</article>', p.read_text(), re.S)
    if not m: continue
    pre = re.split(r'<h2[^>]*id="related-|<h2[^>]*>Related ', m.group(1), 1, re.I)[0]
    txt = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', pre)).strip()
    if not txt: print(rel)   # -> no output
EOF
```

### 6c. Other structural Markdown — **none**

`boris check` reports zero non-`unreferenced_page` findings (no frontmatter schema violations, no graph/parent errors). No legacy `:::note[` blocks remain. No unsupported frontmatter lines, unclosed fences, or duplicate keys were found in any of the 2,265 files.

*Reproduction:* `./bin/boris check --input content --format json 2>/dev/null | jq '[.findings[]? | select(.code != "unreferenced_page")] | length'   # -> 0`

## 7. Orphaned Records

**None.**

A breadth-first crawl of the rendered site starting at `index.html` (following every local `href`/`src`, skipping external/scheme links) reaches **all 2,265** rendered HTML pages; **0 pages are unreachable** from navigation or any index. This supersedes the misleading `unreferenced_page` baseline from §Build (which counts `relations` only and flags every page, including the 11 trunks).

The 34 extra reachable targets beyond the 2,265 pages are `_boris/search/` asset endpoints (search index, data files), which are intentionally reachable.

*Reproduction:*
```sh
python3 - <<'EOF'
import re
from pathlib import Path
from urllib.parse import urlsplit
D = Path('dist/cantilever')
pages = {p.relative_to(D).as_posix() for p in D.rglob('*.html') if not p.relative_to(D).as_posix().startswith('_boris/')}
links = {}
for p in D.rglob('*.html'):
    rel = p.relative_to(D).as_posix()
    if rel.startswith('_boris/'): continue
    out = []
    for h in re.findall(r'(?:href|src)="([^"]+)"', p.read_text()):
        u = urlsplit(h)
        if u.scheme or u.netloc or h.startswith(('#','mailto:','tel:','javascript:','data:')): continue
        c = h.split('#')[0].split('?')[0]
        if not c: continue
        r = D/c.lstrip('/') if c.startswith('/') else p.parent/c
        try: out.append(r.relative_to(D).as_posix())
        except ValueError: pass
    links[rel] = out
seen, q = set(), ['index.html']
while q:
    cur = q.pop()
    if cur in seen: continue
    seen.add(cur)
    q += [t for t in links.get(cur, []) if t not in seen]
print('unreachable:', len(pages - seen))   # -> 0
EOF
```

### 7a. Limitation

The crawl proves route reachability through rendered links. It does **not** prove that source relations, semantic adjacency, or intended cross-record links are complete. In particular, do not treat homepage reachability as proof of meaningful discoverability: reaching a page via a collection-wide index or the homepage only confirms a route exists, not that the record is surfaced through the links a reader would actually follow.

### 7b. Follow-up recommendation

Audit the following for completeness and correctness (the crawl above does not cover these):

- explicit `relations` (both declared and their rendered mirrors)
- `parent` edges (hierarchy tree integrity, not just path reachability)
- source cross-references (links from a record back to its source/citation)
- generated related-record links (automatic sibling/related link blocks)
- records reachable **only** through collection-wide indexes (i.e., with no inbound editorial link) — these risk being effectively orphaned in practice even though they pass the route-reachability crawl

---

## Summary Table

| # | Category | Finding count | Severity |
|---|---|---|---|
| 1 | Build failures | 0 | — |
| 2 | Broken routes | 0 (5 draft pages intentionally omitted from sitemap) | Info |
| 3 | Broken links | 0 | — |
| 4 | Missing assets | 0 | — |
| 5 | Metadata problems | 7 of 577 duplicate-title groups duplicate within a collection (remaining 570 groups are by-design cross-collection character reuse) | Low |
| 6 | Structural Markdown problems | 54 pages with H1->H3 heading-level skips (no H2 parent); 0 literally blank or appendix-only entries (structural check only; stub/placeholder residue not assessed) | Medium (a11y/navigation structure) |
| 7 | Orphaned records | 0 | — |

**Content unchanged:** all findings are read-only observations; no archive prose, frontmatter, or metadata was repaired in this pass.
