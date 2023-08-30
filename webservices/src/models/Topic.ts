import { DataTypes } from 'sequelize';
import sequelize from './sequelize';
import { KnowledgeArea } from './KnowledgeArea';

export const Topic = sequelize.define(
  'Topic',
  {
    /**
     * Identifier of a topic.
     */
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },

    /**
     * Name of a topic.
     */
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    /**
     * Id of the knowledge area which is the parent of a topic.
     */
    area_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    indexes: [
      {
        /**
         * Forbid two topics under the same knowledge area from having the same name.
         */
        fields: ['area_id', 'name'],
        unique: true
      }
    ],

    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'topic'
  }
);

/**
 * A knowledge area may have many topics.
 * 
 * A topic has exactly one knowledge area.
 */
KnowledgeArea.hasMany(Topic, { foreignKey: 'area_id' });
Topic.belongsTo(KnowledgeArea, { foreignKey: 'area_id' });