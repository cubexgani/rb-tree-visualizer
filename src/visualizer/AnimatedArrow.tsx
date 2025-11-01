import React from 'react';

interface AnimatedArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const AnimatedArrow: React.FC<AnimatedArrowProps> = ({
  x1,
  y1,
  x2,
  y2
}) => {
  return (
    <line
      className="tree-edge"
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#4B5563"
      strokeWidth="2"
    />
  );
};