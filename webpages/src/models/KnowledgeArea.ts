/**
 * Represents a knowledge area.
 */
export class KnowledgeArea {
  /**
   * The id of a knowledge area or `NaN`, if not applicable.
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

  constructor(id?: number, name?: string, parentId?: number | null) {
    this.id       = (id !== undefined) ? id : NaN;
    this.name     = name ?? '';
    this.parentId = (parentId !== undefined) ? parentId : null;
  }
}