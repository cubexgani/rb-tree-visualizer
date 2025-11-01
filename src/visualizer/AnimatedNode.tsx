import React from 'react';
import { Color, AnimationType } from '../types/index';

interface AnimatedNodeProps {
  value: number;
  color: Color;
  x: number;
  y: number;
  isHighlighted: boolean;
  isNewNode: boolean;
}

export const AnimatedNode: React.FC<AnimatedNodeProps> = ({
  value,
  color,
  x,
  y,
  isHighlighted,
  isNewNode
}) => {
  const fillColor = color === Color.RED ? '#EF4444' : '#1F2937';
  const strokeColor = isHighlighted ? '#FBBF24' : '#9CA3AF';
  const strokeWidth = isHighlighted ? 4 : 2;

  return (
    <g className={isNewNode ? 'new-node' : ''}>
      <circle
        className={`node-circle ${isHighlighted ? 'highlighted-node' : ''}`}
        cx={x}
        cy={y}
        r="25"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <text
        className="node-text"
        x={x}
        y={y}
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