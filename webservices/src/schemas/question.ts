import {
  object,
  array,
  number,
  string
} from 'yup';
import { DifficultyLevel, QuestionType } from '../models/Question';

const questionTypeSchema = (
  string().oneOf(Object.values(QuestionType))
);

const questionTextSchema = (
  string()
    .trim()
    .min(1)
    .max(2000)
);

const explanationTextSchema = (
  string()
    .trim()
    .min(1)
    .max(2000)
);

const difficultyLevelSchema = (
  string()
    .oneOf(
      Object.values(DifficultyLevel)
    )
);

const topicIdsSchema = (
  array()
    .of(
      number().required()
    )
    .min(1)
);

const optionsSchema = (
  array()
    .of(
      string()
        .required()
        .trim()
        .min(1)
        .max(500)
      )
    .min(2)
    .max(5)
);

export const getQuestionsSchema = {
  query: object({
    questionType:     questionTypeSchema.optional(),
    questionText:     questionTextSchema.optional(),
    difficultyLevels: array().optional().of(difficultyLevelSchema.defined()),
    topicIds:         topicIdsSchema.optional()
  })
};

export const createQuestionSchema = {
  body: object({
    questionText:       questionTextSchema.required(),
    options:            optionsSchema.required(),
    correctOptionIndex: number().required(),
    explanationText:    explanationTextSchema.optional(),
    difficultyLevel:    difficultyLevelSchema.required(),
    topicIds:           topicIdsSchema.required()
  })
};

export const updateQuestionSchema = {
  params: object({
    questionId: number().required()
  }),

  body: createQuestionSchema.body
};

export const getQuestionSchema = {
  params: object({
    questionId: number().required()
  })
};

export const deleteQuestionSchema = {
  params: object({
    questionId: number().required()
  })
};