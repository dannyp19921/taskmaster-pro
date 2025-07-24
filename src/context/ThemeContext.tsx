// /src/context/ThemeContext.tsx - Dark mode system

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Theme colors
export const lightTheme = {
  // Backgrounds
  background: '#f5f5f5',
  cardBackground: '#ffffff',
  inputBackground: '#ffffff',
  
  // Text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  // UI elements
  border: '#dddddd',
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#ff4444',
  info: '#007AFF',
  
  // Special
  completed: '#4CAF50',
  overdue: '#ff4444',
  today: '#ff6b35',
  soon: '#ffcc00',
};

export const darkTheme = {
  // Backgrounds
  background: '#1a1a1a',
  cardBackground: '#2d2d2d',
  inputBackground: '#3a3a3a',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  textTertiary: '#b0b0b0',
  
  // UI elements
  border: '#4a4a4a',
  shadow: 'rgba(0, 0, 0, 0.3)',
  
  // Status colors (slightly adjusted for dark mode)
  success: '#66BB6A',
  warning: '#FFA726',
  error: '#EF5350',
  info: '#42A5F5',
  
  // Special
  completed: '#66BB6A',
  overdue: '#EF5350',
  today: '#FF7043',
  soon: '#FFEB3B',
};

type Theme = typeof lightTheme;

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};