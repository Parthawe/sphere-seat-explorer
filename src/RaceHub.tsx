import {circuitLayoutId} from "./circuitLayouts";
import PriceNotebook from "./PriceNotebook";
import UiIcon from "./UiIcon";
import CircuitThumbnail from "./CircuitThumbnail";
import SeasonLanding from "./SeasonLanding";
import { raceCoverage } from "./raceCoverage";
import { useNavigationFocus } from "./useNavigationFocus";
import FundingDisclosure from "./FundingDisclosure";
import CircuitGuidePanel from "./CircuitGuidePanel";
import { circuitGuideFor, matchesCircuitSearch } from "./circuitGuides";
import { useHashTarget } from "./useHashTarget";
import { readRoute, type Route } from "./routing";
import { SITE_NAME, syncPublicUrlMetadata } from "./brand";
import {jeddahReference} from "./jeddahReference";
import {findCircuitModel} from "./circuitSeating";
import { findVenue } from "./venueRegistry";
import { BrandIdentity } from "./BrandMark";
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
const StandConceptViewer=lazy(()=>import("./StandConceptViewer"));
const VenueStands=lazy(()=>import("./VenueStands"));
const RacingCentre=lazy(()=>import("./RacingCentre"));
const CircuitLayoutViewer=lazy(()=>import("./CircuitLayoutViewer"));
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
    const pop = () => {requestNavigationFocus();setRoute(readRoute(location.search));};
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useHashTarget(route);
  const requestNavigationFocus = useNavigationFocus(route);
  function go(next: Route, hash = "") {
    requestNavigationFocus();
    const p = new URLSearchParams({ season: String(next.season) });
    if (next.race) p.set("race", next.race);
    if (next.study!==undefined) {p.set("screen","stand-study");p.set("option",next.study);}
    else if (next.racing) p.set("screen", "racing");
    else if (next.layout) p.set("screen", "layout");
    else if (next.circuit) p.set("screen", "circuit");
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
        (filter === "3d" && raceCoverage(route.season,r.slug).has3d) ||
        (filter === "seats" && ["model","reference3d"].includes(raceCoverage(route.season,r.slug).kind))),
  );
  const circuitModel = findCircuitModel(route.season,route.race);
  useEffect(() => {
    const pageTitle = route.study!==undefined ? `${selected?.name??"Race"} · Stand concept` : route.racing ? `${route.season} Race Centre` : route.layout && selected
      ? `${selected.name} ${selected.season} · 3D circuit diagram`
      : route.circuit && circuitModel
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
  if(route.study!==undefined&&selected)return <Suspense fallback={<div className="hub-loading">Opening stand concept…</div>}><StandConceptViewer key={`${selected.season}-${selected.slug}-${route.study}`} race={selected} optionId={route.study} onBack={()=>go({season:route.season,race:route.race,seats:false},"#venue-stands")} onOption={id=>go({season:route.season,race:route.race,seats:false,study:id})}/></Suspense>;
  if(route.racing)return <Suspense fallback={<div className="hub-loading">Opening Race Centre…</div>}><RacingCentre key={route.season} season={route.season} onSeason={season=>go({season,race:"",seats:false,racing:true})} onBack={()=>go({season:route.season,race:"",seats:false})} onRace={race=>go({season:race.season,race:race.slug,seats:false,layout:true})}/></Suspense>;
  if(route.layout&&selected&&circuitLayoutId(selected.season,selected.slug))return <Suspense fallback={<div className="hub-loading">Opening 3D circuit diagram…</div>}><CircuitLayoutViewer key={`${selected.season}-${selected.slug}`} race={selected} onBack={()=>go({season:route.season,race:route.race,seats:false})} onRace={race=>go({season:race.season,race:race.slug,seats:false,layout:true})}/></Suspense>;
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
            go({ season:route.season, race: "", seats: false });
          }}
        >
          <BrandIdentity subtitle="TICKETS & SEAT VIEWS" />
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
          <a href={`?season=${route.season}&screen=racing`} onClick={e=>{e.preventDefault();go({season:route.season,race:"",seats:false,racing:true});}}><UiIcon name="grid"/>Race Centre</a>
          <a href={`?season=${route.season}#race-calendar`} onClick={e => { e.preventDefault(); go({ season: route.season, race: "", seats: false }, "#race-calendar"); }}><UiIcon name="calendar"/>All races</a>
          <a href={`?season=${route.season}&race=las-vegas&screen=vegas`}>
            <UiIcon name="cube"/>Las Vegas 3D
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
            <section className="circuit-model-entry"><div><h2>Explore in 3D.</h2><p>{circuitModel?`Estimated seats and sightlines · ${circuitModel.season}`:"Circuit diagram · no seat preview"}</p></div><div className="circuit-model-entry-actions">{circuitModel&&<button onClick={()=>go({season:route.season,race:route.race,seats:false,circuit:true})}>Open 3D seating</button>}<button onClick={()=>go({season:route.season,race:route.race,seats:false,layout:true})}>3D circuit diagram</button></div></section>
            {route.circuit && !circuitModel && <p className="singapore-reference-note">No 3D seating model is available for this venue and season. Choose a supported race; layouts are not carried across seasons.</p>}
            <Suspense fallback={<div className="hub-loading">Loading viewing options…</div>}><VenueStands key={`${selected.season}-${selected.slug}`} race={selected}/></Suspense>
            <PriceNotebook key={`${selected.season}-${selected.slug}`} race={selected} />
            <CircuitGuidePanel race={selected} coverage={raceCoverage(route.season,selected.slug).detail} />
            <div id="viewing-areas" tabIndex={-1}>
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
                  <h2>Explore Las Vegas viewing areas.</h2>
                  <p>
                    Browse all listed viewing products, nine modeled outdoor
                    seating banks and an illustrative Sphere interior.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => go({ ...route, seats: false, atlas: true })}
                  >
                    Explore Las Vegas areas
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
            </div>
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
            <SeasonLanding season={route.season} onRace={select} onBrowse={()=>go({season:route.season,race:"",seats:false},"#race-calendar")} onVegas={mode=>go({season:route.season,race:"las-vegas",seats:true,mode,position:"C"})} />
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
                    ["3d", "All 3D views"],
                    ["seats", "Seat studies"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      aria-pressed={filter === value}
                      onClick={() => setFilter(value)}
                    >
                      <UiIcon name={value==='seats'?'seat':value==='3d'?'cube':value==='upcoming'?'calendar':'circuit'}/>{label}
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
                      <CircuitThumbnail season={r.season} race={r.slug}/><span>R{String(r.round).padStart(2, "0")}</span>
                    </span>
                    <strong>{r.name}<small className="race-circuit-name">{circuitGuideFor(r.season, r.slug)?.venue}</small></strong>
                    <span className="race-dates">{dateLabel(r)}</span>
                    <span
                      title={raceCoverage(route.season,r.slug).label}
                      className={
                        raceCoverage(route.season,r.slug).has3d
                          ? "coverage-3d"
                          : "coverage-guide"
                      }
                    >
                      <UiIcon name={raceCoverage(route.season,r.slug).has3d?'cube':'map'}/>{raceCoverage(route.season,r.slug).label}
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
          <p>Circuit outlines use retained source geography where available. <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors · ODbL</a>. A map icon indicates no outline is supplied for that event and season.</p>
        </details>
      </main>
      <FundingDisclosure />
      <footer className="hub-footer">
        <span>Independent race planning · no Formula 1 affiliation</span>
        <span>No live ticket inventory</span>
      </footer>
    </div>
  );
}
