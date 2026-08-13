import { AnimatePresence, motion } from 'framer-motion';
import type { MapStop } from '../../content/types';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function StoryPanel({ stop }: { stop: MapStop }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <article className="story">
        <h2 className="story__place">{stop.label}</h2>
        <p className="story__event">{stop.event}</p>
        <p className="story__link">{stop.link}</p>
      </article>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={stop.id}
        className="story"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <h2 className="story__place">{stop.label}</h2>
        <p className="story__event">{stop.event}</p>
        <p className="story__link">{stop.link}</p>
      </motion.article>
    </AnimatePresence>
  );
}
