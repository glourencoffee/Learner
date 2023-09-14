import { Navigate, Params, useLocation, useParams } from 'react-router-dom';
import { getQuestion, updateQuestion } from '../../api/question';
import QuestionForm, {
  QuestionFormValues
} from '../../components/QuestionForm';
import QuestionFormSkeleton from '../../components/QuestionFormSkeleton';
import SuccessAlertAction from '../../components/SuccessAlertAction';
import { Suspense, useEffect, useState } from 'react';
import { ResourceOf, createResource } from '../../requests/createResource';

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
  const { id, ...defaultValues } = resource.data.read();

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