import * as request from '../requests/request';
import * as schemas from '../schemas/answer';

export async function createAnswer(optionId: number) {
  const result = request.post(
    schemas.createAnswerSchema,
    '/answer',
    {
      body: {
        optionId
      }
    }
  );

  return result;
}