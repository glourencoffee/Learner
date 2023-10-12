import { Suspense, useEffect, useState } from 'react';
import { Navigate, Params, useLocation, useParams } from 'react-router-dom';
import { ResourceOf, createResource } from '../../requests';
import { getQuestion, updateQuestion } from '../../api';
import {
  QuestionForm,
  QuestionFormValues,
  QuestionFormSkeleton,
  SuccessAlertAction
} from '../../components';

interface ValidatedParams {
  questionId: number | null;
}

function validateParams(params: Readonly<Params<string>>): ValidatedParams {
  const { questionId } = params;

  return {
    questionId: parseInt(questionId ?? '') || null
  };
}

type QuestionResource = ResourceOf<typeof getQuestion>;

function renderSuccessAlertAction(newQuestionId: number): JSX.Element {
  const viewUrl = `/question/${newQuestionId}`;

  return (
    <SuccessAlertAction
      viewUrl={viewUrl}
    />
  );
}

interface EditQuestionResultProps {
  resource: QuestionResource;
}

function EditQuestionResult({ resource }: EditQuestionResultProps): JSX.Element {
  const { id, options, ...rest } = resource.data.read();

  const defaultValues: QuestionFormValues = {
    ...rest,
    options: options.map((option) => option.text)
  };

  async function handleSubmit(values: QuestionFormValues): Promise<void> {
    await updateQuestion({
      id,
      ...values
    });
  }

  return (
    <QuestionForm
      variant='edition'
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      successAlert={{
        closable: true,
        renderText: () => 'Updated question successfully',
        renderAction: () => renderSuccessAlertAction(id)
      }}
    />
  );
}

export default function EditQuestion(): JSX.Element {
  const location = useLocation();
  const params   = validateParams(useParams());

  function createQuestionResource(): QuestionResource | null {
    const { questionId } = params;

    return (
      questionId === null
      ? null
      : createResource(getQuestion(questionId, { isEdition: true }))
    );
  }

  const [questionResource, setQuestionResource] = useState(createQuestionResource);

  useEffect(() => setQuestionResource(createQuestionResource), [location]);

  if (questionResource === null) {
    return <Navigate to='/' />;
  }

  return (
    <Suspense fallback={<QuestionFormSkeleton />}>
      <EditQuestionResult resource={questionResource} />
    </Suspense>
  );
}