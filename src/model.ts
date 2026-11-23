export type Mode = "overview" | "circuit" | "stand" | "seat";
export type Selection = {
  stand: string;
  row: number;
  seat: number;
  party?: number;
};
export type CameraLook = { yaw: number; pitch: number };
export type Stand = {
  id: string;
  name: string;
  corner: string;
  description: string;
  zone?: string;
  center: [number, number, number];
  rotation: number;
  rows: number;
  seats: number;
};
// Zone placement follows the official 2026 diagram. Dimensions, subdivisions,
// row counts and seat numbers are reconstruction parameters, not ticket inventory.
export const stands: Stand[] = [
  {
    id: "A",
    name: "Turn 5",
    corner: "T5–T6",
    description:
      "Along the approach to Sphere. Look across the circuit toward the illuminated exterior.",
    center: [148, 0, 22],
    rotation: -Math.PI / 2,
    rows: 18,
    seats: 42,
  },
  {
    id: "B",
    name: "Turn 6",
    corner: "T6–T7",
    description:
      "At the beginning of the Sphere sequence, with an angled view into the chicane.",
    center: [82, 0, -137],
    rotation: -0.25,
    rows: 18,
    seats: 36,
  },
  {
    id: "C",
    name: "Chicane east",
    corner: "T7–T8",
    description:
      "Face the technical section with Sphere behind the racing line.",
    center: [27, 0, -129],
    rotation: -0.07,
    rows: 18,
    seats: 36,
  },
  {
    id: "D",
    name: "Chicane west",
    corner: "T8",
    description:
      "A central perspective on the direction changes, looking toward Sphere.",
    center: [-30, 0, -141],
    rotation: 0,
    rows: 18,
    seats: 36,
  },
  {
    id: "E",
    name: "Turn 9",
    corner: "T8–T9",
    description:
      "Follow the chicane exit from the western end of the modeled grandstands.",
    center: [-80, 0, -139],
    rotation: 0.55,
    rows: 18,
    seats: 30,
  },
  {
    id: "M",
    name: "Main grandstand bank",
    corner: "START / FINISH",
    zone: "East Harmon",
    description:
      "A modeled bank representing the main-grandstand viewing area. Inspect the starting straight; exact seating subdivisions are unverified.",
    center: [645, 0, -125],
    rotation: -0.65,
    rows: 18,
    seats: 60,
  },
  {
    id: "H",
    name: "Turn 17 bank",
    corner: "T17",
    zone: "West Harmon / Performance Zone",
    description:
      "A modeled bank for the Lewis Hamilton Grandstand area at the final corner. This is not its official seat inventory.",
    center: [765, 0, 50],
    rotation: -Math.PI / 2,
    rows: 18,
    seats: 42,
  },
  {
    id: "K",
    name: "Turn 3 bank",
    corner: "T3–T4",
    zone: "Koval",
    description:
      "An illustrative seating bank facing the Turn 3 area. Verify the real section and aisle layout with the organizer.",
    center: [615, 0, 70],
    rotation: -Math.PI / 2,
    rows: 18,
    seats: 40,
  },
  {
    id: "F",
    name: "Turn 4 bank",
    corner: "T4",
    zone: "Koval",
    description:
      "A modeled bank for the Heineken Grandstands area beside Turn 4. Rows, dimensions and relative positions are estimated.",
    center: [520, 0, 65],
    rotation: 0,
    rows: 18,
    seats: 36,
  },
];
export const DEFAULT: Selection = { stand: "C", row: 12, seat: 18 };
export const sources = [
  {
    title: "NASA CGI Moon Kit",
    url: "https://svs.gsfc.nasa.gov/4720",
    detail:
      "Lunar surface map for the simulated Exosphere display. It is not a recording of Sphere programming.",
  },
  {
    title: "OpenStreetMap building context",
    url: "https://www.openstreetmap.org/copyright",
    detail:
      "Nearby footprint outlines, with tagged heights where available and estimated heights otherwise. Track and seat alignment remain reconstructed. ODbL data is available at /geo/buildings.json.",
  },
  {
    title: "Sphere official XO Stream",
    url: "https://www.thesphere.com/xo-stream",
    detail: "Watch the actual current Exosphere display externally.",
  },
  {
    title: "Sphere Entertainment published dimensions",
    url: "https://www.sec.gov/Archives/edgar/data/1795250/000162828026007760/sphr-20251231.htm",
    detail:
      "516 ft width and 366 ft height. The spherical-cap interpretation and surrounding placement remain reconstructed.",
  },
  {
    title: "Official 2026 Sphere-zone diagram",
    url: "https://www.f1lasvegasgp.com/app/uploads/2026/03/TMOGRANDSTAND-1.png",
    detail: "Track shape and approximate grandstand placement.",
  },
  {
    title: "Official T-Mobile Grandstands",
    url: "https://www.f1lasvegasgp.com/tickets/grandstands/t-mobile-grandstands/",
    detail:
      "Zone location, assigned seating and organizer imagery. The page may now describe a later edition.",
  },
  {
    title: "Official circuit layout",
    url: "https://www.f1lasvegasgp.com/track-layout/",
    detail:
      "Circuit orientation and corner sequence. Live organizer content may change.",
  },
];
export function getStand(id: string) {
  return stands.find((s) => s.id === id) || stands[2];
}
export function normalize(input: Partial<Selection>): Selection {
  const s = getStand(input.stand || "C");
  const bound = (n: unknown, max: number, fallback: number) =>
    typeof n === "number" && Number.isFinite(n)
      ? Math.max(1, Math.min(max, Math.round(n)))
      : fallback;
  return {
    stand: s.id,
    row: bound(input.row, s.rows, 12),
    seat: bound(input.seat, s.seats, Math.ceil(s.seats / 2)),
    ...(bound(input.party, 4, 1) > 1
      ? { party: bound(input.party, 4, 1) }
      : {}),
  };
}
export function key(s: Selection) {
  return (
    s.stand +
    ":" +
    s.row +
    ":" +
    s.seat +
    ((s.party || 1) > 1 ? ":" + s.party : "")
  );
}
export function decode(value: string): Selection | null {
  const [stand, row, seat, party, ...extra] = value.split(":");
  if (
    !stands.some((s) => s.id === stand) ||
    !/^\d+$/.test(row || "") ||
    !/^\d+$/.test(seat || "") ||
    extra.length > 0 ||
    (party !== undefined && !/^[1-4]$/.test(party))
  )
    return null;
  return normalize({
    stand,
    row: Number(row),
    seat: Number(seat),
    party: party ? Number(party) : 1,
  });
}
export function readUrl(search: string) {
  const p = new URLSearchParams(search);
  const current = decode(p.get("seat") || "") || DEFAULT;
  const saved = (p.get("compare") || "")
    .split(",")
    .map(decode)
    .filter((s): s is Selection => !!s)
    .filter((s, i, a) => a.findIndex((x) => key(x) === key(s)) === i)
    .slice(0, 3);
  const value = p.get("view");
  const mode: Mode =
    value === "overview" || value === "circuit" || value === "stand"
      ? value
      : "seat";
  return { current, saved, mode, hasComparison: p.has("compare") };
}
export function makeSearch(current: Selection, mode: Mode, saved: Selection[]) {
  const p = new URLSearchParams();
  p.set("seat", key(current));
  p.set("view", mode);
  if (saved.length) p.set("compare", saved.map(key).join(","));
  return "?" + p.toString();
}
export function seatPosition(s: Selection): [number, number, number] {
  const stand = getStand(s.stand),
    x =
      (s.seat - (stand.seats + 1) / 2) * 1.1 +
      (s.seat > stand.seats / 2 ? 1.1 : -1.1),
    z = -s.row * 1.05;
  return [
    stand.center[0] +
      x * Math.cos(stand.rotation) +
      z * Math.sin(stand.rotation),
    1.2 + s.row * 0.55,
    stand.center[2] -
      x * Math.sin(stand.rotation) +
      z * Math.cos(stand.rotation),
  ];
}
export function seatTarget(s: Selection): [number, number, number] {
  const stand = getStand(s.stand),
    a = stand.rotation;
  const p = seatPosition(s);
  return [
    p[0] + Math.sin(a) * 90,
    p[1] + (stand.zone ? -2 : 22),
    p[2] + Math.cos(a) * 90,
  ];
}
export function addSaved(saved: Selection[], s: Selection) {
  return saved.some((x) => key(x) === key(s))
    ? saved
    : saved.length >= 3
      ? saved
      : [...saved, { ...s }];
}

export function partySeats(selection: Selection): number[] {
  const s = normalize(selection),
    stand = getStand(s.stand),
    count = s.party || 1,
    split = Math.ceil(stand.seats / 2),
    left = s.seat <= split;
  const first = left ? 1 : split + 1,
    last = left ? split : stand.seats;
  const start = Math.max(first, Math.min(s.seat, last - count + 1));
  return Array.from({ length: count }, (_, i) => start + i);
}
export function seatRange(s: Selection) {
  const seats = partySeats(s);
  return seats.length === 1
    ? String(seats[0])
    : seats[0] + "–" + seats[seats.length - 1];
}
export function selectionLabel(s: Selection) {
  return ((s.party || 1) > 1 ? "Seats " : "Seat ") + seatRange(s);
}

// Sphere Entertainment's published external envelope (516 ft × 366 ft).
export const SPHERE = {
  radius: 78.6384,
  height: 111.5568,
  centerY: 111.5568 - 78.6384,
  thetaLength: Math.acos(-(111.5568 - 78.6384) / 78.6384),
};
