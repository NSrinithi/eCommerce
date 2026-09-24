import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';
import { Field } from '../../components/ui/Field.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Alert } from '../../components/ui/Alert.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
export function LoginPage() {
  const { login, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError('');
  }
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form);
      const from = location.state?.from;
      if (typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')) {
        navigate(from, { replace: true });
        return;
      }

      if (user?.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/products', { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return <section className="auth-card">
    <span className="auth-icon">
      <Icon name="lock" size={24} />
    </span>
    <h1>Welcome back</h1>
    <p className="muted auth-description">Sign in to your workspace.</p>
    {location.state?.registered && <Alert tone="success">Account created. Sign in with your new credentials.</Alert>}
    <Alert>
      {error}
    </Alert>
    <form className="form-stack" onSubmit={submit}>
      <Field
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={form.email}
        onChange={change}
        placeholder="you@example.com"
        disabled={busy} />
      <div>
        <Field
          label="Password"
          name="password"
          type={show ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={form.password}
          onChange={change}
          disabled={busy} />
        <button
          type="button"
          className="text-button show-password"
          onClick={() => setShow(!show)}>
          {show ? 'Hide password' : 'Show password'}
        </button>
      </div>
      <Button
        type="submit"
        busy={busy}
        className="full-width">Sign in <Icon name="arrow" size={18} /></Button>
    </form>
    <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
    <div className="auth-note">
      <Icon name="lock" size={15} />
      <span>Your account stays private to this application.</span>
    </div>
  </section>;
}
