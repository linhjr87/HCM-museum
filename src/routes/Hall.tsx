import DoorCard from '../components/DoorCard';
import { hallIntro, rooms } from '../content/hall';
import './Hall.css';

export default function Hall() {
  return (
    <main className="hall">
      <section className="hall__intro">
        <h1 className="hall__title">{hallIntro.title}</h1>
        <p className="hall__subtitle">{hallIntro.subtitle}</p>
        <p className="hall__lead">{hallIntro.lead}</p>
        <a className="hall__scroll" href="#cac-phong">Bắt đầu tham quan ↓</a>
      </section>

      <section className="hall__rooms" id="cac-phong">
        <h2 className="hall__rooms-title">Bốn phòng trưng bày</h2>
        <div className="hall__grid">
          {rooms.map((room) => (
            <DoorCard key={room.number} room={room} />
          ))}
        </div>
      </section>
    </main>
  );
}
