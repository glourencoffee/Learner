import { object, array, number, string } from 'yup';

const topicSchema = object({
  areaId:    number().required(),
  topicId:   number().required(),
  topicName: string().required()
});

export const getTopicsSchema = 
  object({
    topics: array().required().of(topicSchema)
  });

export const createTopicSchema = 
  object({
    topicId: number().required()
  });

export const getTopicSchema = topicSchema;