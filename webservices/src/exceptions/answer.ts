import { NotFoundError } from './common';

/**
 * Thrown if an answer is not found.
 */
export class AnswerNotFoundError extends NotFoundError {
  constructor(answerId: number, details?: any) {
    super(`There exists no answer with id ${answerId}`, details);

    this.name = 'AnswerNotFoundError';
  }
}