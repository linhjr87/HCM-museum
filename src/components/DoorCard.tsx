import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { RoomMeta } from '../content/types';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './DoorCard.css';

const MAX_TILT = 8; // độ, theo ràng buộc chuyển động trong spec

export default function DoorCard({ room }: { room: RoomMeta }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  function onPointerMove(event: React.PointerEvent<HTMLAnchorElement>) {
    if (reduced || event.pointerType !== 'mouse' || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    setTilt({ x: -py * 2 * MAX_TILT, y: px * 2 * MAX_TILT });
  }

  function reset() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <Link
      ref={ref}
      to={room.path}
      className="door"
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      <span className="door__number">{room.number}</span>
      <span className="door__title">{room.title}</span>
      <span className="door__tagline">{room.tagline}</span>
      <svg className="door__motif" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth=".6" />
        <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth=".6" />
        <line x1="50" y1="8" x2="50" y2="92" stroke="currentColor" strokeWidth=".4" />
      </svg>
    </Link>
  );
}
