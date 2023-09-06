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