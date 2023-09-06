import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './sequelize';

export interface KnowledgeAreaAttributes {
  id: number;
  name: string;
  parent_id: number | null;
  parent_id_notnull: number;
}

export interface KnowledgeAreaCreationAttributes
         extends Optional<Omit<KnowledgeAreaAttributes, 'parent_id_notnull'>, 'id'> {}

export class KnowledgeArea
     extends Model<KnowledgeAreaAttributes, KnowledgeAreaCreationAttributes>
  implements KnowledgeAreaAttributes
{
  public id!: number;
  public name!: string;
  public parent_id!: number | null;
  public parent_id_notnull!: number;
}

KnowledgeArea.init(
  {
    /**
     * Identifier of a knowledge area.
     */
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },

    /**
     * Name of a knowledge area.
     */
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    /**
     * Optional parent of a knowledge area.
     */
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    
    /**
     * This field is a `NOT NULL` equivalent of `parent_id` that maps `NULL` to 0.
     * Its purpose is to enforce name uniqueness for top-level knowledge areas,
     * which are those with the field `parent_id` as `NULL`. This allows creating
     * a composite unique key like (`parent_id_notnull`, `name`), enforcing that
     * there will be neither:
     * - Two top-level areas with a same.
     * - Two areas with a same name under a same parent.
     */
    parent_id_notnull: {
      type: 'INTEGER UNSIGNED GENERATED ALWAYS AS (COALESCE(`parent_id`, 0)) VIRTUAL'
    }
  },
  {
    sequelize,

    indexes: [
      {
        /**
         * Forbid two knowledge areas at the same hierarchy level from having the same name.
         */
        fields: ['parent_id_notnull', 'name'],
        unique: true
      }
    ],

    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'knowledge_area',
    modelName: 'KnowledgeArea'
  }
);

/**
 * An instance of a knowledge area may have at most one parent.
 */
KnowledgeArea.hasOne(KnowledgeArea, {
  foreignKey: 'parent_id',
  as: 'parent',

  /**
   * If the id of a parent knowledge area changes, just update its
   * reference on children knowledge areas.
   */
  onUpdate: 'CASCADE',

  /**
   * Forbid deletion of a knowledge area if it has children.
   */
  onDelete: 'RESTRICT'
});