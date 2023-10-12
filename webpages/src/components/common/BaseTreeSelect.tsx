import { useEffect, useState } from 'react';
import {
  AutocompleteRenderInputParams,
  CircularProgress,
  InputAdornment,
  TextFieldVariants
} from '@mui/material';
import { TreeSelect as MuiTreeSelect } from 'mui-tree-select';
import { TreeNode } from '../../models';
import {
  TextFieldLabelPositions,
  TextField
} from '../../components';

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