# Release validation

Validated locally in Chromium on 22 November 2026.

- TypeScript compilation and four model tests pass: input bounds, malformed selections, URL round trips, comparison deduplication/limit, and camera coordinate changes.
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
