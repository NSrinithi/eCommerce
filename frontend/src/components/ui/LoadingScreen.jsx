export function LoadingScreen({ message = 'Loading...' }) {
  return <div className="loading-screen" role="status">
    <span className="spinner" />
    <p>
      {message}
    </p>
  </div>;
}
