# Red-Black Tree Visualizer
Creates a visualization for a red-black tree (insertion and search procedures), along with one application of it.

## Definition
Red-Black tree is a self-balancing binary search tree which has an extra bit of information in each node along with its value: its color (red or black, don't ask me why specifically these 2). This self-balancing property enables search opearation in O(lg n) time, contrary to binary search tree, where search operation takes O(h) time, where h <= n. And the red and black colours are used as information for balancing the tree after each insertion.  
This is kinda different from an AVL tree, which contains a balance factor for each node, and is more strictly balanced than an RB tree, and hence takes slightly(?) more time for insertion.

## Getting started
- Clone this repository with `git clone <link to repository>`
- Install all dependencies with `npm i` (ensure you have node and npm installed for this to work)
- Run the project with `npm run dev`

## Project structure
Quick note that not all of these folders might be present. The ones not present are kept for future consideration.
```
├── node_modules/
├── package.json
├── public/
│   └── index.html
├── src/
│   ├── api/              # For future backend communication (if needed)
│   ├── components/       # Reusable UI elements (Buttons, InputFields, Layout)
│   │   ├── layout/       # Components for app structure (Header, Footer, Navbar)
│   │   │   └── PageLayout.tsx      # Layout for the RB tree visualizer page
│   │   └── ui/           # Basic UI like button, input
│   │       ├── Controls.tsx    # Controls for the visualizer
│   │       ├── StatusDisplay.tsx   # Status of animation
│   │       └── Legend.tsx      # Meaning of the circles or smth
│   ├── pages/            # Top-level components for each route/view
│   │   ├── Home.tsx       # The landing page
│   │   └── RBTreePage.tsx # The main visualization page
│   ├── logic/            # Core Data Structures and Algorithms
│   │   ├── Layout.ts   # Utility functions to generate tree node coordinates
│   │   ├── RedBlackTree.ts     # The RBTree Class (Logic + Step Recorder)
│   │   └── RedBlackNode.ts # The Node Class
│   ├── visualizer/       # Components specific to the RBT visualization
│   │   ├── AnimatedNode.tsx     # SVG Node, might consider using react spring later
│   │   ├── AnimatedArrow.tsx    # SVG Path, might consider using react spring later
│   │   └── RBTreeVisualizer.tsx # State manager/orchestrator
│   ├── styles/           # Global styles and themes
│   │   └── index.css
│   ├── types/          # Custom types
│   │   └── index.ts
│   ├── App.tsx            # Defines the routes (e.g., Home, /rbtree)
│   └── index.tsx          # Entry point and router setup
└── server.ts             # Node.js/Express server (primarily serving the build)
```

## Some notes:
- Normally, this project won't require a backend, because:  
    - As this is a visualization, a backend might be overkill
    - Accessing the backend will require using additional escape hatches (`useEffect` hook), which can potentially increase code complexity.
    - And of course, there's a latency which arises while accessing the backend, which might increase with the size of the red-black tree.  

    So without a backend,
    - Deployment will be miles easier (trust).
    - No backend setup required.

- Also, a lot of the files not listed here are in the actual directory structure, which means that they are probably not required, for now. Means they can either be added to the main part or deleted, and aren't related to the present state of the project. Feel free to ignore those files.

- A lot of the code here is undocumented, but fear not, for I shall document them later. Well, excluding the frontend part.

