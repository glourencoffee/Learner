import {
  Button,
  Chip,
  Collapse,
  Divider,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import {
  DifficultyLevel,
  QuestionType,
  QuestionWithoutId,
  getQuestionType
} from '../models/Question';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import QuestionOption, {
  QuestionOptionColor
} from './QuestionOption';
import {
  blue,
  green,
  brown,
  teal,
  pink
} from '@mui/material/colors';
import TopicChip from './TopicChip';

interface ChipBoxProps {
  questionType: QuestionType;
  difficultyLevel: DifficultyLevel;
  topicIds: number[];
}

/**
 * Renders a box of MUI `<Chip>`s. Useful for showing various question
 * data that can be thought of as "tags," namely:
 * - The question type
 * - The question's difficulty level
 * - The topics associated with the question.
 */
function ChipBox({
  questionType,
  difficultyLevel,
  topicIds
}: ChipBoxProps): JSX.Element {
  const topicElements = topicIds.map(
    (topicId) => (
      <TopicChip
        key={topicId}
        topicId={topicId}
        size='small'
        sx={{
          color: teal[50],
          backgroundColor: teal[600]
        }}
      />
    )
  );

  let difficultyLevelChipStyle;

  switch (difficultyLevel) {
    case DifficultyLevel.EASY:
      difficultyLevelChipStyle = {
        color: green[50],
        backgroundColor: green[700]
      };

      break;

    case DifficultyLevel.MEDIUM:
      difficultyLevelChipStyle = {
        color: blue[50],
        backgroundColor: blue[700]
      };

      break;

    case DifficultyLevel.HARD:
      difficultyLevelChipStyle = {
        color: brown[50],
        backgroundColor: brown[500]
      };

      break;
  }

  return (
    <Stack
      direction='row'
      flexWrap='wrap'
      gap='0.5em'
      alignItems='center'
      marginBottom='1em'
    >
      <Chip
        size='small'
        label={questionType}
        sx={{
          color: pink[50],
          backgroundColor: pink[800]
        }}
      />
      <Chip
        size='small'
        label={difficultyLevel}
        sx={difficultyLevelChipStyle}
      />
      {topicElements}
    </Stack>
  );
}

interface QuestionBoxProps {
  questionId?: number;
  questionText: string;
}

/**
 * Renders the question's text. This is actual "question" or the statements
 * to be evaluated by the person who's solving the question.
 */
const QuestionBox = ({ questionId, questionText }: QuestionBoxProps) =>
(
  <Stack>
    <Typography variant='h5' color='primary.dark'>
      {
        (questionId) === undefined
        ? 'Question'
        : 'Question #' + questionId
      }
    </Typography>
    <ReactMarkdown>
      {questionText}
    </ReactMarkdown>
  </Stack>
);

interface AnswerBoxProps {
  options: string[];
  correctOptionIndex: number;
  selectedOptionIndex?: number;
  answered: boolean;
  onOptionClick?: (index: number) => void;
}

/**
 * Renders a box of answer options, allowing for the user to
 * select which one they think is correct.
 */
function AnswerBox({
  options,
  correctOptionIndex,
  selectedOptionIndex,
  answered,
  onOptionClick
}: AnswerBoxProps): JSX.Element {

  function renderOption(optionText: string, index: number): JSX.Element {
    let optionColor: QuestionOptionColor | undefined;
    
    if (index === selectedOptionIndex) {
      if (!answered) {
        optionColor= 'selected';
      }
      else if (index === correctOptionIndex) {
        optionColor = 'correct';
      }
      else {
        optionColor = 'incorrect';
      }
    }

    const label = (
      <Typography>
        {optionText}
      </Typography>
    );

    return (
      <QuestionOption
        key={nanoid()}
        label={label}
        index={index}
        color={optionColor}
        backgroundColor={optionColor || 'default'}
        disabled={answered}
        onClick={() => onOptionClick?.(index)}
      />
    );
  }

  const optionElements = options.map(renderOption);

  return (
    <Stack sx={{ width: '100%' }}>
      <Typography variant='h5' color='primary.dark'>
        Answer
      </Typography>
      <Stack gap='0.2em' marginTop='1em'>
        {optionElements}
      </Stack>
    </Stack>
  );
}

interface ButtonBoxProps {
  mainButton: {
    text?: string;
    disabled?: boolean;
    onClick?: () => void;
  };
  explanationButton: {
    visible?: boolean;
    onClick?: () => void;
  };
}

/**
 * Renders a box of two buttons, layed out horizontally.
 * 
 * One button is called the *main button* and is always shown.
 * It is used to effectively answer the question, or to retry
 * answering.
 * 
 * The other button is called the *explanation button* and is
 * used to trigger an explanation box, which contains an explanation.
 * 
 * This component does not define the buttons logic, but simply
 * renders them.
 */
const ButtonBox = ({ mainButton, explanationButton }: ButtonBoxProps) =>
(
  <Stack
    alignSelf='center'
    direction='row'
    gap='0.5em'
  >
    <Button
      variant='contained'
      disabled={mainButton.disabled}
      onClick={mainButton.onClick}
    >
      {mainButton.text}
    </Button>
    <Collapse
      orientation='horizontal'
      in={explanationButton.visible}
      timeout={700}
    >
      <Button onClick={explanationButton.onClick}>
        Explain
      </Button>
    </Collapse>
  </Stack>
);

interface ExplanationBoxProps {
  text: string;
  visible?: boolean;
}

/**
 * Renders a box where an explanation text is shown.
 */
const ExplanationBox = ({ text, visible }: ExplanationBoxProps) =>
(
  <Collapse
    in={visible}
    sx={{ width: '100%' }}
  >
    <Stack>
      <Divider />
      <Typography
        marginTop='0.25em'
        variant='h5'
        color='primary.dark'
      >
        Explanation
      </Typography>
      <ReactMarkdown>
        {text}
      </ReactMarkdown>
    </Stack>
  </Collapse>
);

interface QuestionState {
  answered: boolean;
  selectedOptionIndex?: number;
  isExplaining?: boolean;
}

export interface QuestionProps extends QuestionWithoutId {
  /**
   * An optional id of a question.
   * 
   * If this prop is not `undefined`, it will be rendered
   * with other question data.
   * 
   * @default undefined
   */
  id?: number;
}

/**
 * Renders a component which allows answering a question, based on the given
 * `props`. 
 * 
 * @param props The properties of this component.
 */
export default function Question(props: QuestionProps): JSX.Element {
  const question = props;

  const [state, setState] = useState<QuestionState>({
    answered: false
  });
  
  function handleOptionClick(index: number): void {
    if (!state.answered) {
      setState({...state, selectedOptionIndex: index});
    }
  }

  function handleMainButtonClick(): void {
    if (state.answered) {
      setState({
        answered: false,
        selectedOptionIndex: undefined,
        isExplaining: false
      });
    }
    else {
      setState({...state, answered: true});
    }
  }

  function handleExplanationButtonClick(): void {
    setState({...state, isExplaining: true});
  }

  const mainButtonDisabled = !state.answered && state.selectedOptionIndex === undefined;
  const mainButtonText = (state.answered) ? 'Retry' : 'Answer';

  let explanationBoxVisible;
  let explanationButtonVisible;

  if (state.isExplaining && question.explanationText.length > 0) {
    explanationBoxVisible = true;
  }
  else if (state.answered && question.explanationText.length > 0) {
    explanationButtonVisible = true;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: '1em',
        padding: '1em'
      }}
    >
      <ChipBox
        questionType={getQuestionType(question.options)}
        difficultyLevel={question.difficultyLevel}
        topicIds={question.topicIds}
      />
      <QuestionBox
        questionId={question.id}
        questionText={question.questionText}
      />
      <AnswerBox
        options={question.options}
        correctOptionIndex={question.correctOptionIndex}
        selectedOptionIndex={state.selectedOptionIndex}
        answered={state.answered}
        onOptionClick={handleOptionClick}
      />
      <ButtonBox
        mainButton={{
          text: mainButtonText,
          disabled: mainButtonDisabled,
          onClick: handleMainButtonClick
        }}
        explanationButton={{
          visible: explanationButtonVisible,
          onClick: handleExplanationButtonClick
        }}
      />
      <ExplanationBox
        text={question.explanationText}
        visible={explanationBoxVisible}
      />
    </Paper>
  );
}