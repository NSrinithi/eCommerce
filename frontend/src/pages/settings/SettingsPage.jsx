import { useTheme } from '../../hooks/useTheme.js';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
export function SettingsPage() {
  const { mode, changeMode } = useTheme();
  return <>
    <PageHeader title="Preferences" description="Make this workspace comfortable for you." />
    <section className="panel">
      <h2>Appearance</h2>
      <p className="muted">Saved in this browser. No account data is stored here.</p>
      <div
        className="theme-options"
        role="group"
        aria-label="Choose appearance">
        {['light', 'dark', 'system'].map(value => <button
          key={value}
          className={`theme-option ${mode === value ? 'selected' : ''}`}
          aria-pressed={mode === value}
          onClick={() => changeMode(value)}>
          <span className={`theme-preview theme-preview--${value}`}>
            <i />
            <i />
            <i />
          </span>
          <span>
            {value[0].toUpperCase() + value.slice(1)}
            {mode === value && <Icon name="check" size={17} />}
          </span>
        </button>)}
      </div>
      <p className="muted settings-note">Change brand colors in <code>frontend/src/styles/theme.css</code>. Rename the application in <code>frontend/.env</code>.</p>
    </section>
  </>;
}
