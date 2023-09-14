import { object, boolean, number } from 'yup';

export const createAnswerSchema = object({
  answerId:        number().required(),
  isCorrectOption: boolean().defined()
});