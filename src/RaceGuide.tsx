import VenueReferences from './VenueReferences';
import {useGuideNavigation} from './useGuideNavigation';
import {lazy,Suspense,useState,useEffect,type ReactNode} from 'react';
import type {Route} from './routing';
import {calendars,dateLabel,raceStatus,raceUrl,type Race} from './races';
import {findCircuitModel} from './circuitSeating';
import {findVenue} from './venueRegistry';
import {jeddahReference} from './jeddahReference';
import {raceCoverage} from './raceCoverage';
import PriceNotebook from './PriceNotebook';
import UiIcon from './UiIcon';
import CircuitGuidePanel from './CircuitGuidePanel';
import {RacePhoto,PhotoCredit} from './RaceCard';
import {raceFlagFor} from './raceCards';
import Race3DPreview from './Race3DPreview';
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
function MapTools({children}:{children:ReactNode}){
 const hashRequested=location.hash==='#viewing-areas';
 const initial=hashRequested||new URLSearchParams(location.search).has('area');
 const [open,setOpen]=useState(initial),[mounted,setMounted]=useState(initial);
 useEffect(()=>{if(hashRequested){setOpen(true);setMounted(true);}},[hashRequested]);
 return <details className="guide-map-tools" open={open} onToggle={event=>{const next=event.currentTarget.open;setOpen(next);if(next)setMounted(true);}}><summary><UiIcon name="map"/><span>Area map & ticket locator</span><UiIcon name="plus"/></summary>{mounted&&children}</details>;
}

export default function RaceGuide({race:selected,route,go,jumpTo}:{race:Race;route:Route;go:(next:Route,hash?:string)=>void;jumpTo:(id:string)=>void}){
 const [category,setCategory]=useState('grandstand');
 const {nav,active}=useGuideNavigation();
 const races=calendars[route.season],circuitModel=findCircuitModel(route.season,route.race);
 const select=(race:Race)=>go({season:race.season,race:race.slug,seats:false});
 return (<>
            <div className="race-context-switch"><label><span>Race</span><select aria-label="Race guide race" value={selected.slug} onChange={event=>{const next=races.find(r=>r.slug===event.target.value);if(next)select(next);}}>{races.map(r=><option key={r.slug} value={r.slug}>R{String(r.round).padStart(2,'0')} · {r.name}</option>)}</select></label><a href={`?season=${route.season}#race-calendar`} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();go({season:route.season,race:'',seats:false},'#race-calendar');}}><UiIcon name="arrow"/>All races</a></div>
            <section className="race-3d-hero"><div className="race-3d-heading"><h1><img src={`/flags/${raceFlagFor(selected)}.svg`} width="28" height="28" alt=""/>{selected.name}<span>Grand Prix {route.season}</span></h1><p><UiIcon name="calendar"/>{dateLabel(selected)} · {raceStatus(selected)}</p><a href={raceUrl(selected)} target="_blank" rel="noreferrer">Official event & schedule<UiIcon name="arrow"/></a><details className="race-venue-photo"><summary><UiIcon name="camera"/>Venue photo</summary><div><RacePhoto race={selected}/><PhotoCredit race={selected}/></div></details></div><Race3DPreview key={`${selected.season}-${selected.slug}`} race={selected} onOpen={()=>go({season:selected.season,race:selected.slug,seats:false,...(circuitModel?{circuit:true}:selected.slug==='las-vegas'?{atlas:true}:{trackStudy:true})})}/></section>
            <nav ref={nav} className="race-guide-nav" aria-label="Plan this race">
              {([{id:'venue-stands',label:'Stands',icon:'seat'},{id:'race-schedule',label:'Schedule',icon:'calendar'},{id:'race-circuit',label:'Circuit',icon:'circuit'},{id:'venue-references',label:'Photos',icon:'camera'},{id:'circuit-guide',label:'Compare',icon:'layers'},{id:'booking-checks',label:'Booking',icon:'ticket'}] as const).map(item=><a key={item.id} aria-current={active===item.id?'location':undefined} href={`#${item.id}`} onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();jumpTo(item.id);}}><UiIcon name={item.icon}/>{item.label}</a>)}
            </nav>
            {route.circuit && !circuitModel && <p className="singapore-reference-note">No 3D seating model is available for this venue and season. Choose a supported race; layouts are not carried across seasons.</p>}
            <Suspense fallback={<div className="hub-loading">Loading viewing options…</div>}><VenueStands key={`${selected.season}-${selected.slug}`} race={selected} includeReferences={false}/></Suspense>
            <div id="viewing-areas" tabIndex={-1}>
            {selected.slug === "qatar" && route.season === 2026 ? (
              <Suspense
                fallback={
                  <div className="hub-loading">Opening Qatar ticket desk…</div>
                }
              >
                <MapTools><TicketDesk compact /></MapTools>
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
                <MapTools><AbuDhabiDesk /></MapTools>
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
            <CircuitGuidePanel race={selected} coverage={raceCoverage(route.season,selected.slug).detail} />
            <PriceNotebook key={`${selected.season}-${selected.slug}`} race={selected} />
            <VenueReferences race={selected}/>
            <RaceSchedule race={selected}/>
            <RaceCircuitProfile race={selected}/>
            <RaceResources race={selected}/>
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
