import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';
import { pageTitles } from '../../config/navigation.js';
import { ThemeControl } from './ThemeControl.jsx';
import { Icon } from '../ui/Icon.jsx';
import { Alert } from '../ui/Alert.jsx';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { cartApi } from '../../services/cartApi.js';
export function Header({ onMenu }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function handleLogout() {
    setBusy(true);
    setError('');
    try {
      await logout();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  const { data: cart, reload: reloadCart } = useAsyncData(cartApi.get);

  const cartCount =
    cart?.items?.reduce(
      (total, item) => total + item.quantity,
      0
    ) || 0;

  useEffect(() => {
    function handleCartChange() {
      reloadCart();
    }

    window.addEventListener("cart-updated", handleCartChange);

    return () => {
      window.removeEventListener("cart-updated", handleCartChange);
    };
  }, [reloadCart]);

  return <div className="header-wrap">
    <header className="header">
      <div className="header-location">
        <button
          className="icon-button mobile-only"
          onClick={onMenu}
          aria-label="Open navigation">
          <Icon name="menu" />
        </button>
        <strong>
          {pageTitles[pathname] || 'Page'}
        </strong>
      </div>
      <div className="header-actions">
        <ThemeControl />
        <Link
          to="/cart"
          className="header-cart"
          aria-label={`Cart with ${cartCount} items`}
        >
          <span className="cart-icon-wrap">
            <i className="fa-solid fa-cart-shopping"></i>

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </span>
        </Link>
        <Link to="/wishlist">
          <i className="fa-regular fa-heart" style={{color: "rgb(0, 0, 0)"}}></i>
        </Link>
        <Link to="/profile">
          <span className="avatar cursor-pointer" title={user.name}>
            {Array.from(user.name)[0]?.toUpperCase()}
          </span>
        </Link>

        <button
          className="icon-button"
          onClick={handleLogout}
          disabled={busy}
          aria-label="Sign out"
          title="Sign out">
          <Icon name="logout" />
        </button>
      </div>
    </header>
    {error && <div className="header-alert">
      <Alert>
        {error}
      </Alert>
    </div>}
  </div>;
}
