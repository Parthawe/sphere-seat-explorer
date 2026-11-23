export type SphereDisplay = "amber" | "moon" | "race";
export const sphereDisplays = [
  { id: "moon" as const, label: "Lunar surface" },
  { id: "amber" as const, label: "Amber face" },
  { id: "race" as const, label: "Race ribbons" },
];
export function nearestTrackFraction(
  points: { x: number; z: number }[],
  position: [number, number, number],
) {
  let index = 0,
    best = Infinity;
  points.forEach((p, i) => {
    const d = (p.x - position[0]) ** 2 + (p.z - position[2]) ** 2;
    if (d < best) {
      best = d;
      index = i;
    }
  });
  return index / Math.max(1, points.length - 1);
}
export function buildingHeight(
  height: string | null,
  levels: string | null,
  name = "",
) {
  const measured = parseFloat(height || ""),
    storeys = parseFloat(levels || "");
  const value = Number.isFinite(measured)
    ? measured * (/ft|feet/.test(height || "") ? 0.3048 : 1)
    : Number.isFinite(storeys)
      ? storeys * 3.2
      : name.includes("Expo")
        ? 18
        : 14;
  return Math.min(210, Math.max(6, value));
}
