import { Topic } from '../models/Topic';
import * as request from '../requests/request';
import * as schemas from '../schemas/topic';
import { getKnowledgeArea } from './knowledgeArea';

interface GetTopicsOptions {
  areaId?: number;
  topicName?: string;
}

export async function getTopics(options: GetTopicsOptions = {}): Promise<Topic[]> {
  const queryParams = {
    areaId: options.areaId,
    topicName: Boolean(options.topicName) ? options.topicName : undefined
  };
  
  const result = await request.get(
    schemas.getTopicsSchema,
    '/topic/',
    {
      queryParams
    }
  );

  return result.topics.map((topic) => ({
    id:     topic.topicId,
    name:   topic.topicName,
    areaId: topic.areaId
  }));
}

export async function createTopic(areaId: number, topicName: string): Promise<number> {
  const body = {
    areaId,
    topicName
  };

  const result = await request.post(
    schemas.createTopicSchema,
    '/topic/',
    {
      body
    }
  );

  return result.topicId;
}

export interface GetTopicOptions {
  withPath?: boolean;
}

export async function getTopic(topicId: number, options: GetTopicOptions = {}): Promise<Topic> {
  const result = await request.get(
    schemas.getTopicSchema,
    `/topic/${topicId}`
  );

  const topic: Topic = {
    id:     result.topicId,
    name:   result.topicName,
    areaId: result.areaId
  }

  if (options.withPath) {
    const path = [];
    let areaId: number | null = topic.areaId;

    while (areaId !== null) {
      const area = await getKnowledgeArea(areaId);
      
      path.unshift(area.name);
      areaId = area.parentId;
    }

    topic.path = path;
  }

  return topic;
}

export async function updateTopic(topic: Topic): Promise<void> {
  const body = {
    areaId: topic.areaId,
    topicName: topic.name
  }

  await request.put(
    `/topic/${topic.id}`,
    {
      body
    }
  );
}