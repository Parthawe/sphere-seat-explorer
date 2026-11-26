import { findVenue } from "./venueRegistry";
import ViewingShortlist from "./ViewingShortlist";
import TicketPartners from "./TicketSellerLinks";
import { circuitGuideFor, circuitGuideSource, circuitTicketSource, circuitPublishedLength, CIRCUIT_GUIDES_CHECKED } from "./circuitGuides";
import { raceStatus, type Race } from "./races";

export default function CircuitGuidePanel({ race, coverage }: { race: Race; coverage: string }) {
  const guide = circuitGuideFor(race.season, race.slug);
  if (!guide) return null;
  const ticketUrl = circuitTicketSource(guide, race.season);
  const length = circuitPublishedLength(guide);
  const hasAreaMap = !!findVenue(race.season,race.slug);
  return (
    <section className="circuit-brief" id="circuit-guide" aria-labelledby="circuit-guide-title">
      <header>
        <div>
          <h2 id="circuit-guide-title">{guide.venue}</h2>
          <p className="circuit-brief-location">{guide.location}</p>
        </div>
        <div className="circuit-guide-actions"><span className="circuit-brief-coverage">{coverage}</span>{hasAreaMap&&<a href="#viewing-areas">Jump to viewing areas <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14m-6-6 6 6 6-6"/></svg></a>}</div>
      </header>
      <p className="circuit-brief-overview">{guide.overview}</p>
      <div className="circuit-brief-main">
        <div>
          <ViewingShortlist key={`${race.season}-${race.slug}`} race={race} guide={guide} />
        </div>
        <div className="circuit-brief-checks">
          <h3>Before you book</h3>
          <p className="booking-model-note">Views and map positions are estimates. Confirm your actual allocation, access and final price with the seller.</p>
          <details className="booking-evidence-disclosure"><summary>What the sources can tell you</summary>
          <dl className="booking-evidence">
            <div><dt>Circuit context</dt><dd>Linked F1 reference · {guide.referenceSeason}. Product names and access can change by year.</dd></div>
            <div><dt>Our maps & 3D views</dt><dd>Estimated viewing studies. Generated positions do not identify a purchased seat.</dd></div>
            <div><dt>Check with the seller</dt><dd>Actual seat, availability, final fees, cover, access and delivery.</dd></div>
          </dl></details>
          <p>{guide.ticketCheck}</p>
          {ticketUrl ? <a className="circuit-ticket-source" href={ticketUrl} target="_blank" rel="noreferrer">Open {race.season} ticket catalogue</a> : raceStatus(race) === "Past" && <p className="circuit-edition-note">Past race reference · {race.season}</p>}
        </div>
      </div>
      <TicketPartners race={race} />
      <details className="circuit-arrival-checks">
        <summary>Travel & sources</summary>
        <p>{guide.arrivalCheck}</p>
        <p>Need step-free access? Confirm the platform, companion ticket and entrance route with the provider.</p>
        <div className="circuit-brief-sources">
          <a href={circuitGuideSource(guide)} target="_blank" rel="noreferrer">F1 circuit reference · {guide.referenceSeason}</a>
          {!ticketUrl && guide.ticketPath && <a href={`https://ticketing.formula1.com/${guide.ticketPath}/`} target="_blank" rel="noreferrer">2027 travel reference</a>}
        </div>
        <p className="circuit-edition-note">{length !== undefined && `${length.toFixed(3)} km reference lap · ${guide.referenceSeason}. `}Checked {CIRCUIT_GUIDES_CHECKED}. {guide.referenceSeason !== race.season && `${guide.referenceSeason} circuit reference; confirm ${race.season} ticket details separately.`}</p>
      </details>
    </section>
  );
}
