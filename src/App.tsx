import { animated } from '@react-spring/web';
import { useSpring } from '@react-spring/web';
import { useState } from 'react'
import './styles/App.css'

function App() {
  const spr = useSpring({
    from: { x: 10 },
    to: { x: 550 }
  });
  const [props, api] = useSpring(
    () => ({
      from: { opacity: 0 },
      to: { opacity: 1 },
    }),
    []
  );
  const circProps = useSpring({
    from: { x: 20, y: 30, fill: '#FF0000', rotation: 0 },
    // Animate to the target position
    to: { x: 40, y: 60, fill: '#FF0000', rotation: 90 },
    config: {
      tension: 170,
      friction: 26
    }
  });
  const transform = circProps.x.to((x) =>
    `translate(${x}, ${circProps.y.get()})`
  );
  const translation = circProps.x.to((x) =>
    `translate(${x}, ${circProps.y.get()})`
  );

  // The rotation transform (e.g., "rotate(90, 0, 0)")
  const rotation = circProps.rotation.to((r) =>
    `rotate(${r}, 0, 0)`
  );
  return (
    <>
      <animated.div style={props}><h1>RB TREES IN THE HOUSE</h1></animated.div>
      <animated.div
        style={{
          width: 80,
          height: 80,
          background: '#60bde4ff',
          borderRadius: 8,
          ...spr
        }} />

      <svg width="400" height="400">
        {/* 1. Wrap in animated.g */}
        <animated.g transform={transform}>
          {/* 2. Animate the fill directly on the circle */}
          <animated.circle r={15} fill={circProps.fill} cx="0" cy="0" />
          {/* 3. Text moves with the group */}
          <text
            x="0"
            y="5" // Adjust this for perfect vertical centering. 5px is a good start.
            fill="white"
            textAnchor="middle" // This centers the text horizontally on x="0"
            style={{
              fontSize: '10px',
              // You might need this for better vertical alignment
              dominantBaseline: 'middle'
            }}
          >
            val
          </text>
          {/* --- The Rotational Arrow --- */}
          <animated.g
            // Anchor the rotation at the group's origin (0, 0) - the circle center
            transform={circProps.rotation.to((r) =>
              `rotate(${r}, 0, 0)`
            )}
          >
            {/* Arrow Path:
            - M 0 -15: Move to (0, -15). This is the circle's top edge (r=15). 
            - L 0 -45: Draw line up to (0, -45) (30 units long).
            - The head is drawn relative to the tip (0, -45).
          */}
            <path
              d="M 0 -15 L 0 -45 L 5 -40 M 0 -45 L -5 -40"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </animated.g>
        </animated.g>
      </svg>
      {/* <g width="200" height="200">
      <circle
        cx="100" // X-coordinate of the circle's center
        cy="100" // Y-coordinate of the circle's center
        r="80"   // Radius of the circle
        fill="blue" // Fill color of the circle
        stroke="black" // Stroke color of the circle
        strokeWidth="2" // Stroke width of the circle
      />
    </g> */}
    </>
  );
  // console.log(rotation.get());
  //   return (
  //     <svg width="400" height="400">

  //       {/* 1. INDEPENDENT CIRCLE/TEXT GROUP (Only Translation) */}
  //       <animated.g transform={translation}>
  //         <animated.circle r={15} fill={circProps.fill} cx="0" cy="0" /> 
  //         <text 
  //           x="0" 
  //           y="5"
  //           fill="white" 
  //           textAnchor="middle"
  //           style={{ 
  //               fontSize: '10px', 
  //               dominantBaseline: 'middle' 
  //           }}
  //         >
  //           val
  //         </text>
  //       </animated.g>


  //       {/* 2. INDEPENDENT ARROW GROUP (Translation + Rotation) */}
  //       <animated.g transform={`${translation.get()} ${rotation.get()}`}>
  //           {/* NOTE: You must use .get() here to concatenate the string values
  //             of the two FluidValues (translation and rotation) into a single
  //             interpolated value for the transform prop.

  //             Alternatively, use .to() interpolation to combine them safely:
  //           */}
  //           <animated.g 
  //              transform={translation.to((t) => `${t} ${rotation.get()}`)}
  //           >
  //               <path
  //                 d="M 0 -15 L 0 -45 L 5 -40 M 0 -45 L -5 -40"
  //                 stroke="#FFFFFF"
  //                 strokeWidth="2"
  //                 fill="none"
  //                 strokeLinecap="round"
  //               />
  //           </animated.g>

  //       </animated.g>
  //     </svg>
  //   );
}

export default App
