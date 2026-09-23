import { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { Header } from '../components/layout/Header.jsx';
import { readPreference, savePreference } from '../utils/preferences.js';
export function AppLayout() {
  const [collapsed, setCollapsed] = useState(() => readPreference('sidebar', 'expanded') === 'collapsed');
  const [mobileOpen, setMobileOpen] = useState(false);
  function toggle() {
    setCollapsed(value => {
      savePreference('sidebar', value ? 'expanded' : 'collapsed');
      return !value;
    });
  }
  return <div className={`app-shell ${collapsed ? 'app-shell--compact' : ''}`}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Sidebar
      collapsed={collapsed}
      onToggle={toggle}
      mobileOpen={mobileOpen}
      onClose={() => setMobileOpen(false)} />
    <div className="workspace">
      <Header onMenu={() => setMobileOpen(true)} />
      <main id="main-content" className="page-content">
        <Outlet />
      </main>
      <footer className="workspace-footer">ShopEase</footer>
    </div>
  </div>;
}
