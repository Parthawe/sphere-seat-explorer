export type Season = 2026 | 2027;
export type Race = {
  slug: string;
  name: string;
  start: string;
  end: string;
  round: number;
  season: Season;
};
export const CALENDAR_CHECKED = "2026-11-22";
// Snapshot of the current Formula 1 calendars, inspected 22 November 2026.
// Weekend dates are local calendar dates, not UTC session timestamps.
const rows: Record<Season, [string, string, string, string][]> = {
  2026: [
    ["australia", "Australia", "03-06", "03-08"],
    ["china", "China", "03-13", "03-15"],
    ["japan", "Japan", "03-27", "03-29"],
    ["miami", "Miami", "05-01", "05-03"],
    ["canada", "Canada", "05-22", "05-24"],
    ["monaco", "Monaco", "06-05", "06-07"],
    ["barcelona-catalunya", "Barcelona-Catalunya", "06-12", "06-14"],
    ["austria", "Austria", "06-26", "06-28"],
    ["great-britain", "Great Britain", "07-03", "07-05"],
    ["belgium", "Belgium", "07-17", "07-19"],
    ["hungary", "Hungary", "07-24", "07-26"],
    ["netherlands", "Netherlands", "08-21", "08-23"],
    ["italy", "Italy", "09-04", "09-06"],
    ["spain", "Spain", "09-11", "09-13"],
    ["azerbaijan", "Azerbaijan", "09-24", "09-26"],
    ["bahrain", "Bahrain GP in Malaysia", "10-02", "10-04"],
    ["singapore", "Singapore", "10-09", "10-11"],
    ["united-states", "United States", "10-23", "10-25"],
    ["mexico", "Mexico", "10-30", "11-01"],
    ["brazil", "Brazil", "11-06", "11-08"],
    ["las-vegas", "Las Vegas", "11-19", "11-21"],
    ["qatar", "Qatar", "11-27", "11-29"],
    ["united-arab-emirates", "Abu Dhabi", "12-04", "12-06"],
  ],
  2027: [
    ["bahrain", "Bahrain", "03-12", "03-14"],
    ["saudi-arabia", "Saudi Arabia", "03-19", "03-21"],
    ["australia", "Australia", "04-02", "04-04"],
    ["japan", "Japan", "04-09", "04-11"],
    ["china", "China", "04-16", "04-18"],
    ["miami", "Miami", "04-30", "05-02"],
    ["canada", "Canada", "05-21", "05-23"],
    ["monaco", "Monaco", "06-04", "06-06"],
    ["portugal", "Portugal", "06-18", "06-20"],
    ["great-britain", "Great Britain", "07-02", "07-04"],
    ["austria", "Austria", "07-09", "07-11"],
    ["belgium", "Belgium", "07-23", "07-25"],
    ["hungary", "Hungary", "07-30", "08-01"],
    ["italy", "Italy", "09-03", "09-05"],
    ["spain", "Spain", "09-10", "09-12"],
    ["azerbaijan", "Azerbaijan", "09-24", "09-26"],
    ["turkey", "Türkiye", "10-01", "10-03"],
    ["singapore", "Singapore", "10-08", "10-10"],
    ["united-states", "United States", "10-22", "10-24"],
    ["mexico", "Mexico", "10-29", "10-31"],
    ["brazil", "Brazil", "11-05", "11-07"],
    ["las-vegas", "Las Vegas", "11-18", "11-20"],
    ["qatar", "Qatar", "12-03", "12-05"],
    ["united-arab-emirates", "Abu Dhabi", "12-10", "12-12"],
  ],
};
export const calendars = Object.fromEntries(
  Object.entries(rows).map(([year, races]) => [
    year,
    races.map(([slug, name, start, end], i) => ({
      slug,
      name,
      start: `${year}-${start}`,
      end: `${year}-${end}`,
      round: i + 1,
      season: Number(year) as Season,
    })),
  ]),
) as Record<Season, Race[]>;
export const calendarUrl = (year: Season) =>
  `https://www.formula1.com/en/racing/${year}`;
export const raceUrl = (race: Race) =>
  `${calendarUrl(race.season)}/${race.slug}`;
export function raceStatus(
  race: Race,
  today = new Date().toISOString().slice(0, 10),
) {
  return race.end < today
    ? "Past"
    : race.start > today
      ? "Upcoming"
      : "Race weekend";
}
export function dateLabel(race: Race) {
  const fmt = (d: string) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(new Date(d + "T12:00:00Z"));
  return `${fmt(race.start)} – ${fmt(race.end)}`;
}
