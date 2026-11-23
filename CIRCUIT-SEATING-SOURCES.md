# Qatar and Bahrain 3D seating studies

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
