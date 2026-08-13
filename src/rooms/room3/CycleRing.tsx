import { useReducedMotion } from '../../hooks/useReducedMotion';
import { polar } from '../../lib/polar';

const CX = 130;
const CY = 130;
const R = 92;

export default function CycleRing({ nodes }: { nodes: { id: string; label: string }[] }) {
  const reduced = useReducedMotion();

  return (
    <svg
      className="cycle"
      viewBox="0 0 260 260"
      role="img"
      aria-label="Vòng tuần hoàn nhân dân, nhà nước, chính sách"
    >
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line)" strokeWidth="1" />

      {!reduced && (
        <circle r="5" fill="var(--accent)">
          <animateMotion
            dur="8s"
            repeatCount="indefinite"
            path={`M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX - 0.01} ${CY - R} Z`}
          />
        </circle>
      )}

      {nodes.map((node, i) => {
        const p = polar(CX, CY, R, (360 / nodes.length) * i);
        return (
          <g key={node.id}>
            <circle cx={p.x} cy={p.y} r="24" fill="var(--ink-soft)" stroke="var(--accent-soft)" strokeWidth="1" />
            <text className="cycle__label" x={p.x} y={p.y + 4} textAnchor="middle">
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
