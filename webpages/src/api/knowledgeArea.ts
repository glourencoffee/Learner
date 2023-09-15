import * as request from '../requests/request';
import * as schemas from '../schemas/knowledgeArea';
import {
  KnowledgeArea,
  KnowledgeAreaWithoutId,
  KnowledgeAreaWithoutParentId
} from '../models/KnowledgeArea';

export interface GetTopLevelKnowledgeAreaOptions {
  nameFilter?: string;
}

export async function getTopLevelKnowledgeAreas(
  options: GetTopLevelKnowledgeAreaOptions = {}
): Promise<KnowledgeAreaWithoutParentId[]> {
    
  const result = await request.get(
    schemas.getTopLevelKnowledgeAreaSchema,
    '/knowledgearea/toplevel',
    {
      queryParams: options
    }
  );

  return result.areas;
}

export async function createKnowledgeArea(values: KnowledgeAreaWithoutId): Promise<number> {
  const {
    name,
    parentId
  } = values;

  const path = (
    (parentId === null)
    ? '/knowledgearea/toplevel'
    : `/knowledgearea/${parentId}`
  );

  const result = await request.post(
    schemas.createKnowledgeAreaSchema,
    path,
    {
      body: {
        name
      }
    }
  );

  return result.id;
}

export async function getKnowledgeArea(areaId: number): Promise<KnowledgeArea> {
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

export interface GetChildrenOfKnowledgeAreaOptions {
  nameFilter?: string;
  type?: 'area' | 'topic';
}

export interface ChildOfKnowledgeArea {
  id: number,
  name: string,
  type: 'area' | 'topic';
}

export async function getChildrenOfKnowledgeArea(
  areaId: number,
  options: GetChildrenOfKnowledgeAreaOptions = {}
): Promise<ChildOfKnowledgeArea[]> {

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