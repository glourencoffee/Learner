import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  Model,
  Optional
} from 'sequelize';
import sequelize from './sequelize';
import { Topic } from './Topic';
import { QuestionOption } from './QuestionOption';

export enum QuestionType {
  BOOLEAN = 'boolean',
  MULTIPLE_CHOICE = 'multiple-choice'
}

export enum DifficultyLevel {
  EASY   = 'easy',
  MEDIUM = 'medium',
  HARD   = 'hard'
}

export interface QuestionAttributes {
  id: number;
  question_type: QuestionType;
  question_text: string;
  explanation_text: string | null;
  difficulty_level: DifficultyLevel;
  correct_option_id: number;
}

export interface QuestionCreationAttributes
         extends Optional<QuestionAttributes, 'id' | 'correct_option_id'> {}

export class Question
     extends Model<QuestionAttributes, QuestionCreationAttributes>
  implements QuestionAttributes 
{
  public id!: number;
  public question_type!: QuestionType;
  public question_text!: string;
  public explanation_text!: string | null;
  public difficulty_level!: DifficultyLevel;
  public correct_option_id!: number;

  public options!: QuestionOption[];
  public topics!: Topic[];
  
  /**
   * Associates a topic to this question.
   */
  declare addTopic: HasManyAddAssociationMixin<Topic, number>;

  /**
   * Associates a list of topics to this question.
   */
  declare addTopics: HasManyAddAssociationsMixin<Topic, number>;

  /**
   * Returns a list of topics associated with this question.
   */
  declare getTopics: HasManyGetAssociationsMixin<Topic>;

  /**
   * Sets which topics are associated with this question.
   */
  declare setTopics: HasManySetAssociationsMixin<Topic, number>;

  /**
   * Dissociates a topic from this question.
   */
  declare removeTopic: HasManyRemoveAssociationMixin<Topic, number>;

  /**
   * Dissociates a list of topics from this question.
   */
  declare removeTopics: HasManyRemoveAssociationsMixin<Topic, number>;

  /**
   * Creates a question option and associates it with this question.
   */
  declare createOption: HasManyCreateAssociationMixin<QuestionOption>;

  /**
   * Returns a list of question options associates with this question.
   */
  declare getOptions: HasManyGetAssociationsMixin<QuestionOption>;
}

Question.init(
  {
    /**
     * The id of a question.
     */
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },

    /**
     * The type of a question.
     */
    question_type: {
      type: DataTypes.ENUM,
      values: Object.values(QuestionType),
      allowNull: false
    },

    /**
     * The text of a question.
     */
    question_text: {
      type: DataTypes.STRING(2000),
      allowNull: false
    },

    explanation_text: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      defaultValue: ''
    },

    difficulty_level: {
      type: DataTypes.ENUM,
      values: Object.values(DifficultyLevel),
      allowNull: false
    },

    correct_option_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: QuestionOption,
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'question',
    modelName: 'Question'
  }
);

/**
 * A question has many question options.
 */
Question.hasMany(QuestionOption,   { foreignKey: 'question_id', as: 'options' });
QuestionOption.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

/**
 * A question has exactly one correct option.
 */
QuestionOption.hasOne(Question,    { foreignKey: 'correct_option_id', constraints: false });
Question.belongsTo(QuestionOption, { foreignKey: 'correct_option_id', constraints: false });