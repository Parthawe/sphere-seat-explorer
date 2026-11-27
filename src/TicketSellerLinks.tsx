import { useEffect, useState } from 'react';
import type { Race } from './races';
import { partnerIssue, partnersForRace, ticketPartners, ticketPartnersEnabled } from './ticketPartners';

export default function TicketPartners({ race }: { race: Race }) {
  const [now, setNow] = useState(() => new Date());
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!ticketPartnersEnabled) return;
    const timer = setInterval(() => setNow(new Date()), 60000);
    const refresh = () => setNow(new Date());
    window.addEventListener('focus', refresh);
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);
  const partners = partnersForRace(race, ticketPartners, ticketPartnersEnabled, now);
  if (!partners.length) return message ? <p role="status">{message}</p> : null;
  return <section className="ticket-partners" aria-label="Ticket affiliate links">
    <h3>Check ticket sellers</h3>
    <p>Affiliate links: we may earn a commission if you book through these links. These are participating sellers, not a complete market comparison.</p>
    <div>{partners.map(partner => <a data-ticket-source key={partner.seller} href={partner.url} target="_blank" rel="sponsored noopener noreferrer" onClick={event => {
      if (partnerIssue(race, partner, new Date())) { event.preventDefault(); setNow(new Date()); setMessage('This seller link needs a fresh review. Use the event ticket catalogue above.'); }
    }}>{partner.seller}<span>{race.name} · {race.season}</span><span>{partner.product.category} · {partner.product.ticketDays} · {partner.product.admission}</span><span>Review recorded {partner.destination.checkedAt.slice(0,10)}</span></a>)}</div>
    <p>These links use recorded manual reviews. They do not check live stock or validate your exact seat.</p>
    <small>Seller order does not indicate price or quality. Confirm the final fees, ticket category and terms. No live stock or lowest-price guarantee.</small>
    <p role="status">{message}</p>
  </section>;
}
