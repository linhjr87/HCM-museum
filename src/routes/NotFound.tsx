import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main style={{ padding: 'var(--space)', maxWidth: 'var(--measure)' }}>
      <h1>Không tìm thấy phòng này</h1>
      <p style={{ color: 'var(--paper-dim)' }}>Bảo tàng chỉ có bốn phòng.</p>
      <Link className="not-found__back" to="/">Quay lại sảnh</Link>
    </main>
  );
}
