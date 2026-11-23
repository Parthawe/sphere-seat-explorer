# Viewpoint · Sphere Seat Explorer

An independent, F1-inspired Las Vegas Grand Prix seat explorer around Sphere. Choose a modeled grandstand position, enter a seated-eye-level view, compare up to three positions, and share the selection.

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

## What works

- Aerial overview, grandstand inspection, and seated camera modes.
- Five modeled grandstand positions, interactive seating grids, bounded row/seat inputs, and adjacent-seat keyboard navigation.
- Orbit controls in overview and grandstand mode; drag-to-look and bounded field-of-view zoom from a seat.
- Actual scene geometry for tiers, track, fencing, barriers, support posts, buildings, and Sphere.
- Three-position comparison with consistent seated camera settings.
- F1 red, black and white interface, with an adaptive mobile bottom sheet and front/middle/high row shortcuts.
- Detailed molded chairs with numbered back plates, armrests, mounting plates, half-step aisles and illuminated stair edges.
- Steel scaffolding with material reflections, continuous fencing, lighting cabinets, service pavilions, corner boards, safety-tire stacks, an illustrative venue screen, original LED Sphere artwork and restrained bloom.
- A close grandstand camera for inspecting the selected seating area.
- Optional illustrative open-wheel car demonstration with play/pause controls.
- Browser-local shortlists, shareable URLs, and back/forward navigation.
- Responsive mobile controls, reduced-motion camera changes, source details, and 2D fallback after WebGL loss.

## Model accuracy

This is a **2026 historical reference reconstruction**, not a certified digital twin, photographic seat preview, or live ticketing system. The organizer's 2026 diagram informs the track and approximate grandstand placement. Exact dimensions and seat-level measurements were unavailable.

A–E are app-specific modeled position labels, not official section identifiers. Row counts, seat numbers, spacing, elevations, fences, buildings, and obstructions are estimated reconstruction parameters. Eye height is computed within the model. Choosing a position does not reserve a ticket or establish that a corresponding ticket exists.

The original Singapore video is an interaction reference only. Its footage and assets are not redistributed. Sphere artwork, geometry, maps, and UI artwork in this repository are original procedural work. No Formula 1, Sphere, or ticketing-partner affiliation is implied.

## Research sources

Inspected 22 November 2026:

- [Official 2026 T-Mobile Grandstands diagram](https://www.f1lasvegasgp.com/app/uploads/2026/03/TMOGRANDSTAND-1.png): track shape and approximate stand placement. Used as research, not bundled as an asset.
- [Official T-Mobile Grandstands](https://www.f1lasvegasgp.com/tickets/grandstands/t-mobile-grandstands/): zone location, assigned seating, and organizer reference material.
- [Official circuit layout](https://www.f1lasvegasgp.com/track-layout/): circuit orientation and corner sequence.

Live organizer pages can change to newer editions. The model is not automatically updated. No live availability or pricing is displayed.

## Architecture

React 19, TypeScript, Vite, Three.js, and React Three Fiber. Venue and selection data live in `src/model.ts`; scene construction in `src/World.tsx` and camera controls in `src/Scene.tsx`; UI and URL/history state in `src/App.tsx`. The 3D bundle loads separately from the controls and 2D map. All scene assets are generated locally, with no runtime asset-service dependency.

The URL carries the seat, view mode, and optional three-position comparison. `localStorage` holds only the shortlist. No account, analytics, or payment integrations are included. Hosting services process requests under their own policies.

Fonts are bundled from the `@fontsource` Barlow Condensed and IBM Plex Sans packages, which include their license files. The standalone app code is MIT-licensed; see LICENSE. Do not assume upstream trademarks or third-party materials inherit that license.

## Publishing

The project is configured as a static Site in `.openai/hosting.json`. Run the production build before packaging `dist/`. Source is mirrored to a dedicated public GitHub repository. The Sites remote is managed separately by the Sites publishing workflow; no publishing credentials belong in this repository.
