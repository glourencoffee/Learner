import { DataTypes, HasOneGetAssociationMixin, Model, Optional } from 'sequelize';
import sequelize from './sequelize';
import { Question } from './Question';

export interface QuestionOptionAttributes {
  id: number;
  text: string;
  question_id: number;
}

export interface QuestionOptionCreationAttributes
         extends Optional<QuestionOptionAttributes, 'id' | 'question_id'> {}

export class QuestionOption
     extends Model<QuestionOptionAttributes, QuestionOptionCreationAttributes>
  implements QuestionOptionAttributes
{
  public id!: number;
  public text!: string;
  public question_id!: number;

  declare getQuestion: HasOneGetAssociationMixin<Question>;
}

QuestionOption.init(
  {
    /**
     * The id of a question option.
     */
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },

    /**
     * The text of a question option.
     * 
     * If `question_id` refers to a question of type `'boolean'`,
     * this field stores `'T'` and `'F'` for its options.
     */
    text: {
      type: DataTypes.STRING(500),
      allowNull: false
    },

    /**
     * The id of the question this option belongs to.
     */
    question_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    sequelize,

    indexes: [
      {
        fields: ['question_id', 'text'],
        unique: true
      }
    ],

    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'question_option',
    modelName: 'QuestionOption'
  }
);