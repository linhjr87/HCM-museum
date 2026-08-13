import { DndContext, PointerSensor, type DragEndEvent, useSensor, useSensors } from '@dnd-kit/core';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import RoomShell from '../components/RoomShell';
import { completionQuote, groups } from '../content/room4';
import { useReducedMotion } from '../hooks/useReducedMotion';
import GroupCard from '../rooms/room4/GroupCard';
import StrengthBar from '../rooms/room4/StrengthBar';
import UnityCircle from '../rooms/room4/UnityCircle';
import { addKnownGroup, isComplete, strength } from '../rooms/room4/unityState';
import '../rooms/room4/room4.css';

export default function Room4() {
  const [joined, setJoined] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 3000);
    return () => window.clearTimeout(timer);
  }, [flash]);

  function join(id: string) {
    if (joined.includes(id)) return;
    const group = groups.find((item) => item.id === id);
    if (!group) return;
    setFlash(group.message);
    setJoined((current) => addKnownGroup(current, id, groups.map((item) => item.id)));
  }

  function onDragEnd(event: DragEndEvent) {
    if (event.over?.id === 'unity-circle') join(String(event.active.id));
  }

  const waiting = groups.filter((group) => !joined.includes(group.id));
  const flashContent = flash && (reduced
    ? <p className="r4__flash">{flash}</p>
    : <motion.p className="r4__flash" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>{flash}</motion.p>);
  const doneContent = isComplete(joined) && (reduced
    ? <div className="r4__done"><p className="r4__quote">{completionQuote}</p><button type="button" className="r4__reset" onClick={() => setJoined([])}>Làm lại</button></div>
    : <motion.div className="r4__done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}><p className="r4__quote">{completionQuote}</p><button type="button" className="r4__reset" onClick={() => setJoined([])}>Làm lại</button></motion.div>);

  return <RoomShell number="04" title="Đại đoàn kết" tagline="Đoàn kết là một chiến lược, không phải một khẩu hiệu.">
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="r4">
        <div className="r4__stage"><UnityCircle joined={joined} groups={groups} /><StrengthBar value={strength(joined)} reduced={reduced} /></div>
        <div className="r4__side">
          <p className="r4__hint">Kéo từng nhóm vào vòng tròn, hoặc bấm vào nhóm để thêm.</p>
          <div className="r4__deck">{waiting.map((group) => <GroupCard key={group.id} group={group} onPick={join} />)}</div>
          {reduced ? flashContent : <AnimatePresence>{flashContent}</AnimatePresence>}
          {doneContent}
        </div>
      </div>
    </DndContext>
  </RoomShell>;
}
