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
- Publication: prepared as the next code release; reconcile exact commit/version from native Sites history at the next audit.
- Limits: this addresses heading readability and overlay geometry, not a full-site contrast certification or calibrated seat views.
- Next useful check: loading/error recovery and saved comparisons with unavailable or corrupted device storage.
