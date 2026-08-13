import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Room4 from './Room4';

const firstGroupName = /Thêm Công nhân vào khối đại đoàn kết/i;
const secondGroupName = /Thêm Nông dân vào khối đại đoàn kết/i;

function renderRoom() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Room4 />
    </MemoryRouter>,
  );
}

describe('Room4 keyboard and screen-reader flow', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));
  });

  it('removes a selected native button and focuses the next group button', () => {
    renderRoom();
    const first = screen.getByRole('button', { name: firstGroupName });
    first.focus();

    fireEvent.click(first);

    expect(screen.queryByRole('button', { name: firstGroupName })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: secondGroupName })).toHaveFocus();
  });

  it('updates the persistent polite status with the selected group message', () => {
    renderRoom();
    const status = screen.getByRole('status', { name: 'Thông báo nhóm vừa tham gia' });

    fireEvent.click(screen.getByRole('button', { name: firstGroupName }));

    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent(
      'Giai cấp công nhân là lực lượng lãnh đạo cách mạng thông qua đội tiên phong của mình.',
    );
  });

  it('focuses the reset control after the eighth group joins', () => {
    renderRoom();

    for (let remaining = 8; remaining > 0; remaining -= 1) {
      fireEvent.click(screen.getAllByRole('button', { name: /Thêm .+ vào khối đại đoàn kết/i })[0]);
    }

    expect(screen.getByRole('button', { name: 'Làm lại' })).toHaveFocus();
  });

  it('reset clears the announcement and restores focus to the first group', () => {
    renderRoom();
    const status = screen.getByRole('status', { name: 'Thông báo nhóm vừa tham gia' });
    for (let remaining = 8; remaining > 0; remaining -= 1) {
      fireEvent.click(screen.getAllByRole('button', { name: /Thêm .+ vào khối đại đoàn kết/i })[0]);
    }

    fireEvent.click(screen.getByRole('button', { name: 'Làm lại' }));

    expect(status).toBeEmptyDOMElement();
    expect(screen.getByRole('button', { name: firstGroupName })).toHaveFocus();
    expect(screen.getAllByRole('button', { name: /Thêm .+ vào khối đại đoàn kết/i })).toHaveLength(8);
  });

  it('associates each group button with instructions for native activation and pointer dragging', () => {
    renderRoom();
    const first = screen.getByRole('button', { name: firstGroupName });
    const instructionsId = first.getAttribute('aria-describedby');

    expect(instructionsId).not.toBeNull();
    expect(document.getElementById(instructionsId!)).toHaveTextContent(
      'Nhấn Enter hoặc phím cách để thêm nhóm ngay vào khối đại đoàn kết. Dùng chuột hoặc thao tác chạm để kéo nhóm vào vòng tròn; không dùng phím mũi tên để kéo.',
    );
  });
});
