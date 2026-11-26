import UiIcon from "./UiIcon";
import { areaSource, areas, type AreaId } from './ticketing';

export default function QatarProductContext({area}:{area:AreaId}) {
  const product=areas.find(item=>item.id===area)!;
  return <section className="ticket-product-context" aria-label="Organizer product and model limits">
    <div className="product-quick-facts"><span><UiIcon name="calendar"/>27–29 Nov 2026 · 3 days</span><span><UiIcon name="seat"/>{product.kind}</span></div>
    <p>{area==='main'?'Assigned by the seller. Model rows do not match ticket seats.':area==='hill'?'General admission. A model position is not a reserved chair.':'Free seating within this stand. Model positions are not reservations.'}</p>
    <a href={areaSource(area)} target="_blank" rel="noreferrer"><UiIcon name="ticket"/>Organizer product details</a><span className="product-context-date">Product checked 26 Nov 2026 · stock and exact views unverified.</span>
  </section>;
}
