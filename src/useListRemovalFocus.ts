import { useLayoutEffect, useRef, type RefObject } from 'react';

/** Keep focus on a remaining removal control, or return to the list's entry action. */
export function useListRemovalFocus(ids: readonly string[], root: RefObject<HTMLElement | null>, fallback: () => HTMLElement | null | undefined) {
  const pending = useRef<{ next: string | null; fallback: HTMLElement | null } | null>(null);
  useLayoutEffect(() => {
    const request = pending.current;
    if (!request) return;
    pending.current = null;
    const next = request.next ? root.current?.querySelector<HTMLElement>(`[data-comparison-id="${CSS.escape(request.next)}"] [data-remove-comparison]`) : null;
    const target = next ?? request.fallback;
    if (target?.isConnected) target.focus();
  }, [ids, root]);
  return (id?: string) => {
    const remaining = id ? ids.filter(value => value !== id) : [];
    const index = id ? Math.max(0, ids.indexOf(id)) : 0;
    pending.current = { next: remaining[Math.min(index, remaining.length - 1)] ?? null, fallback: fallback() ?? null };
  };
}
