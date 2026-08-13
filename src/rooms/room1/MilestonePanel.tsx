import { AnimatePresence, motion } from 'framer-motion';
import type { Milestone } from '../../content/types';

export default function MilestonePanel({ item }: { item: Milestone }) {
  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={item.year}
        className="tl-panel"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <p className="tl-panel__year">{item.year}</p>
        <p className="tl-panel__place">{item.place}</p>
        <p className="tl-panel__event">{item.event}</p>
        <p className="tl-panel__meaning">{item.meaning}</p>
      </motion.article>
    </AnimatePresence>
  );
}
