import * as request from './request';
import * as schemas from '../schemas/knowledgeArea';
import { KnowledgeArea } from '../models/KnowledgeArea';

interface GetTopLevelKnowledgeAreaArgs {
  nameFilter?: string;
}

type GetTopLevelKnowledgeAreaResult = Array<{
  id: number;
  name: string;
}>

export async function getTopLevelKnowledgeAreas(
  args: GetTopLevelKnowledgeAreaArgs = {}
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

export async function createKnowledgeArea(area: KnowledgeArea) {
  const path = (
    (area.parentId === null)
    ? '/knowledgearea/toplevel'
    : `/knowledgearea/${area.parentId}`
  );

  const result = await request.post(
    schemas.createKnowledgeAreaSchema,
    path,
    {
      body: {
        name: area.name
      }
    }
  );

  return result.id;
}

export async function getKnowledgeArea(areaId: number) {
  return request.get(
    schemas.getKnowledgeAreaSchema,
    `/knowledgearea/${areaId}`
  );
}

export async function updateKnowledgeArea({ id, name, parentId }: KnowledgeArea): Promise<void> {
  await request.put(
    `/knowledgearea/${id}`,
    {
      body: {
        name,
        parentId
      }
    }
  );
}

interface getChildrenOfKnowledgeAreaOptions {
  nameFilter?: string;
  type?: 'area' | 'topic';
}

interface ChildOfKnowledgeArea {
  id: number,
  name: string,
  type: 'area' | 'topic';
}

export async function getChildrenOfKnowledgeArea(areaId: number, options: getChildrenOfKnowledgeAreaOptions = {}):
  Promise<ChildOfKnowledgeArea[]> {

  const queryParams = {
    nameFilter: Boolean(options.nameFilter) ? options.nameFilter : undefined,
    type: options.type
  };

  const result = await request.get(
    schemas.getChildrenOfKnowledgeAreaSchema,
    `/knowledgearea/${areaId}/children`,
    {
      queryParams
    }
  );

  return result.children as ChildOfKnowledgeArea[];
}