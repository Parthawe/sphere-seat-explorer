# Seat-selection platform research

Inspected 22 November 2026. These are first-party product and technical references, not a claim that every platform or venue offers the same features.

| Reference | Relevant pattern | Applied here |
| --- | --- | --- |
| [Ticketmaster interactive seating chart](https://blog.ticketmaster.com/interactive-seating-chart/) | Quantity filters before seat selection; section-to-seat exploration | Choose 1–4 modeled seats before browsing. Highlight a contiguous group on one side of the model's center aisle. |
| [SeatGeek interactive maps](https://seatgeek.com/blog/understanding-seatgeeks-interactive-seat-maps-features-you-might-be-missing) | Keep section views close to map exploration | Keep saved views visible in the scene and allow immediate return to each position. |
| [3D Digital Venue integration guidance](https://3ddigitalvenue.com/seat-view-technology-for-ticketing-platform-how-it-works-and-what-integration-requires/) | Embed visualization in selection while ticket systems retain inventory authority | Label the view as an estimate, identify the camera seat, and retain the official ticket-information link. |

Linked yaw/pitch controls are our design inference: moving comparison cameras together makes it easier to inspect the same relative direction across saved positions. They are not attributed as an existing feature of these platforms.

## Boundaries

Group adjacency describes this model only. Actual venue numbering and aisle boundaries require official seat-level data. No live inventory, prices, reservations, verified photography or platform integration has been added. A group preview uses its selected anchor seat; it does not combine multiple sightlines into one image. Existing individual-seat links remain compatible.

## Calendar expansion, 22 November 2026

[Formula 1 2026 calendar](https://www.formula1.com/en/racing/2026) and [2027 calendar](https://www.formula1.com/en/racing/2027) supply the checked-in race-weekend snapshots. The revised 2026 list has 23 Grands Prix; 2027 lists 24. Pre-season testing is excluded from Grand Prix counts. Dates and rounds are not inferred from the prior year.

[Sphere Entertainment filing](https://www.sec.gov/Archives/edgar/data/1795250/000162828026007760/sphr-20251231.htm) supplies the exterior width and height. The spherical-cap geometry, artwork and seat-relative placement are reconstruction choices. [Official ticket](https://ticketing.formula1.com/seasons/) and [hospitality](https://ticketing.formula1.com/hospitality/seasons/) selectors and [F1 Experiences](https://f1experiences.com/) supply external catalogue destinations. Ticket-category guidance does not assert current availability at every venue.

## Whole Las Vegas reference coverage

The organizer's [grandstand](https://www.f1lasvegasgp.com/tickets/grandstands/), [general-admission](https://www.f1lasvegasgp.com/tickets/general-admission/) and [hospitality](https://www.f1lasvegasgp.com/tickets/hospitality/) pages supply the 16 location-based product names and viewing focuses. The [current circuit page](https://www.f1lasvegasgp.com/track-layout/) informed the schematic. [2027 deposits](https://www.f1lasvegasgp.com/2027-deposits/) is the organizer's currently promoted next-season destination. No stale prices or sold-out indicators were copied into the app.

[Sphere's venue maps](https://www.thesphere.com/plan-your-visit/maps) provide eight official access/floor-map destinations. Common section ranges were cross-checked against the [venue visualization provider reference](https://sites.3ddigitalvenue.com/3dmap/clients/sphere/level-200/) and public event seating references. All seat-level positions and row/seat counts in the new indoor study are original illustrative parameters, not a transcription of event ticket data. Floor maps were inspected for research and are linked externally, not redistributed.

## Apex Atlas scene references, 23 November 2026

[Sphere XO Stream](https://www.thesphere.com/xo-stream) supplies an official destination for actual current Exosphere programming and its published Google Maps location. Its footage is not copied into the app. The amber face and race ribbons remain original display artwork.

[NASA CGI Moon Kit](https://svs.gsfc.nasa.gov/4720) supplies the bundled 2K lunar color map. It is used as a simulated Sphere display, not presented as footage of a real race-night program.

[OpenStreetMap API](https://api.openstreetmap.org/api/0.6/map?bbox=-115.171,36.116,-115.156,36.126) supplies nearby building outlines and available tags. The extracted database and [ODbL attribution](https://www.openstreetmap.org/copyright) are bundled. The scene uses a rounded geographic Sphere origin, omits course conflicts, and estimates missing heights. This is not a new survey of the venue or certified Google Maps geometry.


## Remaining 2026 races · checked 23 November 2026

- Calendar and next race: https://www.formula1.com/en/racing/2026
- Qatar event/product taxonomy: https://www.lcsc.qa/formula12026
- Numbered/free seating, mobile delivery and organizer seller roster: https://www.lcsc.qa/faq/formula-1r-qatar-airways-qatar-grand-prix-2026
- Official map handoff: https://www.lcsc.qa/interactive-event-map
- Official product pages and collected reference prices: public/data/ticket-sources.json (five 3-day products, exact 27–29 Nov 2026 date gate).
- Public F1 Qatar event store: https://tickets.formula1.com/en/f1-56257-qatar (automated access blocked; no price or stock inferred).
- Experience packages: https://f1experiences.com/2026-qatar-grand-prix (metadata only; packages can start Thursday).
- Abu Dhabi 2026 organizer: https://www.abudhabigp.com/en/formula1/tickets-2026/ and https://www.abudhabigp.com/en/faq
- Abu Dhabi F1 store: https://tickets.formula1.com/en/f1-3312-abu-dhabi

Collector implementation: scripts/collect-ticket-sources.mjs. It reads only allowlisted public pages, checks robots before fetching, does not follow redirects blindly, and keeps source failures explicit. No authenticated scraping or access-block bypass. A checked page is not proof of stock. Prices from other-event recommendations must never be attached to the current race.

Adapted Lusail track: OSM ways 152483595 + 1553605580, queried 23 Nov 2026 with bbox 51.440,25.478,51.462,25.502. Coordinates projected to a north-up local SVG; downloadable derived data at /data/lusail-track.json under ODbL. Viewing callouts are placed schematically using official area descriptions and are not surveyed polygons.


## Abu Dhabi area pilot · 23 November 2026

The official F1 calendar still identifies Qatar as next (27–29 Nov), with Abu Dhabi on 4–6 Dec. The organizer’s standard grandstand products below span Thursday 3 Dec through Sunday 6 Dec. Ticket-specific access remains authoritative.

Product-specific source records are in `src/abuDhabi.ts`: Main (grid/pits), North (Turn 5), North Straight (longest straight after Turn 5), West Straight and West (braking towards Turns 6–7), Marina (marina-side sector) and South (Turn 9). Each links its official `/en/formula1/tickets-2026/<product>-4day` page. The pages explicitly offer seat selection. Some pages repeat generic highlights about grassy-hill seating or mismatched West Straight image alt text; those repeated blocks are not accepted as product-location evidence. No published price or stock state is imported into this pilot.

The official circuit page https://www.abudhabigp.com/en/circuit links a track-map image, but a direct reference download returned HTTP 403. No bypass or redistribution was attempted. The official circuit page remains the user handoff. FAQ and authorized seller links remain https://www.abudhabigp.com/en/faq and https://www.abudhabigp.com/en/authorized-onsellers.

Geography: OSM map API bbox 54.599,24.465,54.610,24.481, queried 23 Nov 2026. The earlier wider request returned HTTP 400; the smaller circuit-specific bbox succeeded. Closed circuit ways: 168477013, 1469184731, 1469184732, 188337196, 1255169703, 1255169704. The assembled polyline is about 5.30 km and has not been surveyed or certified against 2026 race infrastructure. Named building anchors: Main 188731381; North 168411369; West 133907352; Marina 133907079. Building centroids use unique polygon vertices. North Straight, West Straight and South markers are inferred regions, not measured stand footprints. Projected track and anchor data are supplied under ODbL in `public/data/yas-track.json`; UI attribution links OSM contributors. No linked user photos or YouTube content were downloaded.


## Singapore 2027 source pilot · 23 November 2026

- Event/year: https://www.formula1.com/en/racing/2027/singapore and https://ticketing.formula1.com/singapore/ identify Marina Bay and 8–10 Oct2027. Current2026 calendar still lists Qatar next, followed by Abu Dhabi; the root retains that priority.
- Current organizer catalogue: https://singaporegp.sg/en/tickets/general-tickets/grandstands/ explicitly labels2027 tickets and AXS processing. Standard 3-day Pit, Turn 1, Turn 2, Republic, Padang and Connaught products were checked. Each maps to its own `/en/tickets/general-tickets/grandstands/<name>-grandstand/` source in `src/singapore.ts`.
- Product-specific regions and published access: Pit(start/grid), Turn 1(first braking), Turn 2(opening complex), Republic(Turn 5) list Zones 1–4. Padang(Turn 9–10) and Connaught(Esplanade Bridge/Turn 14) list Zone 4. Gates/accessibility/walking routes are not modeled. All six pages contain an 180°View control; the app links the product page and does not claim the preview comes from the user’s chair.
- Organizer map: https://singaporegp.sg/en/event-info/circuit-park-map/ currently links https://storage.singaporegp.sg/web/2026/circuit-park-map/circuit-park-map.jpg?1015= . Despite the directory name, the inspected image header explicitly says SingaporeGrandPrix2027, 08–10 October; footer dated 15 Oct 2026, illustrative/not to scale/subject to change. Do not infer year from its file path. Download was inspected in `/tmp` only and not included in the repository or publication.
- FAQ: https://singaporegp.sg/en/faq/ticketing/ ; seller list: https://singaporegp.sg/en/tickets/official-resellers/ . F1’s event page currently offers a waitlist; it is labeled as such rather than presented as live stock. No ticket queue was entered, no authentication used and no Singapore price/inventory snapshot collected.
- Geography: OSM bbox103.8495,1.2860,103.8655,1.2960 revealed relation 421263, then its public `/api/0.6/relation/421263/full` supplied 99 circuit-member ways excluding the pitlane. Endpoint degrees are2, all ways join into one closed polyline. Projected equirectangular north-up at latitude 1.29°, fit 440 SVG units from origin(85,110). Derived length is about 4.97 km, not a certified race-distance measurement. Source geometry and dates are retained in `public/data/singapore-track.json` under ODbL. All stand regions remain inferred from organizer descriptions, not measured polygons.

The next Singapore chunk must verify remaining product identities rather than silently mapping Super Pit/Pit Exit/Chicane variants onto Pit or Turns1/2. Singapore 2026 coverage and a source-supported representative 3D scene remain separate unfinished work.
