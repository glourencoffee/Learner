import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './sequelize';
import { QuestionOption } from './QuestionOption';

export interface AnswerAttributes {
  id: number;
  option_id: number;
}

export interface AnswerCreationAttributes
         extends Optional<AnswerAttributes, 'id'> {}

export class Answer
     extends Model<AnswerAttributes, AnswerCreationAttributes>
  implements AnswerAttributes
{
  public id!: number;
  public option_id!: number;

  public option?: QuestionOption;
  
  public createdAt!: Date;
  public updatedAt!: Date;
}

Answer.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },

    option_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'answer',
    modelName: 'Answer'
  }
);

/**
 * One answer has only one option, but one option may have many answers.
 */
QuestionOption.hasMany(Answer,   { foreignKey: 'option_id', as: 'answers' });
Answer.belongsTo(QuestionOption, { foreignKey: 'option_id', as: 'option' });