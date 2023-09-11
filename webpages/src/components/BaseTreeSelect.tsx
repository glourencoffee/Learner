import {
  AutocompleteRenderInputParams,
  CircularProgress,
  InputAdornment,
  TextFieldVariants
} from '@mui/material';
import { TreeSelect as MuiTreeSelect } from 'mui-tree-select';
import TextField from './TextField';
import { TextFieldLabelPositions } from './BaseTextField';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';

/**
 * Represents a node of `<TreeSelect>`.
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

export interface BaseTreeSelectProps {
  /**
   * The root node of this tree.
   */
  root: TreeNode;

  /**
   * The variant of the `<TextField>` used as the input select.
   * 
   * @default undefined
   */
  variant?: TextFieldVariants;

  /**
   * The name of the HTML element.
   * 
   * @default undefined
   */
  name?: string;

  /**
   * The label to be shown on the `<TextField>`.
   * 
   * @default undefined
   */
  label?: string;

  /**
   * The position of the `<TextField>`'s label.
   * 
   * @default undefined
   */
  labelPosition?: TextFieldLabelPositions;

  /**
   * A helper text for `<TextField>`.
   * 
   * @default undefined
   */
  helperText?: string;

  /**
   * Whether to pass an `error` prop to `<TextField>` elements.
   */
  error?: boolean;

  /**
   * Whether the text displayed on `<TextField>` should be the complete path
   * of the current node.
   * 
   * @default false
   * @see `Node.getPath()`
   */
  showPath?: boolean;

  /**
   * A string used to separate branches.
   * 
   * This applies both to `showPath` and the tool icon on the left side
   * of the `<TextField>`, which always shows the complete path of the
   * selected node when hovered.
   * 
   * @default ' / '
   */
  branchSeparator?: string;

  /**
   * The currently selected tree node (controlled).
   * 
   * @default undefined
   */
  value?: TreeNode;

  /**
   * A callback function which is called when the selected node changes.
   * 
   * @param node The selected tree node.
   * @remarks Call `node.isRoot()` to check if the root node was selected.
   * @default undefined
   */
  onChange?: (node: TreeNode) => void;

  /**
   * A callback function to determine if a node should be disabled.
   * 
   * All nodes are enabled by default.
   * 
   * @param node A tree node.
   * @default undefined
   */
  isNodeDisabled?: (node: TreeNode) => boolean;

  /**
   * Returns whether a branch is selectable.
   * 
   * All branches are selectable by default.
   * 
   * @param node A tree node.
   * @default undefined
   */
  isBranchSelectable?: (node: TreeNode) => boolean;
};

interface TreeSelectState {
  rootNode: TreeNode;
  selectedNode: TreeNode | 'loading';
}

/**
 * Renders a `mui-tree-select`'s `<TreeSelect>`.
 * 
 * This component extends `mui-tree-select`'s `<TreeSelect>` to simplify
 * its usage with the class `TreeNode`.
 */
export default function BaseTreeSelect(props: BaseTreeSelectProps): JSX.Element {
  //==================
  // State
  //==================
  const [state, setState] = useState<TreeSelectState>(
    () => ({
      rootNode: props.root,
      selectedNode: 'loading'
    })
  );

  useEffect(() => {
    state.rootNode.getChildren()
      .then(() => setState({
        ...state,
        selectedNode: props.value ?? state.rootNode
      }));
  }, [props.value]);

  //=========================
  // Tree handling functions 
  //=========================

  /**
   * This function converts a node from `mui-tree-select`'s `<TreeSelect>`
   * to this component's node. This conversion is necessary because
   * `mui-tree-select` doesn't have a root node object, but rather uses
   * the value `null` to represent root.
   * 
   * On the other hand, this component does have a root object, so it
   * needs to map `mui-tree-select`'s `null` to `state.rootNode`, which
   * is exactly what this function does.
   * 
   * @param node A node or `mui-tree-select`'s root (`null`).
   * @returns A local node.
   */
  function toLocalNode(node: TreeNode | null): TreeNode {
    return (node == null) ? state.rootNode : node;
  }

  /**
   * This function does the reverse of `toLocalNode()`. It maps a node
   * of this component to a node that may be used by `mui-tree-select`.
   * 
   * If `node` is either `null` or the root node, returns `null`.
   * Otherwise, returns `node`.
   * 
   * @param node A local node.
   * @returns A node to be used with `mui-tree-select`.
   */
  function fromLocalNode(node: TreeNode | null): TreeNode | null {
    return (node?.isRoot()) ? null : node;
  }

  async function getNodeChildren(node: TreeNode | null): Promise<TreeNode[] | null> {
    return toLocalNode(node).getChildren();
  }

  function getNodeParent(node: TreeNode): TreeNode | null {
    return fromLocalNode(node.getParent());
  }

  function handleNodeChange(node: TreeNode | null): void {
    const localNode = toLocalNode(node);

    setState({
      ...state,
      selectedNode: localNode
    });

    props.onChange?.(localNode);
  }

  //===========
  // Rendering
  //===========
  function renderInput(params: AutocompleteRenderInputParams): React.ReactNode {
    
    if (state.selectedNode === 'loading') {
      params.InputProps.startAdornment = (
        <InputAdornment position='end'>
          <CircularProgress size='1em' />
        </InputAdornment>
      );
    }
    else if (props.showPath && !state.selectedNode.isRoot()) {
      params.inputProps.value = state.selectedNode.getPath(props.branchSeparator);
    }

    const InputProps = {
      ...params.InputProps,
      error: props.error
    };

    const InputLabelProps = {
      ...params.InputLabelProps,
      error: props.error
    };

    params.inputProps.readOnly = true;

    return (
      <TextField
        {...params}
        variant={props.variant}
        name={props.name}
        label={props.label}
        labelPosition={props.labelPosition}
        helperText={props.helperText}

        InputProps={InputProps}
        InputLabelProps={InputLabelProps}
        FormHelperTextProps={{
          error: props.error
        }}
      />
    );
  }

  let disabled;
  let value;

  if (state.selectedNode === 'loading') {
    disabled = true;
    value    = null;  
  }
  else {
    disabled = !state.rootNode.hasChildren();
    value    = fromLocalNode(state.selectedNode);
  }

  return (
    <MuiTreeSelect
      fullWidth
      disabled={disabled}
      getChildren={getNodeChildren}
      getParent={getNodeParent}
      getOptionDisabled={props.isNodeDisabled}
      isBranchSelectable={props.isBranchSelectable ?? (() => true)}
      renderInput={renderInput}
      branchDelimiter={props.branchSeparator}
      openOnFocus
      value={value}
      onChange={(_, node) => handleNodeChange(node)}
    />
  );
}