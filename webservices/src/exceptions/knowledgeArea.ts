import { BadRequestError, ConflictError, MethodNotAllowedError, NotFoundError } from './common';

/**
 * Thrown if a knowledge area is not found.
 */
export class KnowledgeAreaNotFoundError extends NotFoundError {
  constructor(knowledgeAreaId: number, details?: any) {
    super(`There exists no knowledge area with id ${knowledgeAreaId}`, details);

    this.name = 'KnowledgeAreaNotFoundError';
  }
}

/**
 * Thrown if the name of a knowledge area is already used by another knowledge area.
 */
export class KnowledgeAreaNameConflictError extends ConflictError {
  constructor(name: string, knowledgeAreaParentId: number | null) {

    if (knowledgeAreaParentId === null) {
      super(`There exists already a top-level knowledge area with name '${name}'`);
    }
    else {
      super(`There exists already a child with name '${name}' under parent knowledge area ${knowledgeAreaParentId}`);
    }

    this.name = 'KnowledgeAreaNameConflictError';
  }
}

/**
 * Thrown if the client tries to set a knowledge area as its own parent.
 */
export class KnowledgeAreaSelfParentingError extends BadRequestError {
  constructor(details?: any) {
    super(`A knowledge area cannot be a parent of itself`, details);

    this.name = 'KnowledgeAreaSelfParentingError';
  }
}

/**
 * Thrown if the client tries to delete a knowledge area which has children.
 */
export class ParentKnowledgeAreaDeletionError extends MethodNotAllowedError {
  constructor(knowledgeAreaId: number, details?: any) {
    super(`Cannot delete knowledge area ${knowledgeAreaId} because it has children`, details);

    this.name = 'ParentKnowledgeAreaDeletionError';
  }
}