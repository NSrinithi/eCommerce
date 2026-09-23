import { appConfig } from '../../config/app.js';
export function Brand({ compact = false }) {
  return <span className="brand">
    <span className="brand-symbol" aria-hidden="true">SE</span>
    {!compact && <span>
      {appConfig.name}
      <small>Online Store</small>
    </span>}
  </span>;
}
