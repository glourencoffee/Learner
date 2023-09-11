import { createQuestion } from '../../api/question';
import QuestionForm, {
  QuestionFormValues
} from '../../components/QuestionForm';
import SuccessAlertAction from '../../components/SuccessAlertAction';

function renderSuccessAlertAction(newQuestionId: number): JSX.Element {
  const viewUrl = `/question/${newQuestionId}`;
  const editUrl = `/quedtion/${newQuestionId}/edit`;

  return (
    <SuccessAlertAction
      viewUrl={viewUrl}
      editUrl={editUrl}
    />
  );
}

export default function NewQuestion(): JSX.Element {
  async function handleSubmit(values: QuestionFormValues): Promise<number> {
    const newQuestionId = await createQuestion(values);
    return newQuestionId;
  }

  return (
    <QuestionForm
      variant='creation'
      onSubmit={handleSubmit}
      successAlert={{
        closable: true,
        renderText: () => 'Created question successfully',
        renderAction: renderSuccessAlertAction
      }}
    />
  );
}