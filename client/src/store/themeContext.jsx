import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const defaultColors = {
  light: {
    primary: '#00464b',
    secondary: '#4a6363',
  },
  dark: {
    primary: '#85d3db',
    secondary: '#b1cccb',
  },
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reservo-theme');
      if (saved && ['light', 'dark', 'custom'].includes(saved)) return saved;
      return 'light';
    }
    return 'light';
  });

  const [customColors, setCustomColorsState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reservo-custom-colors');
      if (saved) return JSON.parse(saved);
    }
    return { primary: '#00464b', secondary: '#4a6363' };
  });

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('reservo-theme', theme);

    if (theme === 'light') {
      root.classList.remove('dark', 'custom');
      root.style.removeProperty('--primary');
      root.style.removeProperty('--secondary');
    } else if (theme === 'dark') {
      root.classList.remove('custom');
      root.classList.add('dark');
      root.style.removeProperty('--primary');
      root.style.removeProperty('--secondary');
    } else if (theme === 'custom') {
      root.classList.remove('dark');
      root.classList.add('custom');
      root.style.setProperty('--primary', customColors.primary);
      root.style.setProperty('--secondary', customColors.secondary);
      root.style.setProperty('--primary-container', adjustColor(customColors.primary, -20));
    }
  }, [theme, customColors]);

  const setTheme = (value) => setThemeState(value);

  const setCustomColors = (colors) => {
    setCustomColorsState(colors);
    localStorage.setItem('reservo-custom-colors', JSON.stringify(colors));
  };

  const toggle = () => setThemeState(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle, customColors, setCustomColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

export function useTheme() {
  return useContext(ThemeContext);
}
