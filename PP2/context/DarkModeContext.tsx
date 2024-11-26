import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of the context
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Provide a default value for the context
const defaultValue: ThemeContextType = {
  isDarkMode: false,
  toggleTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultValue);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedTheme);
  }, []);

  // Save theme preference to localStorage and update CSS variables
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    document.documentElement.classList.toggle('dark', isDarkMode); // Update `dark` class dynamically
    
    // Update CSS variables based on the theme
    if (isDarkMode) {
      document.documentElement.style.setProperty('--background', '#0a0a0a');
      document.documentElement.style.setProperty('--foreground', '#ededed');
    } else {
      document.documentElement.style.setProperty('--background', '#ffffff');
      document.documentElement.style.setProperty('--foreground', '#171717');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev); // Toggle the theme
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};