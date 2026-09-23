import { Link, Outlet } from 'react-router';
import { Brand } from '../components/layout/Brand.jsx';
import { ThemeControl } from '../components/layout/ThemeControl.jsx';
export function AuthLayout() {
  return <div className="auth-layout">
    <header className="auth-header">
      <Link to="/login" aria-label="MERN Base home">
        <Brand />
      </Link>
      <ThemeControl />
    </header>
    <main className="auth-main">
      <Outlet />
    </main>
    <footer className="auth-footer">Your application. Your foundation.</footer>
  </div>;
}
