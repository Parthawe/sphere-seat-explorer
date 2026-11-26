# Commercial pilot status

Updated 26 November 2026. This is a disabled referral component and a preparation workflow, not a proven monetization system. No active affiliate account/link, AdSense, analytics endpoint, conversion result or approved payout is supplied.

The owner confirms having written permission for the existing brand/domain. Keep the name/domain; record the document reference, relevant scope and review in private owner records before activation. Do not imply that this statement itself establishes an affiliate agreement or permission beyond that document. No DNS change, application, external message or account action has been made.

## Launch sequence

1. Record the permission document's scope for the commercial brand/domain. [Formula 1's guidelines](https://www.formula1.com/en/information/guidelines.4EOKE9RRqevL4niTK9kWyt) remain the public baseline; an unofficial-site disclaimer grants no additional rights.
2. Publish operator identity/contact and accurate Privacy/Terms for the actual setup. Those inputs have not been provided; do not fabricate policy promises or publish placeholder contacts.
3. Use the [Qatar category review](qatar-commercial-pilot.md) as the current strongest reference. Main, North, T2, T16 and Hill product identities have been rechecked. This is not a seller-specific deep-link mapping or exact-seat survey. Qatar is imminent; if approval misses its event, review a later race rather than repurposing its links.
4. Apply to one programme using the [official routes](affiliate-programmes.md). Obtain accepted agreement, domain acceptance, eligible commission base/rate, attribution window/model, reversals, payout schedule, fee/delivery/refund terms and permitted event/category deep links.
5. Use the partner's permitted sandbox or written confirmation to test attribution for the exact tracking/destination URLs. Record evidence privately. No fake orders or prohibited self-referrals. A local passing test cannot establish remote attribution.
6. Approve the [measurement plan](../commercial/measurement-plan.md), actual operator/privacy setup and pilot maintenance owner before collecting anything. The public pre-purchase journey already supports race selection, area comparison, source handoff and manual booking checks; already-owned-ticket orientation is separate.
7. Compare approved commission against maintenance costs. Only after an informative pilot consider whether an advertising experiment is worthwhile. No paid promotion or ads are enabled now.

## Programmes, not deals

[Gootickets](https://www.gootickets.com/en/p-31-affiliate-program/) advertises 2.5% and a EUR 100 payout minimum. The reviewed public page does not establish our eligible booking base, attribution window, refund deductions or payment timing. [P1 Travel](https://www.p1travel.com/en/partnerships/affiliate-programme) advertises Partnerize and a product feed but no fixed public rate. [Tickets.GP](https://www.tickets.gp/en/partners/content-creators) offers links/codes and contractual payment terms. No programme is ranked by headline commission. Public signup pages are not our earning links.

The [Qatar organizer FAQ](https://www.lcsc.qa/faq/formula-1r-qatar-airways-qatar-grand-prix-2026) names these sellers for this event. That is distinct from our programme acceptance and does not confirm inventory, every product, other events or price competitiveness. Preserve organizer links regardless of commission.

## What the implementation now checks

`src/commercialLaunch.ts` records owner-confirmed rights status separately from document review, operator/policies, maintenance ownership, mapping review, measurement approval and a global stop switch. These are recorded release inputs, not legal advice or automatic validation of documents. Missing evidence keeps activation blocked.

`src/ticketPartners.ts` additionally requires an accepted contract reference and reviewed terms, explicit per-link stop-sale status, a product matching the pilot venue registry's area/category/admission/duration/organizer source, current manual destination/category reviews and a permitted attribution-test record bound to the exact URLs. Sold-out or unknown availability reviews suppress referral links. Expired reviews, ended events, unsafe URLs and unknown categories fail closed. Referral rendering is scoped to the single selected pilot; no arbitrary two-seller cap exists.

These checks cannot read a remote checkout, guarantee stock, authenticate a contract or prove tracking worked. A seller may change terms/destination after review. Wording in `TicketSellerLinks` calls this a recorded review, not destination verification. Commission disclosure appears beside participating links with sponsored semantics. Final category, fees, delivery and refund terms require review and remain the seller's responsibility. Follow [FTC guidance](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) for clear nearby disclosures; a footer alone is insufficient.

The Qatar area panel now distinguishes the organizer's three-day product, admission and source from the modeled position before the 3D/ticket handoff. The dated price snapshot remains separate and is not live stock.

## Review operations

Use `commercial/review-ledger.csv` for non-identifying review records. Private contracts, permission documents, credentials and order reports stay outside Git. Name the maintenance owner before activation.

- Before each commercial release: run `npm run audit:partners`; manually open each exact seller destination using permitted access, inspect event/category/terms and record the result. This command exits unsuccessfully while launch gates or links are missing. It is not a web crawler.
- While active: review links at least daily during the event week, otherwise at least weekly, and immediately after notices of date/category/terms changes. Seven-day automatic expiry is a maximum backstop, not evidence that a link is currently correct.
- Sold out, wrong event/category, cancellation/postponement, unexpected redirects or disputed tracking: set the relevant link's `stopSale` or the pilot's global stop switch, publish, keep the organizer/reference route, and record the issue. Never silently substitute another stand/day or fake a discount.
- Before restoring a link: fresh mapping/availability/terms review, exact-URL attribution reconfirmation if URLs changed, reviewer, evidence reference and next review date.
- Reconcile partner pending/approved/reversed/paid totals in private reports. Use aggregate counts only; report unknown results as unknown. Maintenance and reversal costs belong in the decision.

No new writer or recurring automation was created. The existing product audit cannot replace a named commercial operator.

## Revenue model and advertising

`npm run model:revenue` uses the empty `commercial/revenue-inputs.json`. It outputs no estimate until inputs are supplied. Scenario arithmetic separates seller clicks, purchases, eligible value, commission, attribution loss, approval/reversal loss and costs. Actual contribution requires reported approved commission, costs, currency and a report reference. Unknown is not zero; publisher clicks are not paid orders. No forecast, audience result or live dashboard is fabricated.

AdSense is deferred until the referral pilot provides evidence. [Google's policy](https://support.google.com/publisherpolicies/answer/11112688?hl=en) excludes screens with low-value/no publisher content or under construction. Approval, real publisher/slot/ads.txt details, regional privacy/consent requirements and performance/layout review are separate later work. Do not add empty ad slots, Auto ads or scripts now.

## Remaining owner inputs

Permission document reference/scope, legal operator/public contact/country, approved public policies, one accepted affiliate agreement with issued tracking/deep links, permitted attribution evidence, and an approved measurement plan/maintenance owner. These cannot be completed by inventing credentials or changing code flags. Product work and research are ready for review; commercial activation remains blocked.
