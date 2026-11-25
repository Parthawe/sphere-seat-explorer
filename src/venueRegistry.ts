import {suzukaAreas,suzukaGeography,SUZUKA_CHECKED,SUZUKA_TICKETS} from './suzuka';
import { singaporeAreas, SINGAPORE_CHECKED, SINGAPORE_MAP } from "./singapore";
import singaporeGeometry from "./singapore-track.json";
import type { Season } from "./races";
import {
  areas as qatarAreas,
  areaSource,
  CHECKED,
  EVENT_MAP,
  FAQ,
} from "./ticketing";
import { abuAreas, ABU_CHECKED, ABU_CIRCUIT, ABU_FAQ } from "./abuDhabi";
import lusail from "./lusail-track.json";
import yas from "./yas-track.json";
export type MapDecoration =
  | { kind: "text"; x: number; y: number; text: string }
  | { kind: "path"; d: string; stroke: string; width: number; dash?: string };
export type VenueArea = {
  id: string;
  name: string;
  short: string;
  controlLabel?: string;
  access?: string;
  point: readonly number[];
  label: readonly number[];
  kind: string;
  focus: string;
  position: string;
  description: string;
  source: string;
  confidence: string;
};
export type VenueDefinition = {
  id: string;
  raceSlug: string;
  circuitId: string;
  season: Season;
  name: string;
  watermark: string;
  checked: string;
  durationDays: number;
  officialMap: string;
  ticketGuidance: string;
  geography: {
    source: string;
    licence: string;
    queried: string;
    points: number[][];
  };
  download: string;
  areas: readonly VenueArea[];
  map: {
    markerStyle: "seating" | "callout";
    movingDot?: boolean;
    roadStroke?: number;
    trackStroke?: number;
    decorations?: readonly MapDecoration[];
  };
  coverage: { level: "area-estimate"; exactSeats: false; seat3d: false };
};
// Season is part of identity. A later calendar entry never silently inherits a ticket layout.
export const venueRegistry: readonly VenueDefinition[] = [
  {
    id: "qatar",
    circuitId: "lusail",
    raceSlug: "qatar",
    season: 2026,
    name: "Lusail International Circuit",
    watermark: "LUSAIL",
    checked: CHECKED,
    durationDays: 3,
    officialMap: EVENT_MAP,
    ticketGuidance: FAQ,
    geography: lusail,
    download: "/data/lusail-track.json",
    coverage: { level: "area-estimate", exactSeats: false, seat3d: false },
    areas: qatarAreas.map((a) => ({
      ...a,
      source: areaSource(a.id),
      point: [a.x, a.y],
      label: [a.x + (a.id === "hill" ? -35 : 19), a.y - 18],
      confidence: "Estimated region",
      controlLabel: a.id === "hill" ? "Lusail Hill" : a.short,
    })),
    map: {
      markerStyle: "seating",
      movingDot: true,
      decorations: [
        {
          kind: "path",
          d: "M199 339L240 387",
          stroke: "#9195a6",
          width: 4,
          dash: "4 4",
        },
        { kind: "text", x: 253, y: 393, text: "START / FINISH" },
        { kind: "path", d: "M208 319L252 378", stroke: "#5a5d70", width: 11 },
        { kind: "text", x: 265, y: 365, text: "PITS" },
        { kind: "text", x: 126, y: 199, text: "T1" },
        { kind: "text", x: 179, y: 254, text: "T2" },
        { kind: "text", x: 310, y: 456, text: "T16" },
      ],
    },
  },
  {
    id: "abu-dhabi",
    circuitId: "yas-marina",
    raceSlug: "united-arab-emirates",
    season: 2026,
    name: "Yas Marina Circuit",
    watermark: "YAS MARINA",
    checked: ABU_CHECKED,
    durationDays: 4,
    officialMap: ABU_CIRCUIT,
    ticketGuidance: ABU_FAQ,
    geography: yas,
    download: "/data/yas-track.json",
    coverage: { level: "area-estimate", exactSeats: false, seat3d: false },
    areas: abuAreas.map((a) => ({ ...a, kind: "Seat selection offered" })),
    map: { markerStyle: "callout" },
  },
  {
    id: "singapore",
    circuitId: "marina-bay",
    raceSlug: "singapore",
    season: 2027,
    name: "Marina Bay Street Circuit",
    watermark: "MARINA BAY",
    checked: SINGAPORE_CHECKED,
    durationDays: 3,
    officialMap: SINGAPORE_MAP,
    ticketGuidance: "https://singaporegp.sg/en/faq/ticketing/",
    geography: singaporeGeometry,
    download: "/data/singapore-track.json",
    coverage: { level: "area-estimate", exactSeats: false, seat3d: false },
    areas: singaporeAreas,
    map: { markerStyle: "callout", roadStroke: 6, trackStroke: 2.5 },
  },
  {
    id:'japan',circuitId:'suzuka',raceSlug:'japan',season:2027,name:'Suzuka Circuit',watermark:'SUZUKA',checked:SUZUKA_CHECKED,durationDays:3,officialMap:SUZUKA_TICKETS,ticketGuidance:'https://www.suzukacircuit.jp/f1/faq/faq_ticket.html',geography:suzukaGeography,download:'/data/suzuka-track.json',coverage:{level:'area-estimate',exactSeats:false,seat3d:false},areas:suzukaAreas,map:{markerStyle:'callout',roadStroke:9,trackStroke:3,decorations:[{kind:'path',d:'M'+suzukaGeography.grade_separation.upper_map_points.map(p=>p.join(',')).join(' L'),stroke:'#20212b',width:12},{kind:'path',d:'M'+suzukaGeography.grade_separation.upper_map_points.map(p=>p.join(',')).join(' L'),stroke:'#f0f1f4',width:3}]}
  },
];
export function findVenue(season: number, raceSlug: string) {
  return venueRegistry.find(
    (v) => v.season === season && v.raceSlug === raceSlug,
  );
}
export function requireVenue(id: string, season: number) {
  const venue = venueRegistry.find((v) => v.id === id && v.season === season);
  if (!venue) throw new Error("Unsupported venue configuration");
  return venue;
}
export function comparisonStorageKey(
  venue: Pick<VenueDefinition, "id"> & { season: number },
) {
  return `apex-${venue.id}-${venue.season}-areas`;
}
export function venueAreaUrl(
  origin: string,
  venue: VenueDefinition,
  id: string,
) {
  if (!venue.areas.some((a) => a.id === id))
    throw new Error("Unsupported viewing area");
  const url = new URL(origin);
  url.search = "";
  url.hash = "";
  url.searchParams.set("season", String(venue.season));
  url.searchParams.set("race", venue.raceSlug);
  url.searchParams.set("area", id);
  return url.href;
}
