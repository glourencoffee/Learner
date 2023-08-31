import { useEffect, useState } from 'react';
import Form, { FormAlertProps } from './Form';
import FormTextField from './FormTextField';
import FormTreeSelect from './FormTreeSelect';
import { TreeNode } from './TreeSelect';
import { KnowledgeArea } from '../models/KnowledgeArea';
import {
  getChildrenOfKnowledgeArea,
  getTopLevelKnowledgeAreas
} from '../requests/knowledgeArea';
import ProgressBackdrop from './ProgressBackdrop';

/**
 * Represents a node in the knowledge area tree.
 */
class KnowledgeAreaTreeNode extends TreeNode {
  public readonly id: number;
  public readonly name: string;

  constructor(id: number, name: string) {
    super();

    this.id   = id;
    this.name = name;
  }

  
  /**
   * Reimplements `fetchChildren()` to fetch knowledge areas
   * which are children of `this`.
   * 
   * @returns Child knowledge area nodes.
   */
  async fetchChildren(): Promise<TreeNode[]> {
    const childAreas = await getChildrenOfKnowledgeArea(this.id, { type: 'area' });
    return childAreas.map((area) => new KnowledgeAreaTreeNode(area.id, area.name));
  }

  /**
   * Returns whether `this` has any cached child with name `name`.
   * 
   * @param name A name.
   * @returns Whether `this` has a cached child with `name`.
   */
  hasChildWithName(name: string): boolean {
    return this.hasChild((child) => {
      const childName = (child as KnowledgeAreaTreeNode).name;
      return childName.toLowerCase() === name.toLowerCase()
    });
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
class KnowledgeAreaTreeRootNode extends KnowledgeAreaTreeNode {
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

/**
 * Extends `Form` for creation and edition of knowledge areas.
 */
export interface KnowledgeAreaFormProps<T> {
  /**
   * The type of form.
   */
  variant: 'creation' | 'edition';

  /**
   * A knowledge area.
   * 
   * This prop is used to set the default values of input fields.
   */
  defaultArea?: KnowledgeArea;

  /**
   * This prop is forwarded to the prop `successAlert` of the underling `<Form>`.
   */
  successAlert?: FormAlertProps<T>;
  
  /**
   * A callback function called when the form is submitted.
   * 
   * @param area The data about the knowledge area stored in this form.
   * @return A value to be forwarded to the prop `onSubmit` of the underlying `<Form>`.
   */
  onSubmit?: (area: KnowledgeArea) => T | Promise<T>;
}

type KnowledgeAreaWithParentNode = (
  Omit<KnowledgeArea, 'parentId'> & {
    parent: KnowledgeAreaTreeNode
  }
);

type KnowledgeAreaFormWithRootProps<T> = (
  Omit<KnowledgeAreaFormProps<T>, 'defaultArea'> & {
    root: KnowledgeAreaTreeRootNode,
    defaultArea: KnowledgeAreaWithParentNode
  }
);

function KnowledgeAreaFormWithRoot<T>(props: KnowledgeAreaFormWithRootProps<T>): JSX.Element {
  //==================
  // Props
  //==================
  const {
    root,
    variant,
    defaultArea,
    onSubmit
  } = props;

  //=================
  // Form validation
  //=================

  function isNodeDisabled(node: TreeNode): boolean {
    if (variant === 'edition') {
      // Do not let a node select itself as a parent if this
      // form is on edition mode.
      return (node as KnowledgeAreaTreeNode).id == defaultArea.id;
    }
    else {
      // If a form is on creation mode, it can never select
      // itself as a parent because it does not exist yet.
      return false;
    }
  }

  function validate({ name, parent }: KnowledgeAreaWithParentNode): void | object {

    if ((variant === 'edition') &&
        (parent === defaultArea.parent) &&
        (name.toLowerCase() === defaultArea.name.toLowerCase()))
    {
      // On edition mode, an area may be submitted even if nothing changed,
      // that is, its current values are equal to the default values received
      // when the form was created. So, let the user submit it unchanged if
      // they so want.
      return;
    }

    // Check if there are any name collisions.
    if (parent.hasChildWithName(name)) {
      const errorMessage = (
        parent.isRoot()
        ? 'There already exists a top-level area matching this name.'
        : 'There already exists an area matching this name under this parent.'
      );
      
      return {
        name: errorMessage
      };
    }
  }

  let handleSubmit;

  if (onSubmit !== undefined) {
    handleSubmit = function(area: KnowledgeAreaWithParentNode): T | Promise<T> {
      const areaModel = new KnowledgeArea(area.id, area.name, area.parent.id);
      return onSubmit(areaModel);
    }
  }

  //==================
  // Rendering
  //==================
  const buttonText = (variant === 'creation') ? 'Create' : 'Save';

  return (
    <Form
      initialValues={defaultArea}
      validate={validate}
      buttonText={buttonText}
      successAlert={props.successAlert}
      onSubmit={handleSubmit}
    >
      <FormTextField
        name='name'
        label='Name'
        helperText='Enter the name of the knowledge area'
        placeholder='e.g. Computer Science'
      />
      <FormTreeSelect
        root={root}
        name='parent'
        label='Parent'
        helperText='Optionally select a parent knowledge area'
        showPath
        isNodeDisabled={isNodeDisabled}
      />
    </Form>
  )
}

interface KnowledgeAreaFormState {
  root: KnowledgeAreaTreeRootNode;
  defaultArea: KnowledgeAreaWithParentNode;
}

/**
 * Renders a `<Form>` for manipulating data of a knowledge area.
 * 
 * This component provides data fields for creating or updating a
 * knowledge area. However, it does not implement such operations,
 * that is, its submitting action is not defined, and should be
 * provided by `props.onSubmit`, which is called when the submit
 * button is triggered.
 * 
 * @param props The properties of this component.
 */
export default function KnowledgeAreaForm<T>({
  defaultArea,
  ...props
}: KnowledgeAreaFormProps<T>): React.ReactNode {

  const [state, setState] = useState<KnowledgeAreaFormState>();

  useEffect(() => {
    const root = new KnowledgeAreaTreeRootNode();

    const id       = defaultArea?.id       ?? NaN;
    const name     = defaultArea?.name     ?? '';
    const parentId = defaultArea?.parentId ?? null;
    
    if (parentId === null) {
      setState({
        root,
        defaultArea: {
          id,
          name,
          parent: root
        }
      });
    }
    else {
      root.getChild((node) => (node as KnowledgeAreaTreeNode).id === parentId)
        .then((node) => setState({
          root,
          defaultArea: {
            id,
            name,
            parent: (node as KnowledgeAreaTreeNode) ?? root
          }
        }));
    }
  }, []);

  if (state === undefined) {
    return <ProgressBackdrop open />;
  }
  else {
    return (
      <KnowledgeAreaFormWithRoot
        root={state.root}
        defaultArea={state.defaultArea}
        {...props}
      />
    );
  }
}