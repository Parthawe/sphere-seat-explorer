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
