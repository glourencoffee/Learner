import KnowledgeAreaForm, {
  KnowledgeAreaFormValues
} from '../../components/KnowledgeAreaForm';
import SuccessAlertAction from '../../components/SuccessAlertAction';
import { createKnowledgeArea } from '../../api/knowledgeArea';

function renderSuccessAlertAction(newAreaId: number): JSX.Element {
  const viewUrl = `/knowledgearea/${newAreaId}`;
  const editUrl = `/knowledgearea/${newAreaId}/edit`;

  return (
    <SuccessAlertAction
      viewUrl={viewUrl}
      editUrl={editUrl}
    />
  );
}

export default function NewKnowledgeArea(): JSX.Element {
  
  async function handleSubmit(values: KnowledgeAreaFormValues): Promise<number> {
    const newAreaId = await createKnowledgeArea(values);
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