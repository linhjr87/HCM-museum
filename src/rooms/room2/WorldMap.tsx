import type { MapStop } from '../../content/types';
import RouteLine from './RouteLine';

type Props = {
  stops: MapStop[];
  index: number;
  visited: number[];
  onSelect: (next: number) => void;
  onStep: (delta: number) => void;
};

const GRID_X = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const GRID_Y = [100, 200, 300, 400];

export default function WorldMap({ stops, index, visited, onSelect, onStep }: Props) {
  const ordered = visited.slice().sort((a, b) => a - b);
  const legs = ordered.slice(1).map((step, i) => [ordered[i], step] as const);

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onStep(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onStep(-1);
    }
  }

  return (
    <div className="map-wrap">
      <svg
        className="map"
        viewBox="0 0 1000 500"
        role="img"
        aria-label="Bản đồ hành trình qua năm địa điểm"
      >
      <g className="map__grid" aria-hidden="true">
        {GRID_X.map((x) => (
          <line key={`x${x}`} x1={x} y1="0" x2={x} y2="500" />
        ))}
        {GRID_Y.map((y) => (
          <line key={`y${y}`} x1="0" y1={y} x2="1000" y2={y} />
        ))}
        <line className="map__equator" x1="0" y1="250" x2="1000" y2="250" />
      </g>

      {legs.map(([a, b]) => (
        <RouteLine key={`${a}-${b}`} from={stops[a]} to={stops[b]} faded={b !== index} />
      ))}

      {stops.map((stop, i) => {
        const on = i === index;
        return (
          <g key={stop.id} className={on ? 'map__stop map__stop--on' : 'map__stop'}>
            <circle
              cx={stop.x}
              cy={stop.y}
              r={on ? 8 : 5}
              fill={on ? 'var(--accent)' : 'var(--paper-dim)'}
            />
            <text
              className="map__label"
              x={stop.x + stop.labelDx}
              y={stop.y + stop.labelDy}
              textAnchor="middle"
            >
              {stop.label}
            </text>
          </g>
        );
      })}
      </svg>

      <p className="map__legend-title" id="map-legend-title">
        Chú giải hành trình — chọn một địa điểm để xem câu chuyện
      </p>
      <div className="map__controls" role="group" aria-labelledby="map-legend-title">
        {stops.map((stop, i) => (
          <button
            key={stop.id}
            type="button"
            className={i === index ? 'map__control map__control--on' : 'map__control'}
            aria-current={i === index ? 'step' : undefined}
            onClick={() => onSelect(i)}
            onKeyDown={onKeyDown}
          >
            {stop.label}
          </button>
        ))}
      </div>
    </div>
  );
}
