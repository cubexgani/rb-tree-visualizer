import React from 'react';
import type { AnimationStep } from '../../types';

interface StatusDisplayProps {
  currentStep: AnimationStep | null;
  animationQueueLength: number;
  traversalResult: string;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({
  currentStep,
  animationQueueLength,
  traversalResult
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

      {traversalResult && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6 transition-all">
          <h3 className="text-lg font-semibold mb-2">Inorder Traversal Result:</h3>
          <p className="text-green-400 font-mono">{traversalResult}</p>
        </div>
      )}
    </>
  );
};