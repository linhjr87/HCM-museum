import {
  DndContext,
  PointerSensor,
  type DragEndEvent,
  type ScreenReaderInstructions,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import RoomShell from '../components/RoomShell';
import { completionQuote, groups } from '../content/room4';
import { useReducedMotion } from '../hooks/useReducedMotion';
import GroupCard from '../rooms/room4/GroupCard';
import StrengthBar from '../rooms/room4/StrengthBar';
import UnityCircle from '../rooms/room4/UnityCircle';
import { addKnownGroup, isComplete, strength } from '../rooms/room4/unityState';
import '../rooms/room4/room4.css';

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable:
    'Nhấn Enter hoặc phím cách để thêm nhóm ngay vào khối đại đoàn kết. Dùng chuột hoặc thao tác chạm để kéo nhóm vào vòng tròn; không dùng phím mũi tên để kéo.',
};

type FocusTarget = { kind: 'group'; id: string } | { kind: 'reset' };

export default function Room4() {
  const [joined, setJoined] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);
  const groupButtons = useRef(new Map<string, HTMLButtonElement>());
  const resetButton = useRef<HTMLButtonElement>(null);
  const focusTarget = useRef<FocusTarget | null>(null);
  const reduced = useReducedMotion();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 3000);
    return () => window.clearTimeout(timer);
  }, [flash]);

  useEffect(() => {
    const target = focusTarget.current;
    if (!target) return;
    const node = target.kind === 'reset'
      ? resetButton.current
      : groupButtons.current.get(target.id);
    node?.focus();
    focusTarget.current = null;
  }, [joined]);

  function setGroupButton(id: string, node: HTMLButtonElement | null) {
    if (node) groupButtons.current.set(id, node);
    else groupButtons.current.delete(id);
  }

  function requestFocusAfterJoin(id: string) {
    const selectedIndex = groups.findIndex((group) => group.id === id);
    const available = groups.filter((group) => group.id !== id && !joined.includes(group.id));
    const next = available.find((group) => groups.indexOf(group) > selectedIndex) ?? available[0];
    focusTarget.current = next ? { kind: 'group', id: next.id } : { kind: 'reset' };
  }

  function join(id: string) {
    if (joined.includes(id)) return;
    const group = groups.find((item) => item.id === id);
    if (!group) return;
    requestFocusAfterJoin(id);
    setFlash(group.message);
    setJoined((current) => addKnownGroup(current, id, groups.map((item) => item.id)));
  }

  function reset() {
    focusTarget.current = { kind: 'group', id: groups[0].id };
    setFlash(null);
    setJoined([]);
  }

  function onDragEnd(event: DragEndEvent) {
    if (event.over?.id === 'unity-circle') join(String(event.active.id));
  }

  const waiting = groups.filter((group) => !joined.includes(group.id));
  const flashContent = flash && (reduced
    ? <p className="r4__flash" aria-hidden="true">{flash}</p>
    : <motion.p className="r4__flash" aria-hidden="true" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>{flash}</motion.p>);
  const doneContent = isComplete(joined) && (reduced
    ? <div className="r4__done"><p className="r4__quote">{completionQuote}</p><button ref={resetButton} type="button" className="r4__reset" onClick={reset}>Làm lại</button></div>
    : <motion.div className="r4__done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}><p className="r4__quote">{completionQuote}</p><button ref={resetButton} type="button" className="r4__reset" onClick={reset}>Làm lại</button></motion.div>);

  return <RoomShell number="04" title="Đại đoàn kết" tagline="Đoàn kết là một chiến lược, không phải một khẩu hiệu.">
    <DndContext
      sensors={sensors}
      accessibility={{ screenReaderInstructions, restoreFocus: false }}
      onDragEnd={onDragEnd}
    >
      <div className="r4">
        <div className="r4__stage"><UnityCircle joined={joined} groups={groups} /><StrengthBar value={strength(joined)} reduced={reduced} /></div>
        <div className="r4__side">
          <p className="r4__hint">Kéo từng nhóm vào vòng tròn, hoặc bấm vào nhóm để thêm.</p>
          <div className="r4__deck">{waiting.map((group) => <GroupCard key={group.id} group={group} onPick={join} setButtonRef={(node) => setGroupButton(group.id, node)} />)}</div>
          <p
            className="r4__status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            aria-label="Thông báo nhóm vừa tham gia"
          >
            {flash ?? ''}
          </p>
          {reduced ? flashContent : <AnimatePresence>{flashContent}</AnimatePresence>}
          {doneContent}
        </div>
      </div>
    </DndContext>
  </RoomShell>;
}
