import { NotFoundError } from './common';

/**
 * Thrown if a question is not found.
 */
export class QuestionNotFoundError extends NotFoundError {
  constructor(questionId: number, details?: any) {
    super(`There exists no question with id ${questionId}`, details);

    this.name = 'QuestionNotFoundError';
  }
}

/**
 * Thrown if a question option is not found.
 */
export class QuestionOptionNotFoundError extends NotFoundError {
  constructor(optionId: number, details?: any) {
    super(`There exists no question option with id ${optionId}`, details);

    this.name = 'QuestionOptionNotFoundError';
  }
}