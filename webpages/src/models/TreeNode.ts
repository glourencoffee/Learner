import { nanoid } from 'nanoid';

/**
 * Represents a node of a tree.
 */
export class TreeNode {
  private key: any;
  private parent: TreeNode | null;
  private children?: TreeNode[];

  /**
   * Creates a node with no parent.
   * 
   * @param key A key used to idenfify the node.
   */
  constructor(key?: any) {
    this.key      = key ?? nanoid();
    this.parent   = null;      // may be re-parented later.
    this.children = undefined; // loaded on the fly
  }

  /**
   * If this node has no parent, returns `null`.
   * Otherwise, returns the parent of this node.
   * 
   * @returns The node's parent.
   */
  getParent(): TreeNode | null {
    return this.parent;
  }

  /**
   * Fetches children of `this` node.
   * 
   * This function should be reimplemented by subclasses for
   * subclass-specific operations for retrieving children.
   * 
   * By default, returns an empty array.
   * 
   * @returns Children fetched asynchronously.
   */
  async fetchChildren(): Promise<TreeNode[]> {
    return [];
  }

  /**
   * If `this` does not have any cached children (default), calls
   * `fetchChildren()` and stores the result into `this`.
   * 
   * Otherwise, returns the cached children of `this` node.
   * 
   * @returns The children of a node, or `null` if node has no children.
   */
  async getChildren(): Promise<TreeNode[] | null> {
    if (this.children === undefined) {
      this.children = await this.fetchChildren();
      this.children.forEach((child) => child.parent = this); 
    }

    return (this.children.length > 0) ? this.children : null;
  }

  /**
   * Returns the first child satisfying a predicate.
   * 
   * Calls `this.getChildren()` and for each `child` in the result,
   * applies `predicate()` until a child satisfies the predicate,
   * that is, `predicate(child) === true`. Then, returns that child.
   * 
   * If `recursive` is true, scans the whole tree hierarchy under
   * `this` branch until a child is found, or the tree is exhausted.
   * 
   * If no child is found, returns `null`.
   * 
   * @param predicate A predicate to apply on a child.
   * @param recursive Whether lookup should be recursive.
   * @returns A child node or `null`.
   */
  async getChild(
    predicate: (child: TreeNode) => boolean,
    recursive: boolean = true
  ): Promise<TreeNode | null> {

    const children = await this.getChildren();

    if (children == null) {
      return null;
    }

    for (const child of children) {      
      if (predicate(child)) {
        return child;
      }

      if (recursive) {
        const grandchild = await child.getChild(predicate, recursive);

        if (grandchild !== null) {
          return grandchild;
        }
      }
    }

    return null;
  }

  /**
   * @returns The number of children cached in `this`.
   */
  childCount(): number {
    return (this.children === undefined) ? 0 : this.children.length;
  }

  /**
   * @returns If `this` has any child cached.
   */
  hasChildren(): boolean {
    return this.childCount() > 0;
  }

  /**
   * Returns whether `this` has any cached child satisfying `predicate`.
   * 
   * @param predicate A predicate to apply on child.
   * @returns Whether `this` has a cached child satisfying a `predicate`.
   */
  findChild(predicate: (child: TreeNode) => boolean): TreeNode | undefined {
    if (this.children === undefined) {
      return undefined;
    }

    return this.children.find(predicate);
  }

  /**
   * Returns whether `this` has any cached child satisfying `predicate`.
   * 
   * @param predicate A predicate to apply on child.
   * @returns Whether `this` has a cached child satisfying a `predicate`.
   */
  hasChild(predicate: (child: TreeNode) => boolean): boolean {
    if (this.children === undefined) {
      return false;
    }

    return this.children.some(predicate);
  }

  /**
   * Returns the path of `this` node, separated from antecessors by `separator`.
   * 
   * @param separator A name separator.
   * @returns The path of `this` node in the tree.
   */
  getPath(separator: string = ' / '): string {
    if (this.parent === null || this.parent.isRoot()) {
      return this.toString();
    }
    else {
      return this.parent.getPath() + separator + this.toString();
    }
  }

  /**
   * @returns The key of this node.
   */
  getKey(): any {
    return this.key;
  }

  /**
   * @returns Whether this node is the root node.
   */
  isRoot(): boolean {
    return this.parent === null;
  }

  /**
   * @returns `this.getKey()` as string.
   */
  toString(): string {
    return String(this.key);
  }
}