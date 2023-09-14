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
  QuestionOption as QuestionOptionModel,
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

type AnswerStatus = 'unanswered' | 'correct-answered' | 'incorrect-answered';

interface AnswerBoxProps {
  options: QuestionOptionModel[];
  selectedOption?: QuestionOptionModel;
  answerStatus: AnswerStatus;
  onOptionClick?: (option: QuestionOptionModel) => void;
}

/**
 * Renders a box of answer options, allowing for the user to
 * select which one they think is correct.
 */
function AnswerBox({
  options,
  selectedOption,
  answerStatus,
  onOptionClick
}: AnswerBoxProps): JSX.Element {

  function renderOption(option: QuestionOptionModel, index: number): JSX.Element {
    let optionColor: QuestionOptionColor | undefined;
    
    if (option === selectedOption) {
      switch (answerStatus) {
        case 'unanswered':
          optionColor = 'selected';
          break;
       
        case 'correct-answered':
          optionColor = 'correct';
          break;
          
        case 'incorrect-answered':
          optionColor = 'incorrect';
          break;
      }
    }

    const label = (
      <Typography>
        {option.text}
      </Typography>
    );

    return (
      <QuestionOption
        key={nanoid()}
        label={label}
        index={index}
        color={optionColor}
        backgroundColor={optionColor || 'default'}
        disabled={answerStatus !== 'unanswered'}
        onClick={() => onOptionClick?.(option)}
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
  answerStatus: AnswerStatus;
  selectedOption?: QuestionOptionModel;
  isExplaining?: boolean;
}

export interface QuestionProps extends Omit<QuestionWithoutId, 'correctOptionIndex'> {
  /**
   * An optional id of a question.
   * 
   * If this prop is not `undefined`, it will be rendered
   * with other question data.
   * 
   * @default undefined
   */
  id?: number;

  /**
   * A callback function called when the answer button is clicked.
   * 
   * @param option The option currently selected.
   * @param index The index of the option currently selected.
   * @returns `true` if the selected option is correct, and `false` otherwise.
   */
  onAnswer?: (option: QuestionOptionModel, index: number) => boolean | Promise<boolean>;
}

/**
 * Renders a component which allows answering a question, based on the given
 * `props`. 
 * 
 * @param props The properties of this component.
 */
export default function Question(props: QuestionProps): JSX.Element {
  const { onAnswer, ...question} = props;

  const [state, setState] = useState<QuestionState>({
    answerStatus: 'unanswered'
  });

  const optionTexts  = question.options.map((option) => option.text);
  const questionType = getQuestionType(optionTexts);
  
  function handleOptionClick(option: QuestionOptionModel): void {
    if (state.answerStatus === 'unanswered') {
      setState({...state, selectedOption: option});
    }
  }

  function handleMainButtonClick(): void {
    if (state.answerStatus !== 'unanswered') {
      setState({
        answerStatus: 'unanswered',
        selectedOption: undefined,
        isExplaining: false
      });
    }
    else if (state.selectedOption && onAnswer) {
      const selectedOptionIndex = question.options.indexOf(state.selectedOption);
      const result = onAnswer(state.selectedOption, selectedOptionIndex);

      Promise.resolve(result)
        .then(
          (isCorrectAnswer) => setState({
            ...state,
            answerStatus: (
              isCorrectAnswer
              ? 'correct-answered'
              : 'incorrect-answered'
            )
          })
        );
    }
  }

  function handleExplanationButtonClick(): void {
    setState({...state, isExplaining: true});
  }

  const mainButtonDisabled = (
    state.answerStatus === 'unanswered' &&
    state.selectedOption === undefined
  );
  const mainButtonText = (state.answerStatus === 'unanswered') ? 'Answer' : 'Retry';

  let explanationBoxVisible;
  let explanationButtonVisible;

  if (state.isExplaining && question.explanationText.length > 0) {
    explanationBoxVisible = true;
  }
  else if (state.answerStatus !== 'unanswered' && question.explanationText.length > 0) {
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
        questionType={questionType}
        difficultyLevel={question.difficultyLevel}
        topicIds={question.topicIds}
      />
      <QuestionBox
        questionId={question.id}
        questionText={question.questionText}
      />
      <AnswerBox
        options={question.options}
        selectedOption={state.selectedOption}
        answerStatus={state.answerStatus}
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