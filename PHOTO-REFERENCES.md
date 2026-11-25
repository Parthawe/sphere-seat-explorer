# Spectator photo and review references

Checked 23 November 2026. This release adds a reference browser beside Qatar/Bahrain 3D studies and the Las Vegas seat explorer. It contains curated source notes from public research, not an unattended Internet scraper or live review feed.

## Matching rules

- Match by physical venue and source-reported viewing area. A model section/row/chair is never converted to a spectator's actual ticket label.
- Keep the reported event/capture year separate from the app's planning year. Qatar 2026 has not happened as of this check; older images stay labeled 2025 or 2024. The Sakhir 2027 model does not borrow images from the Bahrain-labelled 2026 event at another venue.
- Section names come from authors and are not independently certified. University/Victory product-level reports cannot establish a particular modeled bank. The Vegas SG codes do not map to A–E model banks.
- Empty selected-area results remain empty. A user can deliberately choose venue-wide references; those from other stands are labeled as context.
- Reviews are attributed summaries of individual reports. No verified-attendance badge, star average, rating count or guarantee is invented. Conflicting accounts stay visible in summaries; historical transport/access claims are not current policy.

## Sources used

| Source | Why retained | Delivery |
| --- | --- | --- |
| [North Qatar photo post](https://www.reddit.com/r/QatarCarEnthusiasts/comments/1p96giq/at_the_f1_gatar_gp/) | Nov 2025 post; photographer identifies North and sprint qualifying in replies | Official Reddit oEmbed, on request; original link always available |
| [T2 photography post](https://www.reddit.com/r/GrandPrixTravel/comments/1h5mhc3/qatar_t2_unobstructed_photography_views/) | Gate A end reported; December 2024 context, capture year inferred | Official Reddit oEmbed; clearly marked older/zoomed reference |
| [Qatar 2025 experience thread](https://www.reddit.com/r/GrandPrixTravel/comments/1pas7t8/how_was_your_qatar_gp_2025_experience/) | Separate source notes for T2, North, Main and Hill reports | Attributed short summaries and original discussion link |
| [2024 Lusail readers' reports](https://gpdestinations.com/readers-experiences-at-lusail-2024-qatar-grand-prix/) | North account and supplied photos; article is explicitly 2024 despite current-year navigation | Publisher link; no image files copied |
| [Bahrain 2025 attendee travelogue](https://www.team-bhp.com/forum/intl-motorsport/293358-my-experience-formula-1-bahrain-grand-prix-2025-desert-never-sleeps.html) | Omkar names Main E1 and higher E5/E6 captions | Original photographs stay on Team-BHP; optional YouTube practice-start clip linked by the report |
| [Bahrain 2025 experiences](https://www.reddit.com/r/GrandPrixTravel/comments/1jydi1m/how_was_your_bahrain_gp_2025_experience/) | University, Turn 1, Victory and wider venue context | Attributed source notes; product/bank uncertainty explicit |
| [Vegas 2025 discussion](https://www.reddit.com/r/GrandPrixTravel/comments/1p4fm46/for_the_people_who_went_to_vegas/) | Sphere attendee reports SG7102/SG1112 | Discussion link only; attached hotel photo is not treated as a grandstand preview |

No suitable selected-area photo is claimed for Qatar T16, Bahrain Beyon/Batelco or Vegas Main. A 2026 recommendations discussion was not treated as 2026 race footage. A discovered SeatStayGo article returned 404 and was excluded. Seller videos found through search were not labeled as spectator reviews.

## Media handling

Reddit's [embedding instructions](https://support.reddithelp.com/hc/en-us/articles/360043033532-How-do-I-embed-a-Reddit-post-or-comment-in-an-article-or-other-publication) describe supported embeds. Public oEmbed responses for the two included photo posts supplied their titles, authors, communities and blockquote/script markup. The component constructs that bounded markup from curated metadata and loads the official widget only after a user clicks. It does not execute scraped arbitrary HTML.

YouTube's standard privacy-enhanced embed is used only for the existing attendee clip linked in the Bahrain report. It starts only on request, does not autoplay and retains a source fallback. No photo files, direct image hotlinks, screenshots of others' images or cached review bodies are added to the asset library. Photo rights stay with the authors.

Before an embed is requested, the reference browser sends no requests to Reddit, YouTube or the photo publishers. Users may unload a preview. Provider privacy links are shown beside load controls. Reddit's preview returned a network-security block in the QA environment; this restriction was not bypassed. Original links remain available, and UI copy does not guarantee provider playback. The direct image files were not fetched as a workaround.

## Validation

53 tests pass. New tests cover year isolation, no stand-to-stand fallback, area-versus-venue selection, physical venue distinctions, source provenance and HTTPS allowlists, bounded embed IDs and distinct model/real section labels.

Chromium desktop 1440×1000, phone 390×844 and 320px checks covered source/year/type filters, absent-photo recovery, opening/closing/reopening reset, selected area changes, original links, optional embeds and unload. Before consent, no requests reached the three media/publisher services. A deliberately blocked widget script showed the fallback; the actual Reddit provider frame was also blocked by its network security. Both retain original links. At 320px, document width stayed 320px and dialog content was 284px. No page exceptions occurred.

Found and fixed the Vegas replay panel covering the old reference trigger. The replay now has its own reference action in both detailed and compact modes; opening references pauses playback and closing them preserves its current time. The base 3D view remains usable after closing.

Remaining limits: capture dates and attendance are author-reported or inferred as labeled, not EXIF-certified; no exact-seat photo calibration, comprehensive photo coverage, live refresh or publisher-availability guarantee is provided. Review harvesting and photo reuse must continue to respect access restrictions and publisher terms.

## Follow-up source search — 23 November 2026

A second targeted search did not establish a new selected-seat photo for the three gaps. Keep the current empty-photo states. These leads remain research notes, not published spectator references:

- [Camel Travel's Qatar account](https://cameltravel.co.uk/qatar-grand-prix-packages/) describes its staff attending T16 in 2024 and North in 2025. This is a travel seller's first-person account, not an independent fan review; the inspected text does not identify the camera position/year of its page images. Do not label them T16 seat photographs.
- [Formula.Vegas credits](https://www.formula.vegas/credits) points to Tia Dufour/DHS race-night photographs of the Main stand and pit straight in 2025. They are promising venue-context leads, not photographs from an identified Main seat. Check the individual original file, date, camera location and rights before importing anything; a secondary credits page is insufficient.
- [Vegas first-attendance discussion](https://www.reddit.com/r/formula1/comments/1p4qbg4/longtime_f1_fan_firsttime_attendee_my_impressions/) contains a Main-stand comment describing a visit two years earlier. Do not turn the 2025 thread date into a 2025 Main-seat capture date.
- [Vegas 2025 experiences](https://www.reddit.com/r/GrandPrixTravel/comments/1p4lovo/how_was_your_las_vegas_gp_2025_experience/) mixes Sphere, hotel and other viewing locations. A post-wide year/location does not establish the provenance of each photograph.
- Bahrain search results included editorial stand guides, seller footage and older reports. None checked in this pass established a 2024/2025 Beyon/Batelco attendee photograph with a reported camera area.

No files or review bodies were copied and no additional media was loaded into the product. Continue the geographic-anchor audit next; revisit these photo leads when specific source evidence becomes available.

## Yas Marina reference boundary

The new Abu Dhabi 2026 model uses its own physical venue identity (`united-arab-emirates` in app routes). No checked attendee photo/report has been added for its seven products yet. The dialog names Yas Marina and keeps an empty collection instead of borrowing Qatar, Bahrain or Vegas sources. A venue with no checked sources no longer offers an empty venue-wide recovery action. OSM image links alone do not establish capture year, identified seat or reuse rights.

## Silverstone initial references · 24 November 2026 UTC

Three references now accompany the Silverstone study. [Race Experience’s Copse C video](https://youtu.be/WkElRBu1Wqg) was checked in the normal public browser: title identifies 2025/Copse C, channel is Race Experience and footage runs twenty seconds. It is labeled travel-publisher footage, not an independently verified attendee photograph. Exact publication date, lens, camera row and capture year are unverified beyond the publisher’s title. No media was downloaded. YouTube loads only after an explicit button and can be unloaded; the original link remains available.

The [2025 experience thread](https://www.reddit.com/r/GrandPrixTravel/comments/1lt4z6r/how_was_your_british_gp_2025_experience/) contains u/paolact’s Becketts report and u/jelly10001’s Vale report. Only short original summaries are included, with named authors, reported bank and year evidence. Becketts summary covers broad views and walk/weather tradeoffs; Vale covers corner views, rain and an off-axis screen. No comment body or photo was copied. These are personal experiences, not current access/cover guarantees or calibrated model-row matches. Other Silverstone banks keep empty selected-area states; the venue-wide filter exposes these three sources without assigning them to another stand.

The shared video component now uses each reference’s own title/author rather than the previous Bahrain-specific iframe title. Its action reads Load source video so travel footage is not mislabeled as attendee footage. Existing original-source and privacy fallbacks remain.

## Spa official virtual-view handoffs · 25 November 2026 UTC

Combes 1–4 now expose a separate organizer virtual-view handoff within the reference dialog. The checked product pages name the virtual-grandstand control; each app link retains its matching product URL. Capture date, exact camera row and correspondence to the model are unverified. These handoffs sit outside the dated attendee filters and leave the checked attendee-reference count at zero. No images are hosted or embedded and upstream playback is not guaranteed. Current Gold 1/Moët/Silver 1 keep their prior empty-reference behavior. Product cover information does not become a verified canopy or photo match.

## Spa La Source virtual-view handoffs · 25 November 2026 UTC

Gold 7, 7 Bis, 7 ter and Gold 8 now have matching official product-page handoffs in the reference dialog. Each current page names the virtual-grandstand control; source URLs remain distinct. Capture dates, camera rows and playback are unverified, so these links remain outside dated attendee counts/filters. No panorama imagery or screenshots were copied into the app. The dated attendee collection for Spa remains empty.

Spa Gold 9 and 9 Bis now link the organizer virtual-view entry from their individual product pages. These handoffs remain separate from dated attendee references; capture dates, playback and actual-row correspondence are unknown. Gold 11/6/6 Bis have official-information links only. No new attendee media is hosted or claimed.

Spa Gold 2/4/5 now offer individual organizer virtual-view page handoffs. The Gold 2 Premium information route describes the same physical grandstand; no distinct model rows or attendee sources are inferred. These links retain unknown capture-year, playback and exact-row limits; there are still zero checked dated Spa attendee references.
