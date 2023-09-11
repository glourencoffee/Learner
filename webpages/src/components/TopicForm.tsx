import Form, { FormAlertProps } from './Form';
import TextField from './TextField';
import { useEffect, useState } from 'react';
import ProgressBackdrop from './ProgressBackdrop';
import { Link, Stack, Typography } from '@mui/material';
import KnowledgeAreaTreeSelect, {
  KnowledgeAreaTreeNode,
  KnowledgeAreaTreeRootNode
} from './KnowledgeAreaTreeSelect';

export interface TopicFormValues {
  topicName: string;
  areaId: number;
}

export interface TopicFormProps<SubmitResult> {
  /**
   * Whether the form is used in creation or edition mode.
   */
  variant: 'creation' | 'edition';

  /**
   * This prop is forwarded to the prop `successAlert` of the underling `<Form>`.
   */
  successAlert?: FormAlertProps<SubmitResult>;

  /**
   * An optional default topic.
   */
  defaultValues?: TopicFormValues;

  onSubmit?: (values: TopicFormValues) => SubmitResult | Promise<SubmitResult>;
}

/**
 * Replaces the field `areaId` from `TopicFormValues` with an `areaNode` field,
 * which is a `KnowledgeAreaTreeNode`.
 */
interface TopicFormValuesWithNode extends Omit<TopicFormValues, 'areaId'> {
  areaNode: KnowledgeAreaTreeNode;
}

interface TopicFormWithRootProps<SubmitResult> extends
  Omit<
    TopicFormProps<SubmitResult>,
    'defaultValues'
  >
{
  root: KnowledgeAreaTreeRootNode;
  defaultValues: TopicFormValuesWithNode;
}

function TopicFormWithRoot<SubmitResult>({
  variant,
  defaultValues,
  ...props
}: TopicFormWithRootProps<SubmitResult>): JSX.Element {

  function validate({ topicName, areaNode }: TopicFormValuesWithNode): void | object {

    if ((variant                 === 'edition') &&
        (areaNode.id             === defaultValues.areaNode.id) &&
        (topicName.toLowerCase() === defaultValues.topicName.toLowerCase()))
    {
      // On edition mode, a topic may be submitted even if nothing changed,
      // that is, its current values are equal to the default values received
      // when the form was created. So, let the user submit it unchanged if
      // they so want.
      return;
    }

    if (areaNode.isRoot()) {
      const errorMessage = 'An area must be selected.';

      return {
        areaNode: errorMessage
      }
    }

    // Check if there are any name collisions.
    switch (areaNode.getChildType(topicName)) {
      case 'area':
        return {
          topicName: `"${areaNode.name}" has a child area with this name, so a topic cannot use it.`
        };
      
      case 'topic':
        return {
          topicName: `"${areaNode.name}" already has a child topic with this name.`
        };
    }
  }

  let handleSubmit;

  const { onSubmit } = props;

  if (onSubmit !== undefined) {
    handleSubmit = function({ topicName, areaNode }: TopicFormValuesWithNode):
      SubmitResult | Promise<SubmitResult> {

      return onSubmit({
        topicName,
        areaId: areaNode.id
      });
    };
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
      <KnowledgeAreaTreeSelect
        formField
        root={props.root}
        name='areaNode'
        label='Area'
        helperText='Select a knowledge area'
        showPath
      />
      <TextField
        formField
        name='topicName'
        label='Name'
        helperText='Enter the name of the topic'
        placeholder='e.g. Variables and Constants'
      />
    </Form>
  )
}

interface TopicFormState {
  root: KnowledgeAreaTreeRootNode;
  defaultValues: TopicFormValuesWithNode;
}

export default function TopicForm<SubmitResult>({
  defaultValues,
  ...props
}: TopicFormProps<SubmitResult>): React.ReactNode {

  const [state, setState] = useState<TopicFormState>();

  useEffect(() => {
    const root = new KnowledgeAreaTreeRootNode({ getChildren: 'area-only' });

    const topicName = defaultValues?.topicName ?? '';
    const areaId    = defaultValues?.areaId    ?? null;

    console.log('areaID:', areaId);

    async function fetchAndSetState(): Promise<void> {
      let areaNode;

      if (areaId === null) {
        areaNode = root;
      }
      else {
        const result = await root.getChild((node) => node.id === areaId);
        areaNode = result ?? root;
      }

      await areaNode.getChildren();

      console.log('areaNode:', areaNode);

      setState({
        root,
        defaultValues: {
          topicName,
          areaNode
        }
      })
    }

    fetchAndSetState();
  }, []);

  if (state === undefined) {
    return <ProgressBackdrop open />;
  }
  else if (!state.root.hasChildren()) {
    return (
      <Stack
        height='100%'
        alignItems='center'
        justifyContent='center'
      >
        <Typography variant='h4'>
          There exists no knowledge areas yet.
        </Typography>
        <Typography variant='h5'>
          Go <Link href='/knowledgearea/new'>create</Link> some first
          and then come back to this page.
        </Typography>
      </Stack>
    );
  }
  else {
    return (
      <TopicFormWithRoot
        root={state.root}
        defaultValues={state.defaultValues}
        {...props}
      />
    );
  }
}