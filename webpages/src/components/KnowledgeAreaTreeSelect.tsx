import TreeSelect, { TreeSelectProps, TreeSelectWithFormFieldProps, TreeSelectWithoutFormFieldProps } from './TreeSelect';
import { TreeNode } from './BaseTreeSelect';
import {
  ChildOfKnowledgeArea,
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
  private topics: ChildOfKnowledgeArea[];

  constructor(id: number, name: string) {
    super();

    this.id   = id;
    this.name = name;
    this.topics = [];
  }
  
  /**
   * Reimplements `fetchChildren()` to fetch knowledge areas
   * which are children of `this`.
   * 
   * @returns Child knowledge area nodes.
   */
  async fetchChildren(): Promise<TreeNode[]> {
    const children = await getChildrenOfKnowledgeArea(this.id);
    const childAreas = [];
    this.topics = [];

    for (const child of children) {
      switch (child.type) {
        case 'area':  childAreas.push(child); break;
        case 'topic': this.topics.push(child); break;
      }
    }

    return childAreas.map((area) => new KnowledgeAreaTreeNode(area.id, area.name));
  }

  /**
   * Reimplements `getChildren()` with type semantics of `KnowledgeAreaTreeNode`.
   */
  async getChildren(): Promise<KnowledgeAreaTreeNode[] | null> {
    return super.getChildren() as Promise<KnowledgeAreaTreeNode[] | null>;
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
   * Returns whether `this` has any cached child with name `name`.
   * 
   * @param name A name.
   * @returns Whether `this` has a cached child with `name`.
   */
  hasChildAreaWithName(name: string): boolean {
    return this.hasChild((child) => child.name.toLowerCase() === name.toLowerCase());
  }

  hasChildTopicWithName(name: string): boolean {
    return this.topics.some((child) => child.name.toLowerCase() === name.toLowerCase());
  }

  getChildType(name: string): 'area' | 'topic' | undefined {
    if (this.hasChildAreaWithName(name)) {
      return 'area';
    }
    else if (this.hasChildTopicWithName(name)) {
      return 'topic';
    }
    else {
      return undefined;
    }
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
    return topLevelAreas.map((area) => new KnowledgeAreaTreeNode(area.id, area.name));
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