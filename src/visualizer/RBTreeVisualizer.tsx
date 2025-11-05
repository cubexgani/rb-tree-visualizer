// visualizer/RBTreeVisualizer.tsx

import React, { useState, useEffect, useRef } from 'react';
import { AnimationType, type AnimationStep } from '../types';
import RedBlackTree from '../logic/RedBlackTree';
import RedBlackNode from '../logic/RedBlackNode';
import { calculateNodePositions } from '../logic/Layout';
import { AnimatedNode } from './AnimatedNode';
import { AnimatedArrow } from './AnimatedArrow';

interface RBTreeVisualizerProps {
  tree: RedBlackTree;
  displayTree: RedBlackTree;
  animationQueue: AnimationStep[];
  setAnimationQueue: React.Dispatch<React.SetStateAction<AnimationStep[]>>;
  isAnimating: boolean;
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
  currentStep: AnimationStep | null;
  setCurrentStep: React.Dispatch<React.SetStateAction<AnimationStep | null>>;
  highlightedNodes: Set<number>;
  setHighlightedNodes: React.Dispatch<React.SetStateAction<Set<number>>>;
  nodes: RedBlackNode[];
  setNodes: React.Dispatch<React.SetStateAction<RedBlackNode[]>>;
}

export const RBTreeVisualizer: React.FC<RBTreeVisualizerProps> = ({
  tree,
  displayTree,
  animationQueue,
  setAnimationQueue,
  isAnimating,
  setIsAnimating,
  currentStep,
  setCurrentStep,
  highlightedNodes,
  setHighlightedNodes,
  nodes,
  setNodes
}) => {
  const animationRef = useRef<number | null>(null);
  const [foundNodes, setFoundNodes] = useState<Set<number>>(new Set());
  const foundTimeoutRef = useRef<number | null>(null);

  console.log(displayTree.toString());

  const executeAnimation = async () => {
    if (animationQueue.length === 0) {
      setIsAnimating(false);
      setCurrentStep(null);
      setHighlightedNodes(new Set());
      return;
    }

    const step = animationQueue[0];
    setCurrentStep(step);

    // Build traversal highlight set (yellow)
    const highlighted = new Set<number>();
    highlighted.add(step.nodeId);
    if (step.secondaryNodeId !== undefined) {
      highlighted.add(step.secondaryNodeId);
    }
    setHighlightedNodes(highlighted);

    // *** IMPORTANT: apply the snapshot BEFORE marking foundNodes ***
    // This ensures the rendered nodes correspond to the IDs we're highlighting.
    displayTree.restoreFromSnapshot(step.treeSnapshot);
    setNodes([...displayTree.toArray()]);

    // Handle FOUND animation type - highlight in green for 5 seconds
    if (step.type === AnimationType.FOUND) {
      const foundSet = new Set<number>();
      foundSet.add(step.nodeId);
      setFoundNodes(foundSet);

      // Clear any existing timeout
      if (foundTimeoutRef.current) {
        clearTimeout(foundTimeoutRef.current);
      }

      // Clear the green highlight after 5 seconds
      foundTimeoutRef.current = window.setTimeout(() => {
        setFoundNodes(new Set());
        foundTimeoutRef.current = null;
      }, 6000);
    }

    // Advance to next animation step after a short delay
    animationRef.current = window.setTimeout(() => {
      setAnimationQueue(prev => prev.slice(1));
    }, 800);
  };

  useEffect(() => {
    if (isAnimating && animationQueue.length > 0) {
      executeAnimation();
    } else if (animationQueue.length === 0) {
      setIsAnimating(false);
      setCurrentStep(null);
      // Only clear the traversal highlight, not found nodes
      setHighlightedNodes(new Set());
      // Do NOT clear foundNodes here — let the 5s timer handle it
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      // Do NOT clear foundTimeoutRef here — allow the 5s timer to run to completion
    };

    // Intentionally run when animationQueue or isAnimating updates
  }, [animationQueue, isAnimating]);

  const positions = calculateNodePositions(displayTree.root);
  const svgHeight = Math.max(
    400,
    positions.size > 0 ? Math.max(...Array.from(positions.values()).map(p => p.y)) + 100 : 400
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
      <svg width="1200" height={svgHeight} className="mx-auto">

        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L0,6 L9,3 z"
              fill="#8a8c8fff"
            />
          </marker>
        </defs>

        {/* Render edges first */}
        {nodes.map((node, idx) => {
          const pos = positions.get(node.id);
          if (!pos) return null;

          const leftPos = node.left ? positions.get(node.left.id) : null;
          const rightPos = node.right ? positions.get(node.right.id) : null;

          return (
            <g key={`edges-${idx}`}>
              {leftPos && (
                <AnimatedArrow
                  x1={pos.x}
                  y1={pos.y}
                  x2={leftPos.x}
                  y2={leftPos.y}
                />
              )}
              {rightPos && (
                <AnimatedArrow
                  x1={pos.x}
                  y1={pos.y}
                  x2={rightPos.x}
                  y2={rightPos.y}
                />
              )}
            </g>
          );
        })}

        {/* Render nodes on top */}
        {nodes.map((node, idx) => {
          const pos = positions.get(node.id);
          if (!pos) return null;

          const isHighlighted = highlightedNodes.has(node.id);
          const isNewNode = currentStep?.type === AnimationType.INSERT && currentStep.nodeId === node.val;
          const isFound = foundNodes.has(node.id);

          return (
            <AnimatedNode
              key={`node-${idx}`}
              value={node.val}
              color={node.color}
              x={pos.x}
              y={pos.y}
              isHighlighted={isHighlighted}
              isNewNode={isNewNode}
              isFound={isFound}
            />
          );
        })}
      </svg>

      {nodes.length === 0 && (
        <div className="text-center text-gray-400 py-20">
          Insert values to visualize the Red-Black Tree
        </div>
      )}
    </div>
  );
};
