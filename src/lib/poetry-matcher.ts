import { getCollection } from 'astro:content';

let mascotsPromise: Promise<any[]> | null = null;
let haikusPromise: Promise<any[]> | null = null;
let limericksPromise: Promise<any[]> | null = null;
let aphorismsPromise: Promise<any[]> | null = null;

function loadMascots() {
  if (!mascotsPromise) mascotsPromise = getCollection('mascots');
  return mascotsPromise;
}

function loadHaikus() {
  if (!haikusPromise) haikusPromise = getCollection('haikus');
  return haikusPromise;
}

function loadLimericks() {
  if (!limericksPromise) limericksPromise = getCollection('limericks');
  return limericksPromise;
}

function loadAphorisms() {
  if (!aphorismsPromise) aphorismsPromise = getCollection('aphorisms');
  return aphorismsPromise;
}

function isMascotMatch(poemRef: string, mascot: any): boolean {
  if (!poemRef || !mascot) return false;

  const clean = (s: string) =>
    s
      .replace(/^mascots\//i, '')
      .replace(/\.mdx?$/i, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

  const rClean = clean(poemRef);
  const rTokens = rClean.split(/\s+/).filter(Boolean);

  const rLeadingNumber = rTokens.length > 0 && /^\d+$/.test(rTokens[0]) ? rTokens[0] : null;
  if (rLeadingNumber && mascot.data.mascotId && String(mascot.data.mascotId) === rLeadingNumber) {
    return true;
  }

  const cleanMascot = (str: string) =>
    clean(str)
      .split(/\s+/)
      .filter((t) => !/^\d+$/.test(t) && t !== 'the');

  const mascotTokens = [
    mascot.id,
    mascot.data.slug,
    mascot.data.title,
    mascot.data.displayName,
    mascot.data.name,
  ]
    .filter(Boolean)
    .flatMap(cleanMascot);

  const poemTextTokens = rTokens.filter((t) => !/^\d+$/.test(t) && t !== 'the');

  if (poemTextTokens.length > 0 && mascotTokens.length > 0) {
    const allMatch = poemTextTokens.every((pt) => mascotTokens.includes(pt));
    if (allMatch) return true;

    const titleTokens = cleanMascot(mascot.data.title || mascot.data.displayName || '');
    if (titleTokens.length > 0 && titleTokens.every((tt) => poemTextTokens.includes(tt))) {
      return true;
    }
  }

  return false;
}

export const getPoemId = (poem: any) =>
  poem.id
    .split('/')
    .pop()
    ?.replace(/\.mdx?$/, '')
    .toLowerCase()
    .trim() || '';

/** Normalize case / identity tokens for parent↔child matching. */
function normalizeId(value: unknown): string {
  return String(value ?? '')
    .toUpperCase()
    .replace(/\.MDX?$/i, '')
    .replace(/^DOCS\//, '')
    .replace(/^(HAIKUS|LIMERICKS|APHORISMS|REFERENCE|LORELOG|MASCOTS|GUIDES|POSTS|RELEASES)\//, '')
    .replace(/.*\//, '') // basename only
    .trim();
}

/**
 * Build the set of identity keys a page may be known by, so poems that declare
 * parentEntry as caseNumber, basename, or path still resolve.
 */
function pageIdentityKeys(entry: any): Set<string> {
  const keys = new Set<string>();
  if (!entry) return keys;

  const add = (v: unknown) => {
    const n = normalizeId(v);
    if (n) keys.add(n);
  };

  add(entry.id);
  add(entry.data?.slug);
  add(entry.data?.caseNumber);
  add(entry.data?.formNumber);

  // e.g. reference/empathegy/fref-0570-celc → also FREF-0570-CELC shape
  const base = normalizeId(entry.id?.split('/').pop());
  if (base) {
    keys.add(base);
    // If basename is fref-0570-celc it already normalizes to FREF-0570-CELC
  }

  return keys;
}

function poemParentKeys(poem: any): string[] {
  const parentRef = poem.data?.parentEntry ?? poem.data?.relatedLorelog;
  const keys: string[] = [];
  if (parentRef != null && parentRef !== 'null') {
    for (const ref of [parentRef].flat().filter(Boolean)) {
      const n = normalizeId(ref);
      if (n) keys.push(n);
    }
  }
  // Also allow poem caseNumber as a weak signal when it encodes the parent
  // (common for FREF poetry where caseNumber === parentEntry).
  if (poem.data?.caseNumber) {
    const cn = normalizeId(poem.data.caseNumber);
    // Strip poetry prefixes APH-/HAI-/LIM- if present
    const stripped = cn.replace(/^(APH|HAI|LIM)-/, '');
    if (stripped) keys.push(stripped);
    if (cn) keys.push(cn);
  }
  return keys;
}

function poemMatchesPage(poem: any, pageKeys: Set<string>): boolean {
  if (pageKeys.size === 0) return false;
  return poemParentKeys(poem).some((k) => pageKeys.has(k));
}

function mergeUnique(a: any[], b: any[]): any[] {
  const seen = new Set<string>();
  const out: any[] = [];
  for (const item of [...a, ...b]) {
    const id = item?.id ?? getPoemId(item);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(item);
  }
  return out;
}

export async function getMatchingPoetry(entry: any) {
  const entryId = entry?.id ?? '';
  const isMascot = entryId.startsWith('mascots/');
  const isLorelog = entryId.startsWith('lorelog/');
  const isReference = entryId.startsWith('reference/');

  let matchingHaikus: any[] = [];
  let matchingLimericks: any[] = [];
  let matchingAphorisms: any[] = [];

  if (isMascot && entryId) {
    const mascots = await loadMascots();
    const cleanEntryId = entryId.replace(/^mascots\//, '').replace(/\.mdx?$/, '').toLowerCase().trim();
    const mascotEntry = mascots.find((m) => {
      const cleanMId = m.id.replace(/\.mdx?$/, '').toLowerCase().trim();
      const cleanMDataSlug = m.data.slug
        ? m.data.slug.replace(/^mascots\//, '').toLowerCase().trim()
        : '';
      return cleanMId === cleanEntryId || cleanMDataSlug === cleanEntryId;
    });

    const [haikus, limericks, aphorisms] = await Promise.all([
      loadHaikus(),
      loadLimericks(),
      loadAphorisms(),
    ]);

    if (mascotEntry) {
      matchingHaikus = haikus.filter((h) => {
        const refs = [(h.data as any).mascotRef, ...((h.data as any).relatedMascots || [])].filter(
          Boolean,
        );
        return refs.some((ref) => isMascotMatch(ref, mascotEntry));
      });

      matchingLimericks = limericks.filter((l) => {
        const refs = [(l.data as any).mascotRef, ...((l.data as any).relatedMascots || [])].filter(
          Boolean,
        );
        return refs.some((ref) => isMascotMatch(ref, mascotEntry));
      });

      matchingAphorisms = aphorisms.filter((a) => {
        const refs = [(a.data as any).mascotRef, ...((a.data as any).relatedMascots || [])].filter(
          Boolean,
        );
        return refs.some((ref) => isMascotMatch(ref, mascotEntry));
      });
    }
  }

  if (isLorelog && entry) {
    const relatedH = entry.data.relatedHaiku || [];
    const relatedL = entry.data.relatedLimerick || [];
    const relatedE = entry.data.relatedEntries || [];

    if (relatedH.length > 0 || relatedL.length > 0 || relatedE.length > 0) {
      const [haikus, limericks, aphorisms] = await Promise.all([
        loadHaikus(),
        loadLimericks(),
        loadAphorisms(),
      ]);

      matchingHaikus = haikus.filter((h) =>
        relatedH.some((rh: any) => {
          const rhName = rh.slug?.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim();
          const hName = h.id.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim();
          return rhName === hName;
        }),
      );

      matchingLimericks = limericks.filter((l) =>
        relatedL.some((rl: any) => {
          const rlName = rl.slug?.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim();
          const lName = l.id.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim();
          return rlName === lName;
        }),
      );

      // Aphorisms (and any poem type) claimed via relatedEntries
      const claimedIds = new Set(
        relatedE
          .filter((re: any) => re?.id && ['haikus', 'limericks', 'aphorisms'].includes(re.collection))
          .map((re: any) => String(re.id).split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim()),
      );

      if (claimedIds.size > 0) {
        matchingHaikus = mergeUnique(
          matchingHaikus,
          haikus.filter((h) => claimedIds.has(getPoemId(h))),
        );
        matchingLimericks = mergeUnique(
          matchingLimericks,
          limericks.filter((l) => claimedIds.has(getPoemId(l))),
        );
        matchingAphorisms = mergeUnique(
          matchingAphorisms,
          aphorisms.filter((a) => claimedIds.has(getPoemId(a))),
        );
      }
    }
  }

  // Parent-entry / caseNumber / basename matching (references, lorelogs, guides, posts…)
  const pageKeys = pageIdentityKeys(entry);
  if (pageKeys.size > 0) {
    const [haikus, limericks, aphorisms] = await Promise.all([
      loadHaikus(),
      loadLimericks(),
      loadAphorisms(),
    ]);

    matchingHaikus = mergeUnique(
      matchingHaikus,
      haikus.filter((p) => poemMatchesPage(p, pageKeys)),
    );
    matchingLimericks = mergeUnique(
      matchingLimericks,
      limericks.filter((p) => poemMatchesPage(p, pageKeys)),
    );
    matchingAphorisms = mergeUnique(
      matchingAphorisms,
      aphorisms.filter((p) => poemMatchesPage(p, pageKeys)),
    );
  }

  return {
    matchingHaikus,
    matchingLimericks,
    matchingAphorisms,
    isMascot,
    isLorelog,
    isReference,
  };
}
