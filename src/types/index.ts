// This is a hacky way to implement enums.
// In this project, node itself compiles and runs the typescript, and it doesn't support enums yet.

export const Color = {
  RED: 'RED',
  BLACK: 'BLACK',
} as const;

export type Color = typeof Color[keyof typeof Color];

export const AnimationType = {
  COMPARE: 'COMPARE',
  INSERT: 'INSERT',
  ROTATE_LEFT: 'ROTATE_LEFT',
  ROTATE_RIGHT: 'ROTATE_RIGHT',
  RECOLOR: 'RECOLOR',
  TRAVERSE: 'TRAVERSE',
  FOUND: 'FOUND',
  NOT_FOUND: 'NOT_FOUND'
} as const;

export type AnimationType = typeof AnimationType[keyof typeof AnimationType];

export interface AnimationStep {
  type: AnimationType;
  nodeId: number;
  secondaryNodeId?: number;
  description: string;
  newColor?: Color;
  treeSnapshot: string; // JSON serialized tree
}

export interface NodePosition {
  x: number;
  y: number;
  level: number;
}