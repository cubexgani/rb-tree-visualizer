import { AnimationType, Color, type AnimationStep } from "../types";
import RedBlackNode from "./RedBlackNode.ts";

/**
* The RedBlackTree class defines a red black tree.
*/
export default class RedBlackTree {
    root: RedBlackNode | null;
    animationSteps: AnimationStep[];
    private id: number;
    /**
    * Make a new red black tree.
    */
    constructor() {
        this.root = null;        
        this.animationSteps = [];
        this.id = Date.now();
    }
    
    private createSnapshot(): string {
        return JSON.stringify(this.root ? this.root.toJSON() : null);
    }
    
    // Add animation step with current tree state
    private addStep(
        type: AnimationType,
        nodeId: number,
        description: string,
        secondaryNodeId?: number,
        newColor?: Color
    ) {
        this.animationSteps.push({
            type,
            nodeId,
            secondaryNodeId,
            description,
            newColor,
            treeSnapshot: this.createSnapshot()
        });
    }
    
    getAnimationSteps() {
        let st = this.animationSteps;      
        this.animationSteps = [];
        return st;
    }
    
    /**
    * Traverses the tree in an inorder manner. If tree is empty, simply returns "Empty".
    * @returns A string containing the elements arranged in inorder fashion.
    */
    inorder() {
        if (!this.root) return [];
        let arr: number[] = [];
        this.getInorderArray(this.root, arr);
        return arr;
    }
    private getInorderArray(node: RedBlackNode | null, arr: number[]) {
        if (!node) return;
        this.getInorderArray(node.left, arr);
        this.addStep(
            AnimationType.TRAVERSE,
            node.id,
            `Visiting ${node.val}`
        );
        arr.push(node.val);
        this.getInorderArray(node.right, arr);
    }
    
    /**
    * Inserts a value in the tree, like the way a BST does.
    * @param val The number to be inserted
    */
    insert(val: number) {
        // x traverses the tree, with y behind it.
        let x = this.root, y = null;
        while (x != null) {
            y = x;
            this.addStep(
                AnimationType.COMPARE,
                x.id, `Comparing ${val} with ${x.val}`,
                val, undefined
            );
            if (val > x.val) x = x.right;
            else x = x.left;
        }
        let z = new RedBlackNode(val, y, this.id++);
        z.color = Color.RED;
        // Didnt even enter the loop, implying empty tree
        if (!y) this.root = z;
        else if (val > y.val) y.right = z;
        else y.left = z;
        this.addStep(
            AnimationType.INSERT,
            Date.now(), `Insert ${val} as red node`
        )
        this.insertFix(z);
    }
    
    /**
    * Rotates a node rightwards. For more explanation, read CLRS.
    * @param x The node to be rotated.
    * @returns nothing.
    */
    rotateRight(x: RedBlackNode | null) {
        if (!x || !x.left) return;
        this.addStep(
            AnimationType.ROTATE_RIGHT,
            x.id,
            `Rotating right at node ${x.val}`,
            x.left!.id
        );
        let y = x.left!;
        x.left = y.right;
        if (y.right) y.right.parent = x;
        y.parent = x.parent;
        if (!x.parent) this.root = y;
        else if (x.parent.right == x) x.parent.right = y;
        else x.parent.left = y;
        y.right = x;
        x.parent = y;
    }
    /**
    * Rotates a node leftwards. For more explanation, read CLRS.
    * @param x The node to be rotated.
    * @returns nothing.
    */
    rotateLeft(x: RedBlackNode | null) {
        // A left rotation is meaningless if there is no right child of parent.
        // It is also meaningless if the node itself doesn't exist.
        if (!x || !x.right) return;
        this.addStep(
            AnimationType.ROTATE_LEFT,
            x.id,
            `Rotating left at node ${x.val}`,
            x.right!.id
        );
        let y = x.right;
        x.right = y.left;
        if (y.left) y.left.parent = x;
        y.parent = x.parent;
        if (!x.parent) this.root = y;
        else if (x.parent.right == x) x.parent.right = y;
        else x.parent.left = y;
        y.left = x;
        x.parent = y;
        
    }
    
    /*
    Following are a series of getters which removes the mess of null checking from
    the fix after insert code.
    */
    
    parentOf(x: RedBlackNode | null) {
        return x ? x.parent : null;
    }
    leftOf(x: RedBlackNode | null) {
        return x ? x.left : null;
    }
    rightOf(x: RedBlackNode | null) {
        return x ? x.right : null;
    }
    /**
    * Returns the color of the node. If the node is null, it's treated like the "sentinel node" in CLRS, whose
    * color is black.
    * @param x The node in question
    * @returns Its color if it exists, else black.
    */
    colorOf(x: RedBlackNode | null) {
        return x ? x.color : Color.BLACK;
    }
    
    /**
    * Changes the color of the node, if it exists.
    * @param x The node whose color is to be changed.
    * @param c The new color of the node.
    */
    setColorOf(x: RedBlackNode | null, c: Color) {
        if (x) x.color = c;
    }
    
    /**
    * The meat of the implementation. It fixes the RB tree after a node is inserted.
    * Fixes include restoring the color properties of the nodes, and performing rotations based on the various
    * cases that can arise. More in CLRS.
    * @param z The newly inserted node.
    */
    insertFix(z: RedBlackNode | null) {
        while (z && z !== this.root && this.colorOf(this.parentOf(z)) === Color.RED) {
            // since z.parent is red, and the root should be black, z.parent.parent exists.
            if (this.parentOf(z) === this.leftOf(this.parentOf(this.parentOf(z)))) {    // z's parent is a left child
                let y = this.rightOf(this.parentOf(this.parentOf(z)));      //z's uncle y
                if (this.colorOf(y) === Color.RED) {     // case 1
                    this.addStep(
                        AnimationType.COMPARE,
                        z.id, `Uncle ${y!.val} is red, recoloring`,
                        y!.id
                    )
                    
                    // blacken parent and uncle
                    this.setColorOf(this.parentOf(z), Color.BLACK);
                    this.setColorOf(y, Color.BLACK);
                    
                    this.addStep(
                        AnimationType.RECOLOR,
                        z.parent!.id,
                        `Recolor parent ${z.parent!.val} to black`, undefined,
                        Color.BLACK
                    )
                    this.addStep(
                        AnimationType.RECOLOR,
                        y!.id, `Recolor uncle ${y!.val} to black`,
                        undefined, Color.BLACK
                    )
                    
                    // redden the grandparent
                    this.setColorOf(this.parentOf(this.parentOf(z)), Color.RED);
                    this.addStep(
                        AnimationType.RECOLOR,
                        z.parent!.parent!.id,
                        `Recolor grandparent ${z.parent!.parent!.val} to red`,
                        undefined, Color.RED
                    );
                    
                    // go to grandparent to continue fixing
                    z = this.parentOf(this.parentOf(z));
                }
                else {
                    if (z === this.rightOf(this.parentOf(z))) {     // case 2
                        z = this.parentOf(z);
                        this.rotateLeft(z);
                    }
                    // case 3 may or may not result after case 2
                    this.setColorOf(this.parentOf(z), Color.BLACK);
                    
                    this.addStep(
                        AnimationType.RECOLOR,
                        z!.parent!.id, `Recolor parent ${z!.parent!.val} to black`,
                        undefined, Color.BLACK
                    );
                    
                    this.setColorOf(this.parentOf(this.parentOf(z)), Color.RED);
                    this.addStep(
                        AnimationType.RECOLOR,
                        z!.parent!.parent!.id,
                        `Recolor grandparent ${z!.parent!.parent!.val} to red`,
                        undefined,
                        Color.RED
                    );
                    
                    this.rotateRight(this.parentOf(this.parentOf(z)));
                }
            }
            else {      // same stuff as above, but z's parent is a left child
                let y = this.leftOf(this.parentOf(this.parentOf(z)));
                if (this.colorOf(y) === Color.RED) {
                    this.addStep(
                        AnimationType.COMPARE,
                        z.id,
                        `Uncle ${y!.val} is red, recoloring`,
                        y!.id,
                        undefined
                    );
                    
                    this.setColorOf(this.parentOf(z), Color.BLACK);
                    this.setColorOf(y, Color.BLACK);
                    
                    this.addStep(
                        AnimationType.RECOLOR,
                        z.parent!.id,
                        `Recolor parent ${z.parent!.val} to black`, undefined,
                        Color.BLACK
                    );
                    this.addStep(
                        AnimationType.RECOLOR,
                        y!.id, `Recolor uncle ${y!.val} to black`,
                        undefined, Color.BLACK
                    );
                    
                    this.setColorOf(this.parentOf(this.parentOf(z)), Color.RED);
                    this.addStep(
                        AnimationType.RECOLOR,
                        z.parent!.parent!.id,
                        `Recolor grandparent ${z.parent!.parent!.val} to red`,
                        undefined, Color.RED
                    );
                    
                    z = this.parentOf(this.parentOf(z));
                }
                else {
                    if (z == this.leftOf(this.parentOf(z))) {
                        z = this.parentOf(z);
                        this.rotateRight(z);
                    }
                    this.setColorOf(this.parentOf(z), Color.BLACK);
                    this.addStep(
                        AnimationType.RECOLOR,
                        z!.parent!.id, `Recolor parent ${z!.parent!.val} to black`,
                        undefined, Color.BLACK
                    );
                    
                    this.setColorOf(this.parentOf(this.parentOf(z)), Color.RED);
                    this.addStep(
                        AnimationType.RECOLOR,
                        z!.parent!.parent!.id,
                        `Recolor grandparent ${z!.parent!.parent!.val} to red`,
                        undefined,
                        Color.RED
                    );
                    
                    this.rotateLeft(this.parentOf(this.parentOf(z)));
                }
            }
        }
        // Restores black root property.
        // This method is called ONLY after insertion. so there's no way the root will be null
        this.root!.color = Color.BLACK;
        this.addStep(
            AnimationType.RECOLOR,
            this.root!.id,
            `Ensure root ${this.root!.val} is black`,
            undefined,
            Color.BLACK
        );
    }
    
    /**
    * Searches for specified value in the red black tree. If any error occurs, the error string is returned.
    * If value is found, the value is returned, with no error string.
    * @param val The value to be searched
    * @returns A return value and an error string
    */
    search(val: number) : {ret: number, err: string} {
        if (!this.root) return {ret: 0, err: "Tree is empty"};
        let tmp: RedBlackNode | null = this.root;
        while (tmp) {
            this.addStep(
                AnimationType.COMPARE,
                tmp.id,
                `Comparing ${val} with ${tmp.val}`,
                val,
                undefined
            )
            if (tmp.val === val) break;
            else if (tmp.val > val) tmp = tmp.left;
            else tmp = tmp.right;
        }
        if (!tmp) {
            this.addStep(
                AnimationType.NOT_FOUND,
                val,
                `${val} not found in tree`,
            );
            return {ret: 0, err: "Value not found"};  
        }
        this.addStep(
            AnimationType.FOUND,
            val,
            `Found ${val}!`,
        )
        
        return {ret: tmp.val, err: ""};
    }
    
    /**
    * Makes a string representation of the tree and returns it. If no elements are present, simply
    * returns "Empty".
    * @returns The string representation.
    */
    toString() : string {
        if (!this.root) return "Empty";
        return RedBlackTree.printWithTabs(this.root, '', true);
    }
    /**
    * Cooks up a really cool string representation of the tree. And before you slander me for ripping this straight off
    * of Leetcode's homepage, hear me out when I say that I did not directly copy paste the code. Yes, I copypasted the
    * special characters and took a miniscule peek at the code, but otherwise I had to tear my hair off trying to think
    * of how to even generate this output. 10/10 experience, would recommend.
    * @param node The current node which is to be displayed.
    * @param prefix The string to be prepended before the node's string representation.
    * @param isLeft Whether the current child is a left node or not.
    * @returns A really cool string representation.
    */
    private static printWithTabs(node: RedBlackNode | null, prefix: string, isLeft: boolean) : string {
        if (!node) return '';
        
        let retstr = '';
        if (node.right) {
            /*
            A random question, but have you ever seen the time series plot of a damped pendulum? Or the graphically represented
            solution of a damped oscillation, whatever. This kinda works similarly: if the isLeft toggles between 2 recursive
            calls, 2 of these bars are printed. So for n toggles, n bars are printed. And the cool part is, when the toggling
            stops, the bars stop printing. Kinda like that damped oscillation thing, yea, if you start from the root and
            keep toggling till the leaf.
            
            TL;DR: The nodes which converge towards the center will have the maximum bars printed behind
            them.
            */
            let pref = prefix + (isLeft ? "│      " : "       ");
            retstr += this.printWithTabs(node.right, pref, false);
        }
        retstr += `${prefix}${isLeft ? '└───' : '┌───'} ${node.toString()}\n`;
        if (node.left) {
            let pref = prefix + (isLeft ? "       " : "│      ");
            retstr += this.printWithTabs(node.left, pref, true);
        }
        return retstr;
    }
    
    // Restore tree from snapshot
    restoreFromSnapshot(snapshot: string): void {
        const json = JSON.parse(snapshot);
        this.root = RedBlackNode.fromJSON(json);
    }
    
    toArray(): RedBlackNode[] {
        const nodes: RedBlackNode[] = [];
        const queue: RedBlackNode[] = [];
        
        if (this.root) {
            queue.push(this.root);
        }
        
        while (queue.length > 0) {
            const node = queue.shift()!;
            nodes.push(node);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        return nodes;
    }
}