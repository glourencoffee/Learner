import { object, array, number, string } from 'yup';
import { DifficultyLevel, QuestionType } from '../models';

const questionSchema = object({
  questionId:         number().required(),
  questionType:       string().required().oneOf(Object.values(QuestionType)),
  questionText:       string().required(),
  options:            array().required().of(string().required()),
  correctOptionIndex: number().required(),
  explanationText:    string().required(),
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

export const getQuestionSchema = questionSchema;