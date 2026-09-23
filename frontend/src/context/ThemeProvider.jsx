import { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext.js';
import { readPreference, savePreference } from '../utils/preferences.js';
const choices = ['light', 'dark', 'system'];
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = readPreference('theme', 'light');
    return choices.includes(saved) ? saved : 'light';
  });
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const theme = mode === 'system' ? (media.matches ? 'dark' : 'light') : mode;
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [mode]);
  function changeMode(next) {
    if (choices.includes(next)) {
      setMode(next);
      savePreference('theme', next);
    }
  }
  return <ThemeContext.Provider value={{ mode, changeMode }}>
    {children}
  </ThemeContext.Provider>;
}
