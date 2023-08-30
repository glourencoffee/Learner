import { object, array, number, string } from 'yup';

export const getTopLevelKnowledgeAreaSchema = 
  object({
    areas: array().required().of(
      object({
        id:   number().required(),
        name: string().required()
      })
    )
  });

export const getKnowledgeAreaSchema =
  object({
    id:       number().required(),
    name:     string().required(),
    parentId: number().required().nullable()
  });

export const getChildrenOfKnowledgeAreaSchema =
  object({
    children: array().required().of(
      object({
        id:   number().required(),
        name: string().required(),
        type: string().required().oneOf(['area', 'topic'])
      })
    )
  });

export const createKnowledgeAreaSchema =
  object({
    id: number().required()
  });