import { object, number, string } from 'yup';

export const getTopicsSchema = {
  query: object({
    areaId:    number().optional(),
    topicName: string().optional()
  })
};

export const createTopicSchema = {
  body: object({
    areaId:    number().required(),
    topicName: string().required()
  })
};

export const updateTopicSchema = {
  params: object({
    topicId: number().required()
  }),
  body: object({
    areaId:    number().required(),
    topicName: string().required()
  })
};

export const getTopicSchema = {
  params: object({
    topicId: number().required()
  })
};

export const deleteTopicSchema = {
  params: object({
    topicId: number().required()
  })
};