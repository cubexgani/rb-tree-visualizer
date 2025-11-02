import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Controls } from '../components/ui/Controls';
import { StatusDisplay } from '../components/ui/StatusDisplay';
import { Legend } from '../components/ui/Legend';
import { RBTreeVisualizer } from '../visualizer/RBTreeVisualizer';
import RedBlackTree from '../logic/RedBlackTree';
import RedBlackNode from '../logic/RedBlackNode';
import type { AnimationStep } from '../types';

export const RBTreePage: React.FC = () => {
  const [tree] = useState(() => new RedBlackTree());
  const [displayTree] = useState(() => new RedBlackTree());
  const [nodes, setNodes] = useState<RedBlackNode[]>([]);
  const [insertValue, setInsertValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [animationQueue, setAnimationQueue] = useState<AnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState<AnimationStep | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<number>>(new Set());
  const [traversalResult, setTraversalResult] = useState<string>('');

  const handleInsert = () => {
    const value = parseInt(insertValue);
    if (isNaN(value)) return;

    tree.insert(value);
    setAnimationQueue(tree.getAnimationSteps());
    setIsAnimating(true);
    setInsertValue('');
    setTraversalResult('');
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;

    const res = tree.search(value);
    setAnimationQueue(tree.getAnimationSteps());
    
    setIsAnimating(true);
    setTraversalResult('');
  };

  const handleInorder = () => {
    const steps = tree.inorder();
    const result = steps.join(' → ');
    setAnimationQueue(tree.getAnimationSteps());
    setIsAnimating(true);
    setTraversalResult(result);
  };

  const handlePauseResume = () => {
    setIsAnimating(!isAnimating);
  };

  const handleReset = () => {
    setAnimationQueue([]);
    setIsAnimating(false);
    setCurrentStep(null);
    setHighlightedNodes(new Set());
    displayTree.root = RedBlackNode.clone(tree.root);
    setNodes([...displayTree.toArray()]);
  };

  return (
    <PageLayout title="Red-Black Tree Visualizer">
      <Controls
        insertValue={insertValue}
        setInsertValue={setInsertValue}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isAnimating={isAnimating}
        hasNodes={nodes.length > 0}
        onInsert={handleInsert}
        onSearch={handleSearch}
        onInorder={handleInorder}
        onPauseResume={handlePauseResume}
        onReset={handleReset}
        hasAnimationQueue={animationQueue.length > 0}
      />

      <StatusDisplay
        currentStep={currentStep}
        animationQueueLength={animationQueue.length}
        traversalResult={traversalResult}
      />

      <RBTreeVisualizer
        tree={tree}
        displayTree={displayTree}
        animationQueue={animationQueue}
        setAnimationQueue={setAnimationQueue}
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        highlightedNodes={highlightedNodes}
        setHighlightedNodes={setHighlightedNodes}
        nodes={nodes}
        setNodes={setNodes}
      />

      <Legend />
    </PageLayout>
  );
};