import { ConflictError, NotFoundError } from './common';

/**
 * Thrown if a topic is not found.
 */
export class TopicNotFoundError extends NotFoundError {
  constructor(topicId: number, details?: any) {
    super(`There exists no topic with id ${topicId}`, details);

    this.name = 'TopicNotFoundError';
  }
}

interface TopicNameConflictErrorDetails {
  existingChild: {
    type: 'area' | 'topic',
    id?: number
  };
}

/**
 * Thrown if the name of a topic is already used by a child of a knowledge area.
 */
export class TopicNameConflictError extends ConflictError {
  constructor(topicName: string, parentAreaId: number, details?: TopicNameConflictErrorDetails) {

    super(
      `Knowledge area ${parentAreaId} already has a child with name '${topicName}'`,
      details
    );

    this.name = 'TopicNameConflictError';
  }
}