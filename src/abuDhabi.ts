import { hasConflictingTicketContext } from "./ticketEventContext";
import geography from "./yas-track.json";
export const ABU_CHECKED = "2026-11-23";
export const ABU_CIRCUIT = "https://www.abudhabigp.com/en/circuit";
export const ABU_FAQ = "https://www.abudhabigp.com/en/faq";
export const ABU_TICKETS =
  "https://www.abudhabigp.com/en/formula1/tickets-2026/";
const source = (slug: string) => ABU_TICKETS + slug + "-4day";
const anchor = (name: string) =>
  geography.stand_anchors.find((a) => a.name === name)!.point;
// Source descriptions establish the product and track region, not surveyed rows or chairs.
export const abuAreas = [
  {
    id: "main",
    name: "Main Grandstand",
    short: "Main",
    position: "Start / finish · pit lane",
    description:
      "The organizer identifies the starting grid, pit lane and podium as the reference points for this stand.",
    focus: "Grid & pits",
    source: source("main-grandstand"),
    point: anchor("Main Grandstand"),
    label: [430, 290],
    confidence: "OSM stand anchor",
  },
  {
    id: "north",
    name: "North Grandstand",
    short: "North",
    position: "Turn 5 · hairpin",
    description:
      "The organizer places this stand at the Turn 5 hairpin before the longest straight.",
    focus: "Hairpin braking",
    source: source("north-grandstand"),
    point: anchor("North Grandstand"),
    label: [410, 48],
    confidence: "OSM stand anchor",
  },
  {
    id: "north-straight",
    name: "North Straight Grandstand",
    short: "North Straight",
    position: "Longest straight · after Turn 5",
    description:
      "A separate product from North Grandstand, along the straight after Turn 5. Its marker is an estimated region based on the organizer’s description.",
    focus: "Acceleration & straight",
    source: source("north-straight-grandstand"),
    point: [264, 170],
    label: [105, 145],
    confidence: "Estimated region",
  },
  {
    id: "west-straight",
    name: "West Straight Grandstand",
    short: "West Straight",
    position: "Longest straight · towards Turns 6–7",
    description:
      "A separate product from West Grandstand. The organizer describes views towards the braking zone at Turns 6 and 7; the marker is a region estimate.",
    focus: "Straight & braking",
    source: source("west-straight-grandstand"),
    point: [230, 265],
    label: [90, 240],
    confidence: "Estimated region",
  },
  {
    id: "west",
    name: "West Grandstand",
    short: "West",
    position: "Turns 6–7 · end of the straight",
    description:
      "The organizer describes the end of the longest straight and braking into Turns 6 and 7 as this stand’s reference points.",
    focus: "Braking & overtaking",
    source: source("west-grandstand"),
    point: anchor("West Grandstand"),
    label: [100, 365],
    confidence: "OSM stand anchor",
  },
  {
    id: "marina",
    name: "Marina Grandstand",
    short: "Marina",
    position: "Marina-side final sector",
    description:
      "The organizer describes marina and W Abu Dhabi views from this stand. A named OSM building anchors its broad location.",
    focus: "Marina-side corners",
    source: source("marina-grandstand"),
    point: anchor("Marina Grandstand"),
    label: [140, 470],
    confidence: "OSM stand anchor",
  },
  {
    id: "south",
    name: "South Grandstand",
    short: "South",
    position: "Turn 9 · Marsa Corner",
    description:
      "The organizer places this viewing product at Turn 9. The callout indicates the corner region; the stand footprint and seat positions are not verified.",
    focus: "Turn 9 battles",
    source: source("south-grandstand"),
    point: [419, 476],
    label: [485, 505],
    confidence: "Estimated region",
  },
] as const;
export type AbuAreaId = (typeof abuAreas)[number]["id"];
export type AbuMatch = {
  status: "matched" | "ambiguous" | "unknown" | "wrong-event";
  ids: AbuAreaId[];
  row?: string;
  seat?: string;
  section?: string;
};
export function locateAbuTicket(raw: string): AbuMatch {
  const text = raw
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\byas marina(?: circuit)?\b/g, "abu dhabi");
  if (hasConflictingTicketContext(text, 2026, "abu-dhabi"))
    return { status: "wrong-event", ids: [] };
  // Club, lounge and suite variants have different access and may have different locations.
  if (
    /\b(club|lounge|suite|hospitality|paddock|hill|general admission|ga|golden circle|concert|roaming oasis)\b/.test(
      text,
    )
  )
    return { status: "unknown", ids: [] };
  const ids: AbuAreaId[] = [];
  if (/\bmain(?:\s+grandstand)?\b|\bgrandstand\s+main\b/.test(text))
    ids.push("main");
  // Consume longer product names before looking for their shorter grandstand names.
  let remainder = text;
  for (const direction of ["north", "west"] as const) {
    const pattern = new RegExp(
      `\\b${direction}[-\\s]+straight(?:\\s+grandstand)?\\b|\\bgrandstand\\s+${direction}[-\\s]+straight\\b`,
      "g",
    );
    if (pattern.test(text)) {
      ids.push(`${direction}-straight`);
      remainder = remainder.replace(pattern, " ");
    }
  }
  for (const direction of ["north", "west", "south", "marina"] as const)
    if (
      new RegExp(
        `\\b${direction}(?:\\s+grandstand)?\\b|\\bgrandstand\\s+${direction}\\b`,
      ).test(remainder)
    )
      ids.push(direction);
  const row = text
    .match(/\brow\s*[:#-]?\s*([a-z]?\d{1,3}|[a-z]{1,2})\b/i)?.[1]
    ?.toUpperCase();
  const seat = text
    .match(/\bseat\s*[:#-]?\s*(\d{1,4}[a-z]?)\b/i)?.[1]
    ?.toUpperCase();
  const section = text
    .match(/\bsection\s*[:#-]?\s*([a-z]?\d{1,3}|[a-z]{1,3})\b/i)?.[1]
    ?.toUpperCase();
  return {
    status:
      ids.length === 1 ? "matched" : ids.length > 1 ? "ambiguous" : "unknown",
    ids,
    row,
    seat,
    section,
  };
}
export function abuShareUrl(origin: string, id: AbuAreaId) {
  const url = new URL(origin);
  url.search = "";
  url.hash = "";
  url.searchParams.set("season", "2026");
  url.searchParams.set("race", "united-arab-emirates");
  url.searchParams.set("area", id);
  return url.href;
}
export const yasGeometry = geography;
