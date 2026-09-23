export function PageHeader({ title, description, action }) {
  return <div className="page-heading">
    <div>
      <h1>
        {title}
      </h1>
      {description && <p className="muted">
        {description}
      </p>}
    </div>
    {action}
  </div>;
}
