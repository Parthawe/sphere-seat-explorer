# Fan experience failure audit · 26 November 2026

Starting application: v78 (`5786ac125789cabad74100e044d7c8d26d33fd4f`), checkout `da0b27b81597da03ff8fdfe920f553e9e5f04750` includes the release log. The user requested a failure audit and fixes. Scope: race discovery, keyboard/history navigation and personal price-note integrity.

## Demonstrated failures and fixes

| Finding | Evidence before | Result |
| --- | --- | --- |
| High: another tab could overwrite a saved quote | Two tabs started with 100; recording 200 then 150 left `[100,150]` instead of all three quotes. | Read the latest notebook inside a per-race Web Lock when supported, apply local additions/deletions/target edits to that version, and update other tabs through storage events. Preserve independent quotes and targets. |
| Medium: browser history lost keyboard context | Race guide → diagram → browser Back left `document.activeElement` on BODY. | Back and Forward now request the existing navigation-heading focus restoration, including lazy screens. |
| Medium: price forms returned to the wrong action | Closing or saving a repeat quote always focused Add ticket option instead of its Log latest price opener. | Remember the actual opener, with a connected-element fallback. |
| Medium: asynchronous target save could drop focus | The pending Save button becomes disabled and loses native focus. | Retain the target form/input instance and restore its submit control after saving when focus fell to BODY. Removal/undo likewise recover to an available quote control. |
| Discovery gap: diagrams and seat studies were grouped | Every listed race now has a diagram, so the original 3D filter could not isolate richer seat studies. | Add a separate Seat studies filter and rename the broad filter All 3D views. Filters wrap on narrow screens. Reference-year Vegas remains labelled. |

Deleted-option forms cannot recreate an option removed in another tab. Undo applies its quote changes without replacing unrelated new entries. A target update does not replace quotes. Parse errors do not overwrite unreadable storage. If storage writes fail, further quotes remain in memory with the existing export/loss warning. Web Locks serialize supporting browsers; the fallback still merges the latest read but is not a universal cross-process atomicity guarantee. This is browser-local storage, not account or cross-device synchronization.

## Validation

- Four viewport journeys: 1440×1000, 390×844, 320×568 and 768×1024. Seat studies shows eight supported 2027 references/studies; All 3D views shows all 24 editions. Checked no diagram-only entry appears under Seat studies, no horizontal overflow or page errors, price form/target focus, two-tab recording, undo and history focus.
- Separate simultaneous-save test retained both new quotes; a form open during external option deletion could not resurrect it. Blocked storage still accepted a repeat in-memory quote and exposed export.
- Fourteen affected price/history, route and coverage tests passed, with new three-way merge, target, deletion and undo cases. Production build rechecks TypeScript.
- Narrow-phone calendar screenshot inspected. No physical-device or full assistive-technology certification is claimed. An intermediate browser assertion was adjusted to wait for asynchronous undo completion; the pending-button focus loss was separately fixed.

## Product boundaries still open

All 47 editions have reference 3D layout diagrams. These do not provide measured seats, current terrain or bridges. Existing richer seating studies remain illustrative and season-bound. Exact seat matching and further detailed worlds need suitable venue evidence/assets.

Race Centre integration is prepared but not connected, per the owner's decision. Live timing, server collection, provider permission and real-payload verification remain outstanding. Personal price notes are manually recorded, not live offers. Viewing shortlists still clearly say page-only and provide download; they do not imply account storage. Commercial referrals, ads and analytics remain inactive, with their existing evidence gates.
