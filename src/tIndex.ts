// Type definitions for the Reingold-Tilford Algorithm

/**
 * Represents a Node in the binary tree.
 * llink, rlink, and thread are modified by the setup and petrify procedures.
 */
class Node {
  // Pointers to children (or thread targets if 'thread' is true)
  llink: Node | null = null;
  rlink: Node | null = null;

  // Final coordinates (xcoord is relative offset until petrify is called)
  xcoord: number = 0;
  ycoord: number = 0;

  /**
   * Distance:
   * 1. Distance between children (in non-leaf nodes).
   * 2. Distance to the thread target (in threaded leaf nodes).
   */
  offset: number = 0;

  // Indicates if rlink/llink is a thread to an extreme descendant on the next level.
  thread: boolean = false;
  
  // Custom property to hold the node's name for easy identification in the output
  name: string = ''; 

  constructor(name: string = '') {
    this.name = name;
  }
}

/**
 * Represents an Extreme Descendant (Leftmost or Rightmost) on the lowest level
 * reached so far in a subtree. Used to construct contours.
 */
class Extreme {
  // Pointer to the extreme node itself.
  addr: Node | null = null;
  
  /**
   * Offset from the root of the current (sub)tree to this extreme node.
   * Positive for rightward, negative for leftward.
   */
  off: number = 0;
  
  // The depth level of the extreme node.
  lev: number = -1;
}

// Global constant for minimum separation between nodes (Pascal: CONST minsep)
const minsep: number = 2;

// ----------------------------------------------------------------------------
// 1. SETUP PROCEDURE (The Reingold-Tilford Core)
// ----------------------------------------------------------------------------

/**
 * Recursively calculates the relative x-offsets and sets up threads for the tree.
 * Note: TypeScript/JavaScript passes objects (Node and Extreme) by reference, 
 * which directly mimics Pascal's VAR parameters for 'rmost' and 'lmost'.
 */
function setup(
  t: Node | null,
  level: number,
  rmost: Extreme,
  lmost: Extreme
): void {
  if (t === null) {
    lmost.lev = -1;
    rmost.lev = -1;
    return;
  }

  t.ycoord = level;

  let l: Node | null = t.llink;
  let r: Node | null = t.rlink;

  // lr, ll, rr, rl are temporary Extreme structures passed to recursive calls.
  // Must be initialized as new objects since they act like VAR parameters.
  const lr = new Extreme();
  const ll = new Extreme();
  const rr = new Extreme();
  const rl = new Extreme();

  setup(l, level + 1, lr, ll);
  setup(r, level + 1, rr, rl);

  if (r === null && l === null) {
    // Leaf node case
    rmost.addr = t;
    lmost.addr = t;
    rmost.lev = level;
    lmost.lev = level;
    rmost.off = 0;
    lmost.off = 0;
    t.offset = 0;
  } else {
    // t not a leaf
    let cursep: number = minsep; // Current horizontal offset between l and r's contours
    let rootsep: number = minsep; // Accumulated separation applied at the root
    let loffsum: number = 0; // Accumulated offset from t.llink (left root) to current l
    let roffsum: number = 0; // Accumulated offset from t.rlink (right root) to current r

    // Contour traversal loop
    while (l !== null && r !== null) {
      if (cursep < minsep) {
        // Push apart
        rootsep = rootsep + (minsep - cursep);
        cursep = minsep;
      }

      // Advance l down the right contour of the left subtree
      if (l.rlink !== null) {
        loffsum += l.offset;
        cursep -= l.offset;
        l = l.rlink;
      } else {
        // Follow thread (or llink if no thread)
        loffsum -= l.offset;
        cursep += l.offset;
        l = l.llink;
      }

      // Advance r down the left contour of the right subtree
      if (r.llink !== null) {
        roffsum -= r.offset;
        cursep -= r.offset;
        r = r.llink;
      } else {
        // Follow thread (or rlink if no thread)
        roffsum += r.offset;
        cursep += r.offset;
        r = r.rlink;
      }
    } // WHILE

    // Set the relative offset of t based on the total separation found
    t.offset = Math.floor((rootsep + 1) / 2); // Pascal's DIV 2 is floor division

    // Update accumulated offsets for l and r relative to t
    loffsum -= t.offset;
    roffsum += t.offset;

    // Update extreme descendants information relative to t

    // Leftmost extreme (lmost) is either the leftmost of the right subtree (rl) 
    // or the leftmost of the left subtree (ll), whichever is deepest.
    if (rl.lev > ll.lev || t.llink === null) {
      lmost.addr = rl.addr;
      lmost.off = rl.off + t.offset;
      lmost.lev = rl.lev;
    } else {
      lmost.addr = ll.addr;
      lmost.off = ll.off - t.offset;
      lmost.lev = ll.lev;
    }

    // Rightmost extreme (rmost) is either the rightmost of the left subtree (lr)
    // or the rightmost of the right subtree (rr), whichever is deepest.
    if (lr.lev > rr.lev || t.rlink === null) {
      rmost.addr = lr.addr;
      rmost.off = lr.off - t.offset;
      rmost.lev = lr.lev;
    } else {
      rmost.addr = rr.addr;
      rmost.off = rr.off + t.offset;
      rmost.lev = rr.lev;
    }

    // Threading logic
    // l will be non-null if the right subtree was shorter
    if (l !== null && l !== t.llink && rr.addr !== null) {
      // Thread from the rightmost node of the left subtree's right contour (rr.addr)
      rr.addr.thread = true;
      
      // Calculate thread distance (offset)
      rr.addr.offset = Math.abs((rr.off + t.offset) - loffsum);
      
      // Assign thread target (l) to llink or rlink
      if (loffsum - t.offset <= rr.off) {
        rr.addr.llink = l;
      } else {
        rr.addr.rlink = l;
      }
    } 
    // r will be non-null if the left subtree was shorter
    else if (r !== null && r !== t.rlink && ll.addr !== null) {
      // Thread from the leftmost node of the right subtree's left contour (ll.addr)
      ll.addr.thread = true;
      
      // Calculate thread distance (offset)
      ll.addr.offset = Math.abs((ll.off - t.offset) - roffsum);
      
      // Assign thread target (r) to llink or rlink
      if (roffsum + t.offset >= ll.off) {
        ll.addr.rlink = r;
      } else {
        ll.addr.llink = r;
      }
    }
  } // IF t not a leaf
} // PROCEDURE setup

// ----------------------------------------------------------------------------
// 2. PETRIFY PROCEDURE
// ----------------------------------------------------------------------------

/**
 * Converts the relative horizontal offsets (t.offset) into absolute x-coordinates (t.xcoord).
 * Also cleans up the temporary thread pointers and flags.
 */
function petrify(t: Node | null, xpos: number): void {
  if (t === null) {
    return;
  }

  t.xcoord = xpos;

  if (t.thread) {
    // Reset thread state after use
    t.thread = false;
    t.rlink = null;
    t.llink = null;
    t.offset = 0;
  } else {
    // Recurse using the calculated offset
    petrify(t.llink, xpos - t.offset);
    petrify(t.rlink, xpos + t.offset);
  }
} // PROCEDURE petrify

// ----------------------------------------------------------------------------
// 3. TEST PROGRAM
// ----------------------------------------------------------------------------

// Instantiate the nodes for the test tree
const n1 = new Node('n1');
const n2 = new Node('n2');
const n3 = new Node('n3');
const n4 = new Node('n4');
const n5 = new Node('n5');

function init_test_tree(): void {
  // Tree structure:
  //      n3
  //      / \
  //     /   \
  //    n1    n5
  //     \   /
  //      n2 n4
  
  n3.llink = n1;
  n3.rlink = n5;

  n1.llink = null;
  n1.rlink = n2; // n2 is the right child of n1

  n5.llink = n4; // n4 is the left child of n5
  n5.rlink = null;

  n2.llink = null;
  n2.rlink = null;

  n4.llink = null;
  n4.rlink = null;
}

function print_coords(t: Node): void {
  console.log(`Coordinates of ${t.name}:`);
  console.log(`X: ${t.xcoord}`);
  console.log(`Y: ${t.ycoord}`);
}

// --- Main Program Execution ---
function main() {
  init_test_tree();
  
  // lm and rm are just holders for the root's extreme descendants
  const lm = new Extreme();
  const rm = new Extreme();

  // 1. Calculate relative offsets and Y-coordinates (depth)
  setup(n3, 0, lm, rm);

  // 2. Convert relative offsets to absolute X-coordinates
  petrify(n3, 0);

  // 3. Print Results
  console.log('--- Reingold-Tilford Algorithm Output ---');
  print_coords(n3);
  print_coords(n1);
  print_coords(n5);
  print_coords(n2);
  print_coords(n4);
  console.log('-----------------------------------------');
}

main();