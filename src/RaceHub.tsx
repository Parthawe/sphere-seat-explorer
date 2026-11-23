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
const VegasAtlas = lazy(() => import("./VegasAtlas"));
const Explorer = lazy(() => import("./App"));
type Route = {
  season: Season;
  race: string;
  seats: boolean;
  atlas?: boolean;
  position?: string;
  mode?: Mode;
};
function readRoute(): Route {
  const p = new URLSearchParams(location.search);
  return {
    season:
      p.get("season") === "2026"
        ? 2026
        : p.get("season") === "2027"
          ? 2027
          : p.has("seat") || p.has("view")
            ? 2026
            : 2027,
    race: p.get("race") || "",
    atlas: p.get("screen") === "vegas",
    seats: p.get("screen") === "seats" || p.has("seat") || p.has("view"),
  };
}
const categories = [
  [
    "grandstand",
    "Grandstand",
    "An assigned viewing position",
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
  const [route, setRoute] = useState(readRoute),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [category, setCategory] = useState("grandstand");
  useEffect(() => {
    const pop = () => setRoute(readRoute());
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  function go(next: Route) {
    const p = new URLSearchParams({ season: String(next.season) });
    if (next.race) p.set("race", next.race);
    if (next.atlas) p.set("screen", "vegas");
    else if (next.seats) {
      p.set("screen", "seats");
      if (next.position) {
        p.set("seat", `${next.position}:12:18`);
        p.set("view", next.mode || "seat");
      }
    }
    history.pushState({}, "", `?${p}`);
    setRoute(next);
    window.scrollTo(0, 0);
  }
  const races = calendars[route.season],
    selected = races.find((r) => r.slug === route.race);
  const filtered = races.filter(
    (r) =>
      (r.name + " " + r.slug)
        .toLowerCase()
        .includes(search.toLowerCase().trim()) &&
      (filter === "all" ||
        (filter === "upcoming" && raceStatus(r) !== "Past") ||
        (filter === "3d" && r.slug === "las-vegas")),
  );
  useEffect(() => {
    document.title = route.atlas
      ? "Las Vegas · All Areas & Sphere Interior"
      : route.seats
        ? "Las Vegas · 3D Seat Explorer"
        : selected
          ? `${selected.name} ${route.season} · Viewpoint`
          : `F1 Races ${route.season} · Viewpoint`;
  }, [route, selected]);
  if (route.atlas)
    return (
      <Suspense
        fallback={
          <div className="hub-loading">Opening all Las Vegas areas…</div>
        }
      >
        <VegasAtlas
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
          <svg viewBox="0 0 50 36" aria-hidden="true">
            <path d="M2 4h12l8 20L37 4h12L24 35H14Z" fill="currentColor" />
          </svg>
          <span>
            VIEWPOINT
            <span className="wordmark-sub">F1 RACE & SEAT EXPLORER</span>
          </span>
        </a>
        <nav aria-label="Seasons">
          {([2026, 2027] as Season[]).map((y) => (
            <button
              key={y}
              aria-pressed={route.season === y}
              onClick={() => {
                go({ season: y, race: "", seats: false });
                setFilter("all");
                setSearch("");
              }}
            >
              {y} season
            </button>
          ))}
        </nav>
      </header>
      <main id="race-content">
        {selected ? (
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
            {selected.slug === "las-vegas" ? (
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
              <section className="race-coverage">
                <h2>Plan your viewing position</h2>
                <p>
                  A seat-level 3D model is not available here yet. Use the
                  official event guide and ticket providers to review this
                  race’s viewing areas and current offers.
                </p>
                <a href={raceUrl(selected)} target="_blank" rel="noreferrer">
                  Open the official race guide
                </a>
              </section>
            )}
            <section className="ticket-options">
              <h2>Choose how you watch</h2>
              <p>
                Ticket categories to investigate. Availability and inclusions
                must be confirmed with the provider for {selected.name}{" "}
                {route.season}.
              </p>
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
                Provider links open an external catalogue. Select the race and
                season there. Viewpoint does not display live stock, prices or
                reservations.
              </p>
            </section>
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
            <section className="season-heading">
              <div>
                <h1>
                  Find your next
                  <br />
                  <em>race weekend.</em>
                </h1>
                <p>
                  Every published race in {route.season}. Explore the calendar,
                  choose a ticket category, and inspect our Las Vegas seat
                  model.
                </p>
              </div>
              <div className="season-year" aria-hidden="true">
                {route.season}
              </div>
            </section>
            <section className="race-feature-strip">
              <div>
                <span>LAS VEGAS · SPHERE ZONE</span>
                <h2>The seat changes everything.</h2>
                <p>Get inside the model before choosing your view.</p>
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
                  Explore Las Vegas
                </button>
              </div>
              <img
                className="venue-preview-image"
                src="/las-vegas-preview.webp"
                alt="The rebuilt Sphere and modeled grandstands in our 3D explorer"
                width="1000"
                height="800"
              />
            </section>
            <section
              className="race-calendar"
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
                    placeholder="Search race name"
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
                    <strong>{r.name}</strong>
                    <span className="race-dates">{dateLabel(r)}</span>
                    <span
                      className={
                        r.slug === "las-vegas"
                          ? "coverage-3d"
                          : "coverage-guide"
                      }
                    >
                      {r.slug === "las-vegas"
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
        <section className="calendar-source">
          <strong>Calendar source</strong>
          <p>
            Formula 1’s published {route.season} calendar, checked 22 November
            2026. Dates can change. The 2026 list reflects the current revised
            calendar; past weekends remain available for reference.
          </p>
          <a href={calendarUrl(route.season)} target="_blank" rel="noreferrer">
            Check the official {route.season} calendar
          </a>
        </section>
      </main>
      <footer className="hub-footer">
        <span>Independent race planning · no Formula 1 affiliation</span>
        <span>
          3D coverage: Las Vegas models only · no live ticket inventory
        </span>
      </footer>
    </div>
  );
}
