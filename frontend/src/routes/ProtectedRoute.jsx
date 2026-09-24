import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx';
import { Button } from '../components/ui/Button.jsx';
export function SessionGate({ children }) {
  const { status, connectionError, refresh } = useAuth();
  if (status === 'loading') return <LoadingScreen />;
  if (status === 'error') return <main className="error-page">
    <h1>Connect your backend</h1>
    <p>
      {connectionError}
    </p>
    <p className="muted">Start MongoDB and run the backend. Then try again.</p>
    <Button onClick={refresh}>Try again</Button>
  </main>;
  return children;
}
export function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();
  return <SessionGate>
    {user ? <Outlet /> : <Navigate
      to="/login"
      replace
      state={{ from: location.pathname }} />}
  </SessionGate>;
}
export function GuestRoute() {
  const { user } = useAuth();
  return <SessionGate>
    {user ? <Navigate to="/dashboard" replace /> : <Outlet />}
  </SessionGate>;
}

export function RequiredRole({ role, children }) {
  const { user } = useAuth();

  console.log("RequiredRole user:", user);
  console.log("RequiredRole required role:", role);
  console.log("RequiredRole actual role:", user?.role);

  if (!user) {
    console.log("NO USER → LOGIN");
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    console.log("ROLE MISMATCH → DASHBOARD");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("ROLE MATCH → ADMIN PAGE");
  return children;
}
