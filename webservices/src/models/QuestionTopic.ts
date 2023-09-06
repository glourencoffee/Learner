import { Topic } from './Topic';
import { Question } from './Question';
import sequelize from './sequelize';
import { DataTypes, Model } from 'sequelize';

interface QuestionTopicAttributes {
  id: number;
  question_id: number;
  topic_id: number;
}

export class QuestionTopic
     extends Model<QuestionTopicAttributes, QuestionTopicAttributes>
  implements QuestionTopicAttributes
{
  public id!: number;
  public question_id!: number;
  public topic_id!: number;
}

QuestionTopic.init(
  {
    /**
     * It seems sequelize doesn't support composite foreign keys,
     * so this column is required in order to achieve referential
     * integrity on the columns `question_id` and `topic_id`.
     */
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },

    question_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Question,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },

    topic_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Topic,
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  },
  {
    sequelize,

    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'question_topic'
  }
);

// A question may be associated with many topics.
Question.belongsToMany(Topic, {
  through: QuestionTopic,
  foreignKey: 'question_id',
  uniqueKey: 'question_topic_unique',
  as: 'topics'
});

// A topic may be associated with many questions.
Topic.belongsToMany(Question, {
  through: QuestionTopic,
  foreignKey: 'topic_id',
  uniqueKey: 'question_topic_unique',
  as: 'questions'
});