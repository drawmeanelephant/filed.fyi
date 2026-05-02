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