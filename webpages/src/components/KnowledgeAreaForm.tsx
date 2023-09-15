import { useEffect, useState } from 'react';
import Form, { FormAlertProps } from './Form';
import TextField from './TextField';
import { KnowledgeAreaWithoutId } from '../models';
import ProgressBackdrop from './ProgressBackdrop';
import KnowledgeAreaTreeSelect, {
  KnowledgeAreaTreeNode,
  KnowledgeAreaTreeRootNode
} from './KnowledgeAreaTreeSelect';

export interface KnowledgeAreaFormValues
         extends KnowledgeAreaWithoutId
{
  id?: number;
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
  defaultValues?: KnowledgeAreaFormValues;

  /**
   * This prop is forwarded to the prop `successAlert` of the underling `<Form>`.
   */
  successAlert?: FormAlertProps<T>;
  
  /**
   * A callback function called when the form is submitted.
   * 
   * @param values The values of this form.
   * @return A value to be forwarded to the prop `onSubmit` of the underlying `<Form>`.
   */
  onSubmit?: (values: KnowledgeAreaFormValues) => T | Promise<T>;
}

interface KnowledgeAreaFormValuesWithNode extends Omit<KnowledgeAreaFormValues, 'parentId'> {
  parent: KnowledgeAreaTreeNode
}

interface KnowledgeAreaFormWithRootProps<T>
  extends Omit<KnowledgeAreaFormProps<T>, 'defaultValues'>
{
  root: KnowledgeAreaTreeRootNode;
  defaultValues: KnowledgeAreaFormValuesWithNode;
}

function KnowledgeAreaFormWithRoot<T>(props: KnowledgeAreaFormWithRootProps<T>): JSX.Element {
  //==================
  // Props
  //==================
  const {
    root,
    variant,
    defaultValues,
    onSubmit
  } = props;

  //=================
  // Form validation
  //=================

  function isNodeDisabled(node: KnowledgeAreaTreeNode): boolean {
    if (variant === 'edition') {
      // Do not let a node select itself as a parent if this
      // form is on edition mode.
      return node.id == defaultValues.id;
    }
    else {
      // If a form is on creation mode, it can never select
      // itself as a parent because it does not exist yet.
      return false;
    }
  }

  function validate({ name, parent }: KnowledgeAreaFormValuesWithNode): void | object {

    if ((variant === 'edition') &&
        (parent === defaultValues.parent) &&
        (name.toLowerCase() === defaultValues.name.toLowerCase()))
    {
      // On edition mode, an area may be submitted even if nothing changed,
      // that is, its current values are equal to the default values received
      // when the form was created. So, let the user submit it unchanged if
      // they so want.
      return;
    }

    // Check if there are any name collisions.
    switch (parent.getChildType(name)) {
      case 'area':
        const errorMessage = (
          parent.isRoot()
          ? 'There already exists a top-level area matching this name.'
          : 'There already exists an area matching this name under this parent.'
        );
      
        return {
          name: errorMessage
        };
      
      case 'topic':
        return {
          name: `"${parent.name}" has a child topic with this name, so an area cannot use it.`
        };
    }
  }

  let handleSubmit;

  if (onSubmit !== undefined) {
    handleSubmit = ({ parent, ...restValues }: KnowledgeAreaFormValuesWithNode) => (
      onSubmit({
        // When parent is root, use null, because root nodes have NaN as id.
        parentId: parent.isRoot() ? null : parent.id,
        ...restValues
      })
    );
  }

  //==================
  // Rendering
  //==================
  const buttonText = (variant === 'creation') ? 'Create' : 'Save';

  return (
    <Form
      initialValues={defaultValues}
      validate={validate}
      buttonText={buttonText}
      successAlert={props.successAlert}
      onSubmit={handleSubmit}
    >
      <TextField
        formField
        name='name'
        label='Name'
        helperText='Enter the name of the knowledge area'
        placeholder='e.g. Computer Science'
      />
      <KnowledgeAreaTreeSelect
        formField
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
  defaultValues: KnowledgeAreaFormValuesWithNode;
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
  defaultValues,
  ...props
}: KnowledgeAreaFormProps<T>): React.ReactNode {

  const [state, setState] = useState<KnowledgeAreaFormState>();

  useEffect(() => {
    const root = new KnowledgeAreaTreeRootNode({ getChildren: 'area-only' });

    const id       = defaultValues?.id;
    const name     = defaultValues?.name     ?? '';
    const parentId = defaultValues?.parentId ?? null;
    
    if (parentId === null) {
      setState({
        root,
        defaultValues: {
          id,
          name,
          parent: root
        }
      });
    }
    else {
      root.getChild((node) => node.id === parentId)
        .then((node) => setState({
          root,
          defaultValues: {
            id,
            name,
            parent: node ?? root
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
        defaultValues={state.defaultValues}
        {...props}
      />
    );
  }
}