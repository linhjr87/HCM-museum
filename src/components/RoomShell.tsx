import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import RoomNav from './RoomNav';
import './RoomShell.css';

type RoomShellProps = {
  number: '01' | '02' | '03' | '04';
  title: string;
  tagline: string;
  children: ReactNode;
};

export default function RoomShell({ number, title, tagline, children }: RoomShellProps) {
  return (
    <div className="room">
      <header className="room__head">
        <Link className="room__back" to="/">← Sảnh</Link>
        <p className="room__number">{number}</p>
        <h1 className="room__title">{title}</h1>
        <p className="room__tagline">{tagline}</p>
      </header>
      <div className="room__body">{children}</div>
      <RoomNav current={number} />
    </div>
  );
}
