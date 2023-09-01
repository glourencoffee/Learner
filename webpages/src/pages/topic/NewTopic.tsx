import TopicForm, { TopicFormValues } from '../../components/TopicForm';
import SuccessAlertAction from '../../components/SuccessAlertAction';
import { createTopic } from '../../api/topic';

function renderSuccessAlertAction(newTopicId: number): JSX.Element {
  const viewUrl = `/topic/${newTopicId}`;
  const editUrl = `/topic/${newTopicId}/edit`;

  return (
    <SuccessAlertAction
      viewUrl={viewUrl}
      editUrl={editUrl}
    />
  );
}

export default function NewTopic(): JSX.Element {

  async function handleSubmit(values: TopicFormValues): Promise<number> {
    const newTopicId = await createTopic(values.areaId, values.topicName);
    return newTopicId;
  }

  function renderSuccessAlertText(): string {
    return 'Created new topic successfully!';
  }
  
  return (
    <TopicForm
      variant='creation'
      onSubmit={handleSubmit}
      successAlert={{
        closable: true,
        renderText: renderSuccessAlertText,
        renderAction: renderSuccessAlertAction
      }}
    />
  );
}