import { useId } from 'react';
export function Field({ label, hint, error, multiline = false, className = '', ...props }) {
  const id = useId();
  const Input = multiline ? 'textarea' : 'input';
  return <div className={`field ${className}`}>
    <label htmlFor={id}>
      {label}
    </label>
    <Input
      id={id}
      {...props}
      aria-invalid={!!error}
      aria-describedby={error || hint ? `${id}-note` : undefined} />
    {(error || hint) && <small id={`${id}-note`} className={error ? 'field-error' : 'muted'}>
      {error || hint}
    </small>}
  </div>;
}
