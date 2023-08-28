import { Suspense } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import usePromise from 'react-promise-suspense';
import KnowledgeAreaForm from '../../components/KnowledgeAreaForm';
import ProgressBackdrop from '../../components/ProgressBackdrop';
import { KnowledgeArea } from '../../models/KnowledgeArea';
import { getKnowledgeArea, updateKnowledgeArea } from '../../requests/knowledgeArea';

function renderSuccessAlertAction(areaId: number): JSX.Element {
  const viewUrl = `/knowledgearea/${areaId}`;

  return (
    <Stack direction='row'>
      <Button href={viewUrl}>
        View
      </Button>
    </Stack>
  );
}

function renderEditKnowledgeAreaForm(areaId: number): JSX.Element {
  const defaultArea = usePromise(getKnowledgeArea, [areaId]);

  async function handleSubmit(area: KnowledgeArea): Promise<void> {
    await updateKnowledgeArea(area);
  }

  function renderSuccessAlertText(): string {
    return 'Updated new knowledge area successfully!';
  }

  return (
    <KnowledgeAreaForm
      variant='edition'
      defaultArea={defaultArea}
      onSubmit={handleSubmit}
      successAlert={{
        closable: true,
        renderText: renderSuccessAlertText,
        renderAction: () => renderSuccessAlertAction(areaId)
      }}
    />
  );
}

export default function EditKnowledgeArea(): JSX.Element {
  const params = useParams();
  const areaId = parseInt(params.areaId ?? '');

  if (isNaN(areaId)) {
    return <Navigate to='/' />;
  }

  return (
    <Suspense fallback={<ProgressBackdrop open />}>
      {renderEditKnowledgeAreaForm(areaId)}
    </Suspense>
  );
}