import { useState } from "react";
import CircuitAreaMap from "./CircuitAreaMap";
import {
  abuAreas,
  locateAbuTicket,
  abuShareUrl,
  yasGeometry,
  ABU_CHECKED,
  ABU_CIRCUIT,
  ABU_FAQ,
  ABU_TICKETS,
  type AbuAreaId,
  type AbuMatch,
} from "./abuDhabi";
export default function AbuDhabiDesk() {
  const [area, setArea] = useState<AbuAreaId>(
    () =>
      abuAreas.find(
        (a) => a.id === new URLSearchParams(location.search).get("area"),
      )?.id || "main",
  );
  const [job, setJob] = useState<"find" | "locate">("find"),
    [text, setText] = useState(""),
    [match, setMatch] = useState<AbuMatch | null>(null),
    [feedback, setFeedback] = useState("");
  const chosen = abuAreas.find((a) => a.id === area)!;
  function choose(id: string) {
    setArea(id as AbuAreaId);
    setMatch(null);
    setFeedback("");
  }
  function locate() {
    const result = locateAbuTicket(text);
    setMatch(result);
    if (result.status === "matched") setArea(result.ids[0]);
  }
  async function share() {
    const url = abuShareUrl(location.href, area);
    try {
      await navigator.clipboard.writeText(url);
      setFeedback("Area link copied. Ticket details are not included.");
    } catch {
      setFeedback("Copy this area link: " + url);
    }
  }
  function openLocator() {
    setJob("locate");
    requestAnimationFrame(() =>
      document
        .getElementById("abu-ticket-panel")
        ?.scrollIntoView({ block: "start" }),
    );
  }
  return (
    <section
      className="ticket-desk abu-ticket-desk"
      aria-label="Abu Dhabi 2026 viewing areas"
    >
      <div className="desk-topline">
        <div>
          <h2>Find your Abu Dhabi viewing area.</h2>
          <p>
            Seven grandstand areas for the 2026 finale. These products span 3–6
            December; the race weekend is 4–6 December. Confirm the days
            included in your own ticket.
          </p>
        </div>
        <button className="abu-locator-shortcut" onClick={openLocator}>
          Locate my ticket
        </button>
      </div>
      <div className="ticket-workspace">
        <CircuitAreaMap
          name="Yas Marina Circuit"
          season={2026}
          points={yasGeometry.points}
          areas={abuAreas}
          selected={area}
          onSelect={choose}
          officialMap={ABU_CIRCUIT}
        />
        <div className="ticket-panel" id="abu-ticket-panel">
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
              <h3>Choose your grandstand.</h3>
              <p>
                Compare the track region with your ticket’s product name. North
                and North Straight are separate areas, as are West and West
                Straight.
              </p>
              <label htmlFor="abu-viewing-area">Viewing area</label>
              <select
                id="abu-viewing-area"
                value={area}
                onChange={(e) => choose(e.target.value)}
              >
                {abuAreas.map((a) => (
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
                Enter the grandstand, section, row and seat from your Abu Dhabi
                2026 ticket. We can match the broad area, not the exact chair.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  locate();
                }}
              >
                <label htmlFor="abu-ticket-details">
                  Ticket seating details
                </label>
                <textarea
                  id="abu-ticket-details"
                  maxLength={1200}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setMatch(null);
                  }}
                  required
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="North Straight Grandstand, Section A, Row 12, Seat 18"
                />
                <span className="private-note">
                  Processed only in this tab. Not uploaded or saved. Leave out
                  your name, booking number and barcode.
                </span>
                <div className="locator-actions">
                  <button type="submit" className="primary-button">
                    Locate my area
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setText(
                        "North Straight Grandstand, Section A, Row 12, Seat 18",
                      );
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
                      Only the grandstand region is located. Section, row and
                      chair positions are not verified. Use the seating plan in
                      the official ticket app for your assigned position.
                    </p>
                    <button
                      className="show-area-on-map"
                      onClick={() =>
                        document
                          .querySelector(".abu-ticket-desk .lusail-map")
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
                    locator supports Abu Dhabi 2026. Choose the correct race
                    from the calendar.
                  </p>
                )}
                {match?.status === "unknown" && (
                  <p className="locator-notice">
                    No supported standard grandstand found. Add Main, North,
                    North Straight, West, West Straight, Marina or South. A
                    section or seat alone is not enough. Club, suite, lounge,
                    Hill, hospitality and concert products are not mapped here.
                  </p>
                )}
                {match?.status === "ambiguous" && (
                  <div className="locator-notice">
                    More than one grandstand is named. Choose the one on your
                    ticket:
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
                          {abuAreas.find((a) => a.id === id)!.name}
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
              <span className="seating-tag">Seat selection offered</span>
            </div>
            <p>
              {chosen.description} The organizer offers seat selection for this
              product; your ticket confirms the assigned position.
            </p>
            <div className="abu-location-confidence">
              <strong>Location evidence</strong>
              <span>{chosen.confidence}</span>
              <p>
                {chosen.confidence === "OSM stand anchor"
                  ? "A named OpenStreetMap stand building anchors this broad area. Event boundaries, entrances and numbered seats are not verified."
                  : "The marker indicates a track region inferred from the organizer’s description. Its position is not a measured stand location."}
              </p>
            </div>
            <a
              className="abu-provider-primary"
              href={chosen.source}
              target="_blank"
              rel="noreferrer"
            >
              View this 2026 product with the organizer
            </a>
            <p className="reference-note">
              Source checked 23 Nov 2026. Prices, fees and availability must be
              confirmed with the seller.
            </p>
            <div className="area-actions">
              <button onClick={share}>Share area</button>
              <a href={ABU_FAQ} target="_blank" rel="noreferrer">
                Ticket app & delivery guidance
              </a>
            </div>
            <p className="desk-feedback" role="status">
              {feedback}
            </p>
          </div>
        </div>
      </div>
      <section className="abu-ticket-handoffs">
        <h2>Continue with a ticket provider.</h2>
        <p>
          Use the correct event and year at checkout. Apex Atlas does not
          reserve tickets or display live stock.
        </p>
        <div className="verified-event-links">
          <a href={ABU_TICKETS} target="_blank" rel="noreferrer">
            Organizer’s 2026 catalogue
          </a>
          <a
            href="https://tickets.formula1.com/en/f1-3312-abu-dhabi"
            target="_blank"
            rel="noreferrer"
          >
            F1 store · Abu Dhabi 2026
          </a>
          <a
            href="https://www.abudhabigp.com/en/authorized-onsellers"
            target="_blank"
            rel="noreferrer"
          >
            Organizer’s authorized seller list
          </a>
        </div>
      </section>
      <details className="ticket-methodology">
        <summary>Area accuracy, sources & ticket privacy</summary>
        <div>
          <p>
            The circuit line is adapted from OpenStreetMap. Four markers use
            named stand-building anchors; three indicate estimated regions from
            organizer descriptions. No marker establishes a surveyed 2026 stand
            boundary, entrance, section, row, chair or photographic sightline.
            This is not a navigation or accessibility map.
          </p>
          <p>
            Only the seven named standard grandstand products are supported.
            Main, North and other short names do not imply that a club, suite or
            hospitality variant shares the same access. Your ticket and the
            organizer’s app remain authoritative.
          </p>
          <p>
            The parser runs in your browser. Ticket text is not uploaded, stored
            or put into shared URLs. Sharing includes only the public race, year
            and area ID. External ticket sites have their own privacy and
            purchase terms.
          </p>
          <p>
            Product descriptions and seating: each selected area links its
            organizer source, checked {ABU_CHECKED}. Some organizer pages
            contain repeated generic highlight blocks; this map uses the
            product-specific description and seating guidance. Check the{" "}
            <a href={ABU_FAQ} target="_blank" rel="noreferrer">
              official FAQ
            </a>{" "}
            for app delivery and access.
          </p>
          <p>
            Geography ©{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
            >
              OpenStreetMap contributors (ODbL)
            </a>{" "}
            ·{" "}
            <a href="/data/yas-track.json" download>
              download adapted track and stand anchors
            </a>
            . A seat-level 3D preview and measured sightlines are unavailable
            for this circuit.
          </p>
        </div>
      </details>
    </section>
  );
}
