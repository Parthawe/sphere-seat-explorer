import { useListRemovalFocus } from "./useListRemovalFocus";
import { SITE_ORIGIN, syncPublicUrlMetadata } from "./brand";
import { bowlViewUrl, normalizeBowlSeat, readBowlView } from "./sphereView";
import { sanitizeComparison } from "./comparisonState";
import { BrandIdentity } from "./BrandMark";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { circuitPath } from "./Map";
import { stands, type Mode } from "./model";
import {
  vegasAreas,
  areaSource,
  bowlLevels,
  sphereMaps,
  bowlSeatCount,
  type AreaKind,
  type BowlSeat,
} from "./vegas";
import type { Season } from "./races";
const SphereBowl = lazy(() => import("./SphereBowl"));
export default function VegasAtlas({
  season,
  onBack,
  onOpen,
}: {
  season: Season;
  onBack: () => void;
  onOpen: (stand: string, mode?: Mode) => void;
}) {
  const [tab, setTab] = useState(() =>
    new URLSearchParams(location.search).get("venue") === "sphere"
      ? "inside"
      : "circuit",
  );
  const [kind, setKind] = useState("all"),
    [query, setQuery] = useState(""),
    [area, setArea] = useState(
      () =>
        vegasAreas.find(
          (a) => a.id === new URLSearchParams(location.search).get("area"),
        ) || vegasAreas[0],
    );
  const comparisonRoot = useRef<HTMLElement>(null), compareButton = useRef<HTMLButtonElement>(null);
  const storageKey = `f1tickets-vegas-${season}-areas`;
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [shareFeedback, setShareFeedback] = useState("");
  const [comparison, setComparison] = useState<string[]>(() => {
    try { return sanitizeComparison(JSON.parse(localStorage.getItem(storageKey) || "[]"), vegasAreas.map(a => a.id)); }
    catch { return []; }
  }),
    [seat, setSeat] = useState<BowlSeat>(() => readBowlView(location.search).seat),
    [eye, setEye] = useState(() => readBowlView(location.search).eye),
    [all, setAll] = useState(() => readBowlView(location.search).all);
  const prepareRemoval = useListRemovalFocus(comparison, comparisonRoot, () => compareButton.current);
  useEffect(() => {
    try { if (comparison.length) localStorage.setItem(storageKey, JSON.stringify(comparison)); else localStorage.removeItem(storageKey); setStorageAvailable(true); }
    catch { setStorageAvailable(false); }
  }, [storageKey, comparison]);
  useEffect(() => {
    setShareFeedback("");
    if (tab !== "inside") { syncPublicUrlMetadata(); return; }
    const url = new URL(bowlViewUrl(location.origin, season, seat, eye, all));
    if (url.search !== location.search) history.replaceState(history.state, "", url.pathname + url.search);
    syncPublicUrlMetadata();
  }, [tab, season, seat, eye, all]);
  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(location.search);
      if (params.get("screen") !== "vegas") return;
      setTab(params.get("venue") === "sphere" ? "inside" : "circuit");
      const restored = readBowlView(location.search);
      setSeat(restored.seat); setEye(restored.eye); setAll(restored.all);
      setArea(vegasAreas.find(a => a.id === params.get("area")) || vegasAreas[0]);
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  async function shareSphere() {
    const url = bowlViewUrl(SITE_ORIGIN, season, seat, eye, all);
    try { await navigator.clipboard.writeText(url); setShareFeedback("Sphere model link copied. No ticket details included."); }
    catch { setShareFeedback("Copy this Sphere model link: " + url); }
  }
  const filtered = vegasAreas.filter(
    (a) =>
      (kind === "all" || a.kind === kind) &&
      `${a.name} ${a.zone} ${a.focus}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const level = bowlLevels.find((l) => l.level === seat.level)!;
  function switchTab(next: string) {
    setTab(next);
    const p = new URLSearchParams(location.search);
    next === "inside" ? p.set("venue", "sphere") : p.delete("venue");
    if (next === "circuit") for (const key of ["sphereLevel", "sphereSection", "sphereRow", "sphereSeat", "sphereView", "sphereLevels"]) p.delete(key);
    history.replaceState({}, "", `?${p}`);
    syncPublicUrlMetadata();
  }
  function select(id: string) {
    const a = vegasAreas.find((a) => a.id === id);
    if (!a) return;
    setArea(a);
    const p = new URLSearchParams(location.search);
    p.set("area", id);
    history.replaceState({}, "", `?${p}`);
    syncPublicUrlMetadata();
  }
  function toggleCompare(id: string) {
    setComparison((c) =>
      c.includes(id)
        ? c.filter((x) => x !== id)
        : c.length < 3
          ? [...c, id]
          : c,
    );
  }
  return (
    <div className="vegas-atlas">
      <header className="site-header">
        <a
          className="wordmark"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
        >
          <BrandIdentity subtitle="LAS VEGAS EXPLORER" />
        </a>
        <nav>
          <button className="all-races-button" onClick={onBack}>
            Race guide
          </button>
          <a
            href="https://www.f1lasvegasgp.com/2027-deposits/"
            target="_blank"
            rel="noreferrer"
          >
            Official 2027 information
          </a>
        </nav>
      </header>
      <main>
        <div className="atlas-intro">
          <div>
            <h1>
              Las Vegas
            </h1>
            <p>
              Choose a race viewing area or explore the indoor Sphere model.
            </p>
          </div>
          <div className="atlas-edition">
            <strong>{season}</strong>
            <span>
              2026 reference layout
            </span>
          </div>
        </div>
        <nav className="atlas-tabs" aria-label="Las Vegas venues">
          <button
            aria-pressed={tab === "circuit"}
            onClick={() => switchTab("circuit")}
          >
            Grand Prix circuit
          </button>
          <button
            aria-pressed={tab === "inside"}
            onClick={() => switchTab("inside")}
          >
            Inside Sphere
          </button>
        </nav>
        {tab === "circuit" ? (
          <>
            <section className="atlas-map-layout">
              <div className="atlas-map">
                <div className="atlas-map-title">
                  <h2>Full circuit & viewing areas</h2>
                  <span>Schematic placement · select a marker</span>
                </div>
                <svg
                  viewBox="-330 -240 1220 880"
                  role="group"
                  aria-label="Las Vegas circuit and all listed viewing areas"
                >
                  <path
                    d={circuitPath}
                    fill="none"
                    stroke="#303748"
                    strokeWidth="28"
                  />
                  <path
                    d={circuitPath}
                    fill="none"
                    stroke="#d9dce5"
                    strokeWidth="3"
                  />
                  <circle cx="0" cy="0" r="78.6" fill="#c26b1b" />
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    fill="white"
                    fontSize="18"
                  >
                    SPHERE
                  </text>
                  <text
                    x="330"
                    y="520"
                    textAnchor="middle"
                    fill="#9fa7ba"
                    fontSize="17"
                    letterSpacing="3"
                  >
                    LAS VEGAS BOULEVARD
                  </text>
                  <text
                    x="300"
                    y="150"
                    textAnchor="middle"
                    fill="#9fa7ba"
                    fontSize="17"
                  >
                    KOVAL STRAIGHT
                  </text>
                  <text
                    x="795"
                    y="300"
                    fill="#9fa7ba"
                    fontSize="17"
                    transform="rotate(-90 795 300)"
                  >
                    HARMON
                  </text>
                  {vegasAreas.map((a, i) => (
                    <g
                      key={a.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Show ${a.name}`}
                      aria-pressed={area.id === a.id}
                      onClick={() => select(a.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          select(a.id);
                        }
                      }}
                    >
                      <circle
                        cx={a.point[0]}
                        cy={a.point[1]}
                        r={area.id === a.id ? 20 : 15}
                        fill={
                          area.id === a.id
                            ? "#e10600"
                            : a.kind === "Grandstand"
                              ? "#f0f2f8"
                              : a.kind === "General admission"
                                ? "#7c8aa9"
                                : "#343d53"
                        }
                        stroke={area.id === a.id ? "#fff" : "#a3aabe"}
                        strokeWidth="2"
                      />
                      <text
                        x={a.point[0]}
                        y={a.point[1] + 5}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="700"
                        fill={
                          a.kind === "Grandstand" && area.id !== a.id
                            ? "#15151e"
                            : "white"
                        }
                        pointerEvents="none"
                      >
                        {i + 1}
                      </text>
                      <title>
                        {a.name} · {a.focus}
                      </title>
                    </g>
                  ))}
                </svg>
                <div className="atlas-map-legend">
                  <span>
                    <i />
                    Grandstand
                  </span>
                  <span>
                    <i />
                    General admission
                  </span>
                  <span>
                    <i />
                    Hospitality
                  </span>
                </div>
                <button
                  className="atlas-circuit-open"
                  onClick={() => onOpen("C", "circuit")}
                >
                  Open full circuit in 3D
                </button>
              </div>
              <aside
                className="atlas-area-detail"
                aria-label="Selected viewing area"
              >
                <span>{area.kind} · 2026 reference</span>
                <h2>{area.name}</h2>
                <dl>
                  <div>
                    <dt>Zone</dt>
                    <dd>{area.zone}</dd>
                  </div>
                  <div>
                    <dt>Viewing focus</dt>
                    <dd>{area.focus}</dd>
                  </div>
                  <div>
                    <dt>Seat-map coverage</dt>
                    <dd>
                      {area.stand
                        ? "Illustrative 3D bank available"
                        : "Official product guide only"}
                    </dd>
                  </div>
                </dl>
                {area.stand ? (
                  <button
                    className="primary-button"
                    onClick={() => onOpen(area.stand!, "stand")}
                  >
                    Explore modeled seats
                  </button>
                ) : (
                  <p className="atlas-no-seats">
                    {area.kind === "General admission"
                      ? "An unassigned viewing area has no individual seat numbers."
                      : "A verified seat layout for this hospitality product is not available in the explorer."}
                  </p>
                )}
                {area.id === "sphere-grandstands" && (
                  <div className="sphere-bank-links">
                    {stands.slice(0, 5).map((s) => (
                      <button key={s.id} onClick={() => onOpen(s.id, "seat")}>
                        {s.id} · {s.corner}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  className="atlas-compare-button"
                  ref={compareButton} aria-pressed={comparison.includes(area.id)}
                  disabled={
                    !comparison.includes(area.id) && comparison.length >= 3
                  }
                  onClick={() => toggleCompare(area.id)}
                >
                  {comparison.includes(area.id)
                    ? "Remove from area comparison"
                    : "Compare this area"}{" "}
                  <span>{comparison.length}/3</span>
                </button>
                <a
                  href={areaSource(area.kind)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Official product details
                </a>
                <p className="atlas-reference-note">
                  Names and viewing focuses follow the organizer’s current
                  reference pages. Map positions, modeled rows and seat numbers
                  are estimates. No availability is implied.
                </p>
              </aside>
            </section>
            {comparison.length > 0 && (
              <section ref={comparisonRoot} className="area-comparison">
                <h2>Compare viewing areas</h2>
                <p>{storageAvailable ? "Saved on this device for this season." : "Device storage is unavailable. This comparison lasts while this page stays open."}</p>
                <button className="vegas-clear-comparison" onClick={() => { prepareRemoval(); setComparison([]); }}>Clear area comparison</button>
                <div className="area-comparison-table">
                  {comparison.map((id) => {
                    const a = vegasAreas.find((a) => a.id === id)!;
                    return (
                      <article key={id} data-comparison-id={id}>
                        <h3>{a.name}</h3>
                        <p>{a.kind}</p>
                        <dl>
                          <div>
                            <dt>Zone</dt>
                            <dd>{a.zone}</dd>
                          </div>
                          <div>
                            <dt>Focus</dt>
                            <dd>{a.focus}</dd>
                          </div>
                          <div>
                            <dt>3D coverage</dt>
                            <dd>{a.stand ? "Modeled bank" : "Guide only"}</dd>
                          </div>
                        </dl>
                        <button
                          onClick={() => {
                            select(id);
                            document
                              .querySelector(".atlas-map-layout")
                              ?.scrollIntoView({ behavior: "instant" });
                          }}
                        >
                          Show on map
                        </button>
                        <button data-remove-comparison onClick={() => { prepareRemoval(id); toggleCompare(id); }}>
                          Remove
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
            <section className="atlas-directory">
              <div className="atlas-directory-heading">
                <h2>Every listed viewing product</h2>
                <label>
                  Find an area
                  <input
                    type="search"
                    placeholder="Name, zone or corner"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
              </div>
              <div
                className="atlas-filters"
                role="group"
                aria-label="Viewing product type"
              >
                {["all", "Grandstand", "General admission", "Hospitality"].map(
                  (k) => (
                    <button
                      key={k}
                      aria-pressed={kind === k}
                      onClick={() => setKind(k)}
                    >
                      {k === "all" ? "All areas" : k}
                    </button>
                  ),
                )}
              </div>
              <div className="atlas-directory-rows">
                {filtered.map((a) => (
                  <button
                    key={a.id}
                    aria-pressed={area.id === a.id}
                    onClick={() => {
                      select(a.id);
                      document
                        .querySelector(".atlas-map-layout")
                        ?.scrollIntoView({ behavior: "instant" });
                    }}
                  >
                    <strong>{a.name}</strong>
                    <span>{a.zone}</span>
                    <span>{a.kind}</span>
                    <span>{a.focus}</span>
                  </button>
                ))}
              </div>
              {!filtered.length && (
                <div className="atlas-empty">
                  <p>No viewing areas match.</p>
                  <button
                    onClick={() => {
                      setQuery("");
                      setKind("all");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </section>
            <section className="all-bank-directory">
              <h2>All modeled outdoor seats</h2>
              <p>
                Browse all{" "}
                {stands
                  .reduce((n, s) => n + s.rows * s.seats, 0)
                  .toLocaleString()}{" "}
                modeled seat positions across nine illustrative banks. These
                totals describe the model, not the venue’s capacity.
              </p>
              <div>
                {stands.map((s) => (
                  <button key={s.id} onClick={() => onOpen(s.id, "stand")}>
                    <span>{s.id}</span>
                    <strong>{s.name}</strong>
                    <span>
                      {s.corner} · {s.rows} rows × {s.seats} seats
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="sphere-interior-intro">
              <div>
                <h2>Inside Sphere</h2>
                <p>
                  Explore the four seating levels in an illustrative 3D bowl.
                  This is a separate indoor venue; these seats do not look onto
                  the Grand Prix circuit.
                </p>
              </div>
              <a
                href="https://www.thesphere.com/plan-your-visit/maps"
                target="_blank"
                rel="noreferrer"
              >
                Official venue maps
              </a>
            </section>
            <section className="sphere-interior-layout">
              <div className="sphere-bowl-view">
                <Suspense
                  fallback={
                    <div className="bowl-fallback">
                      Preparing the interior seating model…
                    </div>
                  }
                >
                  <SphereBowl
                    selection={seat}
                    all={all}
                    eye={eye}
                    onSelect={setSeat}
                  />
                </Suspense>
                <div className="bowl-view-controls">
                  <button aria-pressed={!eye} onClick={() => setEye(false)}>
                    Whole bowl
                  </button>
                  <button aria-pressed={eye} onClick={() => setEye(true)}>
                    Model seat view
                  </button>
                </div>
                <div className="bowl-model-label">
                  ILLUSTRATIVE INTERIOR ·{" "}
                  {all ? "ALL FOUR LEVELS" : `${seat.level} LEVEL`}
                  <span>
                    {bowlSeatCount.toLocaleString()} model markers · not
                    official inventory
                  </span>
                </div>
              </div>
              <aside className="bowl-selection">
                <h3>Inspect a modeled position</h3>
                <label>
                  Seating level
                  <select
                    aria-label="Seating level"
                    value={seat.level}
                    onChange={(e) => {
                      const l = bowlLevels.find(
                        (l) => l.level === Number(e.target.value),
                      )!;
                      setSeat(normalizeBowlSeat({
                        level: l.level,
                        section: l.first + Math.floor(l.sections / 2),
                        row: Math.min(seat.row, l.rows),
                        seat: seat.seat,
                      }));
                    }}
                  >
                    {bowlLevels.map((l) => (
                      <option key={l.level} value={l.level}>
                        {l.level} level
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Section reference
                  <select
                    aria-label="Section reference"
                    value={seat.section}
                    onChange={(e) =>
                      setSeat({ ...seat, section: Number(e.target.value) })
                    }
                  >
                    {Array.from({ length: level.sections }, (_, i) => (
                      <option key={i} value={level.first + i}>
                        {level.first + i}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="bowl-row-seat">
                  <label>
                    Model row
                    <input
                      type="number"
                      min="1"
                      max={level.rows}
                      value={seat.row}
                      onChange={(e) =>
                        setSeat({
                          ...seat,
                          row: Math.max(
                            1,
                            Math.min(
                              level.rows,
                              Math.round(Number(e.target.value)) || 1,
                            ),
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    Model seat
                    <input
                      type="number"
                      min="1"
                      max={level.seats}
                      value={seat.seat}
                      onChange={(e) =>
                        setSeat({
                          ...seat,
                          seat: Math.max(
                            1,
                            Math.min(
                              level.seats,
                              Math.round(Number(e.target.value)) || 1,
                            ),
                          ),
                        })
                      }
                    />
                  </label>
                </div>
                <button className="sphere-share-view" onClick={shareSphere}>Share Sphere view</button>
                <p className="sphere-share-feedback" role="status">{shareFeedback}</p>
                <label className="show-all-levels">
                  <input
                    type="checkbox"
                    checked={all}
                    onChange={(e) => setAll(e.target.checked)}
                  />
                  Show every level
                </label>
                <p>
                  Section labels orient the study. Rows, seat counts,
                  elevations, screen shape and overhangs are illustrative. This
                  is not a verified view from a purchasable seat.
                </p>
                <a
                  href="https://www.thesphere.com/shows"
                  target="_blank"
                  rel="noreferrer"
                >
                  Browse official Sphere shows
                </a>
              </aside>
            </section>
            <section className="bowl-section-plan">
              <div>
                <h2>Section {seat.section} · complete model grid</h2>
                <span>Illustrative rows and seat numbers</span>
              </div>
              <p>
                Use arrow keys to select a modeled position.
              </p>
              <svg
                viewBox={`-24 -18 ${level.seats * 15 + 35} ${level.rows * 12 + 20}`}
                tabIndex={0}
                role="img"
                aria-label={`Model seat grid for section ${seat.section}. Row ${seat.row}, seat ${seat.seat}. Use arrow keys to move.`}
                onKeyDown={(e) => {
                  if (
                    ![
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                    ].includes(e.key)
                  )
                    return;
                  e.preventDefault();
                  setSeat({
                    ...seat,
                    row: Math.max(
                      1,
                      Math.min(
                        level.rows,
                        seat.row +
                          (e.key === "ArrowUp"
                            ? -1
                            : e.key === "ArrowDown"
                              ? 1
                              : 0),
                      ),
                    ),
                    seat: Math.max(
                      1,
                      Math.min(
                        level.seats,
                        seat.seat +
                          (e.key === "ArrowRight"
                            ? 1
                            : e.key === "ArrowLeft"
                              ? -1
                              : 0),
                      ),
                    ),
                  });
                }}
              >
                {Array.from({ length: level.seats }, (_, i) => (
                  <text
                    key={"label" + i}
                    x={i * 15 + 5}
                    y={-7}
                    textAnchor="middle"
                    fontSize="6"
                    fill="#626779"
                  >
                    {i + 1}
                  </text>
                ))}
                {Array.from({ length: level.rows }, (_, r) => (
                  <g key={r}>
                    <text x="-12" y={r * 12 + 8} fontSize="6" fill="#626779">
                      {r + 1}
                    </text>
                    {Array.from({ length: level.seats }, (_, i) => (
                      <circle
                        key={i}
                        cx={i * 15 + 5}
                        cy={r * 12 + 5}
                        r="4"
                        fill={
                          seat.row === r + 1 && seat.seat === i + 1
                            ? "#e10600"
                            : seat.row === r + 1
                              ? "#616b80"
                              : "#bec4d1"
                        }
                        onClick={() =>
                          setSeat({ ...seat, row: r + 1, seat: i + 1 })
                        }
                      >
                        <title>
                          Model row {r + 1}, seat {i + 1}
                        </title>
                      </circle>
                    ))}
                  </g>
                ))}
              </svg>
            </section>
            <section className="sphere-official-levels">
              <h2>Official floor & access maps</h2>
              <p>
                Use Sphere’s published venue maps for entrances, concourses and
                level access. Event-specific seat numbering and restricted-view
                details must be checked on the selected show’s ticket map.
              </p>
              <div>
                {sphereMaps.map((m) => (
                  <a key={m.name} href={m.url} target="_blank" rel="noreferrer">
                    {m.name}
                    <span>Open official map</span>
                  </a>
                ))}
              </div>
            </section>
          </>
        )}
        <section className="atlas-planning">
          <h2>Visitor information</h2>
          <div className="atlas-resource-links">
            <a
              href="https://www.f1lasvegasgp.com/track-layout/"
              target="_blank"
              rel="noreferrer"
            >
              Official circuit guide
            </a>
            <a
              href="https://www.f1lasvegasgp.com/faqs/"
              target="_blank"
              rel="noreferrer"
            >
              Race visitor information
            </a>
            <a
              href="https://www.thesphere.com/plan-your-visit/maps"
              target="_blank"
              rel="noreferrer"
            >
              Sphere access maps
            </a>
          </div>
        </section>
      </main>
      <footer className="hub-footer">
        <span>
          Independent explorer · 2026 reference · checked 22 November 2026
        </span>
        <span>Modeled geometry · no live ticket inventory</span>
      </footer>
    </div>
  );
}
