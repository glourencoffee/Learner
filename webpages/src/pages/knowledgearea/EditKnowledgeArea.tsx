import { Suspense, useMemo } from 'react';
import { Navigate, Params, useParams } from 'react-router-dom';
import KnowledgeAreaForm, { KnowledgeAreaFormValues } from '../../components/KnowledgeAreaForm';
import ProgressBackdrop from '../../components/ProgressBackdrop';
import SuccessAlertAction from '../../components/SuccessAlertAction';
import { getKnowledgeArea, updateKnowledgeArea } from '../../api/knowledgeArea';
import { ResourceOf, createResource } from '../../requests/createResource';

interface ValidatedParams {
  areaId: number | null;
}

function validateParams(params: Readonly<Params<string>>): ValidatedParams {
  const { areaId } = params;

  return {
    areaId: parseInt(areaId ?? '') || null
  };
}

function renderSuccessAlertAction(areaId: number): JSX.Element {
  const viewUrl = `/knowledgearea/${areaId}`;

  return <SuccessAlertAction viewUrl={viewUrl} />;
}

interface EditKnowledgeAreaResultProps {
  resource: ResourceOf<typeof getKnowledgeArea>;
}

function EditKnowledgeAreaResult({ resource }: EditKnowledgeAreaResultProps): JSX.Element {
  const defaultArea = resource.data.read();

  async function handleSubmit(values: KnowledgeAreaFormValues): Promise<void> {
    await updateKnowledgeArea({
      ...values,
      id: defaultArea.id
    });
  }

  function renderSuccessAlertText(): string {
    return 'Updated new knowledge area successfully!';
  }

  return (
    <KnowledgeAreaForm
      variant='edition'
      defaultValues={defaultArea}
      onSubmit={handleSubmit}
      successAlert={{
        closable: true,
        renderText: renderSuccessAlertText,
        renderAction: () => renderSuccessAlertAction(defaultArea.id)
      }}
    />
  );
}

export default function EditKnowledgeArea(): JSX.Element {
  const { areaId } = validateParams(useParams());
  
  const resource = useMemo(
    () => (
      (areaId === null)
      ? null
      : createResource(getKnowledgeArea(areaId))
    ),
    [areaId]
  );

  if (resource === null) {
    return <Navigate to='/' />;
  }
  else {
    return (
      <Suspense fallback={<ProgressBackdrop open />}>
        <EditKnowledgeAreaResult resource={resource} />
      </Suspense>
    );
  }
}