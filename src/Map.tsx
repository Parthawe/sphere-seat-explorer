import { stands, SPHERE } from "./model";
export const circuitPath =
  "M130 105L130-45Q130-100 45-116Q32-84 7-97L-26-115Q-77-135-78-80L-78 50Q-78 135-125 155L-210 202Q-245 235-245 290Q0 440 270 450L675 450L675 425L725 400L725 5Q725-15 695-34L570-135Q530-150 560-85Q625-10 575 45Q560 105 530 95Z";
export function FlatMap({
  onStand,
  selected,
}: {
  onStand?: (id: string) => void;
  selected: string;
}) {
  return (
    <div className="flat-map">
      <svg
        viewBox="-300 -210 1100 730"
        role="img"
        aria-label="Circuit orientation map"
      >
        <path d={circuitPath} fill="none" stroke="#7c7c91" strokeWidth="9" />
        <circle cx="0" cy="0" r={SPHERE.radius} fill="#e10600" />
        {stands.map((s) => (
          <g key={s.id} onClick={() => onStand?.(s.id)}>
            <rect
              x={s.center[0] - 22}
              y={s.center[2] - 12}
              width="44"
              height="12"
              fill={selected === s.id ? "#e10600" : "#cbcbd8"}
              transform={
                "rotate(" +
                (-s.rotation * 180) / Math.PI +
                " " +
                s.center[0] +
                " " +
                s.center[2] +
                ")"
              }
            />
            <text
              x={s.center[0]}
              y={s.center[2] - 24}
              fill="#f4f4f8"
              textAnchor="middle"
              fontSize="19"
            >
              {s.id}
            </text>
          </g>
        ))}
        <text x="0" y="7" fontSize="16" textAnchor="middle" fill="#ffffff">
          SPHERE
        </text>
        <text x="280" y="490" fontSize="19" fill="#9c9cb3">
          LAS VEGAS STRIP
        </text>
      </svg>
      <span>2D circuit orientation · estimated placement</span>
    </div>
  );
}
