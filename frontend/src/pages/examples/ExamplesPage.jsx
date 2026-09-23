import { useState } from 'react';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { exampleApi } from '../../services/exampleApi.js';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field } from '../../components/ui/Field.jsx';
import { Alert } from '../../components/ui/Alert.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
const empty = { title: '', description: '' };
export function ExamplesPage() {
  const { data, loading, error: loadError, reload } = useAsyncData(exampleApi.list);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [message, setMessage] = useState('');
  function reset() {
    setForm(empty);
    setEditing(null);
    setError('');
  }
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      if (editing) await exampleApi.update(editing, form); else await exampleApi.create(form);
      setMessage(editing ? 'Record updated.' : 'Record created.');
      reset();
      reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    setBusy(true);
    setDeleteError('');
    setMessage('');
    try {
      await exampleApi.remove(deleting.id);
      if (editing === deleting.id) reset();
      setDeleting(null);
      setMessage('Record deleted.');
      reload();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setBusy(false);
    }
  }
  function edit(item) {
    setEditing(item.id);
    setForm({ title: item.title, description: item.description });
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  return <>
    <PageHeader
      title="Sample API"
      description="One small CRUD example. Replace it with your own feature."
      action={<Button
        variant="secondary"
        onClick={reload}
        busy={loading}
        disabled={busy}><Icon name="refresh" size={17} />Reload</Button>} />
    <div className="sample-note">
      <Icon name="layers" />
      <span>These records belong only to your account. This module is optional.</span>
    </div>
    <section className="panel">
      <h2>
        {editing ? 'Edit record' : 'Create a sample record'}
      </h2>
      <Alert>
        {error}
      </Alert>
      <Alert tone="success">
        {message}
      </Alert>
      <form className="example-form" onSubmit={submit}>
        <Field
          label="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
          maxLength={100}
          placeholder="My first record"
          disabled={busy} />
        <Field
          label="Description (optional)"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          maxLength={500}
          placeholder="A short note"
          disabled={busy} />
        <div className="button-row">
          <Button type="submit" busy={busy}>
            <Icon name={editing ? 'check' : 'plus'} size={17} />
            {editing ? 'Save record' : 'Add record'}
          </Button>
          {editing && <Button
            variant="ghost"
            disabled={busy}
            onClick={reset}>Cancel edit</Button>}
        </div>
      </form>
    </section>
    <section className="panel records-panel">
      <div className="section-heading">
        <h2>Your records</h2>
        <span className="muted">Latest 50 records</span>
      </div>
      <Alert>
        {loadError}
      </Alert>
      {loading ? <div className="empty-state" role="status">
        <span className="spinner" />
        <p>Loading records…</p>
      </div> : !data?.items.length ? <div className="empty-state">
        <Icon name="layers" size={32} />
        <h3>No records yet</h3>
        <p className="muted">Create one above to test React → API → MongoDB.</p>
      </div> : <div className="table-scroll">
        <table className="records-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th className="actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map(item => <tr key={item.id}>
              <td>
                <strong>
                  {item.title}
                </strong>
              </td>
              <td className="muted">
                {item.description || '—'}
              </td>
              <td className="actions-cell">
                <button
                  className="icon-button"
                  aria-label={`Edit ${item.title}`}
                  disabled={busy}
                  onClick={() => edit(item)}>
                  <Icon name="edit" size={18} />
                </button>
                <button
                  className="icon-button danger-text"
                  aria-label={`Delete ${item.title}`}
                  disabled={busy}
                  onClick={() => {
                    setDeleting(item);
                    setDeleteError('');
                  }}>
                  <Icon name="trash" size={18} />
                </button>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>}
    </section>
    <ConfirmDialog
      open={!!deleting}
      title="Delete this record?"
      onCancel={() => setDeleting(null)}
      onConfirm={remove}
      busy={busy}
      error={deleteError}>“{deleting?.title}” will be removed from MongoDB. This cannot be undone.</ConfirmDialog>
  </>;
}
