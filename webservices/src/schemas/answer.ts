import { object, number } from 'yup';

export const createAnswerSchema = {
  body: object({
    optionId: number().required()
  })
};

export const getAnswersSchema = {
  query: object({
    questionId: number().optional()
  })
};

export const deleteAnswersSchema = {
  query: object({
    questionId: number().required()
  })
};

export const getAnswerSchema = {
  params: object({
    answerId: number().required()
  })
};

export const deleteAnswerSchema = {
  params: object({
    answerId: number().required()
  })
};