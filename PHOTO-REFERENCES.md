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
