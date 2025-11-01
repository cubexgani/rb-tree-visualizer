// import React, { useState, useEffect, useRef, useCallback } from 'react';
// // We simulate the import of D3 (assuming it's available in the environment)
// // For demonstration, we'll assume d3 is available globally or imported via standard ES modules.
// // For simplicity, we define the necessary d3 functions inline or rely on the environment providing d3.

// // --- D3 HIERARCHY SIMULATION (D3 logic for layout calculation) ---
// const d3 = window.d3 || {}; 

// // Basic D3 types/functions needed for the layout logic
// const hierarchy = d3.hierarchy || ((data) => {
//     // A simplified hierarchy creation (D3 is highly recommended for robustness)
//     const root = { data: data, depth: 0, children: data.children || [] };
//     const descendants = [root];
//     let i = 0;
//     while (i < descendants.length) {
//         const node = descendants[i++];
//         if (node.children) {
//             node.children.forEach(child => {
//                 // Ensure child data is propagated correctly
//                 const childNode = { 
//                     data: child.data || child, // Use child.data if present (from toD3Format), otherwise use child itself
//                     depth: node.depth + 1, 
//                     children: child.children || [], 
//                     parent: node 
//                 };
//                 descendants.push(childNode);
//             });
//         }
//     }
//     // Add descendants method to the mock root for use in the mock tree layout
//     root.descendants = () => descendants; 
    
//     // Add links method for basic link mapping in the mock environment
//     root.links = () => descendants.filter(d => d.parent).map(d => ({ source: d.parent, target: d }));
    
//     return root;
// });


// // FIX: Corrected the mock D3 chain structure to resolve the "is not a function" error.
// // The variable 'tree' is assigned a function which acts as the D3 layout factory (d3.tree).
// const tree = d3.tree || function() {
//     // This function will be returned by separation() and acts as the final layout executor
//     const mockLayoutExecutor = (root) => {
//         const nodes = root.descendants();
//         // Mock coordinates: depth * 50 for X (breadth), depth * 100 for Y (depth)
//         nodes.forEach(node => {
//             // NOTE: In a proper D3 setup, the tree layout calculates X/Y based on tree structure.
//             // This mock uses a fixed offset based on depth.
//             node.x = node.depth * 100; // Increased X spacing for visual separation
//             node.y = node.depth * 80;  // Y spacing is still depth-based
//         });
//         return nodes;
//     };
    
//     // This object allows for chaining size() and separation() methods
//     const generator = {
//         // size() returns 'this' (the generator object) for chaining
//         size: function() { return this; }, 
//         // separation() returns the function that executes the layout
//         separation: function() { return mockLayoutExecutor; }, 
//     };

//     return generator; // tree() returns the generator object.
// };

// // Using a custom React Spring substitute for portability, though in a full React environment
// // you would use 'react-spring'. We'll use a simple transition for color highlighting.
// // For the position, we use inline styling which will look static without react-spring, 
// // but is prepared for it.
// const useSpring = (props) => {
//   const [styles, setStyles] = useState(props);
//   useEffect(() => {
//     // Simple state update to trigger transition (CSS transition assumed)
//     setStyles(props);
//   }, [props]);
//   return styles;
// };
// const animated = (Component) => (props) => <Component {...props} style={{ transition: 'all 0.5s ease-out' }} />;
// const AnimatedCircle = animated('circle');
// const AnimatedPath = animated('path');


// // --- DATA STRUCTURES ---

// class BinaryTreeNode {
//   constructor(value, left = null, right = null) {
//     this.value = value;
//     this.left = left;
//     this.right = right;
//   }
// }

// // Special object to reserve space in D3 layout but not render
// const PLACEHOLDER_VALUE = 'PH'; 
// const PLACEHOLDER_NODE = { value: PLACEHOLDER_VALUE, isPlaceholder: true };

// /**
//  * Converts the custom BinaryTreeNode structure to D3's required format 
//  * (nodes must have a 'children' array). Includes placeholder logic.
//  */
// const toD3Format = (node) => {
//   if (!node || node.isPlaceholder) return null;

//   const d3Node = { value: node.value, children: [] };

//   const hasLeft = node.left !== null;
//   const hasRight = node.right !== null;

//   // Add left child or placeholder
//   if (hasLeft) {
//     d3Node.children.push(toD3Format(node.left));
//   } else if (hasRight) {
//     // Force space reservation for missing left child
//     d3Node.children.push(PLACEHOLDER_NODE); 
//   }

//   // Add right child or placeholder
//   if (hasRight) {
//     d3Node.children.push(toD3Format(node.right));
//   } else if (hasLeft) {
//     // Force space reservation for missing right child
//     d3Node.children.push(PLACEHOLDER_NODE);
//   }

//   if (d3Node.children.length === 0) {
//     delete d3Node.children;
//   }

//   return d3Node;
// };


// /**
//  * Runs D3 layout to calculate all node and link coordinates.
//  */
// const getLayoutData = (rootNode, width, height) => {
//   if (!rootNode) return { nodes: [], links: [] };

//   const d3RootData = toD3Format(rootNode);
//   const root = hierarchy(d3RootData);

//   // Define the Tree Layout generator
//   // size([width, height]) for top-to-bottom layout
//   const treeLayout = tree()
//     .size([width, height]) 
//     .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

//   // Run the layout executor
//   treeLayout(root);

//   const nodes = root.descendants()
//     .filter(d => d.data && d.data.value !== PLACEHOLDER_VALUE) // Filter out placeholders
//     .map(d => ({
//       id: d.data.value,
//       value: d.data.value,
//       x: d.x,
//       y: d.y,
//       parent: d.parent ? d.parent.data.value : null,
//       isPlaceholder: d.data.isPlaceholder,
//     }));

//   const links = root.links()
//     .filter(link => 
//         link.source.data.value !== PLACEHOLDER_VALUE && 
//         link.target.data.value !== PLACEHOLDER_VALUE) // Filter out links to/from placeholders
//     .map(link => ({
//       source: { x: link.source.x, y: link.source.y, id: link.source.data.value },
//       target: { x: link.target.x, y: link.target.y, id: link.target.data.value },
//     }));

//   return { nodes, links };
// };


// // --- REACT COMPONENTS ---

// // Node component with React Spring animation properties
// const TreeNode = React.memo(({ data, highlightedNodeId }) => {
//   const isHighlighted = data.id === highlightedNodeId;
//   const highlightProps = useSpring({
//     fill: isHighlighted ? 'rgb(249 115 22)' : 'rgb(59 130 246)', // Tailwind orange-500 or blue-500
//     r: isHighlighted ? 15 : 12,
//     // Add x and y to the spring for animation
//     x: data.x,
//     y: data.y,
//   });

//   return (
//     <g transform={`translate(${highlightProps.x}, ${highlightProps.y})`}>
//       <AnimatedCircle 
//         cx={0} 
//         cy={0} 
//         r={highlightProps.r} 
//         fill={highlightProps.fill} 
//         className="stroke-white stroke-2"
//         style={highlightProps}
//       />
//       <text 
//         textAnchor="middle" 
//         dy=".3em" 
//         className="text-xs font-sans fill-white pointer-events-none"
//       >
//         {data.value}
//       </text>
//     </g>
//   );
// });

// // Link component (Path)
// const TreeLink = React.memo(({ link }) => {
//   // D3's linkHorizontal is typically used here, but for simplicity, we use a straight line.
//   // In a full D3 implementation, you'd use d3.linkVertical/Horizontal for smooth curves.
//   const d = `M${link.source.x},${link.source.y} L${link.target.x},${link.target.y}`;

//   const springProps = useSpring({
//     d: d,
//   });

//   return (
//     <AnimatedPath
//       d={springProps.d}
//       fill="none"
//       stroke="#a0a0a0"
//       strokeWidth="2"
//       className="opacity-70"
//     />
//   );
// });

// // --- MAIN APPLICATION COMPONENT ---

// const initialTree = new BinaryTreeNode(50, 
//   new BinaryTreeNode(30, new BinaryTreeNode(20), new BinaryTreeNode(40)),
//   new BinaryTreeNode(70, null, new BinaryTreeNode(80)) // Example of missing left child
// );

// const operationQueue = [
//   // Insertion of 45 (Search path: 50 -> 30 -> 40 -> Insert 45)
//   { type: 'VISIT', value: 50, message: 'Start search for 45 at root 50' },
//   { type: 'VISIT', value: 30, message: '45 > 30, move right' },
//   { type: 'VISIT', value: 40, message: '45 > 40, move right' },
//   { type: 'INSERT', value: 45, parentValue: 40, side: 'right', message: '40 has no right child, insert 45' },
  
//   // Insertion of 60 (Search path: 50 -> 70 -> Insert 60)
//   { type: 'VISIT', value: 50, message: 'Start search for 60 at root 50' },
//   { type: 'VISIT', value: 70, message: '60 < 70, move left' },
//   { type: 'INSERT', value: 60, parentValue: 70, side: 'left', message: '70 has no left child, insert 60' },
// ];

// export default function App() {
//   const [treeRoot, setTreeRoot] = useState(initialTree);
//   const [currentStepIndex, setCurrentStepIndex] = useState(0);
//   const [highlightedNodeId, setHighlightedNodeId] = useState(null);
//   const [message, setMessage] = useState('Ready. Press "Start Animation"');

//   const containerRef = useRef(null);
//   const SVG_WIDTH = 800;
//   const SVG_HEIGHT = 500;
//   const [visualizationData, setVisualizationData] = useState(() => 
//     getLayoutData(initialTree, SVG_WIDTH, SVG_HEIGHT)
//   );

//   // Function to execute one step of the algorithm
//   const executeStep = useCallback((step) => {
//     setMessage(step.message);
//     setHighlightedNodeId(step.value); // Highlight node being visited/inserted

//     if (step.type === 'INSERT') {
//       // Find the parent node in the current structure
//       const findAndInsert = (node) => {
//         if (!node) return null;
        
//         if (node.value === step.parentValue) {
//           const newNode = new BinaryTreeNode(step.value);
//           if (step.side === 'left') {
//             node.left = newNode;
//           } else {
//             node.right = newNode;
//           }
//           // The structure has changed, a new layout calculation is needed
//           return true;
//         }

//         return findAndInsert(node.left) || findAndInsert(node.right);
//       };

//       // Create a deep copy of the tree to ensure React detects the state change
//       const newRoot = JSON.parse(JSON.stringify(treeRoot), (key, value) => {
//           if (value && value.value !== undefined && value.left !== undefined) {
//               return new BinaryTreeNode(value.value, value.left, value.right);
//           }
//           return value;
//       });
      
//       findAndInsert(newRoot);
      
//       // Update the tree structure
//       setTreeRoot(newRoot); 

//       // Clear the highlight after the insertion is complete
//       setTimeout(() => setHighlightedNodeId(null), 500); 
//     }
    
//     // Move to the next step
//     setCurrentStepIndex(prev => prev + 1);

//   }, [treeRoot]);


//   // Effect to recalculate D3 layout when the tree structure changes
//   useEffect(() => {
//     // This is crucial: Recalculate coordinates every time the tree structure changes (due to INSERT)
//     if (treeRoot) {
//       const newData = getLayoutData(treeRoot, SVG_WIDTH, SVG_HEIGHT - 50); // Reserve space for controls
//       setVisualizationData(newData);
//     }
//   }, [treeRoot]);


//   // Effect to handle the sequential animation of steps
//   useEffect(() => {
//     if (currentStepIndex < operationQueue.length) {
//       const step = operationQueue[currentStepIndex];
      
//       const timer = setTimeout(() => {
//         executeStep(step);
//       }, 500); // 500ms delay between steps

//       return () => clearTimeout(timer); // Cleanup
//     } else if (currentStepIndex > 0) {
//       // Animation finished
//       setMessage('Animation complete. Final tree structure shown.');
//       setHighlightedNodeId(null);
//     }
//   }, [currentStepIndex, executeStep]);


//   const handleStart = () => {
//     // Reset state and start the loop
//     setTreeRoot(initialTree); 
//     setCurrentStepIndex(0);
//     setHighlightedNodeId(null);
//     setMessage('Starting simulation...');
//   };
  
//   const progressPercentage = (currentStepIndex / operationQueue.length) * 100;

//   return (
//     <div className="p-4 sm:p-6 min-h-screen bg-gray-50 flex flex-col font-sans">
//       <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">
//         Animated Binary Tree Layout
//       </h1>
//       <p className="text-gray-600 mb-6">
//         D3 layout calculation with React Spring animation (simulated) for Insertion steps.
//       </p>

//       {/* Control Panel */}
//       <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-indigo-200">
//         <div className="flex justify-between items-center mb-4">
//           <button 
//             onClick={handleStart}
//             disabled={currentStepIndex < operationQueue.length && currentStepIndex !== 0}
//             className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 
//               ${currentStepIndex < operationQueue.length && currentStepIndex !== 0
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
//               }`}
//           >
//             {currentStepIndex === 0 ? 'Start Animation' : 'Restart Simulation'}
//           </button>
//           <div className="text-sm font-medium text-gray-700">
//             Step {currentStepIndex} / {operationQueue.length}
//           </div>
//         </div>
//         <div className="text-lg font-mono text-gray-800 p-3 bg-gray-100 rounded-lg border">
//           {message}
//         </div>
        
//         {/* Progress Bar */}
//         <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
//             <div 
//                 className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
//                 style={{ width: `${progressPercentage}%` }}
//             ></div>
//         </div>
//       </div>

//       {/* SVG Visualization Canvas */}
//       <div 
//         ref={containerRef} 
//         className="flex-grow bg-white border border-gray-300 rounded-xl shadow-2xl overflow-hidden"
//       >
//         <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} width="100%" height="100%">
//           <g transform={`translate(0, 40)`}> 
            
//             {/* Links/Edges */}
//             {visualizationData.links.map((link, index) => (
//               <TreeLink key={index} link={link} />
//             ))}

//             {/* Nodes */}
//             {visualizationData.nodes.map((node) => (
//               <TreeNode 
//                 key={node.id} 
//                 data={node} 
//                 highlightedNodeId={highlightedNodeId} 
//               />
//             ))}
//           </g>
//         </svg>
//       </div>
//     </div>
//   );
// }
