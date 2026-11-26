import { circuitGuideFor, circuitGuideSource, circuitTicketSource, circuitPublishedLength, CIRCUIT_GUIDES_CHECKED } from "./circuitGuides";
import { raceStatus, type Race } from "./races";

export default function CircuitGuidePanel({ race, coverage }: { race: Race; coverage: string }) {
  const guide = circuitGuideFor(race.season, race.slug);
  if (!guide) return null;
  const ticketUrl = circuitTicketSource(guide, race.season);
  const length = circuitPublishedLength(guide);
  return (
    <section className="circuit-brief" id="circuit-guide" aria-labelledby="circuit-guide-title">
      <header>
        <div>
          <h2 id="circuit-guide-title">{guide.venue}</h2>
          <p className="circuit-brief-location">{guide.location}{length !== undefined && <span> · {length.toFixed(3)} km reference lap ({guide.referenceSeason})</span>}</p>
        </div>
        <span className="circuit-brief-coverage">{coverage}</span>
      </header>
      <p className="circuit-brief-overview">{guide.overview}</p>
      <div className="circuit-brief-main">
        <div>
          <h3>Which part of the race do you want to see?</h3>
          <dl className="circuit-viewing-choices">
            {guide.viewing.map(view => <div key={view.name}><dt>{view.name}</dt><dd>{view.detail}</dd></div>)}
          </dl>
        </div>
        <div className="circuit-brief-checks">
          <h3>Check the product before the seat.</h3>
          <p>{guide.ticketCheck}</p>
          {ticketUrl ? <a className="circuit-ticket-source" href={ticketUrl} target="_blank" rel="noreferrer">Open F1’s {race.season} ticket page</a> : <p className="circuit-edition-note">{raceStatus(race) === "Past" ? "Past race reference." : "Use the event-year ticket sources on this page."} Current external catalogues may show a later edition.</p>}
          <p className="circuit-edition-note">Viewing regions are planning references. They do not certify an exact seat, unobstructed view, ticket availability or access to another zone.</p>
        </div>
      </div>
      <details className="circuit-arrival-checks">
        <summary>Arrival, accessibility & reference sources</summary>
        <h3>Plan the final part of the journey.</h3>
        <p>{guide.arrivalCheck}</p>
        <p>For step-free access, ask the provider to confirm the viewing platform, companion ticket, entrance and route from your arrival point. A nearby model bank does not verify an accessible route.</p>
        <div className="circuit-brief-sources">
          <a href={circuitGuideSource(guide)} target="_blank" rel="noreferrer">F1 circuit reference · {guide.referenceSeason}</a>
          {guide.ticketPath && <a href={`https://ticketing.formula1.com/${guide.ticketPath}/`} target="_blank" rel="noreferrer">F1 ticket & travel reference · 2027</a>}
        </div>
        <p className="circuit-edition-note">Checked {CIRCUIT_GUIDES_CHECKED}. The viewing choices paraphrase F1’s circuit guide; buying and arrival checks are planning guidance. {guide.referenceSeason !== race.season && `The linked ${guide.referenceSeason} reference does not establish ${race.season} ticket products or seating.`} Event layouts, product names and provider terms can change.</p>
      </details>
    </section>
  );
}
