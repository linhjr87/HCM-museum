import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useStepIndex } from './useStepIndex';

describe('useStepIndex', () => {
  it('bắt đầu ở bước 0 và đã xem bước 0', () => {
    const { result } = renderHook(() => useStepIndex(6));
    expect(result.current.index).toBe(0);
    expect(result.current.visited).toEqual([0]);
    expect(result.current.allVisited).toBe(false);
  });

  it('chặn biên ở bước đầu, không quay vòng', () => {
    const { result } = renderHook(() => useStepIndex(6));
    act(() => result.current.prev());
    expect(result.current.index).toBe(0);
  });

  it('chặn biên ở bước cuối, không quay vòng', () => {
    const { result } = renderHook(() => useStepIndex(3));
    act(() => result.current.go(2));
    act(() => result.current.next());
    expect(result.current.index).toBe(2);
  });

  it('go() kẹp giá trị ngoài khoảng về trong khoảng', () => {
    const { result } = renderHook(() => useStepIndex(3));
    act(() => result.current.go(99));
    expect(result.current.index).toBe(2);
    act(() => result.current.go(-5));
    expect(result.current.index).toBe(0);
  });

  it('visited cộng dồn, không trùng, và tăng dần', () => {
    const { result } = renderHook(() => useStepIndex(4));
    act(() => result.current.go(2));
    act(() => result.current.go(1));
    act(() => result.current.go(2));
    expect(result.current.visited).toEqual([0, 1, 2]);
  });

  it('allVisited bật khi đã xem đủ mọi bước', () => {
    const { result } = renderHook(() => useStepIndex(3));
    act(() => result.current.go(1));
    act(() => result.current.go(2));
    expect(result.current.allVisited).toBe(true);
  });

  it('go(NaN) clamps đến 0 và không thêm NaN vào visited', () => {
    const { result } = renderHook(() => useStepIndex(5));
    act(() => result.current.go(2));
    expect(result.current.index).toBe(2);
    expect(result.current.visited).toEqual([0, 2]);
    act(() => result.current.go(NaN));
    expect(result.current.index).toBe(0);
    expect(result.current.visited).toEqual([0, 2]);
    expect(result.current.visited.every((v) => Number.isInteger(v))).toBe(true);
  });

  it('go(1.6) làm tròn thành index 2 và visited chỉ chứa số nguyên', () => {
    const { result } = renderHook(() => useStepIndex(5));
    act(() => result.current.go(1.6));
    expect(result.current.index).toBe(2);
    expect(result.current.visited).toEqual([0, 2]);
    expect(result.current.visited.every((v) => Number.isInteger(v))).toBe(true);
  });

  it('useStepIndex(1) có allVisited === true at mount vì đã xem đủ bước', () => {
    const { result } = renderHook(() => useStepIndex(1));
    expect(result.current.allVisited).toBe(true);
  });

  it('useStepIndex(0) có allVisited === false', () => {
    const { result } = renderHook(() => useStepIndex(0));
    expect(result.current.allVisited).toBe(false);
  });
});
