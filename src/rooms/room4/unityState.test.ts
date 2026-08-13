import { describe, expect, it } from 'vitest';
import { addGroup, isComplete, strength, TOTAL_GROUPS } from './unityState';

describe('unityState', () => {
  it('bắt đầu ở 0%', () => {
    expect(strength([])).toBe(0);
    expect(isComplete([])).toBe(false);
  });

  it('mỗi nhóm đóng góp 12,5%', () => {
    expect(strength(['cong-nhan'])).toBe(12.5);
    expect(strength(['cong-nhan', 'nong-dan'])).toBe(25);
  });

  it('thêm trùng nhóm không tăng điểm hai lần', () => {
    const once = addGroup([], 'cong-nhan');
    const twice = addGroup(once, 'cong-nhan');
    expect(twice).toEqual(['cong-nhan']);
    expect(strength(twice)).toBe(12.5);
  });

  it('addGroup không sửa mảng gốc', () => {
    const before = ['cong-nhan'];
    addGroup(before, 'nong-dan');
    expect(before).toEqual(['cong-nhan']);
  });

  it('đủ 8 nhóm ra đúng 100% và báo hoàn thành', () => {
    const all = Array.from({ length: TOTAL_GROUPS }, (_, i) => `nhom-${i}`);
    expect(strength(all)).toBe(100);
    expect(isComplete(all)).toBe(true);
  });
});
