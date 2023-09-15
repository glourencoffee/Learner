/**
 * Represents a knowledge area.
 */
export interface KnowledgeArea {
  /**
   * The id of a knowledge area.
   */
  id: number;

  /**
   * The name of a knowledge area.
   */
  name: string;

  /**
   * The id of the parent of a knowledge area, or `null` if
   * that knowledge area is top-level.
   */
  parentId: number | null;
}

export interface KnowledgeAreaWithoutId
         extends Omit<KnowledgeArea, 'id'> {}

export interface KnowledgeAreaWithoutParentId
         extends Omit<KnowledgeArea, 'parentId'> {}