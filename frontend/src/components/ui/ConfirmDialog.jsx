import { useEffect, useRef, useId } from 'react';
import { Button } from './Button.jsx';
export function ConfirmDialog({ open, title, children, onCancel, onConfirm, busy, error }) {
  const ref = useRef(null);
  const id = useId();
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);
  return <dialog
    ref={ref}
    className="dialog"
    aria-labelledby={id}
    onCancel={event => {
      event.preventDefault();
      if (!busy) onCancel();
    }}>
    <h2 id={id}>
      {title}
    </h2>
    <p className="muted">
      {children}
    </p>
    {error && <p role="alert" className="field-error">
      {error}
    </p>}
    <div className="button-row dialog-actions">
      <Button
        variant="secondary"
        onClick={onCancel}
        disabled={busy}>Cancel</Button>
      <Button
        variant="danger"
        onClick={onConfirm}
        busy={busy}>Delete record</Button>
    </div>
  </dialog>;
}
