# Apex Atlas

## Platform

web

## Product and users

The user requested an F1 ticket and seat-planning website, beginning with the Las Vegas Sphere zone and expanding to the 2026 and 2027 races. The primary task is to choose a race and understand viewing options before visiting ticket providers.

## Capabilities and constraints

The Las Vegas atlas lists the current organizer viewing products. Its outdoor scene has nine modeled banks; the separate indoor Sphere study has four seating levels with illustrative seat markers. Both support modeled seats, groups, camera modes, full seating grids, comparison and share links. Every published race in the two checked calendars has a race guide and ticket-category guidance. Other circuits do not have seat-level 3D models. There is no live ticket inventory, reservation, account or checkout integration. Qatar 2026 has dated published reference prices collected from official product pages; these are not current offers or verified availability.

Calendar data is a dated official-source snapshot. Venue placements, rows, seat numbers and obstructions are estimates. The Sphere's exterior envelope uses published dimensions. A 2027 visit to the explorer uses the clearly labeled 2026 reference model.

## Brand commitments

The user explicitly requested F1 colors and design language, Las Vegas context, true 3D and a premium, detailed experience. Apex Atlas is independent and does not imply Formula 1 affiliation.

## Evidence

The original Singapore video supplied the interaction reference. Official Formula 1 calendars, organizer diagrams and the Sphere Entertainment filing are linked in README.md and the interface. The preview image is captured from the app's own renderer. Venue-certified seat coordinates, verified photos and other race models are not available.

## Coverage

The user requested all seats around Sphere and Las Vegas. The implementation exposes every modeled position, the organizer's listed viewing products and Sphere's official floor/access map links. Complete official seat inventories and event-specific indoor layouts are not available; the UI states that boundary.

## Approved identity and scene behavior

The user selected Apex Atlas on 23 November 2026. They requested moving race cars, light rays, richer shaders, shadows/highlights and real-world reference context. The implementation uses procedural cars and atmospheric effects, three simulated Sphere display options, NASA lunar imagery, OpenStreetMap building outlines and links to Sphere's official live exterior stream and actual Google Maps location. It does not imply licensed official F1 car models, live race telemetry or verified venue geometry.


## Ticket product pilot · 23 November 2026

The default entry prioritizes Qatar 2026, the next remaining weekend on the checked calendar. It connects five viewing areas, nine ticket providers, a three-area comparison and a local text locator for an owned ticket. Pasted ticket text is never persisted or transmitted; shared links contain only the public race, year and area ID. Saved comparisons persist public IDs only. The parser recognizes ambiguous, unsupported and wrong-event input, and never infers an exact row or chair location. Hospitality is explicitly unsupported.

Only Main Grandstand has assigned seats in Lusail’s current guidance. North, T2 and T16 use free seating; Lusail Hill is general admission. The circuit line is adapted OSM data (ODbL); area markers are schematic callouts based on organizer descriptions, not stand boundaries, entrances or photographic sightlines. No 2026 ticket information is shown as a 2027 offer.

An allowlisted CLI collector reads public source metadata and exact organizer product price blocks. It respects robots rules, stops on access errors and excludes unrelated recommended-event prices. The deployed JSON is a dated snapshot, not a live feed. The F1 store blocked automated reading; its direct event links remain usable without inferred prices or availability. Seller listing is based on the organizer’s FAQ, not an independent authorization certification. No checkout, paid placement or affiliate tracking is implemented.

Abu Dhabi 2026 has checked direct organizer/F1 ticket links and delivery guidance, with no area locator yet. It is the next mapping priority before returning to the wider venue programme.
