import { Navigate, Params, useLocation, useParams } from 'react-router-dom';
import { Question as QuestionModel } from '../../models';
import { Resource, createResource } from '../../requests/createResource';
import { Suspense, useMemo } from 'react';
import { getQuestion } from '../../api/question';
import QuestionSkeleton from '../../components/QuestionSkeleton';
import { Stack } from '@mui/material';
import Question from '../../components/Question';

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

  return <Question {...question} />;
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