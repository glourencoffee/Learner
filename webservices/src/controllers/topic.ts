import { Request, Response } from 'express';
import { ForeignKeyConstraintError, Op, UniqueConstraintError, WhereOptions } from 'sequelize';
import { Topic } from '../models/Topic';
import * as schemas from '../schemas/topic';
import * as topicExceptions from '../exceptions/topic';
import * as areaExceptions from '../exceptions/knowledgeArea';
import { HttpStatusCode } from '../utils';
import { KnowledgeArea } from '../models/KnowledgeArea';

const exceptions = {
  ...topicExceptions,
  ...areaExceptions
};

/**
 * Ensures there exists no child knowledge area under the parent area `areaId`.
 *
 * This is to ensure that a parent knowledge area will only have one child with
 * the same name, irrespective of whether that child is another knowledge area
 * or a topic. For example, if a parent knowledge area A has a child knowledge
 * area B, a creation request of a topic named B under A should be rejected.
 *
 * This constraint must be enforced at application level, because the database
 * stores knowledge areas and topics in separate tables, and there is no way
 * to enforce cross-table uniqueness. The tables themselves enforce this name 
 * uniqueness for their own columns, but the cross-table logic must be handled
 * here.
 *
 * @param areaId The id of the parent knowledge area.
 * @param childName The name of the child area.
 */
async function ensureChildKnowledgeAreaDoesNotExist(
  areaId: number,
  childName: string
): Promise<void> {
  
  const existingChildArea = await KnowledgeArea.findOne({
    attributes: ['id'],
    where: {
      parent_id: areaId,
      name: childName
    }
  });

  if (existingChildArea !== null) {
    throw new exceptions.TopicNameConflictError(
      childName,
      areaId,
      {
        existingChild: {
          type: 'area',
          id: existingChildArea.dataValues.id
        }
      }
    );
  }
}

async function findTopicId(areaId: number, topicName: string): Promise<number | null> {
  const topic = await Topic.findOne({
    attributes: ['id'],
    where: {
      area_id: areaId
    }
  });

  return (
    (topic === null)
    ? null
    : topic.dataValues.id as number
  );
}

//================================================
// /topic/ (GET)
//================================================
export async function getTopics(req: Request, res: Response): Promise<any> {
  const schema = schemas.getTopicsSchema;

  // Validate request data.
  const query = schema.query.validateSync(req.query);
  
  // Prepare validated data for usage.
  const areaId    = query.areaId;
  const topicName = query.topicName;

  // Create where clause.
  let where: WhereOptions = {};

  if (areaId !== undefined) {
    where.area_id = areaId;
  }

  if (topicName !== undefined) {
    where.name = {
      [Op.like]: `${topicName}%`
    };
  }

  // Find topics.
  const topics = await Topic.findAll({
    attributes: [
      ['area_id', 'areaId'],
      ['id',      'topicId'],
      ['name',    'topicName']
    ],
    where,
    order: [['name', 'ASC']]
  });

  // Return them areas.
  return res.status(HttpStatusCode.OK).json({ topics });
}

//================================================
// /topic/ (POST)
//================================================
export async function createTopic(req: Request, res: Response): Promise<any> {
  const schema = schemas.createTopicSchema;
  
  // Validate request data.
  const body = schema.body.validateSync(req.body, { abortEarly: false, stripUnknown: true });
  
  // Prepare validated data for usage.
  const areaId    = body.areaId;
  const topicName = body.topicName;

  await ensureChildKnowledgeAreaDoesNotExist(areaId, topicName);

  try {
    const result = await Topic.create({
      area_id: areaId,
      name:    topicName
    });
  
    return res.status(HttpStatusCode.CREATED).json({ topicId: result.dataValues.id });
  }
  catch (e) {
    if (e instanceof ForeignKeyConstraintError) {
      throw new exceptions.KnowledgeAreaNotFoundError(areaId);
    }
    else if (e instanceof UniqueConstraintError) {
      throw new exceptions.TopicNameConflictError(
        topicName,
        areaId,
        {
          existingChild: {
            type: 'topic',
            id: await findTopicId(areaId, topicName) ?? undefined
          }
        }
      );
    }
    else {
      throw e;
    }
  }
}

//================================================
// /topic/{topicId} (PUT)
//================================================
export async function updateTopic(req: Request, res: Response): Promise<any> {
  const schema = schemas.updateTopicSchema;
  
  // Validate request data.
  const params = schema.params.validateSync(req.params);
  const body   = schema.body.validateSync(req.body, { abortEarly: false, stripUnknown: true });
  
  // Prepare validated data for usage.
  const topicId   = params.topicId;
  const areaId    = body.areaId;
  const topicName = body.topicName;

  const topic = await Topic.findByPk(topicId);

  if (topic === null) {
    throw new exceptions.TopicNotFoundError(
      topicId,
      {
        urlParam: 'topicId',
        badValue: topicId
      }
    );
  }

  await ensureChildKnowledgeAreaDoesNotExist(areaId, topicName);

  topic.set('area_id', areaId);
  topic.set('name',    topicName);

  try {
    await topic.save();
  
    return res.status(HttpStatusCode.OK).send();
  }
  catch (e) {
    if (e instanceof ForeignKeyConstraintError) {
      // `areaId` does not refer to a valid record in the `KnowledgeArea` table.
      throw new exceptions.KnowledgeAreaNotFoundError(areaId);
    }
    else if (e instanceof UniqueConstraintError) {
      throw new exceptions.TopicNameConflictError(
        topicName,
        areaId,
        {
          existingChild: {
            type: 'topic',
            id: await findTopicId(areaId, topicName) ?? undefined
          }
        }
      );
    }
    else {
      throw e;
    }
  }
}

//================================================
// /topic/{topicId} (GET)
//================================================
export async function getTopic(req: Request, res: Response): Promise<any> {
  const schema = schemas.updateTopicSchema;
  
  // Validate request data.
  const params = schema.params.validateSync(req.params);
  
  // Prepare validated data for usage.
  const topicId = params.topicId;

  // Find topic.
  const topic = await Topic.findByPk(
    topicId,
    {
      attributes: [
        ['area_id', 'areaId'],
        ['id',      'topicId'],
        ['name',    'topicName']
      ]
    }
  );

  if (topic === null) {
    throw new exceptions.TopicNotFoundError(
      topicId,
      {
        urlParam: 'topicId',
        badValue: topicId
      }
    );
  }

  return res.status(HttpStatusCode.OK).json(topic);
}

//================================================
// /topic/{topicId} (DELETE)
//================================================
export async function deleteTopic(req: Request, res: Response): Promise<any> {
  const schema = schemas.deleteTopicSchema;

  // Validate request data.
  const params = schema.params.validateSync(req.params);

  // Prepare validated data for usage.
  const topicId = params.topicId;
  
  // Find instance of topic by id.
  const topic = await KnowledgeArea.findByPk(topicId, { attributes: ['id'] });

  // Ensure that topic exists.
  if (topic === null) {
    throw new exceptions.TopicNotFoundError(
      topicId,
      {
        urlParam: 'topicId',
        badValue: topicId
      }
    );
  }

  try {
    await topic.destroy();

    return res.status(HttpStatusCode.NO_CONTENT).send();
  }
  catch (e) {
    throw e;
  }
}