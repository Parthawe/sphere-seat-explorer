import type { Race } from './races';
import { partnersForRace, ticketPartners, ticketPartnersEnabled } from './ticketPartners';

export default function TicketPartners({ race }: { race: Race }) {
  const partners = partnersForRace(race, ticketPartners, ticketPartnersEnabled);
  if (!partners.length) return null;
  return <section className="ticket-partners" aria-label="Ticket affiliate links">
    <h3>Check ticket sellers</h3>
    <p>Affiliate links: we may earn a commission if you book through these links.</p>
    <div>{partners.map(partner => <a key={partner.seller} href={partner.url} target="_blank" rel="sponsored noopener noreferrer">{partner.seller}<span>{race.name} · {race.season}</span></a>)}</div>
    <small>Check the final price, fees, ticket category and seller’s terms. No live stock or lowest-price guarantee.</small>
  </section>;
}
