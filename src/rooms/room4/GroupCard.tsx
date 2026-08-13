import { useDraggable } from '@dnd-kit/core';
import type { UnityGroup } from '../../content/types';

type Props = { group: UnityGroup; onPick: (id: string) => void };

export default function GroupCard({ group, onPick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: group.id });
  return <button ref={setNodeRef} type="button" className={isDragging ? 'gcard gcard--dragging' : 'gcard'} style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined} onClick={() => onPick(group.id)} aria-label={`Thêm ${group.name} vào khối đại đoàn kết`} {...listeners} {...attributes}>{group.name}</button>;
}
