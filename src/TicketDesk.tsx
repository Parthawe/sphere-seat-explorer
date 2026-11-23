import { useEffect, useState } from "react";
import {
  areas,
  areaSource,
  locateTicket,
  providers,
  providerUrl,
  FAQ,
  EVENT_MAP,
  CHECKED,
  type AreaId,
  type TicketMatch,
  type SourceSnapshot,
} from "./ticketing";
import geography from "./lusail-track.json";
const initialArea = () =>
  areas.find((a) => a.id === new URLSearchParams(location.search).get("area"))
    ?.id || "main";
const track = "M" + geography.points.map((p) => p.join(",")).join(" L") + " Z";
function CircuitMap({
  selected,
  onSelect,
}: {
  selected: AreaId;
  onSelect: (id: AreaId) => void;
}) {
  return (
    <div className="lusail-map">
      <div className="map-heading">
        <span>LUSAIL INTERNATIONAL CIRCUIT</span>
        <span>QATAR / 2026</span>
      </div>
      <svg
        viewBox="0 0 620 570"
        role="group"
        aria-label={`Lusail circuit with five approximate viewing areas. Selected: ${areas.find((a) => a.id === selected)!.name}. Select a marked area or use the buttons below the map.`}
      >
        <defs>
          <pattern
            id="atlas-grid"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M36 0H0V36"
              fill="none"
              stroke="#ffffff"
              strokeOpacity=".045"
            />
          </pattern>
          <pattern
            id="stand-lines"
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 1H5" stroke="#8a8b97" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="620" height="570" fill="url(#atlas-grid)" />
        <path
          d={track}
          fill="#20212b"
          stroke="#353744"
          strokeWidth="26"
          strokeLinejoin="round"
        />
        <path
          d={track}
          fill="none"
          stroke="#f0f1f4"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <path
          d={track}
          className="circuit-racing-line"
          fill="none"
          stroke="#e10600"
          strokeWidth="3"
          strokeDasharray="90 1800"
          strokeLinecap="round"
        />
        <g className="circuit-car">
          <circle r="5" fill="#f7bb4c">
            <animateMotion dur="19s" repeatCount="indefinite" path={track} />
          </circle>
        </g>
        <path
          d="M199 339L240 387"
          stroke="#9195a6"
          strokeWidth="4"
          strokeDasharray="4 4"
        />
        <text x="253" y="393" className="map-micro">
          START / FINISH
        </text>
        <path d="M208 319L252 378" stroke="#5a5d70" strokeWidth="11" />
        <text x="265" y="365" className="map-micro">
          PITS
        </text>
        <text x="126" y="199" className="map-micro">
          T1
        </text>
        <text x="179" y="254" className="map-micro">
          T2
        </text>
        <text x="310" y="456" className="map-micro">
          T16
        </text>
        {areas.map((a) => (
          <g
            key={a.id}
            className={`map-area ${selected === a.id ? "is-active" : ""}`}
            role="button"
            tabIndex={0}
            aria-label={`Select ${a.name} on map`}
            aria-pressed={selected === a.id}
            onClick={() => onSelect(a.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(a.id);
              }
            }}
          >
            <circle
              cx={a.x}
              cy={a.y}
              r={selected === a.id ? 32 : 22}
              className="map-area-halo"
            />
            <rect
              x={a.x - 14}
              y={a.y - 8}
              width="28"
              height="16"
              rx="2"
              fill="url(#stand-lines)"
              transform={`rotate(52 ${a.x} ${a.y})`}
            />
            <circle cx={a.x} cy={a.y} r="5" className="map-area-dot" />
            <text
              x={a.x + (a.id === "hill" ? -35 : 19)}
              y={a.y - 18}
              className="map-label"
            >
              {a.short}
            </text>
          </g>
        ))}
        <g transform="translate(549 63)">
          <path
            d="M0 27V0M-6 8L0 0L6 8"
            fill="none"
            stroke="#a3a6b7"
            strokeWidth="1.5"
          />
          <text x="-5" y="-9" className="map-micro">
            N
          </text>
        </g>
        <text x="34" y="524" className="map-watermark">
          LUSAIL
        </text>
        <text x="36" y="547" className="map-micro">
          GEOGRAPHIC TRACK · SCHEMATIC VIEWING AREAS
        </text>
      </svg>
      <div
        className="map-area-controls"
        role="group"
        aria-label="Viewing areas"
      >
        {areas.map((a) => (
          <button
            key={a.id}
            aria-pressed={selected === a.id}
            onClick={() => onSelect(a.id)}
          >
            {a.short === "Hill" ? "Lusail Hill" : a.short}
          </button>
        ))}
      </div>
      <div className="map-caption">
        <span>Area estimate · no row or seat coordinates</span>
        <a href={EVENT_MAP} target="_blank" rel="noreferrer">
          Official event map
        </a>
      </div>
    </div>
  );
}
export default function TicketDesk({ compact = false }: { compact?: boolean }) {
  const [area, setArea] = useState<AreaId>(initialArea),
    [job, setJob] = useState<"find" | "locate">("find"),
    [text, setText] = useState(""),
    [result, setResult] = useState<TicketMatch | null>(null),
    [snapshot, setSnapshot] = useState<SourceSnapshot | null>(null),
    [dataError, setDataError] = useState(false),
    [sellerFilter, setSellerFilter] = useState("all"),
    [feedback, setFeedback] = useState("");
  const [saved, setSaved] = useState<AreaId[]>(() => {
    try {
      const v = JSON.parse(
        localStorage.getItem("apex-qatar-2026-areas") || "[]",
      );
      return Array.isArray(v)
        ? v.filter((id) => areas.some((a) => a.id === id)).slice(0, 3)
        : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/ticket-sources.json", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then(setSnapshot)
      .catch((e) => {
        if (e.name !== "AbortError") setDataError(true);
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("apex-qatar-2026-areas", JSON.stringify(saved));
    } catch {
      /* unavailable storage does not block planning */
    }
  }, [saved]);
  const chosen = areas.find((a) => a.id === area)!;
  const priceFor = (id: AreaId) =>
    snapshot?.sources.find(
      (s) => s.id === id && s.status === "reference-price",
    );
  function choose(id: AreaId) {
    setArea(id);
    setResult(null);
    setFeedback("");
  }
  function submit() {
    const match = locateTicket(text);
    setResult(match);
    if (match.status === "matched") setArea(match.ids[0]);
  }
  function toggleSaved() {
    if (saved.includes(area)) setSaved(saved.filter((id) => id !== area));
    else if (saved.length < 3) setSaved([...saved, area]);
    else
      setFeedback(
        "Three areas saved. Remove one from the comparison to add another.",
      );
  }
  async function share() {
    const url = new URL(location.href);
    url.search = "";
    url.searchParams.set("season", "2026");
    url.searchParams.set("race", "qatar");
    url.searchParams.set("area", area);
    try {
      await navigator.clipboard.writeText(url.href);
      setFeedback("Area link copied. Your ticket details are not included.");
    } catch {
      setFeedback("Copy this area link: " + url.href);
    }
  }
  function start(task: "find" | "locate") {
    setJob(task);
    requestAnimationFrame(() =>
      document
        .getElementById("qatar-ticket-panel")
        ?.scrollIntoView({ block: "start", behavior: "instant" }),
    );
  }
  const reference = priceFor(area);
  return (
    <section className="ticket-desk" aria-label="Qatar 2026 ticket desk">
      {!compact && (
        <div className="ticket-intro">
          <div>
            <p className="eyebrow">NEXT RACE · 27–29 NOVEMBER 2026</p>
            <h1>
              Find your place
              <br />
              at the race.
            </h1>
            <p className="ticket-intro-copy">
              Understand the view. Compare the areas. Find a ticket seller, or
              locate the ticket you already own.
            </p>
            <div className="intro-ticket-actions">
              <button onClick={() => start("find")}>Find tickets</button>
              <button onClick={() => start("locate")}>Locate my ticket</button>
            </div>
          </div>
          <div className="next-race-stamp">
            <span>ROUND 22 / 2026</span>
            <strong>QATAR</strong>
            <span>Lusail International Circuit</span>
            <a
              href="https://www.formula1.com/en/racing/2026/qatar"
              target="_blank"
              rel="noreferrer"
            >
              Official race weekend
            </a>
          </div>
        </div>
      )}
      <div className="desk-topline">
        <div>
          <span className="eyebrow">QATAR 2026</span>
          <h2>Explore the viewing areas.</h2>
        </div>
        <span className="desk-coverage">
          5 mapped areas · approximate locations
        </span>
      </div>
      <div className="ticket-workspace">
        <CircuitMap selected={area} onSelect={choose} />
        <div className="ticket-panel" id="qatar-ticket-panel">
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
          {job === "locate" ? (
            <div className="locator">
              <h3>Where will I be?</h3>
              <p>
                Enter the stand, zone, row and seat printed on your Qatar 2026
                ticket. We’ll match the viewing area.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                <label htmlFor="ticket-details">Ticket seating details</label>
                <textarea
                  id="ticket-details"
                  value={text}
                  maxLength={1200}
                  onChange={(e) => {
                    setText(e.target.value);
                    setResult(null);
                  }}
                  placeholder="Main Grandstand, Zone A/B, Row 12, Seat 18"
                  autoComplete="off"
                  spellCheck={false}
                  required
                />
                <span className="private-note">
                  Processed in this tab. Not uploaded or saved. Leave out your
                  name, booking number and barcode.
                </span>
                <div className="locator-actions">
                  <button className="primary-button" type="submit">
                    Locate my area
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setText("Main Grandstand, Zone A/B, Row 12, Seat 18");
                      setResult(null);
                    }}
                  >
                    Try an example
                  </button>
                  {text && (
                    <button
                      type="button"
                      onClick={() => {
                        setText("");
                        setResult(null);
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>
              <div aria-live="polite">
                {result?.status === "wrong-event" && (
                  <p className="locator-notice">
                    This locator supports Qatar 2026. Those details appear to
                    name a different race or year. Choose that race from the
                    calendar; its exact seating may not be mapped yet.
                  </p>
                )}
                {result?.status === "unknown" && (
                  <p className="locator-notice">
                    No supported viewing area found. A row, seat or zone alone
                    is not enough. Add Main Grandstand, North, T2, T16 or Lusail
                    Hill, or select an area on the map. Hospitality locations
                    are not mapped here.
                  </p>
                )}
                {result?.status === "ambiguous" && (
                  <div className="locator-notice">
                    More than one area is named. Choose the one on your ticket:
                    <div>
                      {result.ids.map((id) => (
                        <button
                          key={id}
                          onClick={() => {
                            setArea(id);
                            setResult({
                              ...result,
                              status: "matched",
                              ids: [id],
                            });
                          }}
                        >
                          {areas.find((a) => a.id === id)!.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {result?.status === "matched" && (
                  <div className="locator-match">
                    <strong>Viewing area matched</strong>
                    <span>
                      {chosen.name}
                      {result.zone ? " · Zone " + result.zone : ""}
                      {result.row ? " · Row " + result.row : ""}
                      {result.seat ? " · Seat " + result.seat : ""}
                    </span>
                    <p>
                      {chosen.id === "main"
                        ? "Your ticket details are recognized. The highlight shows the broad stand area; zone, row and chair positions are not verified."
                        : "This area uses unassigned viewing. A row or seat in pasted text does not establish an assigned chair here."}
                    </p>
                    <button
                      className="show-area-on-map"
                      onClick={() =>
                        document
                          .querySelector(".lusail-map")
                          ?.scrollIntoView({
                            block: "start",
                            behavior: "instant",
                          })
                      }
                    >
                      See area on map
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="area-introduction">
              <p className="eyebrow">CHOOSE YOUR VIEW</p>
              <h3>
                Choose where
                <br />
                you watch.
              </h3>
              <p>
                Select an area on the map, then compare seating and published
                reference prices before visiting a seller.
              </p>
              <label htmlFor="viewing-area">Viewing area</label>
              <select
                id="viewing-area"
                value={area}
                onChange={(e) => choose(e.target.value as AreaId)}
              >
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="selected-area">
            <div className="area-title-row">
              <div>
                <span className="area-position">{chosen.position}</span>
                <h3>{chosen.name}</h3>
              </div>
              <span className="seating-tag">{chosen.kind}</span>
            </div>
            <p>{chosen.description}</p>
            <div className="reference-price">
              <div>
                <span>Published by Lusail · 3 days</span>
                <strong>
                  {reference
                    ? new Intl.NumberFormat("en", {
                        style: "currency",
                        currency: "QAR",
                        maximumFractionDigits: 0,
                      }).format(reference.price!)
                    : "Check with seller"}
                </strong>
              </div>
              <a href={areaSource(area)} target="_blank" rel="noreferrer">
                View source
              </a>
            </div>
            <p className="reference-note">
              {reference
                ? `Reference price checked ${new Date(reference.checkedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}. Availability and final total are not verified.`
                : dataError
                  ? "Price snapshot unavailable. Visit the organizer for the current price and availability."
                  : snapshot
                    ? "No readable price in the public snapshot. Check the organizer’s page."
                    : "Loading public source snapshot…"}
            </p>
            <div className="area-actions">
              <button onClick={toggleSaved}>
                {saved.includes(area)
                  ? "Remove from comparison"
                  : saved.length >= 3
                    ? "Comparison full · 3/3"
                    : "Compare this area"}
              </button>
              <button onClick={share}>Share area</button>
              <a href="#ticket-sellers">Find sellers</a>
            </div>
            <p className="desk-feedback" role="status">
              {feedback}
            </p>
          </div>
        </div>
      </div>
      {saved.length > 0 && (
        <section className="area-comparison" aria-label="Saved area comparison">
          <div className="section-line">
            <h2>
              Your area comparison <span>{saved.length}/3</span>
            </h2>
            <button onClick={() => setSaved([])}>Clear comparison</button>
          </div>
          <div className="comparison-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Viewing area</th>
                  <th scope="col">Seating</th>
                  <th scope="col">Race focus</th>
                  <th scope="col">3-day reference</th>
                  <th scope="col">Selection</th>
                </tr>
              </thead>
              <tbody>
                {saved.map((id) => {
                  const a = areas.find((a) => a.id === id)!,
                    p = priceFor(id);
                  return (
                    <tr key={id}>
                      <th scope="row">
                        <button onClick={() => choose(id)}>{a.name}</button>
                      </th>
                      <td>{a.kind}</td>
                      <td>{a.focus}</td>
                      <td>
                        {p
                          ? `${p.price?.toLocaleString("en")} QAR`
                          : "Check seller"}
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            setSaved(saved.filter((v) => v !== id))
                          }
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
            Same race and duration. Reference prices exclude any unverified fees
            or changes; this is not a live offer comparison.
          </p>
        </section>
      )}
      <section id="ticket-sellers" className="ticket-sellers">
        <div className="section-line">
          <div>
            <p className="eyebrow">CONTINUE WITH A TICKET PROVIDER</p>
            <h2>From the map to the real ticket.</h2>
          </div>
          <label>
            Show
            <select
              value={sellerFilter}
              onChange={(e) => setSellerFilter(e.target.value)}
            >
              <option value="all">All sources</option>
              <option value="event">2026 event pages</option>
              <option value="reseller">Listed resellers</option>
            </select>
          </label>
        </div>
        <p className="seller-intro">
          Direct event pages first, followed by sellers named in Lusail’s
          organizer guidance. Confirm the year, area, days, fees and delivery
          terms before paying. Purchases take place with the provider.
        </p>
        <div className="seller-list">
          {providers
            .filter(
              (p) =>
                sellerFilter === "all" ||
                (sellerFilter === "event"
                  ? p.scope === "Qatar 2026"
                  : p.type === "Organizer-listed seller"),
            )
            .map((p, i) => (
              <article className="seller-row" key={p.id}>
                <div className="seller-monogram" aria-hidden="true">
                  {p.id === "lusail"
                    ? "LIC"
                    : p.id === "f1"
                      ? "F1"
                      : p.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 3)
                          .join("")}
                </div>
                <div>
                  <span className="seller-type">{p.type}</span>
                  <h3>{p.name}</h3>
                  <p>{p.detail}</p>
                </div>
                <div className="seller-status">
                  <strong>{p.scope}</strong>
                  <span>
                    {i === 0 && p.id === "lusail"
                      ? chosen.name
                      : "No live stock feed"}
                  </span>
                </div>
                <a
                  href={providerUrl(p.id, area)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {p.area
                    ? "View " + (p.id === "lusail" ? "area" : "tickets")
                    : "Visit provider"}
                  <span className="sr-only"> at {p.name} (external site)</span>
                </a>
              </article>
            ))}
        </div>
        <div className="seller-guidance">
          <a href={FAQ} target="_blank" rel="noreferrer">
            Organizer’s authorized seller guidance
          </a>
          <span>
            Directory checked 23 Nov 2026 · no paid ranking or affiliate links
          </span>
        </div>
      </section>
      <details className="ticket-methodology">
        <summary>How accurate is this? Sources & privacy</summary>
        <div>
          <h3>What the map tells you</h3>
          <p>
            The track follows OpenStreetMap geometry. Viewing-area markers are
            approximate callouts based on the organizer’s descriptions, not
            surveyed stand boundaries or entrances. Exact rows, chair
            coordinates, obstructions and photographic views are unavailable.
            Follow the organizer’s event map and the seating information in your
            ticket app.
          </p>
          <p>
            Only Main Grandstand has numbered seats. North, T2 and T16 use free
            seating; Lusail Hill is general admission. Hospitality locations and
            other products are not resolved by this locator.
          </p>
          <h3>What happens to your ticket details</h3>
          <p>
            The parser runs in your browser. Pasted text is not uploaded, stored
            or included in shared links. The comparison saves only public area
            IDs on this device; use “Clear comparison” to remove them. External
            ticket sites have their own privacy and purchase terms.
          </p>
          <h3>Public source checks</h3>
          <p>
            Our collector reads allowlisted public pages and respects robots
            restrictions. It does not access checkout sessions or bypass access
            blocks. Published prices are reference snapshots, not live offers. A
            successful page check does not prove tickets are in stock.{" "}
            {snapshot
              ? `Latest collection: ${new Date(snapshot.checkedAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC.`
              : "The snapshot is unavailable or loading."}
          </p>
          <ul>
            {snapshot?.sources.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.title || s.id}
                </a>{" "}
                · {s.status.replaceAll("-", " ")} · {s.note}
              </li>
            ))}
          </ul>
          <p>
            Seating and seller guidance:{" "}
            <a href={FAQ} target="_blank" rel="noreferrer">
              Lusail Circuit, checked {CHECKED}
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
            <a href="/data/lusail-track.json" download>
              download adapted track data
            </a>
            . Independent product; no Formula 1 or organizer affiliation.
          </p>
        </div>
      </details>
    </section>
  );
}
