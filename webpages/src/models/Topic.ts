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
}