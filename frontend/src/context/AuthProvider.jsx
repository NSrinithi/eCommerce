import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext.js';
import { authApi } from '../services/authApi.js';
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [connectionError, setConnectionError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    authApi.me(controller.signal).then(data => {
      if (!controller.signal.aborted) {
        setUser(data.user);
        setStatus('ready');
      }
    }).catch(error => {
      if (controller.signal.aborted) return;
      if (error.status === 401) {
        setUser(null);
        setStatus('ready');
      }
      else {
        setConnectionError(error.message);
        setStatus('error');
      }
    });
    return () => controller.abort();
  }, [retry]);
  useEffect(() => {
    const expired = () => {
      setUser(null);
      setStatus('ready');
    };
    window.addEventListener('auth:expired', expired);
    return () => window.removeEventListener('auth:expired', expired);
  }, []);
  const refresh = useCallback(() => {
    setStatus('loading');
    setConnectionError('');
    setRetry(v => v + 1);
  }, []);
  async function login(input) {
    const data = await authApi.login(input);
    setUser(data.user);
    setStatus('ready');
    return data.user;
  }
  async function logout() {
    // A failed server logout is shown to the user; do not pretend the session was revoked.
    await authApi.logout();
    setUser(null);
    setStatus('ready');
  }
  async function updateProfile(input) {
    const data = await authApi.updateProfile(input);
    setUser(data.user);
  }
  return <AuthContext.Provider value={{
    user,
    status,
    connectionError,
    login,
    logout,
    updateProfile,
    refresh
  }}>
    {children}
  </AuthContext.Provider>;
}
