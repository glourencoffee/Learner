import { Suspense, useEffect, useState } from 'react';
import { Navigate, Params, useLocation, useParams } from 'react-router-dom';
import { Resource, createResource } from '../../requests';
import { getTopic, updateTopic } from '../../api';
import {
  ProgressBackdrop,
  SuccessAlertAction,
  TopicForm,
  TopicFormValues
} from '../../components';

function renderSuccessAlertAction(areaId: number): JSX.Element {
  const viewUrl = `/topic/${areaId}`;

  return <SuccessAlertAction viewUrl={viewUrl} />;
}

interface EditTopicResultProps {
  resource: Resource<Awaited<ReturnType<typeof getTopic>>>;
}

function EditTopicResult({ resource }: EditTopicResultProps): JSX.Element {
  const defaultTopic = resource.data.read();

  async function handleSubmit(values: TopicFormValues): Promise<void> {
    await updateTopic({
      id:     defaultTopic.id,
      name:   values.topicName,
      areaId: values.areaId
    });
  }

  function renderSuccessAlertText(): string {
    return 'Updated topic successfully!';
  }

  const defaultValues: TopicFormValues = {
    topicName: defaultTopic.name,
    areaId: defaultTopic.areaId
  };

  return (
    <TopicForm
      variant='edition'
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      successAlert={{
        closable: true,
        renderText: renderSuccessAlertText,
        renderAction: () => renderSuccessAlertAction(defaultTopic.id)
      }}
    />
  );
}

interface ValidatedParams {
  topicId: number | null;
}

function validateParams(params: Readonly<Params<string>>): ValidatedParams {
  const { topicId } = params;

  return {
    topicId: parseInt(topicId ?? '') || null
  };
}

export default function EditTopic(): JSX.Element {
  const location = useLocation();
  const params = validateParams(useParams());
  const [topicId, setTopicId] = useState(params.topicId);

  useEffect(() => setTopicId(params.topicId), [location]);

  if (topicId === null) {
    return <Navigate to='/' />;
  }

  const resource = createResource(getTopic(topicId));

  return (
    <Suspense fallback={<ProgressBackdrop open />}>
      <EditTopicResult resource={resource} />
    </Suspense>
  );
}