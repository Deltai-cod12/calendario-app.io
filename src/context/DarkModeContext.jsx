import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext(null);

export function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', dark);
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  const toggle = () => setDark(d => !d);

  return <DarkModeContext.Provider value={{ dark, toggle }}>{children}</DarkModeContext.Provider>;
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error('useDarkMode must be inside DarkModeProvider');
  return ctx;
}
