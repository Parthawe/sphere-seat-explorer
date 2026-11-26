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
  arrivalCheck: string;
  ticketPath?: string;
};

/** Circuit context from the linked F1 guides, not a ticket-product or seat inventory. */
export const circuitGuides: readonly CircuitGuide[] = [
  {
    id: "albert-park", race: "australia", seasons: [2026, 2027], venue: "Albert Park Grand Prix Circuit", location: "Melbourne, Australia", referenceSeason: 2027, ticketPath: "australia",
    overview: "A fast temporary circuit around Albert Park Lake. Compare the opening sequence with the quicker lakeside corners.",
    viewing: [
      { name: "Brabham / opening corners", detail: "F1 highlights the Turn 2 side for following cars through the opening changes of direction." },
      { name: "Waite / lakeside section", detail: "F1 also points to Waite and lakeside admission areas. Confirm the current corner labels and permitted areas on the event map." },
    ],
    ticketCheck: "Compare named grandstand tickets with roaming admission. Check the reserved-seat days, cover and screen location for the actual product.",
    arrivalCheck: "The F1 ticket guide identifies tram access from Melbourne. Match the event-year tram stop and gate to your grandstand.",
  },
  {
    id: "shanghai", race: "china", seasons: [2026, 2027], venue: "Shanghai International Circuit", location: "Jiading, Shanghai, China", referenceSeason: 2027, ticketPath: "china",
    overview: "A tightening opening complex contrasts with a long straight and heavy braking later in the lap.",
    viewing: [
      { name: "Turns 14–15", detail: "The end-of-straight hairpin is a useful region to compare for braking and passing. F1’s guide names the K area." },
      { name: "Turn 6", detail: "A separate braking-zone choice. Check the event-year product name rather than assuming an older stand label still applies." },
    ],
    ticketCheck: "Read the seller’s identification, ticket-holder registration and admission deadlines before checkout. A model label does not identify your ticketed chair.",
    arrivalCheck: "F1 identifies Metro Line 11 for the circuit. Check the current service, exit and onward gate instructions before travelling.",
  },
  {
    id: "suzuka", race: "japan", seasons: [2026, 2027], venue: "Suzuka Circuit", location: "Suzuka, Japan", referenceSeason: 2027, ticketPath: "japan",
    overview: "Suzuka’s crossover layout combines the S Curves, Degners, Hairpin and 130R. Each region shows a different kind of driving.",
    viewing: [
      { name: "S Curves / D and E references", detail: "Compare these regions for successive changes of direction rather than a single straight-line pass." },
      { name: "Hairpin and 130R", detail: "F1 distinguishes I near the Hairpin from G near 130R. Use the organizer’s current section diagrams for the exact product." },
    ],
    ticketCheck: "Verify the tier, block and seating type in the event-year catalogue. V1 and V2, and similarly named subcategories, need separate checks.",
    arrivalCheck: "Choose the gate after choosing your stand. Confirm the event’s rail, shuttle and walking instructions with the organizer.",
  },
  {
    id: "miami", race: "miami", seasons: [2026, 2027], venue: "Miami International Autodrome", location: "Miami Gardens, Florida, USA", referenceSeason: 2027, ticketPath: "miami",
    overview: "The Hard Rock Stadium campus mixes long straights with slower corners and elevation changes near the highway structures.",
    viewing: [
      { name: "Turns 1, 11 and 17", detail: "F1 identifies these braking regions as places to investigate for passing. Compare the specific stand’s orientation and fencing." },
      { name: "Stadium viewing", detail: "The stadium is a separate viewing context. A nearby grandstand model does not establish access to stadium levels or hospitality." },
    ],
    ticketCheck: "Check whether a multi-day product keeps the same stand or changes allocation. Confirm any stadium access and additional programme conditions separately.",
    arrivalCheck: "Plan around Miami Gardens rather than assuming a downtown street circuit. Confirm the ticket’s gate, parking or drop-off instructions.",
  },
  {
    id: "montreal", race: "canada", seasons: [2026, 2027], venue: "Circuit Gilles-Villeneuve", location: "Montréal, Canada", referenceSeason: 2027, ticketPath: "canada",
    overview: "A stop-start lap with chicanes, a hairpin and the final Wall of Champions section.",
    viewing: [
      { name: "Hairpin region", detail: "F1 highlights the surrounding stands for watching braking, rotation and acceleration. Current product names should come from the organizer." },
      { name: "Final chicane", detail: "Compare this region with the hairpin if the last braking sequence matters more to you than a longer view through a slower corner." },
    ],
    ticketCheck: "Check each grandstand’s screens, family-ticket conditions and accessibility allocation. Rules for one numbered stand do not establish another stand’s terms.",
    arrivalCheck: "Allow for the final journey to your numbered stand, not only arrival in Montréal. Use the organizer’s gate and transport guidance.",
  },
  {
    id: "monaco", race: "monaco", seasons: [2026, 2027], venue: "Circuit de Monaco", location: "Monte Carlo, Monaco", referenceSeason: 2027, ticketPath: "monaco",
    overview: "Narrow streets make this a choice between particular corners and harbour sections rather than an assumed panoramic circuit view.",
    viewing: [
      { name: "Swimming Pool region", detail: "F1 highlights the stands around this rapid sequence. Compare the current letters, tiers and available days in the organizer’s configurator." },
      { name: "Casino Square", detail: "A contrasting city setting. F1 names the B reference, but an older photograph cannot establish the current seat’s sightline." },
    ],
    ticketCheck: "Check the stand, day and any Gold variant. Grandstand admission does not establish entry to a yacht, apartment terrace or hospitality room.",
    arrivalCheck: "Use current pedestrian access and road-opening instructions. A short distance on a city map does not establish a usable race-day route.",
  },
  {
    id: "barcelona", race: "barcelona-catalunya", seasons: [2026], venue: "Circuit de Barcelona-Catalunya", location: "Montmeló, Spain", referenceSeason: 2026,
    overview: "The Barcelona-Catalunya round is a separate event from the Spanish Grand Prix at Madrid. Match the venue before comparing tickets or maps.",
    viewing: [
      { name: "Turn 1", detail: "F1 highlights the A region outside the first corner for the braking zone at the end of the straight." },
      { name: "Turn 3", detail: "The general-admission reference around this sustained right-hander offers a different focus: cornering rather than the first braking point." },
    ],
    ticketCheck: "This is a 2026 archive entry. Check Montmeló versus Madrid, the event year and the exact grandstand before using an external listing.",
    arrivalCheck: "Use the venue’s event-year Montmeló access plan. Madrid transport or entrance information does not apply to this circuit.",
  },
  {
    id: "spielberg", race: "austria", seasons: [2026, 2027], venue: "Red Bull Ring", location: "Spielberg, Austria", referenceSeason: 2027, ticketPath: "austria",
    overview: "A compact circuit in a natural bowl, with uphill straights and a quicker downhill return. Elevation matters when comparing viewing regions.",
    viewing: [
      { name: "Uphill side of the circuit", detail: "Compare the braking regions and the extent of the downhill view. F1’s older naming should not replace the current ticket diagram." },
      { name: "Downhill sequence", detail: "A contrasting choice for following successive fast corners. Check the current sector group rather than inferring visibility from proximity." },
    ],
    ticketCheck: "For a hopping package, check Friday, Saturday and Sunday separately. A package that changes stands does not identify one fixed weekend chair.",
    arrivalCheck: "Confirm the gate and onward walking route for the selected sector. A flat diagram does not describe the circuit’s slopes.",
  },
  {
    id: "silverstone", race: "great-britain", seasons: [2026, 2027], venue: "Silverstone Circuit", location: "Silverstone, United Kingdom", referenceSeason: 2027, ticketPath: "great-britain",
    overview: "Silverstone’s fast direction changes and longer braking approaches give different stands very different viewing priorities.",
    viewing: [
      { name: "Becketts", detail: "F1 highlights this region for following cars through the Maggotts–Becketts sequence." },
      { name: "Stowe", detail: "A different focus at the end of a fast approach. Compare the stand’s position relative to the braking point and corner exit." },
    ],
    ticketCheck: "Check reserved and roving access by day, plus cover and screen position for the selected product. Do not assume all stands share the same entitlement.",
    arrivalCheck: "Choose the gate alongside the parking, coach or shuttle option. Confirm event-year access instructions before booking the final journey.",
  },
  {
    id: "spa", race: "belgium", seasons: [2026, 2027], venue: "Circuit de Spa-Francorchamps", location: "Francorchamps, Belgium", referenceSeason: 2027, ticketPath: "belgium",
    overview: "An extended lap through the Ardennes with pronounced elevation changes. Conditions and visibility can vary around the circuit.",
    viewing: [
      { name: "Eau Rouge / Raidillon", detail: "Compare elevated viewpoints for the climb. A lower seat or neighbouring product can have a very different foreground." },
      { name: "Pouhon", detail: "F1 identifies this fast-corner region as another viewing choice. Check the product’s admission and reserved-seat terms separately." },
    ],
    ticketCheck: "Distinguish grandstand seating from Bronze and special-access products. A nearby model bank does not grant entry to a separate ticket region.",
    arrivalCheck: "Match parking or transport to the ticket region. Check walking distances, slopes and the accessible route with the organizer.",
  },
  {
    id: "hungaroring", race: "hungary", seasons: [2026, 2027], venue: "Hungaroring", location: "Mogyoród, Hungary", referenceSeason: 2027, ticketPath: "hungary",
    overview: "Short straights and repeated corners make rhythm important. The natural bowl can offer broader views from some elevated positions.",
    viewing: [
      { name: "Main-straight grandstands", detail: "F1 highlights stands on or around this straight. Compare the actual section’s angle, height and visible portions of the circuit." },
      { name: "A broader circuit view", detail: "If seeing several sections matters more than being nearest one corner, ask for a current section-specific reference image." },
    ],
    ticketCheck: "Use the event-year grandstand names and section chart. Older colour labels or a general hillside photo do not establish a current seat allocation.",
    arrivalCheck: "The circuit is in Mogyoród, outside central Budapest. Confirm the event’s onward transport and gate instructions, including the final walk.",
  },
  {
    id: "zandvoort", race: "netherlands", seasons: [2026], venue: "Circuit Zandvoort", location: "Zandvoort, Netherlands", referenceSeason: 2026,
    overview: "A dune circuit with banked corners and a coastal setting. This race is listed in our 2026 archive, not our 2027 calendar.",
    viewing: [
      { name: "Tarzan / first corner", detail: "F1 highlights the first-corner region as one viewing option. Check the seat’s alignment with the entry and exit." },
      { name: "Banked corners", detail: "Hugenholtzbocht and the final Arie Luyendijkbocht offer a contrasting look at the cars under sustained cornering load." },
    ],
    ticketCheck: "Confirm the event year before following a listing. The presence of a historical Dutch GP page does not establish a 2027 race or ticket offer.",
    arrivalCheck: "F1 identifies a rail connection from Amsterdam. Use the event-year station, walking and access instructions rather than assuming unrestricted car access.",
  },
  {
    id: "monza", race: "italy", seasons: [2026, 2027], venue: "Autodromo Nazionale Monza", location: "Monza, Italy", referenceSeason: 2027, ticketPath: "italy",
    overview: "Long straights are interrupted by strong braking into chicanes. The park setting and historic banking do not describe the current race route on their own.",
    viewing: [
      { name: "First chicane / Rettifilo", detail: "F1 highlights this region for the transition from the main straight into the tight opening sequence." },
      { name: "Ascari / final-corner regions", detail: "Compare these alternatives for direction changes and the run back toward the straight. Check current product boundaries on the seller’s map." },
    ],
    ticketCheck: "Distinguish the numbered grandstand, its sub-block and any lawn or hospitality ticket. A large stand family can contain different viewing angles.",
    arrivalCheck: "Plan the park entrance and final walk after choosing the stand. Confirm current rail, shuttle or parking instructions with the event.",
  },
  {
    id: "madrid", race: "spain", seasons: [2026, 2027], venue: "MADRING", location: "IFEMA Madrid, Spain", referenceSeason: 2027, ticketPath: "madrid-spain",
    overview: "Madrid combines urban and purpose-built sections around IFEMA. This is not the Barcelona-Catalunya venue.",
    viewing: [
      { name: "La Monumental / Turn 12", detail: "F1 highlights this long banked corner. Compare the current stand’s position around the curve rather than relying on a generic circuit rendering." },
      { name: "Other Madrid grandstands", detail: "Use the event-year map to choose between the banked sequence and other sectors. We have no calibrated seat view here yet." },
    ],
    ticketCheck: "Check that the ticket says Madrid and the correct season. A Barcelona stand name or access map cannot be transferred to MADRING.",
    arrivalCheck: "The F1 ticket guide identifies Feria de Madrid on Metro Line 8. Confirm the correct circuit gate and current station access arrangements.",
  },
  {
    id: "baku", race: "azerbaijan", seasons: [2026, 2027], venue: "Baku City Circuit", location: "Baku, Azerbaijan", referenceSeason: 2027, ticketPath: "azerbaijan",
    overview: "The waterfront straight contrasts with the narrow Old City section. Choose between braking-zone action and close city-corner views.",
    viewing: [
      { name: "Absheron / Turn 1 reference", detail: "F1 highlights the end of the main straight for the braking into the opening corner." },
      { name: "Icheri Sheher reference", detail: "A different setting around the city-gate section. Confirm the event-year product name and the visible corner from your block." },
    ],
    ticketCheck: "Check the named stand, ticket days and any additional access in the actual listing. A city-centre hotel or balcony does not include circuit entry.",
    arrivalCheck: "Match the grandstand entrance to the race-day pedestrian plan. Waterfront proximity alone does not establish an open walking route.",
  },
  {
    id: "sepang-2026", race: "bahrain", seasons: [2026], venue: "Sepang International Circuit", location: "Sepang, Malaysia", referenceSeason: 2026,
    overview: "The official 2026 Bahrain-named event page identifies Sepang in Malaysia. Its venue, layout and viewing references are separate from Sakhir’s 2027 event.",
    viewing: [
      { name: "Main grandstand", detail: "F1 highlights this area for the pit-straight and adjoining sequences. Confirm the block rather than assuming every seat shares the same view." },
      { name: "Final hairpin / Turn 15", detail: "Compare the final braking zone and acceleration onto the straight. The separate Sakhir model does not represent this corner." },
    ],
    ticketCheck: "This is a past 2026 event reference. Do not use a Bahrain International Circuit ticket chart, current Sakhir listing or 2027 model to locate a Sepang ticket.",
    arrivalCheck: "F1 identifies the venue near Kuala Lumpur International Airport. Use Malaysian event access information; Bahrain travel or gate guidance does not apply.",
  },
  {
    id: "marina-bay", race: "singapore", seasons: [2026, 2027], venue: "Marina Bay Street Circuit", location: "Singapore", referenceSeason: 2027, ticketPath: "singapore",
    overview: "A demanding urban lap with repeated braking and direction changes. Grandstand position and permitted event zones are separate buying decisions.",
    viewing: [
      { name: "Turn 1", detail: "F1 highlights the opening-corner region for the start and the following sequence. Block and row can change the visible foreground." },
      { name: "Other city sectors", detail: "Compare the corner shown in the organizer’s product preview with the zones included on the ticket. A nearby landmark is not a seat match." },
    ],
    ticketCheck: "Confirm both the grandstand and zone access for the chosen season. Our sourced 2027 area pilot does not identify a 2026 chair.",
    arrivalCheck: "Choose the gate and MRT approach together using the event’s access map. Circuit barriers can separate places that look adjacent on a street map.",
  },
  {
    id: "cota", race: "united-states", seasons: [2026, 2027], venue: "Circuit of The Americas", location: "Austin, Texas, USA", referenceSeason: 2027, ticketPath: "austin",
    overview: "An uphill first corner, fast linked turns and a stadium section give Austin several distinct viewing priorities.",
    viewing: [
      { name: "Turn 1 / main straight", detail: "Compare the elevated opening corner with the start-finish setting. They offer different angles on the beginning of the lap." },
      { name: "Stadium section", detail: "F1 highlights the Turns 15–16 area for following the cars at closer quarters. Confirm the specific block and nearby screen." },
    ],
    ticketCheck: "Check reserved seating versus roaming admission, the included days and any concert entitlement. Additional access must be stated in the provider’s product.",
    arrivalCheck: "The F1 ticket guide lists advance parking and Austin shuttles. Check current pickup points, return arrangements and the gate serving your stand.",
  },
  {
    id: "mexico-city", race: "mexico", seasons: [2026, 2027], venue: "Autódromo Hermanos Rodríguez", location: "Mexico City, Mexico", referenceSeason: 2027, ticketPath: "mexico",
    overview: "A high-altitude circuit with a distinctive stadium passage. A stadium ticket and a main-straight ticket should be compared as different experiences.",
    viewing: [
      { name: "Stadium section", detail: "F1 highlights this setting for the close overhead perspective and podium atmosphere." },
      { name: "Other circuit zones", detail: "Use the current zone and grandstand chart to compare the stadium with the rest of the lap. Do not assume that one ticket permits roaming between them." },
    ],
    ticketCheck: "The F1 ticket guide describes colour-coded access zones. Confirm your exact zone, stand, days and admission conditions before choosing.",
    arrivalCheck: "Match your transport approach to the entrance for the ticket’s zone. A nearby gate on a general map may not admit that ticket.",
  },
  {
    id: "interlagos", race: "brazil", seasons: [2026, 2027], venue: "Autódromo José Carlos Pace / Interlagos", location: "São Paulo, Brazil", referenceSeason: 2027, ticketPath: "brazil",
    overview: "The circuit’s slopes connect the Senna S, an infield sequence and an uphill return to the main straight.",
    viewing: [
      { name: "A / uphill return reference", detail: "F1 highlights this area for comparing the return toward the straight with views into parts of the infield." },
      { name: "M / Senna S reference", detail: "A contrasting first-corner choice. Check the current section and foreground rather than assuming every seat shows the whole opening sequence." },
    ],
    ticketCheck: "Check the exact sector, assigned-seating terms and included days. Hospitality, covered products and ordinary grandstands require separate comparisons.",
    arrivalCheck: "Choose the event entrance for your sector before planning the final journey. Confirm walking and accessible-route information with the organizer.",
  },
  {
    id: "las-vegas", race: "las-vegas", seasons: [2026, 2027], venue: "Las Vegas Strip Circuit", location: "Las Vegas, Nevada, USA", referenceSeason: 2027, ticketPath: "las-vegas",
    overview: "A fast street circuit around the Strip. The Sphere zone, pit straight and other viewing products provide different trackside settings.",
    viewing: [
      { name: "Sphere zone", detail: "Use our separate area explorer to compare the listed outdoor products. Indoor Sphere seating is a different venue and does not face the race." },
      { name: "Pit straight and other banks", detail: "The explorer also includes estimated start-finish and other outdoor banks. Model rows and seats are not official inventory." },
    ],
    ticketCheck: "Check the ticket’s zone, days and inclusions. For 2027, a deposit or registration does not establish an allocated seat in our 2026 reference model.",
    arrivalCheck: "Check the official pedestrian access plan for the ticket zone. Hotel or landmark proximity does not establish a permitted circuit crossing.",
  },
  {
    id: "lusail", race: "qatar", seasons: [2026, 2027], venue: "Lusail International Circuit", location: "Lusail, Qatar", referenceSeason: 2027, ticketPath: "qatar",
    overview: "A fast, flowing circuit with a long main straight. Compare pit activity with the opening-corner and other trackside viewing areas.",
    viewing: [
      { name: "Main grandstand", detail: "F1 highlights the start-finish, pit-lane and garage setting. The ticketed chair still needs the organizer’s numbering." },
      { name: "T2 / opening-corner reference", detail: "A different focus on the beginning of the lap. Check whether the selected product uses assigned or free seating." },
    ],
    ticketCheck: "Our dated 2026 desk distinguishes assigned Main seats from free-seating and admission products. Those terms and prices do not establish a 2027 offer.",
    arrivalCheck: "Use the event-year transport and entrance plan for the selected stand. Confirm the final transfer or walk, not just arrival in Doha.",
  },
  {
    id: "yas-marina", race: "united-arab-emirates", seasons: [2026, 2027], venue: "Yas Marina Circuit", location: "Yas Island, Abu Dhabi, UAE", referenceSeason: 2027, ticketPath: "abu-dhabi",
    overview: "Long straights, slower braking points and the reworked banked section create several contrasting viewing regions.",
    viewing: [
      { name: "West / Turn 6 reference", detail: "F1 highlights this region for the braking at the end of the long straight. Check the actual grandstand versus similarly named straight products." },
      { name: "Main grandstand", detail: "A pit-straight choice. Compare the block’s view and cover rather than assuming any Yas Island package includes this seating." },
    ],
    ticketCheck: "Keep grandstands, straight products, clubs, suites and concert upgrades distinct. Our 2026 desk cannot verify a 2027 package’s seating or access.",
    arrivalCheck: "Match the gate and transport instructions to the actual product. A hotel, marina berth or nearby attraction does not establish race admission.",
  },
  {
    id: "sakhir", race: "bahrain", seasons: [2027], venue: "Bahrain International Circuit", location: "Sakhir, Bahrain", referenceSeason: 2027, ticketPath: "bahrain",
    overview: "Sakhir combines floodlit racing, heavy braking and technical corners. It is separate from the Bahrain-named Sepang event in our 2026 archive.",
    viewing: [
      { name: "Turns 1–2", detail: "F1 highlights this braking and opening-corner region. Compare the seat’s angle on the entry, apex and exit." },
      { name: "Middle sector", detail: "The F1 guide also highlights the Turns 8–11 sequence. Current organizer names take precedence over older sponsor-labelled stand references." },
    ],
    ticketCheck: "Check the current Sakhir grandstand, days and assignment terms. Generated bank sections and row numbers do not match an official ticket chart.",
    arrivalCheck: "Plan for Sakhir rather than Sepang. Confirm the event-year gate, transport and accessible drop-off arrangements with the organizer.",
  },
  {
    id: "jeddah", race: "saudi-arabia", seasons: [2027], venue: "Jeddah Corniche Circuit", location: "Jeddah, Saudi Arabia", referenceSeason: 2027, ticketPath: "saudi-arabia",
    overview: "A fast waterfront street circuit with repeated sweeping corners and floodlit running.",
    viewing: [
      { name: "Turn 13", detail: "F1 highlights the stand around the banked corner. Confirm the current catalogue’s product name and actual viewing boundary." },
      { name: "Other Corniche grandstands", detail: "Compare a longer fast-corner view with the specific corner and foreground shown in the organizer’s product material." },
    ],
    ticketCheck: "Use the organizer-linked event-year catalogue. A listed grandstand name does not supply its actual rows, chair coordinates or accessible routes here.",
    arrivalCheck: "Match the ticket area to the current Corniche gate and transport guidance. Do not infer a pedestrian route through circuit barriers.",
  },
  {
    id: "portimao", race: "portugal", seasons: [2027], venue: "Autódromo Internacional do Algarve", location: "Portimão, Portugal", referenceSeason: 2027, ticketPath: "portugal",
    overview: "A permanent Algarve circuit with substantial rises and falls. The slope of the ground is central to comparing possible views.",
    viewing: [
      { name: "End of the main straight / Turn 1", detail: "F1 highlights this approach for braking and possible passing. Check the precise stand and seating height." },
      { name: "Portimão corner", detail: "The double-apex sequence offers a different focus on cornering. An older event photo does not verify a 2027 seat." },
    ],
    ticketCheck: "Check the current catalogue and sales stage. Joining a waitlist records interest; it does not allocate a stand or chair.",
    arrivalCheck: "The F1 ticket guide places the circuit outside Portimão. Confirm the final transfer, parking and event-year access rather than only the flight destination.",
  },
  {
    id: "istanbul", race: "turkey", seasons: [2027], venue: "TOSFED Istanbul Park", location: "Tuzla, Istanbul, Türkiye", referenceSeason: 2027, ticketPath: "turkiye",
    overview: "An undulating circuit on Istanbul’s Asian side, with a sustained multi-apex Turn 8 and a slower late-lap braking sequence.",
    viewing: [
      { name: "Outside Turn 8", detail: "F1 highlights this region for watching sustained fast cornering rather than expecting frequent overtakes." },
      { name: "Turn 12 entry", detail: "A contrasting braking-zone option. Compare the current stand layout when event-year allocations are published." },
    ],
    ticketCheck: "Treat historic views as circuit references. Confirm the current layout, sales stage and exact product; a waitlist does not reserve a seat.",
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
