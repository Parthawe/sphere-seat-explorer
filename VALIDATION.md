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
