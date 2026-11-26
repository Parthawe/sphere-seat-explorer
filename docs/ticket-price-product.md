# Ticket price intelligence · 26 November 2026

## What ships now

Every listed 2026/2027 race has its own personal price notebook. Users save an exact seller/product, admission dates, currency and one-adult all-in quote; later observations form an interactive history. A per-option budget target explains whether the last saved quote met that target. Notes persist in this browser, can be exported, and support deletion with undo. No account or personal ticket document is collected.

This is manual recording, not an automatic tracker. Empty notebooks contain no invented chart or prices. Observations are not seller-verified and do not establish stock. Different packages, sellers, currencies and years never merge into a price trend. No market-price forecast, cheapest-market claim or purchase recommendation is made. Public product links must use HTTPS without credentials, query parameters or fragments; a seller that requires query parameters needs a reviewed canonical product mapping before integration. There is no site-side earning attribution attached to these personal links.

## Research and data dependencies

- Google Flights supports route/date-specific tracking and significant-change emails: https://support.google.com/travel/answer/6235879?hl=en. This is the relevant interaction reference.
- GA4 measures activity/revenue sent by an integrated site: https://developers.google.com/analytics/devguides/collection/ga4/set-up-ecommerce. It does not supply a ticket-market price feed, and a seller redirect is not a purchase.
- Ticketmaster Discovery Feed release notes say price ranges were removed on 11 March 2025 and min/max price fields are null: https://developer.ticketmaster.com/products-and-docs/apis/discovery-feed/release-notes/. Do not build a live pricing promise around those fields.
- Gootickets publishes an application route, 2.5% headline commission and EUR 100 minimum payout: https://www.gootickets.com/en/p-31-affiliate-program/. Those advertised terms do not establish this site's approval, eligible commission base, permitted data access, cancellation deductions or attribution.
- P1 Travel and TicketsGP remain candidates in affiliate-programmes.md. No approval or price-feed access has been supplied.

A crawlable page, affiliate account and licensed price feed are different permissions. Do not bypass blocked collection, infer a historical series from a single price, import generic event price ranges as seat prices, or call reference prices live totals. The existing Qatar public-page snapshot retains its dated reference role and is not imported as fee-complete personal history.

## Next implementation once partner access is supplied

1. Record the permitted feed/API, retention/display rules, refresh limits and agreement reference. Obtain operator/contact and permission-scope evidence required by commercialLaunch.ts. Do not put secrets in browser code or source control.
2. Map each feed listing to an exact race edition, seller product, category/access, adult/child basis, admission dates, quantity, currency and fee completeness. Missing fee totals remain unknown; different bundles are separate products. Inventory is a separate time-stamped observation.
3. Collect append-only observations on a server within agreed limits. Keep collection failures distinct from price changes or sold-out stock. Enforce freshness, deduplication and source provenance; preserve last-good observations with stale labels. Show coverage per race rather than claiming every ticket.
4. Feed observed history into the same product journey. Use percent/absolute changes only for comparable observations. Add target alerts only after an actual delivery service, explicit subscription controls, unsubscribe, storage/retention terms and operator details are ready. Personal targets must not imply alerts are enabled now.
5. Test feed mapping and final checkout totals against partner-approved cases. Measure seller clicks separately from purchases and approved commissions; reconcile refunds and attribution losses using partner reports/postbacks.

## Revenue order

Approved ticket referrals are the first experiment. Preserve non-paying organizer links and disclose any commission beside a recommendation. Do not rank by commission or attach paid tracking to user-provided links. Existing commercial gates remain in force; an approved contract and tested exact destination/tracking link are required before activation.

Use partner reconciliation to measure approved commission minus operating costs. GA4 can later measure the pre-purchase journey only after the operator/privacy/consent work is resolved; it cannot independently establish a purchase on someone else's checkout. No analytics scripts, advertising, signup messages or affiliate applications are activated by this release.

Paid planning tools or advertising are later experiments requiring evidence of user demand and explicit product terms. Do not forecast earnings without qualified traffic, seller-click rate, approved conversion data, eligible value, attribution/reversal rates and operating costs.
