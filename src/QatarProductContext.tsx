import { areaSource, areas, type AreaId } from './ticketing';

export default function QatarProductContext({area}:{area:AreaId}) {
  const product=areas.find(item=>item.id===area)!;
  return <section className="ticket-product-context" aria-label="Organizer product and model limits">
    <h4>Match the model to the ticket</h4>
    <dl><div><dt>Organizer product</dt><dd>{product.name} · 3-day</dd></div><div><dt>Event dates</dt><dd>27–29 November 2026 · Lusail</dd></div><div><dt>Seating</dt><dd>{product.kind}</dd></div></dl>
    <p>{area==='main'?'The seller assigns the real zone, row and seat. Our model cannot confirm that allocation.':area==='hill'?'This is general admission. A modeled position is a viewing example, not a reserved chair.':'Seats are unassigned within this stand. A modeled row or position does not reserve that spot.'}</p>
    <a href={areaSource(area)} target="_blank" rel="noreferrer">Organizer product details</a><span className="product-context-date">Product identity checked 26 Nov 2026; stock and exact sightlines unverified.</span>
  </section>;
}
