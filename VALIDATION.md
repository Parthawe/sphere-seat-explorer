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

## Outdoor car detail / existing-scene audit · 23 November 2026

56 existing tests and production build pass. Inspected Qatar T2/T16, Bahrain Turn 1/Beyon, Vegas outdoor and Sphere interior on desktop 1440×1000 and phone 390×844. The shared visual component replaces the Qatar/Bahrain box silhouettes while retaining Vegas's authored body and its parent-owned motion. Comparison of Vegas before/after screenshots showed the same seated composition.

Qatar/Bahrain play/pause, stand/seated mode switches and map-to-bank selection passed. Two canvas captures after pause and two animation frames were byte-identical. Forced Qatar WebGL loss/Retry returned a ready canvas with detailed cars. Vegas historical archive load, play/pause, scrub to 80s, Next pass and close passed. Sphere whole-bowl/model-seat switches worked; indoor geometry was unchanged. Phone document width remained 390px; no page exceptions occurred.

Evidence screenshots are local under qa/hourly-car-detail/. This is a rendering/control check on the available Chromium/Mac environment, not a real-device performance benchmark or physical-view validation. The audit still found sparse foreground/context in Qatar/Bahrain and no touch-button zoom in their seated mode; those remain future polish work. No new venue or calibrated exact-seat coverage is claimed.

## Yas 2026 3D addition · 23 November 2026

61 tests pass. Added correct-year/canonical-route isolation, meter-space/source/product checks, exhaustive nonintersection of the 19,840 new model positions with the modeled road, empty Yas photo-source isolation, and overview frustum/control-reserve projection checks for all three geographic models. All 58,287 generated Qatar/Bahrain/Yas positions remain finite and unique in the existing exhaustive test. TypeScript/production build is required for the release package.

Chromium desktop 1440×1000, phone 390×844 and narrow 320×740 checks covered all seven Yas map bank selectors, the last South section/row/position, full/stand/seated cameras, roof controls, car play/pause, three-position comparison, source links, copied-share success and forced WebGL loss/Retry. At 320px the map dialog content/scroll width were 284px and the document was 320px. The Abu Dhabi area-to-model link and guide entry worked; a 2027 circuit request with a legacy seat parameter stayed unsupported. Yas photo UI correctly names Yas Marina and shows no borrowed sources or useless empty venue fallback. Qatar/Bahrain references and mode switching remained available. No page exceptions observed.

Found and fixed south-end overview clipping, long-distance phone fog obscuring the circuit and white-on-white bank hover text. Inspected the complete Yas overview on desktop and phone and the corrected Qatar overview. Camera geometry tests independently project the source line with Three.js into the space reserved for controls. Physical stand accuracy, actual seats/obstructions, bridge geometry, other browser engines and low-end performance remain unverified.

## Seated touch zoom / Jeddah source check · 24 November 2026 UTC

61 existing tests pass. Chromium desktop 1440×1000 and phone 390×844/320×740 checks covered zoom in/out/default on the three geographic scenes, 35/105-degree bounds and disabled buttons, keyboard Enter, wheel-to-button bound synchronization, camera reset and WebGL loss/Retry. The portrait default returned to 90 degrees; desktop started at 70. Opening/closing photo references preserved zoom, bank/row/position labels stayed unchanged, and overview mode removed the seat-zoom toolbar. Code changes only the lens in zoom actions, preserving eye and look coordinates. No page exceptions observed.

At 320px, long bank names previously touched the camera-mode row; responsive heading size now leaves a 20px gap for North Straight. The document remained 320px wide and zoom targets were 44px. Public organizer-linked Jeddah catalogue rendered its 2027 date and six stand names after normal page load. The new race-guide source reference shows all six names and correct source targets; no new Jeddah 3D or live inventory is claimed. Final TypeScript/build check runs in release packaging.

## Melbourne 2027 daylight study · 24 November 2026 UTC

63 tests and TypeScript/production build pass. Added correct-season/default-bank checks, sixteen unique banks, closed lake/island rings and exhaustive road/lake exclusion for all 30,464 new model positions. Existing finite/unique position and overview framing tests include Melbourne. Narrowed/offset estimated American Express and Webber banks after overlap failures; these corrections do not establish surveyed boundaries.

Chromium desktop 1440×1000 and phone 390×844/320×740 checks covered all sixteen bank selections, circuit/stand/seated cameras, complete grid, empty photo references, seated zoom and WebGL loss/Retry. The 320px document and map-dialog scroll widths were 320px and 284px. Qatar, Bahrain and Yas mode-switch/render regression checks passed, with no observed page exceptions. Fixed daytime heading contrast and overview depth interference between the ground, road and lake. No photorealism, actual ticket-chair mapping, real-device performance or other browser-engine validation is claimed.

## Silverstone 2027 release · 24 November 2026 UTC

66 tests pass, including correct-season/default-bank separation, all 26 bank IDs, 48,960 finite/unique selectable positions, exhaustive modeled-road clearance, private-query removal, overview framing and selected-area/year isolation for the new references. Source-envelope assertions now apply only when a bank explicitly claims a source footprint; representative anchored axes still must be unit/perpendicular and face the road. TypeScript/production build passed; final native packaging rebuilds the release.

Chromium 1440×1000, 390×844 and 320×740 checks covered all 26 bank selections, full/stand/seated cameras, map selection, last Landostand section 5/row 16/position 36, zoom and forced WebGL loss/Retry. At 320px the page stayed 320px and map dialog stayed 284px without overflow. Two canvas captures after pause were byte-identical. The race guide exposes Open 3D seating. Copse C media did not load an iframe until requested, then used its own title and youtube-nocookie URL; Unload removed it. Playback availability is controlled by YouTube and is not certified. Becketts/Vale reports keep named source attribution. No page exceptions were observed.

Reviewed Melbourne’s lake/islands and complete phone overview after the shared grass update; Qatar/Bahrain/Yas still rendered correctly. Reviewed the Wing and circuit composition in desktop screenshots. This is an illustrative reconstruction, not a photographic preview or verified ticket layout. Other browsers, low-end devices, real elevations, accessibility and physical sightlines remain unverified.

## Spa partial terrain research · 24 November 2026 UTC

68 tests pass. Two new offline checks cover grid orientation/corners/interpolation, out-of-domain/nodata behavior, partial-artifact rejection, independent licences, all 330 coordinate/height slots and exact correspondence between populated road heights and the cached query coordinates. Python collector compilation passes. The test command now includes all scripts/*.test.mjs so these checks accompany the existing suite. No production renderer or route changed; no app deployment is needed for this research checkpoint.

The public organizer map and a separate OSM-only route drawing were inspected in Chrome. Optional cookies were disabled; no ticket/cart action occurred and no proprietary diagram was copied. The SPW service produced 157 distinct numeric samples before returning 502; one resume also failed at metadata and acquisition stopped. The persisted artifact contains 158 populated road slots including the repeated start, explicit nulls elsewhere and no complete context grid. Do not report a complete terrain crop, finished Spa scene, bank calibration or measured sightlines. The current public app remains the Silverstone release.

## Spa complete offline terrain input · 25 November 2026 UTC

Four terrain research checks now cover exact grid corners and north/south interpolation, every retained partial slot/cache match, partial rejection, explicit out-of-domain/nodata behavior, full 330-point road/425-point grid coverage, independent source licences, datum, local-meter projection, closed height seam and profile review without mutation. Grid-node interpolation is checked within 1mm to allow the stored eight-decimal query-coordinate rounding. A reversed local Z coordinate, missing grid value and missing licence are rejected. The sampled 102.228759m road relief also falls within the independently sourced approximate 102m range; no segment crosses the authored 35% review threshold. Python collector compilation passes. The complete artifact is research-only; application routing, graphics and public release remain unchanged. Full suite results are recorded in MAPPING-PROGRESS.json.

## Spa initial terrain-aware release · 25 November 2026 UTC

74 tests pass. New runtime checks cover meter axes, unknown-domain rejection and flat fallback, exact source road-height/ground agreement, approximately 102m road relief, level bank/eye offsets, correct season/three-bank/8,784-position scope, exhaustive road clearance and height-aware portrait/wide frustum checks. Existing finite/unique position and shared source/privacy checks include Spa. TypeScript/production build passes; release packaging rebuilds the final state. Static JSON uses compact authored forest samples rather than repeating full tree objects in the entry bundle.

Chromium desktop 1440×1000 and phone 390×844/320×740 checks covered all three banks, seated/stand/whole-terrain modes, last Silver 1 section 4/row 16/position 36, map selection, zoom, comparison/revisit, honest empty Spa references and forced graphics loss/Retry. The 320px map dialog stayed 284px without horizontal overflow. Two paused canvas captures were byte-identical. Race-guide 3D entry is present. After a clean reload, no page exceptions occurred. During rapid development reloads a renamed JSON field briefly produced an error; final fresh loads and recovery succeeded. New terrain initializes more slowly than flat scenes in this local Chrome environment; no real-device performance benchmark is claimed.

The initial terrain mesh intersected the road/margin in sampled slopes. Added road-domain ground exclusion, a separated authored margin and matched grass materials; inspected Gold 1, Raidillon and whole-tile views after correction. Reviewed visible forest/terrain context and actual source-height overview framing. Qatar/Bahrain/Yas/Melbourne/Silverstone still loaded and switched overview modes on phone. Their no-terrain coordinate defaults remain unchanged. Venue structures, forests, platform grading, physical sightlines, low-end performance and other browser engines remain unverified.

## Spa Combes expansion · 25 November 2026 UTC

75 tests pass and TypeScript/production build passes. Existing exhaustive checks now cover 13,392 finite/unique Spa positions and road clearance across seven banks. Added distinct Combes-product IDs, exact source-page association and cover-option/roof-limit checks. Height/source/framing/privacy tests remain in the suite. No terrain-service request or renderer geometry change was required.

Chromium 1440×1000, 390×844 and 320×740 checks covered all four new bank selections, matching source links, cover guidance, the organizer-view section in the reference dialog, zero dated attendee references, seven map selectors, last Combes 4 section 2/row 16/position 36, seated zoom and forced graphics loss/Retry. The narrow document stayed 320px and map dialog stayed 284px without overflow. No page exceptions observed. The reference handoff is an external product-page link, not a guarantee of third-party viewer playback. Canopy boundaries, actual chairs/obstructions, geographic survey precision and device performance remain unverified.

## Spa La Source expansion · 25 November 2026 UTC

76 tests and TypeScript/production build pass. Existing exhaustive position, road-clearance, terrain/eye-height and framing checks include all eleven Spa banks and 15,408 positions. Added variant identity/source-route checks, estimated north-La Source region limits and exclusion of any old-pits footprint association. Source fields, counts, canopies and exact-chair status remain explicit.

Chromium 1440×1000, 390×844 and 320×740 checks covered all four new selections/source URLs, the matching official handoff for Gold 7 Bis, last Gold 8 model row 14/position 36, eleven map selectors, seated zoom, pause and forced graphics loss/Retry. Two paused captures were byte-identical. The narrow page/map stayed 320/284px wide; no page exceptions were observed. Bahrain and Silverstone still loaded after the terrain-only margin change. The organizer’s Gold 7 ter location map was visually inspected with its highlighted named group; no diagram artwork or private data was collected. These checks do not verify physical sightlines, canopy geometry, exact seating or upstream virtual-view playback.
