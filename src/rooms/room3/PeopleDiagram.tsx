import type { PeopleFacet } from '../../content/types';
import { arcPath, polar } from '../../lib/polar';

const CX = 200;
const CY = 200;
const R = 150;
const GAP = 6;

type Props = {
  facets: PeopleFacet[];
  activeId: string | null;
  onToggle: (id: string) => void;
};

export default function PeopleDiagram({ facets, activeId, onToggle }: Props) {
  return (
    <svg className="pd" viewBox="0 0 400 400" role="group" aria-label="Sơ đồ nhân dân">
      <circle cx={CX} cy={CY} r={64} fill="var(--ink-soft)" stroke="var(--accent)" strokeWidth="1" />
      <text className="pd__core" x={CX} y={CY + 6} textAnchor="middle">NHÂN DÂN</text>

      {facets.map((facet, i) => {
        const start = i * 120 + GAP;
        const end = (i + 1) * 120 - GAP;
        const mid = polar(CX, CY, R + 28, (start + end) / 2);
        const on = activeId === facet.id;
        const dim = activeId !== null && !on;

        return (
          <g
            key={facet.id}
            className={dim ? 'pd__arc pd__arc--dim' : 'pd__arc'}
            onClick={() => onToggle(facet.id)}
          >
            <path
              d={arcPath(CX, CY, R, start, end)}
              fill="none"
              stroke={on ? 'var(--accent)' : 'var(--paper-dim)'}
              strokeWidth={on ? 10 : 4}
              strokeLinecap="round"
            />
            <text className="pd__label" x={mid.x} y={mid.y} textAnchor="middle">
              {facet.title}
            </text>
            <path
              d={arcPath(CX, CY, R, start, end)}
              fill="none"
              stroke="transparent"
              strokeWidth={56}
              tabIndex={0}
              role="button"
              aria-pressed={on}
              aria-label={facet.title}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onToggle(facet.id);
                }
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
