# Installable web app

The owner approved an optional, online-first home-screen experience. The existing renderer, race/seat URLs, database, domain and public audience remain intact.

## Installation

The web manifest uses a root identity, scope and start URL, standalone display and unrestricted orientation. Standard 192/512px, maskable 512px and Apple 180px PNG icons are rasterizations of the existing favicon. No external icon provider or new package is needed.

Install app is available beside the homepage viewing controls and in the shared footer. It is hidden in standalone windows and on private/privacy pages. Supporting browser prompts are captured but invoked only on a click. Dismissal leaves the action available without nagging. Apple devices, including touch-capable iPads reporting MacIntel, receive Safari instructions. Other browsers receive installation-menu guidance. Noncanonical site hosts link explicitly to f1tickets.online for installation; no forced redirects are introduced. Current browser URLs continue to work.

## Offline and updates

Production registers /sw.js at root scope. Registration or storage failures do not prevent website use. The service worker caches exactly /offline.html under f1tickets-offline-v1. This document has inline styling and a Retry action with no external assets. Root-path public navigation goes to the network; connection failure returns the offline document with status 503 at the original URL. Retry reloads that URL.

All APIs, authentication, private pages, subresources, external media and non-GET requests bypass interception. No guides, models, images, account data, signup requests or analytics responses enter Cache Storage. There is no background sync or signup retry queue. Existing browser HTTP caching is separate from this service-worker cache.

There is no skipWaiting, clients.claim or forced reload. New workers use the normal waiting lifecycle until old controlled clients close. Activation removes only obsolete f1tickets-offline-* caches. Bump the cache name when changing the offline document; leave unrelated caches intact. The Worker serves the manifest with application/manifest+json and the service-worker script as JavaScript, both with revalidation. Future releases must preserve these asset routes and hosting metadata.

## Measurement

Existing optional analytics consent, privacy signals, owner exclusion and public-context filtering apply. app_installed is sent only in response to the browser's confirmation event, never a click or accepted prompt. app_launch is recorded for standalone display or Apple's standalone signal after consent; a browser-tab session marker uses the same usage-session ID to deduplicate reloads. Blocked storage falls back to one launch in the current document. Platforms without an installation event cannot supply installation confirmations. These counts are not a census of installs or unique people.

Private Insights exposes the two aggregate event counts through its existing endpoint and tables. No database migration or runtime secret is required. Device-local comparisons and price notes are not newly synchronized. Installation is independent of analytics permission.

## Verification

Run npm test and npm run build. Start node scripts/serve-built.mjs, then node scripts/audit-web-app.mjs against its printed origin. Browser testing uses an isolated local database and simulated install/standalone events; it does not install an OS app or write production traffic.

The browser audit checks manifest diagnostics, install guidance and dismissal, accepted-prompt versus confirmed-install measurement, initial and late consent, standalone hiding and same-session reload deduplication, offline cache contents, API bypass, reconnecting at an original seat link, no forced reload on update checks, portrait/landscape Apple instruction emulation, and blocked storage/registration recovery. Unit tests cover cache exclusions, lifecycle, manifest/icon dimensions and private reporting. Physical iPhone/Android installation and OS-level standalone behavior require a separate device check.

Verification completed on 28 November 2026: all 245 tests and the production build passed. The bundled-Worker browser audit reported no Chromium installability errors and passed the installation/offline/consent/storage scenarios above. The existing measurement browser audit also passed signup, anonymous denial, private owner reporting at 1440/390px and privacy/signup layout at 320px. All simulated installation events, analytics writes and signup test records were confined to the isolated local database. No test installs, subscribers or traffic were seeded in production.
