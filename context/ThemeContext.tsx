import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSubtle: string;
  accentBorder: string;
  inputBg: string;
  inputBorder: string;
  inputBorderFocus: string;
  footerBorder: string;
}

const darkColors: ThemeColors = {
  background: '#0a0a0c',
  surface: '#141416',
  surfaceBorder: 'rgba(255,255,255,0.06)',
  text: '#f0f0f0',
  textSecondary: '#9ca3af',
  textMuted: '#52525b',
  accent: '#6366f1',
  accentSubtle: 'rgba(99,102,241,0.12)',
  accentBorder: 'rgba(99,102,241,0.4)',
  inputBg: '#141416',
  inputBorder: 'rgba(255,255,255,0.06)',
  inputBorderFocus: 'rgba(99,102,241,0.3)',
  footerBorder: 'rgba(255,255,255,0.06)',
};

const lightColors: ThemeColors = {
  background: '#FFFAF7',
  surface: '#FFFFFF',
  surfaceBorder: '#E8E0DC',
  text: '#1A1A1A',
  textSecondary: '#5C5C5C',
  textMuted: '#9CA3AF',
  accent: '#6366f1',
  accentSubtle: 'rgba(99,102,241,0.08)',
  accentBorder: 'rgba(99,102,241,0.3)',
  inputBg: '#FFFFFF',
  inputBorder: '#E8E0DC',
  inputBorderFocus: 'rgba(99,102,241,0.4)',
  footerBorder: '#E8E0DC',
};

interface ThemeContextType {
  mode: 'dark' | 'light';
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  colors: darkColors,
  toggleTheme: () => {},
  isDark: true,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const isInitializedRef = useRef(false);

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Track theme toggle when mode changes (but skip initial render)
  useEffect(() => {
    if (isInitializedRef.current) {
      // Dynamically import analytics to avoid circular imports
      import('../services/analytics').then(({ analyticsService }) => {
        analyticsService.track('theme_toggle', { new_mode: mode }, 'settings');
      });
    } else {
      isInitializedRef.current = true;
    }
  }, [mode]);

  const value: ThemeContextType = {
    mode,
    colors: mode === 'dark' ? darkColors : lightColors,
    toggleTheme,
    isDark: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
