/**
* The RedBlackNode class defines a node of a red black tree.
*/

import { Color } from "../types";

export default class RedBlackNode {
    readonly val: number;
    left: RedBlackNode | null;
    right: RedBlackNode | null;
    parent: RedBlackNode | null;
    color: Color;
    id: number;

    /**
    * Creates a new node for a red black tree.
    */
    constructor(val: number, paren: RedBlackNode | null = null, id: number) {
        this.val = val;
        this.left = null;
        this.right = null;
        this.parent = paren;
        this.color = Color.BLACK;
        this.id = id;
    }

    /**
     * Returns a string representation of the current node.
     * @returns The string representation.
     */
    toString() : string {
        let colStr: 'B' | 'R' = this.color === Color.BLACK ? 'B' : 'R';
        return `(${colStr}, ${this.val})`;
    }

  // Deep clone a node
  static clone(node: RedBlackNode | null, parent: RedBlackNode | null = null): RedBlackNode | null {
    if (!node) return null;
    
    const cloned = new RedBlackNode(node.val, node.parent, node.id);
    cloned.color = node.color;
    cloned.parent = parent;
    cloned.left = RedBlackNode.clone(node.left, cloned);
    cloned.right = RedBlackNode.clone(node.right, cloned);
    
    return cloned;
  } 
}