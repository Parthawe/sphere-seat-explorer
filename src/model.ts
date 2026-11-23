export type Mode = "overview" | "stand" | "seat";
export type Selection = { stand: string; row: number; seat: number };
export type Stand = {
  id: string;
  name: string;
  corner: string;
  description: string;
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
    center: [27, 0, -153],
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
    center: [-30, 0, -153],
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
];
export const DEFAULT: Selection = { stand: "C", row: 12, seat: 18 };
export const sources = [
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
  };
}
export function key(s: Selection) {
  return s.stand + ":" + s.row + ":" + s.seat;
}
export function decode(value: string): Selection | null {
  const [stand, row, seat] = value.split(":");
  if (
    !stands.some((s) => s.id === stand) ||
    !/^\d+$/.test(row || "") ||
    !/^\d+$/.test(seat || "")
  )
    return null;
  return normalize({ stand, row: Number(row), seat: Number(seat) });
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
  const mode: Mode = value === "seat" || value === "stand" ? value : "overview";
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
  const a = getStand(s.stand).rotation;
  const p = seatPosition(s);
  return [p[0] + Math.sin(a) * 90, p[1] - 1.5, p[2] + Math.cos(a) * 90];
}
export function addSaved(saved: Selection[], s: Selection) {
  return saved.some((x) => key(x) === key(s))
    ? saved
    : saved.length >= 3
      ? saved
      : [...saved, { ...s }];
}
