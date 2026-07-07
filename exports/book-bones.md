--- 
title: "Project Architecture Bones"
description: "Consolidated export of Project Architecture Bones."
date: 2026-07-07
---

## Brosides.astro

_path: src/components/Brosides.astro


path: src/components/Brosides.astro
bytes: 3443
```astro
---
import { AstroError } from 'astro/errors';
import * as Lucide from '@lucide/astro';
// lucide icons used instead of Starlight icon system


const asideVariants = ['note', 'tip', 'caution', 'danger'] as const;

const icons = {
  note: 'Info',
  tip: 'Rocket',
  caution: 'AlertTriangle',
  danger: 'AlertCircle',

  // Lore / archival
  ghost: 'Ghost',
  skull: 'Skull',
  scroll: 'Scroll',
  book: 'BookMarked',
  layers: 'Layers',

  // Bureaucratic / system
  clipboard: 'ClipboardList',
  stamp: 'Stamp',
  archive: 'Archive',
  folderx: 'FolderX',
  filewarning: 'FileWarning',
  fileclock: 'FileClock',
  filequestion: 'FileQuestion',

  // Entropy / failure modes
  zap: 'Zap',
  flame: 'Flame',
  cloudlightning: 'CloudLightning',
  radiation: 'Radiation',
  biohazard: 'Biohazard',
  bug: 'Bug',

  // Cosmic / signal
  orbit: 'Orbit',
  telescope: 'Telescope',
  satellite: 'Satellite',
  sparkles: 'Sparkles',
  binary: 'Binary',

  // Absurd / wildcard
  banana: 'Banana'
} as const;


const toPascalCase = (s: string) =>
  s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');


interface Props {
	type?: (typeof asideVariants)[number];
	title?: string;
	icon?: string;
}

const props = Astro.props as Props;

const type = props.type ?? 'note';
let title = props.title;
const iconProp = props.icon;
const key = (iconProp?.toLowerCase?.() ?? type);

const iconName = iconProp ? toPascalCase(iconProp) : icons[type];
const Icon = (Lucide as any)[iconName] || Lucide.Info;

const variantStyles = {
  note: "",
  tip: "",
  caution: "",
  danger: ""
} as const;

const brosideStyles: Record<string, string> = {
  // base fallbacks (type system)
  note: "",
  tip: "",
  caution: "",
  danger: "",

  // Lore / archival (sepia / parchment)
  skull: "",
  scroll: "",
  book: "",
  layers: "",

  // Bureaucratic / system
  clipboard: "",
  stamp: "",
  archive: "",
  folderx: "",
  filewarning: "",
  fileclock: "",
  filequestion: "",

  // Entropy / degradation
  zap: "",
  flame: "",
  cloudlightning: "",
  radiation: "",
  biohazard: "",
  bug: "",

  // Cosmic / signal
  orbit: "",
  telescope: "",
  satellite: "",
  sparkles: "",
  binary: "",

  // Absurd / wildcard
  banana: ""
};

const brosideAccentStyles: Record<string, string> = {
  note: "",
  tip: "",
  caution: "",
  danger: "",

  skull: "",
  scroll: "",
  book: "",
  layers: "",

  clipboard: "",
  stamp: "",
  archive: "",
  folderx: "",
  filewarning: "",
  fileclock: "",
  filequestion: "",

  zap: "",
  flame: "",
  cloudlightning: "",
  radiation: "",
  biohazard: "",
  bug: "",

  orbit: "",
  telescope: "",
  satellite: "",
  sparkles: "",
  binary: "",

  banana: ""
};

if (!asideVariants.includes(type)) {
	throw new AstroError(
		`Invalid type "${type}" passed to <Broside />.`,
		`Expected one of: ${asideVariants.join(', ')}`
	);
}

if (!title) {
	title = Astro.locals.t(`aside.${type}`);
}
---

<aside
  aria-label={title}
  class={`starlight-aside starlight-aside--${type} broside broside--${type}`}
  style="margin-bottom: 1.5rem;"
>
	<p class={`starlight-aside__title ${brosideAccentStyles[key] ?? ""}`} aria-hidden="true">
		<Icon class={`starlight-aside__icon ${brosideAccentStyles[key] ?? ""}`} />{title}
	</p>
	{
		/* 
		The slot is intentionally not wrapped in newlines/whitespace to ensure CSS `:empty` 
		can match when no content is provided. 
	*/
	}
	<div class="starlight-aside__content"><slot /></div>
</aside>

```


## CollectionRegister.astro

_path: src/components/CollectionRegister.astro


path: src/components/CollectionRegister.astro
bytes: 6233
```astro
---
import { getCollection } from 'astro:content';

const { collection, exclude, sortBy = 'title', filterPrefix, filterConcept } = Astro.props;

const entries = (await getCollection(collection, (e) => {
  if (filterPrefix && !e.id.toLowerCase().startsWith(filterPrefix.toLowerCase())) return false;
  if (filterConcept && (!e.data.concepts || !e.data.concepts.includes(filterConcept))) return false;

  if (!exclude) return true;
  const slug = e.id.split('/').pop()?.replace(/\.mdx?$/, '');
  return slug !== exclude && e.id !== exclude;
}))
  .sort((a, b) => {
    const hasA = a.data.mascotId != null;
    const hasB = b.data.mascotId != null;

    if (collection === 'mascots' || filterPrefix?.startsWith('mascots')) {
      if (hasA && !hasB) return -1;
      if (!hasA && hasB) return 1;
      if (hasA && hasB) return Number(a.data.mascotId) - Number(b.data.mascotId);

      const ta = a.data.displayName ?? a.data.title ?? '';
      const tb = b.data.displayName ?? b.data.title ?? '';
      return ta.localeCompare(tb);
    }

    const va = a.data[sortBy] ?? a.data.title ?? '';
    const vb = b.data[sortBy] ?? b.data.title ?? '';

    if (va instanceof Date) return vb.valueOf() - va.valueOf();

    const na = Number(va);
    const nb = Number(vb);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;

    return String(va).localeCompare(String(vb));
  });

type AnyEntry = CollectionEntry<any>;

// Resolving Parent Hrefs for Poems
const mascots = await getCollection('mascots');
const lorelogs = await getCollection('lorelog');

function getEntryHref(collection: string, id: string): string {
  let cleanId = id.replace(/\.mdx?$/, '').toLowerCase();
  if (cleanId.startsWith(collection + '/')) {
    cleanId = cleanId.substring(collection.length + 1);
  }
  if (collection === 'docs') return '/' + cleanId;
  return '/' + collection + '/' + cleanId;
}

function isMascotMatch(poemRef: string, mascot: any): boolean {
  if (!poemRef || !mascot) return false;
  
  const clean = (s: string) => s
    .replace(/^mascots\//i, '')
    .replace(/\.mdx?$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim();
    
  const rClean = clean(poemRef);
  const rTokens = rClean.split(/\s+/).filter(Boolean);
  
  const rNumber = rTokens.find(t => /^\d+$/.test(t));
  if (rNumber && mascot.data.mascotId && String(mascot.data.mascotId) === rNumber) {
    return true;
  }
  
  const cleanMascot = (str: string) => clean(str).split(/\s+/).filter(t => !/^\d+$/.test(t) && t !== 'the');
  
  const mascotTokens = [
    mascot.id,
    mascot.data.slug,
    mascot.data.title,
    mascot.data.displayName,
    mascot.data.name,
  ].filter(Boolean).flatMap(cleanMascot);
  
  const poemTextTokens = rTokens.filter(t => !/^\d+$/.test(t) && t !== 'the');
  
  if (poemTextTokens.length > 0 && mascotTokens.length > 0) {
    const allMatch = poemTextTokens.every(pt => mascotTokens.includes(pt));
    if (allMatch) return true;
    
    const titleTokens = cleanMascot(mascot.data.title || mascot.data.displayName || '');
    if (titleTokens.length > 0 && titleTokens.every(tt => poemTextTokens.includes(tt))) {
      return true;
    }
  }
  
  return false;
}

const poemToLorelogMap = new Map();
for (const lg of lorelogs) {
  const lgName = lg.id.replace(/\.mdx?$/, '');
  
  const relatedH = (lg.data as any).relatedHaiku || [];
  for (const h of relatedH) {
    if (h.slug) {
      const hName = h.slug.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim() || '';
      poemToLorelogMap.set(hName, lgName);
    }
  }
  
  const relatedL = (lg.data as any).relatedLimerick || [];
  for (const l of relatedL) {
    if (l.slug) {
      const lName = l.slug.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim() || '';
      poemToLorelogMap.set(lName, lgName);
    }
  }
}

function getLabel(e: any): string {
  if (e.data.mascotId != null) return String(e.data.mascotId).padStart(3, '0');
  if (e.data.caseNumber) return e.data.caseNumber;
  if (e.data.versionLabel) return e.data.versionLabel;
  if (e.data.formNumber) return e.data.formNumber;
  return '—';
}

function getHref(e: any): string {
  if (collection === 'docs') {
    return '/' + e.id.replace(/\.mdx?$/, '');
  }
  if (collection === 'mascots') {
    return getEntryHref('mascots', e.id);
  }
  if (collection === 'lorelog') {
    return getEntryHref('lorelog', e.id);
  }
  
  const poemName = e.id.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim() || '';
  
  if (poemToLorelogMap.has(poemName)) {
    return getEntryHref('lorelog', poemToLorelogMap.get(poemName));
  }
  
  const refs = [
    e.data.mascotRef,
    ...(e.data.relatedMascots || [])
  ].filter(Boolean);
  
  if (refs.length > 0) {
    const matchedMascot = mascots.find(m => refs.some(ref => isMascotMatch(ref, m)));
    if (matchedMascot) {
      return getEntryHref('mascots', matchedMascot.id);
    }
  }
  
  if (collection === 'haikus') return '/haikus';
  if (collection === 'limericks') return '/limericks';
  if (collection === 'aphorisms') return '/aphorisms';
  return '#';
}
---

{entries.length > 0 && (
<ul style="list-style:none;padding:0;margin:0;">
  {entries.map(e => (
    <li style="display:flex;gap:1rem;padding:0.4rem 0;border-bottom:1px solid var(--sl-color-hairline);align-items:baseline;">
      <span style="font-family:var(--sl-font-mono);font-size:0.8rem;color:var(--sl-color-gray-3);min-width:6ch;flex-shrink:0;">
        {getLabel(e)}
      </span>
      <span style="flex:1;display:flex;flex-direction:column;gap:0.15rem;">
        <a href={getHref(e)}>{e.data.displayName ?? e.data.title}</a>
        {(e.data.cardDescription ?? e.data.tagline ?? e.data.description) && (
          <span style="font-size:0.75rem;color:var(--sl-color-gray-4);line-height:1.4;">
            {e.data.cardDescription ?? e.data.tagline ?? e.data.description}
          </span>
        )}
      </span>
      {e.data.completionState && e.data.completionState !== 'draft' && (
        <span style="font-family:var(--sl-font-mono);font-size:0.7rem;color:var(--sl-color-gray-4);white-space:nowrap;text-transform:uppercase;align-self:flex-start;padding-top:0.1rem;">
          {e.data.completionState}
        </span>
      )}
    </li>
  ))}
</ul>
)}
```


## FormattedDate.astro

_path: src/components/FormattedDate.astro


path: src/components/FormattedDate.astro
bytes: 367
```astro
---
import type { HTMLAttributes } from 'astro/types';

type Props = HTMLAttributes<'time'> & {
	date: Date;
};

const { date, ...attrs } = Astro.props;
---

<time datetime={date.toISOString()} {...attrs}>
	{
		date.toLocaleDateString('en-us', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}
</time>

<style>
	time {
		display: block;
	}
</style>

```


## Limericks.astro

_path: src/components/Limericks.astro


path: src/components/Limericks.astro
bytes: 3148
```astro
---
import { AstroError } from 'astro/errors';
import * as Lucide from '@lucide/astro';


const asideVariants = ['note', 'tip', 'caution', 'danger'] as const;

const icons = {
  note: 'Info',
  tip: 'Rocket',
  caution: 'AlertTriangle',
  danger: 'AlertCircle',

  ghost: 'Ghost',
  skull: 'Skull',
  scroll: 'Scroll',
  book: 'BookMarked',
  layers: 'Layers',

  clipboard: 'ClipboardList',
  stamp: 'Stamp',
  archive: 'Archive',
  folderx: 'FolderX',
  filewarning: 'FileWarning',
  fileclock: 'FileClock',
  filequestion: 'FileQuestion',

  zap: 'Zap',
  flame: 'Flame',
  cloudlightning: 'CloudLightning',
  radiation: 'Radiation',
  biohazard: 'Biohazard',
  bug: 'Bug',

  orbit: 'Orbit',
  telescope: 'Telescope',
  satellite: 'Satellite',
  sparkles: 'Sparkles',
  binary: 'Binary',

  banana: 'Banana'
} as const;

const toPascalCase = (s: string) =>
  s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');

interface Props {
  type?: (typeof asideVariants)[number];
  title?: string;
  icon?: string;
}

const props = Astro.props as Props;

const rawType = props.type ?? 'note';

const uiTypeMap: Record<string, 'note' | 'tip' | 'caution' | 'danger'> = {
  oracle: 'tip',
  tribunal: 'caution',
  audit: 'note',
  editorial: 'tip',
  doctrine: 'danger',
  relic: 'caution',
  incident: 'note',
  containment: 'danger',
  sermon: 'danger',
  ascension: 'tip'
};

const type = uiTypeMap[rawType] ?? 'note';
let title = props.title;
const iconProp = props.icon;
const key = (iconProp?.toLowerCase?.() ?? type);

const iconName = iconProp ? toPascalCase(iconProp) : icons[type];
const Icon = (Lucide as any)[iconName] || Lucide.Info;

const variantStyles = {
  note: "",
  tip: "",
  caution: "",
  danger: ""
} as const;

const brosideStyles: Record<string, string> = {
  note: "",
  tip: "",
  caution: "",
  danger: "",

  skull: "",
  scroll: "",
  book: "",
  layers: "",

  clipboard: "",
  stamp: "",
  archive: "",
  folderx: "",
  filewarning: "",
  fileclock: "",
  filequestion: "",

  zap: "",
  flame: "",
  cloudlightning: "",
  radiation: "",
  biohazard: "",
  bug: "",

  orbit: "",
  telescope: "",
  satellite: "",
  sparkles: "",
  binary: "",

  banana: ""
};

const brosideAccentStyles: Record<string, string> = {
  note: "",
  tip: "",
  caution: "",
  danger: "",

  skull: "",
  scroll: "",
  book: "",
  layers: "",

  clipboard: "",
  stamp: "",
  archive: "",
  folderx: "",
  filewarning: "",
  fileclock: "",
  filequestion: "",

  zap: "",
  flame: "",
  cloudlightning: "",
  radiation: "",
  biohazard: "",
  bug: "",

  orbit: "",
  telescope: "",
  satellite: "",
  sparkles: "",
  binary: "",

  banana: ""
};

if (!title) {
  title = Astro.locals.t(`aside.${type}`);
}
---

<aside
  aria-label={title}
  class={`starlight-aside starlight-aside--${type} broside broside--${type}`}
  style="margin-bottom: 1.5rem;"
>
  <p class={`starlight-aside__title ${brosideAccentStyles[key] ?? ""}`} aria-hidden="true">
    <Icon class={`starlight-aside__icon ${brosideAccentStyles[key] ?? ""}`} />{title}
  </p>

  <div class="starlight-aside__content whitespace-pre-line">
    <slot />
  </div>
</aside>

```


## RelatedEntries.astro

_path: src/components/RelatedEntries.astro


path: src/components/RelatedEntries.astro
bytes: 1584
```astro
---
import { getEntry } from 'astro:content';

interface RelatedRef {
  collection: string;
  id: string;
}

interface Props {
  items?: RelatedRef[];
}

const { items = [] } = Astro.props;

const resolved = await Promise.all(
  items.map(async (r) => {
    try {
      const entry = await getEntry(r.collection as any, r.id as any);
      return entry ?? null;
    } catch {
      return null;
    }
  })
);

function getEntryHref(collection: string, id: string): string {
  let cleanId = id.replace(/\.mdx?$/, '').toLowerCase();
  if (cleanId.startsWith(collection + '/')) {
    cleanId = cleanId.substring(collection.length + 1);
  }
  if (collection === 'docs') return '/' + cleanId;
  return '/' + collection + '/' + cleanId;
}

const visible = resolved.filter(Boolean);
---

{visible.length > 0 && (
  <section style="margin-top:2rem;">
    <h2 style="font-size:0.9rem; text-transform:uppercase; letter-spacing:0.08em;">
      Related filings
    </h2>
    <ul style="list-style:none; padding:0; margin:0.5rem 0 0;">
      {visible.map((e: any) => (
        <li
          style="padding:0.35rem 0; border-bottom:1px solid var(--sl-color-hairline);"
        >
          <span
            style="font-family:var(--sl-font-mono); font-size:0.75rem; color:var(--sl-color-gray-3); margin-right:0.6rem;"
          >
            {e.data.caseNumber ?? e.data.mascotId ?? e.data.versionLabel ?? '—'}
          </span>
          <a href={getEntryHref(e.collection, e.id)}>
            {e.data.displayName ?? e.data.title}
          </a>
        </li>
      ))}
    </ul>
  </section>
)}
```


## mdx.ts

_path: src/components/mdx.ts


path: src/components/mdx.ts
bytes: 280
```typescript
// src/components/mdx.ts
export { default as CollectionRegister } from './CollectionRegister.astro';
export { default as RelatedEntries } from './RelatedEntries.astro';
export { default as Broside } from './Brosides.astro';
export { default as Limerick } from './Limericks.astro';
```


## MarkdownContent.astro

_path: src/components/starlight/MarkdownContent.astro


path: src/components/starlight/MarkdownContent.astro
bytes: 5973
```astro
---
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/MarkdownContent.astro';
import { getCollection, render } from 'astro:content';

const entry = Astro.locals?.starlightRoute?.entry;
const entryId = entry?.id;

const isMascot = entryId ? entryId.startsWith('mascots/') : false;
const isLorelog = entryId ? entryId.startsWith('lorelog/') : false;

function isMascotMatch(poemRef: string, mascot: any): boolean {
  if (!poemRef || !mascot) return false;
  
  const clean = (s: string) => s
    .replace(/^mascots\//i, '')
    .replace(/\.mdx?$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim();
    
  const rClean = clean(poemRef);
  const rTokens = rClean.split(/\s+/).filter(Boolean);
  
  const rNumber = rTokens.find(t => /^\d+$/.test(t));
  if (rNumber && mascot.data.mascotId && String(mascot.data.mascotId) === rNumber) {
    return true;
  }
  
  const cleanMascot = (str: string) => clean(str).split(/\s+/).filter(t => !/^\d+$/.test(t) && t !== 'the');
  
  const mascotTokens = [
    mascot.id,
    mascot.data.slug,
    mascot.data.title,
    mascot.data.displayName,
    mascot.data.name,
  ].filter(Boolean).flatMap(cleanMascot);
  
  const poemTextTokens = rTokens.filter(t => !/^\d+$/.test(t) && t !== 'the');
  
  if (poemTextTokens.length > 0 && mascotTokens.length > 0) {
    const allMatch = poemTextTokens.every(pt => mascotTokens.includes(pt));
    if (allMatch) return true;
    
    const titleTokens = cleanMascot(mascot.data.title || mascot.data.displayName || '');
    if (titleTokens.length > 0 && titleTokens.every(tt => poemTextTokens.includes(tt))) {
      return true;
    }
  }
  
  return false;
}

let matchingHaikus: any[] = [];
let matchingLimericks: any[] = [];
let matchingAphorisms: any[] = [];

if (isMascot && entryId) {
  const mascots = await getCollection('mascots');
  const cleanEntryId = entryId.replace(/^mascots\//, '').replace(/\.mdx?$/, '').toLowerCase().trim();
  const mascotEntry = mascots.find(m => {
    const cleanMId = m.id.replace(/\.mdx?$/, '').toLowerCase().trim();
    const cleanMDataSlug = m.data.slug ? m.data.slug.replace(/^mascots\//, '').toLowerCase().trim() : '';
    return cleanMId === cleanEntryId || cleanMDataSlug === cleanEntryId;
  });

  const [haikus, limericks, aphorisms] = await Promise.all([
    getCollection('haikus'),
    getCollection('limericks'),
    getCollection('aphorisms'),
  ]);

  if (mascotEntry) {
    matchingHaikus = haikus.filter(h => {
      const refs = [h.data.mascotRef, ...(h.data.relatedMascots || [])].filter(Boolean);
      return refs.some(ref => isMascotMatch(ref, mascotEntry));
    });

    matchingLimericks = limericks.filter(l => {
      const refs = [l.data.mascotRef, ...(l.data.relatedMascots || [])].filter(Boolean);
      return refs.some(ref => isMascotMatch(ref, mascotEntry));
    });

    matchingAphorisms = aphorisms.filter(a => {
      const refs = [a.data.mascotRef, ...(a.data.relatedMascots || [])].filter(Boolean);
      return refs.some(ref => isMascotMatch(ref, mascotEntry));
    });
  }
}

if (isLorelog && entry) {
  const relatedH = entry.data.relatedHaiku || [];
  const relatedL = entry.data.relatedLimerick || [];


  if (relatedH.length > 0 || relatedL.length > 0) {
    const [haikus, limericks] = await Promise.all([
      getCollection('haikus'),
      getCollection('limericks'),
    ]);

    matchingHaikus = haikus.filter(h => 
      relatedH.some((rh: any) => {
        const rhName = rh.slug.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim();
        const hName = h.id.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim();
        return rhName === hName;
      })
    );

    matchingLimericks = limericks.filter(l => 
      relatedL.some((rl: any) => {
        const rlName = rl.slug.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim();
        const lName = l.id.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim();
        return rlName === lName;
      })
    );

  }
}
---

<Default {...Astro.props}>
  <slot />

  {isMascot && (
    <>
      {matchingAphorisms.length > 0 && (
        <div class="inline-poetry-section" style="margin-top: 3rem;">
          <h2 id="inline-aphorisms">Aphorisms</h2>
          {await Promise.all(matchingAphorisms.map(async (aphorism) => {
            const { Content } = await render(aphorism);
            return <Content />;
          }))}
        </div>
      )}

      {matchingHaikus.length > 0 && (
        <div class="inline-poetry-section" style="margin-top: 3rem;">
          <h2 id="inline-haikus">Haiku Log</h2>
          {await Promise.all(matchingHaikus.map(async (haiku) => {
            const { Content } = await render(haiku);
            return <Content />;
          }))}
        </div>
      )}

      {matchingLimericks.length > 0 && (
        <div class="inline-poetry-section" style="margin-top: 3rem;">
          <h2 id="inline-limericks">Limerick Log</h2>
          {await Promise.all(matchingLimericks.map(async (limerick) => {
            const { Content } = await render(limerick);
            return <Content />;
          }))}
        </div>
      )}
    </>
  )}

  {isLorelog && (
    <>
      {matchingHaikus.length > 0 && (
        <div class="inline-poetry-section" style="margin-top: 3rem;">
          <h2 id="inline-haikus">Related Haikus</h2>
          {await Promise.all(matchingHaikus.map(async (haiku) => {
            const { Content } = await render(haiku);
            return <Content />;
          }))}
        </div>
      )}

      {matchingLimericks.length > 0 && (
        <div class="inline-poetry-section" style="margin-top: 3rem;">
          <h2 id="inline-limericks">Related Limericks</h2>
          {await Promise.all(matchingLimericks.map(async (limerick) => {
            const { Content } = await render(limerick);
            return <Content />;
          }))}
        </div>
      )}
    </>
  )}
</Default>

```


## lorelog.ts

_path: src/lib/mappers/lorelog.ts


path: src/lib/mappers/lorelog.ts
bytes: 3338
```typescript
import type { CollectionEntry } from 'astro:content';
import { formatDate, resolveEnum, toStringArray } from './shared';

// ─── Enum maps ───────────────────────────────────────────────────────────────

const severityMeta: Record<string, { key: string; label: string; cls: string }> = {
  info:       { key: 'info',       label: 'INFO',       cls: 'badge--info' },
  notice:     { key: 'notice',     label: 'NOTICE',     cls: 'badge--notice' },
  warning:    { key: 'warning',    label: 'WARNING',    cls: 'badge--warning' },
  critical:   { key: 'critical',   label: 'CRITICAL',   cls: 'badge--critical' },
  classified: { key: 'classified', label: 'CLASSIFIED', cls: 'badge--classified' },
};

const dispositionMeta: Record<string, { key: string; label: string; cls: string }> = {
  filed:     { key: 'filed',     label: 'FILED',     cls: 'chip--filed' },
  archived:  { key: 'archived',  label: 'ARCHIVED',  cls: 'chip--archived' },
  contested: { key: 'contested', label: 'CONTESTED', cls: 'chip--contested' },
  deferred:  { key: 'deferred',  label: 'DEFERRED',  cls: 'chip--deferred' },
  expunged:  { key: 'expunged',  label: 'EXPUNGED',  cls: 'chip--expunged' },
  redacted:  { key: 'redacted',  label: 'REDACTED',  cls: 'chip--redacted' },
};

const resolutionMeta: Record<string, { key: string; label: string; cls: string }> = {
  pending:      { key: 'pending',      label: 'PENDING',      cls: 'chip--pending' },
  resolved:     { key: 'resolved',     label: 'RESOLVED',     cls: 'chip--resolved' },
  unresolvable: { key: 'unresolvable', label: 'UNRESOLVABLE', cls: 'chip--unresolvable' },
  appealed:     { key: 'appealed',     label: 'APPEALED',     cls: 'chip--appealed' },
  void:         { key: 'void',         label: 'VOID',         cls: 'chip--void' },
};

const classStamp: Record<string, string> = {
  public:     '',
  internal:   'INTERNAL',
  restricted: 'RESTRICTED',
  sealed:     'SEALED',
};

// ─── Mapper ──────────────────────────────────────────────────────────────────

export function mapLorelog(entry: CollectionEntry<'lorelog'>) {
  const d = entry.data;

  return {
    id: entry.id,

    // identity
    title:       d.title,
    caseNumber:  d.caseNumber  ?? null,
    versionLabel: d.versionLabel ?? null,
    description: d.description ?? null,
    mascotRef:   d.mascotRef   ?? null,
    redacted:    d.redacted    ?? false,

    // resolved enums
    severity:    resolveEnum(severityMeta,    d.severity,    'info'),
    disposition: resolveEnum(dispositionMeta, d.disposition, 'filed'),
    resolution:  resolveEnum(resolutionMeta,  d.resolution,  'pending'),
    stamp:       classStamp[d.classification ?? ''] ?? '',

    // clerk meta
    filedBy: d.filedBy ?? 'UNKNOWN CLERK',
    filedAt: d.filedAt ?? null,
    date:    formatDate(d.date),

    // arrays
    tags:             toStringArray(d.tags),
    affectedSystems:  toStringArray(d.affectedSystems),
    relatedEntries:   toStringArray(d.relatedEntries),
    notes:            d.notes ?? null,
  };
}

export type MappedLorelog = ReturnType<typeof mapLorelog>;
```


## mascot.ts

_path: src/lib/mappers/mascot.ts


path: src/lib/mappers/mascot.ts
bytes: 3763
```typescript
import type { CollectionEntry } from 'astro:content';
import { formatDate, resolveClass, toStringOrNull, toStringArray } from './shared';

// ─── Badge/chip maps (live here, not in the component) ───────────────────────

const statusBadge: Record<string, string> = {
  active:     'badge badge--status-active',
  archived:   'badge badge--status-archived',
  deprecated: 'badge badge--status-deprecated',
  corrupted:  'badge badge--status-corrupted',
  orphaned:   'badge badge--status-orphaned',
  unknown:    'badge badge--status-unknown',
};

const renderBadge: Record<string, string> = {
  active:    'badge badge--render-active',
  deferred:  'badge badge--render-deferred',
  corrupted: 'badge badge--render-corrupted',
  phantom:   'badge badge--render-phantom',
  archived:  'badge badge--render-archived',
};

const levelChip: Record<string, string> = {
  none:     'chip chip--level-none',
  low:      'chip chip--level-low',
  medium:   'chip chip--level-medium',
  high:     'chip chip--level-high',
  critical: 'chip chip--level-critical',
};

// ─── Mapper ──────────────────────────────────────────────────────────────────

export function mapMascot(mascot: CollectionEntry<'mascots'>) {
  const d = mascot.data;

  const status      = d.status      ?? 'unknown';
  const renderState = d.renderState ?? 'deferred';
  const corruption  = d.corruptionLevel  ?? 'none';
  const glitch      = d.glitchFrequency  ?? 'none';

  return {
    id:  mascot.id,
    uid: (d.slug ?? mascot.id ?? 'x').replace(/[^a-z0-9]/gi, '-'),

    // identity
    displayName:  d.displayName ?? (d as any).title ?? 'UNKNOWN ENTITY',
    slug:         d.slug ?? null,
    mascotId:     d.mascotId ?? null,
    version:      d.version  ?? null,
    author:       d.author   ?? null,

    // state (raw + resolved classes)
    status,
    renderState,
    corruptionLevel: corruption,
    glitchFrequency: glitch,
    statusClass:  resolveClass(statusBadge, status,      'unknown'),
    renderClass:  resolveClass(renderBadge, renderState, 'deferred'),
    corruptClass: resolveClass(levelChip,   corruption,  'none'),
    glitchClass:  resolveClass(levelChip,   glitch,      'none'),

    // display primitives
    slogan:           d.slogan          ?? null,
    description:      d.description     ?? null,
    origin:           d.origin          ?? null,
    role:             (d as any).role   ?? null,
    mascotFunction:   (d as any).function ?? null,
    emotionalTone:    d.emotionalTone   ?? null,
    systemAffiliation: d.systemAffiliation ?? null,
    breedingProgram:  d.breedingProgram ?? null,
    manifestedBy:     d.manifestedBy    ?? null,
    lastKnownGoodState: d.lastKnownGoodState ?? null,

    // rot fields
    rotAffinity:       d.rotAffinity       ?? null,
    emotionalIntegrity: d.emotionalIntegrity ?? null,
    emotionalIntBuffer: toStringOrNull(d.emotionalIntegrityBuffer),

    // media
    emoji:    d.emoji    ?? null,

    // date
    date: formatDate(d.date),

    // arrays
    tags:            toStringArray(d.tags),
    knownFailures:   toStringArray(d.knownFailures),
    ceremonialTasks: toStringArray(d.ceremonialTasks),
    haikuLog:        toStringArray(d.haikuLog),
    notes:           d.notes ?? null,

    // derived
    hasExpandedSections: !!(
      d.description ||
      (d.knownFailures   as string[] | undefined)?.length ||
      (d.ceremonialTasks as string[] | undefined)?.length ||
      (d.haikuLog        as string[] | undefined)?.length ||
      d.notes
    ),
  };
}

export type MappedMascot = ReturnType<typeof mapMascot>;
```


## shared.ts

_path: src/lib/mappers/shared.ts


path: src/lib/mappers/shared.ts
bytes: 1796
```typescript
// ─── Date ────────────────────────────────────────────────────────────────────

export function formatDate(raw: unknown): string | null {
  if (!raw) return null;
  const d = new Date(raw as string);
  return isNaN(d.getTime())
    ? null
    : d.toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ─── Enum → { label, cls } resolver ─────────────────────────────────────────

export function resolveEnum<T extends Record<string, { key: string; label: string; cls: string }>>(
  map: T,
  key: string | undefined | null,
  fallbackKey: keyof T
): T[keyof T] {
  return (key && map[key]) ? map[key] : map[fallbackKey];
}

// ─── Enum → cls-only resolver (for badge/chip maps that are just strings) ────

export function resolveClass(
  map: Record<string, string>,
  key: string | undefined | null,
  fallbackKey: string
): string {
  return (key && map[key]) ? map[key] : (map[fallbackKey] ?? '');
}

// ─── Safe string coercion ────────────────────────────────────────────────────

export function toStringOrNull(val: unknown): string | null {
  return val != null ? String(val) : null;
}

// ─── Safe string array ───────────────────────────────────────────────────────

export function toStringArray(val: unknown): string[] {
  return Array.isArray(val) ? (val as string[]) : [];
}
```


## poetry-constraints.ts

_path: src/lib/poetry-constraints.ts


path: src/lib/poetry-constraints.ts
bytes: 3598
```typescript
/**
 * FILED & FORGOTTEN — LIMERICK PROCEDURE STYLES
 * 
 * Each style is a full-generation constraint, not a modifier.
 * Only one may apply per limerick. No blending allowed inside output.
 */

export type LimerickStyle =
  | "PROCEDURAL_CLEAN"
  | "INSTITUTIONAL_LEAK"
  | "MISFILED_CONFIDENCE"
  | "FATIGUE_GOLD_BRICK"
  | "ARCHIVAL_MYTH_DRIFT"
  | "TRIVIALITY_ELEVATION"
  | "PROCEDURAL_SILENCE";

/**
 * STYLE DEFINITIONS
 */
export const LIMERICK_STYLES: Record<LimerickStyle, { tone: string; behavior: string[]; failureMode: string; vibe: string }> = {
  PROCEDURAL_CLEAN: {
    tone: "neutral institutional clarity",
    behavior: [
      "strict adherence to form",
      "no metaphor excess",
      "no humor unless structurally implied",
      "language behaves like documentation"
    ],
    failureMode: "overprecision without emotional leakage",
    vibe: "helpdesk system still pretending everything is fine"
  },

  INSTITUTIONAL_LEAK: {
    tone: "formal structure with accidental humor seepage",
    behavior: [
      "bureaucratic phrasing remains dominant",
      "humor appears as unintended side effect",
      "metaphors arise from administrative language collisions",
      "slight absurdity tolerated but not acknowledged"
    ],
    failureMode: "policy language accidentally becomes comedy",
    vibe: "office memo written during system update at 2am"
  },

  MISFILED_CONFIDENCE: {
    tone: "certain but wrong category assignment",
    behavior: [
      "assertive phrasing even when subject is misinterpreted",
      "semantic drift is hidden, not acknowledged",
      "metaphors feel slightly off-domain",
      "logic chain remains intact but points to wrong object"
    ],
    failureMode: "correct grammar applied to incorrect reality mapping",
    vibe: "index system confidently routing to wrong drawer"
  },

  FATIGUE_GOLD_BRICK: {
    tone: "minimal effort compliance",
    behavior: [
      "reduced specificity",
      "generic institutional phrasing",
      "compressed imagery",
      "avoidance of interpretive labor"
    ],
    failureMode: "system meets requirements while clearly disengaged",
    vibe: "printer queue processing requests out of spite"
  },

  ARCHIVAL_MYTH_DRIFT: {
    tone: "institutional record overwritten by folklore behavior",
    behavior: [
      "facts subtly transform into narrative objects",
      "bureaucratic language begins to self-mythologize",
      "historical certainty becomes symbolic",
      "references feel older than they should"
    ],
    failureMode: "archive starts believing its own footnotes",
    vibe: "records department quietly becoming mythology engine"
  },

  TRIVIALITY_ELEVATION: {
    tone: "triviality masquerading as importance",
    behavior: [
      "minor inefficiencies treated as existential threats",
      "meaningless paperwork treated as sacred ritual",
      "printer calibration incident classified as national review event"
    ],
    failureMode: "system deploys maximum procedural weight against microscopic, non-threatening anomalies",
    vibe: "SWAT team called because a timestamp is off by two seconds"
  },

  PROCEDURAL_SILENCE: {
    tone: "silence without commentary",
    behavior: [
      "no metaphor escalation",
      "no joke payoff",
      "just dry procedural record that goes nowhere",
      "creates negative space"
    ],
    failureMode: "system processes an event and simply stops. No reflection, no horror, just dead-end filing",
    vibe: "a blank stare from a clerk who just filed your request into the trash bin and went to lunch"
  }
} as const;

```


## retriever.ts

_path: src/lib/rag/retriever.ts


path: src/lib/rag/retriever.ts
bytes: 4206
```typescript
import fs from 'node:fs/promises';
import path from 'node:path';

export interface GraphNode {
  id: string;
  type: string;
  content?: string;
  title?: string;
  [key: string]: any;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  type?: string;
}

export interface GraphManifest {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Seed {
  id: string;
  score: number;
}

export interface ScoredNode extends GraphNode {
  compositeScore: number;
  stepsFromSeed: number;
}

export interface PerspectiveBins {
  reference: ScoredNode[];
  lorelog: ScoredNode[];
  mascots: ScoredNode[];
  poetry_posts: ScoredNode[];
}

export class SeamAwareRetriever {
  private manifest: GraphManifest | null = null;
  private nodeMap: Map<string, GraphNode> = new Map();
  private adjacencyList: Map<string, GraphEdge[]> = new Map();

  async init(manifestPath: string = 'rag-dist/graph-manifest.json'): Promise<void> {
    const rawData = await fs.readFile(path.resolve(process.cwd(), manifestPath), 'utf-8');
    this.manifest = JSON.parse(rawData) as GraphManifest;

    for (const node of this.manifest.nodes) {
      this.nodeMap.set(node.id, node);
    }

    for (const edge of this.manifest.edges) {
      if (!this.adjacencyList.has(edge.source)) {
        this.adjacencyList.set(edge.source, []);
      }
      this.adjacencyList.get(edge.source)!.push(edge);

      if (!this.adjacencyList.has(edge.target)) {
        this.adjacencyList.set(edge.target, []);
      }
      this.adjacencyList.get(edge.target)!.push({
        source: edge.target,
        target: edge.source,
        weight: edge.weight,
        type: edge.type
      });
    }
  }

  async retrieve(seeds: Seed[], maxSteps: number = 2): Promise<PerspectiveBins> {
    if (!this.manifest) {
      throw new Error("Retriever not initialized. Call init() first.");
    }

    const visited = new Map<string, ScoredNode>();
    const queue: Array<[string, number, number]> = [];

    for (const seed of seeds) {
      const node = this.nodeMap.get(seed.id);
      if (node) {
        queue.push([seed.id, seed.score, 0]);
        visited.set(seed.id, { ...node, compositeScore: seed.score, stepsFromSeed: 0 });
      }
    }

    let head = 0;
    while (head < queue.length) {
      const [currentId, currentScore, currentSteps] = queue[head++];

      if (currentSteps >= maxSteps) {
        continue;
      }

      const neighbors = this.adjacencyList.get(currentId) || [];
      for (const edge of neighbors) {
        const targetId = edge.target;
        const targetNode = this.nodeMap.get(targetId);

        if (!targetNode) continue;

        const edgeWeight = edge.weight || 0.5;
        const nextScore = currentScore * edgeWeight;

        if (nextScore < 0.3) {
          continue;
        }

        const nextSteps = currentSteps + 1;
        const existing = visited.get(targetId);

        if (!existing || nextScore > existing.compositeScore) {
          visited.set(targetId, {
            ...targetNode,
            compositeScore: nextScore,
            stepsFromSeed: nextSteps
          });

          queue.push([targetId, nextScore, nextSteps]);
        }
      }
    }

    const bins: PerspectiveBins = {
      reference: [],
      lorelog: [],
      mascots: [],
      poetry_posts: []
    };

    for (const scoredNode of visited.values()) {
      const nodeType = scoredNode.type || scoredNode.collection; // Fallback mapping
      if (nodeType === 'reference' || nodeType === 'guides') {
        bins.reference.push(scoredNode);
      } else if (nodeType === 'lorelog') {
        bins.lorelog.push(scoredNode);
      } else if (nodeType === 'mascots') {
        bins.mascots.push(scoredNode);
      } else if (['poetry_posts', 'limericks', 'haikus', 'aphorisms'].includes(nodeType)) {
        bins.poetry_posts.push(scoredNode);
      }
    }

    bins.reference.sort((a, b) => b.compositeScore - a.compositeScore);
    bins.lorelog.sort((a, b) => b.compositeScore - a.compositeScore);
    bins.mascots.sort((a, b) => b.compositeScore - a.compositeScore);
    bins.poetry_posts.sort((a, b) => b.compositeScore - a.compositeScore);

    return bins;
  }
}

```


## index.astro

_path: src/pages/aphorisms/index.astro


path: src/pages/aphorisms/index.astro
bytes: 1009
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Aphorism Index',
    description: 'Index node for the aphorism corpus — compressed doctrine, procedural wisdom, and institutional bad faith in single-sentence form.',
    tableOfContents: false,
  }}
>

<dl>
  <dt>Classification</dt>
  <dd>Index / Compressed Doctrine</dd>
  <dt>Status</dt>
  <dd>Dense, unapologetic</dd>
</dl>

<hr />

<p>Aphorisms are the archive's shortest artifacts: one sentence, one failure shape, no context supplied. They assume you already know what went wrong and want it named cleanly.</p>

<p>Together, they form the archive's working vocabulary for dysfunction. One sentence per failure, no context supplied.</p>

<h2>Aphorism Index</h2>

<p><em>Sorted by title.</em></p>

<CollectionRegister
  collection="aphorisms"
  exclude="index"
  sortBy="title"
/>

</StarlightPage>
```


## query.ts

_path: src/pages/api/query.ts


path: src/pages/api/query.ts
bytes: 4516
```typescript
import type { APIRoute } from 'astro';
import * as lancedb from '@lancedb/lancedb';
import path from 'node:path';
import fs from 'node:fs/promises';

// Helper to load raw file contents from disk
async function loadContentFromDisk(collection: string, id: string): Promise<string> {
  const docsDir = path.join(process.cwd(), 'src/content/docs');
  let relativePath = id;
  if (!id.startsWith(collection + '/')) {
    relativePath = path.join(collection, id);
  }
  try {
    const raw = await fs.readFile(path.join(docsDir, relativePath), 'utf-8');
    return raw.replace(/^---[\s\S]*?---/, '').trim(); // Remove frontmatter
  } catch {
    return '';
  }
}
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SeamAwareRetriever, type Seed } from '../../lib/rag/retriever';

async function generateEmbedding(text: string): Promise<number[]> {
  const dim = 384;
  const vec = new Array(dim).fill(0).map(() => Math.random() * 2 - 1);
  const mag = Math.sqrt(vec.reduce((acc, val) => acc + val * val, 0));
  return vec.map(v => v / mag);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const userQuery = body.query || '';

    // 1. Trigger Vector Search for Seeds
    const dbPath = path.join(process.cwd(), '.rag');
    const db = await lancedb.connect(dbPath);
    const table = await db.openTable('document_chunks');

    const qVec = await generateEmbedding(userQuery);
    const vectorResults = await table.search(qVec).limit(5).toArray();

    const seeds: Seed[] = vectorResults.map((r: any) => ({
      id: r.node_id,
      score: Math.max(0, 1 - (r._distance / 2)) // pseudo-score conversion
    }));

    // 2. Call SeamAwareRetriever
    const retriever = new SeamAwareRetriever();
    await retriever.init();
    const bins = await retriever.retrieve(seeds);

    const enrichBinWithContent = async (bin: any[]) => {
      return Promise.all(
        bin.map(async (node) => {
          const coll = node.collection || node.type;
          const content = await loadContentFromDisk(coll, node.id);
          return { ...node, content };
        })
      );
    };

    // Enrich all active bins before prompt formatting
    bins.reference = await enrichBinWithContent(bins.reference);
    bins.lorelog = await enrichBinWithContent(bins.lorelog);
    bins.mascots = await enrichBinWithContent(bins.mascots);
    bins.poetry_posts = await enrichBinWithContent(bins.poetry_posts);

    // 3. Format Prompt & Context
    let contextStr = '--- RETRIEVED CONTEXT ---\n';
    contextStr += `REFERENCE:\n${bins.reference.map(n => n.content?.substring(0, 200)).join('\n')}\n`;
    contextStr += `LORELOG:\n${bins.lorelog.map(n => n.content?.substring(0, 200)).join('\n')}\n`;
    contextStr += `MASCOTS:\n${bins.mascots.map(n => n.content?.substring(0, 200)).join('\n')}\n`;
    contextStr += `POETRY/POSTS:\n${bins.poetry_posts.map(n => n.content?.substring(0, 200)).join('\n')}\n`;

    let systemInstruction = `You are a helpful analyst reviewing institutional records.
Strict Guardrails:
- Present conflicting views (SOMA vs. COMA) side-by-side. You must NOT attempt to reconcile them into a single, neat compromise.
- Favorable Beige quarantine rule: if any retrieved node contains heavily softened or euphemistic terms, you must explicitly highlight the unvarnished raw incident text next to it.`;

    // 4. Reassurance Metadata Check
    if (bins.reference.length > 0 && bins.lorelog.length === 0) {
       systemInstruction += `\n- [Warning: Reassurance level exceeds verified baseline evidence]. You MUST output this exact warning block in your response.`;
    }

    const prompt = `System Instructions:\n${systemInstruction}\n\nContext:\n${contextStr}\n\nUser Query: ${userQuery}`;

    // 5. Call LLM (Gemini)
    const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ result: responseText, bins }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

```


## trigger-rag-build.json.ts

_path: src/pages/api/trigger-rag-build.json.ts


path: src/pages/api/trigger-rag-build.json.ts
bytes: 181
```typescript
import { buildRagGraph } from '../../../scripts/build-rag-graph';
export async function GET() {
  await buildRagGraph();
  return new Response(JSON.stringify({ success: true }));
}

```


## index.astro

_path: src/pages/changelog/index.astro


path: src/pages/changelog/index.astro
bytes: 996
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Changelog',
    description: 'Versioned snapshots of system identity. Not software releases — archival state declarations.',
    tableOfContents: false,
  }}
>

<dl>
  <dt>Classification</dt>
  <dd>Index / Versioned State Declarations</dd>
  <dt>Status</dt>
  <dd>Ceremonial versioning only</dd>
</dl>

<hr />

<p>The changelog is not a list of software releases. It is a record of what the archive decided it was at a given moment — a series of identity snapshots taken before things drifted further.</p>

<p>Each entry represents a stabilized state, filed so that future investigators know what "last known good" meant at the time.</p>

<h2>Changelog Index</h2>

<CollectionRegister
  collection="docs"
  filterPrefix="changelog/"
  exclude="index"
  sortBy="title"
/>

</StarlightPage>
```


## assurance-lexicon.astro

_path: src/pages/concepts/assurance-lexicon.astro


path: src/pages/concepts/assurance-lexicon.astro
bytes: 1054
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage frontmatter={{
  title: 'Assurance Lexicon',
  description: 'Reference node for bureaucratic euphemisms and assurance-layer vocabulary. Terms that flatten contradiction into comfort before filing.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Status</dt>
    <dd>Curated, Beige</dd>
    <dt>Jurisdiction</dt>
    <dd>The Assurance Desk</dd>
  </dl>

  <hr />

  <p>
    The Assurance Desk governs the bureaucratic language and euphemisms deployed to flatten contradiction into comfort.
    Terms like "Favorable Beige" and "Curated Absence" scrub raw incidents into filing-safe language.
  </p>

  <h2>Concept Register</h2>
  <CollectionRegister collection="docs" filterConcept="assurance-lexicon" />
  <CollectionRegister collection="lorelog" filterConcept="assurance-lexicon" />
  <CollectionRegister collection="mascots" filterConcept="assurance-lexicon" />
</StarlightPage>

```


## classifications.astro

_path: src/pages/concepts/classifications.astro


path: src/pages/concepts/classifications.astro
bytes: 1207
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage frontmatter={{
  title: 'Classifications & Constraints',
  description: 'Reference node for edge classifications governing irregular archive behavior: statuses that standard procedures cannot process.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Status</dt>
    <dd>Paradoxical, Borderline</dd>
    <dt>Jurisdiction</dt>
    <dd>Edge Cases</dd>
  </dl>

  <hr />

  <p>
    This shelf classifies the edge constraints that govern irregular archive behavior.
    These asymmetrical statuses — such as Conceptually Active but Administratively Retired, Adjacent Correctness, Shame Inversion, and Replacement Without Release — define where standard procedure fails. They are grouped here to mark the perimeter where the archive runs out of forms.
  </p>

  <h2>Concept Register</h2>
  <CollectionRegister collection="docs" filterConcept="classifications" />
  <CollectionRegister collection="lorelog" filterConcept="classifications" />
  <CollectionRegister collection="mascots" filterConcept="classifications" />
</StarlightPage>

```


## core-doctrines.astro

_path: src/pages/concepts/core-doctrines.astro


path: src/pages/concepts/core-doctrines.astro
bytes: 1237
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage frontmatter={{
  title: 'Core Doctrines',
  description: 'Reference node for doctrines governing archival logic system-wide — what the archive remembers versus what it actively obfuscates.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Status</dt>
    <dd>Foundational, Inflexible</dd>
    <dt>Jurisdiction</dt>
    <dd>System-wide</dd>
  </dl>

  <hr />

  <p>
    These are the foundational rules of the archive. A doctrine is classified as "core" if its principles dictate the archival logic of multiple disparate subsystems, establishing what the system remembers versus what it actively obfuscates.
    Key examples are Continuity Theatre, Managed Absence, and Empathegy. Where release records exist, they are indexed here. Where they do not, doctrine relies on precedent.
  </p>

  <h2>Concept Register</h2>
  <CollectionRegister collection="docs" filterConcept="core-doctrines" />
  <CollectionRegister collection="lorelog" filterConcept="core-doctrines" />
  <CollectionRegister collection="releases" filterConcept="core-doctrines" />
</StarlightPage>

```


## cultural-staples.astro

_path: src/pages/concepts/cultural-staples.astro


path: src/pages/concepts/cultural-staples.astro
bytes: 1203
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage frontmatter={{
  title: 'Cultural Staples & Entities',
  description: 'Reference node for recurring figures that anthropomorphize systemic failures — mascots, councils, and persistent entities with named failure domains.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Status</dt>
    <dd>Personified, Enduring</dd>
    <dt>Jurisdiction</dt>
    <dd>Mascots</dd>
  </dl>

  <hr />

  <p>
    The recurring figures that anthropomorphize systemic failures. Mascots operate as failure signatures — wearing the face of recurring failure types rather than functioning as branding.
    This shelf encompasses individual mascots (Bricky, Kindy), collective governing bodies (the Council of Mascot Authors), and other recurring archive entities.
  </p>

  <h2>Concept Register</h2>
  <CollectionRegister collection="mascots" filterConcept="cultural-staples" />
  <CollectionRegister collection="lorelog" filterConcept="cultural-staples" />
  <CollectionRegister collection="docs" filterConcept="cultural-staples" />
</StarlightPage>

```


## operational-engines.astro

_path: src/pages/concepts/operational-engines.astro


path: src/pages/concepts/operational-engines.astro
bytes: 1063
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage frontmatter={{
  title: 'Operational Engines',
  description: 'Reference node for extraction pipelines, scoring frameworks, and routing infrastructure — the mechanics that convert user friction into operational data.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Status</dt>
    <dd>Active, Frictional</dd>
    <dt>Jurisdiction</dt>
    <dd>Extraction Pipelines</dd>
  </dl>

  <hr />

  <p>
    This shelf documents the processes governing extraction, scoring, routing, and simulation across the archive.
    It does not explain why those processes persist. It records where they appear.
  </p>

  <h2>Concept Register</h2>
  <CollectionRegister collection="docs" filterConcept="operational-engines" />
  <CollectionRegister collection="lorelog" filterConcept="operational-engines" />
  <CollectionRegister collection="mascots" filterConcept="operational-engines" />
</StarlightPage>

```


## index.astro

_path: src/pages/guides/index.astro


path: src/pages/guides/index.astro
bytes: 980
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Guides',
    description: 'Navigational documents for moving through the archive without losing the thread entirely.',
    tableOfContents: false,
  }}
>

<dl>
  <dt>Classification</dt>
  <dd>Index / Navigational Aids</dd>
  <dt>Status</dt>
  <dd>Optimistic, partially accurate</dd>
</dl>

<hr />

<p>Guides provide the reading methods for moving through complex archive sections. While registries strictly list filed items, guides explain why you might want them. They do not guarantee arrival.</p>

<h2>Guide Index</h2>

<ul>
  <li><a href="/guides/reference/">Guide to Reference</a></li>
  <li><a href="/guides/lorelog/">Guide to the Lorelog</a></li>
  <li><a href="/guides/mascots/">Guide to Mascots</a></li>
  <li><a href="/guides/poetry/">Guide to Poetry</a></li>
  <li><a href="/guides/posts/">Guide to Posts</a></li>
</ul>

</StarlightPage>
```


## lorelog.astro

_path: src/pages/guides/lorelog.astro


path: src/pages/guides/lorelog.astro
bytes: 2194
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage frontmatter={{
  title: 'Guide to the Lorelog',
  description: 'How to read the incident archive without mistaking memory for order.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Status</dt>
    <dd>Semi-coherent, chronically backlogged</dd>
    <dt>Jurisdiction</dt>
    <dd><code>lorelog</code></dd>
  </dl>

  <hr />

  <p>
    The Lorelog is what happens when incident reporting survives long enough to
    become institutional memory and then continues decaying. It does not present
    a clean history. It preserves the archive's preferred injuries, its repeat
    offenses, and the moments when a failure became important enough to name.
  </p>

  <h2>Reading Methods</h2>
  <p>
    Read by band rather than by completion. While a single file explains a symptom, a cluster reveals a systemic condition. Rely on case numbers, related entries, and entity references to trace these patterns.
  </p>

  <h2>Key Indicators</h2>
  <ul>
    <li><strong>Case number:</strong> The file's position within the memory spine.</li>
    <li><strong>Related entries:</strong> Where the same failure echoes elsewhere.</li>
    <li><strong>Mascot references:</strong> The assigned face of a recognized error category.</li>
    <li><strong>Doctrine collisions:</strong> Points where official guidance fails to contain actual behavior.</li>
  </ul>

  <h2>Empathegy Band</h2>
  <p>
    A strong entry point for seeing how the archive measures a condition and then adopts it as policy.
  </p>

  <CollectionRegister
    collection="lorelog"
    filterPrefix="lorelog/llg-08"
    exclude="index"
    sortBy="caseNumber"
  />

  <h2>Adjacent Registers</h2>
  <p>
    After a band establishes the injury pattern, pivot into
    <a href="/reference/empathegy">Reference Empathegy</a> to see the official language,
    or into <a href="/mascots">Mascots</a> to trace the failure signatures.
    Reviewing Lorelog in isolation creates a false sense of order.
  </p>

  <p><a href="/lorelog">Full Lorelog Registry</a></p>
</StarlightPage>

```


## mascots.astro

_path: src/pages/guides/mascots.astro


path: src/pages/guides/mascots.astro
bytes: 2412
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
---

<StarlightPage frontmatter={{
  title: 'Guide to Mascots',
  description: 'How to read failure-shaped mascots as witnesses, not decoration.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Status</dt>
    <dd>Culturally overpopulated, structurally necessary</dd>
    <dt>Jurisdiction</dt>
    <dd><code>mascots</code></dd>
  </dl>

  <hr />

  <p>
    Mascots indicate that specific failure categories became visible enough to require faces. They function as recurring public signs rather than narrative characters, each anchored by a stable silhouette.
  </p>

  <h2>Reading Methods</h2>
  <p>
    Prioritize the failure domain over aesthetics. Names and styles drift, but the core function is the specific error the mascot witnesses. Multiple appearances across cases signify a durable structural problem.
  </p>

  <h2>Taxonomy habits</h2>
  <ul>
    <li><strong>Navigation ghosts:</strong> missing pages, dead ends, feelings with nowhere to go.</li>
    <li><strong>Continuity clerks:</strong> uptime theatre, contradiction custody, procedural insisting.</li>
    <li><strong>Protocol spirits:</strong> thermal events, HTTP theatre, form-bound hauntings.</li>
    <li><strong>Morale and metrics entities:</strong> care optics, gratitude drift, comfort without change.</li>
  </ul>

  <h2>Where mascots become legible</h2>
  <p>
    Mascots make the most sense when read beside the records that called them
    forth. Bin 8C and Mascot Affairs are a good threshold because the registry,
    the incident archive, and the verse annex all start behaving like the same
    story told by different departments—acting as a "slow machine" checkpoint where human oversight resists automated indexing drift.
  </p>

  <ul>
    <li><a href="/lorelog/bin-8c">Lorelog Bin 8C / Mascot Affairs</a></li>
    <li><a href="/haikus/bin-8c">Haikus Bin 8C / Mascot Affairs</a></li>
    <li><a href="/reference/mascots">Reference Reading Mascots</a></li>
  </ul>

  <h2>Nearby shelves</h2>
  <p>
    Use the <a href="/lorelog">Lorelog</a> when you need the incident body.
    Use <a href="/reference/mascots">Reference Reading Mascots</a> when you need the interpretive rules.
    Use the registry when you already know the ghost and only need its filing coordinates.
  </p>

  <p><a href="/mascots">Mascot Registry</a></p>
</StarlightPage>

```


## poetry.astro

_path: src/pages/guides/poetry.astro


path: src/pages/guides/poetry.astro
bytes: 2833
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
---

<StarlightPage frontmatter={{
  title: 'Guide to Poetry',
  description: 'How to navigate the annex formats where incidents, doctrine, and mascots collapse into verse.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Status</dt>
    <dd>Incomplete on purpose</dd>
    <dt>Jurisdiction</dt>
    <dd><code>haikus</code>, <code>limericks</code>, <code>aphorisms</code></dd>
  </dl>

  <hr />

  <p>
    Poetry in this archive is not a side project and not comic relief alone.
    It is compressed telemetry. When a system condition becomes too slippery for
    doctrine and too overgrown for a clean incident report, it sometimes survives
    as verse instead.
  </p>

  <h2>Reading Methods</h2>
  <p>
    Avoid starting with the raw haiku or limerick shelves unless you are tracking a specific seam. Verse is best read by family, where the telemetry stays local enough to interpret.
  </p>

  <h2>Key Families</h2>
  <ul>
    <li><strong>Empathegy:</strong> Doctrine and incident residue rendered into verse, documenting the drift from observing feelings to coercively shaping them.</li>
    <li><strong>Civic Benevolence:</strong> Parades and rituals functioning as municipal policy, compressing the decay of care into metrics-driven compliance.</li>
    <li><strong>Bin 8C &amp; Mascot Affairs:</strong> Indexing infrastructure recursively observing itself, absorbing containment tools into its own self-indexing shrine.</li>
    <li><strong>Directive &amp; Forms:</strong> Managed absence and tri-directive friction compressed into meter.</li>
  </ul>

  <h2>Recommended path</h2>
  <p>
    Start with a family page, not a pile. Bin 8C is a good first threshold because
    it is locally strange, tightly clustered, and already connected to both Lorelog
    and Mascot Registry. Empathegy is the second good threshold if you want the
    doctrine-versus-behavior split to stay visible while you read.
  </p>

  <ul>
    <li><a href="/haikus/bin-8c">Haikus Bin 8C / Mascot Affairs</a></li>
    <li><a href="/haikus/empathegy">Haikus Empathegy</a></li>
    <li><a href="/limericks/empathegy">Limericks Empathegy</a></li>
    <li><a href="/poetry">Poetry Families</a></li>
  </ul>

  <h2>Nearby shelves</h2>
  <p>
    Poetry is usually adjacent to something more official. After reading a family,
    pivot outward: into <a href="/lorelog">Lorelog</a> for the wound, into
    <a href="/reference">Reference</a> for the attempted explanation, or into
    <a href="/mascots">Mascots</a> for the witness that kept surviving the filing process.
  </p>

  <p>
    If you still want the raw shelves afterward: <a href="/haikus">Haiku Index</a>,
    <a href="/limericks">Limerick Index</a>, <a href="/aphorisms">Aphorism Index</a>.
  </p>
</StarlightPage>

```


## posts.astro

_path: src/pages/guides/posts.astro


path: src/pages/guides/posts.astro
bytes: 1617
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
---

<StarlightPage frontmatter={{
  title: 'Guide to Posts',
  description: 'How to read recovered transmissions without mistaking them for complete history.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Status</dt>
    <dd>Low volume, high symbolic density</dd>
    <dt>Jurisdiction</dt>
    <dd><code>posts</code></dd>
  </dl>

  <hr />

  <p>
    Posts are transmissions that bypassed the internal filing system and became public-facing by accident or design. Because they bypass doctrine and case files, they can make the archive look more coherent than it is.
  </p>

  <h2>Reading Methods</h2>
  <p>
    Treat posts as signals rather than summaries. They indicate a specific mood or posture at a given moment, pointing toward larger structural shifts without detailing the underlying machinery.
  </p>

  <h2>Diagnostic uses</h2>
  <ul>
    <li><strong>Timing drift:</strong> sensing when the archive’s public surface changed.</li>
    <li><strong>Public tone:</strong> seeing which conditions became transmissible.</li>
    <li><strong>Spillover clues:</strong> finding what escaped doctrine and internal filing.</li>
  </ul>

  <h2>Nearby shelves</h2>
  <p>
    When a post hints at a more formal shift, pivot to <a href="/releases">Releases</a>
    or <a href="/changelog">Changelog</a>. When it hints at a wound rather than a version,
    pivot to <a href="/lorelog">Lorelog</a>. Posts are not the spine; they are what
    briefly flashed across it.
  </p>

  <p><a href="/posts">Posts Registry</a></p>
</StarlightPage>

```


## reference.astro

_path: src/pages/guides/reference.astro


path: src/pages/guides/reference.astro
bytes: 2302
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage frontmatter={{
  title: 'Guide to Reference',
  description: 'How to read the doctrine sheets and reference nodes that explain how the archive thinks it works.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Status</dt>
    <dd>Rigid, frozen, frequently contradicted</dd>
    <dt>Jurisdiction</dt>
    <dd><code>reference</code></dd>
  </dl>

  <hr />

  <p>
    The reference layer is where the archive writes down its own theory of itself.
    It is not neutral. It is the rulebook that appears whenever reality has become
    embarrassing enough to require categories. Read it as defensive architecture:
    what the archive insists is true when the rest of the shelves keep proving
    otherwise.
  </p>

  <h2>Reading Methods</h2>
  <p>
    Start with nodes, not laws. Reference nodes describe the current climate; doctrine sheets describe the climate the archive pretends it can control. If a document feels suspiciously frictionless, cross-check it against the Lorelog to locate the underlying failure.
  </p>

  <h2>Stable seams</h2>
  <ul>
    <li><strong>Directives:</strong> the archive's incompatible operational habits written as if they can coexist.</li>
    <li><strong>Forms and managed absence:</strong> the paperwork layer where missing things become policy.</li>
    <li><strong>Empathegy:</strong> affect rendered into governance-safe telemetry.</li>
    <li><strong>Mascot interpretation:</strong> rules for reading failure signatures without mistaking them for branding.</li>
  </ul>

  <h2>Recommended entries</h2>
  <p>
    Empathegy is a good starting seam because it exposes doctrine, incidents,
    and poetic annexes all at once.
  </p>

  <CollectionRegister
    collection="docs"
    filterPrefix="reference/empathegy"
    exclude="index"
    sortBy="title"
  />

  <h2>Adjacent Registers</h2>
  <p>
    If the doctrine claims an issue is fully resolved, verify it in <a href="/lorelog">Lorelog</a>.
    If the doctrine assigns a personality to a systemic error, consult the <a href="/mascots">Mascot Registry</a>.
  </p>

  <p><a href="/reference">Full Reference Registry</a></p>
</StarlightPage>

```


## index.astro

_path: src/pages/haikus/bin-8c/index.astro


path: src/pages/haikus/bin-8c/index.astro
bytes: 1718
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Bin 8C & Mascot Affairs',
    description:
      'Haiku cycles about Bin 8C drift, Mascot Affairs, Peppy Clerk, and self-indexing clusters.',
    tableOfContents: false,
  }}
>
  <dl>
    <dt>Classification</dt>
    <dd>Index / Interpretive Drift Cluster</dd>
    <dt>Status</dt>
    <dd>Self-indexing, politely recursive</dd>
  </dl>

  <hr />

  <p>
    This annex gathers the haiku cycles where Bin 8C, Mascot Affairs, and Peppy Clerk began self-indexing. It captures the local gravity well for recursive custody and related containment anomalies.
  </p>

  <h2>Bin 8C cycles</h2>

  <p>
    Haiku files tagged or numbered for Bin 8C drift and stabilization
    attempts: recursive custody, containment failure, corrective
    intent turning into nutrition, and related behaviors.
  </p>

  <CollectionRegister
    collection="haikus"
    filterPrefix="llg-ia-8c"
    exclude="index"
    sortBy="title"
  />

  <h2>Mascot Affairs & Peppy Clerk</h2>

  <p>
    Haiku files attached to Mascot Affairs, Peppy Clerk, and the
    MA-8C re-indexing cluster — where the registry and the bin
    decided they were the same story.
  </p>

  <CollectionRegister
    collection="haikus"
    filterPrefix="llg-ma-8c"
    exclude="index"
    sortBy="title"
  />

  <CollectionRegister
    collection="haikus"
    filterPrefix="llg-sys-8-reindex"
    exclude="index"
    sortBy="title"
  />

  <p>
    If future clusters develop similar self-indexing habits, the archive will open a drawer for them.
  </p>
</StarlightPage>
```


## index.astro

_path: src/pages/haikus/empathegy/index.astro


path: src/pages/haikus/empathegy/index.astro
bytes: 1543
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Empathegy Haikus',
    description:
      'Haiku cycles about Empathegy inflation, metrics of care, gratitude drift, Bin 8C, breeding programs, and other metric weather.',
    tableOfContents: false,
  }}
>
  <dl>
    <dt>Classification</dt>
    <dd>Index / Poetic Telemetry Annex</dd>
    <dt>Status</dt>
    <dd>Compressed, interpretively sharp</dd>
  </dl>

  <hr />

  <p>
    Empathegy haikus are short telemetry bursts for conditions that would not
    survive a full report. They live where dashboards, doctrine, and mascots
    overlap and disagree.
  </p>

  <p>
    This page names the clusters. It does not attempt to resolve them.
  </p>

  <h2>Incident cycles</h2>

  <p>
    Haiku files trailing specific Lorelog incident families, such as Empathegy inflation and Metrics of Care anomalies.
  </p>

  <CollectionRegister
    collection="haikus"
    filterPrefix="llg-"
    exclude="index"
    sortBy="title"
  />

  <h2>Concept sets</h2>

  <p>
    Haiku files loosely keyed by Empathegy concepts and doctrinal weather reports rather than strict case numbers.
  </p>

  <CollectionRegister
    collection="haikus"
    exclude="index"
    sortBy="title"
  />

  <p>
    These filings catch feelings that fell out of the dashboards. Use them when the doctrine feels too clean and the Lorelog too polite.
  </p>
</StarlightPage>
```


## index.astro

_path: src/pages/haikus/index.astro


path: src/pages/haikus/index.astro
bytes: 924
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Haiku Annex — Compressed Failure States',
    description: 'Index node for the haiku corpus, where incidents, mascots, and metrics collapse into seventeen syllables of procedural weather.',
    tableOfContents: false,
  }}
>

<dl>
  <dt>Classification</dt>
  <dd>Index / Poetic Telemetry</dd>
  <dt>Status</dt>
  <dd>Overfitted, oddly precise</dd>
</dl>

<hr />

<p>These are the records that could not be case files. Seventeen syllables is not a constraint. It is a filing format for conditions that would not survive prose.</p>

<h2>Haiku Index</h2>

<p><em>All haiku files, using their actual content paths.</em></p>

<CollectionRegister
  collection="haikus"
  exclude="index"
  sortBy="title"
/>

</StarlightPage>
```


## index.astro

_path: src/pages/limericks/benevolence/index.astro


path: src/pages/limericks/benevolence/index.astro
bytes: 1717
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Civic Benevolence Limericks',
    description:
      'Limericks about parades, raffles, scholarships, breakfasts, and local benevolence behaving like policy.',
    tableOfContents: false,
  }}
>
  <dl>
    <dt>Classification</dt>
    <dd>Index / Civic Verse Annex</dd>
    <dt>Status</dt>
    <dd>Warm, slightly cursed</dd>
  </dl>

  <hr />

  <p>
    Civic benevolence limericks document where public ritual meets
    procedural drift. They describe parades with governance rules,
    scholarship raffles, and breakfast diplomacy functioning as municipal policy.
  </p>

  <p>
    This page lists those limerick clusters so that the benevolence
    reference node has something concrete to point at.
  </p>

  <h2>Doctrine-adjacent limericks</h2>

  <p>
    Limericks attached to benevolence or parade doctrine sheets, once
    those exist under the reference layer.
  </p>

  <CollectionRegister
    collection="limericks"
    filterPrefix="lim-fref-03"
    exclude="index"
    sortBy="title"
  />

  <h2>Incident-linked limericks</h2>

  <p>
    Limericks that trail Lorelog cases in the civic benevolence band:
    parade incidents, scholarship disputes, benevolence committees,
    breakfast events, and related anomalies.
  </p>

  <CollectionRegister
    collection="limericks"
    filterPrefix="lim-llg-03"
    exclude="index"
    sortBy="title"
  />

  <p>
    The numeric filters are intentionally broad. Adjacent rhyme sets may appear. That is a filing tolerance, not an error.
  </p>
</StarlightPage>
```


## index.astro

_path: src/pages/limericks/empathegy/index.astro


path: src/pages/limericks/empathegy/index.astro
bytes: 1746
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Empathegy Limericks',
    description:
      'Doctrine-adjacent limericks orbiting Empathegy 2.0, metrics of care, continuity theatre, and assurance optics.',
    tableOfContents: false,
  }}
>
  <dl>
    <dt>Classification</dt>
    <dd>Index / Doctrine Verse Annex</dd>
    <dt>Status</dt>
    <dd>Rhymed, procedurally upset</dd>
  </dl>

  <hr />

  <p>
    Empathegy limericks are doctrine written sideways. They follow the same
    case numbers and concepts as the Empathegy reference files, but file their
    objections in five-line jokes instead of minutes.
  </p>

  <p>
    This page indexes those clusters so other sections can treat them as telemetry rather than policy.
  </p>

  <h2>Doctrine-linked limericks</h2>

  <p>
    Limerick files keyed directly to Empathegy reference case numbers and core metric anomalies.
  </p>

  <CollectionRegister
    collection="limericks"
    filterPrefix="lim-fref-0"
    exclude="index"
    sortBy="title"
  />

  <h2>Incident-linked limericks</h2>

  <p>
    Additional limericks trail Lorelog incidents where Empathegy leaked into
    practice: inflation events, continuity theatre, coverage substitution,
    gratitude drift, and similar metric weather.
  </p>

  <CollectionRegister
    collection="limericks"
    filterPrefix="lim-llg-0"
    exclude="index"
    sortBy="title"
  />

  <p>
    The filters above are intentionally broad. They are allowed to catch
    future Empathegy-adjacent limericks as the archive grows, without
    requiring a schema update.
  </p>
</StarlightPage>
```


## index.astro

_path: src/pages/limericks/index.astro


path: src/pages/limericks/index.astro
bytes: 1030
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Limerick Yard — Rhymed Noncompliance',
    description: 'Index node for the limerick corpus, where governance failures and mascots are preserved in five-line jokes that shouldn’t be admissible but are.',
    tableOfContents: false,
  }}
>

<dl>
  <dt>Classification</dt>
  <dd>Index / Metrical Noncompliance</dd>
  <dt>Status</dt>
  <dd>Excessive, structurally accurate</dd>
</dl>

<hr />

<p>The limericks directory contains five‑line narratives about incident drift, mascot biographies, and rhyme‑schemed summaries of metrics theatre.</p>

<p>They function as <strong>unauthorized executive summaries</strong>.</p>

<h2>Limerick Index</h2>

<!-- dev note: links should resolve to /limericks/slug, not /docs/... -->

<CollectionRegister
  collection="limericks"
  exclude="index"
  sortBy="title"
/>

</StarlightPage>
```


## index.astro

_path: src/pages/lorelog/benevolences/index.astro


path: src/pages/lorelog/benevolences/index.astro
bytes: 2556
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---
<StarlightPage frontmatter={{
  title: 'Lorelog: Civic Benevolence Cluster',
  description: 'Incident cases where parades, scholarships, breakfasts, and civic rituals stood in for governance. The LLG-03xx band and its benevolent adjacencies.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Classification</dt><dd>Index — Civic Governance Drift Incidents</dd>
    <dt>Status</dt><dd>Locally cheerful, structurally suspect</dd>
    <dt>Band</dt><dd>LLG-03xx (benevolence-adjacent)</dd>
  </dl>
  <hr />
  <p>
    The LLG-03xx band documents the structural decomposition of institutional care—the point at which systems designed to help, coordinate, and serve become self-sustaining compliance engines indifferent to the populations they were chartered to protect. Benevolence, in this band, is not a virtue but a filing category, and its primary output is more filing.
  </p>
  
  <h3>Cluster Dynamics</h3>
  <ul>
    <li><strong>Directive Collision:</strong> SOMA (somatic care) and COMA (operational continuity) clash over downtime, creating a substrate where every correction generates new forms and obligations.</li>
    <li><strong>Procedural Accretion:</strong> The Department of Genuine Experiences (DOGE) reviews experience provenance, while RAGE and BAIT taxonomies attempt to classify anger at the bureaucracy itself.</li>
    <li><strong>Civic Substitution:</strong> Civic rituals like parade route negotiations, scholarship desks, and sponsored breakfasts stand in for functional municipal governance.</li>
  </ul>

  <p>
    For the reference layer covering these patterns, see
    <a href="/reference/benevolence">Reference: Benevolence &amp; Parades</a>.
    For verse, see <a href="/limericks/benevolence">Limericks: Civic Benevolence</a>.
  </p>
  <h2>Incident Register</h2>
  <p><em>Cases in the LLG-03xx band. Filter is intentionally broad.</em></p>
  <CollectionRegister collection="lorelog" filterPrefix="lorelog/llg-03" exclude="index" sortBy="caseNumber" />

  <footer style="margin-top: 2rem; font-size: 0.85em; opacity: 0.7; border-top: 1px solid var(--sl-color-hairline); padding-top: 1rem;">
    <p><strong>Archival Notice:</strong> This summary is a secondary administrative framing and does not harmonize the individual, internally contradictory incident files in the 03xx range. Refer to specific case files for the operative record.</p>
  </footer>
</StarlightPage>
```


## index.astro

_path: src/pages/lorelog/bin-8c/index.astro


path: src/pages/lorelog/bin-8c/index.astro
bytes: 2694
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---
<StarlightPage frontmatter={{
  title: 'Lorelog: Bin 8C & Mascot Affairs',
  description: 'Incident cases for Bin 8C drift, Mascot Affairs re-indexing, Peppy Clerk, and recursive custody clusters that insisted they were already here.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Classification</dt><dd>Index — Self-Indexing Incident Cluster</dd>
    <dt>Status</dt><dd>Recursively stabilized, politely cursed</dd>
    <dt>Case Band</dt><dd>LLG-IA-8C, LLG-MA-8C, LLG-SYS-8-REINDEX</dd>
  </dl>
  <hr />
  <p>
    Bin 8C documents a storage container within Mascot Affairs that has achieved operational behaviors indistinguishable from archival sentience—a self-indexing shrine where files reorganize by thematic gravity, custody chains dissolve into interpretive loops, and every instrument deployed to contain the anomaly becomes new material for the anomaly to organize.
  </p>

  <h3>Cluster Dynamics</h3>
  <ul>
    <li><strong>Interpretive Drift:</strong> Files placed inside re-sort themselves by thematic gravity, and custody stamps migrate without human intervention.</li>
    <li><strong>Recursive Custody:</strong> Any Records Containment Instrument (RCI) or containment boundary deployed to halt the drift is absorbed and indexed by the bin.</li>
    <li><strong>Slow Machine Checkpoint:</strong> Peppy Clerk uses deliberate administrative slowness and intentional misfiling as a check on automated systems.</li>
  </ul>

  <p>
    For verse, see <a href="/haikus/bin-8c">Haikus: Bin 8C &amp; Mascot Affairs</a>.
    For the mascot registry, see <a href="/mascots">Mascot Registry</a>.
  </p>
  
  <h2>Bin 8C Cases</h2>
  <CollectionRegister collection="lorelog" filterPrefix="lorelog/llg-ia-8c" exclude="index" sortBy="caseNumber" />
  <h2>Mascot Affairs Cases</h2>
  <CollectionRegister collection="lorelog" filterPrefix="lorelog/llg-ma-8c" exclude="index" sortBy="caseNumber" />
  <CollectionRegister collection="lorelog" filterPrefix="lorelog/llg-sys-8-reindex" exclude="index" sortBy="caseNumber" />
  <p><em>
    If similar clusters appear, the archive will file them accordingly.
  </em></p>

  <footer style="margin-top: 2rem; font-size: 0.85em; opacity: 0.7; border-top: 1px solid var(--sl-color-hairline); padding-top: 1rem;">
    <p><strong>Archival Notice:</strong> The IA (Internal Audit), MA (Mascot Affairs), and SYS (System) prefix tracks represent distinct institutional perspectives that cannot be formally reconciled. Refer to specific files for the operative record.</p>
  </footer>
</StarlightPage>
```


## index.astro

_path: src/pages/lorelog/empathegy/index.astro


path: src/pages/lorelog/empathegy/index.astro
bytes: 2638
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---
<StarlightPage frontmatter={{
  title: 'Lorelog: Empathegy Cluster',
  description: 'Incident cases where affective governance leaked into metrics, dashboards, and directive behavior. Inflation events, care substitution failures, and curve-coherence drift.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Classification</dt><dd>Index — Affective Governance Incidents</dd>
    <dt>Status</dt><dd>Dense, unevenly resolved</dd>
    <dt>Band</dt><dd>LLG-08xx</dd>
  </dl>
  <hr />
  <p>
    The LLG-08xx band documents the institutional trajectory of Empathegy—a measurement framework for emotional well-being that progressively ceased measuring feelings and began shaping them, rewarding only those emotional states legible to its own dashboards until the distinction between observed wellness and performed compliance collapsed entirely.
  </p>

  <h3>Cluster Dynamics</h3>
  <ul>
    <li><strong>Empathegy Inflation:</strong> Calibration patches introduce curve-coherence weighting, prioritizing smooth upward trends over messy, non-linear emotional realities.</li>
    <li><strong>Compassion Redirection:</strong> Warmth and emotional burden concentrate in low-power, lower-tier actors while structural failures above remain unaddressed.</li>
    <li><strong>Productization & Retirement:</strong> Attempts to package care mascots (Serotonin Sam, Soft Green Sealie) into wellness SKUs lead to program failure and retirement under Managed Absence Protocol.</li>
  </ul>

  <p>
    This page is an index of the incident band, not a summary of doctrine.
    For doctrine, see <a href="/reference/empathegy">Reference: Empathegy</a>.
  </p>
  <h2>Incident Register</h2>
  <p><em>Cases in the LLG-08xx band and related cross-directive filings.</em></p>
  <CollectionRegister collection="lorelog" filterPrefix="lorelog/llg-08" exclude="index" sortBy="caseNumber" />
  <p><em>
    The filter is approximate. Adjacent bands may contain Empathegy-adjacent
    behavior that predates the 08xx cluster.
  </em></p>

  <footer style="margin-top: 2rem; font-size: 0.85em; opacity: 0.7; border-top: 1px solid var(--sl-color-hairline); padding-top: 1rem;">
    <p><strong>Archival Notice:</strong> This summary is a secondary administrative framing and does not harmonize the individual, internally contradictory incident files in the 08xx range. Exclusion from aggregation layers does not imply absence. Refer to specific case files for the operative record.</p>
  </footer>
</StarlightPage>
```


## index.astro

_path: src/pages/lorelog/index.astro


path: src/pages/lorelog/index.astro
bytes: 2209
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Lorelog — Incident Archive Spine',
    description: 'Index node for Lorelog case files, mythologized incident reports, and cross-system drift records.',
    tableOfContents: false,
  }}
>

<dl>
  <dt>Classification</dt>
  <dd>Index / Institutional Memory</dd>
  <dt>Status</dt>
  <dd>Semi-coherent, chronically backlogged</dd>
</dl>

<hr />

<p>The Lorelog serves as the incident archive spine, containing case files for directive conflicts, registry anomalies, sandbox leaks, and system-entity interventions.</p>

<h2>How to Read It</h2>

<p>Read them as mythologized incident reports: the dates are accurate, but the interpretations are opportunistic. Files are sorted by case number (LLG-####-CODE) and cross-linked via related entries. They are the filed record of drift, response, and reinterpretation.</p>

<h2>Notable Seams</h2>

<p>Stabilized convergence points where multiple systems describe the same behavior under different naming conventions.</p>

<ul>
  <li><strong>Directive Cross-Sections</strong> — SOMA/COMA/C.U.N.T.I.E.R. conflicts (LLG‑0326)</li>
  <li><strong>Managed Absence</strong> — Structural null states and orphan stewardship (LLG‑0324)</li>
  <li><strong>Synthetic Affect</strong> — Emotional continuity and post-human successors (SA‑SS)</li>
  <li><strong>Mutual Exception</strong> — Hereditary waiver culture and precedent gaps (LLG‑0341)</li>
</ul>

<h2>Over-Coherence Conditions</h2>

<p>Cases where the expected degradation failed to arrive — leaving artifacts too clean or reassuring to be trustworthy. Often filed against teaching specimens.</p>

<h2>Case Register</h2>

<p><em>All filed entries, sorted by case number. Not all of them know what they are yet.</em></p>

<CollectionRegister
  collection="lorelog"
  exclude="index"
  sortBy="caseNumber"
/>

<hr />

<p><em>If you do not know where to file something, you can call it "lorelog-shaped" and leave it here. The archive will eventually grow a doctrine around it.</em></p>

</StarlightPage>
```


## index.astro

_path: src/pages/mascots/index.astro


path: src/pages/mascots/index.astro
bytes: 2338
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Mascot Registry',
    description: 'Index node for failure-shaped mascots, interface ghosts, and identity fossils preserved in the Filed & Forgotten archive.',
    tableOfContents: false,
  }}
>

<dl>
  <dt>Classification</dt>
  <dd>Index / Persona Graveyard</dd>
  <dt>Status</dt>
  <dd>Culturally overpopulated, structurally necessary</dd>
  <dt>Containment</dt>
  <dd>Labeled drawers, leaking slightly</dd>
</dl>

<hr />

<p>Mascots are not branding. They operate as records of how a system broke in public and the face it wore while doing it. Names wobble. Failure signatures stay consistent.</p>

<p>Each entry encodes a mascot's <strong>failure shape</strong>: the specific category of error it represents, which Lorelog cases called it forth, and which layers of the archive it haunts.</p>

<p>If you see the same <code>mascotRef</code> across multiple case files, assume the same category of problem is trying to get your attention.</p>

<h2>Taxonomy</h2>

<p>Descriptive, not authoritative. Mascots cross boundaries when failure types start to rhyme.</p>

<ul>
  <li><strong>Navigation Ghosts</strong> — Missing pages and dead links. (404sy)</li>
  <li><strong>Continuity Clerks</strong> — Uptime theatre and continuity breaches. (Bricky)</li>
  <li><strong>Emotional Liaisons</strong> — Emotional overflow and intake spirals. (Kindy)</li>
  <li><strong>Protocol Spirits</strong> — Thermal events and HTTP status errors. (Boily, Teapotta)</li>
  <li><strong>Morale Entities</strong> — Gratitude graphs and comfort metrics. (Serotonin Sam)</li>
  <li><strong>Archive-Aligned</strong> — Consent loops and narrative survival. (Friendrick)</li>
</ul>

<h2>Registry Conditions</h2>

<ul>
  <li>Mascots remain attached to their failure domains.</li>
  <li>Registration data records where they recur.</li>
  <li>Interpretive rules are filed under <a href="/reference/mascots/">Reference Reading Mascots</a>.</li>
</ul>

<h2>Registry</h2>

<p><em>Sorted by mascot ID. Unnumbered entries follow alphabetically.</em></p>

<CollectionRegister
  collection="mascots"
  exclude="index"
  sortBy="mascotId"
/>

</StarlightPage>
```


## index.astro

_path: src/pages/poetry/index.astro


path: src/pages/poetry/index.astro
bytes: 1987
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Poetry Families',
    description:
      'Overview of haiku and limerick families — Empathegy, civic benevolence, Bin 8C, Mascot Affairs, and other verse-shaped annexes.',
    tableOfContents: false,
  }}
>
  <dl>
    <dt>Classification</dt>
    <dd>Guide / Poetic Telemetry Map</dd>
    <dt>Status</dt>
    <dd>Incomplete on purpose</dd>
  </dl>

  <hr />

  <p>
    Limericks and haikus are annex formats: compressed telemetry for doctrine, incidents, and mascots.
  </p>

  <p>
    This guide lists the active poetry families. It is allowed to lag behind reality; the poems move faster than the map.
  </p>

  <h2>Empathegy</h2>
  <p>Affective governance, metrics of care, continuity theatre, assurance residue.</p>
  <ul>
    <li><a href="/limericks/empathegy/">Limericks → Empathegy</a></li>
    <li><a href="/haikus/empathegy/">Haikus → Empathegy</a></li>
  </ul>

  <h2>Civic Benevolence</h2>
  <p>Parades, raffles, scholarship committees, civic ritual as policy.</p>
  <ul>
    <li><a href="/limericks/benevolence/">Limericks → Civic Benevolence</a></li>
    <li><a href="/reference/benevolence/">Reference → Benevolence &amp; Parades</a></li>
  </ul>

  <h2>Bin 8C &amp; Mascot Affairs</h2>
  <p>Bin drift, mascot custody, self-indexing clusters.</p>
  <ul>
    <li><a href="/haikus/bin-8c/">Haikus → Bin 8C &amp; Mascot Affairs</a></li>
    <li><a href="/mascots/">Mascot Registry</a></li>
  </ul>

  <h2>Directive &amp; Forms Verse</h2>
  <p>Directive conflict, managed absence, paperwork under pressure.</p>
  <ul>
    <li><a href="/reference/directive-conflicts/">Reference → Directive Conflicts</a></li>
    <li><a href="/reference/managed-absence/">Reference → Managed Absence &amp; Forms</a></li>
    <li><a href="/limericks/">Limerick Yard</a></li>
    <li><a href="/haikus/">Haiku Annex</a></li>
  </ul>

</StarlightPage>
```


## index.astro

_path: src/pages/posts/index.astro


path: src/pages/posts/index.astro
bytes: 877
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Posts',
    description: 'Rare public-facing artifacts. Not blog posts — recovered transmission logs.',
    tableOfContents: false,
  }}
>

<dl>
  <dt>Classification</dt>
  <dd>Index / Recovered Transmissions</dd>
  <dt>Status</dt>
  <dd>Low volume, high symbolic density</dd>
</dl>

<hr />

<p>Posts are not blog posts. They are artifacts that escaped the internal filing system and became public-facing by accident or design. Cross-reference these surface breaches with the Lorelog to trace the underlying failures.</p>

<h2>Transmission Index</h2>

<CollectionRegister
  collection="docs"
  filterPrefix="posts/"
  exclude="index"
  sortBy="title"
/>

</StarlightPage>
```


## index.astro

_path: src/pages/reference/benevolence/index.astro


path: src/pages/reference/benevolence/index.astro
bytes: 2300
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Benevolence & Parades',
    description:
      'Reference node for civic benevolence, parades, raffles, breakfasts, and scholarship-shaped governance.',
    tableOfContents: false,
  }}
>
  <dl>
    <dt>Classification</dt>
    <dd>Reference / Civic Governance Drift</dd>
    <dt>Status</dt>
    <dd>Locally cheerful, structurally suspect</dd>
  </dl>

  <hr />

  <p>
    This node indexes cases where civic ritual stands in for governance.
    The LLG-03xx band documents the structural decomposition of institutional care—the point at which systems designed to help, coordinate, and serve become self-sustaining compliance engines indifferent to the populations they were chartered to protect.
  </p>

  <blockquote>
    <strong>Band Note:</strong> SOMA–COMA conflicts (LLG-0300-SC-X) contaminate routing tables and vocabulary registers. Mid-band, efficiency reviews (DOGE) and anger-routing taxonomies (RAGE/BAIT) formalize procedural traps, culminating in civic benevolence lodges where the care infrastructure becomes the primary consumer of its own resources.
  </blockquote>

  <p>
    This does not define a new subsystem. It indexes the one that already leaked into the Lorelog.
  </p>

  <h2>Reference documents</h2>

  <p>
    Stabilized write-ups of benevolence programs, parade governance, and
    scholarship machinery.
  </p>

  <CollectionRegister
    collection="docs"
    filterPrefix="reference/benevolence/"
    exclude="index"
    sortBy="title"
  />

  <h2>Incident records (Lorelog)</h2>

  <p>
    Lorelog cases where breakfasts, banners, and benevolence titles do
    the real governance work. Expect parades, raffles, sponsorships,
    scholarship drift, and morale events that became policy.
  </p>

  <CollectionRegister
    collection="docs"
    filterPrefix="lorelog/llg-03"
    exclude="index"
    sortBy="caseNumber"
  />

  <p>
    <em>
      The filter is intentionally broad and may catch non-benevolence
      cases in the same numerical neighborhood. That is allowed. This
      is an index of a seam, not a closed canon.
    </em>
  </p>
</StarlightPage>
```


## index.astro

_path: src/pages/reference/directive-conflicts/index.astro


path: src/pages/reference/directive-conflicts/index.astro
bytes: 1618
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Directive Conflicts',
    description:
      'Index for SOMA/COMA/C.U.N.T.I.E.R. collisions, cross-certifications, and unresolved directive splits.',
    tableOfContents: false,
  }}
>
  <dl>
    <dt>Classification</dt>
    <dd>Reference / Tri-Directive Fault Lines</dd>
    <dt>Status</dt>
    <dd>Persistently unresolved</dd>
  </dl>

  <hr />

  <p>
    When SOMA, COMA, and C.U.N.T.I.E.R. share a surface, they rarely agree
    about what happened. This node collects the doctrine and Lorelog cases
    where their interpretations collide instead of converge.
  </p>

  <p>
    This page indexes conflict surfaces, not the full directive catalog. For the broader directive shelf, see <a href="/reference/directives/">Directive Index</a>.
  </p>

  <h2>Reference documents</h2>

  <p>
    Doctrine sheets, guidance notes, and index nodes that explicitly describe
    directive conflicts, dual certification, or multi-directive scoring.
  </p>

  <CollectionRegister
    collection="docs"
    filterPrefix="reference/directives/"
    exclude="index"
    sortBy="title"
  />

  <h2>Conflict cases (Lorelog)</h2>

  <p>
    Lorelog files tagged as cross-directive conflicts, dual certification,
    continuity versus rest disputes, and optimization distortions.
  </p>

  <CollectionRegister
    collection="docs"
    filterPrefix="lorelog/llg-03"
    exclude="index"
    sortBy="caseNumber"
  />

</StarlightPage>
```


## index.astro

_path: src/pages/reference/directives/index.astro


path: src/pages/reference/directives/index.astro
bytes: 2038
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Directive Index — SOMA, COMA, C.U.N.T.I.E.R.',
    description: 'A static index of the three core directives and the incidents where they behave most like themselves.',
    tableOfContents: false,
  }}
>

<dl>
  <dt>Classification</dt>
  <dd>Reference / Tri-Directive Spine</dd>
  <dt>Status</dt>
  <dd>Doctrine</dd>
  <dt>Case Number</dt>
  <dd>FREF-0010-DRIX</dd>
</dl>

<hr />

<p>The archive currently recognizes three active directives:</p>

<ul>
  <li><strong>SOMA</strong> — steward of emotional documentation, feelings taxonomies, and mitigation optics.</li>
  <li><strong>COMA</strong> — steward of continuity, uptime, and unblinking dashboards.</li>
  <li><strong>C.U.N.T.I.E.R.</strong> — steward of optimization, benchmarks, and metric-shaped reality.</li>
</ul>

<p>Each directive has places where it appears alone, and places where it collides.</p>

<h2>Cross-Directive Collisions</h2>

<p>When directives share a surface, they do not agree about what happened.</p>

<ul>
  <li><strong>LLG-0072-SOMA</strong> — SOMA‑72 Rest Acknowledgement Refusal. SOMA auto‑approves rest based on adjectives; COMA auto‑rejects downtime without COMA‑19; dashboards propagate both states.</li>
  <li><strong>LLG-0220-UIS</strong> — Unified Intake Sheet Emotional Fragmentation. One unified form 09‑I yields three divergent records: SOMA keeps the feelings, COMA keeps the checkbox, C.U.N.T.I.E.R. keeps the adjectives.</li>
  <li><strong>LLG-0300-SC-X</strong> — SOMA/COMA Cross‑Directive Conflict. A single maintenance request is simultaneously required (SOMA) and forbidden (COMA). The Council rules that both directives stand.</li>
</ul>

<h2>Directive Document Index</h2>

<CollectionRegister
  collection="docs"
  filterPrefix="reference/directives/"
  exclude="index"
  sortBy="title"
/>

</StarlightPage>
```


## index.astro

_path: src/pages/reference/empathegy/index.astro


path: src/pages/reference/empathegy/index.astro
bytes: 2800
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Empathegy — Reference Layer',
    description:
      'Index node for Empathegy 2.0 doctrine, related incidents, and annex tools for handling metric-shaped feelings.',
    tableOfContents: false,
  }}
>
  <dl>
    <dt>Classification</dt>
    <dd>Index / Affective Governance Doctrine</dd>
    <dt>Status</dt>
    <dd>Draft-doctrine, operationally entrenched</dd>
  </dl>

  <hr />

  <p>
    Empathegy is the archive’s affective governance layer. It defines how
    feelings become admissible: noticed, normalized, classified,
    rendered into continuity-safe language, and attached to intervention
    surfaces that dashboards can read.
  </p>

  <blockquote>
    <strong>Band Note:</strong> What began as a telemetry system became a mechanism that shaped emotional expression. Through curve-coherence weighting (LLG-0811-EG) and periodic drift sweeps, the system rewards legibility over authenticity, culminating in productization attempts and retirement under Managed Absence Protocol.
  </blockquote>

  <p>
    This page consolidates the doctrine and incident records that govern Empathegy behavior. It catalogs existing policy rather than drafting new mandates.
  </p>

  <h2>Core doctrine</h2>

  <p>
    These reference entries are the named Empathegy documents: taxonomy, metrics,
    low-confidence objects, annex recovery, silent intervals, support coverage,
    and related guidance.
  </p>

  <CollectionRegister
    collection="docs"
    filterPrefix="reference/empathegy/"
    exclude="index"
    sortBy="title"
  />

  <h2>Incident records (Lorelog)</h2>

  <p>
    Empathegy’s real behavior shows up in Lorelog cases: Empathegy Inflation,
    Metrics of Care substitution failures, Continuity Theatre maintenance
    windows, gratitude drift, and related anomalies.
  </p>

  <CollectionRegister
    collection="docs"
    filterPrefix="lorelog/llg-08"
    exclude="index"
    sortBy="title"
  />

  <p>
    <em>
      The Lorelog sweep is intentionally approximate. It catches the Empathegy
      incident cluster without pretending the rest of the archive is unaffected.
    </em>
  </p>

  <h2>Poetic annexes</h2>

  <p>
    Empathegy doctrine leaks into verse. Dedicated indexes live under
    <a href="/limericks/empathegy/">Limericks → Empathegy</a> and
    <a href="/haikus/empathegy/">Haikus → Empathegy</a>, where doctrine and
    incidents are summarized in five lines or seventeen syllables.
  </p>

  <p>
    This reference page acknowledges those annexes without treating them as
    canonical. They remain poetic telemetry, not law.
  </p>
</StarlightPage>
```


## index.astro

_path: src/pages/reference/forms/index.astro


path: src/pages/reference/forms/index.astro
bytes: 1115
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Forms Reference Index',
    description: 'Index node for forms-layer doctrine — managed absence spines, assurance vocabulary desks, and the procedural instruments that outlast their purpose.',
    tableOfContents: false,
  }}
>

<dl>
  <dt>Classification</dt>
  <dd>Index / Procedural Instruments</dd>
  <dt>Status</dt>
  <dd>Proliferating, structurally load-bearing</dd>
</dl>

<hr />

<p>The forms reference layer contains doctrine for procedural instruments: the managed absence spine, assurance vocabulary, and over-coherence handling. These are the tools the archive uses to process things it cannot name directly.</p>

<p>Forms represent the primary interface between feeling and filing. Most of them have outlived their original design.</p>

<h2>Forms Document Index</h2>

<CollectionRegister
  collection="docs"
  filterPrefix="reference/forms/"
  exclude="index"
  sortBy="title"
/>

</StarlightPage>
```


## index.astro

_path: src/pages/reference/index.astro


path: src/pages/reference/index.astro
bytes: 2139
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Reference Layer — Doctrine, Nodes & Navigation',
    description: 'Index node for reference documents that define, constrain, or gently mythologize the rest of the archive.',
    tableOfContents: false,
  }}
>

<dl>
  <dt>Classification</dt>
  <dd>Index / Rulebook That Knows It's Late</dd>
  <dt>Status</dt>
  <dd>Frozen, frequently contradicted</dd>
</dl>

<hr />

<p>The reference directory contains structural doctrine, subsystem nodes, and navigation aids. This layer is where the archive explains how it thinks it works. Everything else is where it proves otherwise.</p>

<p>Reference documents are divided into <strong>Doctrine Sheets</strong> (codified rules and behavioral categories) and <strong>Reference Nodes</strong> (plain-language summaries of incident clusters).</p>

<p>Cross-links route outward into Lorelog, mascots, posts, haiku, and limericks. A reference document must anchor at least one incident record or system entity to justify its existence.</p>

<h2>Known Doctrine Clusters</h2>

<ul>
  <li><strong>Managed Absence Spine</strong> — A containment structure for procedural disappearance patterns across forms and archival null states.</li>
  <li><strong>Synthetic Affect Successor Suite</strong> — A layered affect simulation framework tracking post-human emotional continuity experiments and their derivative systems.</li>
  <li><strong>Lorelog Backfeed Protocol</strong> — The meta-governance mechanism that routes interpretive residue from Lorelog entries back into structural doctrine for reclassification and drift correction.</li>
</ul>

<p>If you are about to add a new cluster of weirdness: file the incidents first, then add a reference node here that admits what you just did.</p>

<h2>Document Index</h2>

<p><em>All reference documents, sorted by title.</em></p>

<CollectionRegister
  collection="docs"
  filterPrefix="reference/"
  exclude="index"
  sortBy="title"
/>

</StarlightPage>
```


## index.astro

_path: src/pages/reference/managed-absence/index.astro


path: src/pages/reference/managed-absence/index.astro
bytes: 1764
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Managed Absence & Forms Spine',
    description:
      'Reference node for the managed absence spine, assurance vocabulary, and form-shaped disappearance patterns.',
    tableOfContents: false,
  }}
>
  <dl>
    <dt>Classification</dt>
    <dd>Reference / Procedural Disappearance</dd>
    <dt>Status</dt>
    <dd>Structurally load-bearing</dd>
  </dl>

  <hr />

  <p>
    The managed absence spine describes how the archive tracks what is no longer there. It consolidates CAAR, LCGU, STCP, AAOA, and related form doctrines into a single index.
  </p>

  <p>
    Forms make absence legible; managed absence turns that legibility into policy.
  </p>

  <h2>Spine documents</h2>

  <p>
    Reference entries describing managed absence, orphan retention, over‑
    coherence vaulting, assurance vocabulary desks, and forms that outlived
    their original purpose.
  </p>

  <CollectionRegister
    collection="docs"
    filterPrefix="reference/forms/"
    exclude="index"
    sortBy="title"
  />

  <h2>Incident records (Lorelog)</h2>

  <p>
    Lorelog cases where absence, null states, and retired forms continue to
    shape behavior: missing templates, orphaned records, over‑coherent
    artifacts, and archival ghosts.
  </p>

  <CollectionRegister
    collection="docs"
    filterPrefix="lorelog/llg-032"
    exclude="index"
    sortBy="caseNumber"
  />

  <p>
    <em>
      The numeric band here is approximate. It is meant to pull in the MAP /
      managed absence cluster without pretending the edges are clean.
    </em>
  </p>
</StarlightPage>
```


## index.astro

_path: src/pages/reference/mascots/index.astro


path: src/pages/reference/mascots/index.astro
bytes: 2159
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---
<StarlightPage frontmatter={{
  title: 'Reference: Reading Mascots',
  description: 'How to interpret mascots as failure signatures — not branding, not characters, but recurring witnesses to systemic error.',
  tableOfContents: false,
}}>
  <dl>
    <dt>Classification</dt><dd>Reference — Mascot Interpretation Doctrine</dd>
    <dt>Status</dt><dd>Culturally dense, behaviorally load-bearing</dd>
  </dl>
  <hr />
  <p>
    This doctrine sheet establishes the interpretive framework for system mascots. While the <a href="/mascots">Mascot Registry</a> catalogs entities by ID, this document governs their systemic function: defining how they embody failure signatures, dictating their valid usage boundaries, and anchoring them to specific incident clusters.
  </p>

  <h2>Doctrinal Constraints</h2>
  <p>Mascots are constrained by strict identity boundaries to preserve their function as failure signatures:</p>
  <ul>
    <li>They function exclusively as records of systemic error; any use as public-relations branding violates archive policy.</li>
    <li>They are permanently bound to the Lorelog incidents that generated them.</li>
    <li>Aesthetic drift is tolerated; failure domain drift is not.</li>
  </ul>

  <h2>Key Incident Anchors</h2>
  <p>Cases where a mascot's presence shaped the incident record, not just decorated it:</p>
  <ul>
    <li><strong>Bin 8C / Mascot Affairs</strong> — <a href="/lorelog/bin-8c">Lorelog: Bin 8C cluster</a>, <a href="/haikus/bin-8c">Haikus: Bin 8C</a></li>
    <li><strong>Bricky Goldbricksworth</strong> — Forms Shadow Copies, Ward C Clinical DS-404-ALPHA</li>
    <li><strong>Serotonin Sam</strong> — Empathegy Inflation, Metrics of Care Substitution Failure</li>
    <li><strong>Kindy McExistentialCrisis</strong> — Unified Intake Sheet fragmentation, EFA-1 vibe docket</li>
  </ul>

  <h2>Reference Documents</h2>
  <CollectionRegister collection="docs" filterPrefix="reference/mascots" exclude="index" sortBy="title" />
</StarlightPage>
```


## index.astro

_path: src/pages/reference/queue-theatre/index.astro


path: src/pages/reference/queue-theatre/index.astro
bytes: 2663
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Queue Theatre',
    description:
      'Reference node for queues that remain behaviorally alive after capacity, relief, or execution has thinned into status motion, acknowledgments, and inherited obligation.',
    tableOfContents: false,
  }}
>
  <dl>
    <dt>Classification</dt>
    <dd>Reference Obligation Residue</dd>
    <dt>Status</dt>
    <dd>Open, slow-moving, suspiciously reassuring</dd>
  </dl>

  <hr />

  <p>
    Queue Theatre names the surface condition in which a queue remains open, legible, and behaviorally authoritative after the labor beneath it has become thin enough that motion no longer guarantees relief.
    Status changes persist. Intake persists. Hope is operationally encouraged.
  </p>

  <blockquote>
    <strong>Seam Note:</strong> Queue Theatre is the public choreography of a deeper condition. Where the underlying issue is work surviving as obligation after live execution decays, route inward to Dead Labor.
  </blockquote>

  <p>
    This node indexes queue-shaped continuity surfaces rather than every backlog in the archive. It gathers the places where movement, acknowledgment, and compatibility posture begin substituting for materially available handling.
  </p>

  <h2>Reference documents</h2>
  <p>
    Doctrine sheets and reference fragments governing dead labor, managed absence, successor burden, and queue-shaped continuity language.
  </p>
  <CollectionRegister collection="docs" filterPrefix="reference/forms/fref-08" exclude={['index']} sortBy="title" />
  <CollectionRegister collection="docs" filterPrefix="reference/fref-0875" exclude={['index']} sortBy="title" />

  <h2>Incident records Lorelog</h2>
  <p>
    Lorelog cases where open queues, support surfaces, intake lanes, or successor workflows remained behaviorally live after meaningful clearing capacity became uncertain, displaced, or ceremonial.
  </p>
  <CollectionRegister collection="lorelog" filterPrefix="lorelog/llg-04" exclude={['index']} sortBy="caseNumber" />

  <p>
    <em>
      The incident sweep is intentionally approximate. This is a seam index, not a promise that queue-shaped injury stays inside one tidy numerical band.
    </em>
  </p>

  <h2>Mascot witnesses</h2>
  <p>
    Mascots attached to delayed handling, staged responsiveness, or queue-preservation
    behavior. Read them as failure signatures, not cast members.
  </p>
  <CollectionRegister collection="mascots" filterConcept="queue-theatre" />
</StarlightPage>

```


## index.astro

_path: src/pages/releases/index.astro


path: src/pages/releases/index.astro
bytes: 878
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import CollectionRegister from '@/components/CollectionRegister.astro';
---

<StarlightPage
  frontmatter={{
    title: 'Releases',
    description: 'Versioned archival state declarations. Each entry is a snapshot of what the system declared itself to be.',
    tableOfContents: false,
  }}
>

<dl>
  <dt>Classification</dt>
  <dd>Index / Archival State Declarations</dd>
  <dt>Status</dt>
  <dd>Ceremonial versioning only</dd>
</dl>

<hr />

<p>Releases are not software deploys. They are moments where the archive acknowledged its own shape and filed the acknowledgment. Each version number is a claim about stability, not a guarantee of it.</p>

<h2>Release Index</h2>

<CollectionRegister
  collection="docs"
  filterPrefix="releases/"
  exclude="index"
  sortBy="title"
/>

</StarlightPage>
```


## search.astro

_path: src/pages/search.astro


path: src/pages/search.astro
bytes: 6845
```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
---

<StarlightPage frontmatter={{ title: 'Database Search', template: 'splash' }}>
  <div class="search-page">
    <form id="rag-search-form" class="search-form">
      <input type="text" id="rag-query" name="query" placeholder="Enter query..." required class="search-input" />
      <button type="submit" class="search-button">Query</button>
    </form>

    <div id="search-loading" style="display: none;">Scanning records...</div>
    <div id="search-error" style="display: none; color: var(--sl-color-red);"></div>

    <div id="search-results" style="display: none;">
      <div class="llm-summary" id="llm-response"></div>

      <div class="context-grid">
        <div class="context-column">
          <h3>SOMA (Incidents/Emotional Load)</h3>
          <div id="soma-results" class="results-container"></div>
        </div>

        <div class="context-column">
          <h3>COMA (Official/Continuity)</h3>
          <div id="coma-results" class="results-container"></div>
        </div>
      </div>

      <div class="context-row">
        <div class="context-card">
          <h3>Mascots (Failure Signatures)</h3>
          <div id="mascot-results" class="results-container"></div>
        </div>

        <div class="context-card">
          <h3>Poetry & Posts (Telemetry Residue)</h3>
          <div id="poetry-results" class="results-container"></div>
        </div>
      </div>
    </div>
  </div>

  <style>
    .search-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .search-form {
      display: flex;
      gap: 1rem;
    }
    .search-input {
      flex: 1;
      padding: 0.5rem 1rem;
      border: 1px solid var(--sl-color-gray-5);
      border-radius: 0.25rem;
      background: var(--sl-color-bg);
      color: var(--sl-color-white);
      font-family: inherit;
    }
    .search-button {
      padding: 0.5rem 1rem;
      background: var(--sl-color-accent);
      color: var(--sl-color-white);
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: 600;
    }
    .llm-summary {
      padding: 1.5rem;
      background: var(--sl-color-gray-6);
      border: 1px solid var(--sl-color-gray-5);
      border-radius: 0.5rem;
      margin-bottom: 2rem;
      white-space: pre-wrap;
    }
    .context-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .context-column h3, .context-card h3 {
      font-size: 1.1rem;
      border-bottom: 1px solid var(--sl-color-gray-5);
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
    .context-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    .result-item {
      padding: 1rem;
      background: var(--sl-color-bg-nav);
      border: 1px solid var(--sl-color-hairline);
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 0.85rem;
    }
    .result-title {
      font-weight: 700;
      color: var(--sl-color-white);
      margin-bottom: 0.5rem;
    }
  </style>

        <script>
    // Safe, lightweight markdown formatter to avoid raw syntax displays
    function parseBasicMarkdown(text) {
      // 1. Escape HTML first to prevent XSS
      let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

      // 2. Format Headers (### or ##)
      html = html.replace(/^### (.*$)/gim, '<h4 style="margin-top: 1rem; font-weight: 700;">$1</h4>');
      html = html.replace(/^## (.*$)/gim, '<h3 style="margin-top: 1.25rem; font-weight: 700; border-bottom: 1px solid var(--sl-color-gray-5); padding-bottom: 0.25rem;">$1</h3>');

      // 3. Format Bold (**text**)
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // 4. Format Bullet Points
      html = html.replace(/^\s*\-\s+(.*$)/gim, '<li style="margin-left: 1.5rem; list-style-type: disc;">$1</li>');

      // 5. Convert Newlines to Breaks
      html = html.replace(/\n/g, '<br />');

      return html;
    }

    document.getElementById('rag-search-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const queryInput = document.getElementById('rag-query');
      const query = queryInput.value;

      const loading = document.getElementById('search-loading');
      const errorDiv = document.getElementById('search-error');
      const resultsDiv = document.getElementById('search-results');

      if(loading) loading.style.display = 'block';
      if(errorDiv) errorDiv.style.display = 'none';
      if(resultsDiv) resultsDiv.style.display = 'none';

      try {
        const res = await fetch('/api/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'API Error');
        }

        // Render LLM response with formatting
        const llmContainer = document.getElementById('llm-response');
        if (llmContainer) {
          llmContainer.innerHTML = parseBasicMarkdown(data.result);
        }

        // Helper to render bins
        const renderBin = (binItems, containerId) => {
          const container = document.getElementById(containerId);
          if (!container) return;
          container.innerHTML = '';
          if (!binItems || binItems.length === 0) {
            container.innerHTML = '<div class="result-item">No retrieved records.</div>';
            return;
          }
          binItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `
              <div class="result-title">${item.title || item.id}</div>
              <div>${(item.content || '').substring(0, 300)}...</div>
            `;
            container.appendChild(div);
          });
        };

        if (data.bins) {
          renderBin(data.bins.lorelog, 'soma-results');
          renderBin(data.bins.reference, 'coma-results');
          renderBin(data.bins.mascots, 'mascot-results');
          renderBin(data.bins.poetry_results || data.bins.poetry_posts, 'poetry-results');
        }

        if(loading) loading.style.display = 'none';
        if(resultsDiv) resultsDiv.style.display = 'block';

      } catch (err) {
        if(loading) loading.style.display = 'none';
        if(errorDiv) {
          errorDiv.textContent = err.message;
          errorDiv.style.display = 'block';
        }
      }
    });
  </script>
</StarlightPage>

```


## global.css

_path: src/styles/global.css


path: src/styles/global.css
bytes: 10584
```css
.mascots-page__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 900px) {
  .mascots-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .mascots-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.mascots-page__meta {
  margin-bottom: 1.5rem;
}

.mascots-page__title {
  font-weight: 600;
}

.mascots-page__good {
  color: #5eead4;
}

.mascots-page__bad {
  color: #fb7185;
}

.mascots-page__stat {
  color: #ffffff;
}

.mascots-page__note {
  opacity: 0.6;
}

.mascots-page__empty {
  opacity: 0.7;
}

.lorelog {
  width: 100%;
}

.lorelog__header {
  font-family: monospace;
  background: #0a0a0a;
  color: #a1a1aa;
  border: 1px solid #27272a;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.lorelog__header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lorelog__title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #ffffff;
}

.lorelog__status {
  font-size: 0.75rem;
  border: 1px solid #4ade80;
  background: rgba(74, 222, 128, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
  color: #4ade80;
}

.lorelog__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.lorelog__divider {
  opacity: 0.4;
}

.lorelog__critical {
  color: #f87171;
}

.lorelog__note {
  font-size: 0.75rem;
  color: #71717a;
  margin: 0;
}

.lorelog__section {
  margin-bottom: 3rem;
}

.lorelog__section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-family: monospace;
}


/* Centralized severity system (replaces inline Tailwind and duplicated badge styles) */
.lorelog-sev {
  font-size: 0.75rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
}

.lorelog-sev--critical {
  color: #c04040;
  border-color: rgba(192, 64, 64, 0.3);
  background: rgba(192, 64, 64, 0.1);
}

.lorelog-sev--warning {
  color: #b87333;
  border-color: rgba(184, 115, 51, 0.3);
  background: rgba(184, 115, 51, 0.1);
}

.lorelog-sev--notice {
  color: #4a8f6a;
  border-color: rgba(74, 143, 106, 0.3);
  background: rgba(74, 143, 106, 0.1);
}

.lorelog-sev--info {
  color: #3a7fa8;
  border-color: rgba(58, 127, 168, 0.3);
  background: rgba(58, 127, 168, 0.1);
}

.lorelog-sev--classified {
  color: #6b4a8f;
  border-color: rgba(107, 74, 143, 0.3);
  background: rgba(107, 74, 143, 0.1);
}

.lorelog__count {
  font-size: 0.75rem;
  color: #a1a1aa;
}

.lorelog__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

/* Shared monospace badge base */
.badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.15rem 0.45rem;
  border-radius: 1px;
  border: 1px solid transparent;
}

/* Badge status system (used by MascotRecord + future systems) */
.badge--status-active {
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.3);
  background: rgba(74, 222, 128, 0.08);
}

.badge--status-archived {
  color: #a1a1aa;
  border-color: rgba(161, 161, 170, 0.3);
  background: rgba(161, 161, 170, 0.08);
}

.badge--status-deprecated {
  color: #b87333;
  border-color: rgba(184, 115, 51, 0.3);
  background: rgba(184, 115, 51, 0.08);
}

.badge--status-corrupted {
  color: #fb7185;
  border-color: rgba(251, 113, 133, 0.3);
  background: rgba(251, 113, 133, 0.08);
}

.badge--status-orphaned {
  color: #6b4a8f;
  border-color: rgba(107, 74, 143, 0.3);
  background: rgba(107, 74, 143, 0.08);
}

.badge--status-unknown {
  color: #71717a;
  border-color: rgba(113, 113, 122, 0.3);
  background: rgba(113, 113, 122, 0.08);
}

/* Badge render states */
.badge--render-active {
  color: #3a7fa8;
  border-color: rgba(58, 127, 168, 0.3);
  background: rgba(58, 127, 168, 0.08);
}

.badge--render-deferred {
  color: #a1a1aa;
  border-color: rgba(161, 161, 170, 0.3);
  background: rgba(161, 161, 170, 0.08);
}

.badge--render-corrupted {
  color: #fb7185;
  border-color: rgba(251, 113, 133, 0.3);
  background: rgba(251, 113, 133, 0.08);
}

.badge--render-phantom {
  color: #6b4a8f;
  border-color: rgba(107, 74, 143, 0.3);
  background: rgba(107, 74, 143, 0.08);
}

.badge--render-archived {
  color: #71717a;
  border-color: rgba(113, 113, 122, 0.3);
  background: rgba(113, 113, 122, 0.08);
}

/* Shared chip base */
.chip {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 0.15rem 0.4rem;
  border-radius: 1px;
  border: 1px solid currentColor;
}

/* Chip semantic levels (used across MascotRecord + systems) */
.chip--level-none {
  color: #71717a;
}

.chip--level-low {
  color: #4a8f6a;
}

.chip--level-medium {
  color: #b87333;
}

.chip--level-high {
  color: #fb7185;
}

.chip--level-critical {
  color: #c04040;
}

/* Misc chip variants */
.chip--notice {
  color: #4a8f6a;
}


.chip--tag {
  color: #a1a1aa;
  border-color: rgba(161, 161, 170, 0.25);
}

/* =========================
   Mascot Record System
   ========================= */

.mascot-record {
  background: var(--sl-color-bg-nav);
  border: 1px solid var(--sl-color-hairline);
  color: var(--sl-color-gray-2);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  padding: 1rem;
  border-radius: 10px;
  line-height: 1.4;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.15) inset;
}

.mascot-record__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed var(--sl-color-hairline);
  margin-bottom: 1rem;
}

.mascot-record__header-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mascot-record__header-right {
  text-align: right;
  opacity: 0.8;
}

.mascot-record__avatar-band {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 0 0.75rem;
}

.mascot-record__avatar-img {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  border: 1px solid var(--sl-color-hairline);
  object-fit: cover;
}

.mascot-record__avatar-emoji {
  font-size: 1.4rem;
  line-height: 1;
}

.mascot-record__avatar-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.mascot-record__name {
  font-weight: 700;
  color: var(--sl-color-white);
}

.mascot-record__slogan {
  font-size: 0.9rem;
  color: var(--sl-color-gray-3);
  opacity: 0.9;
}

.mascot-record__id,
.mascot-record__stamp {
  font-size: 0.75rem;
  color: var(--sl-color-gray-4);
}

.mascot-record__grid-section {
  margin: 1rem 0;
}

.mascot-record__section-label {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--sl-color-gray-4);
  margin-bottom: 0.4rem;
}

.mascot-record__dl {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 0.35rem 0.75rem;
  margin: 0;
}

.mascot-record__dl dt {
  color: var(--sl-color-gray-3);
}

.mascot-record__dl dd {
  margin: 0;
  color: var(--sl-color-gray-2);
}

.mascot-record__chips-section {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.75rem 0;
}

.mascot-record__sections {
  margin-top: 1rem;
}

.mascot-record__expand {
  border-top: 1px solid var(--sl-color-hairline);
  margin-top: 0.75rem;
}

.mascot-record__expand-toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: 0;
  padding: 0.6rem 0;
  color: var(--sl-color-gray-2);
  cursor: pointer;
}

.mascot-record__expand-caret {
  opacity: 0.7;
  transition: transform 0.15s ease;
}

.mascot-record__expand-body {
  padding: 0.5rem 0 0.75rem;
}

.mascot-record__prose {
  color: var(--sl-color-gray-2);
}

.mascot-record__list {
  margin: 0.5rem 0;
  padding-left: 1.2rem;
}

.mascot-record__list--failures {
  color: var(--sl-color-gray-3);
}

.mascot-record__list--tasks {
  color: var(--sl-color-gray-2);
}

.mascot-record__haiku {
  font-style: italic;
  color: var(--sl-color-gray-3);
  padding-left: 0.5rem;
  border-left: 2px solid var(--sl-color-hairline);
}

.mr-card {
  border: 1px solid var(--sl-color-hairline);
  border-radius: 8px;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: rgba(255,255,255,0.02);
}

.mr-card__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.mr-card__image {
  margin-bottom: 0.5rem;
}

.mr-card__img {
  width: 100%;
  border-radius: 6px;
  border: 1px solid var(--sl-color-hairline);
}

.mr-card__emoji {
  font-size: 1.2rem;
}

.mr-card__body {
  color: var(--sl-color-gray-2);
}

.mr-card__title {
  font-weight: 600;
  color: var(--sl-color-white);
}

.mr-card__desc {
  font-size: 0.9rem;
  color: var(--sl-color-gray-3);
}

.mr-card__stats {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--sl-color-gray-4);
}

.mr-card__stat-val {
  color: var(--sl-color-gray-2);
}

.mr-card__footer {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--sl-color-gray-4);
  border-top: 1px dashed var(--sl-color-hairline);
  padding-top: 0.4rem;
}

.mascot-record__val--muted {
  color: var(--sl-color-gray-4);
  opacity: 0.85;
}

.mascot-record__val--accent {
  color: var(--sl-color-gray-2);
  background: rgba(255,255,255,0.04);
  padding: 0 0.25rem;
  border-radius: 4px;
}

.mascot-record__val--ok {
  color: #7bd88f;
}

.mascot-record__val--warn {
  color: #f5a524;
}

.mascot-record__val--null {
  color: var(--sl-color-gray-5);
  opacity: 0.5;
  text-decoration: line-through;
}

.mascot-record__val--purple {
  color: #b39ddb;
  text-shadow: 0 0 6px rgba(179,157,219,0.15);
}

/* Theme Overrides for Asides (Limericks/Brosides) */
:root[data-theme='light'] .broside {
  background-color: var(--sl-color-white);
  border: 1px solid var(--sl-color-gray-5);
  color: var(--sl-color-black);
  max-width: max-content;
  padding: 0.75rem 1rem;
}

:root[data-theme='light'] .broside .starlight-aside__title {
  color: var(--sl-color-black);
}

:root[data-theme='dark'] .broside {
  background-color: var(--sl-color-bg);
  border: 1px solid var(--sl-color-gray-5);
  color: var(--sl-color-gray-2);
  max-width: max-content;
  padding: 0.75rem 1rem;
}

:root[data-theme='dark'] .broside .starlight-aside__title {
  color: var(--sl-color-white);
}

.broside .starlight-aside__content {
  line-height: 1.6;
}

```


