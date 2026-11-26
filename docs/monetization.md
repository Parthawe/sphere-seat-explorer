# Monetization setup

Researched 26 November 2026. No publisher account or affiliate approval has been supplied. No ads, affiliate cookies, tracking pixels or paid referrals are active in this release. Existing editorial/organizer links remain unchanged.

## Revenue approach

Start with event-specific ticket affiliate links after the race guide's booking advice. Show no more than two seller links, with a nearby commission disclosure. Keep the original organizer link visible. Do not call a seller cheapest or advertise a discount without a current, checked offer. Commissions must not change seat recommendations or map accuracy labels.

Use Google AdSense for publisher revenue, rather than Google Ads, which buys advertising. Once approved, trial one manually placed display unit below a substantive race guide. Keep ads out of all 3D scenes, seat controls and comparison tools. Avoid Auto ads, anchors, interstitials, autoplay video and popups. Do not reserve an empty advertising block before activation. Review actual revenue against loading time and completed seat explorations before expanding.

## Affiliate shortlist

| Programme | Public terms checked | Next action |
| --- | --- | --- |
| [Gootickets](https://www.gootickets.com/en/p-31-affiliate-program/) | Lists 2.5% per ticket sold and a EUR 100 minimum payout. Application approval required. Public page does not establish the cookie window or eligible commission base. | Apply and confirm event deep links, cancellation reversals, payout timing and whether this domain is accepted. |
| [P1 Travel](https://www.p1travel.com/en/partnerships/affiliate-programme) | Uses Partnerize; offers commission per generated booking and an event product feed. Public page does not publish a fixed commission rate. | Apply through its programme. Ask for rate, attribution window, deep-link permissions and feed access. Supports later expansion into other sports. |
| [TicketsGP](https://www.tickets.gp/en/partners/content-creators) | Referral links, audience codes and hosted ticketing sites offered. Commission and payout timing are contractual, with no public fixed rate. | Request a referral-link proposal first. Keep our own seat experience and checkout with the seller. |
| [MyGPTicket](https://www.mygpticket.com/fin/affiliate_program) | Public page describes up to 60 days between referral and order; rates are not stated. Requests website history and statistics. | Confirm current contract, supported events and reporting before applying. |

These are programmes to apply to, not approved partnerships or guaranteed earnings. No messages or applications have been sent. Obtain written acceptance of the publishing domain and intended promotional methods. Do not fabricate audience statistics.

Example arithmetic only: 2.5% of EUR 1,000 is EUR 25, if the whole EUR 1,000 qualifies under the contract. Fees, tax, refunds and the actual commission base may change the payout. A click alone does not establish a payable ticket sale.

## Naming issue before activation

[Formula 1's current guidelines](https://www.formula1.com/en/information/guidelines.4EOKE9RRqevL4niTK9kWyt) state that their permitted word marks cannot be incorporated into domains for commercialised websites. The current f1tickets.online domain contains F1. This is a direct published restriction, not a finding that we have permission or a legal determination about this site. Resolve with written rights-holder permission or adopt an independent brand/domain before commercial activation. The existing unofficial-site disclaimer does not itself grant rights. No rebrand or DNS change has been made here.

## AdSense prerequisites

1. Owner creates or uses their AdSense account and submits the accepted publishing domain: https://adsense.google.com/start/ . Google reviews original content, site eligibility and account details. Identity/payment/tax details belong to the owner.
2. Supply the real publisher ID, approved domain and verification instructions. Do not invent ca-pub identifiers, ad-slot IDs or ads.txt seller records. Add only Google's issued verification record and ads.txt entry.
3. Publish accurate Privacy, Terms, operator identity/contact and affiliate disclosures for the actual setup. The current site has no dedicated Privacy/Terms pages. These are open launch dependencies; do not publish invented business details or claim policy compliance.
4. Configure Google's certified CMP or another Google-certified provider for the EEA, UK and Switzerland, and applicable regional privacy choices. A custom Accept button is not a substitute. Test consent acceptance, refusal, revocation and region behavior before serving advertising.
5. Add the approved script and one manual responsive slot only after account/domain approval and consent integration. Keep global Auto ads disabled in AdSense itself; removing page slots does not necessarily disable account-controlled formats.
6. Check ad labeling, distance from ticket buttons, mobile layout, no-fill/ad-block behavior and 3D frame performance. No ad should resemble a booking action.

References: [Google eligibility](https://support.google.com/adsense/answer/9724?hl=en), [site readiness](https://support.google.com/adsense/answer/7299563?hl=en), [CMP requirements](https://support.google.com/adsense/answer/13554020), [Google CMP setup](https://support.google.com/adsense/answer/7670013?hl=en).

## Referral implementation

`src/ticketPartners.ts` holds the activation flag and event-specific approved links. It is intentionally disabled with no entries. Add the exact issued HTTPS deep link, seller display name, matching race slug/season, approval and review expiry. Recheck the event identity on the destination, including 2026/2027 venue differences. Do not copy an older season's tracking destination. Links with stale reviews, unsupported protocols, credentials, mismatched events or missing approval are omitted. Past races are omitted conservatively after the event's final date has passed everywhere.

`src/TicketSellerLinks.tsx` renders the optional block only when valid offers exist. It marks links sponsored and discloses commission beside them. There is no redirect endpoint, auto-navigation, click interception or first-party tracking. Affiliate attribution and cookies may occur on the destination site; describe that in the approved privacy notice before activation. Blank configuration adds no visible block or whitespace.

Owner inputs still required: accepted commercial brand/domain, account approval, partner-issued event links, operator/contact details and AdSense publisher/slot/consent settings. Revenue is not active until these are supplied and verified.
