export const TOTAL_GROUPS = 8;

export function addGroup(joined: string[], id: string): string[] {
  return joined.includes(id) ? joined : [...joined, id];
}

export function addKnownGroup(joined: string[], id: string, knownIds: string[]): string[] {
  return knownIds.includes(id) ? addGroup(joined, id) : joined;
}

export function strength(joined: string[]): number {
  return Math.min((joined.length / TOTAL_GROUPS) * 100, 100);
}

export function isComplete(joined: string[]): boolean {
  return joined.length >= TOTAL_GROUPS;
}
