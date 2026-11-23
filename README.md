# Apex Atlas · F1 Race & Seat Explorer

An independent, F1-inspired race browser for the published 2026 and 2027 calendars, with a true-3D Las Vegas circuit explorer and illustrative Sphere interior. Browse every listed race, review ticket categories, and open official sources. Las Vegas, Qatar 2026 and Bahrain Sakhir 2027 have illustrative 3D reconstructions; none certify actual seat coordinates. Sphere indoor seating is a separate illustrative venue study.

## Run locally

Requires Node.js 20.19 or newer.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

## Calendar and ticket guides

The default entry opens the 2027 race browser. Both seasons list every Grand Prix in Formula 1’s current published calendar: 23 in the revised 2026 season and 24 in 2027, inspected 22 November 2026. These are checked-in snapshots, not a live feed. Search, upcoming filtering, race detail pages and four ticket-category guides are available. External ticket and hospitality links open verified official season selectors; availability, inclusions and prices remain with providers.

Deep links preserve the season and selected race. Existing `?seat=...` links continue to open the explorer. Browsing 2027 uses the labeled 2026 reference geometry, not a verified 2027 seating plan.

## What works

- A seated opening view, aerial overview, and close grandstand inspection with interruptible camera travel.
- Nine modeled outdoor seating banks, a complete all-position seating overview, numbered full grids, magnification, bounded row/seat inputs, and keyboard navigation.
- Orbit controls in overview and grandstand mode; drag-to-look and bounded field-of-view zoom from a seat.
- Actual scene geometry for tiers, track, fencing, barriers, support posts, buildings, and Sphere.
- Three-position comparison with linked horizontal/vertical camera angles and reset.
- Modeled groups of 1–4 seats, kept within one seating bank, with group-aware share links.
- A persistent shortlist tray and docked primary actions on desktop and mobile.
- F1 red, black and white interface, with an adaptive mobile bottom sheet, front/middle/high row shortcuts, and an enlarged keyboard-accessible seat map.
- Detailed molded chairs with numbered back plates, armrests, mounting plates, half-step aisles and illuminated stair edges.
- Steel scaffolding with material reflections, continuous fencing, lighting cabinets, service pavilions, corner boards, safety-tire stacks, an illustrative venue screen, original LED Sphere artwork and restrained bloom.
- A close grandstand camera for inspecting the selected seating area.
- Optional illustrative open-wheel car demonstration with play/pause controls.
- Browser-local shortlists, shareable URLs, and back/forward navigation.
- Responsive mobile controls, reduced-motion camera changes, source details, and 2D fallback after WebGL loss.

## Whole Las Vegas explorer

The atlas lists 16 viewing products from the organizer's current reference pages: five grandstand products, two general-admission areas and nine hospitality products. The map is schematic. Each product links to its official category page; guide-only areas never receive invented seat numbers. The 2027 deposit page remains the current organizer destination.

The outdoor scene contains 6,444 modeled positions across nine illustrative banks, including start/finish, Turn 17 and Turns 3–4. These counts describe the app, not complete official grandstand inventories. Full-circuit mode, the location inset and all-bank grid provide navigation into the scene.

Inside Sphere is a separate cutaway 3D study with four levels, 39 section references and 16,220 selectable model markers. It includes a selected-section grid and level/section/row/seat controls. Those rows, counts, elevations and screen geometry are illustrative and do not certify a view or identify an actual ticket. Eight links lead to Sphere's official floor/access maps. Show layouts and actual numbering must be checked against the event-specific ticket map.

## Model accuracy

This is a **2026 historical reference reconstruction**, not a certified digital twin, photographic seat preview, or live ticketing system. The organizer's 2026 diagram informs the track and approximate grandstand placement. Seat-level measurements and most venue dimensions were unavailable. The Sphere shell now uses the published 516 ft width and 366 ft height as a spherical cap cut at ground level. Its selectable artwork includes a NASA lunar map, an original amber face and original race ribbons. This calibrates the exterior envelope only, not its placement relative to individual seats.

A–E, M, H, K and F are app-specific modeled bank labels, not official section identifiers. Row counts, seat numbers, spacing, elevations, fences, buildings, and obstructions are estimated reconstruction parameters. Eye height is computed within the model. Choosing a position does not reserve a ticket or establish that a corresponding ticket exists.

The original Singapore video is an interaction reference only. Its footage and assets are not redistributed. The procedural scene and UI artwork are original. NASA lunar imagery, OpenStreetMap-derived footprints and Poly Haven asphalt maps retain the separate credits and license notices described below. No Formula 1, Sphere, or ticketing-partner affiliation is implied. The generic spectator silhouettes are illustrative artwork, not a representation of an actual event attendance.

## Research sources

Inspected 22 November 2026:

- [Official 2026 T-Mobile Grandstands diagram](https://www.f1lasvegasgp.com/app/uploads/2026/03/TMOGRANDSTAND-1.png): track shape and approximate stand placement. Used as research, not bundled as an asset.
- [Official T-Mobile Grandstands](https://www.f1lasvegasgp.com/tickets/grandstands/t-mobile-grandstands/): zone location, assigned seating, and organizer reference material.
- [2026 F1 calendar](https://www.formula1.com/en/racing/2026) and [2027 F1 calendar](https://www.formula1.com/en/racing/2027): current published race weekends.
- [Sphere Entertainment filing](https://www.sec.gov/Archives/edgar/data/1795250/000162828026007760/sphr-20251231.htm): exterior dimensions.
- [Official circuit layout](https://www.f1lasvegasgp.com/track-layout/): circuit orientation and corner sequence.

Live organizer pages can change to newer editions. The model is not automatically updated. No live availability or pricing is displayed.

See [platform research](PLATFORM-RESEARCH.md) for the current ticketing and venue-view references behind the group-planning and comparison changes.

- [Organizer grandstands](https://www.f1lasvegasgp.com/tickets/grandstands/), [general admission](https://www.f1lasvegasgp.com/tickets/general-admission/) and [hospitality](https://www.f1lasvegasgp.com/tickets/hospitality/): listed viewing products and viewing focuses.
- [Sphere official venue maps](https://www.thesphere.com/plan-your-visit/maps): floor/level access references. [Venue visualization reference](https://sites.3ddigitalvenue.com/3dmap/clients/sphere/level-200/): common section ranges; event-specific configurations can differ.

## Architecture

React 19, TypeScript, Vite, Three.js, and React Three Fiber. Venue and selection data live in `src/model.ts`; scene construction in `src/World.tsx` and camera controls in `src/Scene.tsx`; UI and URL/history state in `src/App.tsx`. The 3D bundle loads separately from the controls and 2D map. Original scene geometry is generated locally. Scanned CC0 asphalt maps by Dimitrios Savva / Poly Haven are bundled under public/materials with credits, so the app has no runtime asset-service dependency.

The URL carries the season, race, seat, view mode, and optional three-position comparison. `localStorage` holds only the shortlist. No account, analytics, or payment integrations are included. Hosting services process requests under their own policies.

Fonts are bundled from the `@fontsource` Barlow Condensed and IBM Plex Sans packages, which include their license files. The standalone app code is MIT-licensed; see LICENSE. Do not assume upstream trademarks or third-party materials inherit that license.

## Publishing

The project is configured as a static Site in `.openai/hosting.json`. Run the production build before packaging `dist/`. Source is mirrored to a dedicated public GitHub repository. The Sites remote is managed separately by the Sites publishing workflow; no publishing credentials belong in this repository.

## Apex Atlas rendering revision

The user selected Apex Atlas as the product name. The interface, original A mark, favicon and page titles use it; the existing neutral hosting URL and repository remain unchanged.

Five detailed illustrative open-wheel cars start near the selected modeled bank, follow the circuit and remain visible when paused. Racing starts automatically unless reduced motion is requested. Scene settings separately control light shafts/airborne motes and choose a simulated lunar, amber-face or racing-ribbon Exosphere display. The lunar surface is NASA's bundled CGI Moon Kit texture; the other displays are original artwork. The official Sphere XO Stream and Google Maps location open externally.

Nearby context uses 126 downloaded OpenStreetMap building outlines. The renderer omits centerline conflicts with the schematic course and uses source height tags, source storey counts or explicit estimated heights. This improves context without certifying the course's geographic alignment. Night-window shaders, shadow-casting selected-bank lighting, PBR road response and bloom complement existing shadows and material maps. Low-end-device performance and exact real-world sightlines remain unverified.

OpenStreetMap derived data is supplied under ODbL in `public/geo/buildings.json`, with source and license notices in `public/geo/CREDITS.txt`. NASA texture credits are in `public/materials/CREDITS.txt`. These data/asset notices are separate from the app code's MIT license.


### Qatar 2026 ticket product

The root now opens a Qatar ticket desk for the next remaining 2026 race. Locate an existing ticket’s **viewing area**, compare up to three areas and continue to verified event pages or organizer-listed sellers. Main Grandstand has assigned seating; the other supported areas are unassigned. Exact row/chair coordinates are unavailable.

`npm run collect:tickets` refreshes allowlisted public metadata into `public/data/ticket-sources.json`. Review the snapshot and run `npm test` / `npm run build` before deployment. Reference prices are not live offers. No ticket text is uploaded, stored or shared; only public comparison area IDs persist locally. There is no account, booking or checkout service. The existing two-hour development automation continues the venue programme; it is not a hosted live inventory feed.


### Abu Dhabi 2026 area locator

Open `?season=2026&race=united-arab-emirates`. Seven standard grandstands have product-specific organizer links, a geographic circuit drawing and approximate area callouts. Four markers use named OSM stand buildings; three indicate inferred track regions. North Straight and West Straight remain distinct from North and West. The local parser supports section/row/seat text without mapping an exact chair, rejects unsupported variants and shares only public area IDs. Reference geography is downloadable under ODbL at `/data/yas-track.json`. No seat-level 3D, live prices or inventory are implemented for this circuit.


### Shared venue registry and comparisons

`src/venueRegistry.ts` holds the Qatar and Abu Dhabi event/year associations, geometry references, source dates, area confidence, map configuration and explicit coverage limits. Both desks use `CircuitAreaMap`, `AreaComparison` and `useAreaComparison`. Qatar’s legacy `apex-qatar-2026-areas` key is preserved; Abu Dhabi uses a separate key. Only valid public area IDs persist, up to three. Clear removes the race’s key. Blocked storage keeps the comparison in the current tab and displays a notice. The registry does not supply a 2027 ticket layout from a 2026 reference.


### Singapore 2027 area pilot

Open `?season=2027&race=singapore`. Twelve current organizer-listed grandstands have estimated track-region callouts, source-linked zone access, private ticket matching and three-area comparison. Product handoffs open the organizer’s actual page containing its 180° View control. Singapore 2026 and variant products are not resolved by this pilot. No exact seats, Singapore 3D, current prices or stock are claimed. Adapted OSM relation 421263 data is downloadable under ODbL at `/data/singapore-track.json`.


### Historical Las Vegas replay

The seat explorer's **Historical race** control loads a bundled 129-second opening-field clip from the 2024 Las Vegas race (OpenF1 session 9644). All 20 drivers use recorded XY locations and sampled speeds. The full-circuit tracker displays those XY positions. The 3D model uses landmark correspondence to project each observation onto its estimated centerline, so lateral lines, overtakes, exact seat visibility and crossing locations are not verified. Gaps shown are differences between estimated centerline crossings, not official timing gaps. The archive is independent of the selected planning season.

Visitors can pause, scrub, choose 0.25–4× playback, follow a driver, jump to the next estimated section pass, and minimize the panel while watching from their seat. Playback starts paused and stops at the clip end or when the tab is hidden. Missing observations are hidden rather than extended. A failed archive request offers Retry.

Source: https://openf1.org/docs/ (location and car_data endpoints). All bounded query URLs and collection time are retained in `public/historical/las-vegas-2024-opening.json`. Refresh deliberately with `npx tsx scripts/collect-vegas-replay.ts`. Visitors make no calls to OpenF1. `history=2024` opens the archive directly on a seat-explorer URL.


## Qatar and Bahrain 3D seating studies

Open `?season=2026&race=qatar&screen=circuit` or `?season=2027&race=bahrain&screen=circuit`. The separate renderer uses each circuit's own OSM track and available footprints, instanced chairs, tier geometry, canopy cutaways, estimated pit buildings, track fencing, lights and simulated cars. Every generated position can be selected through the complete model grid, keyboard or numeric controls. Compare up to three positions and share public model coordinates.

The Qatar model has four chair banks plus lawn samples; Bahrain has eight banks representing five organizer products. Model counts and row/section labels are illustrative, not organizer seat inventories. Qatar free-seating rules remain explicit. Unsupported years do not inherit these models. Source/licence records and limits are in CIRCUIT-SEATING-SOURCES.md. Refresh public geography with `python3 scripts/collect-circuit-geometry.py` and review the changes before publishing.


## Spectator photos and fan reports

Use **Photos & fan reports** in the Qatar/Bahrain 3D studies or Las Vegas seat explorer. Filter by selected area versus venue, reference year and photo sources versus reviews. The structured source notes in `src/photoReferences.ts` retain author, publisher, physical venue, source-reported location, date evidence and uncertainty. This is a checked collection, not a live scraper.

Supported Reddit photo embeds and a linked attendee video load only on request; other photographs open on the publisher's site. Provider blocks retain original-source links. No photo files or scraped review bodies are redistributed. Actual seat codes are not translated to modeled rows. Empty locations stay explicit; see PHOTO-REFERENCES.md for source evidence, exclusions and verification.
