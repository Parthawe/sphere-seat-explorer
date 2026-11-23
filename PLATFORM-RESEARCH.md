# Seat-selection platform research

Inspected 22 November 2026. These are first-party product and technical references, not a claim that every platform or venue offers the same features.

| Reference | Relevant pattern | Applied here |
| --- | --- | --- |
| [Ticketmaster interactive seating chart](https://blog.ticketmaster.com/interactive-seating-chart/) | Quantity filters before seat selection; section-to-seat exploration | Choose 1–4 modeled seats before browsing. Highlight a contiguous group on one side of the model's center aisle. |
| [SeatGeek interactive maps](https://seatgeek.com/blog/understanding-seatgeeks-interactive-seat-maps-features-you-might-be-missing) | Keep section views close to map exploration | Keep saved views visible in the scene and allow immediate return to each position. |
| [3D Digital Venue integration guidance](https://3ddigitalvenue.com/seat-view-technology-for-ticketing-platform-how-it-works-and-what-integration-requires/) | Embed visualization in selection while ticket systems retain inventory authority | Label the view as an estimate, identify the camera seat, and retain the official ticket-information link. |

Linked yaw/pitch controls are our design inference: moving comparison cameras together makes it easier to inspect the same relative direction across saved positions. They are not attributed as an existing feature of these platforms.

## Boundaries

Group adjacency describes this model only. Actual venue numbering and aisle boundaries require official seat-level data. No live inventory, prices, reservations, verified photography or platform integration has been added. A group preview uses its selected anchor seat; it does not combine multiple sightlines into one image. Existing individual-seat links remain compatible.

## Calendar expansion, 22 November 2026

[Formula 1 2026 calendar](https://www.formula1.com/en/racing/2026) and [2027 calendar](https://www.formula1.com/en/racing/2027) supply the checked-in race-weekend snapshots. The revised 2026 list has 23 Grands Prix; 2027 lists 24. Pre-season testing is excluded from Grand Prix counts. Dates and rounds are not inferred from the prior year.

[Sphere Entertainment filing](https://www.sec.gov/Archives/edgar/data/1795250/000162828026007760/sphr-20251231.htm) supplies the exterior width and height. The spherical-cap geometry, artwork and seat-relative placement are reconstruction choices. [Official ticket](https://ticketing.formula1.com/seasons/) and [hospitality](https://ticketing.formula1.com/hospitality/seasons/) selectors and [F1 Experiences](https://f1experiences.com/) supply external catalogue destinations. Ticket-category guidance does not assert current availability at every venue.

## Whole Las Vegas reference coverage

The organizer's [grandstand](https://www.f1lasvegasgp.com/tickets/grandstands/), [general-admission](https://www.f1lasvegasgp.com/tickets/general-admission/) and [hospitality](https://www.f1lasvegasgp.com/tickets/hospitality/) pages supply the 16 location-based product names and viewing focuses. The [current circuit page](https://www.f1lasvegasgp.com/track-layout/) informed the schematic. [2027 deposits](https://www.f1lasvegasgp.com/2027-deposits/) is the organizer's currently promoted next-season destination. No stale prices or sold-out indicators were copied into the app.

[Sphere's venue maps](https://www.thesphere.com/plan-your-visit/maps) provide eight official access/floor-map destinations. Common section ranges were cross-checked against the [venue visualization provider reference](https://sites.3ddigitalvenue.com/3dmap/clients/sphere/level-200/) and public event seating references. All seat-level positions and row/seat counts in the new indoor study are original illustrative parameters, not a transcription of event ticket data. Floor maps were inspected for research and are linked externally, not redistributed.

## Apex Atlas scene references, 23 November 2026

[Sphere XO Stream](https://www.thesphere.com/xo-stream) supplies an official destination for actual current Exosphere programming and its published Google Maps location. Its footage is not copied into the app. The amber face and race ribbons remain original display artwork.

[NASA CGI Moon Kit](https://svs.gsfc.nasa.gov/4720) supplies the bundled 2K lunar color map. It is used as a simulated Sphere display, not presented as footage of a real race-night program.

[OpenStreetMap API](https://api.openstreetmap.org/api/0.6/map?bbox=-115.171,36.116,-115.156,36.126) supplies nearby building outlines and available tags. The extracted database and [ODbL attribution](https://www.openstreetmap.org/copyright) are bundled. The scene uses a rounded geographic Sphere origin, omits course conflicts, and estimates missing heights. This is not a new survey of the venue or certified Google Maps geometry.
