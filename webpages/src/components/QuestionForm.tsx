import {
  Box,
  Button,
  Collapse,
  IconButton,
  MenuItem,
  Stack
} from '@mui/material';
import { RemoveCircle } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import { useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import {
  ArrayHelpers,
  FieldArray,
  useField,
  useFormikContext
} from 'formik';
import Form, { FormProps } from './Form';
import TextField from './TextField';
import {
  DifficultyLevel,
  QuestionWithoutId
} from '../models';
import Question from './Question';
import QuestionOption from './QuestionOption';
import Fieldset from './Fieldset';
import TopicListSelect from './TopicListSelect';

export interface QuestionFormValues 
         extends QuestionWithoutId {}

function OptionsField(): JSX.Element {
  const formik = useFormikContext<QuestionFormValues>();

  const { options, correctOptionIndex } = formik.values;

  function renderOption(arrayHelpers: ArrayHelpers<string[]>,
                        option: string,
                        index: number): JSX.Element
  {
    const removeButtonAdornment = (
      <IconButton
        tabIndex={-1}
        size='small'
        sx={{ color: red[600] }}
        disabled={options.length <= 2}
        onClick={() => arrayHelpers.remove(index)}
      >
        <RemoveCircle />
      </IconButton>
    );

    let placeholder;

    switch (index) {
      case 0: placeholder = 'e.g. Orange and blueberries';    break;
      case 1: placeholder = 'e.g. Apple and banana';          break;
      case 2: placeholder = 'e.g. Strawberry and watermelon'; break;
      case 3: placeholder = 'e.g. Lemon and pineapple';       break;
      case 4: placeholder = 'e.g. Grapes and avocado';        break;
    }

    const labelElement = (
      <TextField
        variant='standard'
        fullWidth
        placeholder={placeholder}
        value={option}
        onChange={(event) => arrayHelpers.replace(index, event.target.value)}
        InputProps={{
          endAdornment: removeButtonAdornment
        }}
        inputProps={{
          maxLength: 500
        }}
      />
    );

    const color = (
      (index === correctOptionIndex)
      ? 'correct'
      : 'incorrect'
    );

    function handleClick(): void {
      formik.setFieldValue('correctOptionIndex', index);
    }

    return (
      <QuestionOption
        key={index}
        index={index}
        label={labelElement}
        color={color}
        onClick={handleClick}
      />
    );
  }

  function renderGroup(arrayHelpers: ArrayHelpers<string[]>): JSX.Element {
    const optionElements = options.map(
      (option, index) => (
        <Collapse key={index}>
          {renderOption(arrayHelpers, option, index)}
        </Collapse>
      )
    );

    let addOptionButton;

    if (options.length < 5) {
      addOptionButton = (
        <Button
          onClick={() => arrayHelpers.push('')}
        >
          Add option
        </Button>
      );
    }

    const error = formik.errors.options as string;

    return (
      <Fieldset
        label='Answer Options'
        labelPosition='outside'
        helperText={error || 'Create answer options and select the correct answer.'}
        error={Boolean(error)}
      >
        <TransitionGroup component={null}>
          {optionElements}
        </TransitionGroup>
        {addOptionButton}
      </Fieldset>
    );
  }

  return (
    <FieldArray
      name='options'
      render={renderGroup}
    />
  );
}

function TopicsField(): JSX.Element {
  const [field, meta] = useField<number[]>('topicIds');

  const topicIds = field.value;
  const error    = meta.error;

  function renderGroup(arrayHelpers: ArrayHelpers<number[]>): JSX.Element {
    return (
      <Fieldset
        label='Topics'
        labelPosition='outside'
        helperText={error || 'Select the associated topics.'}
        error={Boolean(error)}
        disablePadding
      >
        <TopicListSelect
          topicIds={topicIds}
          onAddTopic={(topicId) => arrayHelpers.push(topicId)}
          onRemoveTopic={(_, index) => arrayHelpers.remove(index)}
        />
      </Fieldset>
    );
  }

  return (
    <FieldArray
      name='topicIds'
      render={renderGroup}
    />
  );
}

function EditModeQuestionForm(): JSX.Element {  
  return (
    <Stack gap='1em'>
      <TextField
        formField
        fullWidth
        name='questionText'
        label='Question Text'
        placeholder='e.g. Select the option which lists only round fruits'
        helperText='Enter a text that appears when answering the question.'
        multiline
        minRows={1}
        maxRows={10}
        inputProps={{
          maxLength: 2000
        }}
      />
      <OptionsField />
      <TextField
        formField
        name='difficultyLevel'
        label='Difficulty Level'
        helperText='Select a difficulty level.'
        select
      >
        <MenuItem value={DifficultyLevel.EASY}>
          Easy
        </MenuItem>
        <MenuItem value={DifficultyLevel.MEDIUM}>
          Medium
        </MenuItem>
        <MenuItem value={DifficultyLevel.HARD}>
          Hard
        </MenuItem>
      </TextField>
      <TopicsField />
      <TextField
        formField
        name='explanationText'
        label='Explanation Text'
        helperText='Enter a text that explains the answer to the question.'
        multiline
        minRows={4}
        maxRows={10}
        inputProps={{
          maxLength: 2000
        }}
      />
    </Stack>
  );
}

function ViewModeQuestionForm(): JSX.Element {
  const formik = useFormikContext<QuestionFormValues>();

  return (
    <Stack gap='1em'>
      <Question {...formik.values} />
    </Stack>
  );
}

function validateForm({
  questionText,
  options,
  topicIds
}: QuestionFormValues): void | object {

  if (questionText.length === 0) {
    return {
      questionText: 'You must inform the question text.'
    };
  }

  for (const option of options) {
    if (option.length === 0) {
      return {
        options: 'An option must not be empty.'
      };
    }
  }

  if (topicIds.length === 0) {
    return {
      topicIds: 'A question must have at least one topic.'
    };
  }
}

interface UnusedFormProps<SubmitResult>
  extends Omit<
    FormProps<QuestionFormValues, SubmitResult>,
    'initialValues' |
    'validate'      |
    'renderSubmit'
  > {}

export interface QuestionFormProps<SubmitResult>
         extends UnusedFormProps<SubmitResult>
{
  /**
   * Whether the form is used for creation or edition.
   */
  variant: 'creation' | 'edition';

  /**
   * Default form values.
   */
  defaultValues?: QuestionFormValues;
}

/**
 * Renders a `<Form>` for creating or editing a question.
 * 
 * @param props The properties of this component.
 * @returns 
 */
export default function QuestionForm<SubmitResult>({
  variant,
  defaultValues,
  ...formProps
}: QuestionFormProps<SubmitResult>): JSX.Element {

  const [mode, setMode] = useState<'edit' | 'view'>('edit');

  const initialValues = defaultValues ?? {
    questionText: '',
    options: ['', ''],
    correctOptionIndex: 0,
    explanationText: '',
    difficultyLevel: DifficultyLevel.MEDIUM,
    topicIds: []
  };

  function handleModeButtonClick(): void {
    if (mode === 'edit') {
      setMode('view');
    }
    else {
      setMode('edit');
    }
  }

  function renderSubmit(): JSX.Element {
    const modeButtonText = (mode === 'edit') ? 'Preview' : 'Edit';

    return (
      <Stack
        alignSelf='center'
        direction='row'
        gap='0.5em'
      >
        <Button onClick={handleModeButtonClick}>
          {modeButtonText}
        </Button>
        <Button
          type='submit'
          disabled={mode === 'view'}
        >
          {variant === 'creation' ? 'Create' : 'Save'}
        </Button>
      </Stack>
    );
  }

  return (
    <Form
      {...formProps}
      initialValues={initialValues}
      validate={validateForm}
      renderSubmit={renderSubmit}
    >
      <Box display={mode === 'edit' ? 'block' : 'none'}>
        <EditModeQuestionForm />
      </Box>
      <Box display={mode === 'view' ? 'block' : 'none'}>
        <ViewModeQuestionForm />
      </Box>
    </Form>
  );
}