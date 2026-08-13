import { motion } from 'framer-motion';
import type { MapStop } from '../../content/types';

type Props = { from: MapStop; to: MapStop; faded?: boolean };

/** Đường cong nối hai điểm, độ võng tỉ lệ với khoảng cách. */
export function curveBetween(from: MapStop, to: MapStop): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const lift = Math.hypot(to.x - from.x, to.y - from.y) * 0.22;
  return `M ${from.x} ${from.y} Q ${mx} ${my - lift} ${to.x} ${to.y}`;
}

export default function RouteLine({ from, to, faded = false }: Props) {
  return (
    <motion.path
      d={curveBetween(from, to)}
      fill="none"
      stroke="var(--accent)"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 1 }}
      animate={{ pathLength: 1, opacity: faded ? 0.25 : 1 }}
      transition={{
        pathLength: { duration: 0.4, ease: 'easeOut' },
        opacity: { duration: 0.15, delay: 0.25 },
      }}
    />
  );
}
