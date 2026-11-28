# Google Maps views

Every race guide has official Google Maps satellite and nearby Street View links using that edition's source-outline center. Links require no API key. They do not establish an entrance, grandstand or seat; Street View may be unavailable near a track.

An optional, click-to-load satellite iframe uses the official Maps Embed API. To enable it, configure `VITE_GOOGLE_MAPS_EMBED_KEY` in the local build environment before building. This is a browser-visible key, not a server secret: restrict its websites to `https://f1tickets.online/*` and the native Site origin, and its API to Maps Embed API. Enable the API in the Google Cloud project and follow Google's billing setup. Do not commit a key or paste it into chat. No key is configured by this implementation.

The iframe is never requested before the visitor chooses “Load satellite map here”. It uses a strict-origin cross-origin referrer policy for domain restrictions. The external links remain available if an iframe fails. Google retains its in-frame attribution and controls. Cross-origin iframe error pages cannot be reliably inspected by our code, so a load event is not considered proof of valid API access.

Google satellite capture dates and seasons are independent of the simulated race lighting. No images or tiles are scraped, downloaded or placed into our Three.js textures. A photorealistic Google 3D Tiles background is a separate integration requiring Map Tiles API access, billing, a georeferenced renderer and visible per-tile attribution; it is not enabled here.

Official references:
- https://developers.google.com/maps/documentation/urls/get-started
- https://developers.google.com/maps/documentation/embed/embedding-map
- https://developers.google.com/maps/documentation/embed/get-api-key
- https://developers.google.com/maps/documentation/tile/create-renderer

# Race light

`raceLighting` reads the checked edition-specific race timestamp and source-outline coordinates, then calculates SunCalc's apparent solar altitude/azimuth. Scene phases are visual presets: daylight above 10°, low-sun/twilight between 10° and −6°, and night below −6°. Above-horizon low-sun starts are labeled “Low sun”, not astronomical dusk. Sun direction uses east/up/south local scene axes. Generic sky and materials are not a weather forecast, live feed or calibrated shade study.

When the source has no start time, the rendering retains a declared day/dusk/night study preset and displays Time TBC. No previous season's timestamp is copied into an unconfirmed event. In particular, the 2026 Bahrain-named race uses its Malaysia venue and timezone, while the 2027 Bahrain study uses Sakhir with no confirmed time.
