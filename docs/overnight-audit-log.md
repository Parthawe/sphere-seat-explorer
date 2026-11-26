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
- Publication: prepared as the next code release; reconcile exact source/version from native Sites history at the next audit.
- Limits: model positions remain illustrative and do not identify actual ticket rows or chairs. These checks do not certify touch accuracy for a physical phone or accessible venue routes.
- Next useful check: non-destructive comparison removal/clear focus and the three-position capacity message, without adding persistence or commercial tracking.
