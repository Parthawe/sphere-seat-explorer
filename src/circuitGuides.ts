import type { Race, Season } from "./races";
import publishedFacts from "./circuitGuideFacts.json";

export const CIRCUIT_GUIDES_CHECKED = "2026-11-26";
export type CircuitGuide = {
  id: string;
  race: string;
  seasons: readonly Season[];
  venue: string;
  location: string;
  referenceSeason: Season;
  overview: string;
  viewing: readonly { name: string; detail: string }[];
  ticketCheck: string;
  ticketChecks?: Partial<Record<Season,string>>;
  arrivalCheck: string;
  ticketPath?: string;
};

/** Circuit context from the linked F1 guides, not a ticket-product or seat inventory. */
export const circuitGuides: readonly CircuitGuide[] = [
  {
    id: "albert-park", race: "australia", seasons: [2026, 2027], venue: "Albert Park Grand Prix Circuit", location: "Melbourne, Australia", referenceSeason: 2027, ticketPath: "australia",
    overview: "A fast temporary circuit around Albert Park Lake. Compare the opening sequence with the quicker lakeside corners.",
    viewing: [
      { name: "Brabham / opening corners", detail: "Follow the opening changes of direction near Turn 2." },
      { name: "Waite / lakeside section", detail: "Compare Waite with the lakeside admission areas." },
    ],
    ticketCheck: "Check reserved-seat days, cover and screens for your grandstand or roaming pass.",
    arrivalCheck: "The F1 ticket guide identifies tram access from Melbourne. Match the event-year tram stop and gate to your grandstand.",
  },
  {
    id: "shanghai", race: "china", seasons: [2026, 2027], venue: "Shanghai International Circuit", location: "Jiading, Shanghai, China", referenceSeason: 2027, ticketPath: "china",
    overview: "A tightening opening complex contrasts with a long straight and heavy braking later in the lap.",
    viewing: [
      { name: "Turns 14–15", detail: "Heavy braking after the long straight; F1 names the K area." },
      { name: "Turn 6", detail: "Another braking-zone option earlier in the lap." },
    ],
    ticketCheck: "Check ticket-holder identification and registration deadlines before checkout.",
    arrivalCheck: "F1 identifies Metro Line 11 for the circuit. Check the current service, exit and onward gate instructions before travelling.",
  },
  {
    id: "suzuka", race: "japan", seasons: [2026, 2027], venue: "Suzuka Circuit", location: "Suzuka, Japan", referenceSeason: 2027, ticketPath: "japan",
    overview: "Suzuka’s crossover layout combines the S Curves, Degners, Hairpin and 130R. Each region shows a different kind of driving.",
    viewing: [
      { name: "S Curves / D and E references", detail: "Watch repeated direction changes through the S Curves." },
      { name: "Hairpin and 130R", detail: "F1 places I near the Hairpin and G near 130R." },
    ],
    ticketCheck: "Confirm the tier, block and seating type. V1 and V2 are separate.",
    arrivalCheck: "Choose the gate after choosing your stand. Confirm the event’s rail, shuttle and walking instructions with the organizer.",
  },
  {
    id: "miami", race: "miami", seasons: [2026, 2027], venue: "Miami International Autodrome", location: "Miami Gardens, Florida, USA", referenceSeason: 2027, ticketPath: "miami",
    overview: "The Hard Rock Stadium campus mixes long straights with slower corners and elevation changes near the highway structures.",
    viewing: [
      { name: "Turns 1, 11 and 17", detail: "Compare the braking zones at these three corners." },
      { name: "Stadium viewing", detail: "Stadium access is separate from nearby grandstand seating." },
    ],
    ticketCheck: "Check daily stand allocations and any separate stadium-access conditions.",
    arrivalCheck: "Plan around Miami Gardens rather than assuming a downtown street circuit. Confirm the ticket’s gate, parking or drop-off instructions.",
  },
  {
    id: "montreal", race: "canada", seasons: [2026, 2027], venue: "Circuit Gilles-Villeneuve", location: "Montréal, Canada", referenceSeason: 2027, ticketPath: "canada",
    overview: "A stop-start lap with chicanes, a hairpin and the final Wall of Champions section.",
    viewing: [
      { name: "Hairpin region", detail: "Watch braking, rotation and acceleration through the hairpin." },
      { name: "Final chicane", detail: "Focus on the last braking sequence and Wall of Champions." },
    ],
    ticketCheck: "Check each stand’s screen, family-ticket and accessibility conditions.",
    arrivalCheck: "Allow for the final journey to your numbered stand, not only arrival in Montréal. Use the organizer’s gate and transport guidance.",
  },
  {
    id: "monaco", race: "monaco", seasons: [2026, 2027], venue: "Circuit de Monaco", location: "Monte Carlo, Monaco", referenceSeason: 2027, ticketPath: "monaco",
    overview: "Narrow streets make this a choice between particular corners and harbour sections rather than an assumed panoramic circuit view.",
    viewing: [
      { name: "Swimming Pool region", detail: "Fast changes of direction around the harbour." },
      { name: "Casino Square", detail: "A city-corner view; F1 names the B area." },
    ],
    ticketCheck: "Confirm the stand, day and Gold variant. Yachts and terraces need separate admission.",
    arrivalCheck: "Use current pedestrian access and road-opening instructions. A short distance on a city map does not establish a usable race-day route.",
  },
  {
    id: "barcelona", race: "barcelona-catalunya", seasons: [2026], venue: "Circuit de Barcelona-Catalunya", location: "Montmeló, Spain", referenceSeason: 2026,
    overview: "The Barcelona-Catalunya round is a separate event from the Spanish Grand Prix at Madrid. Match the venue before comparing tickets or maps.",
    viewing: [
      { name: "Turn 1", detail: "The A region overlooks braking into the opening corner." },
      { name: "Turn 3", detail: "A sustained right-hander, with general-admission viewing references." },
    ],
    ticketCheck: "Confirm Montmeló and the event year. Madrid is a separate venue.",
    arrivalCheck: "Use the venue’s event-year Montmeló access plan. Madrid transport or entrance information does not apply to this circuit.",
  },
  {
    id: "spielberg", race: "austria", seasons: [2026, 2027], venue: "Red Bull Ring", location: "Spielberg, Austria", referenceSeason: 2027, ticketPath: "austria",
    overview: "A compact circuit in a natural bowl, with uphill straights and a quicker downhill return. Elevation matters when comparing viewing regions.",
    viewing: [
      { name: "Uphill side of the circuit", detail: "Compare uphill braking zones and views across the bowl." },
      { name: "Downhill sequence", detail: "Follow the sequence of fast corners back downhill." },
    ],
    ticketCheck: "Hopping packages can change stands each day; check Friday, Saturday and Sunday.",
    arrivalCheck: "Confirm the gate and onward walking route for the selected sector. A flat diagram does not describe the circuit’s slopes.",
  },
  {
    id: "silverstone", race: "great-britain", seasons: [2026, 2027], venue: "Silverstone Circuit", location: "Silverstone, United Kingdom", referenceSeason: 2027, ticketPath: "great-britain",
    overview: "Silverstone’s fast direction changes and longer braking approaches give different stands very different viewing priorities.",
    viewing: [
      { name: "Becketts", detail: "Watch the Maggotts–Becketts direction changes." },
      { name: "Stowe", detail: "Braking and cornering at the end of a fast approach." },
    ],
    ticketCheck: "Check reserved or roving access by day, cover and screen location.",
    arrivalCheck: "Choose the gate alongside the parking, coach or shuttle option. Confirm event-year access instructions before booking the final journey.",
  },
  {
    id: "spa", race: "belgium", seasons: [2026, 2027], venue: "Circuit de Spa-Francorchamps", location: "Francorchamps, Belgium", referenceSeason: 2027, ticketPath: "belgium",
    overview: "An extended lap through the Ardennes with pronounced elevation changes. Conditions and visibility can vary around the circuit.",
    viewing: [
      { name: "Eau Rouge / Raidillon", detail: "Compare elevated views of the climb and its foreground." },
      { name: "Pouhon", detail: "A fast-corner alternative to the Eau Rouge climb." },
    ],
    ticketCheck: "Distinguish grandstands, Bronze admission and special-access products.",
    arrivalCheck: "Match parking or transport to the ticket region. Check walking distances, slopes and the accessible route with the organizer.",
  },
  {
    id: "hungaroring", race: "hungary", seasons: [2026, 2027], venue: "Hungaroring", location: "Mogyoród, Hungary", referenceSeason: 2027, ticketPath: "hungary",
    overview: "Short straights and repeated corners make rhythm important. The natural bowl can offer broader views from some elevated positions.",
    viewing: [
      { name: "Main-straight grandstands", detail: "Compare section height and views across the natural bowl." },
      { name: "A broader circuit view", detail: "Ask for a section-specific image if seeing several corners matters." },
    ],
    ticketCheck: "Use the current grandstand names and section chart.",
    arrivalCheck: "The circuit is in Mogyoród, outside central Budapest. Confirm the event’s onward transport and gate instructions, including the final walk.",
  },
  {
    id: "zandvoort", race: "netherlands", seasons: [2026], venue: "Circuit Zandvoort", location: "Zandvoort, Netherlands", referenceSeason: 2026,
    overview: "A dune circuit with banked corners and a coastal setting. This race is listed in our 2026 archive, not our 2027 calendar.",
    viewing: [
      { name: "Tarzan / first corner", detail: "Watch the first-corner entry and exit." },
      { name: "Banked corners", detail: "Compare Hugenholtzbocht with the final Arie Luyendijkbocht." },
    ],
    ticketCheck: "This 2026 archive does not establish a 2027 race or ticket offer.",
    arrivalCheck: "F1 identifies a rail connection from Amsterdam. Use the event-year station, walking and access instructions rather than assuming unrestricted car access.",
  },
  {
    id: "monza", race: "italy", seasons: [2026, 2027], venue: "Autodromo Nazionale Monza", location: "Monza, Italy", referenceSeason: 2027, ticketPath: "italy",
    overview: "Long straights are interrupted by strong braking into chicanes. The park setting and historic banking do not describe the current race route on their own.",
    viewing: [
      { name: "First chicane / Rettifilo", detail: "Heavy braking and the tight opening chicane." },
      { name: "Ascari / final-corner regions", detail: "Compare direction changes with the return to the main straight." },
    ],
    ticketCheck: "Confirm the numbered stand and sub-block. Lawn and hospitality admission are separate.",
    arrivalCheck: "Plan the park entrance and final walk after choosing the stand. Confirm current rail, shuttle or parking instructions with the event.",
  },
  {
    id: "madrid", race: "spain", seasons: [2026, 2027], venue: "MADRING", location: "IFEMA Madrid, Spain", referenceSeason: 2027, ticketPath: "madrid-spain",
    overview: "Madrid combines urban and purpose-built sections around IFEMA. This is not the Barcelona-Catalunya venue.",
    viewing: [
      { name: "La Monumental / Turn 12", detail: "Compare viewpoints around the long banked corner." },
      { name: "Other Madrid grandstands", detail: "Use the current Madrid map to compare other sectors." },
    ],
    ticketCheck: "Check Madrid and the event year. Barcelona maps do not apply.",
    arrivalCheck: "The F1 ticket guide identifies Feria de Madrid on Metro Line 8. Confirm the correct circuit gate and current station access arrangements.",
  },
  {
    id: "baku", race: "azerbaijan", seasons: [2026, 2027], venue: "Baku City Circuit", location: "Baku, Azerbaijan", referenceSeason: 2027, ticketPath: "azerbaijan",
    overview: "The waterfront straight contrasts with the narrow Old City section. Choose between braking-zone action and close city-corner views.",
    viewing: [
      { name: "Absheron / Turn 1 reference", detail: "Braking into Turn 1 at the end of the main straight." },
      { name: "Icheri Sheher reference", detail: "Watch the cars through the narrow city-gate section." },
    ],
    ticketCheck: "Confirm the stand, days and included circuit access.",
    arrivalCheck: "Match the grandstand entrance to the race-day pedestrian plan. Waterfront proximity alone does not establish an open walking route.",
  },
  {
    id: "sepang-2026", race: "bahrain", seasons: [2026], venue: "Sepang International Circuit", location: "Sepang, Malaysia", referenceSeason: 2026,
    overview: "The official 2026 Bahrain-named event page identifies Sepang in Malaysia. Its venue, layout and viewing references are separate from Sakhir’s 2027 event.",
    viewing: [
      { name: "Main grandstand", detail: "Compare the pit straight and adjoining corner sequences." },
      { name: "Final hairpin / Turn 15", detail: "Braking and acceleration onto Sepang’s main straight." },
    ],
    ticketCheck: "Use Sepang’s 2026 ticket information. Sakhir charts and its 2027 model do not apply.",
    arrivalCheck: "F1 identifies the venue near Kuala Lumpur International Airport. Use Malaysian event access information; Bahrain travel or gate guidance does not apply.",
  },
  {
    id: "marina-bay", race: "singapore", seasons: [2026, 2027], venue: "Marina Bay Street Circuit", location: "Singapore", referenceSeason: 2027, ticketPath: "singapore",
    overview: "A demanding urban lap with repeated braking and direction changes. Grandstand position and permitted event zones are separate buying decisions.",
    viewing: [
      { name: "Turn 1", detail: "The start and opening-corner sequence." },
      { name: "Other city sectors", detail: "Compare the corner view and the zones included on your ticket." },
    ],
    ticketCheck: "Confirm the grandstand and zone access. Our area map covers 2027 only.",
    arrivalCheck: "Choose the gate and MRT approach together using the event’s access map. Circuit barriers can separate places that look adjacent on a street map.",
  },
  {
    id: "cota", race: "united-states", seasons: [2026, 2027], venue: "Circuit of The Americas", location: "Austin, Texas, USA", referenceSeason: 2027, ticketPath: "austin",
    overview: "An uphill first corner, fast linked turns and a stadium section give Austin several distinct viewing priorities.",
    viewing: [
      { name: "Turn 1 / main straight", detail: "Choose between the elevated first corner and pit-straight setting." },
      { name: "Stadium section", detail: "Follow the cars through the Turns 15–16 region." },
    ],
    ticketCheck: "Check reserved or roaming admission, ticket days and concert entitlement.",
    arrivalCheck: "The F1 ticket guide lists advance parking and Austin shuttles. Check current pickup points, return arrangements and the gate serving your stand.",
  },
  {
    id: "mexico-city", race: "mexico", seasons: [2026, 2027], venue: "Autódromo Hermanos Rodríguez", location: "Mexico City, Mexico", referenceSeason: 2027, ticketPath: "mexico",
    overview: "A high-altitude circuit with a distinctive stadium passage. A stadium ticket and a main-straight ticket should be compared as different experiences.",
    viewing: [
      { name: "Stadium section", detail: "A close overhead perspective and podium atmosphere." },
      { name: "Other circuit zones", detail: "Compare the stadium with other ticket zones; roaming access varies." },
    ],
    ticketCheck: "Confirm the ticket’s colour zone, stand and days. Other zones may be restricted.",
    arrivalCheck: "Match your transport approach to the entrance for the ticket’s zone. A nearby gate on a general map may not admit that ticket.",
  },
  {
    id: "interlagos", race: "brazil", seasons: [2026, 2027], venue: "Autódromo José Carlos Pace / Interlagos", location: "São Paulo, Brazil", referenceSeason: 2027, ticketPath: "brazil",
    overview: "The circuit’s slopes connect the Senna S, an infield sequence and an uphill return to the main straight.",
    viewing: [
      { name: "A / uphill return reference", detail: "The uphill return and views into parts of the infield." },
      { name: "M / Senna S reference", detail: "A first-corner and Senna S viewpoint." },
    ],
    ticketCheck: "Confirm the sector, seating assignment and days; check hospitality separately.",
    arrivalCheck: "Choose the event entrance for your sector before planning the final journey. Confirm walking and accessible-route information with the organizer.",
  },
  {
    id: "las-vegas", race: "las-vegas", seasons: [2026, 2027], venue: "Las Vegas Strip Circuit", location: "Las Vegas, Nevada, USA", referenceSeason: 2027, ticketPath: "las-vegas",
    overview: "A fast street circuit around the Strip. The Sphere zone, pit straight and other viewing products provide different trackside settings.",
    viewing: [
      { name: "Sphere zone", detail: "Outdoor race viewing; indoor Sphere seats do not face the circuit." },
      { name: "Pit straight and other banks", detail: "Compare estimated start-finish and other outdoor banks." },
    ],
    ticketCheck: "Confirm zone, days and inclusions. A 2027 deposit does not allocate a model seat.",
    ticketChecks: {2026: "Confirm the named zone, grandstand and admission days. Illustrative positions are not ticket seat numbers."},
    arrivalCheck: "Check the official pedestrian access plan for the ticket zone. Hotel or landmark proximity does not establish a permitted circuit crossing.",
  },
  {
    id: "lusail", race: "qatar", seasons: [2026, 2027], venue: "Lusail International Circuit", location: "Lusail, Qatar", referenceSeason: 2027, ticketPath: "qatar",
    overview: "A fast, flowing circuit with a long main straight. Compare pit activity with the opening-corner and other trackside viewing areas.",
    viewing: [
      { name: "Main grandstand", detail: "Start-finish, pit-lane and garage views." },
      { name: "T2 / opening-corner reference", detail: "A different angle on the opening corners." },
    ],
    ticketCheck: "Our 2026 seating terms and reference prices do not establish a 2027 offer.",
    ticketChecks: {2026: "Check assigned versus free seating and the days included. Reference prices are dated snapshots; confirm the final quote with the seller."},
    arrivalCheck: "Use the event-year transport and entrance plan for the selected stand. Confirm the final transfer or walk, not just arrival in Doha.",
  },
  {
    id: "yas-marina", race: "united-arab-emirates", seasons: [2026, 2027], venue: "Yas Marina Circuit", location: "Yas Island, Abu Dhabi, UAE", referenceSeason: 2027, ticketPath: "abu-dhabi",
    overview: "Long straights, slower braking points and the reworked banked section create several contrasting viewing regions.",
    viewing: [
      { name: "West / Turn 6 reference", detail: "Braking into Turn 6 after the long straight." },
      { name: "Main grandstand", detail: "A pit-straight viewpoint; check the block and cover." },
    ],
    ticketCheck: "Keep grandstands, straight products and clubs distinct. Our 2026 desk does not verify 2027 seating.",
    ticketChecks: {2026: "Confirm the exact grandstand or straight product and your admission days. Clubs and hospitality have separate terms."},
    arrivalCheck: "Match the gate and transport instructions to the actual product. A hotel, marina berth or nearby attraction does not establish race admission.",
  },
  {
    id: "sakhir", race: "bahrain", seasons: [2027], venue: "Bahrain International Circuit", location: "Sakhir, Bahrain", referenceSeason: 2027, ticketPath: "bahrain",
    overview: "Sakhir combines floodlit racing, heavy braking and technical corners. It is separate from the Bahrain-named Sepang event in our 2026 archive.",
    viewing: [
      { name: "Turns 1–2", detail: "Braking, entry and exit at the opening corners." },
      { name: "Middle sector", detail: "Compare the Turns 8–11 sequence using current stand names." },
    ],
    ticketCheck: "Check the current Sakhir stand and assignment. Model numbers are not official ticket numbers.",
    arrivalCheck: "Plan for Sakhir rather than Sepang. Confirm the event-year gate, transport and accessible drop-off arrangements with the organizer.",
  },
  {
    id: "jeddah", race: "saudi-arabia", seasons: [2027], venue: "Jeddah Corniche Circuit", location: "Jeddah, Saudi Arabia", referenceSeason: 2027, ticketPath: "saudi-arabia",
    overview: "A fast waterfront street circuit with repeated sweeping corners and floodlit running.",
    viewing: [
      { name: "Turn 13", detail: "A view of the banked corner." },
      { name: "Other Corniche grandstands", detail: "Compare the fast-corner view and foreground in the product preview." },
    ],
    ticketCheck: "Use the organizer-linked catalogue. Seats are not mapped here yet.",
    arrivalCheck: "Match the ticket area to the current Corniche gate and transport guidance. Do not infer a pedestrian route through circuit barriers.",
  },
  {
    id: "portimao", race: "portugal", seasons: [2027], venue: "Autódromo Internacional do Algarve", location: "Portimão, Portugal", referenceSeason: 2027, ticketPath: "portugal",
    overview: "A permanent Algarve circuit with substantial rises and falls. The slope of the ground is central to comparing possible views.",
    viewing: [
      { name: "End of the main straight / Turn 1", detail: "Braking and possible passing after the main straight." },
      { name: "Portimão corner", detail: "A double-apex cornering view." },
    ],
    ticketCheck: "Check the sales stage. A waitlist does not reserve a stand or seat.",
    arrivalCheck: "The F1 ticket guide places the circuit outside Portimão. Confirm the final transfer, parking and event-year access rather than only the flight destination.",
  },
  {
    id: "istanbul", race: "turkey", seasons: [2027], venue: "TOSFED Istanbul Park", location: "Tuzla, Istanbul, Türkiye", referenceSeason: 2027, ticketPath: "turkiye",
    overview: "An undulating circuit on Istanbul’s Asian side, with a sustained multi-apex Turn 8 and a slower late-lap braking sequence.",
    viewing: [
      { name: "Outside Turn 8", detail: "Sustained fast cornering through multiple apexes." },
      { name: "Turn 12 entry", detail: "A late-lap braking-zone alternative." },
    ],
    ticketCheck: "Confirm the 2027 layout and sales stage. Historic photos do not verify a current seat.",
    arrivalCheck: "The F1 ticket page places the circuit in Tuzla on the Asian side. Confirm the chosen airport, transfer and event access before booking.",
  },
];

export function circuitGuideFor(season: number, race: string) {
  return circuitGuides.find(g => g.race === race && g.seasons.includes(season as Season));
}
export function matchesCircuitSearch(race: Race, query: string) {
  const guide = circuitGuideFor(race.season, race.slug);
  const normalize = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
  return normalize([race.name, race.slug, guide?.id, guide?.venue, guide?.location].filter(Boolean).join(" ")).includes(normalize(query));
}
export const circuitGuideSource = (guide: CircuitGuide) =>
  `https://www.formula1.com/en/racing/${guide.referenceSeason}/${guide.race}`;
export const circuitPublishedLength = (guide: CircuitGuide) =>
  publishedFacts.circuits.find(fact => fact.source === circuitGuideSource(guide))?.lengthKm;
export function circuitTicketSource(guide: CircuitGuide, season: number) {
  return season === 2027 && guide.ticketPath ? `https://ticketing.formula1.com/${guide.ticketPath}/` : undefined;
}

export function circuitBookingCheck(guide:CircuitGuide,season:Season){return guide.ticketChecks?.[season]??guide.ticketCheck;}
