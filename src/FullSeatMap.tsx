import { stands, partySeats, type Selection } from "./model";
export function FullSeatMap({
  selection,
  onChange,
}: {
  selection: Selection;
  onChange: (s: Selection) => void;
}) {
  return (
    <section
      className="full-zone-grid"
      aria-label="Complete modeled seating grid"
    >
      <div className="zone-grid-heading">
        <h3>All modeled seating banks</h3>
        <span>All 9 banks · illustrative rows and center aisles</span>
      </div>
      <div className="zone-grid-stands">
        {stands.map((s) => (
          <button
            key={s.id}
            className={s.id === selection.stand ? "selected" : ""}
            aria-label={`Select position ${s.id}, ${s.name}`}
            aria-pressed={s.id === selection.stand}
            onClick={() =>
              onChange({
                ...selection,
                stand: s.id,
                seat: Math.min(selection.seat, s.seats),
              })
            }
          >
            <span className="zone-stand-label">
              <strong>
                {s.id} · {s.name}
              </strong>
              <span>{s.corner}</span>
            </span>
            <svg viewBox={`-9 -10 ${s.seats * 5 + 20} 110`} aria-hidden="true">
              <path d={`M0 -4H${s.seats * 5 + 8}`} stroke="#9295a6" />
              {Array.from({ length: 18 }, (_, r) => (
                <g key={r}>
                  <text x="-8" y={r * 5 + 7} fontSize="4" fill="#696b7c">
                    {r + 1}
                  </text>
                  {Array.from({ length: s.seats }, (_, i) => (
                    <circle
                      key={i}
                      cx={i * 5 + (i >= s.seats / 2 ? 8 : 0) + 2}
                      cy={r * 5 + 6}
                      r="1.7"
                      fill={
                        s.id === selection.stand &&
                        r + 1 === selection.row &&
                        partySeats(selection).includes(i + 1)
                          ? "#e10600"
                          : "#858a9e"
                      }
                    />
                  ))}
                </g>
              ))}
            </svg>
            <span className="zone-grid-count">
              {s.rows * s.seats} modeled seats · select to inspect
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
