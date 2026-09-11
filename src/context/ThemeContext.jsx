import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Default to 'golden_aura' as requested in user's image referral
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('crowdpulse_theme') || 'golden_aura';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('crowdpulse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'golden_aura' ? 'cyber_dark' : 'golden_aura');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isGoldenAura: theme === 'golden_aura' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
