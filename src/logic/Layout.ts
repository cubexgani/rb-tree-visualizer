// logic/Layout.ts

import RedBlackNode from './RedBlackNode';
import type { NodePosition } from '../types';

export function calculateNodePositions(
  root: RedBlackNode | null
): Map<number, NodePosition> {
  const positions = new Map<number, NodePosition>();
  
  if (!root) return positions;

  const levelNodes = new Map<number, RedBlackNode[]>();
  
  const assignLevels = (node: RedBlackNode | null, level: number) => {
    if (!node) return;
    
    if (!levelNodes.has(level)) {
      levelNodes.set(level, []);
    }
    levelNodes.get(level)!.push(node);
    
    assignLevels(node.left, level + 1);
    assignLevels(node.right, level + 1);
  };

  assignLevels(root, 0);

  const width = 800;
  const levelHeight = 100;

  levelNodes.forEach((nodesAtLevel, level) => {
    const spacing = width / (nodesAtLevel.length + 1);
    nodesAtLevel.forEach((node, index) => {
      positions.set(node.val, {
        x: spacing * (index + 1),
        y: level * levelHeight + 50,
        level
      });
    });
  });

  return positions;
}