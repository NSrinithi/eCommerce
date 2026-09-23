export function LoadingScreen({ message = 'Loading your workspace…' }) {
  return <div className="loading-screen" role="status">
    <span className="spinner" />
    <p>
      {message}
    </p>
  </div>;
}
