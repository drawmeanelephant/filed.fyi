import { getCollection } from 'astro:content';
import { normalizeToken, entryAliases, resolveExactAlias } from './archive-identity';

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
  const res = resolveExactAlias({ collection: 'mascots', id: poemRef }, [{ ...mascot, collection: 'mascots' }]);
  return res.resolved;
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
  return normalizeToken(value).toUpperCase();
}

/**
 * Build the set of identity keys a page may be known by, so poems that declare
 * parentEntry as caseNumber, basename, or path still resolve.
 */
function pageIdentityKeys(entry: any): Set<string> {
  const keys = new Set<string>();
  if (!entry) return keys;

  const aliases = entryAliases(entry);
  for (const k of [
    ...aliases.caseNumberKeys,
    ...aliases.mascotIdKeys,
    ...aliases.slugKeys,
    ...aliases.aliasKeys
  ]) {
    if (k) keys.add(k.toUpperCase());
  }

  const base = normalizeToken(entry.id?.split('/').pop()).toUpperCase();
  if (base) keys.add(base);

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
  if (poem.data?.caseNumber) {
    const cn = normalizeId(poem.data.caseNumber);
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
