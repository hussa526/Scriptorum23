import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // Get dark mode state and toggle function

  return (
    <button onClick={toggleDarkMode} className="p-2 mt-4 bg-gray-200 rounded">
      Toggle Dark Mode: {isDarkMode ? 'Dark' : 'Light'}
    </button>
  );
};

export default DarkModeToggle;