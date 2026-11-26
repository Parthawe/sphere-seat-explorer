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
