import { ticketPartnersEnabled, ticketPartners } from './ticketPartnerConfig';

export default function FundingDisclosure() {
  return <details className="funding-disclosure" id="funding-independence">
    <summary>Funding & independence</summary>
    <div><h2>Understand the view. Choose the seller.</h2>
      <p>This is an independent planning tool. It does not sell tickets, assign seats or provide live ticket inventory.</p>
      <p>{ticketPartnersEnabled && ticketPartners.length ? 'Participating sellers may pay us a commission when you book through a clearly labeled affiliate link. Organizer and reference links remain separate.' : 'There are currently no active paid ticket referrals or display ads on this site.'}</p>
      <p>Commercial relationships must not determine our viewing descriptions or model accuracy labels. A referral link does not verify a ticket’s availability, suitability or price.</p>
      <p>Our 3D scenes are estimated reconstructions. Rows, chairs and car movements are illustrative. Use the seller’s own category, seat and access information before paying.</p>
      <p>Display advertising is deferred while the ticket-referral pilot is evaluated. There are no analytics or advertising scripts added by this pilot.</p>
    </div>
  </details>;
}
