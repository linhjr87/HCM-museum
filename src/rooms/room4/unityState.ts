export const TOTAL_GROUPS = 8;

export function addGroup(joined: string[], id: string): string[] {
  return joined.includes(id) ? joined : [...joined, id];
}

export function strength(joined: string[]): number {
  return (joined.length / TOTAL_GROUPS) * 100;
}

export function isComplete(joined: string[]): boolean {
  return joined.length >= TOTAL_GROUPS;
}
