export interface Topic {
  /**
   * The id of a topic.
   */
  id: number;

  /**
   * The name of a topic.
   */
  name: string;

  /**
   * The id of the knowledge area which is a parent of this topic.
   */
  areaId: number;

  /**
   * The path of a topic.
   * 
   * This key includes the names of the knowledge areas which this
   * topic is under, in hierarchical order. For example, consider
   * the following hierarchy:
   * - A (area)
   *   - B (area)
   *     - C (area)
   *       - D (topic)
   * 
   * If this object is a representation of D and this `path` is
   * not `undefined`, `path` will contain A, B, and C, in that order.
   */
  path?: string[];
}