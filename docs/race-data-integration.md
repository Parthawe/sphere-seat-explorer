# Connected F1DB championship standings · 26 November 2026

## Current service

Race Centre now connects both championship tables to F1DB's public source data under CC BY 4.0, without an API key, paid account or commercial-permission placeholder. Source: https://github.com/f1db/f1db; licence: https://github.com/f1db/f1db/blob/main/LICENSE. This is published post-race data, not in-session live timing. Upstream release cadence is documented as after races; timing and correctness are not guaranteed.

Each Race Centre visit reads three public GitHub YAML files for the selected year: driver-standings.yml, constructor-standings.yml and entrants.yml under `src/data/seasons/{year}/`. The browser starts with an adapted saved snapshot, then replaces it with a validated fresh response. Refresh runs every five minutes by default while the page is visible, and can be switched off. Hidden tabs pause requests and resume only when due. Requests use the upstream HTTP cache rather than adding cache-busting query strings. No authenticated endpoint, third-party proxy, analytics or tracking script is used. GitHub receives ordinary public HTTP connection information, explained in the UI sources disclosure.

The real 2026 response contains 25 ranked drivers and 11 constructors when reviewed. The 2027 tables currently return 404 and display an explicit not-published state, with no borrowed 2026 scores. If a previously populated year becomes unavailable, the client retains its last good table or bundled snapshot and warns about the failed update instead of calling that known season unpublished.

Driver and team names come from F1DB release v2026.21.0, reduced to an ID/name lookup in `public/data/racing/f1db-identities.json`. It includes no biographies, portraits or visitor data. Unknown future IDs are resolved from bounded, allowlisted F1DB metadata files; missing or unsafe IDs fail closed rather than being invented. Team labels reflect the source's season entries, including multiple recorded teams where present; they are not a claim about the current active grid. Missing wins and published-round fields stay unknown, not zero. Latest race classification and provider schedule remain separate; this connection does not manufacture them from standings.

## Attribution and adaptations

Visible credit: F1DB by Marcel Overdijk and contributors, CC BY 4.0, with source and licence links. The full licence copy is served at `/data/racing/F1DB-LICENSE.txt`. Tables are normalized and names selected/reformatted; endorsement is not implied. The identity lookup records its release provenance and adaptation. Public data snapshots record the provider and actual retrieval time. Retrieval time is not official result-publication time.

The YAML dependency is used to parse the actual public format, with duplicate-key and alias-expansion rejection and bounded response sizes. Scores/positions, identities, duplicate ranks and schema/season are checked before replacing a table. A partial response, rate limit or malformed payload preserves prior good data. No previous year's table is substituted.

## Maintenance

`npm run sync:f1db -- 2026` or `2027` refreshes the site's outage snapshot using the same adapter, through a temporary file and atomic rename. It does not deploy. Publish updated fallback files through the supported Site/GitHub workflow when appropriate. Normal browser refreshes already retrieve the upstream tables without waiting for a new deployment; no recurring writer or deployment task was added.

The older `sync:racing` Jolpica adapter remains disabled in commercial/racing-feed.json. Jolpica and OpenF1 keep their separate commercial-data restrictions; this release does not override them or pretend an account is approved. F1DB's separately licensed open dataset is the active standings source. True live timing/telemetry would require another suitable connection and clear session/delay labels. Existing simulated 3D cars are unchanged.

## Verification

Live requests, normalization and local browser CORS succeeded against real F1DB data. Four viewport journeys verified both populated 2026 tables, source credit, automatic-refresh control, no horizontal overflow/page errors and the empty 2027 state. Controlled HTTP 429, initial source outage and missing known-season tables retained real saved standings. Virtual-clock checks covered automatic source refresh, hidden-tab suspension and resume. Unit coverage includes malformed scores, fractional points, unknown IDs, YAML safeguards, partial failures and season isolation.
