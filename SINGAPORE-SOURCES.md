# Singapore 2027 standard-product expansion

Checked 23 November 2026. Current coverage: twelve standard grandstands plus Super Pit, Pit Exit and Chicane @ Turn 2, for fifteen distinct grandstand products. No prices or availability collected. Combination, accessibility, walkabout and hospitality products remain unsupported.

## Event and source year

- F1 event page: https://www.formula1.com/en/racing/2027/singapore identifies 8–10 October 2027, Marina Bay Street Circuit.
- Organizer catalogue: https://singaporegp.sg/en/tickets/general-tickets/grandstands/ labels the catalogue “2027 Tickets” and lists all six added products.
- Product detail pages have no year in their paths. Their association is the current 2027 catalogue, not the site's copyright year or their location-map footer (05 Oct 2026). This is current product guidance, not a finalized surveyed 2027 configuration.
- The main circuit-park-map page continues linking a file under `/web/2026/`. Its path alone must not establish the event year. Keep the prior recorded 2027 image-header check separate from this run's catalogue/date checks.

## Product evidence and inferred map regions

All coordinates below are app drawing coordinates on existing OSM geography. They are estimates, not organizer-supplied polygons, entrances or seat coordinates.

| Product | Organizer-described region | Published zones | App marker |
| --- | --- | --- | --- |
| [Marina Bay](https://singaporegp.sg/en/tickets/general-tickets/grandstands/marina-bay-grandstand/) | Final two corners before pit straight; overview identifies Turn 18 | 1, 2, 3, 4 | 540,307 |
| [Bayfront](https://singaporegp.sg/en/tickets/general-tickets/grandstands/bayfront-grandstand/) | Beneath Benjamin Sheares Bridge; Turns 16–17; overview identifies Turn 17 | 1, 2, 3, 4 | 403,311 |
| [Promenade](https://singaporegp.sg/en/tickets/general-tickets/grandstands/promenade-grandstand/) | Between Turns 17–18; final-corner and pit-entry views | 1, 2, 3, 4 | 467,337 |
| [Raffles](https://singaporegp.sg/en/tickets/general-tickets/grandstands/raffles-grandstand/) | Turn 5, Raffles Boulevard, drivers' left; separate from Republic on drivers' right | 1, 2, 3, 4 | 453,252 |
| [Empress](https://singaporegp.sg/en/tickets/general-tickets/grandstands/empress-grandstand/) | Turns 11–12 towards Anderson Bridge | 4 | 127,343 |
| [Stamford](https://singaporegp.sg/en/tickets/general-tickets/grandstands/stamford-grandstand/) | Between Turns 7–8 | 4 | 218,185 |

All six pages expose a “180° View” control. The app links the publisher's product page; it does not promise a specific row or redistribute those photographs. Historical incidents, stock labels, prices, preferred gates and walking routes are outside this addition.

The parser requires “Marina Bay Grandstand” to identify that product. The circuit name “Marina Bay” alone is not a stand. The former generic “Bay Grandstand” is not treated as the current Marina Bay product. Raffles/Republic and Promenade/Marina Bay remain separate matches and can produce an ambiguous result when both names occur.

## Representative 3D asset assessment

Status: **needs_assets**, assessed separately from area mapping.

| Candidate | Useful evidence | Missing for a supported 3D seat preview |
| --- | --- | --- |
| Organizer product descriptions and schematic circuit map | Corner regions, named products, zone guidance | Measured stand footprints, orientation, height, rake, section/row/seat inventory and obstruction geometry |
| Organizer 180° reference previews and gallery | External visual reference, retained via product-page handoff | Identified camera pose/seat and a redistribution licence for a bundled texture/panorama; the inspected pages show all-rights-reserved notices |
| Existing OSM relation 421263 | Licensed street-centerline context under ODbL | Temporary 2027 grandstands, fencing, chair inventory, event lighting and camera calibration |

Do not reuse the Las Vegas model as Singapore geometry. A future clearly labeled representative reconstruction may use independently modeled assets, but it must first document stand dimensions/anchors and camera bounds. Exact-seat previews need row/chair evidence and identified-camera validation. No asset access restriction was bypassed and no organizer artwork was added to the repository.

## QA inventory

- All twelve option/button/marker entries select their own product, zone text and official URL; new map targets activate with pointer and keyboard.
- New parser names resolve; Marina Bay circuit-only and former Bay Grandstand remain unknown; Raffles/Republic and Promenade/Marina Bay remain ambiguous; variants and wrong years remain unsupported.
- Compare three new products with correct zone columns; persistence, removal and race-scoped isolation retained.
- Desktop 1440×1050 and mobile 390×844/320px: map-label bounds, controls, selected-panel readability and comparison scrolling. No document overflow.
- Raw ticket marker absent from requests, storage and public share URL.
- Existing Qatar/Abu desks and Las Vegas historical replay route remain available.


## Verification result

46 tests passed, including all twelve names, distinct access/product IDs, Marina Bay venue-name ambiguity, wrong years and unsupported variants. Chromium checks covered desktop 1440×1050 and phones at 390×844/320px. All twelve map targets worked with pointer and Enter; six new selects updated their own source and zone guidance. Found and corrected the Marina Bay label extending beyond the drawing. Final map text bounds lie within its 620-unit viewBox. Three new products compared with their correct zone values and survived reload; remove/clear worked. A ticket input marker was absent from requests, storage and the shared area URL. Mobile ambiguity recovery worked. The comparison table scrolls within 280px at a 320px viewport; the document remained 320px wide. No page exceptions were observed. Qatar, the correct Abu Dhabi URL (`race=united-arab-emirates`) and the Vegas historical archive were checked.

No physical stand dimensions, actual sightlines, final temporary infrastructure, other browser engines or low-end hardware were verified.

## Three separate variants — 23 November 2026

The current organizer catalogue explicitly labels 2027 Tickets and lists all three products. Product page map-footers dated 05 Oct 2026 do not independently establish the event year.

| Product | Official source | Access | Estimated map anchor / label |
| --- | --- | --- | --- |
| Super Pit | https://singaporegp.sg/en/tickets/general-tickets/grandstands/super-pit-grandstand/ | Zones 1–4 | 547,220 / 485,315; shares Pit anchor because it occupies upper rows of the same stand |
| Pit Exit | https://singaporegp.sg/en/tickets/general-tickets/grandstands/pit-exit-grandstand/ | Zones 1–4 | 482,167 / 489,43; beside pit exit toward Turn 1 |
| Chicane @ Turn 2 | https://singaporegp.sg/en/tickets/general-tickets/grandstands/chicane-grandstand-turn-2/ | Zones 1–4 | 455,142 / 308,40; inside the opening corner complex |

These are broad app drawing regions, not final venue boundaries, ticket-row coordinates or new 3D coverage. No benefits, prices, live availability or official artwork were imported. Super Pit's description explains the shared Pit anchor. Its package and actual row assignment must be checked with the organizer. The guessed chicane-at-turn-2-grandstand path was not used; the checked source has the explicit chicane-grandstand-turn-2 slug.

The local parser recognizes SuperPit/Super-Pit, Pit Exit/Pit-Exit and Chicane @/at Turn 2/T2 separately. It masks the variant name before matching standard Pit/Turn 2, but retains multiple-product ambiguity. Bare Chicane, wrong turns, combination passes and wrong years remain unsupported.

56 tests pass. Desktop 1440×1050 and phone 390×844/320×740 checks covered all fifteen named map controls, the three variant keyboard targets, selected product/source/access, parser matches, multi-area rejection, wrong-year recovery, three-product comparison and reload persistence. A unique input marker did not appear in requests or localStorage. At 320px the document remained 320px wide. No page exceptions were observed. Singapore 3D remains needs_assets as described above.
