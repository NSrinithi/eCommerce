import { Component } from 'react';
export class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.error('UI render error:', error.name);
  }
  render() {
    if (this.state.failed) return <main className="error-page">
      <h1>This page could not load</h1>
      <p>Reload the page. Check the browser console during development.</p>
      <button className="button button--primary" onClick={() => window.location.reload()}>Reload page</button>
    </main>;
    return this.props.children;
  }
}
