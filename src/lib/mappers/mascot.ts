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