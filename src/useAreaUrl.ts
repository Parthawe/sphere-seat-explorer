import { syncPublicUrlMetadata } from "./brand";
import { useEffect } from "react";
import type { VenueDefinition } from "./venueRegistry";

/** Retain the selected public area on refresh; never put pasted ticket text in a URL. */
export function useAreaUrl<Id extends string>(venue: VenueDefinition, area: Id, onRestore: (id: Id) => void, fallback: Id) {
  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(location.search);
      const race = params.get("race");
      if ((race && race !== venue.raceSlug) ||
        Number(params.get("season") || 2026) !== venue.season || params.has("screen")) return;
      const id = params.get("area");
      onRestore((venue.areas.some(a => a.id === id) ? id : fallback) as Id);
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [venue, onRestore, fallback]);
  useEffect(() => {
    const url = new URL(location.href);
    url.searchParams.set("area", area);
    if (location.search !== url.search)
      history.replaceState(history.state, "", url.pathname + url.search + location.hash);
    syncPublicUrlMetadata();
  }, [venue, area]);
}
