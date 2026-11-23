import { useId } from "react";
import type { VenueDefinition } from "./venueRegistry";
/** Registry-backed source geometry and area callouts; no generated chair coordinates. */
export default function CircuitAreaMap({
  venue,
  selected,
  onSelect,
}: {
  venue: VenueDefinition;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const grid = useId().replaceAll(":", ""),
    hatch = grid + "-seats";
  const path =
    "M" + venue.geography.points.map((p) => p.join(",")).join(" L") + " Z";
  const seating = venue.map.markerStyle === "seating";
  return (
    <div className="lusail-map venue-area-map" data-venue={venue.id}>
      <div className="map-heading">
        <span>{venue.name.toUpperCase()}</span>
        <span>{venue.season} REFERENCE</span>
      </div>
      <svg
        viewBox="0 0 620 570"
        role="group"
        aria-label={`${venue.name} circuit with approximate viewing-area callouts`}
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
          <pattern
            id={hatch}
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 1H5" stroke="#8a8b97" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="620" height="570" fill={`url(#${grid})`} />
        <path
          d={path}
          fill="#20212b"
          stroke="#353744"
          strokeWidth={seating ? 26 : 22}
          strokeLinejoin="round"
        />
        <path
          d={path}
          fill="none"
          stroke="#f0f1f4"
          strokeWidth={seating ? 8 : 6}
          strokeLinejoin="round"
        />
        <path
          d={path}
          className="circuit-racing-line"
          fill="none"
          stroke="#e10600"
          strokeWidth={seating ? 3 : 2.5}
          strokeDasharray={seating ? "90 1800" : "70 1800"}
          strokeLinecap="round"
        />
        {venue.map.movingDot && (
          <g className="circuit-car">
            <circle r="5" fill="#f7bb4c">
              <animateMotion dur="19s" repeatCount="indefinite" path={path} />
            </circle>
          </g>
        )}
        {venue.map.decorations?.map((d, i) =>
          d.kind === "text" ? (
            <text key={i} x={d.x} y={d.y} className="map-micro">
              {d.text}
            </text>
          ) : (
            <path
              key={i}
              d={d.d}
              stroke={d.stroke}
              strokeWidth={d.width}
              strokeDasharray={d.dash}
            />
          ),
        )}
        {venue.areas.map((a) => (
          <g
            key={a.id}
            className={`map-area ${selected === a.id ? "is-active" : ""}`}
            onClick={() => onSelect(a.id)}
          >
            {!seating && (
              <path
                d={`M${a.point.join(",")} L${a.label[0]},${a.label[1] + 7}`}
                className="map-area-leader"
                fill="none"
                strokeWidth="1"
              />
            )}
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
                r={seating && a.id === selected ? 32 : 23}
                className="map-area-halo"
              />
              {seating && (
                <rect
                  x={a.point[0] - 14}
                  y={a.point[1] - 8}
                  width="28"
                  height="16"
                  rx="2"
                  fill={`url(#${hatch})`}
                  transform={`rotate(52 ${a.point[0]} ${a.point[1]})`}
                />
              )}
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
          {venue.watermark}
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
        {venue.areas.map((a) => (
          <button
            key={a.id}
            aria-pressed={a.id === selected}
            onClick={() => onSelect(a.id)}
          >
            {a.controlLabel || a.short}
          </button>
        ))}
      </div>
      <div className="map-caption">
        <span>Broad areas · no exact seat coordinates</span>
        <a href={venue.officialMap} target="_blank" rel="noreferrer">
          Organizer’s circuit guide
        </a>
      </div>
    </div>
  );
}
