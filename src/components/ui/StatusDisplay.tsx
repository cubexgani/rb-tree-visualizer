import React from 'react';
import type { AnimationStep } from '../../types';

interface StatusDisplayProps {
  currentStep: AnimationStep | null;
  animationQueueLength: number;
  traversalResult: string;
  traversalType: string;
  searchError: string;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({
  currentStep,
  animationQueueLength,
  traversalResult,
  traversalType,
  searchError
}) => {
  return (
    <>
      {currentStep && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6 transition-all">
          <h3 className="text-lg font-semibold mb-2">Current Operation:</h3>
          <p className="text-gray-300">{currentStep.description}</p>
          <p className="text-sm text-gray-400 mt-2">
            Steps remaining: {animationQueueLength}
          </p>
        </div>
      )}

      {searchError && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6 transition-all">
          <h3 className="text-lg font-semibold mb-2">Search Result:</h3>
          <p className="text-red-400 font-semibold text-lg">{searchError}</p>
        </div>
      )}

      {traversalResult && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6 transition-all">
          <h3 className="text-lg font-semibold mb-2">{traversalType} Traversal Result:</h3>
          <p className="text-green-400 font-mono">{traversalResult}</p>
        </div>
      )}
    </>
  );
};