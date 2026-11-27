
## Control contrast regression · 26 November 2026

Start the local preview, then run `node scripts/audit-control-contrast.mjs http://localhost:5188`. The browser audit checks enabled calendar, schedule, catalogue/media tabs and Vegas directory controls at 390px and 1440px in default, hover, keyboard-focus, active, selected-hover and selected states. It composites CSS background colors and asserts at least 4.5:1 for text/icons, checks dark calendar-list metadata and verifies visible keyboard focus. It preserves the disabled 2027 unconfirmed-time control. It does not claim to measure arbitrary photograph overlays, transient animation frames or disabled-control contrast. Global button hover rules must not independently replace foreground colors across mixed light/dark surfaces.

## Inline race previews

All 47 editions map through `racePreview.ts` to 36 distinct rendered assets: 10 detailed venue studies, 25 outline studies and one explicitly 2026 Vegas reference. The source tests guard target race/year, PNG presence, Malaysia/Sakhir separation, Vegas reference year and full track-point framing on phone/wide panels. PNG/source hashes are retained in `public/circuit-previews/sources.json`.

To recapture, run the local preview, then `node --import tsx scripts/capture-race-previews.mjs http://localhost:5188 /tmp/race-previews`. Two bounded workers capture only the WebGL canvas, hiding overlaid controls/status. Wait for all captures before replacing public assets and updating manifest hashes. Preserve credits. This command does not publish anything.

Browser verification covered first-screen layout at 320/390/768/1440px, detailed and outline handoffs, preview play/pause, offscreen pause, reduced-motion framing, forced WebGL failure and data-saver still images. All 36 final PNGs decoded. These checks do not turn estimated stands or flat source outlines into exact ticket coordinates or live telemetry.
