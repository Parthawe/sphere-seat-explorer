# Earth journey

The landing page’s World view connects the selected season’s races to their physical locations, then opens the existing circuit study. Circuit view retains the prior live circuit preview. This extension preserves F1 Tickets Online’s paper, ink, red and typography; the dark space scene belongs to the globe viewport.

## Journey and controls

Choose a race with the native selector or a visible globe pin. Nearby screen-space pins group into a race list. The destination retains its race, venue, season and dates. Drag to rotate; use the camera buttons to zoom or reset. The focused globe also accepts plus/minus and Home. Rotation has a pause/resume control.

“Fly to circuit” aligns the camera with the venue and approaches Earth radially over 3.8 seconds. A labeled destination preview appears near arrival before the selected edition’s existing renderer opens. Cancel returns to the globe and restores focus to the flight button; Escape also cancels. Skip opens the destination immediately. Reduced motion uses direct entry and stops automatic rotation. Nearby-list dismissal restores focus to its marker.

The renderer is lazy-loaded and suspends offscreen or in a hidden tab. Loading exposes a direct circuit link. Module, shader or graphics-context failure exposes retry and direct entry. The existing circuit destination owns its own loading and recovery behavior.

## Imagery and location evidence

The globe uses a local 2048-pixel-wide JPEG, approximately 369 KB, resized from NASA Earth Observatory’s **Blue Marble: Next Generation, July 2004**, credited to Reto Stöckli / NASA Goddard Space Flight Center. This is a dated global image, not current satellite coverage. Sources and attribution are available in the viewport’s Map sources disclosure and [asset credits](../public/earth/CREDITS.txt).

Twenty-seven venue references cover the 47 listed 2026/2027 editions. Coordinates are bounding-box centers from Tomislav Bacinger’s MIT-licensed [f1-circuits source](https://github.com/bacinger/f1-circuits/tree/fda4a2f74728fa033c81ba8d3b628966a4a095d2), pinned to commit `fda4a2f74728fa033c81ba8d3b628966a4a095d2`. Each location retains its source URL in `src/circuitLocations.json`. These points locate source outlines; they do not establish entrances, parking, official event boundaries or ticket seats.

Edition identity follows the existing circuit mapping. The 2026 Bahrain-labeled entry points to Sepang in Malaysia; 2027 Sakhir is separate. The 2027 Las Vegas destination still opens the explicitly dated 2026 reference model. Geography does not silently correct or merge those source identities.

## Coverage boundary

The camera journey uses a textured sphere and then hands off to an illustrative circuit renderer. It adds no Google tiles, street-level terrain, paid map service, API key or seat coordinates. Detailed models, generic circuit studies and reference editions keep their existing coverage and uncertainty labels. The transition does not certify a physical sightline or create continuous globe-to-seat terrain.

## Verification record

The implementation was reviewed through supplied desktop, mobile and regional screenshots. Browser checks covered 1440, 820, 390 and 320-pixel widths, reduced motion, camera controls, cancel/focus recovery, a complete Qatar flight, a skipped Malaysia entry with its preserved identity and graphics-context recovery. These checks establish the exercised flows and layouts. They do not measure physical-device frame rate or prove animation smoothness from still images.

This document records the implemented extension; publication and release identifiers are tracked separately.

The final browser audit also exercises grouped-pin focus/Escape return, direct Las Vegas full-circuit handoff, a failed Earth image request followed by a fresh Retry, and preserved destination after context loss. Retry clears the failed texture-loader entry before remounting. The destination modules preload during explicit flights; no measured timing improvement is claimed. The bounded layout review passed without material findings; subsequent route and recovery refinements preserved that verdict. Mechanical design detection over the new UI files returned no findings.

## Release

Published v127 from source 8dc1877baa873e3aa560036dd4ccb9321b3ff819, pushed to GitHub main. Saved version appgprj_6b03a10b6c388191a92912a1c2dfe070~appgver_44c7687b42b88191915b7b93fa66eec5; deployment appgdep_6b0a069de4988191a06e7fab28231cc1 succeeded at 2026-11-27T22:39:30.367311+00:00. Final source checks passed 233 tests and production build. Existing optional shader chunk-size warning remains. No dependencies or external map account were added. Archive f1tickets-earth-journey-deployment.tar.gz is outside the repository. Native publication is confirmed; custom-domain freshness was not independently verified. Owned local preview stopped after checks.

## Typography and controls refinement · 27 November 2026

Unified the interface on IBM Plex Sans 400/500, including the discovery pages, standings, diagram labels and seating studies. Removed the three condensed-font stylesheet imports, replaced existing font declarations with the shared font token and reduced heading sizes where the wider family needed room. No new font or dependency was added.

The globe now groups recenter, zoom, map-grid and rotation controls in one rail. Latitude/longitude lines are a geographic overlay, initially off. The selected venue shows sourced outline-center coordinates, its date range and whether the destination is a seating study, dated Vegas reference or circuit outline. Markers are culled above the measured information block so the added detail stays readable.

Browser verification passed the 47 edition routes at 390px, the existing position-control audit at 1440/390/320 and the Earth journey audit at 1440/820/390/320, including full flight, cancellation/focus, reduced motion, graphics recovery, image-failure retry, grouped pin focus and direct Vegas handoff. A separate rendered check confirmed the same computed font family on visible headings/buttons/selects in discovery, Bahrain seating, Suzuka outline, Race Centre and Vegas. Grid toggle/pressed state and page overflow checks passed. Desktop/phone screenshots were inspected. Mechanical design detection returned no findings. This is browser-viewport verification, not physical-device performance measurement.

Typography/control release v128: source c8e55d4e0776e85f3eb2093254255b11d2af37be, pushed to GitHub main. Saved version appgprj_6b03a10b6c388191a92912a1c2dfe070~appgver_d498aab509408191b15ff9c3657cb14c; deployment appgdep_6b0a08843cd08191ac0f67d4460c3db5 succeeded at 2026-11-27T22:47:36.708742+00:00. Final source checks passed 233 tests and production build. Existing optional shader chunk-size warning remains. The archive is outside the repository. Native publication confirmed; custom-domain freshness was not independently checked. Owned preview stopped.
