# Overnight experience audit

Deadline: 27 November 2026, 09:00 America/New_York (14:00 UTC). Commercial activation and brand decisions remain owner dependencies.

## 26 November 2026 · 06:30 UTC · Shortlist keyboard continuity

- Starting release: v53, source `60a9cb499cdce62034ead5f7dc37545e9f53e338`; clean checkout before work.
- Evidence: activating Clear with the keyboard removed the focused button and left focus on BODY. The shortlist also did not explain that it is lost on navigation.
- Change: clearing the brief returns focus to the first viewing choice. Added a direct note that the brief lasts only while the race page is open, with download as the way to retain it.
- Validation: the broken focus was reproduced before editing. Keyboard selection, Clear, restored focus and re-selection passed at 1440px and 390px. Both screenshots were inspected; storage guidance is visible. Production build and source publication receipts belong to the corresponding release in Sites history.
- Publication: v54, source `160d1c2fd55f39108ed1a232cfc7c877bf4e7f4d`, succeeded; matching GitHub push confirmed.
- Limits: no persistence or account feature was added. Manual booking checks still do not verify a ticket. Commercial-name permission, operator policies and partner approvals remain unresolved.
- Next useful check: circuit seated-look and follow-camera interruption, especially near steep look angles; preserve fixed eye position and reduced motion.


## 26 November 2026 · 07:00 UTC · Seated look and camera reset

- Starting release: v54, source `160d1c2fd55f39108ed1a232cfc7c877bf4e7f4d`; clean checkout.
- Evidence: both seated renderers omitted the horizontal cosine term when converting yaw/pitch to a look direction. At a -63-degree look, a zero-distance direction reconstruction produced -42 degrees, a 21-degree discontinuity. Circuit Reset camera also retained follow mode, so the camera would resume following after resetting.
- Change: both renderers use a shared fixed-radius spherical look target; the Vegas drag starts from the camera’s actual direction. Circuit Reset camera explicitly stops following while preserving passing-car playback.
- Validation: 128 tests passed, including steep-angle direction continuity and unchanged eye-position regression coverage. Bahrain reset/follow and manual drag passed at 1440px and 390px; Vegas seated drag passed. No browser errors. Both Bahrain screenshots inspected. Production build/publication receipts are associated with the commit containing this entry.
- Publication: v55, source `5afc2560a32bcb80e82c273fec57893e6b31db09`, succeeded; matching GitHub push confirmed.
- Limits: simulated car movement and estimated seats remain unchanged. This is camera behavior, not seat calibration.
- Next useful check: photo/reference dialog focus, Escape/close, embed opt-in and media unloading on desktop/phone.


## 26 November 2026 · 07:32 UTC · Reference media privacy and keyboard flow

- Starting release: v55, source `5afc2560a32bcb80e82c273fec57893e6b31db09`; clean checkout.
- Evidence: source media is correctly opt-in and dialog close removes its frames, but keyboard activation of Unload video removed the focused control and left focus on BODY. The photo-post unload used the same unmount pattern.
- Change: both embed controls return keyboard focus to their corresponding Load button after explicit unload. Initial dialog opening retains its existing focus behavior.
- Validation: desktop Bahrain video and phone Qatar post flows covered opt-in, explicit unload, restored focus, Escape, trigger-focus restoration, frame removal on close and no automatic reload on reopen. Controlled iframe/widget responses were used; this does not verify current remote playback. The initial Reddit test fixture failed on its second execution because of a globally redeclared const; an isolated fixture corrected that test setup and the repeat-load flow passed without browser errors. Both dialog screenshots inspected. TypeScript passed; production build is included in this release workflow. The full unchanged suite was not rerun for this small focus-only fix.
- Publication: v56, source `b5c79ca0d40752ede6ae9cb2609967d26fe1089a`, succeeded; matching GitHub push confirmed.
- Limits: external source playback, author-reported location and capture date remain unverified; no media was downloaded or rehosted.
- Next useful check: calendar and race-page navigation, invalid URLs, season boundaries and back/forward restoration.


## 26 November 2026 · 08:01 UTC · Race navigation and focus

- Starting release: v56, source `b5c79ca0d40752ede6ae9cb2609967d26fe1089a`; clean checkout.
- Evidence: selecting a calendar race with Enter removed the calendar button and left keyboard focus on BODY. The destination heading was not announced through focus. The same gap affected user-requested navigation into and out of lazy-loaded scenes.
- Change: explicit in-app page navigation focuses the destination H1 after it mounts, without changing the scroll position. Hash navigation keeps its own target handling. Deferred focus cancels if the user begins another interaction while content is loading; initial loads and native browser back/forward do not receive an extra forced focus.
- Validation: desktop 1440px and phone 390px flows passed calendar-to-race, lazy 3D entry, return-to-guide, browser back/forward route restoration and calendar anchor focus. Invalid season, unknown race and unsupported China 2027 scene retained the correct fallback without a Vegas scene. Four affected route/metadata tests and TypeScript passed. Both destination-heading screenshots inspected; no browser errors.
- Publication: v57, source `b3af1226814b1290b9f7d3be9734d567738377d7`, succeeded; matching GitHub push confirmed.
- Limits: browser back/forward route restoration was checked, not assistive-technology speech output. Existing source-season and approximate-view boundaries remain unchanged.
- Next useful check: daylight scene title/control contrast and small-screen control spacing under bright geometry, without altering source geometry.


## 26 November 2026 · 08:32 UTC · Scene title contrast and responsive control spacing

- Starting release: v57, source `b3af1226814b1290b9f7d3be9734d567738377d7`; clean checkout.
- Evidence: the night scene had no title scrim. Looking down placed white title text over bright track furniture, including white pixels with a 1:1 white-on-white contrast before text-shadow effects. Monza’s longest bank label overlapped the camera bar at 1024px (heading bottom 230.72px versus bar top 230px). The 320px Spa sample itself was healthy.
- Change: night titles now have a dark contrast backing. Day and night backing heights follow the actual title height. A ResizeObserver keeps the camera bar below wrapped titles and phone photo/zoom controls below the bar, preserving approximately 16px gaps as fonts and bank names change. No scene geometry changed.
- Validation: ten day/night layouts across 320, 390, 768, 1024 and 1440px had approximately 16px title/control gaps, no photo/zoom overlap and no horizontal overflow. No browser errors. Desktop and phone night screenshots plus the longest Monza phone heading were inspected. TypeScript passed; production build is part of publication. No redundant full-suite rerun for this layout-only change.
- Publication: v58, source `4433c079ad979bedb9d7d23668dabad735b308a6`, succeeded; matching GitHub push confirmed.
- Limits: this addresses heading readability and overlay geometry, not a full-site contrast certification or calibrated seat views.
- Next useful check: loading/error recovery and saved comparisons with unavailable or corrupted device storage.


## 26 November 2026 · 09:01 UTC · Graphics recovery and unavailable storage

- Starting release: v58, source `4433c079ad979bedb9d7d23668dabad735b308a6`; clean checkout.
- Evidence: a real WEBGL_lose_context event left the replay status RUNNING, and Retry 3D automatically restarted cars and following. The stage’s passing-car button could also enable playback while graphics were unavailable.
- Change: losing graphics now pauses cars and clears following. The stage passing-car action is disabled until graphics are ready, matching the main replay controls. Retrying preserves the modeled bank, row and position without automatically restarting motion.
- Validation: actual context-loss/retry passed on desktop and phone; the fallback grid remained usable, playback stayed paused after retry and row 7/position 9 were retained. The phone check waited for the camera transition to settle. Blocked localStorage in Qatar and Vegas still allowed in-memory comparisons, showed the temporary-storage warning and supported Clear. Corrupt/duplicate/unsupported Qatar comparison data sanitized to the single allowed north ID. A controlled 503 on the public price snapshot showed Retry; restoring the response recovered it. Eight affected registry/snapshot tests and TypeScript passed. No full-suite rerun. Production build is part of publication.
- Publication: v59, source `243e550e3fe39bf91200c4bd8bd24d2991c697e9`, succeeded; matching GitHub push confirmed.
- Limits: this validates browser context-loss handling, not every possible GPU/driver failure. Device-local storage and reference-price limitations remain explicit; no inventory or monetization was activated.
- Next useful check: public ticket-source link labels and dated reference-price presentation, without claiming live availability or repeatedly crawling sellers.


## 26 November 2026 · 09:29 UTC · Dated comparison prices and source handoffs

- Starting release: v59, source `243e550e3fe39bf91200c4bd8bd24d2991c697e9`; clean checkout.
- Evidence: Qatar’s selected-area price showed its check date, but the saved-comparison price cell contained only 2,000 QAR, with no per-record date or source handoff. A user viewing just the table could miss when that reference was captured. The source validator also accepted credentials and non-standard ports on an otherwise allowlisted hostname.
- Change: each available comparison reference price now carries its recorded UTC check date and an explicitly named source link. The footer asks users to confirm current prices, fees and availability without assuming whether reference prices include fees. Source metadata rejects embedded credentials and non-standard ports before its URL can reach the new handoff.
- Validation: eight affected snapshot/registry tests passed, including added credential/port cases. TypeScript passed. Desktop and phone comparisons showed Checked 23 Nov 2026 beside the recorded price, linked the existing Lusail product URL and retained horizontal table scrolling without page overflow. Both screenshots inspected; no browser errors. The copy clarification does not alter layout or data. Production build is part of publication.
- Publication: v60, source `9c191fc2b5ba59b1d0a5fd3d77cb454be2e12f87`, succeeded; matching GitHub push confirmed.
- Limits: no seller recrawl, stock check, new price or discount was claimed. The collection remains a dated reference snapshot, not live inventory or an affiliate offer.
- Next useful check: reduced-motion changes during active camera transitions and page-visibility playback behavior.


## 26 November 2026 · 10:01 UTC · Live reduced-motion preference changes

- Starting release: v60, source `9c191fc2b5ba59b1d0a5fd3d77cb454be2e12f87`; clean checkout.
- Evidence: enabling reduced motion during a circuit camera flight left the active transition running, and car-follow mode stayed armed after cars paused. Vegas had the same in-flight preference gap; its independently playing historical replay also continued after the preference changed.
- Change: both camera rigs finish the current transition at its destination when the reduced-motion change arrives. Circuit preference changes clear following as well as pausing cars. Vegas preference changes also send the existing replay pause event to the archive player. Explicit user playback remains available afterward.
- Validation: five affected seated-look/archive/circuit-framing tests and TypeScript passed. Desktop/phone preference-event tests confirmed circuit transitions settle and following clears; Vegas transitions settle and the historical replay pauses. The first immediate-read test sampled before Chromium delivered/coalesced media-query changes, so its timing was corrected to wait for the actual preference event and the next frame; strict assertions then passed. Circuit hidden-document event handling also paused playback. Phone/desktop screenshots inspected; no unrelated geometry or telemetry changes. Production build is part of publication.
- Secondary finding: the settled phone full-circuit screenshot exposed a clipped Vegas world. All 1,101 authored racing-line samples lay beyond the old 1,800-unit far plane for the portrait camera (depths 1,840–2,462). The full-circuit camera now fits the entire authored line by aspect ratio, sets an adequate far plane, and recomputes on resize. A regression projects every sample through six portrait/landscape frusta and checks both screen bounds and clipping. Settled phone and resized desktop screenshots were inspected after this correction; no world geometry changed.
- Publication: v61, source `6e64b8e69d08ed50e3732a854faa6640387a87d1`, succeeded; matching GitHub push confirmed.
- Limits: tested with Chromium media emulation and a controlled visibility event, not every OS/browser or physical-device setting panel. Historical data and exact-seat limits remain unchanged.
- Next useful check: consistent copy/download brief contents and handling of clipboard denial, with no private ticket data in exports.


## 26 November 2026 · 10:29 UTC · Brief export consistency and clipboard recovery

- Starting release: v61, source `6e64b8e69d08ed50e3732a854faa6640387a87d1`; clean checkout.
- Evidence: copy and download used separate formatters with different fields and checklist wording. A completed copy could overwrite Shortlist cleared after the visitor cleared the brief while a clipboard request was pending. The settled delayed-result failure was reproduced before editing.
- Change: both export actions now use one race-bound formatter, with venue dates, curated region descriptions, each manual check’s status, source year, relevant ticket source and estimate limits. Unknown selected strings are omitted. Copy has a disabled busy state, and late results cannot overwrite messages after the selection/checklist was changed or cleared.
- Validation: six affected guide/export tests passed; TypeScript passed. Desktop and phone browser checks confirmed byte-identical clipboard/download text, exclusion of a private query marker, a helpful clipboard-denied fallback, working download and preservation of the Clear message after delayed clipboard completion. Both brief screenshots inspected. An initial test incorrectly rejected the word Sakhir inside the valid Sepang warning; it was corrected to assert the actual venue line, preserving the warning. Production build is part of publication.
- Publication: v62, source `a4ab287430c2cb395778006a070a636baa5fe795`, succeeded; matching GitHub push confirmed.
- Limits: export contains curated context and user-declared checks, not ticket verification. No pasted ticket details, analytics or server persistence were introduced.
- Next useful check: complete model-grid edge selection, row/section bounds and keyboard behavior on desktop/phone.


## 26 November 2026 · 11:00 UTC · Complete model grid and scene handoff

- Starting release: v62, source `a4ab287430c2cb395778006a070a636baa5fe795`; clean checkout.
- Evidence: ArrowDown in the top-down grid changed row 12 to row 11, moving the marker visually upward. The grid and seated camera shared a handler despite different spatial row conventions. On phone, View this position in 3D closed the dialog but left the entire scene above the viewport (stage bottom -528px).
- Change: grid arrows now follow the displayed grid axes while seated-camera arrows retain their existing higher/lower-row behavior. The explicit 3D-view action closes the dialog, stops following, focuses the interactive scene and brings it into view. Reduced motion uses an immediate scroll; normal motion uses the browser's smooth scroll. Escape retains the ordinary dialog-return behavior.
- Validation: desktop 1440px and phone 390px strict browser assertions covered first-row/seat bounds, Down/Right increments, final section and last dot, final-row/seat bounds and the scene-visible/focused handoff with preserved selection. No browser errors. Both grid screenshots inspected. TypeScript passed; production build is part of publication. No redundant geometry/full-suite test rerun for this interaction-only fix.
- Publication: v63, source `202c55714fe10a9fb01d4640988a60966a999b3d`, succeeded; matching GitHub push confirmed.
- Limits: model positions remain illustrative and do not identify actual ticket rows or chairs. These checks do not certify touch accuracy for a physical phone or accessible venue routes.
- Next useful check: non-destructive comparison removal/clear focus and the three-position capacity message, without adding persistence or commercial tracking.


## 26 November 2026 · 11:30 UTC · Comparison removal and capacity feedback

- Starting release: v63, source `202c55714fe10a9fb01d4640988a60966a999b3d`; clean checkout.
- Evidence: keyboard Clear in Qatar and Vegas and last-position removal in the circuit explorer all left focus on BODY. A removal after reaching model-comparison capacity also left the old Three positions saved message displayed.
- Change: a shared removal-focus hook moves to the next remaining Remove control or returns to the comparison entry button when the list is cleared. It is used by the shared area table, Vegas area list and circuit-position list. Shared desk remove/clear actions and circuit removals now replace stale capacity feedback with the actual action result. Capacity remains three and existing storage behavior is unchanged.
- Validation: strict desktop and phone assertions covered next-item focus, Clear focus, Vegas Clear, rejecting a fourth modeled position without losing the three saved choices, and last-item focus return. A second shared desk family (Monaco) confirmed focus and clear feedback; the circuit capacity message updated after removal. Six affected registry/comparison tests and TypeScript passed. Screenshots of the phone remaining-position list and desktop/phone return states were inspected; no browser errors in the main flows. Production build is part of publication.
- Publication: v64, source `c66596795c08cf580b00e77ec36b9f22b1ecca7e`, succeeded; matching GitHub push confirmed.
- Limits: no new comparison persistence, accounts, inventory or tracking was added. Browser focus assertions are not a screen-reader certification.
- Next useful check: inspect 2026/2027 public coverage labels and unsupported model handoffs for stale claims, avoiding repeated venue research without new evidence.


## 26 November 2026 · 11:59 UTC · Coverage labels and source seasons

- Starting release: v64, source `c66596795c08cf580b00e77ec36b9f22b1ecca7e`; clean checkout.
- Evidence: the 2027 Vegas calendar row said only 3D seat model, although the guide and explorer use a 2026 reference reconstruction. Calendar labels, filtering and guide badges were maintained in separate conditionals, making that distinction inconsistent before entry.
- Change: one source-aware coverage helper now drives the calendar label, 3D filter and guide badge. Vegas explicitly says 3D · 2026 reference in both seasons; the filter is named 3D studies. Generic models remain illustrative and bound to their own season. The feature heading now names Las Vegas viewing areas rather than claiming all of Las Vegas.
- Validation: nine affected coverage/route/guide tests passed, including all 47 listed calendar entries and Sepang/Sakhir, Qatar and Shanghai season boundaries. TypeScript passed. Desktop and phone flows checked both seasons, the 3D filter, visible dated Vegas guide badges, absent borrowed Shanghai 2027/Sepang 2026 canvases and no horizontal overflow. Feature screenshots inspected; no browser errors. Production build is part of publication.
- Publication: v65, source `4537131236ba5c98a1ec11e0513cd36d32c92795`, succeeded; matching GitHub push confirmed.
- Limits: this is a consistency audit of retained coverage and sources, not fresh verification of every organizer or a claim of complete/exact-seat 3D coverage. No venue data, calendar dates or commercial accounts changed.
- Next useful check: lazy scene/module loading failure and recovery navigation, preserving useful guides when 3D assets cannot load.


## 26 November 2026 · 12:30 UTC · Scene-module failure recovery

- Starting release: v65, source `4537131236ba5c98a1ec11e0513cd36d32c92795`; clean checkout.
- Evidence: blocking the lazy 3D scene module replaced the entire Qatar explorer with the root recovery page. The scene's internal graphics boundary could not catch a failure before its module loaded. Position controls, the model grid and direct guide navigation were lost.
- Change: a local boundary now contains scene import/render failures and uses the existing graphics fallback. Retry creates a fresh lazy component, preserves the selected position, stays paused and returns keyboard focus to the scene. The unavailable view announces its fallback and hides the disabled zoom stack that overlapped its text on phone.
- Validation: controlled module-request failures at 1440px and 390px retained the explorer. Strict browser assertions covered changing row/position in the fallback grid, successful retry after removing the request block, preserved URL selection, paused cars, focus return and navigation back to the guide. Desktop/phone fallback screenshots inspected; no page errors in those controlled flows. TypeScript passed; production build is part of publication.
- Publication: v66, source `d2cb325b45012da6fefa34611a594895fb23b1e3`, succeeded; matching GitHub push confirmed.
- Limits: a controlled local import failure is not evidence of a current production outage or a guarantee that a permanently unavailable asset can be retried successfully. Complete explorer-module failure still uses the root reload/calendar recovery. No source geography, external media, inventory or commercial tracking changed.
- Next useful check: production build scene-chunk recovery and keyboard access to reference/guide controls during degraded graphics, then audit slow-network loading states without inventing new venue coverage.


## 26 November 2026 · 13:02 UTC · Production chunk recovery and loading clarity

- Starting release: v66, source `d2cb325b45012da6fefa34611a594895fb23b1e3`; clean checkout.
- Evidence: the packaged production build recovered from a deliberately blocked scene chunk at desktop and phone widths. Keyboard photo-reference open/Escape returned focus correctly while graphics were unavailable. Holding the production chunk also left the model grid and references usable with cars disabled. The phone loading screenshot showed the disabled zoom stack crossing the loading-status panel.
- Change: seated zoom controls now appear once the scene is ready; they remain hidden during loading and graphics failure.
- Validation: production request-block assertions confirmed retry after restoring the chunk at 1440px and 390px. Held-chunk assertions confirmed grid selection survives scene load, reference dialog access, no unsolicited iframe, disabled playback and no horizontal overflow at both widths. Loading screenshots inspected. TypeScript and production build are included in publication; the rebuilt phone loading/ready states are checked before deployment.
- Publication: v67, source `4c3864e0e0be833961d45b0a66b5d806087aaa2e`, succeeded; matching GitHub push confirmed.
- Limits: requests were controlled locally against the packaged build, not an upstream outage or physical-device network test. No new venue, source, external media, tracking or exact-seat claim.
- Next useful check: native browser back/forward across guides, model positions and calendar filters, preserving correct season and focus without adding history entries for every chair.


## 26 November 2026 · 13:30 UTC · Native history and selected-position restoration

- Starting release: v67, application source `4c3864e0e0be833961d45b0a66b5d806087aaa2e`; clean checkout.
- Evidence and validation: browser checks against the existing production build at 1440px and 390px confirmed a Lusail search plus 3D filter survives calendar → Qatar guide → native Back; Forward returns the correct guide. A changed model row/position survives model → guide → native Back/Forward. Chair changes replace their URL without adding history entries. Separate Bahrain 2027 guide/model history retained the Sakhir season throughout.
- Change: none to application code; this pass found no failing route or selection assertion. The audit log reconciles the previous successful release.
- Publication: documentation checkpoint only in GitHub; the application remains v67. No unchanged build or deployment was repeated. A later application release will include this log in Sites source.
- Limits: these checks cover two representative route families in desktop Chrome emulation, not every venue or physical-device browser. Native Back does not add a custom focus change; hash targets retain their existing async focus behavior. Commercial and measured-seat owner/asset dependencies remain unresolved.
- Next useful check: keyboard and narrow-screen ticket-input validation, including malformed booking text and share/export privacy, without collecting actual private tickets.


## 26 November 2026 · 13:58 UTC · Ticket-input uncertainty, privacy and Clear focus

- Starting checkout: `0f02842ace5dcccc6ed5f021e9adb4b2395bce06` (previous audit documentation); application v67. No simultaneous local edits.
- Evidence: Qatar's locator accepted Melbourne Main Grandstand 2026 as a local Main Grandstand. Its exclusion list omitted that named venue. All three locators bounded wrong-year checks to the 2020s/2030s. Keyboard Clear removed its own button and left focus on BODY.
- Change: the three local parsers share explicit known foreign-venue and unsupported-year checks, keeping numeric row/seat/section values separate from event years. Known foreign locations cannot borrow a same-named local stand. Qatar, Abu Dhabi and Singapore Clear actions return focus to the seating-details field.
- Validation: 21 affected parser tests passed, including foreign venue aliases, unsupported 1999/2019/2040/2099 years, own-venue names, numeric identifiers and existing product ambiguity. Six browser journeys (three locators × desktop/phone) rejected Melbourne, matched a valid area with synthetic text, and confirmed that text was absent from request URLs/bodies, browser storage and copied area links. Clear emptied input/result and returned focus. No overflow or page errors. Phone screenshot inspected; TypeScript/production build are part of publication.
- Publication: v68, source `002ddd8183a8ba69e88520d54f97cc20f1a25b42`, succeeded; matching GitHub push confirmed.
- Limits: named-venue exclusions are a conservative local heuristic, not a universal event detector, ticket validation or exact-chair location. Tests used synthetic text and a controlled clipboard implementation; no private ticket was collected.
- Next useful check: guide shortlist copy/download fallbacks and focus when changing task or unsupported locator input, preserving manual checklist boundaries.


## 26 November 2026 · 14:29 UTC · Shortlist export when clipboard access fails

- Starting release: v68, source `002ddd8183a8ba69e88520d54f97cc20f1a25b42`; clean checkout.
- Evidence and validation: the packaged build was tested at 1440px with a controlled clipboard denial and at 390px with the clipboard API absent. Both showed the download fallback and re-enabled Copy. Actual browser downloads had the Singapore 2027 filename, event-year ticket source, two user-marked and two unchecked booking checks, and the independent-verification caveat. Switching to Already have tickets retained choices/checks. Keyboard Clear returned focus to the first choice, removed the notebook and reset checks for a new selection. No overflow or page errors; phone screenshot inspected.
- Change: none to application code; no failing export or focus assertion. Reconciled the previous successful release in the audit log.
- Publication: documentation checkpoint only in GitHub; application remains v68. No unchanged tests/build/deployment were repeated.
- Limits: clipboard failures were deliberate local fixtures, not evidence of browser-wide clipboard behavior. Download content preserves user declarations and source caveats; it does not verify a booking.
- Next useful check: cross-season comparison storage isolation and unavailable-storage behavior, retaining public area IDs only and a usable transient comparison.


## 26 November 2026 · 15:00 UTC · Comparison storage boundaries

- Starting checkout: `197c43f` (previous audit documentation); application v68. No simultaneous local edits.
- Evidence and validation: the existing packaged build at 1440px and 390px sanitized a seeded Qatar comparison containing duplicates, an unknown synthetic private-like string, a number and a fourth valid area. Only three permitted public IDs remained, in order. A separate Abu Dhabi selection loaded independently; clearing it left Qatar and a seeded unused-season key unchanged. Controlled get/set/remove storage denial retained a usable in-page comparison with the transient-storage explanation and no page errors. A phone reload rechecked after the desk remounted confirmed it did not persist. Phone layout inspected.
- Change: none to application code; no failing storage or isolation assertion.
- Publication: documentation checkpoint only in GitHub; application remains v68. No unchanged build or deployment repeated.
- Limits: the unused-season key check demonstrates key isolation, not unsupported Qatar 2027 coverage. Storage denial was a controlled browser fixture. These checks do not cover simultaneous edits from multiple browser tabs.
- Next useful check: source-snapshot unavailable/malformed-data handling and retry, ensuring organizer links and comparison remain usable without reference prices.


## 26 November 2026 · 15:30 UTC · Reference-price failure and retry

- Starting checkout: `ac37c13d5ceb71aef1e03c9fcc6493ae2f61cd39` (audit documentation); application v68. No simultaneous edits.
- Evidence: a controlled 503 correctly removed reference prices and retained the organizer link/comparison. Keyboard Retry removed its own button during the request and left focus on BODY after success.
- Change: Retry moves focus to the stable reference-status paragraph before requesting data. That paragraph announces loading, failure and dated reference results.
- Validation: two affected snapshot-parser tests passed. Four browser journeys (1440px/390px × 503/malformed JSON record) retained safe Check with seller wording, organizer source access and comparison. Restoring the actual local snapshot and activating Retry restored its dated QAR reference, preserved the saved area and kept focus on status. No page errors or horizontal overflow; phone screenshot inspected. TypeScript/production build are part of publication.
- Publication: v69, source `db80beff9cf0cb9746fdd004d334a999ee466371`, succeeded; matching GitHub push confirmed.
- Limits: failures were deliberately intercepted local responses, not a live organizer outage. The retained 23 November price snapshot was not refreshed, and restored reference data does not establish live availability or a final total.
- Next useful check: text zoom and narrow 320px layouts for source/status, navigation and planning controls, preserving the scene camera and current branded spacing.


## 26 November 2026 · 16:02 UTC · Narrow-screen planning reflow

- Starting release: v69, source `db80beff9cf0cb9746fdd004d334a999ee466371`; clean checkout.
- Evidence and validation: after lazy desk content and fonts settled, the 320px calendar, Qatar guide and Singapore guide had no document-level horizontal overflow. Branding, season controls, product navigation and 3D-entry panels were visually inspected. Singapore shortlist creation/download controls and Qatar's unsupported row/seat-only notice also remained within the viewport. An initial Singapore check used the wrong accessible region name and timed out; the corrected region selector passed.
- Change: none to application code; no demonstrated reflow defect. Reconciled the previous successful release in this log.
- Publication: documentation checkpoint only in GitHub; application remains v69. No unchanged build/deployment repeated.
- Limits: this checks narrow CSS-viewport reflow in Chrome, not physical-device testing or native text-only zoom. It does not certify every offscreen control or 3D overlay at enlarged font sizes.
- Next useful check: landscape phone scene overlays with the model grid and source dialogs, keeping controls reachable when viewport height is constrained.


## 26 November 2026 · 16:23 UTC · User-requested visual hierarchy improvement

- Starting checkout: `95662cb27cd242594b3f26d099f49c945deee92d`; application v69. User requested a broader visual/experience improvement, beyond the scheduled micro-audits.
- Evidence: the home entry embedded the full Qatar tool before the season calendar; the product's actual 3D demonstration was far below the first screen. The 2027 Singapore promo still said twelve standard stands despite the expanded area workspace. Generic source caveats repeated on guides. The explorer's large replay block pushed bank/position selection below the desktop fold. Mobile replay could start while its scene was offscreen and therefore rendering was suspended.
- Change: a shared season landing leads with race selection, an existing renderer preview, two calendar-derived upcoming guides and the calendar. Removed duplicate home navigation and stale promo content. Guides retain a visible estimate boundary and ticket handoff, with source explanations in a disclosure and a direct link to supported area workspaces. Seat controls now precede optional replay settings. Starting replay offscreen focuses/scrolls to the scene, respecting reduced motion.
- Validation: 11 affected route/coverage/guide/brief tests and TypeScript passed. Desktop 1440px, phone 390px and narrow 320px browser journeys confirmed season changes, calendar filtering, focused calendar jump, guide-to-area navigation and Qatar locator access. Desktop/phone checks also confirmed selection/grid handoff, photo dialog focus return and simulated playback visible after starting from below the scene. No page errors or document overflow in confirmation flows. Batched screenshots inspected; production build is included in publication.
- Publication: v70, source `08880bc8f7a68566d174c83d7a628ea22fcd04b6`, succeeded; matching GitHub push confirmed.
- Limits: existing 3D materials/geography and illustrative accuracy remain unchanged; this pass improves entry, hierarchy and operation, not photographic realism or measured chairs. No commercial tracking or new source facts.
- Next useful check: landscape phone source/grid dialogs and scene overlays, preserving this updated entry and selection hierarchy.


## 26 November 2026 · Commercial-readiness corrections requested by user

- Starting application: v70, source `08880bc8f7a68566d174c83d7a628ea22fcd04b6`; clean checkout. User requested correction of the nine commercial-plan weaknesses, then confirmed holding written permission and asked for official affiliate routes. Operator details and accepted agreements remain unsupplied.
- Research: rechecked Formula 1's published branding guidelines, Gootickets/P1 Travel/Tickets.GP programme pages, Google publisher policy and FTC disclosure guidance. Reviewed all five Qatar organizer product pages and event FAQ. Programme applications remain distinct from issued earning links. No application, external message, account action or DNS change.
- Changes: recorded owner-confirmed rights separately from document review; added release dependencies, explicit pilot scope, global/per-link stop switches, contract terms, registry-matched category/day/admission/source review and recorded availability checks. The partner audit now fails while blocked. Added a public organizer-product/model boundary to Qatar's area panel. Added official signup-route research, a one-event review plan, review/research ledgers, measurement specification and a local scenario/observed-revenue worksheet with unknown defaults. Ads remain deferred; no tracking implementation.
- Validation: 20 affected commercial/parser/registry tests passed; seven commercial tests were reconfirmed after the final contract-schema update. Desktop/phone browser assertions covered all five organizer categories, correct admission/source details, comparison, no affiliate block or known ad/analytics requests and no document overflow/page errors. Phone screenshot inspected. TypeScript passed; production build is included in publication. `audit:partners` correctly exits 1 with missing launch prerequisites and zero links; `model:revenue` reports no supplied scenario or observed payout.
- Publication: v71, source `bf57590e759c3705a043e3542f650fc00ddb7261`, succeeded; matching GitHub push confirmed.
- Limits: manual evidence records do not remotely verify documents, stock, seller checkout or attribution. No customer/revenue proof is claimed. Qatar is an imminent candidate, not a guaranteed launch; if readiness misses its event, review a later race explicitly. Required owner inputs are recorded in docs/monetization.md.
- Next useful work: review supplied permission scope/operator details and accepted partner-issued links; otherwise continue the existing non-commercial experience audit without fabricating approvals.


## 26 November 2026 · User-requested first-hero improvement

- Starting application: v71, source `bf57590e759c3705a043e3542f650fc00ddb7261`; clean checkout. User specifically requested a more interesting opening hero.
- Change: replaced the flat two-column paper opening with a large dark Sphere scene, white/red display headline, explicit explorer/calendar actions and an interactive circuit/seated preview switch. Fresh captures come from the existing renderer with its UI overlays hidden, compressed to roughly 134/161 kB WebP. The primary link preserves the preview camera and modeled C/12/18 position. Upcoming races, calendar, guides and commercial gates retain their behavior.
- Validation: TypeScript passed. Desktop 1440px, phone 390px and narrow 320px checks confirmed loaded previews, keyboard switching, readable selected hover, exact seated explorer handoff, 2027 calendar focus/count, no document overflow and no page errors. Landing has no canvas. A controlled blocked image showed a fallback and retained the explorer link. Batched screenshots inspected; affected routing/model tests and production build are included in publication.
- Publication: v72, source `fa903e19295fd7b09b4e52e44164cb4ac4d3961a`, succeeded; matching GitHub push confirmed.
- Limits: hero images are authored reconstruction captures, not live 3D or actual-seat photographs. The source-year and OSM/NASA credits remain visible. No commercial activation, new claims or changes outside the hero handoff/styles.
- Next useful check: continue the scheduled bounded experience audit, preserving the new hero and commercial launch dependencies.


## 26 November 2026 · User-requested visual-first and responsive experience

- Starting application: v72, source `fa903e19295fd7b09b4e52e44164cb4ac4d3961a`; clean checkout. User explicitly requested shorter copy, icons, visualization, parallax and phone/tablet/desktop compatibility.
- Changes: added shared original SVG control icons, event/season-bound source circuit outlines in calendar/guide headers, shorter coverage badges and action labels, and expandable circuit prose. Shortlist/export and actual 3D camera/photo/map/grid controls retain accessible names. Qatar product duration/admission, source and model limits stay visible with less repeated copy. Hero preview depth responds to pointer and bounded scroll; it has pause, coarse-pointer behavior and dynamic reduced-motion handling. Reworked calendar columns and low-height scene/dialog layouts without adding dependencies.
- Validation: TypeScript and 19 affected route/coverage/guide/registry/brief/commercial tests passed. Browser assertions passed at 320×900, 390×950, 640×950, 768×1024, 1024×900, 1440×950, 1920×1080 and 844×390: hero, calendar focus/filter, correct source-season outlines, 3D selection, grid handoff, photo dialog and replay, reduced motion, no document overflow/page errors. Separate checks confirmed pointer/scroll depth, explicit pause, live OS-preference reset, circuit-note disclosure and icon-driven shortlist/checklist/download. Batched desktop/phone/tablet/landscape screenshots inspected. An intermediate JSX typo was corrected before the successful checks. Production build is part of publication.
- Publication: v73, source `61c218edbb53e88a22370ceec8173b7a4eef57cf`, succeeded; matching GitHub push confirmed.
- Limits: viewports/touch flags are Chrome emulation, not physical-device certification or every browser. Preview parallax is image depth, not a live hero world. Original venue geometry, measured-seat gaps, replay provenance and commercial launch gates remain unchanged.
- Next useful check: continue bounded live-experience audits while preserving concise controls, source-season boundaries and no fabricated commercial evidence.


## 26 November 2026 · User-requested live Three.js and smooth camera motion

- Starting application: v73, source `61c218edbb53e88a22370ceec8173b7a4eef57cf`; clean checkout. User explicitly asked for Three.js and smoother animation.
- Change: the visible hero now lazy-loads the actual shared Vegas World with materials, shadows, bloom, Sphere and simulated cars. A dedicated rig smoothly interpolates eye, look target and matching full-explorer lens; pointer/scroll changes remain bounded. Poster images cover loading/failure. Motion can pause; static/reduced scenes render on demand, offscreen/hidden scenes stop, and data-saver users opt in. Local lazy/render/context-loss recovery preserves navigation and supports Retry.
- Validation: TypeScript and 21 affected camera/model/route tests passed. Desktop 1440px, tablet 768px, phone 390px and narrow 320px assertions confirmed live canvas, moving-to-settled camera transitions, offscreen frame-count suspension/resume, manual pause and dynamic reduced-motion behavior without page errors or overflow. Desktop/phone live screenshots inspected. Controlled module failure and actual WEBGL_lose_context recovered to the poster and successfully retried. Data-saver opt-in passed. Live hero → seated explorer → browser Back retained the C/12/18 selection, one working canvas and no page errors. An initial Canvas fallback callback was corrected because fallback DOM mounts even with supported canvas; a test's uppercase text expectation was also corrected. Production build is included in publication.
- Publication: v74, source `2d2d5e4b2aab28418e0fb0d7e1d339499991ae7d`, succeeded at 17:05:44 UTC; matching GitHub push confirmed.
- Limits: browser emulation is not physical-device or fixed-FPS certification. The world remains an illustrative 2026 reconstruction with simulated traffic, not measured seat views or live race data. No geometry, private ticket handling, commercial readiness or partner status changed.
- Next useful check: production chunk recovery/performance for the live hero on the retained deployment, then continue bounded product audits without introducing repetitive effects.


## 26 November 2026 · User-requested visual explorer controls

- Starting application: v74, source `2d2d5e4b2aab28418e0fb0d7e1d339499991ae7d`; clean checkout. User reiterated less copy, more visualization, 3D interaction and responsive layouts.
- Changes: added a Focus view that expands the existing 3D stage and restores focus to seat controls on return; unmodified F works inside the scene. Added an illustrative circuit locator opening the existing full map and schematic Front/Middle/High row diagrams. Shortened repeated position and simulation copy; retained admission, source-year and model limits. Compact comparison/share controls keep accessible labels. Landscape Focus uses the viewport with reachable camera, photo, zoom and return controls.
- Validation: 31 affected circuit, camera-look, route, coverage and registry tests passed. Browser assertions passed at 1440×950, 768×1024, 390×950, 320×568 and 844×390: Focus/return and preserved selection, visual row choice, map, grid handoff, comparison, sharing, no horizontal overflow or page errors. Desktop F shortcut and focus restoration passed; landscape control bounds fit the viewport. Desktop, phone and landscape screenshots inspected. TypeScript passed before the final CSS adjustment; production build is part of publication.
- Publication: v75, source `7af908139cd9cb3f63bb191634ae17127ff160af`, succeeded at 17:14:54 UTC; matching GitHub push confirmed.
- Limits: viewport emulation is not physical-device certification. The locator fan and row diagrams are illustrative navigation, not calibrated sightlines or measured tier geometry. Existing reconstruction, simulated traffic, source and commercial restrictions remain.
- Next useful check: continue bounded audits for concrete navigation or rendering defects; avoid adding decorative effects that obstruct seat comparison.


## 26 November 2026 · User-requested price intelligence and personal planning

- Starting application: v75, source `7af908139cd9cb3f63bb191634ae17127ff160af`; clean checkout. User asked for all-race ticket coverage, Google-style price movements, personal suggestions and a revenue model.
- Research: reviewed Google Flights tracking, GA4 ecommerce documentation, Ticketmaster Discovery Feed release notes and Gootickets programme terms. GA4 is measurement, not a ticket price source. Ticketmaster removed price fields from its public feed. No partner approval/feed credentials were supplied; no automatic data or earning-link coverage is claimed.
- Changes: added a browser-local notebook to all 47 listed race editions. Exact seller/product/currency/admission histories accept fee-complete, ticket-only adult quotes, plot time-based observations and compare the last quote with a personal target. Added export, deletion/undo, storage-failure warning and native accessible forms. No fake initial price chart. Different sellers, currencies, dates and years remain separate. Product URLs reject credentials, non-HTTPS, query strings and fragments. Added research, feed/alert prerequisites and a referral-first revenue sequence in docs/ticket-price-product.md.
- Validation: 14 price-history, partner and routing tests passed. Browser checks at 1440×1000, 768×1024, 390×844, 320×568 and 844×390 passed creation, repeat recording, chart exploration, target comparison, reload persistence, undo/export, season isolation, no horizontal overflow or page errors. All 47 race guides rendered the notebook without page errors. Blocked storage retained session notes and export with a warning. Empty, form and populated desktop/phone screenshots inspected. A case-insensitive module name collision and a verbose implicit select name were corrected before successful checks. Production build is part of publication.
- Publication: v76, source `30227a9bb031ba428d8519fdd15e932badda9223`, succeeded at 17:23:56 UTC; matching GitHub push confirmed.
- Limits: these are manual personal observations, not live inventory, market history, verified all-in totals, predictions or automatic alerts. No analytics, ads, affiliate activation, messages or account action. No private ticket uploads or server collection. Browser emulation is not physical-device certification.
- Next useful work: obtain a permitted seller data feed and commercial evidence, then implement server observations, freshness/coverage labels, approved attribution and opt-in alert delivery against actual access.


## 26 November 2026 · 17:24 UTC post-release checkpoint

- Focus: current-source and release reconciliation immediately after the user-requested price notebook release. Deadline remains 27 November at 14:00 UTC.
- Evidence: clean checkout at `30227a9bb031ba428d8519fdd15e932badda9223`; v76 native publication succeeded at 17:23:56 UTC and the matching GitHub push completed. The preceding pass already checked all 47 guide routes, five viewport flows, blocked storage, 14 affected tests and the production build. No unchanged browser/test/build run was repeated.
- Change: reconciled the exact v76 publication in this log. Documentation only; no application deployment needed.
- Limit: automatic prices, alerts and earning attribution still require the documented permitted feed and commercial inputs. No owner input was fabricated and no commercial feature was activated.
- Next useful check: rotate to keyboard/focus recovery in existing 3D dialogs, rather than immediately repeating the notebook checks.

## 26 November 2026 · 17:32 UTC keyboard and dialog audit

- Focus: native dialog focus and return paths in the existing Qatar 2026 3D explorer, on a clean checkout at `cf53055` (documentation checkpoint; application remains v76 / `30227a9bb031ba428d8519fdd15e932badda9223`). No overlapping local edits found.
- Evidence: desktop 1440px and phone 390px checks opened circuit map, photo references and model grid using Enter; focus entered each modal, reverse tabbing did not reach background controls, and Escape restored each opener. Grid row 3 handed back to the focused canvas and URL. F expanded the scene, then restored the bank selector. No horizontal overflow or page errors. Phone screenshot inspected with visible selector focus and retained accuracy label.
- Test correction: an initial assertion required reverse Tab to stay on a DOM child at all times. Native Chrome dialogs can expose body as focus moves through browser chrome. The corrected check permits that native boundary while rejecting any background page control; no custom focus trap or product change was justified.
- Change/publication: audit log only. No application defect demonstrated; no repeated unit suite, production rebuild or deployment. Application release remains v76.
- Limit: Chrome emulation does not certify every browser or assistive technology. External photo playback and calibrated seat accuracy are outside this focused check.
- Next useful check: inspect price-notebook storage lifecycle across multiple tabs or return to venue-specific camera recovery; preserve manual-quote and commercial boundaries.

## 26 November 2026 · User-requested all-race 3D diagrams

- Starting application: v76, application source `30227a9bb031ba428d8519fdd15e932badda9223`; current clean source `95d10c720e22f081e99089e5972365b688afdf21` includes two documentation checkpoints. User asked for 3D for all races.
- Changes: added an independent lazy-loaded Three.js circuit-diagram viewer and 27 community reference outlines covering all 47 listed race editions. Preserved the richer seating studies and all per-venue asset gates. Added event/season switching, orbit/overhead cameras, bounded zoom, keyboard controls, reset, optional illustrative marker, source/licence disclosure and data/graphics Retry. Source commit and MIT notice are retained in CIRCUIT-DIAGRAMS.md and research/circuit-layouts/source.json. Calendar coverage distinguishes 3D diagrams from seat studies. Sepang 2026 and Sakhir 2027 remain different physical identities.
- Validation: 10 layout/coverage/route tests passed; TypeScript passed before the final camera/layout adjustment and is rechecked by production build. Browser checks passed on 1440×1000, 390×844, 768×1024, 320×568 and 844×390: rendering, camera changes, zoom/reset, marker, correct physical venue after season changes and guide return. A measured toolbar region fixed the initially small artifact and phone control overlap; final diagram bounds stay clear of controls. All 47 editions / 27 outlines rendered in a separate coverage run with one canvas per page and no page errors. Actual WEBGL_lose_context and blocked data both recovered through Retry. Batched desktop/phone screenshots inspected; production build is part of publication.
- Publication: v77, source `71dcef4da5c346baf4e2b5f7741ccb224e8bb295`, succeeded at 18:01:41 UTC; matching GitHub push confirmed.
- Limits: community outline layout years are unverified. These are explicitly flat 3D plan diagrams, not terrain, measured bridges, buildings or seat previews. The upstream README acknowledges an initial Google My Maps circuit collection; only its MIT-distributed vectors are included, not Google tiles, media or mesh. Camera framing is a display treatment. The marker is neither telemetry nor a race-direction/speed claim. All exact-seat, current-category and vertical-context gaps remain; no commercial status changed.
- Next useful work: continue source-supported seat/terrain expansion from the retained mapping tracker without treating all-race diagram coverage as completed seating reconstruction.


## 26 November 2026 · User-requested race and championship integration preparation

- Starting application: v77, source `71dcef4da5c346baf4e2b5f7741ccb224e8bb295`; clean checkout. User asked for race/championship updates and API use, then explicitly selected integration preparation without an existing account/permission.
- Research: reviewed Jolpica data terms, endpoint documentation and rate limits; OpenF1 live/personal/commercial access descriptions; API-Sports product/terms. Jolpica/OpenF1 commercial data permission is distinct from code licences and domain/name permission. API-Sports documentation HTTP 403 was not bypassed. No API data collection or external message.
- Changes: added a Race Centre route and navigation, driver/team standings with point bars, independent published rounds, latest classification, separate provider schedule and upcoming-weekend 3D links. Added typed normalized schema, season/series validation, stale/failure states, optional visible-tab snapshot refresh, and a four-endpoint server-side preparation script gated before network access. Public feeds are empty/not-connected; sync does not deploy or create a live server. All existing 3D remains unchanged.
- Validation: 16 affected provider/schema/route/diagram tests passed, including zero-network permission gating, HTTP 429, missing-point rejection and a four-request fixture adapter. Actual disabled sync correctly exited 1 before network access. Four viewport checks (1440, 390, 320, 768px) covered unconnected states and season isolation. Fixture browser tests covered championships/results, distinct rounds, stale labels, error retention/recovery, no year carryover, no horizontal overflow/page errors; virtual-clock testing confirmed five-minute refresh, hidden-tab suspension and resume. Empty/populated desktop/phone screenshots inspected. Landing → Race Centre → correct Qatar diagram → guide → Race Centre passed. An inferred fixture type was corrected after the initial production type-check failure; the final production build is part of publication.
- Publication: v78, source `5786ac125789cabad74100e044d7c8d26d33fd4f`, succeeded at 18:10:57 UTC; matching GitHub push confirmed.
- Limits: no actual provider response, commercial approval, running collector or live timing was verified. Browser refresh only reads site snapshots. Fixture names/numbers are not published. Exact-seat/terrain gaps, partner activation and operator/privacy dependencies remain.
- Next useful work: obtain suitable data permission, verify a permitted real payload, then configure a bounded server collector and delivery; preserve published-versus-live and 3D simulation labels.


## 26 November 2026 · 18:11 UTC post-release checkpoint

- Focus: reconcile Race Centre release and latest owner steering immediately after publication. Before the 27 November 14:00 UTC deadline; clean checkout at `5786ac125789cabad74100e044d7c8d26d33fd4f`.
- Evidence: v78 native publication succeeded at 18:10:57 UTC with matching GitHub source. Its preceding pass already covered 16 tests, four viewport flows, fixture-based data recovery, refresh visibility behavior, the 3D handoff and final production build. No repeated unchanged browser, test or build work.
- Change/publication: exact v78 provenance recorded above; documentation only, no application deployment.
- Owner decision: prepare integration without an API account or commercial feed permission. Keep both racing snapshots disconnected, the collector gate closed and simulated 3D motion distinct from live timing. No further owner action is requested by this checkpoint.
- Limit: permission, real provider compatibility and server collection remain unverified; none is inferred from passing fixtures. All-race 3D diagrams do not resolve seat/terrain gaps.
- Next useful check: rotate to the personal price notebook's cross-tab storage lifecycle, or shared 3D diagram source/identity behavior, when another audit is due.

## 26 November 2026 · User-requested fan failure audit and fixes

- Starting application: v78, application source `5786ac125789cabad74100e044d7c8d26d33fd4f`; clean checkout `da0b27b81597da03ff8fdfe920f553e9e5f04750` includes the post-release log. User asked to find failures and improve the fan experience.
- Evidence: two-tab quote recording lost the first tab's new quote (`[100,150]` versus expected `[100,200,150]`); browser Back from a diagram focused BODY. Code and pending-button checks also showed incorrect repeat-form return focus and target-save focus loss. All-race diagram coverage removed the usefulness of the old filter for finding seat studies.
- Changes: added per-race locked latest-state merging and storage-event updates, preserving independent point/target changes, deletion and undo; stale/deleted forms cannot revive removed options. Retained session-only repeat recording after blocked writes. Restored actual dialog opener, asynchronous action and Back/Forward heading focus. Added Seat studies separate from All 3D views, with wrapping phone controls. Detailed findings and limits are in docs/fan-experience-audit.md. No new data claims, tracking, dependencies or commercial activation.
- Validation: 14 affected price/history, route and coverage tests passed. Browser journeys at 1440×1000, 390×844, 320×568 and 768×1024 passed filter counts (eight seat studies/references and 24 all-3D entries in 2027), no diagram-only seat entries, two-tab quote preservation, modal/target focus, undo, browser Back/Forward and no overflow/page errors. Separate simultaneous writes, external deletion with an open form, and repeat quotes under blocked storage passed. Narrow-phone screenshot inspected. An asynchronous undo assertion was corrected to await completion; pending-button focus loss was fixed before the passing confirmation. Final production build is part of publication.
- Publication: v79, source `4e6b2c43544889ec0f7dd89de7b292a2765eca51`, succeeded at 18:22:27 UTC; matching GitHub push confirmed.
- Limits: modern-browser Web Locks provide serialization; the fallback merge is not universal cross-process atomicity. Browser emulation is not physical-device certification. Live feeds, detailed-seat/terrain assets, operator and partner dependencies remain unchanged.
- Next useful work: continue bounded audits of map/scene source identity and long-name/text scaling, then improve verified detailed seating coverage when suitable assets exist.


## 26 November 2026 · User-requested all-stand discovery and catalogue expansion

- Starting application: v79, source `4e6b2c43544889ec0f7dd89de7b292a2765eca51`; clean checkout. User asked to include all stands at a venue instead of one. Existing detailed scenes already render all registered banks, but their initial seated camera and dropdown obscured venue-wide choice.
- Changes: default unspecified detailed-model cameras to the existing complete circuit framing; keep explicit shared seat/stand cameras. Added an expanded searchable model-bank list and venue-wide heading; selecting a listed bank opens its stand view with canvas focus. Added a shared searchable, coverage-filtered catalogue to race guides and diagram pages, using all existing model banks, reviewed area families and retained source-only entries. Each modeled bank has its own direct camera link; unsupported products retain original source links. Added Hungary 2027's fifteen named stand families, three hopping packages, four wheelchair/companion listings and GA from the reviewed current seller catalogue. HUNGARY-SOURCES.md records the boundary. No new stand placement or exact-chair geometry is invented.
- Validation: 27 affected catalogue, routing and geometry tests passed; the five catalogue tests passed again after adding the four accessible source listings. Four viewport browser journeys (1440, 390, 320, 768px) confirmed Monza's 30 modeled banks/14 source references, exact Vedano handoff, stand search, Qatar's all-five-bank default overview and the Hungary catalogue on a diagram page, without horizontal overflow or page errors. Final rendering checks waited for geometry-ready and loading dismissal; the initial model-ready-only captures were loading states. Desktop all-bank and phone catalogue screenshots inspected. TypeScript passed after a case-insensitive module-name collision and literal type were corrected. Production build is part of publication.
- Publication: v80, source `8618fb4ac50c754945a3a5de4c68d802d2309255`, succeeded at 18:32:37 UTC; matching GitHub push confirmed.
- Limits: reviewed catalogues cover 18 editions, not a complete verified inventory for all 47. Hungary source entries have no calibrated 3D camera or map boundaries. All existing inferred geometry, current-stock, source-year, live-feed and commercial limits remain.
- Next useful work: continue current-edition stand catalogue verification for missing venues and acquire suitable geographic/vertical evidence before expanding detailed stand models.


## 26 November 2026 · User-requested illustrative 3D for catalogue options

- Starting application: v80, source `8618fb4ac50c754945a3a5de4c68d802d2309255`; clean checkout. User specifically requested illustrative 3D for all the options.
- Changes: added a separate generic stand-concept route and catalogue actions/filter for 183 eligible viewing options. Five authored formats distinguish grandstands, open admission, hospitality, platforms and multiple-stand examples. Existing venue-model links remain intact; seven non-viewing services/references/programmes do not receive fabricated stands. Grandstand sample rows/positions are explicitly invented, and all concepts state they are not actual location previews. Original source notes remain; no geographic placement, current seat inventory or venue accuracy is implied. Added reduced-motion/on-demand/hidden-tab rendering and context-loss Retry.
- Validation: 12 concept/catalogue/route tests and TypeScript passed. Four viewport browser journeys (1440×1000, 390×950, 320×700, 768×1024) covered catalogue actions, sample rows/positions, separate GA/platform/multi formats without seat inputs, option switching, catalogue return and no overflow/page errors. Hospitality, actual WebGL context loss/Retry and cross-season invalid-option rejection passed. Initial test selector matched both the canvas and parent readiness attributes and was corrected to the parent; a JSX brace was corrected before successful checks. Desktop/phone orbit and sample-camera screenshots inspected. Final high-row aim was adjusted toward the example road and reconfirmed on phone; GA mound base was placed on the authored ground. Production build is part of publication.
- Publication: v81, source `331a64f2c329c2dc0d02bc6b95e88524dee3bc04`, succeeded at 18:43:23 UTC; matching GitHub push confirmed.
- Limits: these are shared generic formats, not bespoke actual stand geometry or ticket-seat previews. Actual source-only/needs_assets gates, 18-edition catalogue scope, live-feed and commercial prerequisites remain unchanged.
- Next useful work: continue source-supported stand/terrain reconstruction and audit concept-versus-venue distinctions; never relabel this illustration layer as mapped seat completion.


## 26 November 2026 · User-requested open-source championship connection

- Starting application: v81, source `331a64f2c329c2dc0d02bc6b95e88524dee3bc04`; clean checkout. User asked to replace the disconnected standings with an open source wherever possible.
- Research: verified F1DB's CC BY 4.0 data licence, primary source format and after-race publication cadence. Its independent dataset permits this attributed integration; Jolpica/OpenF1 gates remain untouched. Source metadata names come from release v2026.21.0. No account, payment, private API, block bypass or external message.
- Changes: connected real driver and constructor tables through bounded public GitHub YAML requests, with name metadata and allowlisted lookup of future IDs. Added visible source/licence/creator attribution, licence copy and adaptation notice. Five-minute auto-refresh defaults on, pauses while hidden, and preserves last-good data on failure. Real fallback snapshots were generated (2026: 25 drivers/11 teams; 2027: unpublished). Unknown wins/rounds stay unknown. Added the sync:f1db maintenance command, leaving the old gated collector unchanged. Race results and live timing remain separate.
- Validation: 15 affected F1DB/provider/schema tests and TypeScript passed. Real upstream fetch/normalization and browser CORS passed. Four viewport flows (1440×1000, 390×844, 320×700, 768×1024) verified populated driver/team tables, auto-refresh controls, future-season isolation and no overflow/page errors; phone screenshot inspected. Controlled 429, initial upstream outage and known-year 404 retained saved real standings. Virtual-clock source refresh, hidden-tab pause and resume passed. Existing public origin has no CSP blocking this source. Production build is part of publication.
- Publication: v82, source `7770c541ac72371bf62f995b1bb70b8393847bf8`; succeeded 26 November 2026 at 18:54:22 UTC. Matching GitHub push and production-origin fetch/attribution checks passed.
- Limits: F1DB updates after races and can be delayed/revised. Browser retrieval time is not official publication time, and the source does not supply a round/win field in these files. Team labels reflect recorded season entrants. This does not connect live timing, race-classification delivery or ticket inventory. Upstream availability and schema are external dependencies.
- Published v82, source `7770c541ac72371bf62f995b1bb70b8393847bf8`, succeeded 26 November 2026 at 18:54:22 UTC. Matching GitHub source pushed; production-origin public GitHub fetches and attribution verified. Next: maintain fallback snapshots and continue bounded UX/source audits.


## 26 November 2026 · User-requested references and connected journeys

- Starting application: v82, source `7770c541ac72371bf62f995b1bb70b8393847bf8`, clean checkout.
- Research: reviewed Suzuka’s official 2027 R seat viewing page and 2027 changes page, Singapore GP’s current 2027 grandstand/panorama page and the already-linked Hungary 2027 product catalogue. The attempted Hungaroring event URL was inaccessible and was not added. Suzuka explicitly describes changing fences and seat categories; source links retain those limits. No downloaded organizer imagery or fabricated photo references.
- Changes: shared reference hub connects each race’s stand catalogue, circuit diagram, available venue overview, championship, original product sources and dated existing attendee reports. Added direct source handoffs from detailed seating, diagrams, concepts and Vegas area explorer. Concept and detailed-model return actions restore the specific catalogue option and focus; invalid concepts return to the catalogue. Source-year labels remain visible, same-area matches use exact product IDs, and Sakhir reports are excluded from the Sepang 2026 Bahrain-named edition. Dated reports stay separate from organizer material and no third-party media loads in this hub.
- Validation: 16 catalogue/concept/route/reference tests passed. Browser checks at 1440, 768, 390 and 320 pixels verified no overflow, source links, exact-option return focus and existing report disclosure without embeds. Desktop and phone reference sections visually inspected. Follow-up checks passed for invalid-option recovery, diagram browser history, Vegas and detailed-model source handoffs, and exact model-bank return focus. Phone QA caught a crowded diagram header and a Vegas link hidden by existing compact-header CSS; both links were moved into visible page content and reconfirmed. Production build and publication follow through the supported workflow.
- Limits: source pages are manually reviewed references, not continuously verified ticket destinations, live prices or inventory. Missing photo coverage stays explicit. Generic concepts remain distinct from mapped venue models; no commercial integration or geographic coverage is claimed complete.
- Publication: v83, source `1e0ae7877d3175e4a9ba0f72b992017c370d06f0`; saved version `appgprj_6b03a10b6c388191a92912a1c2dfe070~appgver_289a993912f08191a3885f868d852210`, deployment `appgdep_6b0882a7db8881918e0bdbd1de04b37a` succeeded 26 November 2026 at 19:04:13 UTC. Matching GitHub push confirmed. Production build passed; owned preview stopped and checkout clean at delivery.


## 26 November 2026 · 19:04 UTC immediate post-release checkpoint

- Focus: reconcile the just-completed user-directed reference/navigation release; avoid repeating its completed tests and build or starting overlapping work.
- Evidence: current UTC 19:04:37, before the 27 November 14:00 UTC cutoff. Checkout clean at source `1e0ae7877d3175e4a9ba0f72b992017c370d06f0`; v83 deployment succeeded 24 seconds before this scheduled occurrence. Native release evidence and matching GitHub push are recorded above.
- Changes: documentation reconciliation only; no new application edits or deployment. No newly observed failure or owner action.
- Limits: exact venue assets, missing dated photo coverage and commercial approvals remain unresolved; this checkpoint does not certify every external destination or the full mapping programme.
- Next useful check: on the next occurrence, audit the pre-purchase shortlist-to-source journey and its keyboard/focus behavior using the current published source. Preserve the new reference hub and explicit source-year/illustration boundaries.


## 26 November 2026 · User-requested Japan and Jeddah stand media

- Starting application: v83, published source `1e0ae7877d3175e4a9ba0f72b992017c370d06f0`; documentation checkpoint `b9b39bb074c957a68a7400ac20b3b0dd22febd78` present and clean before this work.
- Research: bounded public metadata review of all nineteen Suzuka organizer stand pages found 193 linked YouTube clips and 157 non-map original-image links. Existing area IDs and original product URLs provide the identity match. Capture year remains unverified. Jeddah organizer terms restrict media copying/framing and automated collection without permission, so its gallery/map is an external handoff and no organizer image assets were copied. The ticket catalogue returned 403; no bypass was attempted. Separately verified YouTube oEmbed title/publisher for Race Experience’s reported 2025 Central Grandstand A clip. Details in `docs/stand-media-references.md`.
- Changes: lazy stand-media gallery in the shared reference hub, with stand/camera selectors, source camera labels, publisher/date limits, Suzuka region-map links and original photo/360 links. Standard privacy-enhanced YouTube player loads only on explicit action, with unload and focus restoration. Switching stand or camera unloads the prior player. Catalogue source disclosures link to the chosen media option; the URL preserves the stand choice. Japan A2/M/P show original still-image references without borrowed videos. Jeddah keeps all six products; only Central A receives the matched video, and the other five have missing-media states. Unknown or accessible source-only options do not inherit ordinary cameras.
- Validation: 12 affected media/reference/catalogue tests passed after correcting an invalid test fixture that itself had valid 11-character video-ID syntax. Four viewport browser checks (1440, 768, 390, 320 pixels) passed for no overflow, no pre-consent media requests, correct source frame, unload/focus, stand persistence and missing-video states. Representative real Suzuka and Jeddah provider players rendered their correct titles/channel/posters; screenshots inspected. Camera and stand switching, unmatched wheelchair reference and useful Jeddah default checked. No claim that all 193 historical clips were played or remain embeddable. Production build follows through supported packaging.
- Limits: still photos and organizer panoramas open at their original source; no licensed onsite image copy or Jeddah organizer-image embed is supplied. Media does not establish a 2027 capture date, actual model chair identity, exact current stand position or inventory. Video availability is controlled by its publisher and YouTube.
- Publication: v84, source `4c0c964e506d3f0bb3ecae2a839f9e91aaf25859`; deployment `appgdep_6b088537430081918bb3a96417f5b29e` succeeded 26 November 2026 at 19:15:08 UTC. Matching GitHub push confirmed.


## 26 November 2026 · User-requested onsite photos beside 3D

- Starting application: v84, source `4c0c964e506d3f0bb3ecae2a839f9e91aaf25859`, clean checkout. User specifically requested original photos inside the website and media linked to the selected 3D stand.
- Changes: original-host Suzuka photos now render inside an onsite viewer after explicit connection approval. Added next/previous, restricted-view/source labels, credit, fullscreen dialog, unload, loading/error/Retry and page-memory permission. One enabled connection carries across main-selector stand changes; a fresh document starts disabled. No image file, texture, proxy, persistent permission record or new dependency is added. Selected stand concepts show a media rail beside the scene on desktop and after it on phones; a single stand selector controls both, stale media-query parameters cannot override it, and duplicate lower-page galleries are suppressed. Source photo/video tabs, original-source links and a standalone gallery-to-combined-view action retain the exact option. The photo and video are not presented as calibrated to a model chair. Jeddah organizer images remain external; its independently published video is connected only to the source-reported Central A option.
- Validation: 11 affected data/reference/concept tests and TypeScript passed. Real original-host V1 and B2 images rendered (V1 native width 640), and desktop/phone screenshots were inspected. Four widths (1440/768/390/320) passed no-overflow, no pre-consent source requests, exact stand-photo changes, stale-query resistance, photo navigation, enlarge/Escape/focus, video unload on tab change and photo unload. Initial unload-focus timing was replaced with commit-time restoration; the full matrix then passed. Source-failure injection/Retry, Jeddah exact-selection/no borrowed photo, standalone reference-to-3D handoff and existing Hungary concept passed. Phone DOM order was aligned with the visual sequence. Production build follows supported packaging.
- Limits: Suzuka photos remain externally hosted; no rehosting permission is asserted, source availability/capture dates are not guaranteed, and 3D concepts remain generic. Jeddah still-image reuse requires relevant rights; no missing view is fabricated or taken from a neighboring stand.
- Publication: v85, source `110d2fedc3b55f12de730e322b7345a90bce5bf3`; deployment `appgdep_6b08885c0e348191a26705d1b9f606ef` succeeded 26 November 2026 at 19:28:32 UTC. Matching GitHub push and public-origin Suzuka image display (native width 640) confirmed.


## 26 November 2026 · User-requested all-circuit media connection

- Starting application: v85, source `110d2fedc3b55f12de730e322b7345a90bce5bf3`, clean checkout. User requested the connected photo/video experience for all circuits.
- Changes: removed the Japan/Jeddah-only UI gate. Added a media panel beside every one of the 47 race-edition circuit diagrams, throughout race guides/concepts, in all ten detailed model sidebars and the Las Vegas outdoor explorer. Exact main-stand selection now chooses the reference profile, unloads the previous stand's player, and retains source-only/unknown stand states. The standalone media selector links to the corresponding real model or generic concept. Dated original Reddit photo posts and attendee reports can be browsed inline with existing opt-in embeds; existing Bahrain/Monza/Silverstone viewing clips are reused only for exact source-product matches. Added primary-oEmbed-checked 2025 Race Experience videos for Hungaroring Platinum, Spa Silver 3 and Spa Fanzone; the separate Apex 1 candidate is not activated. Duplicate lower-page galleries are suppressed on combined diagram/concept screens. Focus-view or Vegas control-panel changes remount the new media panel, removing hidden players.
- Coverage: UI available for 47 calendar editions; 327 option profiles in eighteen reviewed editions; at least one matched photo/video/report in nine editions. Direct onsite stills remain Suzuka original-host images; other photo sources may be original-post embeds. These totals do not claim all circuits have actual photos or a stand catalogue. No geographic, precise-chair, inventory or commercial approval gate was changed.
- Validation: 18 affected catalogue/concept/reference/media tests and TypeScript passed. Browser traversal loaded the new panel and actual ready Three.js diagram for all 47 editions at desktop width without page errors or horizontal overflow. Four-width checks (1440/768/390/320) passed stand-player unloading, Canada report matching, Hungary concept/source pairing and explicit missing-media states. Primary title/channel metadata for all three new clips was checked. Early browser QA caught a lazy-import initialization order failure in the model explorer; it was fixed before the successful model, Qatar post and diagram journeys. Production build follows supported packaging.
- Limits: verified media remains incomplete. Older sources do not identify future exact seat views, venue-only material does not become a selected-stand match, and restricted organizer imagery is not copied. Maintain separate source/asset checks. Next useful check: obtain additional attributable stand references where coverage is empty, and keep source provenance/physical-year checks ahead of adding assets.
- Publication: v86, source `d5a00291940c8681f0ae1ddac9934abc0f2c5710`; deployment `appgdep_6b088ace257c8191867b0dcacd08c85d` succeeded 26 November 2026 at 19:38:58 UTC. Matching GitHub push confirmed.


## 26 November 2026 · User-requested icon alignment and spacing

- Starting application: v86, source `d5a00291940c8681f0ae1ddac9934abc0f2c5710`, clean checkout. Scope is alignment/spacing refinement; product, media coverage, source claims and 3D behavior are preserved.
- Evidence: rendered desktop catalogue and phone model-media panel showed stretched header action spacing, squeezed larger SVGs from a fixed 20-pixel flex basis, missing paragraph rhythm in model-panel media captions, and source/action links with inconsistent text/icon positioning.
- Changes: retain icon dimensions through an automatic flex basis; normalize reference/control icon boxes at 18 pixels, with existing larger editorial icons preserved. Group catalogue header actions and stack them at narrow widths. Align location icons with the first text line, indent wrapped location actions consistently, add label spans where wrapping needs control, align source actions in fixed icon/text/arrow columns, normalize tab/disclosure heights and paragraph gaps, group concept badges/actions, and use the existing arrow icon for photo navigation. No new dependencies, data source or business behavior.
- Validation: TypeScript and five-width browser paths (1440, 1024, 768, 390, 320 pixels) passed for square 18-pixel header icons, guide/model/photo-control layout, source disclosure and photo-next interaction, with no horizontal overflow or page errors. Desktop and phone before/after screenshots were inspected. No new unit tests for this reversible layout change; production build follows supported publication.
- Limits: media/source coverage and venue/seat accuracy remain as recorded in the previous release. Next useful check: continue the scheduled audit from actual current source without repeating this completed spacing pass.
- Publication: v87, source `c878fd1876230a642588eed220c3b62d2febf45f`; saved version `appgprj_6b03a10b6c388191a92912a1c2dfe070~appgver_3bb4d4e8260c81919c348c3bf95cdf41`, deployment `appgdep_6b088c0781a08191993affefe8bb3cad` succeeded 26 November 2026 at 19:44:11 UTC. Production build and matching GitHub push confirmed. Owned preview stopped; checkout clean at delivery.


## 26 November 2026 · 19:45 UTC immediate post-release checkpoint

- Focus: reconcile the just-delivered user-directed icon/spacing release and avoid repeating its completed five-width checks or build.
- Evidence: current UTC 19:45:39, before the 27 November 14:00 UTC cutoff. Checkout clean at `c878fd1876230a642588eed220c3b62d2febf45f`; v87 deployment succeeded about ninety seconds before this occurrence. The previous all-circuit release is also recorded with its completed 47-diagram traversal and source/coverage limits.
- Changes: documentation reconciliation only. No new application edit, failed check, deployment or owner action.
- Limits: the connected framework is global, but actual media, exact seat geometry and commercial prerequisites remain incomplete; the alignment pass does not resolve them.
- Next useful check: rotate to the pre-purchase viewing-shortlist and original-ticket-source handoff with keyboard/focus review, preserving the new spacing and source-year/media distinctions. Do not rerun unchanged scene or viewport sweeps at the next occurrence.


## 26 November 2026 · 20:00 UTC shortlist and source-handoff audit

- Starting application: v87, published source `c878fd1876230a642588eed220c3b62d2febf45f`; local documentation checkpoint `b92427fa310e34b33d885313b08cea8da0c7ca25`, clean checkout. Deadline check at 20:00:40 UTC, before 27 November 14:00 UTC. No active overlapping edit.
- Evidence: in the public Belgium 2027 guide, holding five real font requests and then selecting a shortlist option showed focus on that choice before font completion, followed by an unwanted move to `#circuit-guide`. The delayed anchor helper waited for fonts/components but did not yield to someone already interacting. This could interrupt choosing, copying or checking ticket information.
- Change: cancel pending anchor focus/scroll after pointer, keyboard, wheel or touch input; check the target is still connected and the hash unchanged immediately before the scheduled move. Untouched deep links still finish their intended focus/scroll. Added a repeatable browser regression script `scripts/audit-anchor-focus.mjs`; no product copy, layout, data, media, commercial gate or persistence behavior changed.
- Validation: five affected brief/route tests passed. Desktop 1440 and phone 390 browser cases passed delayed-font untouched navigation, pointer/keyboard/wheel interaction preserving focus, shortlist copy/download with byte-identical public briefs, cleared-check removal/focus, and correct Belgium 2027 ticket-source URL. The first untouched-link test checked before unrelated lazy content finished; it was corrected to await the intended anchor focus, after which the full ten-case script passed. Selected-stand keyboard return also passed at both widths. Source destinations were inspected as URLs, not verified for current stock or tracking attribution. Production build follows supported packaging.
- Limits: clipboard was replaced inside the test page to avoid changing the system clipboard. Downloads contain only public curated choices and manual test checkmarks. Manual checks do not establish seller verification. Existing precise-seat/media/commercial dependencies remain unresolved.
- Next useful check: rotate to shared 3D loading/recovery and keyboard selection on a currently supported venue, without repeating completed source-media/spacing sweeps or blocked asset requests.
- Publication: v88, source `689e3d854fbdb54a3f53c86eae7388fc85656a8a`; saved version `appgprj_6b03a10b6c388191a92912a1c2dfe070~appgver_659e153f09bc8191898887cc8bb0e7e1`, deployment `appgdep_6b089164fe848191bde46d6b14d033bb` succeeded 26 November 2026 at 20:07:05 UTC. Production build and matching GitHub push confirmed; owned preview stopped. This release metadata reconciliation is documentation only and needs no additional application deployment.


## 26 November 2026 · 20:28 UTC 3D recovery and keyboard audit

- Focus: one supported venue’s shared 3D loading/recovery and keyboard-position journey, rotating away from the completed shortlist/spacing checks.
- Starting state: published v88, source `689e3d854fbdb54a3f53c86eae7388fc85656a8a`; local documentation checkpoint `c5a57df`, clean checkout. UTC check 20:28:45, before 27 November 14:00 UTC. No concurrent local edits.
- Evidence/validation: read-only public-site Qatar 2026 North model at 1440 and 390 pixels, with reduced motion enabled. Actual renderer loaded; right/up keys updated the modeled position and URL. The complete model grid accepted row 16/position 40 and its 3D action returned focus to the canvas. Real `WEBGL_lose_context` loss displayed the unavailable state; Retry created a working scene without changing the selected bank/row/position URL. Passing-car controls switched between play and pause. Both browser paths passed without page errors. These are generated positions, not ticket seat identities or a historical replay.
- Changes: none to the application; documentation checkpoint only. No build or deployment repeated on unchanged source. No new failure or owner action.
- Limits: this covers one shared model journey on two browser viewports, not every GPU/browser or measured venue sightlines. Current media/precise-seat/commercial gaps remain unchanged.
- Next useful check: rotate to race-calendar search/filter and season/history edge states, including an empty result, without rerunning the complete venue rendering sweep or the recovery path just checked.


## 26 November 2026 · 21:00 UTC calendar recovery and history audit

- Starting application: v88, source `689e3d854fbdb54a3f53c86eae7388fc85656a8a`; local documentation checkpoint `e2380ca60eb92c3757bf5589107284bef0ff09af`, clean checkout. UTC check 21:00:43, before 27 November 14:00 UTC. No active concurrent edits.
- Evidence: read-only public-site desktop 1440 and phone 390 checks reproduced lost keyboard focus after clearing an empty race search. The Clear filters button disappeared when the 24 results returned, leaving focus on BODY instead of the race-search input.
- Change: attach a ref to the existing race search and return focus to it when clearing the empty-result filters. Search matching, result counts, URLs, source data, spacing and all other behavior remain unchanged.
- Validation: seven affected guide/search/route tests passed. One desktop and one phone browser journey passed keyboard empty-state recovery, search/filter reset, accent-free Sao Paulo matching, race selection, season reset, browser Back/Forward, unknown-race recovery and rejection of a malformed Qatar-to-Vegas seat link. Restored calendars matched the current 24/23 race records for 2027/2026; malformed cross-venue links showed the notice and no borrowed canvas. No page errors or horizontal overflow in those paths. No new unit test for this reversible focus refinement; production build follows supported packaging.
- Limits: these tests validate local snapshot navigation and focus, not current event stock, dates beyond the dated source snapshot, seller pages or exact seats. No external ticket form, clipboard or account was used.
- Next useful check: rotate to error/empty states in the new third-party reference panel, particularly explicit unload and fallback behavior with a denied provider request; do not repeat the completed calendar traversal.
- Publication: v89, source `599112ee709362e5f9acc8aaed5e6744701f90fe`; saved version `appgprj_6b03a10b6c388191a92912a1c2dfe070~appgver_cce07e7b76488191b47f5d7259b730a8`, deployment `appgdep_6b089edf9dcc8191aadc12fd082a6408` succeeded 26 November 2026 at 21:04:35 UTC. Production build and matching GitHub push confirmed; owned preview stopped. This exact release reconciliation is documentation only and needs no additional application deployment.


## 26 November 2026 · User-requested continued improvement: visual photo gallery

- Starting application: v89, source `599112ee709362e5f9acc8aaed5e6744701f90fe`; local release checkpoint `95bbf4cde16292ae615d8cc7eaf206b8d6309a73`, clean checkout. User explicitly asked to keep improving.
- Evidence: a failed-source image followed by keyboard Retry on the public site left focus on BODY after recovery. Enlarged photos had no next/previous navigation and ignored arrow keys; the viewer had to be closed before changing frames. Original-file provenance also pointed to the first file instead of the selected frame.
- Changes: added a bounded five-thumbnail strip, active selection, fullscreen previous/next/Left/Right/Home/End navigation with wraparound, sticky close controls and current-image source links. Source-caption/restricted-view/capture-year limits survive fullscreen. Reload/Retry is now a persistent control with an accessible busy state, so recovering an image does not remove the focused button. Added safe close focus while an image is loading. Thumbnails remain on the original host and load only after approval. No new assets, source claims, image proxy, tracking, dependency or mapping coverage.
- Validation: 13 affected media/reference/concept tests and TypeScript passed. Four-width browser paths (1440/768/390/320) passed no pre-consent media requests, five-preview bounds, fullscreen keyboard/button wraparound, Escape focus, current-image source link, unload, and no overflow/page errors. Injected image failure/Retry preserved focus and recovered thumbnails. An explicitly held image request verified closing during loading and no late focus steal after completion. A denied YouTube request retained the original-source fallback and explicit unload/focus. Desktop and phone thumbnails/fullscreen screenshots were inspected. QA caught thumbnail padding inherited from concept controls and a close-during-loading focus gap; both were corrected and confirmed. Production build follows supported packaging.
- Limits: this improves browsing of the existing matched media, chiefly Suzuka stills; it does not add photos for unsupported stands or calibrate generic 3D concepts to camera positions. External source availability and unknown capture dates remain explicit.
- Publication: v90, source `41341f4398ce103b350240de585b248936a66046`; saved version `appgprj_6b03a10b6c388191a92912a1c2dfe070~appgver_a1ba2e4c76fc8191b0f73e047ccf9e03`, deployment `appgdep_6b08a2f86b088191b35b2bc62aa3f1c1` succeeded 26 November 2026 at 21:22:07 UTC. Production build and matching GitHub push confirmed; owned preview stopped and checkout clean at delivery.


## 26 November 2026 · 21:30 UTC post-gallery-release checkpoint

- Focus: reconcile the user-directed gallery release, which already completed the preceding audit's planned third-party error/unload checks.
- Evidence: UTC 21:30:14, before the 27 November 14:00 UTC cutoff. Checkout clean at published source `41341f4398ce103b350240de585b248936a66046`; v90 succeeded about eight minutes earlier. Its four-width image/keyboard/failure/unload checks and build passed, including the explicit denied-provider cases. No concurrent edit or new reported failure.
- Changes: release metadata/documentation only. No repeated browser sweep, unchanged build or additional deployment.
- Limits: this does not add venue media or exact-seat evidence. Existing coverage and commercial prerequisites remain unresolved. No user action is needed for this checkpoint.
- Next useful check: rotate to initial-load performance and first useful interaction on the calendar/guide, using the existing production artifact and a bounded measurement before proposing code splitting; do not repeat the gallery polish or re-download source imagery.

## 26 November 2026 · 22:00 UTC calendar-load and reduced-motion audit

- Starting application: v90, source `41341f4398ce103b350240de585b248936a66046`; clean local release checkpoint `0888761ab4e749881a2c5577583fc829f62fd052`. UTC check 22:02, before the 27 November 14:00 UTC cutoff. No overlapping edits.
- Evidence: a fresh public-site phone calendar visit with reduced motion, 100 ms simulated latency, 200,000 bytes/sec download and 4× CPU throttling still downloaded and mounted the hero's 3D renderer. The measured script resources included roughly 1,026 KiB of decoded HeroScene/Fiber/World/Three/rendering/model/output JavaScript in addition to the 872 KiB entry. Search appeared in 2,389 ms and filtering took 116 ms in this single synthetic run. These are diagnostic observations, not field performance scores or a reliable before/after timing comparison.
- Change: reduced-motion visitors now begin with the existing illustrative poster and an explicit Load 3D control, matching the existing data-saver path. They can still load the static 3D scene. Normal-motion visitors retain automatic hero loading and pause/play. No geometry, photos, tracking, commercial activation or source claims changed.
- Validation: desktop 1440 and phone 390 browser paths confirmed no hero-module request or canvas before explicit loading, working calendar search, successful opt-in 3D readiness, disabled animation under reduced motion and no horizontal overflow. Normal-motion auto-loading and pause/play passed. Two existing hero-camera tests passed. Inspected the phone rendering; production build follows supported packaging.
- Limits: the main calendar entry remains approximately 872 KiB decoded in the prior artifact. This change avoids optional hero work for reduced-motion visitors; it does not resolve the large eager calendar/data bundle or establish better real-user timings. Next useful audit: measure which eager model/reference dependencies prevent the calendar from loading independently, then isolate only with a demonstrated benefit.
- Publication: v91, source `c304218acd3a445b69661dd32504f8d07330694d`; saved version `appgprj_6b03a10b6c388191a92912a1c2dfe070~appgver_8b8692e296ac8191a978313adf96c53f`, deployment `appgdep_6b08adf822d48191bcae4b57f1f8c104` succeeded 26 November 2026 at 22:09:00 UTC. TypeScript/production build and matching GitHub push passed. The 892.52 kB entry bundle warning remains. Owned preview stopped; exact release reconciliation is documentation only.

## 26 November 2026 · User-requested sitewide F1 color refinement

- Request: apply the treatment across the product and make the colors closer to F1. Interpreted “fall” as “all” and stated that assumption before work. Starting published application v91; clean documentation checkpoint `5494dff7ec9e16a5ae5c0c6c71c9759ff64839f5`.
- Evidence: the official formula1.com styles served on 26 November use #e10600, #15151e, #ca0500, #9d0400, #1c1c25, #26262b, #303037, #f7f4f1, #e0dedc, #cdcdcd, #606066 and #47464c. Existing explorers drifted into blue-tinted shells and several unrelated action-red shades.
- Changes: centralized shared UI roles in `src/theme.css` and applied them to all eleven existing stylesheets, including the calendar, guides, price notebook, venue catalogue, photo/video panels, 3D explorer shells and Race Centre. Primary actions now share red/white states; dark shells use neutral ink/charcoal and light surfaces use warm paper. Selected media/control hover retains a red state. Selection, caret and keyboard focus use the same palette. Geometry, team identifiers, source media and semantic foreground signals remain independent. Reduced-motion/data-saver behavior is preserved; standalone 3D routes are explicit navigation rather than automatic landing previews.
- Validation: twelve browser paths covered six main screens at 1440/390, with no page errors, overflow or failures in the computed leaf-text contrast scan. Additional 320/768 calendar and concept paths passed search, visible keyboard focus, selected photo/video hover/idle colors and no overflow; Vegas atlas passed desktop/phone layout checks. Inspected desktop concept, phone calendar/concept and tablet calendar screenshots. Corrected the selected-state hover cascade and the global focus color in the bounded confirmation pass. Action red contrasts 4.53:1 against paper and 3.65:1 against ink; lighter signal red stays reserved for dark marks. No unresolved shared color variables or whitespace errors. Production build follows supported packaging.
- Limits: this is a sitewide UI palette refinement, not new exact-seat evidence or additional media/venue coverage. The contrast scan excludes images, transparent/gradient backgrounds and non-leaf text; rendered checks supplement it, not certify all accessibility requirements. No data, seller agreements, ads, prices or championship feed policies changed.
