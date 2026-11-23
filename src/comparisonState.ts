export const COMPARISON_LIMIT = 3;
export function sanitizeComparison(
  raw: unknown,
  allowed: readonly string[],
): string[] {
  if (!Array.isArray(raw)) return [];
  return [
    ...new Set(
      raw.filter(
        (id): id is string => typeof id === "string" && allowed.includes(id),
      ),
    ),
  ].slice(0, COMPARISON_LIMIT);
}
export function toggleComparison(
  current: readonly string[],
  id: string,
  allowed: readonly string[],
) {
  const ids = sanitizeComparison(current, allowed);
  if (!allowed.includes(id)) return { ids, full: false };
  if (ids.includes(id))
    return { ids: ids.filter((v) => v !== id), full: false };
  if (ids.length >= COMPARISON_LIMIT) return { ids, full: true };
  return { ids: [...ids, id], full: false };
}
