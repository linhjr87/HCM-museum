import RoomShell from '../components/RoomShell';
import { milestones } from '../content/room1';
import { useStepIndex } from '../hooks/useStepIndex';
import MilestonePanel from '../rooms/room1/MilestonePanel';
import Timeline from '../rooms/room1/Timeline';
import '../rooms/room1/room1.css';

export default function Room1() {
  const step = useStepIndex(milestones.length);

  return (
    <RoomShell
      number="01"
      title="Hành trình hình thành tư tưởng"
      tagline="Từ làng Sen đến Pác Bó, một con đường được tìm thấy."
    >
      <Timeline
        items={milestones}
        index={step.index}
        onSelect={step.go}
        onStep={(delta) => (delta > 0 ? step.next() : step.prev())}
      />
      <MilestonePanel item={milestones[step.index]} />
    </RoomShell>
  );
}
