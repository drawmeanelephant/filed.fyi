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