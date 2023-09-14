import { object, array, number, string } from 'yup';
import { DifficultyLevel, QuestionType } from '../models';

const questionOptionSchema = object({
  id:   number().required(),
  text: string().required()
});

const questionSchema = object({
  questionId:         number().required(),
  questionType:       string().required().oneOf(Object.values(QuestionType)),
  questionText:       string().required(),
  options:            array().required().of(questionOptionSchema.required()),
  explanationText:    string().defined(),
  difficultyLevel:    string().required().oneOf(Object.values(DifficultyLevel)),
  topicIds:           array().required().of(number().required())
});

export const getQuestionsSchema =
  object({
    questions: array().required().of(questionSchema)
  });

export const createQuestionSchema = 
  object({
    questionId: number().required()
  });

export const getQuestionSchema = questionSchema.concat(
  object({
    correctOptionIndex: number().optional()
  })
);