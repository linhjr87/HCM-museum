import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Props = { children: ReactNode };
type State = { failed: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main style={{ padding: 'var(--space)', maxWidth: 'var(--measure)' }}>
        <h1>Phòng này đang gặp sự cố</h1>
        <p style={{ color: 'var(--paper-dim)' }}>
          Các phòng còn lại vẫn tham quan bình thường.
        </p>
        <Link to="/">Quay lại sảnh</Link>
      </main>
    );
  }
}
