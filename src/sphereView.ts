import { bowlLevels, type BowlSeat } from "./vegas";

export function normalizeBowlSeat(input: Partial<BowlSeat>): BowlSeat {
  const level = bowlLevels.find(l => l.level === input.level) || bowlLevels[1];
  const bounded = (value: number | undefined, min: number, max: number, fallback: number) =>
    Number.isFinite(value) ? Math.max(min, Math.min(max, Math.round(value!))) : fallback;
  return {
    level: level.level,
    section: bounded(input.section, level.first, level.first + level.sections - 1, level.first + Math.floor(level.sections / 2)),
    row: bounded(input.row, 1, level.rows, 8),
    seat: bounded(input.seat, 1, level.seats, 10),
  };
}

export function readBowlView(search: string) {
  const p = new URLSearchParams(search);
  const number = (name: string) => p.has(name) ? Number(p.get(name)) : undefined;
  return {
    seat: normalizeBowlSeat({ level: number("sphereLevel"), section: number("sphereSection"), row: number("sphereRow"), seat: number("sphereSeat") }),
    eye: p.get("sphereView") === "seat",
    all: p.get("sphereLevels") !== "selected",
  };
}

export function bowlViewUrl(origin: string, season: number, seat: BowlSeat, eye: boolean, all: boolean) {
  const url = new URL("/", origin);
  const s = normalizeBowlSeat(seat);
  url.search = new URLSearchParams({ season: String(season), race: "las-vegas", screen: "vegas", venue: "sphere",
    sphereLevel: String(s.level), sphereSection: String(s.section), sphereRow: String(s.row), sphereSeat: String(s.seat),
    sphereView: eye ? "seat" : "bowl", sphereLevels: all ? "all" : "selected" }).toString();
  return url.href;
}
