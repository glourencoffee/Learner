import { Suspense,  useState } from 'react';
import { Button, Divider, Stack, Typography } from '@mui/material';
import Question from '../../components/Question';
import QuestionSkeleton from '../../components/QuestionSkeleton';
import DifficultyLevelSelect from '../../components/DifficultyLevelSelect';
import QuestionTypeSelect from '../../components/QuestionTypeSelect';
import Fieldset from '../../components/Fieldset';
import TextField from '../../components/TextField';
import TopicListSelect from '../../components/TopicListSelect';
import {
  DifficultyLevel,
  Question as QuestionModel,
  QuestionOption,
  QuestionType
} from '../../models';
import { GetQuestionsOptions, getQuestions } from '../../api/question';
import { Resource, createResource } from '../../requests/createResource';
import { createAnswer } from '../../api/answer';

interface SearchBoxValues {
  questionText: string;
  questionTypes: Set<QuestionType>;
  difficultyLevels: Set<DifficultyLevel>;
  topicIds: number[];
}

interface SearchBoxProps {
  onSearch?: (values: SearchBoxValues) => void;
}

function SearchBox({ onSearch }: SearchBoxProps): JSX.Element {
  const [values, setValues] = useState<SearchBoxValues>(() => ({
    questionText: '',
    questionTypes: new Set(Object.values(QuestionType)),
    difficultyLevels: new Set(Object.values(DifficultyLevel)),
    topicIds: []
  }));

  const {
    questionText,
    questionTypes,
    difficultyLevels,
    topicIds
  } = values;

  function handleQuestionTextChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    setValues({
      ...values,
      questionText: event.target.value
    });
  }

  function handleQuestionTypeChange(questionTypes: Set<QuestionType>): void {
    setValues({
      ...values,
      questionTypes
    });
  }

  function handleDifficultyLevelChange(difficultyLevels: Set<DifficultyLevel>): void {
    setValues({
      ...values,
      difficultyLevels
    });
  }

  function handleAddTopic(topicId: number): void {
    if (topicIds.includes(topicId)) {
      return;
    }

    setValues({
      ...values,
      topicIds: [...topicIds, topicId]
    });
  }

  function handleRemoveTopic(removedTopicId: number): void {
    setValues({
      ...values,
      topicIds: topicIds.filter((topicId) => topicId !== removedTopicId)
    });
  }

  const searchDisabled = (
    (questionTypes.size    === 0) ||
    (difficultyLevels.size === 0)
  );

  return (
    <Stack gap='1em' flexWrap='wrap'>
      <Stack direction='row' gap='1em' flexWrap='wrap'>
        <Fieldset label='Question type'>
          <QuestionTypeSelect
            value={questionTypes}
            onChange={handleQuestionTypeChange}
          />
        </Fieldset>
        <Fieldset label='Difficulty level'
        >
          <DifficultyLevelSelect
            value={difficultyLevels}
            onChange={handleDifficultyLevelChange}
          />
        </Fieldset>
        <TextField
          label='Question text'
          labelPosition='inside'
          multiline
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{
            maxLength: 200
          }}
          value={questionText}
          onChange={handleQuestionTextChange}
        />
      </Stack>
      <Stack>
        <Fieldset
          label='Topics'
          fullWidth
          disablePadding
        >
          <TopicListSelect
            topicIds={topicIds}
            onAddTopic={handleAddTopic}
            onRemoveTopic={handleRemoveTopic}
          />
        </Fieldset>
      </Stack>
      <Button
        sx={{
          alignSelf: 'center'
        }}
        disabled={searchDisabled}
        onClick={() => onSearch?.(values)}
      >
        Search
      </Button>
    </Stack>
  );
}

type QuestionArrayResource = Resource<QuestionModel[]>;

interface ResultProps {
  resource: QuestionArrayResource;
}

function Result({ resource }: ResultProps): JSX.Element {
  const questions = resource.data.read();

  async function handleAnswer(option: QuestionOption): Promise<boolean> {
    const result = await createAnswer(option.id);
    return result.isCorrectOption;
  }

  const questionElements = questions.map(
    (question) => (
      <Question
        key={question.id}
        {...question}
        onAnswer={handleAnswer}
      />
    )
  );

  if (questionElements.length > 0) {
    return (
      <Stack gap='1em'>
        {questionElements}
      </Stack>
    );
  }
  else {
    return (
      <Stack
        marginTop='5em'
        alignItems='center'
        justifyContent='center'
      >
        <Typography variant='h5'>
          No questions found.
        </Typography>
      </Stack>
    );
  }
}

export default function ViewQuestions(): JSX.Element {
  const [resource, setResource] = useState<QuestionArrayResource>(
    () => createResource(getQuestions())
  );

  function handleSearch({
    questionText,
    questionTypes,
    difficultyLevels,
    topicIds
  }: SearchBoxValues): void {
    const options: GetQuestionsOptions = {};

    if (questionText.length > 0) {
      options.questionText = questionText;
    }

    if (questionTypes.size === 1) {
      options.questionType = [...questionTypes][0];
    }

    if (difficultyLevels.size > 0) {
      options.difficultyLevels = [...difficultyLevels];
    }

    if (topicIds.length > 0) {
      options.topicIds = topicIds;
    }

    const newResource = createResource(getQuestions(options));
    setResource(newResource);
  }

  return (
    <Stack
      padding='1em'
      gap='1em'
    >
      <SearchBox onSearch={handleSearch} />
      <Divider />
      <Suspense fallback={<QuestionSkeleton />}>
        <Result resource={resource} />
      </Suspense>
    </Stack>
  );
}