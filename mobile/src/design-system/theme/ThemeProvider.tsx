import React, { createContext, useContext, useMemo } from 'react';
import { theme as defaultTheme, Theme } from './tokens';

export const ThemeContext = createContext<Theme>(defaultTheme);

export interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: Theme;
}

/**
 * ThemeProvider allows the application to inject the design system theme
 * into the React tree. It defaults to the light theme provided in tokens.ts.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  theme = defaultTheme 
}) => {
  const value = useMemo(() => theme, [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme hook to access design tokens from context.
 */
export const useTheme = (): Theme => {
  return useContext(ThemeContext);
};
