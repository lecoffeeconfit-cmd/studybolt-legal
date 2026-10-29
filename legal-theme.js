(() => {
  const themeKey = 'studybolt-legal-theme';
  const root = document.documentElement;
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const systemTheme = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  const readPreference = () => {
    try {
      return localStorage.getItem(themeKey);
    } catch {
      return null;
    }
  };

  const applyTheme = (theme, save = false) => {
    const selectedTheme = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = selectedTheme;

    themeButtons.forEach((button) => {
      const isDark = selectedTheme === 'dark';
      button.setAttribute('aria-pressed', String(isDark));
      button.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      button.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      const label = button.querySelector('.theme-toggle-label');
      if (label) label.textContent = isDark ? 'Light theme' : 'Dark theme';
    });

    if (themeColor) themeColor.content = selectedTheme === 'dark' ? '#111820' : '#f7f9fd';
    if (save) {
      try {
        localStorage.setItem(themeKey, selectedTheme);
      } catch {
        // The current tab still changes theme if persistent storage is unavailable.
      }
    }
  };

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });
  });

  window.addEventListener('storage', (event) => {
    if (event.key === themeKey) {
      const preference = event.newValue;
      applyTheme(preference === 'dark' ? 'dark' : 'light');
    }
  });

  if (systemTheme) {
    const syncSystemTheme = (event) => {
      if (!readPreference()) applyTheme(event.matches ? 'dark' : 'light');
    };
    if (typeof systemTheme.addEventListener === 'function') {
      systemTheme.addEventListener('change', syncSystemTheme);
    } else if (typeof systemTheme.addListener === 'function') {
      systemTheme.addListener(syncSystemTheme);
    }
  }

  const savedTheme = readPreference();
  const initialTheme = savedTheme === 'dark' || savedTheme === 'light'
    ? savedTheme
    : root.dataset.theme;
  applyTheme(initialTheme || 'light');
})();
