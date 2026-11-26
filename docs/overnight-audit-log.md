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
- Publication: prepared as the next code release; exact commit/version can be reconciled from native Sites history at the next audit.
- Limits: external source playback, author-reported location and capture date remain unverified; no media was downloaded or rehosted.
- Next useful check: calendar and race-page navigation, invalid URLs, season boundaries and back/forward restoration.
