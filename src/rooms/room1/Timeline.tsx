import { motion } from 'framer-motion';
import type { Milestone } from '../../content/types';

type Props = {
  items: Milestone[];
  index: number;
  onSelect: (next: number) => void;
  onStep: (delta: number) => void;
};

export default function Timeline({ items, index, onSelect, onStep }: Props) {
  function onKeyDown(event: React.KeyboardEvent<HTMLOListElement>) {
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
    <ol
      className="tl"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="Các mốc thời gian, dùng phím mũi tên trái phải để chuyển"
    >
      <span className="tl__rail" aria-hidden="true" />
      {items.map((item, i) => {
        const active = i === index;
        return (
          <li key={item.year} className="tl__item">
            <button
              type="button"
              className={active ? 'tl__dot tl__dot--on' : 'tl__dot'}
              aria-current={active ? 'step' : undefined}
              onClick={() => onSelect(i)}
            >
              {active && (
                <motion.span layoutId="tl-spark" className="tl__spark" aria-hidden="true" />
              )}
              <span className="tl__year">{item.year}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
