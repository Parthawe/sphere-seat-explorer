export const SINGAPORE_CHECKED = "2026-11-23";
export const SINGAPORE_TICKETS =
  "https://singaporegp.sg/en/tickets/general-tickets/grandstands/";
export const SINGAPORE_MAP =
  "https://singaporegp.sg/en/event-info/circuit-park-map/";
export const SINGAPORE_RESELLERS =
  "https://singaporegp.sg/en/tickets/official-resellers/";
export const singaporeAreas = [
  {
    id: "pit",
    name: "Pit Grandstand",
    short: "Pit",
    point: [547, 220],
    label: [548, 270],
    position: "Pit straight · starting grid",
    focus: "Starting grid & garages",
    zones: "1, 2, 3, 4",
    description:
      "The current organizer product describes the pit straight, starting grid and F1 garages as the reference points for this grandstand.",
  },
  {
    id: "turn-1",
    name: "Turn 1 Grandstand",
    short: "Turn 1",
    point: [493, 122],
    label: [550, 155],
    position: "Turn 1 · first braking zone",
    focus: "Start & first braking zone",
    zones: "1, 2, 3, 4",
    description:
      "The organizer places this product at the end of the pit straight, towards the first braking zone and opening corners.",
  },
  {
    id: "turn-2",
    name: "Turn 2 Grandstand",
    short: "Turn 2",
    point: [446, 104],
    label: [366, 75],
    position: "Opening corner complex",
    focus: "Turns 1–3 & pit exit",
    zones: "1, 2, 3, 4",
    description:
      "The current product describes an elevated view of the opening corner complex and pit-lane exit. Its broad region is separate from Turn 1 Grandstand.",
  },
  {
    id: "republic",
    name: "Republic Grandstand",
    short: "Republic",
    point: [451, 211],
    label: [337, 180],
    position: "Turn 5 · Republic Boulevard",
    focus: "Turn 5 acceleration",
    zones: "1, 2, 3, 4",
    description:
      "The organizer places Republic Grandstand on the drivers’ right at Turn 5. The marker estimates that track region, not a stand footprint.",
  },
  {
    id: "padang",
    name: "Padang Grandstand",
    short: "Padang",
    point: [134, 270],
    label: [38, 234],
    position: "Between Turns 9–10 · St Andrew’s Road",
    focus: "Run towards Turn 10",
    zones: "4",
    description:
      "The current product describes the run towards Turn 10, between Turns 9 and 10 beside the Padang. Its published access is Zone 4.",
  },
  {
    id: "connaught",
    name: "Connaught Grandstand",
    short: "Connaught",
    point: [229, 255],
    label: [279, 346],
    position: "Esplanade Bridge · Turn 14 braking",
    focus: "Bridge approach & braking",
    zones: "4",
    description:
      "The organizer describes the run across Esplanade Bridge and the braking zone for Turn 14. Its published access is Zone 4.",
  },
  {
    id: "marina-bay",
    name: "Marina Bay Grandstand",
    short: "Marina Bay",
    point: [540, 307],
    label: [487, 372],
    position: "Final sector · Turn 18 region",
    focus: "Final corners & pit-straight approach",
    zones: "1, 2, 3, 4",
    description:
      "The organizer describes views of the last two corners before the pit straight and identifies Turn 18 in its overview. This estimates the final-sector region, not the former Bay Grandstand or a measured stand boundary.",
  },
  {
    id: "bayfront",
    name: "Bayfront Grandstand",
    short: "Bayfront",
    point: [403, 311],
    label: [353, 442],
    position: "Benjamin Sheares Bridge · Turns 16–17",
    focus: "Braking through Turns 16–17",
    zones: "1, 2, 3, 4",
    description:
      "The organizer places Bayfront beneath Benjamin Sheares Bridge, facing the braking sequence at Turns 16 and 17. This marker estimates that region; it does not locate a gate or an individual seat.",
  },
  {
    id: "promenade",
    name: "Promenade Grandstand",
    short: "Promenade",
    point: [467, 337],
    label: [453, 403],
    position: "Between Turns 17–18 · Singapore Flyer",
    focus: "Final corners & pit-lane entry",
    zones: "1, 2, 3, 4",
    description:
      "The organizer identifies the region between Turns 17 and 18, with views towards the final corners and cars entering the pit lane. Its marker is kept separate from Marina Bay Grandstand.",
  },
  {
    id: "raffles",
    name: "Raffles Grandstand",
    short: "Raffles",
    point: [453, 252],
    label: [383, 305],
    position: "Turn 5 · Raffles Boulevard · drivers’ left",
    focus: "Turn 5 apex & straight exit",
    zones: "1, 2, 3, 4",
    description:
      "The organizer places Raffles on the drivers’ left along Raffles Boulevard at Turn 5. It is distinct from Republic on the drivers’ right; both markers are estimated regions.",
  },
  {
    id: "empress",
    name: "Empress Grandstand",
    short: "Empress",
    point: [127, 343],
    label: [57, 417],
    position: "Turns 11–12 · Anderson Bridge approach",
    focus: "Braking & Civic District corner sequence",
    zones: "4",
    description:
      "The organizer describes braking for Turn 11 and the sequence towards Anderson Bridge, with its overview placing the stand between Turns 11 and 12. Published access is Zone 4.",
  },
  {
    id: "stamford",
    name: "Stamford Grandstand",
    short: "Stamford",
    point: [218, 185],
    label: [228, 124],
    position: "Between Turns 7–8",
    focus: "Turn 7 braking & Turn 8 acceleration",
    zones: "4",
    description:
      "The organizer describes views of Turns 7 and 8, covering braking into Turn 7 and acceleration towards Turn 8. Published access is Zone 4; this is not a surveyed stand footprint.",
  },
].map((a) => ({
  ...a,
  source: SINGAPORE_TICKETS + a.id + "-grandstand/",
  kind: "3-day grandstand",
  access: a.zones === "4" ? "Zone 4" : "Zones " + a.zones,
  confidence: "Estimated region",
}));
export type SingaporeMatch = {
  status: "matched" | "ambiguous" | "unknown" | "wrong-event";
  ids: string[];
  row?: string;
  seat?: string;
  section?: string;
};
export function locateSingaporeTicket(raw: string): SingaporeMatch {
  const text = raw.normalize("NFKC").toLowerCase().replace(/[–—]/g, "-");
  const context = text.replace(
    /\b(?:row|seat|section)\s*[:#-]?\s*\d{1,4}\b/g,
    "",
  );
  if (
    /\b202[0-68-9]\b|\b203\d\b|\b(qatar|lusail|abu dhabi|yas marina|las vegas|silverstone|monza|jeddah|bahrain)\b/.test(
      context,
    )
  )
    return { status: "wrong-event", ids: [] };
  // Variants and combination passes do not establish one supported standard grandstand.
  if (
    /\b(super[-\s]*pit|pit[-\s]+exit|chicane|comb(?:i(?:nation)?|o)|walkabout|wheelchair|platform|hospitality|lounge|suite|paddock|premier|twenty3)\b/.test(
      text,
    )
  )
    return { status: "unknown", ids: [] };
  const ids: string[] = [];
  if (/\bpit(?:\s+grandstand)?\b/.test(text)) ids.push("pit");
  if (/\b(?:turn\s*0?1|t\s*0?1)\b/.test(text)) ids.push("turn-1");
  if (/\b(?:turn\s*0?2|t\s*0?2)\b/.test(text)) ids.push("turn-2");
  if (/\bmarina\s+bay\s+grandstand\b/.test(text)) ids.push("marina-bay");
  for (const name of ["republic", "padang", "connaught", "bayfront", "promenade", "raffles", "empress", "stamford"])
    if (new RegExp(`\\b${name}\\b`).test(text)) ids.push(name);
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
