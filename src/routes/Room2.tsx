import { motion } from 'framer-motion';
import RoomShell from '../components/RoomShell';
import { closingQuote, stops } from '../content/room2';
import { useStepIndex } from '../hooks/useStepIndex';
import StoryPanel from '../rooms/room2/StoryPanel';
import WorldMap from '../rooms/room2/WorldMap';
import '../rooms/room2/room2.css';

export default function Room2() {
  const step = useStepIndex(stops.length);

  return (
    <RoomShell
      number="02"
      title="Độc lập – Tự do"
      tagline="Quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc."
    >
      <div className="r2">
        <WorldMap
          stops={stops}
          index={step.index}
          visited={step.visited}
          onSelect={step.go}
          onStep={(delta) => (delta > 0 ? step.next() : step.prev())}
        />
        <StoryPanel stop={stops[step.index]} />
      </div>

      {step.allVisited && (
        <motion.p
          className="r2__closing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {closingQuote}
        </motion.p>
      )}
    </RoomShell>
  );
}
