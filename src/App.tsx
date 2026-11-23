import { HistoricalReplay } from "./HistoricalReplay";
import type { ReplayFrame } from "./replayMath";
import { sphereDisplays, type SphereDisplay } from "./rendering";
import { BrandMark } from "./BrandMark";
import { FullSeatMap } from "./FullSeatMap";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT,
  stands,
  getStand,
  normalize,
  key,
  readUrl,
  makeSearch,
  addSaved,
  seatPosition,
  partySeats,
  selectionLabel,
  sources,
  type Selection,
  type Mode,
} from "./model";
import { FlatMap, circuitPath } from "./Map";
const Scene = lazy(() => import("./Scene"));
type DialogKind = "compare" | "sources" | "map" | null;
function Globe() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="12" />
      <ellipse cx="16" cy="16" rx="6" ry="12" />
      <path d="M4 16h24M7 9h18M7 23h18" />
    </svg>
  );
}
function Icon({
  name,
}: {
  name: "expand" | "reset" | "plus" | "close" | "bookmark" | "share" | "layers";
}) {
  const paths = {
    expand: (
      <>
        <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" />
      </>
    ),
    reset: (
      <>
        <path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    bookmark: <path d="M6 3h12v18l-6-4-6 4Z" />,
    share: (
      <>
        <path d="M12 15V3m-4 4 4-4 4 4M5 12v8h14v-8" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 10 6-10 6L2 9Zm-9 11 9 6 9-6" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
function MiniMap({ standId }: { standId: string }) {
  const s = getStand(standId);
  return (
    <svg
      viewBox="-330 -240 1220 880"
      fill="none"
      aria-label="Selected modeled bank on the full Las Vegas circuit"
      role="img"
    >
      <path d={circuitPath} stroke="#8b91a6" strokeWidth="13" />
      <circle cx={0} cy={0} r={78} stroke="#e10600" strokeWidth="9" />
      <circle
        cx={s.center[0]}
        cy={s.center[2]}
        r={25}
        fill="#e10600"
        stroke="#fff"
        strokeWidth="7"
      />
    </svg>
  );
}
function SeatGrid({
  selection,
  onChange,
  large = false,
  zoom = false,
}: {
  selection: Selection;
  onChange: (s: Selection) => void;
  large?: boolean;
  zoom?: boolean;
}) {
  const stand = getStand(selection.stand),
    width = stand.seats * 7 + 12;
  const group = partySeats(selection);
  const update = (next: Selection) =>
    onChange({ ...next, party: selection.party });
  return (
    <div className={"seat-grid " + (large ? "seat-grid-large" : "")}>
      <div className="track-edge">
        <span>TRACK / SPHERE</span>
      </div>
      <svg
        viewBox={"-16 -6 " + (width + 24) + " 132"}
        style={
          large
            ? {
                minWidth: zoom ? width * 2.8 : 0,
                width: "100%",
                height: zoom ? 370 : "auto",
              }
            : undefined
        }
        tabIndex={large ? 0 : undefined}
        onKeyDown={(e) => {
          if (
            !large ||
            !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
          )
            return;
          e.preventDefault();
          update(
            normalize({
              ...selection,
              seat:
                selection.seat +
                (e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0),
              row:
                selection.row +
                (e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0),
            }),
          );
        }}
        onPointerDown={(e) => {
          if (large) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const scale = Math.min(rect.width / (width + 24), rect.height / 132);
          const offsetX = (rect.width - (width + 24) * scale) / 2;
          const offsetY = (rect.height - 132 * scale) / 2;
          const x = (e.clientX - rect.left - offsetX) / scale - 16;
          const seatX = x > stand.seats * 3.5 ? x - 12 : x;
          const y = (e.clientY - rect.top - offsetY) / scale - 6;
          if (x < -8 || x > width + 8 || y < -6 || y > 126) return;
          update(
            normalize({
              stand: stand.id,
              row: Math.round((y - 4) / 6.4) + 1,
              seat: Math.round((seatX - 3.5) / 7) + 1,
            }),
          );
        }}
        role="img"
        aria-label={
          "Modeled seating grid. Row " +
          selection.row +
          ", seat " +
          selection.seat +
          ". Use row and seat controls to change position."
        }
      >
        <rect
          x={-3}
          y={(selection.row - 1) * 6.4 + 0.5}
          width={width + 2}
          height={7}
          rx={1.5}
          fill="#e1060010"
        />
        {large &&
          Array.from({ length: stand.seats }, (_, i) => (
            <text
              key={"seat-number" + i}
              x={i * 7 + 3.5 + (i >= stand.seats / 2 ? 12 : 0)}
              y={-1}
              fontSize={3.7}
              textAnchor="middle"
              fill="#5e6172"
            >
              {i + 1}
            </text>
          ))}
        {Array.from({ length: stand.rows }, (_, i) => (
          <text
            key={"row" + i}
            x={-10}
            y={i * 6.4 + 5.8}
            fontSize={4.5}
            textAnchor="middle"
            fill={selection.row === i + 1 ? "#e10600" : "#6f7182"}
          >
            {i + 1}
          </text>
        ))}
        {Array.from({ length: stand.rows }, (_, ri) =>
          Array.from({ length: stand.seats }, (_, si) => {
            const active = ri + 1 === selection.row && group.includes(si + 1);
            return (
              <circle
                key={ri + "-" + si}
                cx={si * 7 + 3.5 + (si >= stand.seats / 2 ? 12 : 0)}
                cy={ri * 6.4 + 4}
                r={active ? 3 : large ? 2.2 : 1.8}
                fill={
                  active
                    ? "#e10600"
                    : ri + 1 === selection.row
                      ? "#4c5268"
                      : "#c9ccd6"
                }
                onClick={() =>
                  update({ stand: stand.id, row: ri + 1, seat: si + 1 })
                }
              >
                <title>
                  {"Modeled row " + (ri + 1) + ", seat " + (si + 1)}
                </title>
              </circle>
            );
          }),
        )}
      </svg>
      <div className="grid-legend">
        <span>
          <i />
          Modeled seat
        </span>
        <span>
          <i className="active" />
          Your selection
        </span>
      </div>
    </div>
  );
}
function Stepper({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="stepper">
      <label>
        {label}
        <div>
          <button
            aria-label={"Previous " + label.toLowerCase()}
            disabled={value <= 1}
            onClick={() => onChange(value - 1)}
          >
            −
          </button>
          <input
            aria-label={label}
            type="number"
            min="1"
            max={max}
            value={value}
            onChange={(e) =>
              onChange(Math.max(1, Math.min(max, Number(e.target.value) || 1)))
            }
          />
          <button
            aria-label={"Next " + label.toLowerCase()}
            disabled={value >= max}
            onClick={() => onChange(value + 1)}
          >
            +
          </button>
        </div>
      </label>
    </div>
  );
}
export default function App({
  season = 2026,
  onBack,
  onAreas,
}: {
  season?: number;
  onBack?: () => void;
  onAreas?: () => void;
}) {
  const seatSearch = (current: Selection, view: Mode, shortlist: Selection[]) =>
    makeSearch(current, view, shortlist) + "&race=las-vegas&season=" + season;
  const initial = useRef(readUrl(window.location.search)).current;
  const [selection, setSelection] = useState<Selection>(initial.current),
    [mode, setMode] = useState<Mode>(initial.mode),
    [saved, setSaved] = useState<Selection[]>(() => {
      if (initial.hasComparison) return initial.saved;
      try {
        const parsed = JSON.parse(
          localStorage.getItem("sphere-shortlist-v1") || "[]",
        );
        return Array.isArray(parsed)
          ? parsed
              .filter(
                (s) =>
                  s &&
                  stands.some((t) => t.id === s.stand) &&
                  typeof s.row === "number" &&
                  typeof s.seat === "number",
              )
              .map(normalize)
              .filter((s, i, a) => a.findIndex((x) => key(x) === key(s)) === i)
              .slice(0, 3)
          : [];
      } catch {
        return [];
      }
    }),
    [reset, setReset] = useState(0),
    [dialog, setDialog] = useState<DialogKind>(null),
    [notice, setNotice] = useState(""),
    [ready, setReady] = useState(false),
    [unavailable, setUnavailable] = useState(false),
    [flat, setFlat] = useState(false),
    [panelOpen, setPanelOpen] = useState(() => window.innerWidth > 760),
    [reducedMotion, setReducedMotion] = useState(
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [atmosphere, setAtmosphere] = useState(true),
    [sphereDisplay, setSphereDisplay] = useState<SphereDisplay>("moon"),
    [playing, setPlaying] = useState(
      () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [historyOpen, setHistoryOpen] = useState(() => new URLSearchParams(window.location.search).get("history") === "2024"),
    [replay, setReplay] = useState<ReplayFrame | null>(null),
    [gridZoom, setGridZoom] = useState(false),
    [compareYaw, setCompareYaw] = useState(0),
    [comparePitch, setComparePitch] = useState(0);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(q.matches);
      if (q.matches) setPlaying(false);
    };
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  const comparisonLook = useMemo(
    () => ({ yaw: compareYaw, pitch: comparePitch }),
    [compareYaw, comparePitch],
  );
  const dialogRef = useRef<HTMLDialogElement>(null),
    sceneRef = useRef<HTMLDivElement>(null),
    noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stand = getStand(selection.stand),
    position = seatPosition(selection),
    isSaved = saved.some((s) => key(s) === key(selection));
  const partyCount = selection.party || 1;
  const announce = (text: string) => {
    setNotice(text);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 3500);
  };
  function navigate(
    next: Selection = selection,
    view: Mode = mode,
    shortlist: Selection[] = saved,
    replace = false,
  ) {
    next = normalize(next);
    setSelection(next);
    setMode(view);
    setSaved(shortlist);
    const url = window.location.pathname + seatSearch(next, view, shortlist);
    if (window.location.search !== seatSearch(next, view, shortlist))
      window.history[replace ? "replaceState" : "pushState"]({}, "", url);
  }
  useEffect(() => {
    const pop = () => {
      const state = readUrl(window.location.search);
      setSelection(state.current);
      setMode(state.mode);
      setSaved(state.saved);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("sphere-shortlist-v1", JSON.stringify(saved));
    } catch {
      /* Browsing still works when local storage is unavailable. */
    }
  }, [saved]);
  useEffect(() => {
    if (dialog && !dialogRef.current?.open) dialogRef.current?.showModal();
    else if (!dialog) dialogRef.current?.close();
  }, [dialog]);
  useEffect(
    () => () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    },
    [],
  );
  const change = (next: Selection) => navigate(next, mode, saved, true);
  const chooseStand = (id: string) => {
    const s = getStand(id);
    if (window.innerWidth <= 760) setPanelOpen(true);
    navigate(
      {
        stand: id,
        row: selection.row,
        seat: Math.ceil(s.seats / 2),
        party: selection.party,
      },
      "stand",
    );
  };
  const save = () => {
    if (isSaved) {
      setDialog("compare");
      return;
    }
    if (saved.length === 3) {
      announce("Your comparison has three seats. Remove one to add another.");
      setDialog("compare");
      return;
    }
    navigate(selection, mode, addSaved(saved, selection), true);
    announce("Seat added to your comparison");
  };
  async function share() {
    const url =
      window.location.origin +
      window.location.pathname +
      seatSearch(selection, mode, saved);
    try {
      await navigator.clipboard.writeText(url);
      announce("Link copied. It includes your selected seat and comparison.");
    } catch {
      announce("Copy the link from your address bar to share this view.");
      window.history.replaceState({}, "", url);
    }
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await sceneRef.current?.requestFullscreen();
    } catch {
      announce("Fullscreen is unavailable in this browser.");
    }
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#seat-controls">
        Skip to seat controls
      </a>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Apex Atlas home">
          <BrandMark />
          <span>
            APEX ATLAS<span className="wordmark-sub">F1 SEAT EXPLORER</span>
          </span>
        </a>
        <div className="header-location">
          <span className="location-mark" />
          LAS VEGAS <span className="header-separator">/</span>
          <span>{stand.zone || "SPHERE ZONE"}</span>
        </div>
        <nav aria-label="Main navigation">
          <button
            className="all-races-button"
            aria-label="All Las Vegas areas"
            onClick={onAreas || onBack}
          >
            <span className="header-action-full">All Las Vegas areas</span>
            <span className="header-action-short">All areas</span>
          </button>
          <button
            className="text-button about-button"
            onClick={() => setDialog("sources")}
          >
            About the model
          </button>
          <button
            className="compare-button"
            onClick={() => setDialog("compare")}
          >
            <Icon name="bookmark" />
            Compare seats <span className="count">{saved.length}</span>
          </button>
        </nav>
      </header>
      <main className="workspace">
        <section
          className={
            "scene-area mode-" + mode + (saved.length ? " has-saved" : "") + (historyOpen ? " history-open" : "")
          }
          aria-label="Interactive seat view"
          ref={sceneRef}
        >
          <div
            className="scene-canvas"
            tabIndex={0}
            role="region"
            aria-label="3D seat explorer. Use arrow keys to change seat or row, or drag to change the camera."
            onKeyDown={(e) => {
              if (
                ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                  e.key,
                )
              ) {
                e.preventDefault();
                change({
                  ...selection,
                  seat:
                    selection.seat +
                    (e.key === "ArrowRight"
                      ? 1
                      : e.key === "ArrowLeft"
                        ? -1
                        : 0),
                  row:
                    selection.row +
                    (e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0),
                });
              }
            }}
          >
            {flat ? (
              <FlatMap onStand={chooseStand} selected={selection.stand} />
            ) : (
              <Suspense
                fallback={
                  <div className="scene-loading">
                    <Globe />
                    <span>Preparing your perspective</span>
                  </div>
                }
              >
                <Scene
                  selection={selection}
                  mode={mode}
                  reset={reset}
                  playing={historyOpen ? false : playing}
                  replay={replay}
                  atmosphere={atmosphere}
                  sphereDisplay={sphereDisplay}
                  ambientMotion={!reducedMotion}
                  onSelect={(s) =>
                    navigate({ ...s, party: selection.party }, "seat")
                  }
                  onStand={chooseStand}
                  onReady={() => {
                    setReady(true);
                    setUnavailable(false);
                  }}
                  onUnavailable={() => setUnavailable(true)}
                />
              </Suspense>
            )}
          </div>
          <div className="scene-heading">
            <h1>
              {mode === "overview" || mode === "circuit" ? (
                <>
                  LAS VEGAS<span>GRAND PRIX</span>
                </>
              ) : (
                <>
                  {stand.name}
                  <span>
                    {mode === "seat"
                      ? "ROW " +
                        selection.row +
                        " / " +
                        selectionLabel(selection).toUpperCase()
                      : "SELECT A SEAT POSITION"}
                  </span>
                </>
              )}
            </h1>
            <p>
              {mode === "overview" || mode === "circuit"
                ? (mode === "circuit" ? "FULL CIRCUIT" : "SPHERE ZONE") +
                  " · ESTIMATED RECONSTRUCTION"
                : "POSITION " +
                  stand.id +
                  " · " +
                  stand.corner +
                  " · ESTIMATED VIEW"}
            </p>
          </div>
          <div className="view-switch" aria-label="Viewing mode">
            {(["overview", "circuit", "stand", "seat"] as Mode[]).map(
              (v, i) => (
                <button
                  key={v}
                  className={v === mode ? "selected" : ""}
                  aria-pressed={v === mode}
                  onClick={() => navigate(selection, v)}
                >
                  {v === "overview"
                    ? "Sphere"
                    : v === "circuit"
                      ? "Full circuit"
                      : v === "stand"
                        ? "Grandstand"
                        : "Seat view"}
                </button>
              ),
            )}
          </div>
          <div className="scene-tools">
            <button
              title={flat ? "Show 3D scene" : "Show 2D map"}
              aria-label={flat ? "Show 3D scene" : "Show 2D map"}
              aria-pressed={flat}
              onClick={() => setFlat(!flat)}
            >
              <Icon name="layers" />
            </button>
            <button
              title="Reset camera"
              aria-label="Reset camera"
              onClick={() => {
                setReset((v) => v + 1);
                announce("Camera reset");
              }}
            >
              <Icon name="reset" />
            </button>
            <button
              className="zoom-button"
              aria-label="Zoom in"
              title="Zoom in"
              onClick={() =>
                sceneRef.current
                  ?.querySelector("canvas")
                  ?.dispatchEvent(
                    new CustomEvent("viewpointzoom", { detail: -1 }),
                  )
              }
            >
              +
            </button>
            <button
              className="zoom-button"
              aria-label="Zoom out"
              title="Zoom out"
              onClick={() =>
                sceneRef.current
                  ?.querySelector("canvas")
                  ?.dispatchEvent(
                    new CustomEvent("viewpointzoom", { detail: 1 }),
                  )
              }
            >
              −
            </button>
            <button
              title="Fullscreen scene"
              aria-label="Fullscreen scene"
              onClick={fullscreen}
            >
              <Icon name="expand" />
            </button>
          </div>
          <div className="scene-bottom">
            <div className="circuit-inset">
              <MiniMap standId={selection.stand} />
              <div>
                <span className="eyebrow">YOU ARE HERE</span>
                <strong>{stand.zone || "Sphere zone"}</strong>
                <small>{stand.corner}</small>
              </div>
            </div>
            <div className="scene-instruction">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                aria-hidden="true"
              >
                <path d="M8 4h8a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z" />
                <path d="M12 4v6" />
              </svg>
              {flat
                ? "Choose a stand in the selector"
                : mode === "seat"
                  ? "DRAG TO LOOK · SCROLL TO ZOOM"
                  : "DRAG TO ORBIT · SELECT A GRANDSTAND"}
            </div>
            <div className="north">
              <span>N</span>
              <svg viewBox="0 0 24 30">
                <path
                  d="m12 1 8 24-8-5-8 5Z"
                  fill="none"
                  stroke="currentColor"
                />
              </svg>
            </div>
          </div>
          <div className="track-demo">
            <button aria-pressed={historyOpen} onClick={() => setHistoryOpen(!historyOpen)}>Historical race</button>
            {!historyOpen && <button aria-pressed={playing} onClick={() => setPlaying(!playing)}>
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                {playing ? (
                  <path d="M5 4h3v12H5zm7 0h3v12h-3Z" />
                ) : (
                  <path d="m6 3 11 7-11 7Z" />
                )}
              </svg>
              {playing ? "Pause demo" : "Start demo"}
            </button>}
            <details className="scene-controls">
              <summary>Scene settings</summary>
              <div>
                <label>
                  Sphere display
                  <select
                    aria-label="Sphere display"
                    value={sphereDisplay}
                    onChange={(e) =>
                      setSphereDisplay(e.target.value as SphereDisplay)
                    }
                  >
                    {sphereDisplays.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="scene-atmosphere">
                  <input
                    type="checkbox"
                    checked={atmosphere}
                    onChange={(e) => setAtmosphere(e.target.checked)}
                  />
                  Light beams & airborne particles
                </label>
                <p>
                  {sphereDisplay === "moon"
                    ? "Lunar map: NASA / LRO."
                    : "Original display artwork."}{" "}
                  Simulated display, not a live Sphere feed.
                </p>
                <a
                  href="https://www.thesphere.com/xo-stream"
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch the real Sphere display
                </a>
                <a
                  href="https://maps.app.goo.gl/DpXKoWXbPmJotJch9"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sphere on Google Maps
                </a>
              </div>
            </details>
            <span>{historyOpen ? "2024 archive · projected onto estimated track" : "Illustrative racing · not live timing"}</span>
          </div>
          {historyOpen && <HistoricalReplay standId={selection.stand} onChange={setReplay} onClose={() => {setHistoryOpen(false);setReplay(null);}} />}
          {saved.length > 0 && (
            <div className="compare-dock" aria-label="Saved view shortlist">
              <div className="dock-items">
                {saved.map((item) => (
                  <div className="dock-item" key={key(item)}>
                    <button
                      className="dock-preview"
                      aria-label={
                        "Preview position " +
                        item.stand +
                        " row " +
                        item.row +
                        " " +
                        selectionLabel(item).toLowerCase()
                      }
                      onClick={() => {
                        navigate(item, "seat");
                        setFlat(false);
                        setPanelOpen(false);
                      }}
                    >
                      <strong>Position {item.stand}</strong>
                      <span>
                        R{item.row} · {selectionLabel(item)}
                      </span>
                    </button>
                    <button
                      className="dock-remove"
                      aria-label={
                        "Remove saved position " +
                        item.stand +
                        " row " +
                        item.row +
                        " " +
                        selectionLabel(item).toLowerCase()
                      }
                      onClick={() =>
                        navigate(
                          selection,
                          mode,
                          saved.filter((x) => key(x) !== key(item)),
                          true,
                        )
                      }
                    >
                      <Icon name="close" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="dock-compare"
                onClick={() => setDialog("compare")}
              >
                Compare {saved.length}
              </button>
            </div>
          )}
          <div className="model-caption">
            <span className="live-mark" />
            {flat || unavailable
              ? "2D ORIENTATION"
              : ready
                ? "INTERACTIVE 3D MODEL"
                : "LOADING 3D MODEL"}
            <span>
              Estimated geometry ·{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
              >
                © OpenStreetMap contributors
              </a>
            </span>
          </div>
        </section>
        <aside
          className={"selection-panel " + (panelOpen ? "" : "collapsed")}
          id="seat-controls"
          aria-label="Seat selection"
        >
          <button
            className="mobile-panel-toggle"
            onClick={() => setPanelOpen(!panelOpen)}
            aria-expanded={panelOpen}
          >
            <span className="sheet-handle" />
            <span className="mobile-summary">
              {stand.name}
              <strong>
                ROW {selection.row} / {selectionLabel(selection).toUpperCase()}
              </strong>
            </span>
            <span className="mobile-action">
              {panelOpen ? "Close controls" : "Choose seats"}
            </span>
          </button>
          <div className="panel-content">
            <div className="panel-intro">
              {season === 2027 && (
                <p className="season-model-note">
                  Browsing 2027 · 2026 reference model
                </p>
              )}
              <h2>
                FIND YOUR SEAT<span className="panel-edition">2026</span>
              </h2>
              <p>{stand.zone || "T-Mobile Zone at Sphere"}</p>
            </div>
            <section className="stand-picker">
              <div className="section-label">
                <h3>Grandstand position</h3>
                <span>9 MODELED BANKS</span>
              </div>
              <div
                className="stand-tabs"
                aria-label="Modeled grandstand positions"
              >
                {stands.map((s) => (
                  <button
                    key={s.id}
                    className={s.id === stand.id ? "active" : ""}
                    aria-label={"Position " + s.id + ", " + s.name}
                    aria-pressed={s.id === stand.id}
                    onClick={() => chooseStand(s.id)}
                  >
                    <strong>{s.id}</strong>
                    <span>{s.corner}</span>
                  </button>
                ))}
              </div>
              <div className="stand-name">
                <h3>{stand.name}</h3>
                <span>{stand.corner}</span>
              </div>
              <p className="stand-description">{stand.description}</p>
            </section>
            <section className="party-picker" aria-label="Group planning">
              <div className="section-label">
                <h3>Seats together</h3>
                <span>MODELED GROUP</span>
              </div>
              <div className="party-options">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    aria-label={
                      "Plan " + n + (n === 1 ? " seat" : " adjacent seats")
                    }
                    aria-pressed={partyCount === n}
                    onClick={() =>
                      navigate({ ...selection, party: n }, mode, saved, true)
                    }
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p>
                {partyCount === 1
                  ? "Choose a seat to inspect its view."
                  : selectionLabel(selection) +
                    " stay on one side of the modeled aisle."}
              </p>
            </section>
            <section className="position-picker">
              <div className="section-label">
                <h3>Pick your position</h3>
                <button className="map-expand" onClick={() => setDialog("map")}>
                  Full seating grid
                </button>
              </div>
              <div className="steppers">
                <Stepper
                  label="Modeled row"
                  value={selection.row}
                  max={stand.rows}
                  onChange={(v) => change({ ...selection, row: v })}
                />
                <Stepper
                  label="Modeled seat"
                  value={selection.seat}
                  max={stand.seats}
                  onChange={(v) => change({ ...selection, seat: v })}
                />
              </div>
              <div className="row-presets" aria-label="Quick row selection">
                {[
                  { label: "Front", row: 3 },
                  { label: "Middle", row: 10 },
                  { label: "High", row: 18 },
                ].map((p) => (
                  <button
                    key={p.row}
                    aria-pressed={selection.row === p.row}
                    onClick={() => change({ ...selection, row: p.row })}
                  >
                    {p.label}
                    <span>R{p.row}</span>
                  </button>
                ))}
              </div>
              <SeatGrid selection={selection} onChange={change} />
            </section>
            <div className="view-evidence">
              <div>
                <strong>3D estimate</strong>
                <span>Viewing seat {selection.seat} · No verified photo</span>
              </div>
              <button onClick={() => setDialog("sources")}>View sources</button>
            </div>
            <div className="selection-summary">
              <div>
                <span>EST. EYE HEIGHT</span>
                <strong>
                  {position[1].toFixed(1)} <small>m</small>
                </strong>
              </div>
              <div>
                <span>FACING</span>
                <strong>{stand.corner}</strong>
              </div>
              <button
                aria-label="Explain model accuracy"
                onClick={() => setDialog("sources")}
              >
                i
              </button>
            </div>

            <div className="accuracy-note">
              <span className="accuracy-symbol">≈</span>
              <p>
                Reconstructed seat views.
                <br />
                <span>Seat positions and sightlines are estimated.</span>{" "}
                <button onClick={() => setDialog("sources")}>
                  How this is modeled
                </button>
              </p>
            </div>
          </div>
          <div className="panel-actions">
            <div className="action-selection">
              <span>
                Position {stand.id} · row {selection.row}
              </span>
              <strong>{selectionLabel(selection)}</strong>
            </div>
            <button
              className="primary-button"
              onClick={() => {
                navigate(selection, "seat");
                setReset((v) => v + 1);
                setPanelOpen(false);
                setFlat(false);
                if (window.innerWidth <= 760)
                  window.scrollTo({
                    top: 0,
                    behavior: window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches
                      ? "auto"
                      : "smooth",
                  });
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {mode === "seat" ? "Reset seat view" : "View from this seat"}
            </button>
            <button className="save-button" onClick={save}>
              <Icon name="plus" />
              {isSaved ? "View saved comparison" : "Add to comparison"}
              <span>{saved.length}/3</span>
            </button>
            <div className="ticket-info">
              <span>Planning your next race?</span>
              <a
                href="https://www.f1lasvegasgp.com/tickets/grandstands/t-mobile-grandstands/"
                target="_blank"
                rel="noreferrer"
              >
                Official ticket information
              </a>
            </div>
          </div>
        </aside>
      </main>
      <footer className="status-bar">
        <span>
          INDEPENDENT SEAT EXPLORER <span className="footer-divider">/</span>{" "}
          2026 HISTORICAL LAYOUT
        </span>
        <div>
          <button onClick={() => setDialog("sources")}>
            Sources & accuracy
          </button>
          <button onClick={share}>
            <Icon name="share" />
            Share view
          </button>
        </div>
      </footer>
      <div
        role="status"
        aria-live="polite"
        className={"toast " + (notice ? "visible" : "")}
      >
        {notice}
      </div>
      <dialog
        ref={dialogRef}
        onCancel={() => setDialog(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setDialog(null);
        }}
        className={
          dialog === "compare"
            ? "comparison-dialog"
            : dialog === "map"
              ? "map-dialog"
              : "sources-dialog"
        }
      >
        <div className="dialog-header">
          <div>
            <span className="eyebrow">
              {dialog === "compare"
                ? "YOUR SHORTLIST"
                : "2026 REFERENCE EDITION"}
            </span>
            <h2>
              {dialog === "compare"
                ? "Find the view that feels right."
                : dialog === "map"
                  ? "Choose your position"
                  : "Built to explore. Modeled with care."}
            </h2>
          </div>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={() => setDialog(null)}
          >
            <Icon name="close" />
          </button>
        </div>
        {dialog === "map" ? (
          <div className="expanded-seat-map">
            <p>
              Position {stand.id} · {stand.name}. Row {selection.row}, seat{" "}
              {selection.seat}. Select a seat or use the arrow keys. These are
              modeled seat identifiers.
            </p>
            <FullSeatMap
              selection={selection}
              onChange={(s) => navigate(s, mode, saved, true)}
            />
            <div className="selected-grid-heading">
              <h3>
                Position {stand.id} · {stand.name}
              </h3>
              <span>
                Complete grid · seats 1–{stand.seats} · rows 1–{stand.rows}
              </span>
              <button
                className="grid-magnify"
                aria-pressed={gridZoom}
                onClick={() => setGridZoom(!gridZoom)}
              >
                {gridZoom ? "Fit full grid" : "Magnify seats"}
              </button>
            </div>
            <div className={gridZoom ? "detail-grid zoomed" : "detail-grid"}>
              <SeatGrid
                selection={selection}
                onChange={(s) => navigate(s, mode, saved, true)}
                large
                zoom={gridZoom}
              />
            </div>
            <div className="map-position-controls">
              <Stepper
                label="Grid row"
                value={selection.row}
                max={stand.rows}
                onChange={(row) => change({ ...selection, row })}
              />
              <Stepper
                label="Grid seat"
                value={selection.seat}
                max={stand.seats}
                onChange={(seat) => change({ ...selection, seat })}
              />
            </div>
            <div className="map-confirm">
              <span>
                Modeled row {selection.row} /{" "}
                {selectionLabel(selection).toLowerCase()}
              </span>
              <button
                className="primary-button"
                onClick={() => {
                  navigate(selection, "seat");
                  setDialog(null);
                  setPanelOpen(false);
                }}
              >
                Preview selected seat
              </button>
            </div>
          </div>
        ) : dialog === "compare" ? (
          <>
            {saved.length ? (
              <>
                <p className="dialog-description">
                  The same eye-level camera settings, from different positions.
                  All seat positions and obstruction geometry are estimated.
                </p>
                <div className="comparison-camera">
                  <div className="comparison-camera-heading">
                    <strong>Linked view controls</strong>
                    <button
                      onClick={() => {
                        setCompareYaw(0);
                        setComparePitch(0);
                      }}
                    >
                      Reset angles
                    </button>
                  </div>
                  <p>
                    Look in the same relative direction from every saved
                    position.
                  </p>
                  <div className="comparison-sliders">
                    <label>
                      Look left or right <output>{compareYaw}°</output>
                      <input
                        type="range"
                        aria-label="Horizontal comparison angle"
                        min="-90"
                        max="90"
                        step="1"
                        value={compareYaw}
                        onChange={(e) => setCompareYaw(Number(e.target.value))}
                      />
                    </label>
                    <label>
                      Look up or down <output>{comparePitch}°</output>
                      <input
                        type="range"
                        aria-label="Vertical comparison angle"
                        min="-20"
                        max="30"
                        step="1"
                        value={comparePitch}
                        onChange={(e) =>
                          setComparePitch(Number(e.target.value))
                        }
                      />
                    </label>
                  </div>
                </div>
                <div className="comparison-grid">
                  {saved.map((s) => {
                    const st = getStand(s.stand);
                    return (
                      <article key={key(s)} className="comparison-item">
                        <div className="comparison-preview">
                          <Suspense fallback={<span>Loading view…</span>}>
                            <Scene
                              selection={s}
                              mode="seat"
                              reset={0}
                              preview
                              previewLook={comparisonLook}
                              sphereDisplay={sphereDisplay}
                              atmosphere={atmosphere}
                              ambientMotion={false}
                            />
                          </Suspense>
                        </div>
                        <div className="comparison-detail">
                          <span className="eyebrow">
                            POSITION {s.stand} · {st.corner}
                          </span>
                          <h3>{st.name}</h3>
                          <p>
                            Modeled row {s.row} ·{" "}
                            {selectionLabel(s).toLowerCase()}
                          </p>
                          <p className="anchor-view">Camera at seat {s.seat}</p>
                          <dl>
                            <div>
                              <dt>Est. eye height</dt>
                              <dd>{seatPosition(s)[1].toFixed(1)} m</dd>
                            </div>
                            <div>
                              <dt>Track direction</dt>
                              <dd>{st.corner}</dd>
                            </div>
                            <div>
                              <dt>Landmark visibility</dt>
                              <dd>Inspect modeled view</dd>
                            </div>
                            <div>
                              <dt>Obstructions</dt>
                              <dd>
                                {s.row <= 5
                                  ? "Low rows: inspect fencing"
                                  : "Check fence posts and rails"}
                              </dd>
                            </div>
                            <div>
                              <dt>Verified photo</dt>
                              <dd>Not available</dd>
                            </div>
                          </dl>
                          <button
                            className="primary-button"
                            onClick={() => {
                              navigate(s, "seat");
                              setDialog(null);
                              setFlat(false);
                            }}
                          >
                            Explore this seat
                          </button>
                          <button
                            className="remove-button"
                            onClick={() =>
                              navigate(
                                selection,
                                mode,
                                saved.filter((x) => key(x) !== key(s)),
                                true,
                              )
                            }
                          >
                            Remove from comparison
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <button className="share-comparison" onClick={share}>
                  <Icon name="share" />
                  Copy comparison link
                </button>
              </>
            ) : (
              <div className="empty-comparison">
                <Icon name="bookmark" />
                <h3>Your shortlist starts with a seat.</h3>
                <p>
                  Choose a position and select “Add to comparison.” Save up to
                  three perspectives.
                </p>
                <button
                  className="primary-button"
                  onClick={() => setDialog(null)}
                >
                  Explore seats
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="source-content">
            <p>
              This independent, F1-inspired explorer reconstructs the Sphere
              zone using the organizer’s 2026 location diagram. It is a planning
              model, not a verified photographic seat preview or ticket seller.
            </p>
            <h3>What the sources establish</h3>
            <p>
              The circuit’s approximate shape, the relationship to Sphere, and
              grandstand areas outside the track. Assigned seating is described
              by the organizer.
            </p>
            <h3>What is estimated</h3>
            <p>
              A–E, M, H, K and F are app-specific modeled bank labels. Row
              counts, seat numbers, tier heights, distances, buildings, fencing
              and support-post dimensions are illustrative reconstruction
              parameters. They are not official ticket identifiers. Eye height
              is calculated within this model, not measured at the venue.
            </p>
            <p>
              The displayed Sphere artwork is original illustration. Seat
              numbers, venue screens, service pavilions, equipment placement and
              generic spectator silhouettes are illustrative. Layouts and
              temporary structures can change by race edition. A low row may
              encounter fencing; the exact obstruction cannot be confirmed from
              this model.
            </p>
            <h3>Research sources</h3>
            <ul className="source-links">
              {sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.title}
                  </a>
                  <span>{s.detail}</span>
                </li>
              ))}
            </ul>
            <p className="source-date">
              Sources inspected 22 November 2026. No live availability, seat
              reservations, or checkout. The 2026 race edition has concluded.
            </p>
            <h3>Your saved seats</h3>
            <p>
              Your shortlist is stored in this browser. Shared links contain the
              selected positions. This app has no accounts, analytics, payment
              forms, or advertising integrations. Hosting services may process
              requests under their own policies.
            </p>
            <a
              href="https://github.com/Parthawe/sphere-seat-explorer"
              target="_blank"
              rel="noreferrer"
            >
              View the source on GitHub
            </a>
          </div>
        )}
      </dialog>
    </div>
  );
}
