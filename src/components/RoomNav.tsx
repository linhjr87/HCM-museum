import { Link } from 'react-router-dom';
import { rooms } from '../content/hall';

export default function RoomNav({ current }: { current: string }) {
  const at = rooms.findIndex((room) => room.number === current);
  const prev = at > 0 ? rooms[at - 1] : null;
  const next = at < rooms.length - 1 ? rooms[at + 1] : null;

  return (
    <nav className="room-nav" aria-label="Điều hướng giữa các phòng">
      {prev ? (
        <Link to={prev.path}>← {prev.number} {prev.title}</Link>
      ) : (
        <Link to="/">← Về sảnh</Link>
      )}
      {next ? (
        <Link to={next.path}>{next.number} {next.title} →</Link>
      ) : (
        <Link to="/">Về sảnh →</Link>
      )}
    </nav>
  );
}
