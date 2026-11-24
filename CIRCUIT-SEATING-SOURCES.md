# Circuit-specific 3D seating studies

Checked 23 November 2026. These are circuit-specific illustrative reconstructions. Every generated position is selectable; this is not a complete or verified inventory of purchasable seats.

## Event identities and products

### Qatar · Lusail · 2026

- [Organizer event](https://www.lcsc.qa/formula12026): 27–29 November 2026 at Lusail.
- [Organizer FAQ](https://www.lcsc.qa/faq/formula-1r-qatar-airways-qatar-grand-prix-2026): only Main has assigned seats; other grandstands use free seating. Lusail Hill is general admission near Turn 1.
- Product references: [Main](https://www.lcsc.qa/ticket/main-grandstand-3-day), [North](https://www.lcsc.qa/ticket/north-grandstand-3-day), [T2](https://www.lcsc.qa/ticket/t2-grandstand-3-day), [T16](https://www.lcsc.qa/ticket/t16-grandstand-3-day), [Hill](https://www.lcsc.qa/ticket/general-admission-lusail-hill-3-day).
- Main faces the pit straight; North is beside Main towards Turn 1. T2 is inside the second corner; T16 is at the final corner. The Main page describes three ticket zones, but our nine **model sections do not map those official zones**.
- The [organizer interactive map](https://www.lcsc.qa/interactive-event-map) links a PAM SmartMap. This run read the public handoff but did not obtain surveyed temporary-stand or chair geometry from it.
- No T3 product was found in the inspected current organizer event catalogue. Third-party mentions do not establish current model coverage.

### Bahrain · Sakhir · 2027

- [Organizer event](https://www.bahraingp.com/blog/events/f1-2027/) and [F1 event](https://www.formula1.com/en/racing/2027/bahrain): 12–14 March 2027 at Bahrain International Circuit, Sakhir.
- The organizer identifies Main (grid/pits), Turn 1, Beyon (inner circuit/support pits), University (Turns 2–3/run to 4), and Victory (final two turns).
- OSM's named Batelco footprint supplies the broad Beyon/Batelco reference. University has three named OSM buildings and Victory two. These become separate modeled banks, not assertions about the current ticket shop's subdivisions.
- The official shop presents seat-selection language, but row assignments for every product were not verified. The model asks visitors to confirm assignment.
- The 2026 Bahrain-labelled race in the existing calendar is associated with Malaysia. This Sakhir model is therefore available only under the checked **2027** event. No Sakhir chair model is silently attached to 2026.

## Licensed geographic foundation

Public OpenStreetMap API map snapshots were retrieved for bounded venue boxes. The Overpass service returned HTTP 406; it was not retried or bypassed. The separate public OSM API provided the licensed geographic data.

| Venue | Geographic source | Features used |
| --- | --- | --- |
| Lusail | Ways [152483595](https://www.openstreetmap.org/way/152483595), [1553605580](https://www.openstreetmap.org/way/1553605580) | Closed circuit line; unnamed permanent grandstand footprint way 152483596 |
| Sakhir | Ways [4818385](https://www.openstreetmap.org/way/4818385), [881756729](https://www.openstreetmap.org/way/881756729), [881756728](https://www.openstreetmap.org/way/881756728) | Closed Grand Prix layout, excluding inner/outer/endurance layouts; named Main, Batelco, First Turn, University 1–3, Victory 1–2 and Sakhir Tower footprints |

The Lusail permanent footprint is associated with Main by broad location and organizer descriptions; that identity is inferred because OSM does not name the building. Temporary Qatar banks and Hill use explicitly inferred corner regions. No actual stand-boundary or seat-location accuracy is established.

Data are adapted under [ODbL 1.0](https://www.openstreetmap.org/copyright), attributed in the interface, and downloadable as `/data/qatar-geometry.json` and `/data/bahrain-geometry.json`. Source IDs, snapshot date, projection origin and units remain in each file. Coordinates use a local longitude/latitude approximation in meters, with south as positive Z. Source line lengths are approximately 5,432 m and 5,426 m; these are snapshot geometry lengths, not replacements for official circuit measurements. Vertical terrain is illustrative and flattened.

`python3 scripts/collect-circuit-geometry.py` refreshes the bounded public snapshots. Review changes before publishing: it rejects disconnected/open lines and implausible lengths. No imagery, ticket records or authentication data are collected.

## Modeled geometry and limits

- Qatar: 13,528 generated chairs across four grandstands, plus 135 sampled lawn viewpoints. Bahrain: 24,784 generated chairs across eight banks representing five products. All **38,447 model positions** have unique finite coordinates and selectable bank/section/row/position controls.
- Counts, section splits, row labels, spacing, rake, elevations, roofs, rails/fences, pit buildings, garage bays, floodlights and Sakhir Tower height are authored assumptions. Source footprints inform broad placement and width; their orientation and chair calibration remain unverified. Roof cutaway is a study tool, not a guarantee of actual cover or shade.
- Selected chairs use rounded instanced geometry; distant banks use cheaper geometry. Bundled CC0 asphalt maps are reused from the existing Las Vegas materials. No organizer photographs, Google Maps imagery, proprietary car assets or venue panoramas were added.
- Five procedural cars illustrate movement at a constant modeled lap pace. They are not live or historical telemetry, and do not imply actual racing lines or overtakes. The existing Las Vegas 2024 historical archive remains separate.
- Free-seating and lawn products never imply assigned chairs. Shared links contain public model coordinates only and are not ticket locators. The existing local Qatar ticket parser still resolves broad areas rather than model seats.
- Actual chair inventory, exact zones/rows, fence obstructions, accessibility, walking routes, measured views and final 2027 event structures require additional venue assets and calibration. No live prices or stock are added.

## Validation

50 tests pass, including exhaustive finite/unique/reachable coordinates for every generated position, section boundaries, clamping, season separation, source geometry closure, admission rules, and public-only share URLs. TypeScript and production build pass.

Chromium at 1440×1000, 390×844 and 320px: all banks, three camera modes, row shortcuts, complete grid, precise mobile inputs, keyboard grid selection, shared-position restoration, three-item comparison/capacity and WebGL loss/retry were checked. At 320px, document width stayed 320px and the grid dialog content was 284px. Reduced-motion entry starts paused and uses immediate camera placement. No page exceptions occurred in these checks.

Correct-year race entry, Qatar area-to-model handoff, 3D calendar filtering, unsupported season recovery, existing Abu Dhabi/Singapore desks and Las Vegas historical replay were checked. These checks do not certify real-world seat accuracy, other browsers or low-end-device performance.

## Footprint alignment and circuit overview — 23 November 2026

The horizontal bank envelope now fits the source footprint's edge-aligned bounding rectangle. It uses that rectangle's center and long dimension instead of a vertex average and farthest-corner diagonal. The model's long axis follows the footprint; its front-facing normal is chosen toward the nearest Grand Prix circuit point. This facing choice is still inferred, especially around curved/internal sections, and does not calibrate actual seat directions. Qatar Main uses way 152483596; all eight Bahrain banks use their existing named footprints. Qatar temporary stands/Hill retain their estimated regions and nearest-track facing. No new surveyed geometry was found or asserted.

Sakhir Tower now uses its own source footprint center instead of a hardcoded scene position. Its vertical architecture remains illustrative. Existing model links retain section/row/position labels, but the corrected horizontal envelopes change their generated coordinates. They remain public model positions, not ticket IDs.

Current organizer T2/T16 product pages were rechecked: they establish inside-T2 and final-corner placement and free seating, not temporary-stand boundary coordinates or orientation. The Bahrain 2027 organizer page still establishes five viewing products, not row-level camera calibration. These descriptions are insufficient to upgrade temporary placement confidence.

The circuit-map dialog shows source outlines, modeled bank envelopes, north-up geography and all bank selectors. A 70-degree illustrative horizontal fan follows the selected model position and inferred bank facing. It does not represent occlusion, visible-track proportion, distance to barriers or live camera zoom. It works independently of WebGL.

55 tests pass, including a rotated-rectangle regression, reversed polygon order/invalid-input checks, footprint-axis and source-envelope agreement, and exhaustive unique finite model coordinates. Desktop and phone checks covered all 13 bank selections, Escape/reopen, source-versus-estimate labels and forced WebGL failure with map selection still working. At 320px the dialog content/scroll width were both 284px and document width was 320px. No page exceptions occurred.

## Detailed procedural cars — 23 November 2026

The Qatar/Bahrain studies now use the same authored open-wheel body as the existing Vegas scene: tapered chassis, cockpit/helmet, halo, multi-element front wing, rear wing/endplates, suspension rods, tire sidewall rings, wheel hubs and a rear lamp. The reusable component owns body/halo geometry cleanup; each scene owns its placement and motion. Qatar/Bahrain wheels turn while their simulated cars play and stop with pause. These shapes are illustrative, not manufacturer CAD or a certified 2026/2027 car specification. No team marks, external vehicle assets, photographs or new venue geometry were added.

Vegas keeps its existing geometry, procedural pace and historical replay data/clock. Qatar/Bahrain retain their illustrative five-car, constant modeled-lap simulation; no telemetry or overtaking accuracy is implied.

## Abu Dhabi · Yas Marina · 2026

Checked 23 November 2026. [F1's event page](https://www.formula1.com/en/racing/2026/united-arab-emirates) places racing on 4–6 December and gives the circuit length as 5.281 km. The [organizer's 2026 catalogue](https://www.abudhabigp.com/en/formula1/tickets-2026/) and product pages cover four-day grandstand products starting 3 December. Model route: `?season=2026&race=united-arab-emirates&screen=circuit`. No 2027 layout is inherited.

### Products and model regions

| Product | Current official detail | Geographic / modeled foundation |
| --- | --- | --- |
| Main | https://www.abudhabigp.com/en/formula1/tickets-2026/main-grandstand-4day | Starting grid/pits; OSM 188731381, fitted envelope |
| North | https://www.abudhabigp.com/en/formula1/tickets-2026/north-grandstand-4day | Turn 5; OSM 168411369 as context, representative estimated bank at 30,-930 |
| North Straight | https://www.abudhabigp.com/en/formula1/tickets-2026/north-straight-grandstand-4day | Long straight after Turn 5; estimated bank at -170,-420 |
| West Straight | https://www.abudhabigp.com/en/formula1/tickets-2026/west-straight-grandstand-4day | Straight towards Turns 6–7; estimated bank at -300,-65 |
| West | https://www.abudhabigp.com/en/formula1/tickets-2026/west-grandstand-4day | Braking complex; OSM 133907352 as context, representative estimated bank at -390,230 |
| Marina | https://www.abudhabigp.com/en/formula1/tickets-2026/marina-grandstand-4day | Marina-side final sector; OSM 133907079, fitted envelope |
| South | https://www.abudhabigp.com/en/formula1/tickets-2026/south-grandstand-4day | Turn 9; OSM 133907081, fitted envelope |

The organizer pages contain duplicated generic highlight blocks and some mismatched image alt text. Product headings and product-specific descriptions were used; generic grassy-hill copy was not treated as Main/North seating evidence. No prices, availability, image files or private tickets were imported.

### Meter-space data and limits

A public OSM map snapshot for bbox `54.598,24.462,54.612,24.480` supplied six connected Grand Prix ways: 168477013, 1469184731, 1469184732, 188337196, 1255169703, 1255169704. They form a closed 250-vertex line. An earlier, larger bbox request returned HTTP 400; the smaller public request succeeded. No access control or media block was bypassed.

Coordinates are projected from longitude/latitude around `[54.605,24.471]`, in meters with south as positive Z. Adapted line length is approximately 5,303 m, not a replacement for the official measured length. Source geometry/IDs/date/licence are in `/data/yas-geometry.json`, under ODbL-1.0 with in-app attribution. The existing area desk's drawing-coordinate `yas-track.json` is unchanged and was not treated as meter data.

Refresh one venue with `python3 scripts/collect-circuit-geometry.py yas`; `--input /path/to/public-osm.xml` can process an already retrieved public snapshot. An explicit input requires one venue. Connectivity/closure and plausible-length guards remain in place. Review updates before publication.

North and West footprints are curved. Their full rectangular envelopes can contain the circuit; the initial West envelope placed generated positions on the road and was rejected. The scene instead uses narrow representative banks in their broad regions, marked estimated. A regression check exhaustively keeps every new model chair more than 15 m from the modeled track centerline. This protects internal model consistency; it does not certify real stand boundaries or clearance.

The model has **19,840 illustrative positions across seven products**. Section/row counts, chairs, widths of estimated banks, rake, roofs, facing, fences, pit structures and light placement are authored. Water, hotel architecture, bridge elevation and final event structures are not reconstructed. Terrain is flattened. No official chair inventory, exact ticket match, accessible route or measured sightline is established. Photos/reports have an explicit empty collection; sources from other venues are never borrowed.

### Rendering corrections shared with Qatar/Bahrain

Full-circuit framing now uses each venue's geometry and bank bounds, viewport aspect and space reserved for controls. The previous fixed camera clipped the Yas south end. Overview fog/far range now follows camera distance instead of fading away the entire phone overview. Seated/stand mode restores its original fog and projection. The phone overview gets a taller bounded scene. Light-surface map/grid/position hover text stays dark; the prior global white hover rule hid selected bank names.

## Jeddah 2027 source assessment · 24 November 2026 UTC

The [current F1 event](https://www.formula1.com/en/racing/2027/saudi-arabia), [JCC event page](https://www.jeddahcircuit.com/en/events/formula-1-stc-saudi-arabian-grand-prix) and [SMC return announcement](https://www.jeddahcircuit.com/en/news/formula-1-stc-saudi-arabian-grand-prix-confirmed-to-return-in-march-2027) establish Jeddah Corniche Circuit for 19–21 March 2027. Qiddiya is not inferred as a replacement venue from a ticket label.

JCC's Buy Tickets link points to https://tickets.saudiarabiangp.com/en. The browser-visible page explicitly names the same date/year and Jeddah. Its public Grandstands “View prices” table lists Main Grandstand A/B, Central Grandstand A/B, Qiddiya - Central Grandstand C and stc Central Grandstand D. Only the product names were retained in src/jeddahReference.ts and the 2027 race guide. The table explicitly separates pricing from availability; neither prices nor stock were imported. No booking/cart/seat-reservation action, account access or queue entry occurred. The initial text-only web extraction was empty; the normal public page rendered in Chrome. Optional cookies were declined.

The separate saudi.gp sales/guide site was not used as primary organizer evidence. Product identities above came from the organizer-linked catalogue, not inferred from older race guides.

A bounded public OSM snapshot at `39.095,21.618,39.115,21.652` includes GP-labeled way 1007989410, mixed shared/Formula E/WTCR raceway segments 1257884699 and 1359884755–1359884765, plus four unnamed grandstand ways 1154622779–1154622782. Several route segments carry fixme/layout notes. A GP-consistent closed trace and the six current product-to-footprint associations have not been independently verified. No Jeddah geometry file, model chair inventory, inferred stand placement or 3D coverage was published from this assessment. Do not use Formula E/WTCR branches, unnamed polygons or reseller descriptions as a verified 2027 F1 seating layout.

Next obtain current organizer location/diagram evidence and verify the GP routing before extending the meter-space collector. It currently has length guards for the existing venues; add an evidence-based per-venue range when Jeddah is ready instead of removing validation globally. Exact chair/row calibration remains a separate unavailable asset.

## Seated touch zoom

Qatar, Bahrain and Yas now have visible zoom-in, zoom-out and default-zoom buttons in seated/standing-view mode. They change the perspective lens only; the selected modeled eye position and look direction remain fixed. Field of view stays bounded at 35–105 degrees, matching the previous wheel limits. The default is responsive (70 degrees for wide scenes, 90 for portrait); 1× resets that default, rather than reporting current magnification. The buttons disable at limits and during WebGL loss/loading. Wheel input and button bounds stay synchronized. No panorama, optical calibration or change to modeled sightline evidence is implied.

## Melbourne 2027 daylight study · 24 November 2026 UTC

The [F1 event](https://www.formula1.com/en/racing/2027/australia) identifies Albert Park, 2–4 April 2027. AGPC’s [2027 travel guide](https://travel.grandprix.com.au/blog/grandstand-guide-2027), published 6 October 2026, links the current F127 venue diagram. Its ten-stand travel-package table is a subset: the diagram also names American Express, Stewart, Vettel, Webber, Lauda and Piastri. Sixteen named banks are modeled. The separate Turn 12 accessible platform, hospitality and premium-section boundaries are not modeled. Do not substitute legacy Brabham listings for current map names.

The public organizer diagram was inspected in the browser; no proprietary artwork, paths or photographs were copied into the app. Broad stand regions were interpreted against identifiable turns, then given authored setbacks and widths. This is not a surveyed calibration. Rows, chairs, structures, rake, facing and counts are illustrative. All 30,464 positions are selectable model coordinates, not ticket IDs. Roof boundaries are unknown, so canopies are omitted; their absence does not assert that all real seats are uncovered. Confirm ticket-specific admission and cover with the organizer.

Adapted OSM data is distributed under ODbL in src/albert-park-geometry.json and public/data/albert-park-geometry.json. Relation 280443 supplies the connected GP loop, excluding its pit lane, rotated to start node 9123374386. Projection origin is 144.972, -37.847, meters with south-positive Z. The 309-vertex trace is approximately 5,314m, not the official 5.278km measurement. Relation 346429 supplies Albert Park Lake and joined island holes; 2,356 natural=tree points provide context. Local cricket/athletics stands are excluded. Tree sizes, crowns, event clearing, flat terrain, daylight, water ripples, fences and pit building are authored. Trees conflicting with modeled road or banks are filtered, without claiming an actual event clearance plan. No attendee photo references are verified for Melbourne yet.

### Jeddah follow-up

The organizer’s public explorer diagram broadly matches a nine-way OSM GP candidate, excluding Formula E shortcut and WTCR dead-end branches. This does not resolve shared-segment fixme notes. The explorer has conflicting marker descriptions (Main B text refers to Main A; Central C–D text and marker disagree). The organizer-linked 2027 event seat selector requires sign-in. No account, private API, queue, reservation or checkout was accessed. Six product-to-bank associations remain unverified; no Jeddah 3D model has been published. Do not repeat the same login attempt or promote four unnamed footprints into six verified banks.
