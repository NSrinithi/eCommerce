import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { authApi } from '../../services/authApi.js';
import { Field } from '../../components/ui/Field.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Alert } from '../../components/ui/Alert.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmation: ''
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError('');
  }
  async function submit(event) {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmation) {
      setError('Passwords do not match.');
      return;
    }
    if (new TextEncoder().encode(form.password).length > 72) {
      setError('Password must be at most 72 UTF-8 bytes.');
      return;
    }
    setBusy(true);
    try {
      await authApi.register({
        name: form.name,
        email: form.email,
        password: form.password
      });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return <section className="auth-card">
    <span className="auth-icon">
      <Icon name="user" size={24} />
    </span>
    <h1>Create your account</h1>
    <p className="muted auth-description">Start with a workspace of your own.</p>
    <Alert>
      {error}
    </Alert>
    <form className="form-stack" onSubmit={submit}>
      <Field
        label="Full name"
        name="name"
        autoComplete="name"
        required
        minLength={2}
        maxLength={80}
        value={form.name}
        onChange={change}
        disabled={busy} />
      <Field
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={form.email}
        onChange={change}
        disabled={busy} />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={12}
        value={form.password}
        onChange={change}
        hint="Use at least 12 characters. A passphrase works well."
        disabled={busy} />
      <Field
        label="Confirm password"
        name="confirmation"
        type="password"
        autoComplete="new-password"
        required
        value={form.confirmation}
        onChange={change}
        disabled={busy} />
      <Button
        type="submit"
        busy={busy}
        className="full-width">Create account <Icon name="arrow" size={18} /></Button>
    </form>
    <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
  </section>;
}
