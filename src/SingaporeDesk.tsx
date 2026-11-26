import { useAreaUrl } from "./useAreaUrl";
import { SITE_ORIGIN } from "./brand";
import { useRef, useState } from "react";
import CircuitAreaMap from "./CircuitAreaMap";
import AreaComparison from "./AreaComparison";
import { requireVenue, venueAreaUrl } from "./venueRegistry";
import { useAreaComparison } from "./useAreaComparison";
import {
  singaporeAreas,
  locateSingaporeTicket,
  SINGAPORE_CHECKED,
  SINGAPORE_TICKETS,
  SINGAPORE_MAP,
  SINGAPORE_RESELLERS,
  type SingaporeMatch,
} from "./singapore";
const venue = requireVenue("singapore", 2027);
export default function SingaporeDesk() {
  const ticketInput = useRef<HTMLTextAreaElement>(null);
  const [area, setArea] = useState(
    () =>
      venue.areas.find(
        (a) => a.id === new URLSearchParams(location.search).get("area"),
      )?.id || "pit",
  );
  const [job, setJob] = useState<"find" | "locate">("find"),
    [text, setText] = useState(""),
    [match, setMatch] = useState<SingaporeMatch | null>(null),
    [feedback, setFeedback] = useState("");
  const comparison = useAreaComparison(venue),
    chosen = singaporeAreas.find((a) => a.id === area)!;
  useAreaUrl(venue, area, setArea, "pit");
  function choose(id: string) {
    setArea(id);
    setMatch(null);
    setFeedback("");
  }
  function locate() {
    const result = locateSingaporeTicket(text);
    setMatch(result);
    if (result.status === "matched") setArea(result.ids[0]);
  }
  async function share() {
    const url = venueAreaUrl(SITE_ORIGIN, venue, area);
    try {
      await navigator.clipboard.writeText(url);
      setFeedback("Area link copied. Your ticket details are not included.");
    } catch {
      setFeedback("Copy this area link: " + url);
    }
  }
  function openLocator() {
    setJob("locate");
    requestAnimationFrame(() =>
      document
        .getElementById("singapore-ticket-panel")
        ?.scrollIntoView({ block: "start" }),
    );
  }
  return (
    <section
      className="ticket-desk singapore-ticket-desk"
      aria-label="Singapore 2027 viewing areas"
    >
      <div className="desk-topline">
        <div>
          <h2>Find your place at Marina Bay.</h2>
          <p>
            {singaporeAreas.length} grandstand products from the organizer’s current 2027
            catalogue. Explore a broad area, compare zone access or locate an
            existing ticket’s grandstand.
          </p>
        </div>
        <button className="abu-locator-shortcut" onClick={openLocator}>
          Locate my ticket
        </button>
      </div>
      <p className="singapore-reference-note">
        2027 ticket products · current street geography · estimated stand
        regions. Final event boundaries and exact seats are not verified. This
        pilot does not map Singapore 2026 tickets.
      </p>
      <div className="ticket-workspace">
        <CircuitAreaMap venue={venue} selected={area} onSelect={choose} />
        <div className="ticket-panel" id="singapore-ticket-panel">
          <div
            className="desk-jobs"
            role="group"
            aria-label="Ticket planning task"
          >
            <button
              aria-pressed={job === "find"}
              onClick={() => setJob("find")}
            >
              Find tickets
            </button>
            <button
              aria-pressed={job === "locate"}
              onClick={() => setJob("locate")}
            >
              I have a ticket
            </button>
          </div>
          {job === "find" ? (
            <div className="area-introduction">
              <h3>Choose a track region.</h3>
              <p>
                Start with the grandstand name. A zone number alone cannot
                identify a stand or an exact chair.
              </p>
              <label htmlFor="singapore-viewing-area">Viewing area</label>
              <select
                id="singapore-viewing-area"
                value={area}
                onChange={(e) => choose(e.target.value)}
              >
                {singaporeAreas.map((a) => (
                  <option value={a.id} key={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="locator">
              <h3>Where will I be?</h3>
              <p>
                Enter the grandstand, section, row and seat from your Singapore
                2027 ticket. Keep booking and personal details out.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  locate();
                }}
              >
                <label htmlFor="singapore-ticket-details">
                  Ticket seating details
                </label>
                <textarea
                  ref={ticketInput}
                  id="singapore-ticket-details"
                  required
                  maxLength={1200}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Padang Grandstand, Section A, Row 12, Seat 18"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setMatch(null);
                  }}
                />
                <span className="private-note">
                  Processed in this tab. Not uploaded or saved. Do not paste
                  your name, booking number or barcode.
                </span>
                <div className="locator-actions">
                  <button type="submit" className="primary-button">
                    Locate my area
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setText("Padang Grandstand, Section A, Row 12, Seat 18");
                      setMatch(null);
                    }}
                  >
                    Try an example
                  </button>
                  {text && (
                    <button
                      type="button"
                      onClick={() => {
                        setText("");
                        ticketInput.current?.focus();
                        setMatch(null);
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>
              <div aria-live="polite">
                {match?.status === "matched" && (
                  <div className="locator-match">
                    <strong>Viewing area matched</strong>
                    <span>
                      {chosen.name}
                      {match.section ? " · Section " + match.section : ""}
                      {match.row ? " · Row " + match.row : ""}
                      {match.seat ? " · Seat " + match.seat : ""}
                    </span>
                    <p>
                      Only the broad grandstand region is highlighted. Section,
                      row and chair coordinates are not verified. Check your
                      actual seat assignment with the organizer.
                    </p>
                    <button
                      className="show-area-on-map"
                      onClick={() =>
                        document
                          .querySelector(".singapore-ticket-desk .lusail-map")
                          ?.scrollIntoView({ block: "start" })
                      }
                    >
                      See area on map
                    </button>
                  </div>
                )}
                {match?.status === "wrong-event" && (
                  <p className="locator-notice">
                    These details appear to name another race or year. This
                    locator supports Singapore 2027. The 2026 layout is not
                    mapped here.
                  </p>
                )}
                {match?.status === "unknown" && (
                  <p className="locator-notice">
                    No supported grandstand found. Enter the full
                    grandstand name printed on your ticket. Combination
                    passes, walkabouts, accessible
                    platforms and hospitality are not mapped by this pilot.
                  </p>
                )}
                {match?.status === "ambiguous" && (
                  <div className="locator-notice">
                    More than one supported stand is named. Choose the one on
                    your ticket:
                    <div>
                      {match.ids.map((id) => (
                        <button
                          key={id}
                          onClick={() => {
                            setArea(id);
                            setMatch({
                              ...match,
                              status: "matched",
                              ids: [id],
                            });
                          }}
                        >
                          {singaporeAreas.find((a) => a.id === id)!.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="selected-area">
            <div className="area-title-row">
              <div>
                <span className="area-position">{chosen.position}</span>
                <h3>{chosen.name}</h3>
              </div>
              <span className="seating-tag">3-day product</span>
            </div>
            <p>{chosen.description}</p>
            <div className="singapore-zone-access">
              <span>Organizer’s published zone access</span>
              <strong>
                {chosen.zones === "4" ? "Zone 4" : "Zones " + chosen.zones}
              </strong>
              <p>
                Confirm access and permitted days on your ticket. This is not an
                entrance, walking-route or accessibility map.
              </p>
            </div>
            <div className="abu-location-confidence">
              <strong>Location evidence</strong>
              <span>Estimated region</span>
              <p>
                The marker is placed from the organizer’s product description on
                current OpenStreetMap streets. It is not a measured stand
                footprint or verified 2027 seat position.
              </p>
            </div>
            <a
              className="abu-provider-primary"
              href={chosen.source}
              target="_blank"
              rel="noreferrer"
            >
              Official product & 180° preview
            </a>
            <p className="reference-note">
              On the organizer’s page, choose “180° View”. Its preview is a
              reference, not a verified view from your exact seat. Sources
              checked 23 Nov 2026; prices and availability must be checked
              there.
            </p>
            <div className="area-actions">
              <button
                onClick={() => {
                  if (comparison.toggle(area))
                    setFeedback(
                      "Three areas saved. Remove one from the comparison to add another.",
                    );
                  else setFeedback("");
                }}
              >
                {comparison.saved.includes(area)
                  ? "Remove from comparison"
                  : comparison.saved.length >= 3
                    ? "Comparison full · 3/3"
                    : "Compare this area"}
              </button>
              <button onClick={share}>Share area</button>
            </div>
            <p className="desk-feedback" role="status">
              {feedback}
            </p>
          </div>
        </div>
      </div>
      <AreaComparison
        venue={venue}
        saved={comparison.saved}
        persistent={comparison.persistent}
        onSelect={choose}
        onRemove={id=>{comparison.remove(id);setFeedback('Area removed from comparison.');}}
        onClear={()=>{comparison.clear();setFeedback('Area comparison cleared.');}}
      />
      <section className="abu-ticket-handoffs">
        <h2>Continue with the official sources.</h2>
        <p>
          Purchases happen with the provider. The organizer’s catalogue uses
          AXS. F1 Tickets Online does not enter ticket queues, reserve seats or display
          live stock.
        </p>
        <div className="verified-event-links">
          <a href={SINGAPORE_TICKETS} target="_blank" rel="noreferrer">
            Organizer’s 2027 grandstands
          </a>
          <a
            href="https://ticketing.formula1.com/singapore/"
            target="_blank"
            rel="noreferrer"
          >
            F1 event page & waitlist
          </a>
          <a href={SINGAPORE_RESELLERS} target="_blank" rel="noreferrer">
            Organizer’s official reseller list
          </a>
        </div>
      </section>
      <details className="ticket-methodology">
        <summary>Reference year, accuracy, sources & privacy</summary>
        <div>
          <h3>What is supported</h3>
          <p>
            This pilot covers {singaporeAreas.length} 3-day grandstand products listed in the
            organizer’s current 2027 catalogue, including Marina Bay, Bayfront,
            Promenade, Raffles, Empress, Stamford, Super Pit, Pit Exit and
            Chicane @ Turn 2. Hospitality and multi-area passes remain unsupported. A location match does not
            verify a ticket or guarantee entry.
          </p>
          <h3>What the map shows</h3>
          <p>
            The track follows current OpenStreetMap street geometry. All
            viewing regions are estimates based on product descriptions, not
            surveyed 2027 stand boundaries, entrances, rows or chairs. The
            organizer’s published circuit map labels the 2027 event and is dated
            15 Oct 2026; it also says the map is illustrative and subject to
            change. Its artwork and photographs are linked, not republished
            here. No seat-level 3D preview is available for Singapore.
          </p>
          <p>
            Zone access is taken from each linked product description, checked{" "}
            {SINGAPORE_CHECKED}. Confirm current access, seating and dates with
            the provider. The circuit and products are not silently reused for a
            2026 ticket.
          </p>
          <h3>Ticket details stay in this tab</h3>
          <p>
            The parser runs locally. Raw text is not uploaded, persisted or
            included in shared links. Comparisons save only valid public area
            IDs on this device for Singapore 2027; Clear comparison removes
            them. Shared links contain the public year, race and area only.
            External providers have their own privacy and purchase terms.
          </p>
          <p>
            Official sources:{" "}
            <a href={SINGAPORE_TICKETS} target="_blank" rel="noreferrer">
              2027 grandstand catalogue
            </a>{" "}
            ·{" "}
            <a href={SINGAPORE_MAP} target="_blank" rel="noreferrer">
              organizer’s circuit map
            </a>{" "}
            ·{" "}
            <a
              href="https://www.formula1.com/en/racing/2027/singapore"
              target="_blank"
              rel="noreferrer"
            >
              F1 event and dates
            </a>
            . Geography ©{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
            >
              OpenStreetMap contributors (ODbL)
            </a>
            ;{" "}
            <a href="/data/singapore-track.json" download>
              download adapted track data
            </a>
            .
          </p>
        </div>
      </details>
    </section>
  );
}
