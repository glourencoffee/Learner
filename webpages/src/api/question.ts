import {
  DifficultyLevel,
  Question,
  QuestionType,
  QuestionWithoutId
} from '../models';
import * as request from '../requests/request';
import * as schemas from '../schemas/question';

export interface GetQuestionsOptions {
  questionType?: QuestionType;
  questionText?: string;
  difficultyLevels?: DifficultyLevel[];
  topicIds?: number[];
}

/**
 * Makes an API request to query questions.
 * 
 * @param options Options for filtering the query.
 * @returns An array of questions.
 */
export async function getQuestions(options: GetQuestionsOptions = {}): Promise<Question[]> {
  const result = await request.get(
    schemas.getQuestionsSchema,
    '/question/',
    {
      queryParams: options
    }
  );

  return result.questions.map(
    ({ questionId, ...values }) => ({ id: questionId, ...values })
  );
}

/**
 * Makes an API request to create a question.
 * 
 * @param values Question data.
 * @returns The id of the newly-created question.
 */
export async function createQuestion(values: QuestionWithoutId): Promise<number> {
  const result = await request.post(
    schemas.createQuestionSchema,
    '/question/',
    {
      body: values
    }
  );

  return result.questionId;
}

/**
 * Makes an API requests to retrieve information of a question.
 * 
 * @param id The id of a question.
 * @returns A question.
 */
export async function getQuestion(id: number): Promise<Question> {
  const result = await request.get(
    schemas.getQuestionSchema,
    `/question/${id}`
  );

  const {
    questionId,
    questionType,
    ...question
  } = result;

  return {
    id: questionId,
    ...question
  };
}

/**
 * Makes an API request to update a question.
 * 
 * @param question A question.
 */
export async function updateQuestion(question: Question): Promise<void> {
  const { id, ...values } = question;

  await request.put(
    `/question/${id}`,
    {
      body: values
    }
  );
}