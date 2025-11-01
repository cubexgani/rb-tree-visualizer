import React, { useState, useEffect } from 'react';
import { useSpring, animated as a, SpringValue } from '@react-spring/web';

// --- Type Definitions ---
interface AnimationProps {
  x: number;
  y: number;
  rotation: number;
}

// Define the specific animated values the circle component expects
interface CircleProps {
  cx: SpringValue<number>;
  cy: SpringValue<number>;
}

// Define the specific animated values the line component expects
interface LineProps {
  x: SpringValue<number>;
  y: SpringValue<number>;
  rotation: SpringValue<number>;
}

// --- Constants ---
const RADIUS = 15;
const LINE_LENGTH = 30;
const INITIAL_CENTER = { x: 20, y: 30 };
const FINAL_CENTER = { x: 40, y: 60 };

// --- 1. AnimatedCircle Component ---
const AnimatedCircle: React.FC<CircleProps> = ({ cx, cy }) => {
  return (
    <a.circle
      cx={cx}
      cy={cy}
      r={RADIUS}
      fill="red"
    />
  );
};

// --- 2. AnimatedLine Component ---
const AnimatedLine: React.FC<LineProps> = ({ x, y, rotation }) => {
  // Define a vertical line relative to the group's origin (0, 0)
  const RELATIVE_X1 = 0;
  const RELATIVE_Y1 = RADIUS; 
  const RELATIVE_X2 = 0;
  const RELATIVE_Y2 = RADIUS + LINE_LENGTH; 

  // FIX: Replaced a.to() which caused TypeError. 
  // We use the .to() method on the x SpringValue and retrieve synchronized 
  // y and rotation values using .get().
  const transform = x.to((transX) => {
    // Access the synchronized current values of y and rotation.
    const transY = y.get(); 
    const rot = rotation.get();
    
    // 1. translate(x, y): Moves the group to the circle's center.
    // 2. rotate(rotation, 0, 0): Rotates the line about the group's origin (the center).
    return `translate(${transX}, ${transY}) rotate(${rot}, 0, 0)`;
  });

  return (
    // Use the animated SVG group element
    <a.g transform={transform}>
      {/* The line element inside the group remains non-animated, simplifying its definition */}
      <line
        x1={RELATIVE_X1}
        y1={RELATIVE_Y1}
        x2={RELATIVE_X2}
        y2={RELATIVE_Y2}
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </a.g>
  );
};


// --- 3. App Component (Parent/Container) ---
const TApp = () => {
  const [toggle, setToggle] = useState(false);

  // Define the spring for the animation (no aggressive type cast needed here)
  const animatedProps = useSpring<AnimationProps>({
    from: { 
      x: INITIAL_CENTER.x, 
      y: INITIAL_CENTER.y, 
      rotation: 0 
    },
    to: { 
      x: toggle ? FINAL_CENTER.x : INITIAL_CENTER.x, 
      y: toggle ? FINAL_CENTER.y : INITIAL_CENTER.y, 
      rotation: toggle ? 90 : 0 
    },
    config: { 
      tension: 170, 
      friction: 16, 
      duration: 2000 
    },
    immediate: !toggle
  });

  // Automatically start and loop the animation
  useEffect(() => {
    const interval = setInterval(() => {
      setToggle(t => !t);
    }, 2500); // Toggles every 2.5 seconds (2s animation + 0.5s pause)
    return () => clearInterval(interval);
  }, []);

  return (
        <svg viewBox="0 0 100 100"  style={{width: 400, height: 400}}>
          {/* Render the background grid/guides (optional but helpful) */}
          <g opacity="0.1">
          </g>

          {/* Line MUST be rendered BEFORE the circle so the circle is on top */}
          <AnimatedLine x={animatedProps.x} y={animatedProps.y} rotation={animatedProps.rotation} />
          
          <AnimatedCircle cx={animatedProps.x} cy={animatedProps.y} />
        </svg>

  );
};

export default TApp;
