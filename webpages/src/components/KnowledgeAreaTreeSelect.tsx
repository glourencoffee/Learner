import TreeSelect, { TreeSelectProps, TreeSelectWithFormFieldProps, TreeSelectWithoutFormFieldProps } from './TreeSelect';
import { TreeNode } from './BaseTreeSelect';
import {
  getChildrenOfKnowledgeArea,
  getTopLevelKnowledgeAreas
} from '../requests/knowledgeArea';

type BasePredicateType = (child: TreeNode) => boolean;

/**
 * Represents a node in the knowledge area tree.
 */
export class KnowledgeAreaTreeNode extends TreeNode {
  public readonly id: number;
  public readonly name: string;
  public readonly type?: 'area' | 'topic';

  constructor(id: number, name: string, type?: 'area' | 'topic') {
    super();

    this.id   = id;
    this.name = name;
    this.type = type;
  }
  
  /**
   * Reimplements `fetchChildren()` to fetch knowledge areas
   * which are children of `this`.
   * 
   * @returns Child knowledge area nodes.
   */
  async fetchChildren(): Promise<TreeNode[]> {
    const children = await getChildrenOfKnowledgeArea(this.id);

    return children.map((child) => new KnowledgeAreaTreeNode(child.id, child.name, child.type));
  }

  /**
   * Reimplements `getChildren()` with type semantics of `KnowledgeAreaTreeNode`.
   */
  async getChildren(): Promise<KnowledgeAreaTreeNode[] | null> {
    if (this.type !== 'area') {
      return null;
    }
    
    const children = await super.getChildren() as KnowledgeAreaTreeNode[] | null;

    if (children === null) {
      return null;
    }

    const filteredChildren = children.filter((child) => child.type === 'area');

    return (filteredChildren.length > 0) ? filteredChildren : null;
  }

  /**
   * Reimplements `getChild()` with type semantics of `KnowledgeAreaTreeNode`.
   */
  async getChild(
    predicate: (child: KnowledgeAreaTreeNode) => boolean,
    recursive: boolean = true
  ): Promise<KnowledgeAreaTreeNode | null> {
    return super.getChild(
      predicate as BasePredicateType,
      recursive
    ) as Promise<KnowledgeAreaTreeNode | null>;
  }

  /**
   * Reimplements `hasChild()` with type semantics of `KnowledgeAreaTreeNode`.
   */
  hasChild(predicate: (child: KnowledgeAreaTreeNode) => boolean): boolean {
    return super.hasChild(predicate as BasePredicateType);
  }

  /**
   * Reimplements `findChild()` with type semantics of `KnowledgeAreaTreeNode`.
   */
  findChild(predicate: (child: KnowledgeAreaTreeNode) => boolean): KnowledgeAreaTreeNode | undefined {
    return super.findChild(predicate as BasePredicateType) as KnowledgeAreaTreeNode;
  }

  /**
   * Returns whether `this` has any cached child with name `name`.
   * 
   * @param name A name.
   * @returns Whether `this` has a cached child with `name`.
   */
  hasChildAreaWithName(name: string): boolean {
    return this.hasChild((child) => child.type === 'area' && child.name.toLowerCase() === name.toLowerCase());
  }

  hasChildTopicWithName(name: string): boolean {
    return this.hasChild((child) => child.type === 'topic' && child.name.toLowerCase() === name.toLowerCase());
  }

  getChildType(name: string): 'area' | 'topic' | undefined {
    const child = this.findChild((child) => child.name.toLowerCase() === name.toLowerCase());
    return child?.type;
  }

  /**
   * @returns `this.name`
   */
  toString(): string {
    return this.name;
  }
}

/**
 * Represents the root node.
 */
export class KnowledgeAreaTreeRootNode extends KnowledgeAreaTreeNode {
  constructor() {
    super(NaN, 'Root');
  }

  /**
   * Reimplements `fetchChildren()` to fetch top-level knowledge areas.
   * 
   * @returns Top-level knowledge area nodes.
   */
  async fetchChildren(): Promise<TreeNode[]> {
    const topLevelAreas = await getTopLevelKnowledgeAreas();
    return topLevelAreas.map((area) => new KnowledgeAreaTreeNode(area.id, area.name, 'area'));
  }

  async getChildren(): Promise<KnowledgeAreaTreeNode[] | null> {
    return TreeNode.prototype.getChildren.call(this) as Promise<KnowledgeAreaTreeNode[] | null>;
  }
}

interface KnowledgeAreaTreeSelectSharedProps {
  root: KnowledgeAreaTreeRootNode;
  isNodeDisabled?: (node: KnowledgeAreaTreeNode) => boolean;
} 

type KnowledgeAreaTreeSelectWithFormFieldProps = ( 
  Omit<
    TreeSelectWithFormFieldProps,
    'root' | 'isNodeDisabled'
  >
)

interface KnowledgeAreaTreeSelectWithoutFormFieldProps extends 
  Omit<
    TreeSelectWithoutFormFieldProps,
    'root'           |
    'isNodeDisabled' |
    'onChange'       |
    'value'
  >
{
  value?: KnowledgeAreaTreeNode;
  onChange?: (node: KnowledgeAreaTreeNode) => boolean;
}

type KnowledgeAreaTreeSelectProps = (
  KnowledgeAreaTreeSelectSharedProps & (
    KnowledgeAreaTreeSelectWithFormFieldProps |
    KnowledgeAreaTreeSelectWithoutFormFieldProps
  )
)

/**
 * Extends `<TreeSelect>` to add type semantics for `KnowledgeAreaTreeNode`.
 * 
 * `props.root` must be of type `KnowledgeAreaTreeRootNode`.
 * 
 * @param props The properties of this component.
 */
export default function KnowledgeAreaTreeSelect(props: KnowledgeAreaTreeSelectProps): JSX.Element {
  if (props.formField) {
    const { isNodeDisabled, ...rest } = props;

    return (
      <TreeSelect
        {...rest}
        isNodeDisabled={isNodeDisabled as TreeSelectProps['isNodeDisabled']}
      />
    );
  }
  else {
    const { onChange, isNodeDisabled, ...rest } = props;

    return (
      <TreeSelect
        {...rest}
        isNodeDisabled={isNodeDisabled as TreeSelectProps['isNodeDisabled']}
        onChange={onChange as TreeSelectWithoutFormFieldProps['onChange']}
      />
    );
  }
}