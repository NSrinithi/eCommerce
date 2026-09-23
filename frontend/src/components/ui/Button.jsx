export function Button({ variant = 'primary', busy = false, children, className = '', disabled, ...props }) {
  return <button
    type="button"
    {...props}
    disabled={disabled || busy}
    aria-busy={busy || undefined}
    className={`button button--${variant} ${className}`}>
    {busy && <span className="spinner spinner--small" aria-hidden="true" />}
    {children}
  </button>;
}
