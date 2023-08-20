import * as request from './request';
import * as schemas from '../schemas/knowledgeArea';

interface GetTopLevelKnowledgeAreaArgs {
  nameFilter?: string;
}

type GetTopLevelKnowledgeAreaResult = Array<{
  id: number;
  name: string;
}>

export async function getTopLevelKnowledgeAreas(
  args: GetTopLevelKnowledgeAreaArgs
): Promise<GetTopLevelKnowledgeAreaResult> {
  
  const queryParams = args;
  
  const result = await request.get(
    schemas.getTopLevelKnowledgeAreaSchema,
    '/knowledgearea/toplevel',
    {
      queryParams
    }
  );

  return result.areas;
}