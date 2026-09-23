import { Link } from 'react-router';
export function NotFoundPage() {
  return <main className="error-page">
    <span className="not-found-number">404</span>
    <h1>Page not found</h1>
    <p className="muted">This address is not part of the application.</p>
    <Link to="/dashboard" className="button button--primary">Back to workspace</Link>
  </main>;
}
