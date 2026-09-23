import { useTheme } from '../../hooks/useTheme.js';
import { Icon } from '../ui/Icon.jsx';
export function ThemeControl() {
  const { mode, changeMode } = useTheme();
  return <label className="theme-control">
    <Icon name="sun" size={18} />
    <span className="sr-only">Theme</span>
    <select
      aria-label="Theme"
      value={mode}
      className='outline-focus-none'
      onChange={e => changeMode(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  </label>;
}
