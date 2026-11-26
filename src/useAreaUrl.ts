import { useEffect } from "react";
import type { VenueDefinition } from "./venueRegistry";

/** Retain the selected public area on refresh; never put pasted ticket text in a URL. */
export function useAreaUrl(venue: VenueDefinition, area: string) {
  useEffect(() => {
    const url = new URL(location.href);
    url.searchParams.set("area", area);
    if (location.search !== url.search)
      history.replaceState(history.state, "", url.pathname + url.search + location.hash);
  }, [venue, area]);
}
