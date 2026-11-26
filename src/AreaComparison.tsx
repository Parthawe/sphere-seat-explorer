import { useRef } from "react";
import { useListRemovalFocus } from "./useListRemovalFocus";
import type { VenueDefinition } from "./venueRegistry";
export default function AreaComparison({
  venue,
  saved,
  persistent,
  onSelect,
  onRemove,
  onClear,
  referencePrice,
}: {
  venue: VenueDefinition;
  saved: readonly string[];
  persistent: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  referencePrice?: (id: string) => { label: string; checkedAt: string; sourceUrl: string } | undefined;
}) {
  const root = useRef<HTMLElement>(null);
  const prepareRemoval = useListRemovalFocus(saved, root, () => root.current?.parentElement?.querySelector<HTMLButtonElement>('.area-actions > button'));
  if (!saved.length) return null;
  const showAccess = venue.areas.some((a) => a.access);
  return (
    <section ref={root} className="area-comparison" aria-label="Saved area comparison">
      <div className="section-line">
        <h2>
          Your area comparison <span>{saved.length}/3</span>
        </h2>
        <button onClick={() => { prepareRemoval(); onClear(); }}>Clear comparison</button>
      </div>
      <p className="comparison-scroll-hint">
        Scroll horizontally to see every column.
      </p>
      <div
        className="comparison-scroll"
        role="region"
        aria-label={`${venue.name} area comparison table`}
        tabIndex={0}
      >
        <table>
          <caption className="sr-only">
            {venue.name} {venue.season} · {venue.comparisonPeriod??`${venue.durationDays}-day products`} ·
            broad areas only
          </caption>
          <thead>
            <tr>
              <th scope="col">Viewing area</th>
              <th scope="col">Seating</th>
              {showAccess && <th scope="col">Published zone access</th>}
              <th scope="col">Race focus</th>
              <th scope="col">Location evidence</th>
              {referencePrice && (
                <th scope="col">{venue.durationDays}-day reference</th>
              )}
              <th scope="col">Selection</th>
            </tr>
          </thead>
          <tbody>
            {saved.map((id) => {
              const a = venue.areas.find((v) => v.id === id);
              if (!a) return null;
              const price = referencePrice?.(id);
              return (
                <tr key={id} data-comparison-id={id}>
                  <th scope="row">
                    <button onClick={() => onSelect(id)}>{a.name}</button>
                  </th>
                  <td>{a.kind}</td>
                  {showAccess && <td>{a.access || "Check organizer"}</td>}
                  <td>{a.focus}</td>
                  <td>{a.confidence}</td>
                  {referencePrice && (
                    <td>{price ? <div className="comparison-reference"><strong>{price.label}</strong><time dateTime={price.checkedAt}>Checked {new Date(price.checkedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'})}</time><a href={price.sourceUrl} target="_blank" rel="noreferrer" aria-label={`${a.name} reference price source`}>Source page</a></div> : "Check seller"}</td>
                  )}
                  <td>
                    <button
                      data-remove-comparison onClick={() => { prepareRemoval(id); onRemove(id); }}
                      aria-label={`Remove ${a.name}`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p>
        {referencePrice
          ? "Recorded reference prices, checked on the dates shown. Confirm current prices, fees and availability with the seller."
          : venue.comparisonPeriod
            ? 'Compare regions within this race. Ticket days and access vary by product; exact seats, prices and availability are not verified.'
            : `Same race and ${venue.durationDays}-day product duration. Compare track regions and location evidence; exact seats, prices and availability are not verified.`}{" "}
        {persistent
          ? "Saved on this device for this race and season."
          : "Device storage is unavailable; this comparison lasts only while this page is open."}
      </p>
    </section>
  );
}
