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
  // Calculate the angle and shorten the line to stop before the circle
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const nodeRadius = 25;
  
  // Shorten the line by the node radius so arrow stops at circle edge
  const ratio = (length - nodeRadius) / length;
  const adjustedX2 = x1 + dx * ratio;
  const adjustedY2 = y1 + dy * ratio;

  return (
    <line
      className="tree-edge"
      x1={x1}
      y1={y1}
      x2={adjustedX2}
      y2={adjustedY2}
      stroke="#828488ab"
      strokeWidth="2"
      markerEnd="url(#arrowhead)"
    />
  );
};