export type AreaKind = "Grandstand" | "General admission" | "Hospitality";
export type VegasArea = {
  id: string;
  name: string;
  zone: string;
  focus: string;
  kind: AreaKind;
  stand?: string;
  point: [number, number];
};
export const vegasAreas: VegasArea[] = [
  {
    id: "sphere-grandstands",
    name: "T-Mobile Grandstands",
    zone: "T-Mobile Zone at Sphere",
    focus: "Turn 5 and Turns 7–9",
    kind: "Grandstand",
    stand: "C",
    point: [0, -140],
  },
  {
    id: "main",
    name: "Heineken Silver Main Grandstand",
    zone: "East Harmon",
    focus: "Start / finish and pit activity",
    kind: "Grandstand",
    stand: "M",
    point: [645, -125],
  },
  {
    id: "hamilton",
    name: "Lewis Hamilton Grandstand",
    zone: "Performance Zone by WHOOP",
    focus: "Turn 17",
    kind: "Grandstand",
    stand: "H",
    point: [765, 50],
  },
  {
    id: "turn3",
    name: "Turn 3 Grandstand",
    zone: "Koval",
    focus: "Turns 3–4",
    kind: "Grandstand",
    stand: "K",
    point: [615, 70],
  },
  {
    id: "heineken",
    name: "Heineken Grandstands",
    zone: "Koval",
    focus: "Turn 4",
    kind: "Grandstand",
    stand: "F",
    point: [520, 65],
  },
  {
    id: "sphere-ga",
    name: "T-Mobile General Admission",
    zone: "T-Mobile Zone at Sphere",
    focus: "Turn 5 and Turns 7–9",
    kind: "General admission",
    point: [80, -50],
  },
  {
    id: "flamingo",
    name: "Flamingo General Admission",
    zone: "Flamingo Zone by Caesars Rewards",
    focus: "Koval straight",
    kind: "General admission",
    point: [300, 75],
  },
  {
    id: "tavern",
    name: "Trackside Tavern",
    zone: "Grand Prix Plaza",
    focus: "Pit lane, grid and Turns 1–4",
    kind: "Hospitality",
    point: [670, -70],
  },
  {
    id: "skybox",
    name: "Skybox",
    zone: "East Harmon",
    focus: "Grid and start / finish",
    kind: "Hospitality",
    point: [665, -145],
  },
  {
    id: "paris",
    name: "Club Paris",
    zone: "Las Vegas Boulevard",
    focus: "Strip straight",
    kind: "Hospitality",
    point: [430, 465],
  },
  {
    id: "turn3club",
    name: "Turn 3 Club",
    zone: "East Harmon",
    focus: "Turns 2–3",
    kind: "Hospitality",
    point: [600, 5],
  },
  {
    id: "wynn",
    name: "Wynn Grid Club",
    zone: "Grand Prix Plaza",
    focus: "Pit lane and Turns 1–2",
    kind: "Hospitality",
    point: [590, -110],
  },
  {
    id: "garage",
    name: "Gordon Ramsay at F1 Garage",
    zone: "Grand Prix Plaza",
    focus: "Pit lane and start / finish",
    kind: "Hospitality",
    point: [670, -25],
  },
  {
    id: "paddock",
    name: "Paddock Club Suites",
    zone: "Grand Prix Plaza",
    focus: "Start / finish",
    kind: "Hospitality",
    point: [700, -45],
  },
  {
    id: "hgv",
    name: "HGV Clubhouse",
    zone: "Hilton Grand Vacations",
    focus: "Harmon straight",
    kind: "Hospitality",
    point: [750, 240],
  },
  {
    id: "bellagio",
    name: "Bellagio Fountain Club",
    zone: "MGM",
    focus: "Strip straight",
    kind: "Hospitality",
    point: [180, 450],
  },
];
export const areaSource = (kind: AreaKind) =>
  `https://www.f1lasvegasgp.com/tickets/${kind === "Grandstand" ? "grandstands" : kind === "General admission" ? "general-admission" : "hospitality"}/`;
export const sphereMaps = [
  {
    name: "Parking & entrances",
    url:
      "https://us-east-1-msg.graphassets.com/ALB6wy2xYSoCFY4hrWCvsz/" +
      "cmvjyd5j4132i07ll7skl76rn",
  },
  {
    name: "Event level",
    url: "https://us-east-1-msg.graphassets.com/ALB6wy2xYSoCFY4hrWCvsz/cmkogbwqh0jue07lmppq0b2ls",
  },
  {
    name: "Upper suites",
    url: "https://us-east-1-msg.graphassets.com/ALB6wy2xYSoCFY4hrWCvsz/bprDfCwqQlsTVFeUrIrw",
  },
  {
    name: "Main level · 100 seating",
    url: "https://us-east-1-msg.graphassets.com/ALB6wy2xYSoCFY4hrWCvsz/cmkogcdhh0jop07k76h1u40t5",
  },
  {
    name: "Lower level · suites",
    url: "https://us-east-1-msg.graphassets.com/ALB6wy2xYSoCFY4hrWCvsz/TEPRDEyFSJUUhutnrwqn",
  },
  {
    name: "Terrace · 200 seating",
    url: "https://us-east-1-msg.graphassets.com/ALB6wy2xYSoCFY4hrWCvsz/cmkogde2c0kk807k7e05d5yct",
  },
  {
    name: "Lower gallery · 300 & 400 rows 1–15",
    url: "https://us-east-1-msg.graphassets.com/ALB6wy2xYSoCFY4hrWCvsz/cmkogdv4y0kw107k7ayfqsxvh",
  },
  {
    name: "Upper gallery · 400 rows 16+",
    url: "https://us-east-1-msg.graphassets.com/ALB6wy2xYSoCFY4hrWCvsz/LnAPQaLSpOYmDmDkMVcg",
  },
];
export const bowlLevels = [
  {
    level: 100,
    first: 101,
    sections: 10,
    rows: 24,
    seats: 20,
    radius: 20,
    height: 1,
    rise: 0.48,
  },
  {
    level: 200,
    first: 201,
    sections: 11,
    rows: 16,
    seats: 20,
    radius: 36,
    height: 18,
    rise: 0.6,
  },
  {
    level: 300,
    first: 301,
    sections: 11,
    rows: 20,
    seats: 20,
    radius: 47,
    height: 33,
    rise: 0.65,
  },
  {
    level: 400,
    first: 403,
    sections: 7,
    rows: 25,
    seats: 20,
    radius: 61,
    height: 51,
    rise: 0.7,
  },
];
export type BowlSeat = {
  level: number;
  section: number;
  row: number;
  seat: number;
};
export function bowlPosition(s: BowlSeat): [number, number, number] {
  const l = bowlLevels.find((l) => l.level === s.level) || bowlLevels[0];
  const angle =
    -1.13 +
    ((s.section - l.first + (s.seat - 0.5) / l.seats) / l.sections) * 2.26;
  const radius = l.radius + (s.row - 1) * 0.6;
  return [
    Math.sin(angle) * radius,
    l.height + s.row * l.rise,
    Math.cos(angle) * radius - 12,
  ];
}
export const bowlSeatCount = bowlLevels.reduce(
  (n, l) => n + l.sections * l.rows * l.seats,
  0,
);
