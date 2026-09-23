import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { Field } from '../../components/ui/Field.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Alert } from '../../components/ui/Alert.jsx';
export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user.name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  async function submit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setBusy(true);
    try {
      await updateProfile({ name });
      setMessage('Profile saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return <>
    <PageHeader title="My profile" description="Your account details, stored in MongoDB." />
    <section className="panel form-panel">
      <h2>Personal information</h2>
      <Alert>
        {error}
      </Alert>
      <Alert tone="success">
        {message}
      </Alert>
      <form className="form-stack" onSubmit={submit}>
        <Field
          label="Full name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          minLength={2}
          maxLength={80}
          disabled={busy} />
        <Field
          label="Email address"
          value={user.email}
          type="email"
          readOnly
          hint="Email changes are not included in this base setup." />
        <div>
          <Button
            type="submit"
            busy={busy}
            disabled={name.trim() === user.name}>Save changes</Button>
        </div>
      </form>
    </section>
  </>;
}
