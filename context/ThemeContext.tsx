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
  background: '#1A1A1A',
  surface: '#2A2A2A',
  surfaceBorder: 'rgba(255,255,255,0.08)',
  text: '#f0f0f0',
  textSecondary: '#9ca3af',
  textMuted: '#6B6B6B',
  accent: '#E8615A',
  accentSubtle: 'rgba(232,97,90,0.12)',
  accentBorder: 'rgba(232,97,90,0.4)',
  inputBg: '#2A2A2A',
  inputBorder: 'rgba(255,255,255,0.08)',
  inputBorderFocus: 'rgba(212,114,106,0.3)',
  footerBorder: 'rgba(255,255,255,0.08)',
};

const lightColors: ThemeColors = {
  background: '#FFF8F6',
  surface: '#FFFFFF',
  surfaceBorder: '#E8E0DC',
  text: '#2D2D2D',
  textSecondary: '#5C5C5C',
  textMuted: '#9CA3AF',
  accent: '#E8615A',
  accentSubtle: 'rgba(232,97,90,0.08)',
  accentBorder: 'rgba(232,97,90,0.3)',
  inputBg: '#FFFFFF',
  inputBorder: '#E8E0DC',
  inputBorderFocus: 'rgba(232,97,90,0.4)',
  footerBorder: '#E8E0DC',
};

interface ThemeContextType {
  mode: 'dark' | 'light';
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  colors: lightColors,
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'dark' | 'light'>('light');
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
