export const CHECKED = "2026-11-23";
export const FAQ =
  "https://www.lcsc.qa/faq/formula-1r-qatar-airways-qatar-grand-prix-2026";
export const EVENT_MAP = "https://www.lcsc.qa/interactive-event-map";
export const BOOKING =
  "https://tickets.lcsc.qa/selection/subscription?gtmStepTracking=true&productId=10229653010398";
export const areas = [
  {
    id: "main",
    name: "Main Grandstand",
    short: "Main",
    kind: "Assigned seats",
    position: "Main straight · opposite the pits",
    description:
      "The starting grid, pit garages and main straight are the reference points for this stand. Your zone, row and seat affect the view; their exact positions are not mapped here.",
    focus: "Grid & pit activity",
    path: "main-grandstand-3-day",
    x: 140,
    y: 365,
  },
  {
    id: "north",
    name: "North Grandstand",
    short: "North",
    kind: "Free seating",
    position: "Main straight · towards Turn 1",
    description:
      "Beside the Main Grandstand, with the pit exit and approach to Turn 1 as reference points. Seating is unassigned within this stand.",
    focus: "Pit exit & Turn 1 approach",
    path: "north-grandstand-3-day",
    x: 90,
    y: 270,
  },
  {
    id: "t2",
    name: "T2 Grandstand",
    short: "T2",
    kind: "Free seating",
    position: "Inside Turn 2",
    description:
      "A corner-focused area inside Turn 2, covering the transition from Turn 1 towards Turn 3. Seating is unassigned within this stand.",
    focus: "Corner transitions",
    path: "t2-grandstand-3-day",
    x: 220,
    y: 211,
  },
  {
    id: "t16",
    name: "T16 Grandstand",
    short: "T16",
    kind: "Free seating",
    position: "Final corner · main straight entry",
    description:
      "The final corner and the run onto the main straight define this viewing area. Seating is unassigned within this stand.",
    focus: "Final corner exit",
    path: "t16-grandstand-3-day",
    x: 367,
    y: 490,
  },
  {
    id: "hill",
    name: "Lusail Hill",
    short: "Hill",
    kind: "General admission",
    position: "Elevated viewing · Turn 1",
    description:
      "An elevated general admission area near Turn 1. Your position depends on where you choose to watch within the permitted area; there is no assigned chair.",
    focus: "Turn 1 on a flexible budget",
    path: "general-admission-lusail-hill-3-day",
    x: 65,
    y: 195,
  },
] as const;
export type AreaId = (typeof areas)[number]["id"];
export const areaSource = (id: AreaId) =>
  `https://www.lcsc.qa/ticket/${areas.find((a) => a.id === id)!.path}`;
export type TicketMatch = {
  status: "matched" | "ambiguous" | "unknown" | "wrong-event";
  ids: AreaId[];
  row?: string;
  seat?: string;
  zone?: string;
};
// Pure, local parser. Raw ticket text is never persisted, logged, or sent in a URL.
export function locateTicket(raw: string): TicketMatch {
  const text = raw.normalize("NFKC").toLowerCase().replace(/[–—]/g, "-");
  if (
    /\b202[0-57-9]\b|\b203\d\b|\b(abu dhabi|yas marina|las vegas|singapore|silverstone|bahrain|jeddah|monza|monaco)\b/.test(
      text.replace(/\b(?:seat|row)\s*[:#-]?\s*\d{1,4}\b/g, ""),
    )
  )
    return { status: "wrong-event", ids: [] };
  if (
    /\b(lounge|hospitality|champions club|paddock club|private suite)\b/.test(
      text,
    )
  )
    return { status: "unknown", ids: [] };
  const ids: AreaId[] = [];
  if (/\bmain(?:\s+grandstand)?\b|\bgrandstand\s+main\b/.test(text))
    ids.push("main");
  if (/\bnorth(?:\s+grandstand)?\b/.test(text)) ids.push("north");
  if (/\b(?:t\s*0?2|turn\s*0?2|grandstand\s*0?2)\b/.test(text)) ids.push("t2");
  if (/\b(?:t\s*16|turn\s*16|grandstand\s*16)\b/.test(text)) ids.push("t16");
  if (/\blusail\s+hill\b|\bgeneral\s+admission\b|\bga\b/.test(text))
    ids.push("hill");
  // A bare zone, row or seat cannot establish a stand.
  const row = text
    .match(/\brow\s*[:#-]?\s*([a-z]?\d{1,3}|[a-z]{1,2})\b/i)?.[1]
    ?.toUpperCase();
  const seat = text
    .match(/\bseat\s*[:#-]?\s*(\d{1,4}[a-z]?)\b/i)?.[1]
    ?.toUpperCase();
  const zone = text
    .match(/\bzone\s*[:#-]?\s*([a-f](?:\s*[/&-]\s*[a-f])?)\b/i)?.[1]
    ?.toUpperCase()
    .replace(/\s/g, "");
  return {
    status:
      ids.length === 1 ? "matched" : ids.length > 1 ? "ambiguous" : "unknown",
    ids,
    row,
    seat,
    zone,
  };
}
export const providers = [
  {
    id: "lusail",
    name: "Lusail Circuit",
    type: "Organizer",
    url: BOOKING,
    detail:
      "Official 2026 booking flow. Choose your zone and check the final price here.",
    scope: "Qatar 2026",
    area: true,
  },
  {
    id: "f1",
    name: "F1 Ticket Store",
    type: "Official ticket store",
    url: "https://tickets.formula1.com/en/f1-56257-qatar",
    detail: "Qatar 2026 event catalogue, operated by Platinium Group.",
    scope: "Qatar 2026",
    area: true,
  },
  {
    id: "experiences",
    name: "F1 Experiences",
    type: "Experiences",
    url: "https://f1experiences.com/2026-qatar-grand-prix",
    detail:
      "Hosted packages and additional access. Some begin on Thursday 26 November.",
    scope: "Qatar 2026",
    area: false,
  },
  {
    id: "discover",
    name: "Discover Qatar",
    type: "Organizer-listed seller",
    url: "https://www.discoverqatar.qa/formula1andmotogp",
    detail:
      "Travel and race packages. Confirm the event, dates and inclusions.",
    scope: "Travel catalogue",
    area: false,
  },
  {
    id: "gootickets",
    name: "Gootickets",
    type: "Organizer-listed seller",
    url: "https://www.gootickets.com/",
    detail: "Select Qatar 2026 in the seller’s catalogue.",
    scope: "Seller catalogue",
    area: false,
  },
  {
    id: "motorsport",
    name: "Motorsport Tickets",
    type: "Organizer-listed seller",
    url: "https://motorsporttickets.com/",
    detail: "Select the Qatar Grand Prix and confirm 2026 before buying.",
    scope: "Seller catalogue",
    area: false,
  },
  {
    id: "p1",
    name: "P1 Travel",
    type: "Organizer-listed seller",
    url: "https://www.p1travel.com/",
    detail:
      "Listed in Lusail’s authorized reseller guidance. Select Qatar 2026.",
    scope: "Seller catalogue",
    area: false,
  },
  {
    id: "gpt",
    name: "GPT Worldwide",
    type: "Organizer-listed seller",
    url: "https://www.gpt-worldwide.com/",
    detail:
      "Select the event and review the named grandstand and ticket duration.",
    scope: "Seller catalogue",
    area: false,
  },
  {
    id: "gpe",
    name: "Grand Prix Events",
    type: "Organizer-listed seller",
    url: "https://grandprixevents.com/",
    detail:
      "Event tickets and packages; confirm year, location and inclusions.",
    scope: "Seller catalogue",
    area: false,
  },
];
export type SourceSnapshot = {
  checkedAt: string;
  sources: {
    id: string;
    url: string;
    status: string;
    title?: string;
    price?: number;
    currency?: string;
    duration?: string;
    note: string;
    checkedAt: string;
  }[];
};
export const providerUrl = (id: string, area: AreaId) =>
  id === "lusail"
    ? areaSource(area)
    : id === "f1"
      ? {
          main: "https://tickets.formula1.com/en/f1-56257-qatar/16887-main-grandstand",
          t16: "https://tickets.formula1.com/en/f1-56257-qatar/20767-t16-grandstand",
          hill: "https://tickets.formula1.com/en/f1-56257-qatar/20777-general-admission-qatar",
        }[area as "main" | "t16" | "hill"] || providers[1].url
      : providers.find((p) => p.id === id)!.url;
