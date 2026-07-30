/**
 * Canonical Identity & Relationship Module for Filed & Forgotten
 * src/lib/archive-identity.ts
 *
 * Provides single source of truth for entity keys, legacy alias resolution,
 * route href construction, and strict exact relationship matching.
 */

export interface ArchiveRef {
  collection?: string;
  id: string;
  state?: string;
}

export interface ArchiveEntry {
  id: string;
  collection?: string;
  data?: {
    title?: string | null;
    displayName?: string | null;
    name?: string | null;
    slug?: string | null;
    caseNumber?: string | null;
    mascotId?: string | number | null;
    formNumber?: string | null;
    versionLabel?: string | null;
    legacyAliases?: string[] | null;
    aliases?: string[] | null;
    alias?: string | string[] | null;
    mascotRef?: string | null;
    relatedMascots?: string[] | null;
    parentEntry?: string | null;
    relatedLorelog?: string | null;
    [key: string]: any;
  };
  [key: string]: any;
}

export type MatchType = 'exact' | 'caseNumber' | 'mascotId' | 'slug' | 'alias';

export interface ResolutionResult {
  resolved: boolean;
  matchType?: MatchType;
  collection: string;
  id: string;
  entry?: ArchiveEntry;
  href?: string;
  ambiguousMatches?: ArchiveEntry[];
}

/**
 * Normalizes a raw string identity token by stripping extension, leading folder names,
 * and converting to lower case.
 */
export function normalizeToken(token: unknown): string {
  if (token == null) return '';
  return String(token)
    .trim()
    .replace(/\.mdx?$/i, '')
    .replace(/^\/?(docs\/)?(lorelog|mascots|releases|changelog|haikus|limericks|aphorisms|reference|guides|posts)\//i, '')
    .toLowerCase();
}

/**
 * Creates a canonical lookup key combining collection and normalized ID.
 * e.g. canonicalKey('lorelog', 'lorelog/LLG-0019-COMA.mdx') => 'lorelog:llg-0019-coma'
 */
export function canonicalKey(collection: string, id: string): string {
  const coll = (collection || 'docs').toLowerCase().trim();
  const cleanId = normalizeToken(id);
  return `${coll}:${cleanId}`;
}

/**
 * Extracts all exact identity lookup aliases for an entry following precedence.
 */
export function entryAliases(entry: ArchiveEntry): {
  exactKey: string;
  caseNumberKeys: string[];
  mascotIdKeys: string[];
  slugKeys: string[];
  aliasKeys: string[];
} {
  const collection = (entry.collection || 'docs').toLowerCase().trim();
  const rawId = entry.id || '';
  const data = entry.data || {};

  const exactKey = canonicalKey(collection, rawId);

  // Case Number
  const caseNumberKeys: string[] = [];
  if (data.caseNumber) {
    caseNumberKeys.push(normalizeToken(data.caseNumber));
  }

  // Mascot ID (e.g. 5, "005", "mascot-005")
  const mascotIdKeys: string[] = [];
  if (data.mascotId != null && data.mascotId !== '' && data.mascotId !== '???') {
    const rawMascotId = String(data.mascotId).trim();
    mascotIdKeys.push(rawMascotId.toLowerCase());
    if (/^\d+$/.test(rawMascotId)) {
      const padded = rawMascotId.padStart(3, '0').toLowerCase();
      const numOnly = String(parseInt(rawMascotId, 10));
      if (!mascotIdKeys.includes(padded)) mascotIdKeys.push(padded);
      if (!mascotIdKeys.includes(numOnly)) mascotIdKeys.push(numOnly);
    }
  }

  // Slugs / Basenames
  const slugKeys: string[] = [];
  const rawBasename = normalizeToken(rawId.split('/').pop());
  if (rawBasename) slugKeys.push(rawBasename);
  if (data.slug) {
    const normSlug = normalizeToken(data.slug);
    if (normSlug && !slugKeys.includes(normSlug)) slugKeys.push(normSlug);
  }

  // Explicit Legacy Aliases
  const aliasKeys: string[] = [];
  const rawAliases = [
    ...(Array.isArray(data.legacyAliases) ? data.legacyAliases : []),
    ...(Array.isArray(data.aliases) ? data.aliases : []),
    ...(typeof data.alias === 'string' ? [data.alias] : Array.isArray(data.alias) ? data.alias : []),
    ...(data.formNumber ? [data.formNumber] : [])
  ];
  for (const a of rawAliases) {
    const norm = normalizeToken(a);
    if (norm && !aliasKeys.includes(norm)) aliasKeys.push(norm);
  }

  return { exactKey, caseNumberKeys, mascotIdKeys, slugKeys, aliasKeys };
}

/**
 * Builds canonical route href for an entry or reference.
 */
export function entryHref(
  refOrEntry: ArchiveEntry | ArchiveRef,
  options?: { anchor?: string }
): string {
  const collection = (refOrEntry.collection || ('data' in refOrEntry && refOrEntry.data ? 'docs' : 'docs')).toLowerCase();
  const rawId = refOrEntry.id || '';
  const anchorPart = options?.anchor ? `#${options.anchor}` : '';

  let cleanId = normalizeToken(rawId);

  if (collection === 'docs') {
    let docPath = rawId.replace(/\.mdx?$/i, '').replace(/^\/?docs\//i, '').toLowerCase();
    return `/${docPath}${anchorPart}`;
  }

  if (collection === 'mascots') return `/mascots/${cleanId}${anchorPart}`;
  if (collection === 'lorelog') return `/lorelog/${cleanId}${anchorPart}`;
  if (collection === 'releases') return `/docs/releases/${cleanId}${anchorPart}`;
  if (collection === 'changelog') return `/docs/changelog/${cleanId}${anchorPart}`;

  if (['haikus', 'limericks', 'aphorisms'].includes(collection)) {
    return `/${collection}${anchorPart || `#${cleanId}`}`;
  }

  return `/${collection}/${cleanId}${anchorPart}`;
}

/**
 * Resolves a reference string or object against an archive index using strict canonical precedence.
 *
 * Precedence:
 * 1. exact collection + id
 * 2. caseNumber or mascotId
 * 3. exact slug or basename
 * 4. explicit legacy alias
 * 5. NEVER fuzzy match (returns unresolved)
 */
export function resolveExactAlias(
  ref: string | ArchiveRef,
  entries: ArchiveEntry[]
): ResolutionResult {
  let targetColl: string | undefined;
  let targetRefStr: string;

  if (typeof ref === 'string') {
    targetRefStr = ref.trim();
    const parts = targetRefStr.split('/');
    const firstPart = parts[0]?.toLowerCase();
    const knownCollections = ['lorelog', 'mascots', 'haikus', 'limericks', 'aphorisms', 'releases', 'changelog', 'docs'];
    if (knownCollections.includes(firstPart)) {
      targetColl = firstPart;
    }
  } else {
    targetColl = ref.collection;
    targetRefStr = ref.id || '';
  }

  const cleanTargetToken = normalizeToken(targetRefStr);
  if (!cleanTargetToken) {
    return {
      resolved: false,
      collection: targetColl || 'docs',
      id: targetRefStr
    };
  }

  // Pre-process index aliases
  const processed = entries.map((entry) => ({
    entry,
    aliases: entryAliases(entry)
  }));

  // 1. Exact collection + ID match
  if (targetColl) {
    const targetKey = canonicalKey(targetColl, targetRefStr);
    const matches = processed
      .filter((p) => p.aliases.exactKey === targetKey)
      .map((p) => p.entry);

    if (matches.length === 1) {
      return {
        resolved: true,
        matchType: 'exact',
        collection: matches[0].collection || targetColl,
        id: matches[0].id,
        entry: matches[0],
        href: entryHref(matches[0])
      };
    } else if (matches.length > 1) {
      return {
        resolved: true,
        matchType: 'exact',
        collection: matches[0].collection || targetColl,
        id: matches[0].id,
        entry: matches[0],
        href: entryHref(matches[0]),
        ambiguousMatches: matches
      };
    }
  }

  // 2. CaseNumber or Mascot ID match
  const caseMatches = processed
    .filter((p) => p.aliases.caseNumberKeys.includes(cleanTargetToken))
    .map((p) => p.entry);

  const mascotIdMatches = processed
    .filter((p) => p.aliases.mascotIdKeys.includes(cleanTargetToken))
    .map((p) => p.entry);

  const tier2Matches = [...new Set([...caseMatches, ...mascotIdMatches])];
  if (tier2Matches.length === 1) {
    const m = tier2Matches[0];
    const matchType: MatchType = caseMatches.includes(m) ? 'caseNumber' : 'mascotId';
    return {
      resolved: true,
      matchType,
      collection: m.collection || targetColl || 'docs',
      id: m.id,
      entry: m,
      href: entryHref(m)
    };
  } else if (tier2Matches.length > 1) {
    return {
      resolved: true,
      matchType: 'caseNumber',
      collection: tier2Matches[0].collection || targetColl || 'docs',
      id: tier2Matches[0].id,
      entry: tier2Matches[0],
      href: entryHref(tier2Matches[0]),
      ambiguousMatches: tier2Matches
    };
  }

  // 3. Exact Slug / Basename match
  const slugMatches = processed
    .filter((p) => p.aliases.slugKeys.includes(cleanTargetToken))
    .map((p) => p.entry);

  if (slugMatches.length === 1) {
    const m = slugMatches[0];
    return {
      resolved: true,
      matchType: 'slug',
      collection: m.collection || targetColl || 'docs',
      id: m.id,
      entry: m,
      href: entryHref(m)
    };
  } else if (slugMatches.length > 1) {
    return {
      resolved: true,
      matchType: 'slug',
      collection: slugMatches[0].collection || targetColl || 'docs',
      id: slugMatches[0].id,
      entry: slugMatches[0],
      href: entryHref(slugMatches[0]),
      ambiguousMatches: slugMatches
    };
  }

  // 4. Explicit Legacy Alias match
  const aliasMatches = processed
    .filter((p) => p.aliases.aliasKeys.includes(cleanTargetToken))
    .map((p) => p.entry);

  if (aliasMatches.length === 1) {
    const m = aliasMatches[0];
    return {
      resolved: true,
      matchType: 'alias',
      collection: m.collection || targetColl || 'docs',
      id: m.id,
      entry: m,
      href: entryHref(m)
    };
  } else if (aliasMatches.length > 1) {
    return {
      resolved: true,
      matchType: 'alias',
      collection: aliasMatches[0].collection || targetColl || 'docs',
      id: aliasMatches[0].id,
      entry: aliasMatches[0],
      href: entryHref(aliasMatches[0]),
      ambiguousMatches: aliasMatches
    };
  }

  // 5. Unresolved (Fuzzy is never canonical)
  return {
    resolved: false,
    collection: targetColl || 'docs',
    id: targetRefStr
  };
}

/**
 * Returns fuzzy match suggestions ONLY for maintainer audit reporting.
 */
export function suggestFuzzyMatches(
  ref: string | ArchiveRef,
  entries: ArchiveEntry[]
): ArchiveEntry[] {
  const targetStr = typeof ref === 'string' ? ref : ref.id;
  const cleanTarget = normalizeToken(targetStr);
  if (!cleanTarget || cleanTarget.length < 3) return [];

  const candidates: ArchiveEntry[] = [];

  for (const entry of entries) {
    const aliases = entryAliases(entry);
    const allTokens = [
      aliases.exactKey,
      ...aliases.caseNumberKeys,
      ...aliases.mascotIdKeys,
      ...aliases.slugKeys,
      ...aliases.aliasKeys
    ];

    const isPartial = allTokens.some(
      (tok) => tok.includes(cleanTarget) || cleanTarget.includes(tok)
    );

    if (isPartial) {
      candidates.push(entry);
    }
  }

  return candidates.slice(0, 5);
}
