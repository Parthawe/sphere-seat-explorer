import { useId } from "react";
export type CircuitArea = {
  id: string;
  name: string;
  short: string;
  point: readonly number[];
  label: readonly number[];
};
/** Source geometry with explicit callouts; no generated chair or entrance coordinates. */
export default function CircuitAreaMap({
  name,
  season,
  points,
  areas,
  selected,
  onSelect,
  officialMap,
}: {
  name: string;
  season: number;
  points: number[][];
  areas: readonly CircuitArea[];
  selected: string;
  onSelect: (id: string) => void;
  officialMap: string;
}) {
  const grid = useId().replaceAll(":", "");
  const path = "M" + points.map((p) => p.join(",")).join(" L") + " Z";
  return (
    <div className="lusail-map venue-area-map">
      <div className="map-heading">
        <span>{name.toUpperCase()}</span>
        <span>{season} REFERENCE</span>
      </div>
      <svg
        viewBox="0 0 620 570"
        role="group"
        aria-label={`${name} circuit with approximate viewing-area callouts`}
      >
        <defs>
          <pattern
            id={grid}
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M36 0H0V36"
              fill="none"
              stroke="#fff"
              strokeOpacity=".045"
            />
          </pattern>
        </defs>
        <rect width="620" height="570" fill={`url(#${grid})`} />
        <path
          d={path}
          fill="#20212b"
          stroke="#353744"
          strokeWidth="22"
          strokeLinejoin="round"
        />
        <path
          d={path}
          fill="none"
          stroke="#f0f1f4"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d={path}
          className="circuit-racing-line"
          fill="none"
          stroke="#e10600"
          strokeWidth="2.5"
          strokeDasharray="70 1800"
          strokeLinecap="round"
        />
        {areas.map((a) => (
          <g
            key={a.id}
            className={`map-area ${selected === a.id ? "is-active" : ""}`}
            onClick={() => onSelect(a.id)}
          >
            <path
              d={`M${a.point.join(",")} L${a.label[0]},${a.label[1] + 7}`}
              className="map-area-leader"
              fill="none"
              strokeWidth="1"
            />
            <g
              role="button"
              tabIndex={0}
              aria-label={`Select ${a.name} on map`}
              aria-pressed={a.id === selected}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(a.id);
                }
              }}
            >
              <circle
                cx={a.point[0]}
                cy={a.point[1]}
                r="23"
                className="map-area-halo"
              />
              <circle
                cx={a.point[0]}
                cy={a.point[1]}
                r="5"
                className="map-area-dot"
              />
            </g>
            <text
              x={a.label[0]}
              y={a.label[1]}
              className="map-label"
              aria-hidden="true"
            >
              {a.short}
            </text>
          </g>
        ))}
        <g transform="translate(560 70)">
          <path
            d="M0 26V0M-6 8L0 0L6 8"
            fill="none"
            stroke="#a3a6b7"
            strokeWidth="1.5"
          />
          <text x="-5" y="-10" className="map-micro">
            N
          </text>
        </g>
        <text x="32" y="530" className="map-watermark">
          {name.replace(/ Circuit$/i, "").toUpperCase()}
        </text>
        <text x="34" y="550" className="map-micro">
          GEOGRAPHIC TRACK · APPROXIMATE VIEWING AREAS
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
            aria-pressed={a.id === selected}
            onClick={() => onSelect(a.id)}
          >
            {a.short}
          </button>
        ))}
      </div>
      <div className="map-caption">
        <span>Broad areas · no exact seat coordinates</span>
        <a href={officialMap} target="_blank" rel="noreferrer">
          Organizer’s circuit guide
        </a>
      </div>
    </div>
  );
}
