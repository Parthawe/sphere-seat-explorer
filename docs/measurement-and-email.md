# Visitor insights and email requests

Requested and authorized by the owner on 27 November 2026. Operator details supplied: Parth, pawar.d.parth@gmail.com, India. The owner chose signup storage first and has no newsletter service connected.

## What runs

The Vite/React client is retained. A small Worker serves the existing client assets through ASSETS and exposes same-origin JSON APIs backed by the Site's DB binding. Sites provisions D1 and applies the generated, schema-only Drizzle migration. The original project ID, domain and public audience are preserved. The former static hosting declaration is removed because storage and private APIs require the Worker.

Analytics is opt-in. Declining leaves /api/usage untouched. Global Privacy Control and Do Not Track override consent. A random tab-session reference, renewed after 30 minutes of inactivity, supports visits and is hashed before storage. This is a visit estimate, not a unique-person count. The server excludes signed-in owner requests. Records contain allowlisted page/race/season context, screen-size class, host-provided country where available, referral hostname, predefined interaction outcomes and coarse loading bands. Full query strings, ticket text, booking/seat numbers, clipboard contents, names, email addresses, raw connection addresses and user-agent strings are not stored in usage records. There are no third-party analytics scripts, advertising beacons or session recordings.

Events cover page views, scene attempts/readiness/failure, globe-flight start/completion/cancel/skip, modeled-bank selection, seated-view actions and labeled ticket-source clicks. Ticket-source clicks do not prove a purchase, attribution or commission. Current affiliate/advertising gates stay off. Optional product measurement does not activate the separate referral pilot.

The private /insights dashboard uses Sites' native sign-in and server-validated identity headers. The authenticated email must match INSIGHTS_OWNER_EMAIL, set from the Site's current owner record. Anonymous callers receive 401 for reports and 403 for email records; other authenticated accounts are rejected. There is no public dashboard key or client-side authorization flag. API and private-page responses are not cached; the dashboard is marked noindex.

Reports offer 7/30/90-day views, recorded visits and page views, device-size/country/referrer breakdowns, per-race load failures/slow loads, globe-flight outcomes, ticket-source clicks and separate signup-request counts. Empty states contain no fabricated history. The first period is a baseline, not evidence of sales or product-market fit. Dates use UTC; charts show recorded activity days only.

## Email request storage

The optional footer form requires a separate unchecked consent box. The database stores a normalized email, consent-notice version, creation date and unverified status. Existing requests are idempotent and receive the same generic success response. No mail is sent, no email ownership is certified and no subscriber is auto-enrolled in an external service. Before sending begins, connect a delivery provider, verify ownership and sender identity, and publish the relevant unsubscribe/delivery disclosures.

A signed, expiring form token, same-origin JSON checks, bounded bodies, a honeypot and short-lived keyed request limits provide basic intake protection. Where the host supplies a connection address, the rate-limit key is an hourly HMAC; raw addresses are not retained in the database. SIGNUP_SECRET is a server-only runtime secret. Do not put it in source or the browser bundle.

Only the owner can view up to 100 recent requests, export up to 5,000, or delete a request. CSV cells with spreadsheet-formula prefixes are escaped; review exports before importing into a delivery service. Visitors can withdraw a request through the supplied public contact address while delivery is inactive.

Usage older than 90 days and unverified requests older than 12 months are pruned on subsequent site activity. Expired limit records are also removed. This is request-driven cleanup, not a claim of an always-running deletion job.

## Configuration and maintenance

- .openai/hosting.json keeps the same project_id and declares d1: DB, r2: null.
- Runtime secret names: INSIGHTS_OWNER_EMAIL and SIGNUP_SECRET. Configure through Sites; preserve existing values on subsequent releases.
- db/schema.ts and drizzle/ contain the schema and generated migration. Applied migrations must not be rewritten.
- npm run dev:api starts a localhost-only D1-compatible preview using an ignored local SQLite file. Production data is separate.
- scripts/serve-built.mjs checks the built Worker and asset paths with an isolated in-memory database. Its local identity simulation is not imported into the production Worker.
- npm run db:generate creates future schema migrations. npm run build emits dist/client, dist/server/index.js, Worker configuration and hosting metadata.

The privacy notice at /privacy describes this actual setup and preserves the existing browser-local ticket/price-note boundaries. There is no claim of independently reviewed legal compliance.

## Verification

Meaningful server tests cover consent/origin rejection, private-field stripping, event deduplication, owner exclusion, owner-only reports/export/delete, explicit signup consent, duplicate submissions, unverified status, request size limits, missing-service errors, retention cleanup and signup request limits. Browser checks cover no analytics before consent, consented writes, exclusion of private URL fields, signup consent and saved receipt, denied analytics with successful independent signup, private dashboard access/layout, anonymous denial and the privacy page at phone/desktop widths. The same browser path is exercised against the bundled Worker and client assets, with test-only addresses in separate local databases. No test subscribers or invented traffic are seeded in production.

A local proxy origin mismatch was identified and fixed by preserving the original host. A mobile consent banner initially obscured a dashboard action; initial prompts are now omitted on private insights and privacy-information routes while explicit settings remain available. New setup keeps the existing one-family typography and adds no popup asking for an email during map exploration.

## Published release — 27 November 2026

Published v131 to https://f1tickets.online and the existing native Site domain. Implementation commit: 087db3eb8480a3960ac38bf5317b06dcfe87caf5. Saved version: appgprj_6b03a10b6c388191a92912a1c2dfe070~appgver_fd13a41a38f48191b2aeacfcd988f4d3. Deployment: appgdep_6b0a100a12cc8191bda7e83b8616018b, succeeded at 2026-11-27T23:19:42.698992+00:00, environment revision 1.

The hosted DB binding contains email_requests, request_limits and usage_events. Signup-token APIs responded successfully on both domains. Live anonymous report access returned 401 and email-list access returned 403. A request supplying forged authenticated-user headers was rejected with 401 by the real hosting path. No production test subscribers or fabricated usage were created.

Live checks exposed an asset-routing difference: the host's exact-key asset lookup returned 404 for direct Privacy/Insights links, and its index.html response canonicalized to the root. The Worker now resolves known page fallbacks and follows only same-origin asset redirects internally, preserving the browser's original page URL. Both /privacy and /insights returned HTML with status 200 after deployment; Insights also returned noindex,nofollow. The live phone-width sign-in page rendered successfully.

Validation: the full 239-test suite passed during v130 packaging. After the final asset-redirect fix, all six affected server tests, TypeScript checking and the production build passed for v131. Browser flows passed against both the development server and the bundled Worker using isolated local data. The entire 239-test suite was not rerun after that final routing-only fix.
