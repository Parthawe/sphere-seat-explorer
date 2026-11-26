import CircuitGuidePanel from "./CircuitGuidePanel";
import { circuitGuideFor, matchesCircuitSearch } from "./circuitGuides";
import { useHashTarget } from "./useHashTarget";
import { readRoute, type Route } from "./routing";
import { SITE_NAME, syncPublicUrlMetadata } from "./brand";
import {jeddahReference} from "./jeddahReference";
import {findCircuitModel} from "./circuitSeating";
import { findVenue } from "./venueRegistry";
import { BrandMark } from "./BrandMark";
import type { Mode } from "./model";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  calendars,
  calendarUrl,
  raceUrl,
  dateLabel,
  raceStatus,
  type Season,
  type Race,
} from "./races";
const CircuitSeatingExplorer = lazy(() => import("./CircuitSeatingExplorer"));
const AustriaDesk = lazy(() => import("./AustriaDesk"));
const MonacoDesk = lazy(() => import("./MonacoDesk"));
const SuzukaDesk = lazy(() => import("./SuzukaDesk"));
const SingaporeDesk = lazy(() => import("./SingaporeDesk"));
const AbuDhabiDesk = lazy(() => import("./AbuDhabiDesk"));
const TicketDesk = lazy(() => import("./TicketDesk"));
const VegasAtlas = lazy(() => import("./VegasAtlas"));
const Explorer = lazy(() => import("./App"));
const categories = [
  [
    "grandstand",
    "Grandstand",
    "A dedicated trackside viewing area",
    "Compare the corner, row height, screen access and potential fencing. Check whether your pass includes one day or the whole weekend.",
  ],
  [
    "admission",
    "General admission",
    "Explore an unassigned viewing area",
    "Check the permitted zones, sightlines, standing or lawn areas, arrival rules and facilities. Not offered at every race.",
  ],
  [
    "hospitality",
    "Hospitality",
    "A hosted race weekend",
    "Compare the location, covered areas, food and drink, session access and included services. Inclusions vary by package.",
  ],
  [
    "experiences",
    "F1 Experiences",
    "Packages and additional access",
    "Check the specific package for hotel, transport, tours or other access. A package name does not guarantee a paddock visit.",
  ],
] as const;
export default function RaceHub() {
  const [route, setRoute] = useState(() => readRoute(location.search)),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [category, setCategory] = useState("grandstand");
  useEffect(() => {
    const pop = () => setRoute(readRoute(location.search));
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useHashTarget(route);
  function go(next: Route, hash = "") {
    const p = new URLSearchParams({ season: String(next.season) });
    if (next.race) p.set("race", next.race);
    if (next.circuit) p.set("screen", "circuit");
    else if (next.atlas) p.set("screen", "vegas");
    else if (next.seats) {
      p.set("screen", "seats");
      if (next.position) {
        p.set("seat", `${next.position}:12:18`);
        p.set("view", next.mode || "seat");
      }
    }
    history.pushState({}, "", `?${p}${hash}`);
    setRoute({ ...next, issue: undefined });
    window.scrollTo(0, 0);
  }
  const races = calendars[route.season],
    selected = races.find((r) => r.slug === route.race);
  const filtered = races.filter(
    (r) =>
      matchesCircuitSearch(r, search) &&
      (filter === "all" ||
        (filter === "upcoming" && raceStatus(r) !== "Past") ||
        (filter === "3d" && (r.slug === "las-vegas" || !!findCircuitModel(route.season,r.slug)))),
  );
  const circuitModel = findCircuitModel(route.season,route.race);
  useEffect(() => {
    const pageTitle = route.circuit && circuitModel
      ? `${circuitModel.country} ${circuitModel.season} · 3D seating study`
      : route.atlas
        ? "Las Vegas · All Areas & Sphere Interior"
        : route.seats
          ? "Las Vegas · 3D Seat Explorer"
          : selected
            ? `${selected.name} ${route.season}`
            : `${route.season} Race Tickets & Seat Views`;
    document.title = `${pageTitle} · ${SITE_NAME}`;
    syncPublicUrlMetadata();
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", document.title);
  }, [route, selected]);
  if (route.circuit && circuitModel) return <Suspense fallback={<div className="hub-loading">Opening the circuit seating study…</div>}><CircuitSeatingExplorer key={circuitModel.id} model={circuitModel} onBack={() => go({season:route.season,race:route.race,seats:false})}/></Suspense>;
  if (route.atlas)
    return (
      <Suspense
        fallback={
          <div className="hub-loading">Opening all Las Vegas areas…</div>
        }
      >
        <VegasAtlas
          key={route.season}
          season={route.season}
          onBack={() =>
            go({ season: route.season, race: "las-vegas", seats: false })
          }
          onOpen={(position, mode = "seat") =>
            go({
              season: route.season,
              race: "las-vegas",
              seats: true,
              position,
              mode,
            })
          }
        />
      </Suspense>
    );
  if (route.seats)
    return (
      <Suspense
        fallback={
          <div className="hub-loading">
            Opening the Las Vegas seat explorer…
          </div>
        }
      >
        <Explorer
          season={route.season}
          onBack={() =>
            go({ season: route.season, seats: false, race: "las-vegas" })
          }
          onAreas={() =>
            go({
              season: route.season,
              seats: false,
              race: "las-vegas",
              atlas: true,
            })
          }
        />
      </Suspense>
    );
  function select(r: Race) {
    go({ season: r.season, race: r.slug, seats: false });
  }
  return (
    <div className="race-hub">
      <a className="skip-link" href="#race-content">
        Skip to races
      </a>
      <header className="site-header hub-header">
        <a
          href={`?season=${route.season}`}
          className="wordmark"
          onClick={(e) => {
            e.preventDefault();
            go({ ...route, race: "", seats: false });
          }}
        >
          <BrandMark />
          <span>
            F1TICKETS.ONLINE
            <span className="wordmark-sub">RACE TICKETS & SEAT EXPLORER</span>
          </span>
        </a>
        <nav aria-label="Seasons">
          {([2026, 2027] as Season[]).map((y) => (
            <button
              key={y}
              aria-pressed={route.season === y}
              aria-label={`${y} season`}
              onClick={() => {
                go({ season: y, race: "", seats: false });
                setFilter("all");
                setSearch("");
              }}
            >
              {y}
              <span className="season-label"> season</span>
            </button>
          ))}
        </nav>
      </header>
      <main id="race-content">
        <nav className="product-jump-nav" aria-label="Explore F1 Tickets Online">
          <a
            href={`?season=${route.season}#race-content`}
            onClick={e => { e.preventDefault(); go({ season: route.season, race: "", seats: false }, "#race-content"); }}
            aria-current={!selected ? "page" : undefined}
          >
            Ticket planning
          </a>
          <a href={`?season=${route.season}#race-calendar`} onClick={e => { e.preventDefault(); go({ season: route.season, race: "", seats: false }, "#race-calendar"); }}>All races</a>
          <a href={`?season=${route.season}&race=las-vegas&screen=vegas`}>
            Las Vegas 3D
          </a>
        </nav>
        {route.issue && <p className="route-notice" role="alert">{route.issue}</p>}
        {route.race && !selected ? (
          <section className="route-not-found">
            <h1>Race link unavailable.</h1>
            <p>This race is not listed in our {route.season} calendar. Choose a listed race to see its ticket guide and supported views.</p>
            <button onClick={() => go({ season: route.season, race: "", seats: false })}>Browse {route.season} races</button>
          </section>
        ) : selected ? (
          <>
            <div className="race-breadcrumb">
              <button onClick={() => go({ ...route, race: "" })}>
                All {route.season} races
              </button>
              <span>/</span>
              <span>Round {String(selected.round).padStart(2, "0")}</span>
            </div>
            <section className="race-detail-heading">
              <div>
                <h1>
                  {selected.name}
                  <span>Grand Prix {route.season}</span>
                </h1>
                <p>
                  {dateLabel(selected)} · {raceStatus(selected)}
                </p>
              </div>
              <a
                href={raceUrl(selected)}
                target="_blank"
                rel="noreferrer"
                className="hub-outline-link"
              >
                Official event & schedule
              </a>
            </section>
            {circuitModel && <section className="circuit-model-entry"><div><h2>Explore in 3D.</h2><p>Estimated seats and sightlines · {circuitModel.season}</p></div><button onClick={()=>go({season:route.season,race:route.race,seats:false,circuit:true})}>Open 3D seating</button></section>}
            {route.circuit && !circuitModel && <p className="singapore-reference-note">No 3D seating model is available for this venue and season. Choose a supported race; layouts are not carried across seasons.</p>}
            <CircuitGuidePanel race={selected} coverage={circuitModel ? `Illustrative 3D · ${circuitModel.banks.length} modeled banks` : selected.slug === "las-vegas" ? "3D explorer · 2026 reference" : findVenue(route.season, selected.slug) ? "Approximate area map available" : "Circuit guide · no seat model yet"} />
            {selected.slug === "qatar" && route.season === 2026 ? (
              <Suspense
                fallback={
                  <div className="hub-loading">Opening Qatar ticket desk…</div>
                }
              >
                <TicketDesk compact />
              </Suspense>
            ) : selected.slug === "united-arab-emirates" &&
              route.season === 2026 ? (
              <Suspense
                fallback={
                  <div className="hub-loading">
                    Opening Abu Dhabi viewing areas…
                  </div>
                }
              >
                <AbuDhabiDesk />
              </Suspense>
            ) : selected.slug === "singapore" && route.season === 2027 ? (
              <Suspense
                fallback={
                  <div className="hub-loading">
                    Opening Singapore viewing areas…
                  </div>
                }
              >
                <SingaporeDesk />
              </Suspense>
            ) : selected.slug === "japan" && route.season === 2027 ? (
              <Suspense fallback={<div className="hub-loading">Opening Suzuka viewing areas…</div>}><SuzukaDesk /></Suspense>
            ) : selected.slug === "austria" && route.season === 2027 ? (
              <Suspense fallback={<div className="hub-loading">Opening Spielberg viewing areas…</div>}><AustriaDesk /></Suspense>
            ) : selected.slug === "monaco" && route.season === 2027 ? (
              <Suspense fallback={<div className="hub-loading">Opening Monaco viewing areas…</div>}><MonacoDesk /></Suspense>
            ) : selected.slug === "las-vegas" ? (
              <section className="vegas-feature">
                <img
                  className="venue-preview-image"
                  src="/las-vegas-preview.webp"
                  alt="The rebuilt Sphere and modeled grandstands in our 3D explorer"
                  width="1000"
                  height="800"
                />
                <div>
                  <h2>Explore all of Las Vegas.</h2>
                  <p>
                    Browse all listed viewing products, nine modeled outdoor
                    seating banks and an illustrative Sphere interior.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => go({ ...route, seats: false, atlas: true })}
                  >
                    Explore all Las Vegas areas
                  </button>
                  <span className="feature-note">
                    2026 reference geometry · estimated seats and sightlines,
                    including when browsing 2027.
                  </span>
                </div>
              </section>
            ) : (
              <>
                {selected.slug === "singapore" && route.season === 2026 && (
                  <p className="feature-note">
                    The Singapore area map covers 2027 only.{" "}
                    <a href="?season=2027&race=singapore">
                      View the 2027 map
                    </a>
                    .
                  </p>
                )}
                {selected.slug==='china'&&route.season===2027&&<details className="jeddah-source-reference"><summary>Shanghai’s 2026 reference model</summary><p>The 2026 model cannot locate a 2027 ticket.</p><a href="?season=2026&race=china&screen=circuit">Open the 2026 model</a></details>}
                {selected.slug===jeddahReference.race&&route.season===jeddahReference.season&&<details className="jeddah-source-reference">
                  <summary>Jeddah grandstand catalogue</summary>
                  <p>Six listed grandstand products; seating locations are not mapped here yet.</p>
                  <ul>{jeddahReference.grandstands.map(name=><li key={name}>{name}</li>)}</ul>
                  <div className="verified-event-links"><a href={jeddahReference.event} target="_blank" rel="noreferrer">Organizer’s event page</a><a href={jeddahReference.catalogue} target="_blank" rel="noreferrer">Organizer-linked ticket catalogue</a></div>
                  <small>Checked {jeddahReference.checked}.</small>
                </details>}
              </>
            )}
            {!findVenue(route.season, selected.slug) && (
              <details className="ticket-options">
                <summary>Other ticket types</summary>
                <div
                  className="ticket-category-tabs"
                  role="group"
                  aria-label="Ticket categories"
                >
                  {categories.map((c) => (
                    <button
                      key={c[0]}
                      aria-pressed={category === c[0]}
                      onClick={() => setCategory(c[0])}
                    >
                      {c[1]}
                    </button>
                  ))}
                </div>
                {categories
                  .filter((c) => c[0] === category)
                  .map((c) => (
                    <div className="ticket-category-detail" key={c[0]}>
                      <div>
                        <h3>{c[2]}</h3>
                        <p>{c[3]}</p>
                      </div>
                      <a
                        className="primary-button"
                        href={
                          c[0] === "experiences"
                            ? "https://f1experiences.com/"
                            : c[0] === "hospitality"
                              ? "https://ticketing.formula1.com/hospitality/seasons/"
                              : "https://ticketing.formula1.com/seasons/"
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {c[0] === "experiences"
                          ? "Visit F1 Experiences"
                          : c[0] === "hospitality"
                            ? "Visit F1 hospitality"
                            : "Visit F1 ticket store"}
                      </a>
                    </div>
                  ))}
                <p className="provider-note">
                  Select {selected.name} {route.season} in the provider’s catalogue.
                </p>
              </details>
            )}
            <section className="other-races">
              <h2>More races this season</h2>
              <div>
                {races
                  .filter((r) => r.slug !== selected.slug)
                  .slice(
                    Math.max(0, selected.round - 2),
                    Math.max(0, selected.round - 2) + 3,
                  )
                  .map((r) => (
                    <button key={r.slug} onClick={() => select(r)}>
                      <span>
                        Round {r.round} · {dateLabel(r)}
                      </span>
                      <strong>{r.name}</strong>
                    </button>
                  ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {route.season === 2026 ? (
              <Suspense
                fallback={
                  <div className="hub-loading">
                    Opening the 2026 ticket desk…
                  </div>
                }
              >
                <TicketDesk />
              </Suspense>
            ) : (
              <section className="season-heading">
                <div>
                  <p className="eyebrow">PLAN THE NEXT SEASON</p>
                  <h1>
                    The 2027
                    <br />
                    <em>race calendar.</em>
                  </h1>
                  <p>
                    Browse the published calendar and official race guides.
                    Singapore has a sourced 2027 area pilot. Qatar and Abu Dhabi
                    ticket desks apply to 2026 only.
                  </p>
                </div>
                <div className="season-year" aria-hidden="true">
                  2027
                </div>
              </section>
            )}
            {route.season === 2026 && (
              <section
                className="remaining-races"
                aria-label="Remaining 2026 races"
              >
                <div className="section-line">
                  <h2>Still to race in 2026</h2>
                  <span>Race weekends · local dates</span>
                </div>
                {calendars[2026]
                  .filter((r) => raceStatus(r) !== "Past")
                  .map((r) => (
                    <button key={r.slug} onClick={() => select(r)}>
                      <span>ROUND {r.round}</span>
                      <strong>{r.name}</strong>
                      <span>{dateLabel(r)}</span>
                      <span>
                        {r.slug === "qatar"
                          ? "Ticket desk & area map"
                          : "Ticket sources & area map"}
                      </span>
                    </button>
                  ))}
              </section>
            )}
            {route.season === 2027 && (
              <section className="singapore-pilot-link">
                <div>
                  <h2>Explore Singapore’s 2027 viewing areas.</h2>
                  <p>
                    Twelve standard grandstands, official preview links and local
                    ticket-area matching. Approximate regions; exact seats are
                    not verified.
                  </p>
                </div>
                <button
                  onClick={() =>
                    go({ season: 2027, race: "singapore", seats: false })
                  }
                >
                  Open Singapore area map
                </button>
              </section>
            )}
            <section className="race-feature-strip compact-vegas">
              <div>
                <span>LAS VEGAS · THE 3D ATLAS</span>
                <h2>Step into the Sphere zone.</h2>
                <p>
                  Explore reconstructed seat views, moving cars and the Vegas
                  night skyline. Estimated geometry, not official seat
                  inventory.
                </p>
                <button
                  onClick={() =>
                    go({
                      season: route.season,
                      race: "las-vegas",
                      seats: false,
                      atlas: true,
                    })
                  }
                >
                  Explore Las Vegas in 3D
                </button>
              </div>
              <img
                className="venue-preview-image"
                src="/las-vegas-preview.webp"
                alt="Reconstructed Las Vegas circuit with Sphere and modeled viewing areas"
                width="1000"
                height="800"
                loading="lazy"
              />
            </section>
            <section
              className="race-calendar"
              id="race-calendar"
              aria-label={`${route.season} race calendar`}
            >
              <div className="calendar-toolbar">
                <h2>
                  {route.season} race calendar <span>{races.length} races</span>
                </h2>
                <label className="race-search">
                  <span>Find a race</span>
                  <input
                    type="search"
                    placeholder="Race, circuit or city"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
              </div>
              <div className="calendar-filter-row">
                <div
                  className="calendar-filters"
                  role="group"
                  aria-label="Filter races"
                >
                  {[
                    ["all", "All races"],
                    ["upcoming", "Upcoming"],
                    ["3d", "3D seat views"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      aria-pressed={filter === value}
                      onClick={() => setFilter(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <span>{filtered.length} shown · dates local to venue</span>
              </div>
              <div className="race-list-head" aria-hidden="true">
                <span>Round</span>
                <span>Grand Prix</span>
                <span>Weekend</span>
                <span>Coverage</span>
                <span>Status</span>
              </div>
              <div className="race-list">
                {filtered.map((r) => (
                  <button
                    className="race-row"
                    key={r.slug}
                    onClick={() => select(r)}
                  >
                    <span className="race-round">
                      {String(r.round).padStart(2, "0")}
                    </span>
                    <strong>{r.name}<small className="race-circuit-name">{circuitGuideFor(r.season, r.slug)?.venue}</small></strong>
                    <span className="race-dates">{dateLabel(r)}</span>
                    <span
                      className={
                        r.slug === "las-vegas" || findCircuitModel(route.season,r.slug)
                          ? "coverage-3d"
                          : "coverage-guide"
                      }
                    >
                      {findCircuitModel(route.season,r.slug)
                        ? "3D seating reconstruction"
                        : findVenue(route.season, r.slug)
                        ? "Ticket desk & area map"
                        : r.slug === "las-vegas"
                          ? "3D seat model"
                          : "Race & ticket guide"}
                    </span>
                    <span className="race-status">{raceStatus(r)}</span>
                  </button>
                ))}
              </div>
              {!filtered.length && (
                <div className="race-empty">
                  <h3>No races match</h3>
                  <p>Try another name or show the whole calendar.</p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </section>
          </>
        )}
        <details className="calendar-source">
          <summary>Calendar source</summary>
          <p>
            F1’s {route.season} calendar · checked 23 November 2026. Dates may change.
          </p>
          <a href={calendarUrl(route.season)} target="_blank" rel="noreferrer">
            Check the official {route.season} calendar
          </a>
        </details>
      </main>
      <footer className="hub-footer">
        <span>Independent race planning · no Formula 1 affiliation</span>
        <span>No live ticket inventory</span>
      </footer>
    </div>
  );
}
