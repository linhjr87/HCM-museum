import { describe, expect, it } from 'vitest';
import { arcPath, polar } from './polar';

describe('polar', () => {
  it('0 độ nằm ngay phía trên tâm', () => {
    const p = polar(100, 100, 50, 0);
    expect(p.x).toBeCloseTo(100, 5);
    expect(p.y).toBeCloseTo(50, 5);
  });

  it('90 độ nằm bên phải tâm', () => {
    const p = polar(100, 100, 50, 90);
    expect(p.x).toBeCloseTo(150, 5);
    expect(p.y).toBeCloseTo(100, 5);
  });

  it('180 độ nằm phía dưới tâm', () => {
    const p = polar(100, 100, 50, 180);
    expect(p.x).toBeCloseTo(100, 5);
    expect(p.y).toBeCloseTo(150, 5);
  });
});

describe('arcPath', () => {
  it('cung 120 độ dùng cờ large-arc bằng 0', () => {
    expect(arcPath(100, 100, 50, 0, 120)).toMatch(/A 50 50 0 0 1/);
  });

  it('cung 240 độ dùng cờ large-arc bằng 1', () => {
    expect(arcPath(100, 100, 50, 0, 240)).toMatch(/A 50 50 0 1 1/);
  });
});
