import { Request, Response } from 'express';
import { ForeignKeyConstraintError, Op, UniqueConstraintError } from 'sequelize';
import { KnowledgeArea } from '../models/KnowledgeArea';
import * as schemas from '../schemas/knowledgeArea';
import * as exceptions from '../exceptions/knowledgeArea';
import { HttpStatusCode } from '../utils';
import sequelize from '../models/sequelize';
import { Topic } from '../models/Topic';

/**
 * Ensures there exists no child topic under the parent area `areaId`.
 *
 * This is to ensure that a parent knowledge area will only have one child with
 * the same name, irrespective of whether that child is another knowledge area
 * or a topic. For example, if a parent knowledge area A has a child topic B,
 * a creation request of a sub-area named B under A should be rejected.
 *
 * This constraint must be enforced at application level, because the database
 * stores knowledge areas and topics in separate tables, and there is no way
 * to enforce cross-table uniqueness. The tables themselves enforce this name 
 * uniqueness for their own columns, but the cross-table logic must be handled
 * here.
 *
 * @param areaId The id of the parent knowledge area.
 * @param childName The name of the child topic.
 */
async function ensureChildTopicDoesNotExist(
  areaId: number,
  childName: string
): Promise<void> {
  
  const existingChildTopic = await Topic.findOne({
    attributes: ['id'],
    where: {
      area_id: areaId,
      name: childName
    }
  });

  if (existingChildTopic !== null) {
    throw new exceptions.KnowledgeAreaNameConflictError(childName, areaId);
  }
}

//================================================
// /knowledgearea/toplevel (POST)
//================================================
export async function createTopLevelKnowledgeArea(req: Request, res: Response): Promise<any> {
  const schema = schemas.createTopLevelKnowledgeAreaSchema;
  
  // Validate request data.
  const body = schema.body.validateSync(req.body, { abortEarly: false, stripUnknown: true });
  
  // Prepare validated data for usage.
  const knowledgeAreaName = body.name;

  // Create top-level knowledge area.
  try {
    const result = await KnowledgeArea.create({
      parent_id: null,
      name:      knowledgeAreaName
    });
  
    return res.status(HttpStatusCode.CREATED).json({ id: result.dataValues.id });
  }
  catch (e) {
    if (e instanceof UniqueConstraintError) {
      throw new exceptions.KnowledgeAreaNameConflictError(knowledgeAreaName, null);
    }
    else {
      throw e;
    }
  }
}

//================================================
// /knowledgearea/toplevel (GET)
//================================================
export async function getTopLevelKnowledgeAreas(req: Request, res: Response): Promise<any> {
  const schema = schemas.getTopLevelKnowledgeAreasSchema;

  // Validate request data.
  const query = schema.query.validateSync(req.query);
  
  // Prepare validated data for usage.
  const nameFilter = query?.nameFilter ?? '';

  // Find top-level knowledge areas.
  const areas = await KnowledgeArea.findAll({
    attributes: ['id', 'name'],
    where: {
      parent_id: null,
      name: {
        [Op.like]: `%${nameFilter}%`
      }
    },
    order: [['name', 'ASC']]
  });

  // Return them areas.
  return res.status(HttpStatusCode.OK).json({ areas });
}

//================================================
// /knowledgearea/{id}/ (POST)
//================================================
export async function createChildKnowledgeArea(req: Request, res: Response): Promise<any> {
  const schema = schemas.createChildKnowledgeAreaSchema;
  
  // Validate request data.
  const params = schema.params.validateSync(req.params);
  const body   = schema.body.validateSync(req.body, { abortEarly: false, stripUnknown: true });
  
  // Prepare validated data for usage.
  const knowledgeAreaParentId  = params.id;
  const knowledgeAreaChildName = body.name;

  await ensureChildTopicDoesNotExist(knowledgeAreaParentId, knowledgeAreaChildName);

  try {
    const result = await KnowledgeArea.create({
      parent_id: knowledgeAreaParentId,
      name:      knowledgeAreaChildName
    });
  
    return res.status(HttpStatusCode.CREATED).json({ id: result.dataValues.id });
  }
  catch (e) {
    if (e instanceof ForeignKeyConstraintError && knowledgeAreaParentId !== null) {
      throw new exceptions.KnowledgeAreaNotFoundError(knowledgeAreaParentId);
    }
    else if (e instanceof UniqueConstraintError) {
      throw new exceptions.KnowledgeAreaNameConflictError(knowledgeAreaChildName, knowledgeAreaParentId);
    }
    else {
      throw e;
    }
  }
}

//================================================
// /knowledgearea/{id}/ (PUT)
//================================================
export async function updateKnowledgeArea(req: Request, res: Response): Promise<any> {
  const schema = schemas.updateKnowledgeAreaSchema;

  // Validate request data.
  const params = schema.params.validateSync(req.params);
  const body   = schema.body.validateSync(req.body);

  // Prepare validated data for usage.
  const knowledgeAreaId       = params.id;
  const knowledgeAreaParentId = body.parentId;
  const knowledgeAreaName     = body.name;

  // Find instance of knowledge area by id.
  const knowledgeArea = await KnowledgeArea.findByPk(knowledgeAreaId);

  // Ensure that an instance was found.
  if (knowledgeArea == null) {
    throw new exceptions.KnowledgeAreaNotFoundError(
      knowledgeAreaId,
      {
        urlParam: 'id',
        badValue: knowledgeAreaId
      }
    );
  }

  // Ensure that the client is not trying to self-parent this knowledge area.
  if (knowledgeAreaId == knowledgeAreaParentId) {
    throw new exceptions.KnowledgeAreaSelfParentingError(
      [
        {
          urlParam: 'id',
          value: knowledgeAreaId,
        },
        {
          bodyParam: 'parentId',
          badValue: knowledgeAreaParentId
        }
      ]
    );
  }

  if (knowledgeAreaParentId !== null) {
    await ensureChildTopicDoesNotExist(knowledgeAreaParentId, knowledgeAreaName);
  }

  // Change data.
  knowledgeArea.set('parent_id', knowledgeAreaParentId);
  knowledgeArea.set('name',      knowledgeAreaName);

  // Update it onto the database.
  try {
    await knowledgeArea.save();

    return res.status(HttpStatusCode.OK).send();
  }
  catch (e) {
    if (e instanceof ForeignKeyConstraintError
       && knowledgeAreaParentId !== null
       && e.fields instanceof Array
       && e.fields.includes('parent_id'))
    {
      // A FK contraint error happened because the client informed an invalid parent id.
      throw new exceptions.KnowledgeAreaNotFoundError(
        knowledgeAreaParentId,
        {
          field: 'parentId',
          badValue: knowledgeAreaParentId
        }
      );
    }
    else if (e instanceof UniqueConstraintError) {
      // A UK contraint error happened because the client informed a name that's already
      // used by another child knowledge area under this same parent.
      throw new exceptions.KnowledgeAreaNameConflictError(knowledgeAreaName, knowledgeAreaParentId);
    }
    else {
      throw e;
    }
  }
}

//================================================
// /knowledgearea/{id}/ (GET)
//================================================
export async function getKnowledgeArea(req: Request, res: Response): Promise<any> {
  const schema = schemas.getKnowledgeAreaSchema;

  // Validate request data.
  const params = schema.params.validateSync(req.params);

  // Prepare validated data for usage.
  const knowledgeAreaId = params.id;
  
  // Find instance of knowledge area by id.
  const knowledgeArea = await KnowledgeArea.findByPk(knowledgeAreaId, {
    attributes: [
      'id',
      'name',
      ['parent_id', 'parentId']
    ],
  });

  // Ensure knowledge area was found.
  if (knowledgeArea == null) {
    throw new exceptions.KnowledgeAreaNotFoundError(
      knowledgeAreaId,
      {
        urlParam: 'id',
        badValue: knowledgeAreaId
      }
    );
  }

  return res.status(HttpStatusCode.OK).json(knowledgeArea);
}

//================================================
// /knowledgearea/{id}/ (DELETE)
//================================================
export async function deleteKnowledgeArea(req: Request, res: Response): Promise<any> {
  const schema = schemas.deleteKnowledgeAreaSchema;

  // Validate request data.
  const params = schema.params.validateSync(req.params);

  // Prepare validated data for usage.
  const knowledgeAreaId = params.id;
  
  // Find instance of knowledge area by id.
  const knowledgeArea = await KnowledgeArea.findByPk(knowledgeAreaId, { attributes: ['id'] });

  // Ensure that knowledge area exists.
  if (knowledgeArea == null) {
    throw new exceptions.KnowledgeAreaNotFoundError(
      knowledgeAreaId,
      {
        urlParam: 'id',
        badValue: knowledgeAreaId
      }
    );
  }

  try {
    await knowledgeArea.destroy();

    return res.status(HttpStatusCode.NO_CONTENT).send();
  }
  catch (e) {
    if (e instanceof ForeignKeyConstraintError) {
      throw new exceptions.ParentKnowledgeAreaDeletionError(knowledgeAreaId);
    }

    throw e;
  }
}


//================================================
// /knowledgearea/{id}/children (GET)
//================================================
export async function getChildrenOfKnowledgeArea(req: Request, res: Response): Promise<any> {
  const schema = schemas.getChildrenOfKnowledgeAreaSchema;
  
  // Validate request data.
  const params = schema.params.validateSync(req.params);
  const query  = schema.query.validateSync(req.query, { abortEarly: false, stripUnknown: true });

  // Prepare validated data for usage.
  const parentId   = params.id;
  const nameFilter = query.nameFilter ?? '';

  // Ensure that parent knowledge area exists.
  if (await KnowledgeArea.findByPk(parentId) == null) {
    throw new exceptions.KnowledgeAreaNotFoundError(parentId);
  }

  enum ChildType {
    AREA  = 'area',
    TOPIC = 'topic'
  };

  // Find children from the knowledge area `parentId`.
  // This searchs both for child knowledge areas and child topics.
  // The command below is the equivalent of a UNION ALL.
  const result = await Promise.all([
    KnowledgeArea.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.literal('$1'), 'type']
      ],
      where: {
        parent_id: parentId,
        name: {
          [Op.like]: `%${nameFilter}%`
        }
      },
      bind: [ChildType.AREA]
    }),
    Topic.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.literal('$1'), 'type']
      ],
      where: {
        area_id: parentId,
        name: {
          [Op.like]: `%${nameFilter}%`
        }
      },
      bind: [ChildType.TOPIC]
    })
  ]);

  const children = result.flat().sort((a, b) => a.dataValues.name - b.dataValues.name);

  res.status(HttpStatusCode.OK).json({ children });
}