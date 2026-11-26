# Race Centre data integration · 26 November 2026

## Current implementation

Race Centre is available at `?season=2026&screen=racing` and for 2027. It presents driver and team championships, latest race classification, retained upcoming weekends with 3D-diagram handoff, provider schedule, per-championship round, source/fetch time, stale and failure states. A successful published snapshot can optionally be checked every five minutes while the page is visible; this refreshes the site snapshot, not the provider directly. Hidden tabs make no refresh requests and resume when due. Refresh failures retain the last response and its old fetch timestamp. Season navigation starts a separate state.

Both public data files deliberately contain `not-connected` with empty arrays. No fictional drivers, standings, points, session times or result data are shipped. The current site has no connected live timing, provider polling or recurring deployment. Refreshing an unconnected feed does not activate one. The 47 existing 3D layout diagrams and supported seating studies remain unchanged; diagram markers and simulated cars do not become live race positions.

## Provider assessment

Jolpica documents schedules, results, driver standings and constructor standings in its Ergast-compatible API. Its code licence is separate from data permission: its terms restrict free data to non-commercial use and require contact for commercial use. Current terms: https://github.com/jolpica/jolpica-f1/blob/main/TERMS.md. Endpoint docs: https://github.com/jolpica/jolpica-f1/blob/main/docs/README.md. Rate limits: https://github.com/jolpica/jolpica-f1/blob/main/docs/rate_limits.md (4 requests/second and 500/hour when reviewed). An identifying user agent is required.

OpenF1 offers historical data and separately authenticated live access. Its website identifies personal/non-commercial uses and directs other uses to a licensing discussion: https://openf1.org/. Live API documentation: https://openf1.org/docs/. A sponsor subscription alone does not establish this commercial site's redistribution rights. No account, subscription, external message or provider data request was made in this release.

API-Sports is another possible supplier: https://api-sports.io/sports/formula-1 and https://api-sports.io/terms. Availability and third-party rights must be checked for the selected use. Its documentation page had no readable web lines and a normal HTTP request returned 403; no bypass or unverified API-Sports parser was added.

The owner explicitly selected preparation without an existing API account or commercial permission. Existing permission for the site name/domain is not assumed to cover third-party data.

## Prepared Jolpica adapter

`commercial/racing-feed.json` defaults to `enabled: false` with an empty commercial permission evidence reference. `npm run sync:racing -- 2026` (or 2027) exits before any network request while that gate is missing. Do not enable it without provider permission covering this domain, public display/redistribution, retention, updates and intended revenue model. Store an evidence reference, not private agreement contents or secrets, in the configuration.

After permission, the command requests only these four season-specific endpoints at `https://api.jolpi.ca/ergast/f1/`, using the custom identifying user agent and 15-second timeouts:

- `{season}/driverstandings.json`
- `{season}/constructorstandings.json`
- `{season}.json`
- `{season}/last/results.json`

Requests are sequential with a 300ms interval. A rate-limit, HTTP, parse, series or season error stops the update. A validated normalized response is written through a temporary file and atomic rename; failures leave the previous public snapshot unchanged. No credentials are put in browser code. Current documented Jolpica access needs no API key; future authenticated or alternate feeds need server-side secret configuration.

The adapter preserves fractional points and keeps driver, team and latest-result rounds independent. Missing scores are errors, not zero. The browser validates the season and schema. Provider schedule identifiers do not automatically map to ticket banks, physical circuit outlines or calendar edits. This avoids carrying an event or previous year's chair layout into the wrong venue. Fetched time measures retrieval, not official publication time or subsecond freshness. Published data may be delayed or revised.

The normalized payload and provider fixture were tested locally. No approved live/provider response was available, so actual provider compatibility, historical completeness, contractual entitlement and current event coverage remain unverified.

## Activation sequence

1. Obtain and review appropriate provider permission and current rate/retention/display terms. Confirm operator/contact/privacy dependencies already recorded in commercialLaunch.ts.
2. Test a permitted real response for the intended season against the adapter and schema. Verify races, identity and independent standings/result rounds against official results; retain published versus live timing labels.
3. Run the sync command and publish the resulting snapshot through the normal supported Site/GitHub workflow. The command prepares data only; it does not deploy.
4. For automatic provider updates, add a server cache/collector and bounded schedule with credentials outside source, provider-specific backoff, last-good snapshot retention and monitored deployment or delivery. That server/schedule is not part of this static preparation release. Browser refresh cannot substitute for it.
5. Add actual live timing only under a suitable feed agreement with authenticated server delivery, session identity, delay/connection labels and reliable coordinate alignment. Never drive 3D cars with unrelated circuits, stale coordinates or simulation while claiming live telemetry.
