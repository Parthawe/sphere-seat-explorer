import {raceStudyLink} from './raceCards';
import {standAnchor} from './venueLinks';
import {circuitLayoutId} from "./circuitLayouts";
import UiIcon from "./UiIcon";
import CircuitThumbnail from "./CircuitThumbnail";
import RaceCard from "./RaceCard";
import SeasonLanding from "./SeasonLanding";
import { raceCoverage } from "./raceCoverage";
import { useNavigationFocus } from "./useNavigationFocus";
import FundingDisclosure from "./FundingDisclosure";
import {calendarEntryFor,matchesCalendarSearch} from "./calendarIndex";
import { useHashTarget } from "./useHashTarget";
import { readRoute, type Route } from "./routing";
import { SITE_NAME, syncPublicUrlMetadata } from "./brand";
import { BrandIdentity } from "./BrandMark";
import type { Mode } from "./model";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  calendars,
  calendarUrl,
  dateLabel,
  raceStatus,
  type Season,
  type Race,
} from "./races";
const RaceGuide=lazy(()=>import("./RaceGuide"));
const CircuitStudyRoute=lazy(()=>import("./CircuitStudyRoute"));
const StandConceptViewer=lazy(()=>import("./StandConceptViewer"));
const RacingCentre=lazy(()=>import("./RacingCentre"));
const CircuitLayoutViewer=lazy(()=>import("./CircuitLayoutViewer"));
const CircuitIllustrativeViewer=lazy(()=>import("./CircuitIllustrativeViewer"));
const VegasAtlas = lazy(() => import("./VegasAtlas"));
const Explorer = lazy(() => import("./App"));

export default function RaceHub() {
  const [route, setRoute] = useState(() => readRoute(location.search)),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [calendarView,setCalendarView]=useState<'cards'|'list'>('cards');
  const raceSearch = useRef<HTMLInputElement>(null);
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
    else if (next.trackStudy) p.set("screen", "track-study");
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
  function jumpTo(id:string){
    history.pushState({},"",`${location.pathname}${location.search}#${id}`);
    setRoute(readRoute(location.search));
  }
  const races = calendars[route.season],
    selected = races.find((r) => r.slug === route.race);
  const filtered = races.filter(
    (r) =>
      matchesCalendarSearch(r, search) &&
      (filter === "all" ||
        (filter === "upcoming" && raceStatus(r) !== "Past") ||
        (filter === "3d" && raceCoverage(route.season,r.slug).has3d) ||
        (filter === "seats" && ["model","reference3d"].includes(raceCoverage(route.season,r.slug).kind))),
  );
  const circuitModel = calendarEntryFor(route.season,route.race)?.model;
  useEffect(() => {
    const pageTitle = route.trackStudy && selected ? `${selected.name} ${selected.season} · Illustrative circuit study` : route.study!==undefined ? `${selected?.name??"Race"} · Stand references` : route.racing ? `${route.season} Race Centre` : route.layout && selected
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
  if(route.trackStudy&&selected&&circuitLayoutId(selected.season,selected.slug))return <Suspense fallback={<div className="hub-loading" role="status">Opening circuit study…</div>}><CircuitIllustrativeViewer key={`${selected.season}-${selected.slug}`} race={selected} onBack={()=>go({season:route.season,race:route.race,seats:false})} onRace={race=>go(readRoute(raceStudyLink(race)))}/></Suspense>;
  if(route.study!==undefined&&selected)return <Suspense fallback={<div className="hub-loading">Opening stand references…</div>}><StandConceptViewer key={`${selected.season}-${selected.slug}-${route.study}`} race={selected} optionId={route.study} onBack={id=>go({season:route.season,race:route.race,seats:false},id?`#${standAnchor(id)}`:"#venue-stands")} onOption={id=>go({season:route.season,race:route.race,seats:false,study:id})}/></Suspense>;
  if(route.racing)return <Suspense fallback={<div className="hub-loading">Opening Race Centre…</div>}><RacingCentre key={route.season} season={route.season} onSeason={(season,view)=>go({season,race:"",seats:false,racing:true},view==='grid'?'#driver-grid':'')} onBack={()=>go({season:route.season,race:"",seats:false})} onRace={race=>go(readRoute(raceStudyLink(race)))}/></Suspense>;
  if(route.layout&&selected&&circuitLayoutId(selected.season,selected.slug))return <Suspense fallback={<div className="hub-loading">Opening 3D circuit diagram…</div>}><CircuitLayoutViewer key={`${selected.season}-${selected.slug}`} race={selected} onBack={()=>go({season:route.season,race:route.race,seats:false})} onRace={race=>go({season:race.season,race:race.slug,seats:false,layout:true})}/></Suspense>;
  if (route.circuit && circuitModel) return <Suspense fallback={<div className="hub-loading">Opening the circuit seating study…</div>}><CircuitStudyRoute key={`${route.season}:${route.race}`} season={route.season} race={route.race} onBack={id => go({season:route.season,race:route.race,seats:false},id?`#${standAnchor("model-"+id)}`:"#venue-stands")}/></Suspense>;
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
    <div className={`race-hub${!route.race?' calendar-page':''}`}>
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
        {<nav className="calendar-primary-nav" aria-label="Main navigation"><a href={`?season=${route.season}#race-calendar`} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();go({season:route.season,race:"",seats:false},"#race-calendar");}}>All races</a><a href={`?season=${route.season}&screen=racing`} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();go({season:route.season,race:"",seats:false,racing:true});}}>Race Centre</a><a href={`?season=${route.season}&race=las-vegas&screen=vegas`}>Las Vegas 3D</a></nav>}
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
        {route.issue && <p className="route-notice" role="alert">{route.issue}</p>}
        {route.race && !selected ? (
          <section className="route-not-found">
            <h1>Race link unavailable.</h1>
            <p>This race is not listed in our {route.season} calendar. Choose a listed race to see its ticket guide and supported views.</p>
            <button onClick={() => go({ season: route.season, race: "", seats: false })}>Browse {route.season} races</button>
          </section>
        ) : selected ? (
          <Suspense fallback={<div className="hub-loading" role="status">Loading race guide…</div>}><RaceGuide key={`${selected.season}-${selected.slug}`} race={selected} route={route} go={go} jumpTo={jumpTo}/></Suspense>
        ) : (
          <>
            <SeasonLanding season={route.season} onRace={select} />
            <section
              className="race-calendar"
              id="race-calendar"
              aria-label={`${route.season} race calendar`}
            >
              <div className="calendar-toolbar">
                <h2>
                  All {route.season} races <span>{races.length} races</span>
                </h2>
                <label className="race-search">
                  <span>Find a race</span>
                  <input
                    type="search"
                    ref={raceSearch}
                    placeholder="Race, circuit or city"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
              <div className="calendar-view-switch" role="group" aria-label="Calendar display"><button aria-label="Card view" title="Card view" aria-pressed={calendarView==='cards'} onClick={()=>setCalendarView('cards')}><UiIcon name="grid"/></button><button aria-label="List view" title="List view" aria-pressed={calendarView==='list'} onClick={()=>setCalendarView('list')}><UiIcon name="list"/></button></div>
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
                    ["3d", "Circuit studies"],
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
                <span role="status">{filtered.length} shown · dates local to venue</span>
              </div>
              <div className="race-list-head" aria-hidden="true" hidden={calendarView!=='list'}>
                <span>Round</span>
                <span>Grand Prix</span>
                <span>Weekend</span>
                <span>Coverage</span>
                <span>Status</span>
              </div>
              <div className={calendarView==='cards'?'race-card-grid':'race-list'}>
                {filtered.map((r) => calendarView==='cards'?<RaceCard key={r.slug} race={r} onSelect={select}/>: (
                  <button
                    className="race-row"
                    key={r.slug}
                    onClick={() => select(r)}
                  >
                    <span className="race-round">
                      <CircuitThumbnail season={r.season} race={r.slug}/><span>R{String(r.round).padStart(2, "0")}</span>
                    </span>
                    <strong>{r.name}<small className="race-circuit-name">{calendarEntryFor(r.season, r.slug)?.venue}</small></strong>
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
                      raceSearch.current?.focus();
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
            F1’s {route.season} calendar · checked 26 November 2026. Dates may change.
          </p>
          <a href={calendarUrl(route.season)} target="_blank" rel="noreferrer">
            Check the official {route.season} calendar
          </a>
          <p>Circuit outlines use retained source geography where available. <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors · ODbL</a>. A map icon indicates no outline is supplied for that event and season.</p>
          <p>Venue and destination photos retain source dates and individual credits under each image’s info control. Flag artwork: <a href="/flags/LICENSE.txt">flag-icons · MIT</a>.</p>
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
