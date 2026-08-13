import { useState } from 'react';
import RoomShell from '../components/RoomShell';
import { cycle, cycleNote, facets } from '../content/room3';
import CycleRing from '../rooms/room3/CycleRing';
import PeopleDiagram from '../rooms/room3/PeopleDiagram';
import '../rooms/room3/room3.css';

export default function Room3() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = facets.find((facet) => facet.id === activeId) ?? null;

  return (
    <RoomShell
      number="03"
      title="Dân là gốc"
      tagline="Nhà nước của nhân dân, do nhân dân, vì nhân dân."
    >
      <div className="r3">
        <div className="r3__diagram">
          <PeopleDiagram
            facets={facets}
            activeId={activeId}
            onToggle={(id) => setActiveId((current) => (current === id ? null : id))}
          />
        </div>

        <div className="r3__side">
          {active ? (
            <article className="r3__detail">
              <h2>{active.title}</h2>
              <p className="r3__short">{active.short}</p>
              <p>{active.detail}</p>
            </article>
          ) : (
            <p className="r3__hint">Bấm vào một trong ba cung để đọc nội dung.</p>
          )}

          <CycleRing nodes={cycle} />
          <p className="r3__note">{cycleNote}</p>
        </div>
      </div>
    </RoomShell>
  );
}
