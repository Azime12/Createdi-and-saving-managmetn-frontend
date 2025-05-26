'use client';

import { useColor } from '@/hooks/colorContext';

export function ColorPicker() {
  const { color, setColor, isDarkMode, toggleDarkMode } = useColor();

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center gap-4">
        <input 
          type="color" 
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12 cursor-pointer rounded border border-gray-300"
        />
        <div>
          <p className="font-medium">Brand Color</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{color}</p>
        </div>
      </div>
      
      <button
        onClick={toggleDarkMode}
        className={`w-full px-4 py-2 rounded-lg transition-colors ${
          isDarkMode 
            ? 'bg-gray-700 text-white hover:bg-gray-600' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
    </div>
  );
}