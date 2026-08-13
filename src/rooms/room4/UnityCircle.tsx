import { useDroppable } from '@dnd-kit/core';
import type { CSSProperties } from 'react';
import type { UnityGroup } from '../../content/types';
import { polar } from '../../lib/polar';
import { TOTAL_GROUPS } from './unityState';

const CX = 160;
const CY = 160;
const R = 118;
type Props = { joined: string[]; groups: UnityGroup[] };

export default function UnityCircle({ joined, groups }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: 'unity-circle' });
  const glow = joined.length / TOTAL_GROUPS;
  const ringStyle = { '--unity-glow': glow } as CSSProperties;
  return <div ref={setNodeRef} className={isOver ? 'unity unity--over' : 'unity'}><svg viewBox="0 0 320 320" role="img" aria-label="Khối đại đoàn kết toàn dân tộc"><circle className="unity__ring" cx={CX} cy={CY} r={R} fill="none" stroke="var(--accent)" strokeWidth={1 + glow * 5} opacity={0.25 + glow * 0.75} style={ringStyle} /><text className="unity__core" x={CX} y={CY - 8} textAnchor="middle">ĐẠI ĐOÀN KẾT</text><text className="unity__core" x={CX} y={CY + 14} textAnchor="middle">TOÀN DÂN TỘC</text>{joined.map((id, i) => { const seat = polar(CX, CY, R, (360 / TOTAL_GROUPS) * i); const group = groups.find((item) => item.id === id); return <g key={id}><circle cx={seat.x} cy={seat.y} r="7" fill="var(--accent-soft)" /><text className="unity__seat" x={seat.x} y={seat.y - 14} textAnchor="middle">{group?.name}</text></g>; })}</svg></div>;
}
