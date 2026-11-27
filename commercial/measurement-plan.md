# Referral pilot measurement specification

Referral-attribution status: proposed; partner order and commission measurement is not active. Separately, the owner authorized opt-in first-party product usage measurement and email-request storage on 27 November 2026. That implementation is described in docs/measurement-and-email.md and does not establish purchases or approved commission.

Use one event and one approved affiliate agreement first. Qatar 2026 is the reviewed category reference, not a promise that approval can arrive before its 27–29 November event. If prerequisites are not complete before it ends, stop; independently review the next event before changing the configured pilot.

## Funnel and denominators

- Qualified visit: a visitor intentionally enters the pilot race guide in Choosing tickets mode and selects a viewing region. Distinguish this from already-owned-ticket orientation. Define deduplication, retention, consent and time window before collection.
- Comparison: at least two public viewing areas selected. This expresses exploration, not intent to purchase.
- Seller click: explicit click on a labeled participating seller, for the same event/category. Separate organizer/editorial links. Publisher click records cannot prove attribution or purchases.
- Attributed order: the partner's report identifies an eligible order under the permitted attribution rules. Keep pending, rejected, refunded and approved states separate.
- Approved commission: partner-approved commission after reversals. Cash paid and receivables are separate. Use the contract's commission base and a single report currency; no implicit currency conversion.
- Contribution: approved commission minus hosting, licensed data, review time and other operating costs for the same period. Include the cost of manual upkeep. Paid acquisition stays off until evidence supports its cost.

Record the baseline period, pilot start/end, deduplication method, minimum informative sample, maximum maintenance spend and continuation decision before launch. No numerical success threshold or sample size has yet been agreed. Do not choose a convenient threshold after seeing results. If the sample is inadequate, label the result inconclusive.

## Data boundaries

An approved implementation may use only allowlisted event/season/public category and seller identifiers plus the minimal aggregate counts required by the decision. Never capture pasted ticket text, names, emails, booking numbers, barcodes, complete query strings, clipboard contents or exact modeled position histories. No tracking consent may be inferred from using the map. Choose the measurement service, lawful setup, notice, retention and consent approach with the actual operator before activation. Account reports belong in private owner records; commit only aggregate non-identifying evidence references.

## Revenue worksheet

`npm run model:revenue` reads `commercial/revenue-inputs.json`, initially empty. A scenario requires all eight inputs: visitors, sellerClickRate, purchaseRate, eligibleBookingValue, commissionRate, attributionRetention, approvalRetention, operatingCosts. Rates are fractions 0–1. Formula:

visitors × sellerClickRate × purchaseRate × eligibleBookingValue × commissionRate × attributionRetention × approvalRetention − operatingCosts

Attribution retention and approval retention are separate scenario assumptions; do not double-count an already net purchase rate. These are assumptions, never a forecast or observed payout. Unknown input means no estimate. Approved commission and cost totals require a report reference and explicit currency. Do not publish private reports or personal order data.

## Advertising decision

No AdSense or other display ads during baseline/pilot. Only consider a subsequent, separately approved experiment if referral contribution is measurable. Evaluate incremental ad income against lost approved commission, slower pages and operating/consent costs. Google account approval and a compliant implementation remain separate requirements.

## Pre-purchase usability evidence

Use `commercial/validation-log.csv` for consented, non-identifying research records. Start with people considering a purchase, not only ticket holders. Ask them to choose this race, compare two areas, explain assigned versus free seating, explain whether the model identifies a real chair, and find the corresponding category on the original seller page without completing checkout. Record observed confusion and the reason for continuing or stopping. Do not turn stated intent or an opened seller page into a purchase/conversion count. Keep the log empty until sessions actually occur; no participants or findings are invented.
