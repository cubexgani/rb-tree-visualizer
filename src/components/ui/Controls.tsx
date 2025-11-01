import React from 'react';
// import { Play, Pause, RotateCcw, Plus, Search } from 'lucide-react';

interface ControlsProps {
  insertValue: string;
  setInsertValue: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  isAnimating: boolean;
  hasNodes: boolean;
  onInsert: () => void;
  onSearch: () => void;
  onInorder: () => void;
  onPauseResume: () => void;
  onReset: () => void;
  hasAnimationQueue: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  insertValue,
  setInsertValue,
  searchValue,
  setSearchValue,
  isAnimating,
  hasNodes,
  onInsert,
  onSearch,
  onInorder,
  onPauseResume,
  onReset,
  hasAnimationQueue
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex gap-2">
          <input
            type="number"
            value={insertValue}
            onChange={(e) => setInsertValue(e.target.value)}
            placeholder="Enter value to insert"
            className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isAnimating}
          />
          <button
            onClick={onInsert}
            disabled={isAnimating || !insertValue}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {/* <Plus size={20} /> */}
            Insert
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Enter value to search"
            className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            disabled={isAnimating}
          />
          <button
            onClick={onSearch}
            disabled={isAnimating || !searchValue || !hasNodes}
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {/* <Search size={20} /> */}
            Search
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onInorder}
          disabled={isAnimating || !hasNodes}
          className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
        >
          Inorder Traversal
        </button>

        <button
          onClick={onPauseResume}
          disabled={!hasAnimationQueue && !isAnimating}
          className="px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
        >
          {/* {isAnimating ? <Pause size={20} /> : <Play size={20} />} */}
          {isAnimating ? 'Pause' : 'Resume'}
        </button>

        <button
          onClick={onReset}
          disabled={!isAnimating && !hasAnimationQueue}
          className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
        >
          {/* <RotateCcw size={20} /> */}
          Reset
        </button>
      </div>
    </div>
  );
};