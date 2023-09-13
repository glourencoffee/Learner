import { Request, Response } from 'express';
import { WhereOptions } from 'sequelize';
import {
  Answer,
  Question,
  QuestionOption,
  QuestionOptionAttributes,
  sequelize
} from '../models';
import { HttpStatusCode } from '../utils';
import * as schemas from '../schemas/answer';
import * as exceptions from '../exceptions';

async function toAnswerResponseObject(answer: Answer, option: QuestionOption) {
  const question = await option.getQuestion({
    attributes: ['correct_option_id']
  });

  return {
    answerId:   answer.id,
    questionId: option.question_id,
    optionId:   option.id,
    optionText: option.text,
    isCorrect:  (option.id === question.correct_option_id),
    createdAt:  answer.createdAt.getTime()
  };
}

//================================================
// /answer/ (POST)
//================================================
export async function createAnswer(req: Request, res: Response): Promise<any> {
  const schema = schemas.createAnswerSchema;

  // Validate request data.
  const body = schema.body.validateSync(req.body);
  
  // Prepare validated data for usage.
  const {
    optionId
  } = body;

  const option = await QuestionOption.findByPk(optionId);

  if (option === null) {
    throw new exceptions.QuestionOptionNotFoundError(optionId);
  }
  
  const question = await option.getQuestion();
  const isCorrectOption = (question.correct_option_id === optionId);

  try {
    // Create answer.
    const answer = await Answer.create({ option_id: optionId });

    return res.status(HttpStatusCode.CREATED).json({
      answerId: answer.id,
      isCorrectOption
    });
  }
  catch (e) {
    throw e;
  }
}

//================================================
// /answer/ (GET)
//================================================
export async function getAnswers(req: Request, res: Response): Promise<any> {
  const schema = schemas.getAnswersSchema;

  // Validate request data.
  const query = schema.query.validateSync(req.query);
  
  // Prepare validated data for usage.
  const {
    questionId
  } = query;

  const questionOptionWhere: WhereOptions<QuestionOptionAttributes> = {}

  if (questionId !== undefined) {
    questionOptionWhere.question_id = questionId;
  }

  const answers = await Answer.findAll({
    include: [{
      model: QuestionOption,
      where: questionOptionWhere,
      as: 'option'
    }]
  });

  const mappedAnswers = [];
  
  for (const answer of answers) {
    const mappedAnswer = await toAnswerResponseObject(answer, answer.option!);

    mappedAnswers.push(mappedAnswer);
  }

  return res.status(HttpStatusCode.OK).json({ answers: mappedAnswers });
}

//================================================
// /answer/ (DELETE)
//================================================
export async function deleteAnswers(req: Request, res: Response): Promise<any> {
  const schema = schemas.deleteAnswersSchema;

  // Validate request data.
  const query = schema.query.validateSync(req.query);

  // Prepare data for usage.
  const {
    questionId
  } = query;

  const question = await Question.findByPk(questionId);

  if (question === null) {
    throw new exceptions.QuestionNotFoundError(questionId);
  }

  try {
    await sequelize.transaction(async () => {
      const questionOptionWhere: WhereOptions<QuestionOptionAttributes> = {
        question_id: questionId
      };

      const answers = await Answer.findAll({
        include: [{
          model: QuestionOption,
          where: questionOptionWhere,
          as: 'option'
        }]
      });
    
      for (const answer of answers) {
        await answer.destroy();
      }
    });

    return res.status(HttpStatusCode.NO_CONTENT).send();
  }
  catch (e) {
    throw e;
  }
}

//================================================
// /answer/{answerId} (GET)
//================================================
export async function getAnswer(req: Request, res: Response): Promise<any> {
  const schema = schemas.getAnswerSchema;

  // Validate request data.
  const params = schema.params.validateSync(req.params);

  // Prepare data for usage.
  const {
    answerId
  } = params;

  const answer = await Answer.findByPk(answerId, {
    include: [{
      model: QuestionOption,
      as: 'option'
    }]
  });

  if (answer === null) {
    throw new exceptions.AnswerNotFoundError(answerId);
  }

  const mappedAnswer = await toAnswerResponseObject(answer, answer.option!);

  return res.status(HttpStatusCode.OK).json(mappedAnswer);
}

//================================================
// /answer/{answerId} (DELETE)
//================================================
export async function deleteAnswer(req: Request, res: Response): Promise<any> {
  const schema = schemas.deleteAnswerSchema;

  // Validate request data.
  const params = schema.params.validateSync(req.params);

  // Prepare data for usage.
  const {
    answerId
  } = params;

  const answer = await Answer.findByPk(answerId);

  if (answer === null) {
    throw new exceptions.AnswerNotFoundError(answerId);
  }

  try {
    await answer.destroy();

    return res.status(HttpStatusCode.NO_CONTENT).send();
  }
  catch (e) {
    throw e;
  }
}