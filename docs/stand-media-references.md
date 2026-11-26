# Stand media references

Checked 26 November 2026. This layer connects source media; it does not calibrate our 3D models or copy organizer image assets.

## Suzuka, 2027 catalogue

Nineteen organizer stand pages are matched by their existing area IDs and exact original product URLs. A bounded public HTML metadata pass extracted 193 unique-per-stand YouTube links and 157 non-map original image links. No video, photograph, thumbnail, panorama texture, Google map artwork or chair geometry is downloaded into the application. Source photo captions are retained in Japanese; video camera labels retain the source's position labels. Suzuka still images now render directly from their original host after the user enables the connection. They are not copied into our deployment or proxied. The organizer’s 360° viewers remain external source links. YouTube uses its standard privacy-enhanced player only after a user loads a clip; unloading removes the frame and returns focus.

Representative primary source: https://www.suzukacircuit.jp/f1/ticket/seat_v1.html . This page's first linked video is https://www.youtube.com/watch?v=Gcec92drVKg and its title identifies V1 B-6-3. The organizer's source page provides the remaining camera choices, original map and stills. The 2027 source edition does not establish a media capture date. Source labels do not identify any generated model chair. Current organizer changes include altered protective fences and seat categories: https://www.suzukacircuit.jp/eng/f1/change.html . A2, M and P have still-image references but no linked viewing clips in this collected metadata; no other stand's clip is substituted.

Provenance metadata: `research/stand-media/suzuka-source-metadata.json`; application subset: `src/suzukaStandMedia.json`. The extracted link counts do not certify current playback, image availability or permission to rehost. Inline display does not establish permission to download, redistribute or rehost these photographs. No bulk playback or video download was attempted. This is a manually maintained reference snapshot, not a live scraper.

## Jeddah, 2027 catalogue with older source footage

The six existing source-only products retain their identities. The 2025 video https://www.youtube.com/watch?v=IcFl-XbcX-o identifies Central Grandstand A in its title. YouTube's public oEmbed metadata identifies its publisher as **Race Experience** (https://www.youtube.com/@raceexperience), a travel operator. It is a publisher-reported 2025 stand reference, not official 2027 imagery, an independent verified review, or a row/seat match. We did not retrieve a reliable publication date. The other five products have explicit missing-video states. No stand-location coordinate is inferred from this clip.

Official venue gallery/map handoff: https://www.jeddahcircuit.com/en/explore-the-circuit . The official event page links the ticket catalogue and confirms the event: https://www.jeddahcircuit.com/en/events/formula-1-stc-saudi-arabian-grand-prix . The ticket catalogue returned HTTP 403 to a normal direct request; no bypass or private selector was attempted. Its current approved product-name evidence remains in the existing Jeddah source record.

The organizer terms, https://www.jeddahcircuit.com/en/terms-and-conditions , restrict copying, framing, commercial reuse and automated content collection without permission. After reviewing those terms, no further organizer media collection was performed. Its gallery/map remains an external link; no JCC image or website frame is embedded or redistributed. Separate organizer image reuse requires the relevant permission. The independent YouTube video uses the provider's standard player and original link, with publisher/date/location limits visible.

## Journeys and limits

The reference hub is available from race guides, circuit diagrams and stand concepts. Catalogue source disclosures link directly to the chosen media option using a `media` query parameter. That selection survives reload; `area` links can preselect an existing Suzuka area. Changing the media stand or source camera unloads the previous player. Map links identify approximate viewing regions, not verified row/seat camera origins. Unknown options and unsupported editions do not inherit a neighboring stand's media.

Loading a YouTube player contacts Google/YouTube; the existing visible privacy link and original-source fallback remain. No source media loads before consent. We do not claim that every historical clip remains embeddable or that a successful iframe request certifies playback. Missing or blocked provider playback can be opened on YouTube.


## Connected onsite photo viewer (26 November 2026)

The selected Suzuka stand now has an onsite photo viewer with original-host images, previous/next controls, source caption, credit, restricted-view labels where stated by the source, an enlarge dialog, loading/error/Retry and unload. No organizer image bytes are packaged with the site. Photo connection permission stays in page memory only, so changing the main stand selector can show the newly selected stand’s photos without asking again. Refreshing starts with the source connection disabled. Unload removes the displayed images and clears that page-memory permission. No cookies, persistent permission record or image proxy are added.

Japan and Jeddah stand concepts have a media rail beside the 3D scene on desktop, with the same selected catalogue option controlling both. On phones, the reference panel follows the scene and precedes its detailed controls. A jump link opens that panel directly. The DOM and visual order agree. The gallery's standalone comparison action opens the selected option in this combined view. Stand-specific source references remain distinct from generic concept geometry: selecting a real source camera or photo never moves a generated chair as though calibrated. The concept, photo and video do not represent an identical measured viewpoint. Jeddah’s existing footage and permission-limited still-image gap remain explicit.


## All-circuit connected layer (26 November 2026)

The common panel is now available in all 47 calendar-edition circuit diagrams and race-guide source hubs, all stand concepts, all ten detailed venue models and the Las Vegas outdoor explorer. Diagram panels have their own catalogue selector and link directly to the selected mapped stand or concept. Actual seat/model explorers bind the reference panel to their existing main stand selector. Model product IDs, rather than fuzzy names or nearby coordinates, associate existing attendee references. Venue-only reports are excluded from selected-stand matches, and the 2026 Sepang event never receives Sakhir footage. Unknown stand catalogues have an explicit missing-coverage panel with circuit/ticket source handoffs; no stand is invented.

The data layer currently supplies 327 named option profiles across eighteen reviewed editions. Japan's nineteen organizer viewing families remain distinct from its eleven source-only service/package references; those unmatched options still show an explicit gap. Nine editions have at least one matched photo, viewing video or attendee report: Qatar 2026; Bahrain/Sakhir, Jeddah, Japan, Canada, Great Britain, Belgium, Hungary and Italy 2027. This is not photo completion for all circuits. Direct still-image display remains Suzuka-only; dated Reddit photo posts can be loaded through their original opt-in embed. Other matched reports may contain text and original links rather than a directly displayable photograph. Existing twenty source records can match more than one representative bank in a source product family; neither counts nor repeated bank associations establish independent reviews.

Three newly added viewing clips were checked against primary public YouTube oEmbed title and channel metadata on 26 November 2026. All identify Race Experience (https://www.youtube.com/@raceexperience), a travel publisher, and source-reported 2025 footage. Row, capture position and future layout correspondence remain unverified:

- Hungaroring Platinum: https://www.youtube.com/watch?v=H-a210pBFGc , matched only to the 2027 ordinary Platinum catalogue option, not accessible spaces or another stand.
- Spa Silver 3: https://www.youtube.com/watch?v=SWrnIncCgtw , matched to the named Silver 3 product. No current canopy/roof guarantee is inferred from older video.
- Spa Fanzone Grandstand: https://www.youtube.com/watch?v=tXp4t7X0gpo , matched to Fanzone Grandstand, not the separate Fan Area Double Gauche.

An Apex 1 search candidate remains unused pending clearer source review. No image bytes or organizer digital-twin geometry were acquired for these additions. Missing picture permissions and current-year stand mappings remain separate requirements. The media framework's global availability does not complete those requirements.


## Visual photo browsing refinement (26 November 2026)

The onsite viewer now shows a bounded strip of five original-host thumbnails after photo connection approval. The selected frame stays marked while its neighboring previews move with the current image. Thumbnail requests use the same original Suzuka host; none load before approval and no thumbnail files or image proxy are added. Original-file links now follow the selected photograph rather than always opening the first file.

Enlarged photos have previous/next buttons, Left/Right navigation, Home/End, wraparound and Escape. Moving between photos keeps the dialog open. The close bar stays visible while scrolling; the source caption, restricted-view label, capture-year uncertainty and lack of model-seat calibration remain visible.

A persistent reload control replaces the disappearing error-only Retry button, preserving keyboard focus through an image failure and recovery. Thumbnail reloads recover with the main frame. Closing a still-loading photo returns focus to an existing viewer control instead of the page background, and image completion does not move focus again. Original YouTube fallback/unload behavior is retained for blocked players.
