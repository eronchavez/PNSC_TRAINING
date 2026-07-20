import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [sortMethod, setSortMethod] = useState(
    () => localStorage.getItem('carparkSortMethod') || 'alphabetical'
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem('appTheme') || 'system'
  );

  function updateSortMethod(method) {
    setSortMethod(method);
    localStorage.setItem('carparkSortMethod', method);
  }

  function updateTheme(newTheme) {
    setTheme(newTheme);
    localStorage.setItem('appTheme', newTheme);
  }

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      root.classList.remove('dark', 'light');
      
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(isDark ? 'dark' : 'light');
      } else {
        root.classList.add(theme);
      }
    };
    applyTheme();

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener('change', applyTheme);
      return () => media.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  return (
    <div>
      <section className="settings-section">
        <h2>Carpark Sorting</h2>
        <label className="settings-option">
          <input
            type="radio"
            name="sort"
            checked={sortMethod === 'alphabetical'}
            onChange={() => updateSortMethod('alphabetical')}
            className="settings-input"
          />
          Alphabetical
        </label>
        <label className="settings-option">
          <input
            type="radio"
            name="sort"
            checked={sortMethod === 'distance'}
            onChange={() => updateSortMethod('distance')}
            className="settings-input"
          />
          Distance
        </label>
      </section>

      <hr className="settings-divider" />

      <section>
        <h2>Theme</h2>
        <label className="settings-option">
          <input
            type="radio"
            name="theme"
            checked={theme === 'dark'}
            onChange={() => updateTheme('dark')}
            className="settings-input"
          />
          Dark
        </label>
        <label className="settings-option">
          <input
            type="radio"
            name="theme"
            checked={theme === 'light'}
            onChange={() => updateTheme('light')}
            className="settings-input"
          />
          Light
        </label>
        <label className="settings-option">
          <input
            type="radio"
            name="theme"
            checked={theme === 'system'}
            onChange={() => updateTheme('system')}
            className="settings-input"
          />
          System
        </label>
      </section>
    </div>
  );
}
