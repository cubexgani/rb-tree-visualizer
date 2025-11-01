// components/ui/Legend.tsx

import React from 'react';

export const Legend: React.FC = () => {
  return (
    <div className="mt-6 bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Legend:</h3>
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-red-500"></div>
          <span>Red Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-400"></div>
          <span>Black Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-800 border-4 border-yellow-500"></div>
          <span>Highlighted Node</span>
        </div>
      </div>
    </div>
  );
};