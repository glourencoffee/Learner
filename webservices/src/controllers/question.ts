import { Request, Response } from 'express';
import {
  ForeignKeyConstraintError,
  Op,
  Transaction,
  WhereOptions
} from 'sequelize';
import {
  sequelize,
  Question,
  QuestionType,
  QuestionOption,
  QuestionAttributes,
  Topic,
  TopicAttributes
} from '../models';
import { HttpStatusCode } from '../utils';
import * as schemas from '../schemas/question';
import * as exceptions from '../exceptions';

/**
 * Returns whether a string case-insensitively matches the words
 * `'true'` or `'false'`.
 * 
 * @param value A string.
 * @returns Whether it matches a boolean string.
 */
function isBooleanString(value: string): boolean {
  const lc = value.toLowerCase();

  return (lc === 'true' || lc === 'false');
}

/**
 * Returns a question type from a list of question options.
 *
 * This function is used to determine whether the options received
 * from client reflect a boolean question.
 * 
 * If `options` has exactly 2 items which case-insensitively match
 * "True" and "False", in any order, returns `QuestionType.BOOLEAN`.
 * Otherwise, returns `QuestionType.MULTIPLE_CHOICE`.
 *
 * @param options A question options.
 * @returns A question type.
 * @see `isBooleanString`
 */
function getQuestionType(options: string[]): QuestionType {
  return (
    ((options.length === 2) &&
     (isBooleanString(options[0])) &&
     (isBooleanString(options[1])))
    ? QuestionType.BOOLEAN
    : QuestionType.MULTIPLE_CHOICE
  );
}

/**
 * Creates options for a `Question`.
 * 
 * First, deletes all options associated with `question`.
 * 
 * Then, creates a `QuestionOption` for each element of `optionTexts` and associates
 * it with `question`. While creating an option, checks if its index in `optionTexts`
 * is same as `correctOptionIndex`, in which case this function sets the value of the
 * column `Question.correct_option_id` to refer to the newly-created option. Note that
 * the caller must ensure that `correctOptionIndex` is within the bounds of `options`,
 * as otherwise `question` will be left with a `null` value for `Question.correct_option_id`.
 * 
 * @param question A question.
 * @param options A list of options to be created for the question.
 * @param correctOptionIndex The index of the list that refers to the correct option.
 * @param createOptions Optional options to pass to `QuestionOption.create()`.
 */
async function createQuestionOptions(
  question: Question,
  optionTexts: string[],
  correctOptionIndex: number,
  transaction?: Transaction
)
{
  await QuestionOption.destroy({
    where: {
      question_id: question.id
    },

    transaction
  });

  for (const [optionIndex, optionText] of optionTexts.entries()) {
    const option = await question.createOption({ 'text': optionText }, { transaction });

    if (optionIndex === correctOptionIndex) {
      question.set('correct_option_id', option.id);

      await question.save({ transaction });
    }
  }
}

/**
 * Finds the first number in a list of topic ids that does not identify an
 * existing topic in the database.
 * 
 * @param topicIds A list of topic ids with possibly invalid ids.
 * @returns The first invalid id of that list, or `undefined` if all ids are valid.
 */
async function findFirstInvalidTopicOf(topicIds: number[]): Promise<number | undefined> {
  
  const validTopics = await Topic.findAll({
    attributes: ['id'],
    where: {
      id: {
        [Op.in]: topicIds
      }
    }
  });

  function isValidTopicId(topicId: number): boolean {
    return validTopics.some((validTopic) => validTopic.id === topicId);
  }
  
  const firstInvalidTopicId = topicIds.find((topicId) => !isValidTopicId(topicId));
  
  return firstInvalidTopicId;
}

/**
 * Converts a `Question` instance to a response object.
 * 
 * @param question A question instance.
 * @returns A question object to be sent over.
 */ 
async function toResponseQuestionObject(question: Question, isEdition: boolean) {
  const questionOptions = question.options.map(
    ({ id, text }) => ({ id, text })
  );

  let correctOptionIndex;
  
  if (isEdition) {
    correctOptionIndex = question.options.findIndex((option) => option.id === question.correct_option_id);
  }

  const questionTopics   = await question.getTopics();
  const questionTopicIds = questionTopics.map((topic) => topic.id);

  return {
    questionId:      question.id,
    questionType:    question.question_type,
    questionText:    question.question_text,
    explanationText: question.explanation_text,
    difficultyLevel: question.difficulty_level,
    options:         questionOptions,
    topicIds:        questionTopicIds,
    correctOptionIndex,
  };
}

//================================================
// /question (GET)
//================================================
export async function getQuestions(req: Request, res: Response): Promise<any> {
  const schema = schemas.getQuestionsSchema;

  // Validate request data.
  const query = schema.query.validateSync(req.query);

  // Prepare data for usage.
  const {
    questionType,
    questionText,
    difficultyLevels,
    topicIds
  } = query;

  // Prepare WHERE clauses.
  const questionsWhere: WhereOptions<QuestionAttributes> = {};

  if (questionType !== undefined) {
    questionsWhere.question_type = questionType;
  }

  if (questionText) {
    questionsWhere.question_text = {
      [Op.like]: `%${questionText}%`
    };
  }

  if (difficultyLevels !== undefined) {
    questionsWhere.difficulty_level = {
      [Op.in]: difficultyLevels
    };
  }

  const topicsWhere: WhereOptions<TopicAttributes> = {};

  if (topicIds !== undefined && topicIds.length > 0) {
    topicsWhere.id = {
      [Op.in]: topicIds
    };
  }

  // Query questions.
  const questions = await Question.findAll({
    attributes: [
      'id',
      'question_type',
      'question_text',
      'explanation_text',
      'difficulty_level',
      'correct_option_id'
    ],
    include: [
      {
        model: QuestionOption,
        as: 'options',
        attributes: ['id', 'text']
      },
      {
        model: Topic,
        as: 'topics',
        attributes: [],
        where: topicsWhere
      }
    ],
    where: questionsWhere
  });

  const mappedQuestions = [];
  
  // Map results from query to API response.
  for (const question of questions) {
    mappedQuestions.push(await toResponseQuestionObject(question, false));
  }

  return res.status(HttpStatusCode.OK).json({ questions: mappedQuestions });
}

//================================================
// /question (POST)
//================================================
export async function createQuestion(req: Request, res: Response): Promise<any> {
  const schema = schemas.createQuestionSchema;

  // Validate request data.
  const body = schema.body.validateSync(req.body);

  // Prepare data for usage.
  const {
    questionText,
    options,
    correctOptionIndex,
    explanationText = '',
    difficultyLevel,
    topicIds
  } = body;

  try {
    const result = await sequelize.transaction(async (t) => {

      // Create question.
      const question = await Question.create({
        question_type:    getQuestionType(options),
        question_text:    questionText,
        explanation_text: explanationText,
        difficulty_level: difficultyLevel
      }, { transaction: t });

      // Create options and set correct option.
      await createQuestionOptions(question, options, correctOptionIndex, t);

      // Add topics to question.
      await question.addTopics(topicIds, { transaction: t });

      return question;
    });

    res.status(HttpStatusCode.CREATED).json({ questionId: result.dataValues.id });
  }
  catch (e) {
    if (e instanceof ForeignKeyConstraintError) {
      const firstInvalidTopicId = await findFirstInvalidTopicOf(topicIds);

      if (firstInvalidTopicId === undefined) {
        throw e; // should never happen
      }
      else {
        throw new exceptions.TopicNotFoundError(
          firstInvalidTopicId,
          {
            bodyParam: 'topicIds',
            badValue: firstInvalidTopicId
          }
        );
      }
    }

    throw e;
  }  
}

//================================================
// /question/{questionId} (PUT)
//================================================
export async function updateQuestion(req: Request, res: Response): Promise<any> {
  const schema = schemas.updateQuestionSchema;

  // Validate request data.
  const params = schema.params.validateSync(req.params);
  const body   = schema.body.validateSync(req.body);

  // Prepare data for usage.
  const { questionId } = params;
  const {
    questionText,
    options,
    correctOptionIndex,
    explanationText = '',
    difficultyLevel,
    topicIds
  } = body;

  try {
    await sequelize.transaction(async (t) => {
      // Find question.
      const question = await Question.findByPk(questionId, { transaction: t });

      // Ensure question exists.
      if (question === null) {
        const details = {
          urlParam: 'questionId',
          badValue: questionId
        };

        throw new exceptions.QuestionNotFoundError(questionId, details);
      }

      await createQuestionOptions(question, options, correctOptionIndex, t);

      question.setTopics(topicIds);
      question.set('question_type',    getQuestionType(options));
      question.set('question_text',    questionText);
      question.set('explanation_text', explanationText);
      question.set('difficulty_level', difficultyLevel);

      await question.save({ transaction: t });
    });

    return res.status(HttpStatusCode.OK).send();
  }
  catch (e) {
    if (e instanceof ForeignKeyConstraintError) {
      const firstInvalidTopicId = await findFirstInvalidTopicOf(topicIds);

      if (firstInvalidTopicId === undefined) {
        throw e; // should never happen
      }
      else {
        throw new exceptions.TopicNotFoundError(
          firstInvalidTopicId,
          {
            bodyParam: 'topicIds',
            badValue: firstInvalidTopicId
          }
        );
      }
    }

    throw e;
  }
}

//================================================
// /question/{questionId} (GET)
//================================================
export async function getQuestion(req: Request, res: Response): Promise<any> {
  const schema = schemas.getQuestionSchema;

  // Validate request data.
  const params = schema.params.validateSync(req.params);
  const query  = schema.query.validateSync(req.query);

  // Prepare data for usage.
  const { questionId } = params;
  const {
    isEdition = false
  } = query;

  // Find question.
  const question = await Question.findByPk(questionId, {
    include: [
      {
        model: QuestionOption,
        as: 'options',
        attributes: ['id', 'text']
      },
      {
        model: Topic,
        as: 'topics',
        attributes: []
      }
    ]
  });

  // Ensure question exists.
  if (question === null) {
    const details = {
      urlParam: 'questionId',
      badValue: questionId
    };

    throw new exceptions.QuestionNotFoundError(questionId, details);
  }

  const responseData = await toResponseQuestionObject(question, isEdition);

  return res.status(HttpStatusCode.OK).json(responseData);
}

//================================================
// /question/{questionId} (DELETE)
//================================================
export async function deleteQuestion(req: Request, res: Response): Promise<any> {
  const schema = schemas.deleteQuestionSchema;

  // Validate request data.
  const params = schema.params.validateSync(req.params);

  // Prepare data for usage.
  const { questionId } = params;

  // Find question.
  const question = await Question.findByPk(questionId, { attributes: ['id'] });

  // Ensure question exists.
  if (question === null) {
    const details = {
      urlParam: 'questionId',
      badValue: questionId
    };

    throw new exceptions.QuestionNotFoundError(questionId, details);
  }

  // Delete question.
  try {
    await question.destroy();

    return res.status(HttpStatusCode.NO_CONTENT).send();
  }
  catch (e) {
    throw e;
  }
}