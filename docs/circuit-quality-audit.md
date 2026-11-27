# Circuit quality audit · 27 November 2026

All 47 published race-edition exploration routes passed the 390×850 touch-viewport check. The test opens each edition’s appropriate route rather than borrowing a different year’s model. Outline views exercise overhead/orbit, zoom/reset and simulated traffic; seating studies exercise seated selection and zoom; Vegas follows its existing full-circuit action. Checks cover successful rendering, page errors and horizontal page overflow. This is browser emulation, not physical-device frame-rate testing.

| Edition | Experience tested | Result |
| --- | --- | --- |
| 2026:australia | Circuit outline | Passed |
| 2026:china | Seating study | Passed |
| 2026:japan | Circuit outline | Passed |
| 2026:miami | Circuit outline | Passed |
| 2026:canada | Circuit outline | Passed |
| 2026:monaco | Circuit outline | Passed |
| 2026:barcelona-catalunya | Circuit outline | Passed |
| 2026:austria | Circuit outline | Passed |
| 2026:great-britain | Circuit outline | Passed |
| 2026:belgium | Circuit outline | Passed |
| 2026:hungary | Circuit outline | Passed |
| 2026:netherlands | Circuit outline | Passed |
| 2026:italy | Circuit outline | Passed |
| 2026:spain | Circuit outline | Passed |
| 2026:azerbaijan | Circuit outline | Passed |
| 2026:bahrain | Circuit outline | Passed |
| 2026:singapore | Circuit outline | Passed |
| 2026:united-states | Circuit outline | Passed |
| 2026:mexico | Circuit outline | Passed |
| 2026:brazil | Circuit outline | Passed |
| 2026:las-vegas | Vegas full circuit | Passed |
| 2026:qatar | Seating study | Passed |
| 2026:united-arab-emirates | Seating study | Passed |
| 2027:bahrain | Seating study | Passed |
| 2027:saudi-arabia | Circuit outline | Passed |
| 2027:australia | Seating study | Passed |
| 2027:japan | Circuit outline | Passed |
| 2027:china | Circuit outline | Passed |
| 2027:miami | Seating study | Passed |
| 2027:canada | Seating study | Passed |
| 2027:monaco | Circuit outline | Passed |
| 2027:portugal | Circuit outline | Passed |
| 2027:great-britain | Seating study | Passed |
| 2027:austria | Circuit outline | Passed |
| 2027:belgium | Seating study | Passed |
| 2027:hungary | Circuit outline | Passed |
| 2027:italy | Seating study | Passed |
| 2027:spain | Circuit outline | Passed |
| 2027:azerbaijan | Circuit outline | Passed |
| 2027:turkey | Circuit outline | Passed |
| 2027:singapore | Circuit outline | Passed |
| 2027:united-states | Circuit outline | Passed |
| 2027:mexico | Circuit outline | Passed |
| 2027:brazil | Circuit outline | Passed |
| 2027:las-vegas | Vegas full circuit | Passed |
| 2027:qatar | Circuit outline | Passed |
| 2027:united-arab-emirates | Circuit outline | Passed |

Additional checks passed at 320, 820 and 1440px for the new circuit tools, and at 320px for the diagram route. The existing marker/navigation audit passed Qatar 1440/820/390/320, Monza 1440/390 and Melbourne 390. Position-input checks passed at 1440/390/320. Final desktop/phone graphics-context loss and Retry preserved working seating views. Initial all-circuit automation incorrectly expected a canvas on the Vegas product atlas; it was corrected to follow Open full circuit in 3D, then resumed from recorded successful routes.

The shared seating renderer now draws row bands for distant banks and constructs full chairs only for the active close view. Camera azimuth is fitted to the venue and usable viewport. Portable screens cap pixel ratio at 1.25 and shadow maps at 1024, with bloom omitted; desktop retains 1.5 and 2048. Distant pixel and chair work is reduced by construction; improved FPS has not been measured. Asphalt clones and postprocessing passes are disposed on teardown.

Circuit outlines now share a dark beveled presentation base, visible road edges, matte asphalt and reflected material lighting. The base and road widths are display treatments. They do not provide terrain, bridges, event barriers, stand locations or measured sightlines. Orbit, overhead, zoom and reset sit inside the scene on phones.

Existing coverage remains 10 edition-specific seating studies, 2 Vegas entries using the explicit 2026 reference, and 35 outline-only entries. Vegas-level venue reconstruction for every circuit remains dependent on usable spatial assets. No new stand coordinates, official seat inventory, media rights, live stock, commercial feed or historical telemetry was added.

Release: v126, source ff9e0eea5cefc5db90e092d629315f7b036727fd, pushed to GitHub main. Saved version appgprj_6b03a10b6c388191a92912a1c2dfe070~appgver_ab1f02ee3e70819185d21ca676de5f4d; deployment appgdep_6b0a02e89d7081918a75fa3dd5bb0f6f succeeded at 2026-11-27T22:23:41.380803+00:00. All 229 source tests and the final production build passed. The existing optional shader chunk-size warning remains. Native publication confirmed; direct custom-domain freshness was not independently checked. No new dependencies. Owned local preview stopped after verification.
