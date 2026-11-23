# Release validation

Validated locally in Chromium on 22 November 2026.

- TypeScript compilation and seven model tests pass: input bounds, malformed selections, URL round trips, comparison deduplication/limit, and camera coordinate changes.
- Desktop layouts inspected at 1440×1000 and 1440×800; no horizontal overflow. Seat controls, eye-height summary, and primary actions fit in the viewport.
- Mobile inspected at 390×844. Seat entry returns to the scene; the controls collapse and reopen. No horizontal overflow.
- All five modeled grandstand positions select correctly. Aerial, grandstand, and seated views render.
- Three different seated comparison previews render with consistent field of view. Removal, capacity limit, and empty state work.
- Shortlist persistence, share-link state, browser back, keyboard seat navigation, source links, and dialog Escape dismissal checked.
- 2D map mode and return to 3D checked.
- An actual WebGL context loss was triggered through WEBGL_lose_context. The fallback map, recovery message, and seat controls remained usable.
- Malformed URLs and corrupt local storage recover without crashing.
- Reduced-motion rendering, zoom buttons, and camera reset checked.
- No unhandled browser errors during the main tested flow.

## Geometry limitations

The reconstruction follows the official 2026 diagram at zone level. It has not been calibrated against surveyed seat coordinates or matched photographs from identified rows. Fencing and rows have been inspected for internal geometric consistency, not verified against venue measurements. Distances, elevations, obstructions, rows, and seat numbers remain estimates. The site states these limitations and does not claim seat-level accuracy.

## Not verified

Physical venue accuracy, actual ticket availability, real-world accessibility routes, Safari/Firefox rendering, and measured performance on low-end mobile hardware. No purchasing or account flow exists.

## F1 theme revision

The user requested F1 colors and the Las Vegas race aesthetic. Replaced the olive/gold treatment with red, ink black and white; rebuilt the scene with instanced chairs, steel stands, continuous barriers/fencing, floodlights, window-lit buildings, original red/white Sphere art and restrained bloom. External seat photography was inspected as construction reference and not distributed.

Checked desktop at 1440×1000 and 1366×768 and mobile at 390×844. Confirmed the bottom sheet opens and closes, the high-row shortcut changes the selection, and portrait seat views use a wider field of view. Compared three rendered seat previews and checked removal, sharing, reload, map mode, track-demo play/pause and actual WebGL context-loss recovery. No unhandled browser errors were observed in these flows. The mechanical design scan reported two border/corner warnings; both thick borders were reduced.

These changes improve rendering and interaction. They do not establish surveyed accuracy or verify actual seat obstructions.

## Detail revision

Added beveled molded chairs, armrests, hardware, numbered rear plates, two-step aisle treads, step lighting and environment reflections for metal. Added illustrative service pavilions, lighting cabinets and conduits, tire stacks, corner signs and a venue screen. Grandstand mode now frames the selected seat closely; markers remain in overview so they do not obscure close views.

The new detail is reconstructed artwork and does not establish actual equipment placement, official seat numbers, or measured sightlines.

## True-3D rendering and interaction revision

The user confirmed retaining true 3D and improving realism. Added bundled CC0 scanned asphalt color/normal/roughness maps, soft shadow mapping, desktop contact occlusion, lower ambient illumination, reduced facade repetition, original spectator silhouettes, and cheaper distant-seat meshes. The entry view is now seated. Transitions use a bounded, interruptible camera path and preserve reduced-motion behavior. C/D placement was adjusted within the approximate reconstruction; geometry remains unverified.

An enlarged seat-map dialog shares selection state with the 3D scene and supports arrow keys. Checked enlarged selection, default entry, mobile viewport fit and track-demo play/pause without unhandled rendering errors. A short local Chromium animation sample had a 16.7 ms median frame interval; this is not a low-end-device performance claim.

## Platform-research revision

Added modeled groups of 1–4, visible saved-view chips, docked primary actions, explicit camera-seat labels and linked comparison yaw/pitch controls. Inspected current first-party Ticketmaster, SeatGeek and 3D Digital Venue material; links and the applied design inferences are in PLATFORM-RESEARCH.md.

Seven model tests pass, including exhaustive group-boundary checks for all modeled seats and group sizes, legacy links, group URL round trips, malformed group identifiers and distinct saved group sizes. TypeScript and production build pass. The design detector reports no findings. The separate 3D chunk remains approximately 989 kB minified and is loaded on demand.

Chromium checks at 1600×1050, 1366×768 and 390×844 confirmed group selection, stand changes retaining group size, persistent shortlist chips, map keyboard navigation, reload restoration and docked actions. No horizontal overflow at the checked smaller desktop or mobile sizes. Both rendered comparison canvases changed after linked angle input; reset restored the angle controls. No unhandled browser errors were observed in these flows. This revision does not re-certify the previously checked WebGL-loss flow or establish low-end-device performance.

## Calendar expansion and Sphere correction

Added both current official-calendar snapshots (23 races in revised 2026, 24 in 2027), season switching, race search, upcoming/model-coverage filters, empty-result recovery, race detail links and four ticket-category guides. Official ticket and hospitality season-selector destinations were checked from Formula 1's navigation. Catalogues remain external; stock, pricing and package inclusions are not fetched.

Rebuilt Sphere as a ground-cut spherical cap using the published 516 ft width and 366 ft height. Removed the wrapped text billboard and added original amber face artwork with LED surface shading. Updated seated/overview framing and the orientation map. The exterior envelope is calibrated; seating positions, relative placement and sightlines remain unverified. The bundled preview image is captured from the app, not a photograph.

The complete-grid dialog now shows every modeled stand, center aisles and all seat/row numbers, plus fit/magnify and mobile number controls. Checked five stand overviews, selected-position seat counts, keyboard selection and horizontal magnification without document overflow.

Ten automated tests pass, including calendar sequence/uniqueness, cross-month race-status boundaries and the actual generated Sphere geometry's ground contact and exterior envelope. TypeScript and production build pass. The design detector found no issues. Chromium checks covered desktop 1440×1000 and mobile 390×844, both seasons, the two remaining 2026 weekends, empty search/reset, ticket-category changes, calendar-to-Vegas navigation, legacy seat links, group/season persistence on reload, grid controls and linked comparison rendering. No unhandled page errors were observed. The calendars are snapshots, not live feeds; status is day-based, not live session timing. Other circuits have guides, not 3D seat previews.

## Whole Las Vegas and Sphere interior expansion

Added a schematic whole-circuit atlas for 16 location-based viewing products from the organizer's grandstand, general-admission and hospitality pages. Category counts checked: five grandstand products, two general-admission areas and nine hospitality products. Map selection, keyboard activation, search/empty/reset, three-area comparison and capacity limits work. Guide-only areas have no invented seat CTA.

Added four outdoor modeled banks at main/start-finish, Turn 17 and Turns 3–4. All nine banks expose 6,444 modeled positions; the full grid, group bounds and share URLs cover them. Added full-circuit camera mode, full-track fencing, an illustrative pit building, expanded ground and lighting, and a bank-aware circuit inset. These are uncalibrated reconstructions, not complete official grandstand inventories.

Added a separate Sphere indoor study with 39 section references over four levels and 16,220 unique illustrative marker positions. Tested 3D pointer selection, full-section grid selection, arrow navigation, level changes with row clamping, isolated/all-level display, whole-bowl/model-seat cameras and eight official map links. Original abstract screen artwork represents no specific show. The structure, counts, rows, screen and sightlines are illustrative.

Thirteen automated model tests pass. TypeScript compilation passes. The design detector reports no findings. Chromium functional and rendered checks ran at 1440×1050 and 390×844. No document overflow in the checked final mobile atlas or outdoor seat view. A real WEBGL_lose_context interruption triggered the indoor recovery message, and Retry 3D recreated a ready canvas. Official maps and model-grid controls remained outside the failed canvas. No unhandled page errors occurred in the final tested flows.

Not verified: official seat inventories, show-specific configurations, actual indoor or outdoor sightlines, accessible routes, 2027 zone layouts, live stock/pricing, Safari/Firefox, or low-end-device performance. The counts above describe generated geometry only.

## Apex Atlas identity and night-rendering revision

The user selected Apex Atlas. Updated app wordmarks, the original A mark, favicon, titles, UI copy and documentation. Retained the existing neutral hosting/repository locations.

Added five detailed procedural open-wheel cars with cockpit, halo, wing elements, suspension, spinning wheels, reflective paint and rear lights. Cars begin at the modeled track sample closest to the selected bank; pause preserves their positions. Added selected-bank shadow-casting lighting, shader light shafts, subtle lit airborne motes, brighter road response and adjusted bloom. Added three simulated Sphere display choices, with a bundled NASA lunar surface map and external official XO Stream / Google Maps links.

Downloaded 126 OpenStreetMap building outlines with available height/storey tags; the renderer omits schematic-course conflicts and estimates missing heights. Added procedural night-window shading. Source geometry is credited in the scene and sources dialog; adapted data is supplied under ODbL in public/geo. The resulting scene remains an uncalibrated race reconstruction.

Sixteen model tests pass, including nearest-track placement, height-unit/fallback handling and closed, finite building outlines. TypeScript compilation and the production build pass. The design detector reports no findings.

Chromium checks at 1600×1050 and 390×844 covered visible racing motion, stable paused frames with atmosphere disabled, all display choices, independent atmosphere control, reduced-motion initial pause, two-view comparison, renamed calendar/atlas surfaces and scene-setting panel bounds. No horizontal overflow in the checked mobile seat/calendar/atlas views. No browser rendering errors were observed in these flows. A 90-frame local Chromium sample had a 16.7 ms median frame interval; this is not a claim about low-end phones or every device. Real-world geometry, display-program fidelity, race telemetry, other browser engines and low-end hardware remain unverified.

## Ticket product pilot · 23 November 2026

- Public source collector executed successfully: five exact 27–29 Nov 2026 Lusail product price blocks; F1 store access blocked and recorded explicitly; F1 Experiences metadata only. No stock inference or anti-bot bypass.
- 26 tests passed across existing scene/calendar behavior, ticket alias/conflict/unsupported/wrong-event parsing, numeric-seat versus year handling, provider routing, robots policy and scoped price extraction. Collector tests reject future-year and unrelated-event prices.
- Desktop 1600×1050 and mobile 390×844 inspected: entry actions, geographic circuit, five selected-area descriptions, locator matched/unassigned/unknown/ambiguous/wrong-year states, reference prices, seller list, comparison and methodology. Narrow header and primary-button hover contrast fixed during QA. 800px layout checked as a desktop zoom equivalent.
- Browser flow passed: example/manual/clear input; local Main match; unassigned North warning; ambiguous choice; unknown row-only; unsupported Lounge; shared-area reload; three-item comparison cap, persistence, remove and clear; seller filters (9 all / 3 event / 6 reseller); source disclosure; snapshot fetch failure; 2027 separation; Abu Dhabi direct event links; calendar search/reset/upcoming; Las Vegas atlas and legacy seat entry.
- Privacy check: unique pasted marker absent from requests, URL and localStorage. Clipboard link contained only season/race/area. LocalStorage held public comparison area IDs only.
- Reduced-motion context checked; circuit highlight remains static and the moving dot is hidden. Keyboard Enter selects map areas. No page exceptions in the tested product flow. The intentional aborted snapshot request displayed an unavailable-price message.
- Automated style detector ran once; its new side-border warning was removed. Existing Three.js bundle size warning remains confined to the lazy 3D experience; the Qatar desk does not load that renderer.
- Limitations: area callouts are schematic and do not resolve exact rows/chairs, entrances, fencing or photographic sightlines. No live inventory, hosted price feed, checkout, account or upload/OCR is implemented. Abu Dhabi area mapping is the next scheduled chunk.


## Abu Dhabi 2026 area pilot · 23 November 2026

- 32 automated tests passed, including long versus short product aliases, venue-name ambiguity, wrong-year/event inputs, unsupported variants, numeric seat/year handling, public-only share URL cleanup, closed Yas geography and product source integrity.
- Chromium desktop 1440×1050 and mobile 390×844: all seven area sources, selected-panel updates, locator example/manual/clear, matched/ambiguous/unknown/wrong-event states, unplaced variant guidance, public sharing, source disclosure and official handoffs checked. At 320px, document/client/viewport widths all remain 320px.
- Found and fixed SVG marker hit targeting: long unpainted leader-line bounds no longer form the marker role-button. Pointer click and keyboard Enter now activate the circle target, while labels remain clickable. The seven ordinary buttons remain an accessible alternative.
- Privacy check: a unique pasted marker did not appear in requests, localStorage or shared URL. Clipboard contained only the public 2026 race/area. No page exceptions occurred in the tested new flow.
- Mechanical detector ran once with no findings. Independent bounded finish review returned Pass with no material findings in the supplied desktop/mobile screenshots and scoped source review. The review did not certify real-world accuracy or external inventory.
- Limits remain explicit: approximate areas, not entrances, accessible routes, exact seats, section positions, 3D previews or photographic sightlines. Club/lounge/suite/Hill/concert products are unsupported. No current Abu Dhabi prices or inventory are inferred from public product pages.


## Shared venue registry and comparison · 23 November 2026

- 38 automated tests passed. New checks cover event/year lookup, distinct closed geometry, attribution and coverage limits, corrupt/duplicate/private/unsupported comparison values, capacity/removal, race/year storage keys and public-only share URLs.
- Qatar and Abu Dhabi now use the same registry-backed SVG renderer and comparison table. Qatar retains hatch markers, track annotations, animated dot, source geometry, price duration and legacy storage key. Abu Dhabi retains four OSM stand anchors and three estimated regions; its comparison adds no price or live-stock claim.
- Chromium desktop 1440×1050, mobile 390×844 and 320px: add three, capacity rejection, remove/re-add, row selection, clear and reload persistence passed. Mobile comparison scrolls within its table region; the document remains 320px wide at a 320px viewport. Map keyboard activation and selected-panel agreement passed.
- Seeded legacy Qatar IDs restored without affecting Abu Dhabi choices. Clearing Qatar removed its key while Abu Dhabi’s three saved IDs remained. A unique pasted ticket marker did not appear in requests or localStorage. Both share paths strip unrelated query/hash data. A blocked-localStorage context displayed the tab-only comparison notice.
- Qatar parser and legacy Las Vegas WebGL entry still worked; no page exceptions observed. No 2026 desk appeared under the 2027 season.
- Mechanical detector ran once with no findings. Source compilation passed after resolving a case-insensitive module-name collision by naming the pure helper `comparisonState.ts`.
- Geometry and seat-accuracy limits are unchanged. Venue-certified chair positions, other circuits’ 3D views, live stock and current Abu Dhabi prices remain unavailable.

Independent finish review closed with Pass and no outstanding findings. Two minor mobile refinements were applied and confirmed: Clear comparison stays on one line, and the horizontal-scroll hint appears only on small screens. The table remains keyboard-focusable. Qatar public source collection refreshed successfully: all five published reference prices unchanged; the F1 store remains access-blocked, with no stock inferred.


## Singapore 2027 area pilot · 23 November 2026

- 42 automated tests passed. New checks cover2027 binding without2026 fallback, six source/zone mappings, variants including hyphenated Pit-Exit and Super-Pit, combinations, wrong years/races, ambiguous names and numeric seat/year distinction. The shared URL test now chooses each registry entry’s real first area instead of assuming every venue has Main.
- Chromium 1440×1050,390×844 and320 px: all six area/source/zone selections, map pointer/keyboard, example/manual/clear, matched/unknown/ambiguous/wrong-year states, saved-row selection, three-item cap, remove/clear/reload and official handoffs checked. Comparison adds a published-zone column for Singapore only; Abu Dhabi retains its original columns and no invented price column.
- A unique pasted ticket marker was absent from requests and localStorage; clipboard held only public 2027/race/area. Singapore and Abu Dhabi keys remained separate. Blocked storage displayed the tab-only notice. At 320 px, viewport/client/document were320 px; horizontal table scrolling remained inside its region.
- Current2027 calendar entry opens the pilot. The 2026 Singapore guide explains its unsupported year boundary and links the explicitly labeled 2027 pilot. Qatar’s parser and legacy Las Vegas WebGL entry still worked; no page exceptions observed in these flows.
- Mechanical detector ran once with no findings. Independent finish review found misleading Qatar emphasis in shared navigation; neutral current-season Ticket planning navigation fixed it. Rechecked desktop/mobile; review closed Pass with no remaining material findings.
- Qatar public-source collection refreshed successfully with unchanged five published reference prices; the F1 store remained blocked with no inventory inferred. Singapore prices and stock were not collected.
- Limits: six estimated standard-grandstand regions, not all Singapore seats/products; no exact chairs, measured obstructions, final 2027 configuration or Singapore 3D. Organizer artwork/photos are linked, not republished.


## Singapore 2027 twelve-grandstand expansion · 23 November 2026

- Added Marina Bay, Bayfront, Promenade, Raffles, Empress and Stamford to the six-area pilot. Current organizer 2027 catalogue, six product descriptions/zone access and F1 event dates rechecked. `SINGAPORE-SOURCES.md` records per-product sources, inferred coordinates and a separate 3D asset assessment.
- 46 tests pass, including all twelve names, published-zone values and distinct identities. Marina Bay circuit-only input cannot resolve a stand; Raffles/Republic and Promenade/Marina Bay remain ambiguous; unsupported variants and wrong years remain explicit.
- Chromium 1440×1050: all twelve map pointer/keyboard targets, new selected-panel/source/zone agreement, comparison persistence/removal/clear, local match and public-only clipboard sharing checked. Ticket marker absent from requests and storage.
- Mobile 390×844 and 320px: new area selection, circuit-only unknown state, ambiguous selection/recovery and three-area comparison checked. Map labels fit after correcting Marina Bay's right-edge label. At 320px, document width is 320px; the comparison scrolls inside its 280px region. No page exceptions observed.
- Qatar, Abu Dhabi's seven-area desk (`race=united-arab-emirates`) and the existing Las Vegas historical archive route remain available.
- Super Pit, Pit Exit, Chicane, combination/accessibility/hospitality products remain unsupported. All twelve regions are estimates. No exact-seat geometry, 2026 fallback, Singapore 3D, prices, stock or redistributed organizer images added. Representative 3D is recorded as needs_assets; area work can continue.


## Qatar/Bahrain 3D seating · 23 November 2026

50 tests pass, including exhaustive checks for every one of the 38,447 generated positions, unique finite coordinates, source closure, bank bounds, admission distinctions, correct season/physical circuit and sanitized public sharing. Source notes in CIRCUIT-SEATING-SOURCES.md separate OSM footprints from inferred Qatar temporary regions and authored rows/chairs/roofs.

Chromium desktop 1440×1000 and phone 390×844/320px checks covered all banks, circuit/stand/seated cameras, roof cutaway, grid pointer/keyboard and numeric inputs, last-section/last-row/last-position selection, front/middle/high shortcuts, three-item comparison/capacity, share-link restoration and initial paused reduced-motion state. Forced WEBGL_lose_context retained model controls and grid; Retry recreated a ready canvas. Document width remained 320px at a 320px viewport; dialog content was 284px. No page exceptions occurred.

Qatar's source-area link, Bahrain's 2027 entry/back navigation and 3D race filtering worked. A 2026 Bahrain circuit request with a legacy seat parameter showed unsupported coverage instead of opening Las Vegas. Existing Qatar/Abu Dhabi/Singapore desks and the Vegas historical archive remained available. Physical seating accuracy, surveyed temporary stands, actual obstructions, other browser engines and low-end performance are unverified.


## Spectator photo/reference browser · 23 November 2026

53 tests pass, adding reference-year isolation, physical venue/area matching, provenance and HTTPS/embedded-ID checks. Desktop 1440×1000 and phones at 390×844/320px covered type/year/scope filters, empty-state recovery, close/reopen resets, reported-section boundaries and original source targets. No external media requests occurred before a preview click. The official Reddit widget inserted its provider frame, but provider network security blocked its content in this environment; the UI keeps an original-photo link. Simulated script failure also showed the fallback, and unloading removed the media frame. An optional standard YouTube nocookie frame uses the attendee clip linked by its source report; playback availability is not guaranteed.

Mobile document width stayed 320px; dialog content measured 284px. The Vegas replay's covered photo trigger was moved into the replay panel and checked in detailed/compact modes. Opening references pauses historical playback without resetting progress. No page exceptions observed in these flows. Actual capture position, attendance and year remain author-reported/inferred as labeled; exact-seat matching and complete photo coverage are unavailable. See PHOTO-REFERENCES.md.

## Footprint alignment / full circuit map · 23 November 2026

55 tests and production build pass. Regression checks cover rotated/reversed/invalid footprints, bank-axis and envelope agreement, inferred facing toward the circuit, and all 38,447 unique finite model positions. Chromium 1440×1000 and 390×844/320×740 checks covered all eight Bahrain and five Qatar bank selectors, map-to-3D state, Escape/reopen and forced WebGL loss with map selection still usable. At 320px the map dialog content and scroll width were 284px, with document width 320px. Inspected desktop Bahrain map, Bahrain Beyon seated view, Qatar phone map and Qatar full-circuit view. No page exceptions, horizontal overflow or covered map controls observed; phone dialog intentionally scrolls to the full bank directory. FOV fan is illustrative and source footprints do not verify real chairs or visibility.

## Singapore variants / hourly cadence · 23 November 2026

56 tests pass. Added variant regression checks for SuperPit/Super-Pit, Pit Exit and Chicane @/at Turn 2/T2, standard-name masking, multiple-product ambiguity, wrong-year boundaries, unsupported combinations and the checked Chicane source slug. Desktop 1440×1050 and phone 390×844/320×740 checks covered all fifteen native map controls, variant keyboard selection, matching product URLs/zone access, private local parsing, comparison of the three variants and persistence after reload. Input marker absent from requests and localStorage. Document width was 320px at 320px; no page exceptions observed. No new Singapore 3D accuracy or live inventory is claimed. Existing automation was updated in the app to ACTIVE hourly; no duplicate was created.
