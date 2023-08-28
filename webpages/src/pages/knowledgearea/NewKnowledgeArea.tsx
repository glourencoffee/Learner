import { Button, Stack } from '@mui/material';
import KnowledgeAreaForm from '../../components/KnowledgeAreaForm';
import { createKnowledgeArea } from '../../requests/knowledgeArea';
import { KnowledgeArea } from '../../models/KnowledgeArea';

function renderSuccessAlertAction(newAreaId: number): JSX.Element {
  const viewUrl = `/knowledgearea/${newAreaId}`;
  const editUrl = `/knowledgearea/${newAreaId}/edit`;

  return (
    <Stack direction='row'>
      <Button href={viewUrl}>
        View
      </Button>
      <Button href={editUrl}>
        Edit
      </Button>
    </Stack>
  );
}

export default function NewKnowledgeArea(): JSX.Element {
  
  async function handleSubmit(area: KnowledgeArea): Promise<number> {
    const newAreaId = await createKnowledgeArea(area);
    return newAreaId;
  }

  function renderSuccessAlertText(): string {
    return 'Created new knowledge area successfully!';
  }
  
  return (
    <KnowledgeAreaForm
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