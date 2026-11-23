import { useEffect, useState } from "react";
import { comparisonStorageKey, type VenueDefinition } from "./venueRegistry";
import { sanitizeComparison, toggleComparison } from "./comparisonState";
export function useAreaComparison(venue: VenueDefinition) {
  const key = comparisonStorageKey(venue),
    allowed = venue.areas.map((a) => a.id);
  function read() {
    try {
      return sanitizeComparison(
        JSON.parse(localStorage.getItem(key) || "[]"),
        allowed,
      );
    } catch {
      return [];
    }
  }
  const [state, setState] = useState(() => ({ key, ids: read() }));
  const [persistent, setPersistent] = useState(true);
  // A reused component must never write the previous venue's IDs into the next key.
  const saved = state.key === key ? state.ids : read();
  useEffect(() => {
    if (state.key !== key) {
      setState({ key, ids: read() });
      return;
    }
    try {
      if (state.ids.length)
        localStorage.setItem(key, JSON.stringify(state.ids));
      else localStorage.removeItem(key);
      setPersistent(true);
    } catch {
      setPersistent(false);
    }
  }, [key, state]);
  return {
    saved,
    persistent,
    toggle(id: string) {
      const next = toggleComparison(saved, id, allowed);
      setState({ key, ids: next.ids });
      return next.full;
    },
    remove(id: string) {
      setState({ key, ids: saved.filter((v) => v !== id) });
    },
    clear() {
      setState({ key, ids: [] });
    },
  };
}
