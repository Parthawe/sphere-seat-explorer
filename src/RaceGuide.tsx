import {lazy,Suspense,useState} from 'react';
import type {Route} from './routing';
import {calendars,dateLabel,raceStatus,raceUrl,type Race} from './races';
import {findCircuitModel} from './circuitSeating';
import {findVenue} from './venueRegistry';
import {jeddahReference} from './jeddahReference';
import {raceCoverage} from './raceCoverage';
import PriceNotebook from './PriceNotebook';
import UiIcon from './UiIcon';
import CircuitThumbnail from './CircuitThumbnail';
import CircuitGuidePanel from './CircuitGuidePanel';
import {RacePhoto,PhotoCredit} from './RaceCard';
import {raceFlagFor} from './raceCards';
import {RaceCircuitProfile,RaceSchedule,RaceResources} from './RaceEventPanels';
const VenueStands=lazy(()=>import('./VenueStands'));
const AustriaDesk=lazy(()=>import('./AustriaDesk'));
const MonacoDesk=lazy(()=>import('./MonacoDesk'));
const SuzukaDesk=lazy(()=>import('./SuzukaDesk'));
const SingaporeDesk=lazy(()=>import('./SingaporeDesk'));
const AbuDhabiDesk=lazy(()=>import('./AbuDhabiDesk'));
const TicketDesk=lazy(()=>import('./TicketDesk'));
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
export default function RaceGuide({race:selected,route,go,jumpTo}:{race:Race;route:Route;go:(next:Route,hash?:string)=>void;jumpTo:(id:string)=>void}){
 const [category,setCategory]=useState('grandstand');
 const races=calendars[route.season],circuitModel=findCircuitModel(route.season,route.race);
 const select=(race:Race)=>go({season:race.season,race:race.slug,seats:false});
 return (<>
            <div className="race-breadcrumb">
              <button onClick={() => go({ ...route, race: "" })}>
                All {route.season} races
              </button>
              <span>/</span>
              <span>Round {String(selected.round).padStart(2, "0")}</span>
            </div>
            <section className="race-guide-cover"><RacePhoto race={selected} priority/><div className="race-detail-heading"><div><span className="race-cover-round">ROUND {String(selected.round).padStart(2,'0')} / {selected.season}</span><h1><img src={`/flags/${raceFlagFor(selected)}.svg`} width="32" height="32" alt=""/>{selected.name}<span>Grand Prix {route.season}</span></h1><p><UiIcon name="calendar"/>{dateLabel(selected)} · {raceStatus(selected)}</p></div><a href={raceUrl(selected)} target="_blank" rel="noreferrer" className="hub-outline-link">Official event & schedule<UiIcon name="arrow"/></a></div><PhotoCredit race={selected}/></section>
            <nav className="race-guide-nav" aria-label="Plan this race">
              {([{id:'venue-stands',label:'Stands',icon:'seat'},{id:'race-schedule',label:'Schedule',icon:'calendar'},{id:'race-circuit',label:'Circuit',icon:'circuit'},{id:'venue-references',label:'Photos',icon:'camera'},{id:'circuit-guide',label:'Compare',icon:'layers'},{id:'booking-checks',label:'Booking',icon:'ticket'}] as const).map(item=><a key={item.id} href={`#${item.id}`} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();jumpTo(item.id);}}><UiIcon name={item.icon}/>{item.label}</a>)}
            </nav>
            <section className="circuit-model-entry" aria-label={`${selected.name} 3D views`}>
              <div className="circuit-entry-preview"><div><h2>Explore in 3D.</h2><p>{circuitModel?`Estimated seats and sightlines · ${circuitModel.season}`:selected.slug==='las-vegas'?"Outdoor venue study · 2026 reference":"Plan-based circuit · no real seat preview"}</p></div><CircuitThumbnail season={selected.season} race={selected.slug}/></div>
              <div className="circuit-model-entry-actions">{circuitModel&&<button onClick={()=>go({season:route.season,race:route.race,seats:false,circuit:true})}><UiIcon name="seat"/>Open 3D seating</button>}{selected.slug==='las-vegas'&&<button onClick={()=>go({season:route.season,race:route.race,seats:false,atlas:true})}><UiIcon name="cube"/>Open Las Vegas 3D</button>}<button className={circuitModel||selected.slug==='las-vegas'?'circuit-entry-secondary':undefined} onClick={()=>go({season:route.season,race:route.race,seats:false,trackStudy:true})}><UiIcon name="cube"/>Circuit study</button><button className="circuit-entry-secondary" onClick={()=>go({season:route.season,race:route.race,seats:false,layout:true})}><UiIcon name="map"/>3D circuit diagram</button></div>
            </section>
            {route.circuit && !circuitModel && <p className="singapore-reference-note">No 3D seating model is available for this venue and season. Choose a supported race; layouts are not carried across seasons.</p>}
            <RaceCircuitProfile race={selected}/>
            <RaceSchedule race={selected}/>
            <Suspense fallback={<div className="hub-loading">Loading viewing options…</div>}><VenueStands key={`${selected.season}-${selected.slug}`} race={selected}/></Suspense>
            <RaceResources race={selected}/>
            <CircuitGuidePanel race={selected} coverage={raceCoverage(route.season,selected.slug).detail} />
            <PriceNotebook key={`${selected.season}-${selected.slug}`} race={selected} />
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
          </>);
}
