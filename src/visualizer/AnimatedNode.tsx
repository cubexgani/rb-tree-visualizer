import React from 'react';
import { Color } from '../types/index';

interface AnimatedNodeProps {
  value: number;
  color: Color;
  x: number;
  y: number;
  isHighlighted: boolean;
  isNewNode: boolean;
  isFound: boolean;
}

export const AnimatedNode: React.FC<AnimatedNodeProps> = ({
  value,
  color,
  x,
  y,
  isHighlighted,
  isNewNode,
  isFound
}) => {
  const fillColor = color === Color.RED ? '#EF4444' : '#1F2937';

  // Use green highlight if node is found, otherwise use yellow for normal highlight
  const strokeColor = isFound ? '#09b87eff' : (isHighlighted ? '#FBBF24' : '#9CA3AF');
  const strokeWidth = (isHighlighted || isFound) ? 4 : 2;

  return (
    <g
      className={`node-group ${isNewNode ? 'new-node' : ''}`}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <circle
        className={`node-circle ${isHighlighted ? 'highlighted-node' : ''} ${isFound ? 'found-node' : ''}`}
        cx={0}
        cy={0}
        r="25"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <text
        className="node-text"
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="16"
        fontWeight="bold"
      >
        {value}
      </text>
    </g>
  );
};