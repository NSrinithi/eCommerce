import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router';
import { getNavigation } from '../../config/navigation.js';
import { useAuth } from '../../hooks/useAuth.js';
import { Brand } from './Brand.jsx';
import { Icon } from '../ui/Icon.jsx';

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onClose,
}) {
  const dialog = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (mobileOpen) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [mobileOpen]);

  const navigation = getNavigation(user?.role);

  function links(compact = false) {
    return (
      <nav aria-label="Main navigation" className="sidebar-nav">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            title={compact ? item.label : undefined}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'is-active' : ''}`
            }
          >
            <Icon name={item.icon} />

            <span className={compact ? 'sr-only' : ''}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    );
  }

  return (
    <>
      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
        <div className="sidebar-brand">
          <Brand compact={collapsed} />
        </div>

        {links(collapsed)}

        <div className="sidebar-bottom">
          <button
            className="collapse-button"
            onClick={onToggle}
            aria-label={
              collapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
            aria-expanded={!collapsed}
          >
            <Icon
              name="chevron"
              className={!collapsed ? 'rotate' : ''}
            />

            {!collapsed && <span>Collapse sidebar</span>}
          </button>
        </div>
      </aside>

      <dialog
        ref={dialog}
        className="mobile-drawer"
        aria-label="Navigation"
        onCancel={onClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="mobile-drawer-content">
          <div className="drawer-heading">
            <Brand />

            <button
              className="icon-button"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <Icon name="close" />
            </button>
          </div>

          {links()}
        </div>
      </dialog>
    </>
  );
}