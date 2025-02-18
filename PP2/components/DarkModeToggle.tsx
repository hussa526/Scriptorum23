import React from 'react';
import { useTheme } from '../context/DarkModeContext';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme(); // Get dark mode state and toggle function

  return (
    <button
      onClick={toggleTheme}
      className="p-2 mt-4 bg-gray-200 rounded"
    >
      Toggle Dark Mode: {isDarkMode ? 'Dark' : 'Light'}
    </button>
  );
};

export default DarkModeToggle;