# Apex Atlas

## Platform

web

## Product and users

The user requested an F1 ticket and seat-planning website, beginning with the Las Vegas Sphere zone and expanding to the 2026 and 2027 races. The primary task is to choose a race and understand viewing options before visiting ticket providers.

## Capabilities and constraints

The Las Vegas atlas lists the current organizer viewing products. Its outdoor scene has nine modeled banks; the separate indoor Sphere study has four seating levels with illustrative seat markers. Both support modeled seats, groups, camera modes, full seating grids, comparison and share links. Every published race in the two checked calendars has a race guide and ticket-category guidance. Qatar and Yas Marina 2026, plus Bahrain Sakhir, Melbourne and Silverstone 2027, also have illustrative 3D seating studies; actual ticket-seat coordinates remain unavailable. There is no live ticket inventory, reservation, account or checkout integration. Qatar 2026 has dated published reference prices collected from official product pages; these are not current offers or verified availability.

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

Abu Dhabi 2026 now has seven source-linked standard grandstand areas and a local ticket-area locator. Four broad locations use named OSM building anchors; North Straight, West Straight and South use explicitly estimated regions. The parser keeps the straight products distinct from their similarly named grandstands, rejects unsupported club/suite/Hill/hospitality/concert variants and keeps raw text in local component state. Public share links contain only year, race and area. Exact rows/chairs, 3D, measured obstructions, live inventory and prices remain unavailable. Both pilots now use a shared venue registry, SVG map renderer and three-area comparison. The registry keys coverage by event and season, preserving geometry, area confidence and source dates. Abu Dhabi comparison shows seating, track focus and location evidence without a price column. Qatar retains its existing saved area IDs and dated 3-day reference prices. Comparison storage is isolated by race/year, sanitizes unsupported values and falls back to tab-only state when device storage is blocked. Shared links remove unrelated query and fragment data. Singapore now has a sourced 2027 twelve-area pilot; other seasons and products remain explicit gaps.


## Singapore 2027 pilot · 23 November 2026

Twelve current organizer-listed standard grandstands are supported: Pit, Turn 1, Turn 2, Republic, Padang, Connaught, Marina Bay, Bayfront, Promenade, Raffles, Empress and Stamford. The official 2027 catalogue and F1 event dates identify 8–10 October 2027 at Marina Bay. Current OSM street geometry supplies the circuit line; all twelve marker regions are estimates from product descriptions. Final event boundaries, exact chairs and Singapore seat-level 3D are unavailable. The 2026 race guide remains separate and does not inherit this pilot.

The private parser keeps unsupported Super Pit, Pit Exit, Chicane, combination, walkabout and accessible-platform variants from falling through to a standard stand. Comparison includes published zone access and uses the Singapore 2027 key. The primary handoff opens the organizer’s product page, where its 180° View control provides a reference preview. Photographs and map artwork are not bundled. Singapore prices and stock are not inferred. Next: source Super Pit, Pit Exit and Chicane as separate products. Representative 3D remains needs_assets; see SINGAPORE-SOURCES.md.


## Qatar/Bahrain 3D seating · user-requested expansion

Qatar 2026 and Bahrain Sakhir 2027 now have distinct 3D reconstructions using their own geographic circuit lines and available OSM stand footprints. Every generated position is selectable via bank, model section, row and position controls; these labels are separate from real ticket IDs. Users can switch circuit/stand/seated cameras, inspect roof cutaways, play/pause simulated passing cars, compare three model positions and share a position link. Mobile has precise inputs in its complete-grid dialog; a WebGL failure retains the grid and Retry.

Qatar includes Main, North, T2, T16 and sampled Hill viewpoints, with assigned/free/GA distinctions. Bahrain includes Main, Turn 1, Beyon/Batelco, three University and two Victory banks. Physical chair inventory, sections, shade, elevations, obstructions and actual row views remain unverified. Models do not inherit across seasons or replace the private ticket-area parser. See CIRCUIT-SEATING-SOURCES.md.


## Photo references and attendee reports

The 3D studies now include source-linked spectator references with location scope, reference year and photo/report filters. A source-reported grandstand or section is distinct from an exact match to the model. Qatar T16, Bahrain Beyon and Vegas Main currently have explicit reference gaps; venue-wide context appears only when selected. Historical photos keep their own years, including older 2024 references.

Supported media loads on demand with attribution and provider privacy links. Other photographs stay on their original publishers' sites. No photo files, copied review bodies, verified-attendance claims or aggregate ratings are added. Reviews summarize reported experiences and disagreements, not current event policy. The collection is curated public research rather than a live Internet feed. See PHOTO-REFERENCES.md.

## Circuit orientation and overview

Qatar/Bahrain now offer a north-up full-circuit map with numbered bank selectors, source footprints, estimated-region outlines and an illustrative view-direction fan. Choosing a bank updates the existing 3D selection; the map remains available if 3D fails. Opening it pauses simulated cars. Permanent bank envelopes follow their OSM source axes and the Sakhir Tower follows its own footprint. Facing and all seat-level geometry remain inferred.

## Singapore variants and hourly scene work

Singapore 2027 now includes fifteen distinct grandstand products: twelve standard products plus Super Pit, Pit Exit and Chicane @ Turn 2. The parser preserves variant identity, ambiguity and unsupported combination products. Super Pit shares the Pit map anchor with a clear upper-row explanation. All three have their own organizer links, zone access and race-scoped comparison. These are broad area matches; Singapore seat-level 3D is still unavailable.

The existing mapping automation now runs hourly at the user's request. Prioritize existing 3D scene quality and stability, then sourced new venue coverage; retain truthful estimates and preserve each working scene.

## Shared racing-car detail

Qatar and Bahrain now show the detailed authored open-wheel cars already used by Vegas, including halo, wings, suspension, wheel hubs and rear lighting. Wheels rotate only during simulated playback. The shared visual component keeps motion separate, preserving the Vegas 2024 archive and the Qatar/Bahrain simulation distinction. These are representative car shapes, not season-certified specifications.

## Abu Dhabi 2026 representative 3D

All seven existing Yas grandstand products now link into their own geographic 3D study: Main, North, North Straight, West Straight, West, Marina and South. It includes 19,840 generated positions, full-circuit/stand/seated cameras, map, complete model grid, roof cutaway, simulated passing cars, comparison and sanitized sharing. These are representative positions, not official ticket IDs. The 2026 four-day product begins 3 December; the F1 racing weekend is 4–6 December. There is no inherited 2027 model.

Five named OSM stand polygons provide context. Curved North/West and the two Straight products use explicitly estimated banks; Main/Marina/South use fitted envelopes. Surrounding water, hotel architecture, bridge elevation and real obstructions remain unmodeled. The reference browser shows an honest empty collection for Yas.

## Seated zoom and Saudi source reference

Qatar, Bahrain and Abu Dhabi now support visible touch/keyboard zoom controls beside the 3D seat view. Closer, wider and default zoom keep the modeled position fixed; limits and unavailable states disable the relevant buttons. Camera reset, viewport/position changes and WebGL Retry restore the default lens.

Saudi Arabia's 2027 guide now lists six organizer-linked grandstand names and links the current JCC event and ticket catalogue. Venue/date/product identities are checked; stand locations, row mapping and a Jeddah 3D scene remain unsupported pending spatial verification. No prices or live availability are shown.

Silverstone 2027 now includes 26 representative banks and 48,960 illustrative positions, a footprint-based Wing context model, one travel-publisher Copse C video and two attributed 2025 attendee reports. Standard/Prime View boundaries and actual ticket IDs remain unsupported. Melbourne and Silverstone share authored daylight grass materials; all other scene behaviors remain separate.

Spa 2027 now has an initial three-bank terrain-aware study (Gold 1, Moët & Chandon/ex Gold 3 and Silver 1), with 8,784 illustrative positions. The road and cars follow a separately sourced elevation profile; context terrain uses sparse SPW samples with authored margins/platforms and forest context. Other Spa banks, canopies, accessible platforms and actual seat matching remain unfinished. The app never queries the terrain service at runtime. All existing circuit studies retain their flat default.

Spa’s 2027 study now covers seven banks, adding distinct Combes 1–4 to Gold 1, Moët & Chandon/ex Gold 3 and Silver 1. It exposes 13,392 illustrative positions. Combes 2’s covered/uncovered choices remain one bank with unknown row boundaries. The photo-reference dialog offers matching organizer virtual-view pages without inventing capture years, embedding imagery or counting them as attendee photos. Other Spa products and exact seats remain unfinished.

Spa’s study now includes distinct Gold 7, Gold 7 Bis, Gold 7 ter and Gold 8 regions, bringing coverage to eleven banks and 15,408 illustrative positions. Current organizer product-map groups establish the broad La Source identities; all bank coordinates remain estimates. Matching virtual-view page handoffs and cover caveats accompany them. The similarly named old-pits OSM Endurance footprint is not used for Gold 7 ter.

Spa now supports fifteen banks and 17,424 illustrative positions, including distinct Gold 9/9 Bis and Gold 11/6 regions. Gold 6 Bis has a visible official-information handoff with its map gap explained, without a borrowed view. Active-bank chair rendering survives geometry changes. Other current Spa products, actual ticket-chair matching, canopy geometry and dated attendee-photo coverage remain incomplete.
