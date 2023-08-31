import { object, number, string } from 'yup';

const minNameLength = 2;
const maxNameLength = 40;

export const getTopLevelKnowledgeAreasSchema = {
  query: object({
    nameFilter: string().optional()
  })
};

export const createTopLevelKnowledgeAreaSchema = {
  body: object({
    name: string().required().trim().min(minNameLength).max(maxNameLength)
  })
};

export const createChildKnowledgeAreaSchema = {
  params: object({
    id: number().required()
  }),

  body: object({
    name: string().required().trim().min(minNameLength).max(maxNameLength)
  })
};

export const updateKnowledgeAreaSchema = {
  body: object({
    name:     string().required().trim().min(minNameLength).max(maxNameLength),
    parentId: number().required().nullable()
  }),

  params: object({
    id: number().required()
  })
};

export const getKnowledgeAreaSchema = {
  params: object({
    id: number().required()
  })
};

export const deleteKnowledgeAreaSchema = {
  params: object({
    id: number().required()
  })
};

export const getChildrenOfKnowledgeAreaSchema = {
  params: object({
    id: number().required()
  }),

  query: object({
    nameFilter: string().optional().trim().min(minNameLength).max(maxNameLength),
    type:       string().optional().oneOf(['area', 'topic'])
  })
};