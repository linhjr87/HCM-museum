import { useCallback, useMemo, useState } from 'react';

export type StepIndex = {
  index: number;
  visited: number[];
  allVisited: boolean;
  go: (next: number) => void;
  next: () => void;
  prev: () => void;
};

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max);
const remember = (list: number[], target: number) =>
  list.includes(target) ? list : [...list, target].sort((a, b) => a - b);

export function useStepIndex(total: number): StepIndex {
  const last = Math.max(total - 1, 0);
  const [index, setIndex] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);

  const go = useCallback(
    (next: number) => {
      const target = clamp(next, last);
      setIndex(target);
      setVisited((list) => remember(list, target));
    },
    [last],
  );

  const shift = useCallback(
    (delta: number) => {
      setIndex((current) => {
        const target = clamp(current + delta, last);
        setVisited((list) => remember(list, target));
        return target;
      });
    },
    [last],
  );

  const next = useCallback(() => shift(1), [shift]);
  const prev = useCallback(() => shift(-1), [shift]);

  const allVisited = useMemo(() => visited.length >= total, [visited, total]);

  return { index, visited, allVisited, go, next, prev };
}
