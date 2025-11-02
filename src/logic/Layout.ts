// logic/Layout.ts

import RedBlackNode from './RedBlackNode';
import type { NodePosition } from '../types';

export function calculateNodePositions(
  root: RedBlackNode | null
): Map<number, NodePosition> {
  const positions = new Map<number, NodePosition>();
  
  if (!root) return positions;

  const levelHeight = 100;
  const horizontalSpacing = 80; // Base spacing between nodes

  // First we calculate the in-order position for each node
  const inOrderPositions = new Map<number, number>();
  let inOrderCounter = 0;
  
  const inOrderTraversal = (node: RedBlackNode | null) => {
    if (!node) return;
    
    inOrderTraversal(node.left);
    inOrderPositions.set(node.id, inOrderCounter++);
    inOrderTraversal(node.right);
  };

  inOrderTraversal(root);

  // Calculate total number of nodes to determine centering offset
  const totalNodes = inOrderCounter;
  const treeWidth = (totalNodes - 1) * horizontalSpacing;
  const screenWidth = 1200; // Adjust based on your canvas/container width
  const centerOffset = (screenWidth - treeWidth) / 2;

  // Now we assign positions based on in-order position and level
  const assignPositions = (node: RedBlackNode | null, level: number) => {
    if (!node) return;
    
    const inOrderPos = inOrderPositions.get(node.id)!;
    
    positions.set(node.id, {
      x: inOrderPos * horizontalSpacing + centerOffset,
      y: level * levelHeight + 50,
      level
    });
    
    assignPositions(node.left, level + 1);
    assignPositions(node.right, level + 1);
  };

  assignPositions(root, 0);

  return positions;
}