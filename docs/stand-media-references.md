# Stand media references

Checked 26 November 2026. This layer connects source media; it does not calibrate our 3D models or copy organizer image assets.

## Suzuka, 2027 catalogue

Nineteen organizer stand pages are matched by their existing area IDs and exact original product URLs. A bounded public HTML metadata pass extracted 193 unique-per-stand YouTube links and 157 non-map original image links. No video, photograph, thumbnail, panorama texture, Google map artwork or chair geometry is downloaded into the application. Source photo captions are retained in Japanese; video camera labels retain the source's position labels. Images and 360° viewers open at the original source. YouTube uses its standard privacy-enhanced player only after a user loads a clip; unloading removes the frame and returns focus.

Representative primary source: https://www.suzukacircuit.jp/f1/ticket/seat_v1.html . This page's first linked video is https://www.youtube.com/watch?v=Gcec92drVKg and its title identifies V1 B-6-3. The organizer's source page provides the remaining camera choices, original map and stills. The 2027 source edition does not establish a media capture date. Source labels do not identify any generated model chair. Current organizer changes include altered protective fences and seat categories: https://www.suzukacircuit.jp/eng/f1/change.html . A2, M and P have still-image references but no linked viewing clips in this collected metadata; no other stand's clip is substituted.

Provenance metadata: `research/stand-media/suzuka-source-metadata.json`; application subset: `src/suzukaStandMedia.json`. The extracted link counts do not certify current playback, image availability or permission to rehost. No bulk playback or video download was attempted. This is a manually maintained reference snapshot, not a live scraper.

## Jeddah, 2027 catalogue with older source footage

The six existing source-only products retain their identities. The 2025 video https://www.youtube.com/watch?v=IcFl-XbcX-o identifies Central Grandstand A in its title. YouTube's public oEmbed metadata identifies its publisher as **Race Experience** (https://www.youtube.com/@raceexperience), a travel operator. It is a publisher-reported 2025 stand reference, not official 2027 imagery, an independent verified review, or a row/seat match. We did not retrieve a reliable publication date. The other five products have explicit missing-video states. No stand-location coordinate is inferred from this clip.

Official venue gallery/map handoff: https://www.jeddahcircuit.com/en/explore-the-circuit . The official event page links the ticket catalogue and confirms the event: https://www.jeddahcircuit.com/en/events/formula-1-stc-saudi-arabian-grand-prix . The ticket catalogue returned HTTP 403 to a normal direct request; no bypass or private selector was attempted. Its current approved product-name evidence remains in the existing Jeddah source record.

The organizer terms, https://www.jeddahcircuit.com/en/terms-and-conditions , restrict copying, framing, commercial reuse and automated content collection without permission. After reviewing those terms, no further organizer media collection was performed. Its gallery/map remains an external link; no JCC image or website frame is embedded or redistributed. Separate organizer image reuse requires the relevant permission. The independent YouTube video uses the provider's standard player and original link, with publisher/date/location limits visible.

## Journeys and limits

The reference hub is available from race guides, circuit diagrams and stand concepts. Catalogue source disclosures link directly to the chosen media option using a `media` query parameter. That selection survives reload; `area` links can preselect an existing Suzuka area. Changing the media stand or source camera unloads the previous player. Map links identify approximate viewing regions, not verified row/seat camera origins. Unknown options and unsupported editions do not inherit a neighboring stand's media.

Loading a YouTube player contacts Google/YouTube; the existing visible privacy link and original-source fallback remain. No source media loads before consent. We do not claim that every historical clip remains embeddable or that a successful iframe request certifies playback. Missing or blocked provider playback can be opened on YouTube.
