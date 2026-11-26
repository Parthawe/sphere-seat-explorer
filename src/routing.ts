import type { Mode } from "./model";
import type { Season } from "./races";

export type Route = {
  season: Season;
  race: string;
  seats: boolean;
  atlas?: boolean;
  circuit?: boolean;
  layout?: boolean;
  racing?: boolean;
  position?: string;
  mode?: Mode;
  issue?: string;
};

export function readRoute(search: string): Route {
  const p = new URLSearchParams(search);
  const season = p.get("season");
  const validSeason = !season || season === "2026" || season === "2027";
  const screen = p.get("screen");
  const vegasRequest = screen === "vegas" || screen === "seats" ||
    (!screen && (p.has("seat") || p.has("view")));
  const race = p.get("race") || (vegasRequest ? "las-vegas" : "");
  const isVegas = race === "las-vegas";
  let issue: string | undefined;
  if (season && season !== "2026" && season !== "2027")
    issue = "That season is unavailable. Showing the 2026 calendar instead.";
  if (vegasRequest && !isVegas)
    issue = "That seat-view link belongs to a different venue. Use this race’s available viewing options below.";
  if (screen && !["vegas", "seats", "circuit", "layout", "racing"].includes(screen))
    issue = "That view is unavailable. Choose a viewing option from this race guide.";
  return {
    season: season === "2027" ? 2027 : 2026,
    race,
    seats: validSeason && vegasRequest && isVegas && screen !== "vegas",
    atlas: validSeason && screen === "vegas" && isVegas,
    circuit: validSeason && screen === "circuit",
    layout: validSeason && screen === "layout",
    racing: validSeason && screen === "racing",
    issue,
  };
}
