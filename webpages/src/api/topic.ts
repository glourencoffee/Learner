import { Topic } from '../models/Topic';
import * as request from '../requests/request';
import * as schemas from '../schemas/topic';

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

export async function getTopic(topicId: number): Promise<Topic> {
  const result = await request.get(
    schemas.getTopicSchema,
    `/topic/${topicId}`
  );

  return {
    id:     result.topicId,
    name:   result.topicName,
    areaId: result.areaId
  };
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