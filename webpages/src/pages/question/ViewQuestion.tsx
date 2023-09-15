import { Navigate, Params, useParams } from 'react-router-dom';
import { Question as QuestionModel, QuestionOption } from '../../models';
import { Resource, createResource } from '../../requests/createResource';
import { Suspense, useMemo } from 'react';
import { getQuestion } from '../../api/question';
import QuestionSkeleton from '../../components/QuestionSkeleton';
import { Stack } from '@mui/material';
import Question from '../../components/Question';
import { createAnswer } from '../../api/answer';

interface ValidatedParams {
  questionId: number | null;
}

function validateParams(params: Readonly<Params<string>>): ValidatedParams {
  const { questionId } = params;

  return {
    questionId: parseInt(questionId ?? '') || null
  };
}

interface ViewQuestionResultProps {
  resource: Resource<QuestionModel>;
}

function ViewQuestionResult({ resource }: ViewQuestionResultProps): JSX.Element {
  const question = resource.data.read();

  async function handleAnswer(option: QuestionOption): Promise<boolean> {
    const result = await createAnswer(option.id);
    return result.isCorrectOption;
  }

  return (
    <Question
      {...question}
      onAnswer={handleAnswer}
    />
  );
}

export default function ViewQuestion(): JSX.Element {
  const { questionId } = validateParams(useParams());

  const resource = useMemo(
    () => (
      (questionId === null) 
      ? null
      : createResource(getQuestion(questionId))
    ),
    [questionId]
  );

  if (resource === null) {
    return <Navigate to='/' />;
  }
  else {
    return (
      <Stack padding='1em'>
        <Suspense fallback={<QuestionSkeleton />}>
          <ViewQuestionResult resource={resource} />
        </Suspense>
      </Stack>
    );
  }
}