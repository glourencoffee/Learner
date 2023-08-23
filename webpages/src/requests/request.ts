import * as yup from 'yup';
import { standardErrorSchema } from './standardError';
import { RequestError } from './RequestError';
import { makeCompleteUrl } from './url';

type RequestMethod = 'get' | 'post';

export interface RequestOptions {
  queryParams?: object;
  body?: object;
}

export async function request(method: RequestMethod, path: string, options: RequestOptions = {}) {
  const completeUrl = makeCompleteUrl(path, options.queryParams);
  
  const requestInit: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  };

  if (options.body !== undefined) {
    requestInit.body = JSON.stringify(options.body);
  }

  const data = await fetch(completeUrl, requestInit);

  const isHttpError = (data.status >= 400);

  if (isHttpError) {
    const json = await data.json();
    const standardError = standardErrorSchema.validateSync(json);
    
    throw new RequestError(standardError);
  }

  return data;
}

export async function
schemaRequest<TIn extends yup.Maybe<yup.AnyObject>, TContext, TDefault, TFlags extends yup.Flags>(
  method: RequestMethod,
  schema: yup.ObjectSchema<TIn, TContext, TDefault, TFlags>,
  path: string,
  options: RequestOptions = {}
) {
  const data = await request(method, path, options);
  const json = await data.json();

  return schema.validate(json);
}

export async function
get<TIn extends yup.Maybe<yup.AnyObject>, TContext, TDefault, TFlags extends yup.Flags>(
  schema: yup.ObjectSchema<TIn, TContext, TDefault, TFlags>,
  path: string,
  options: RequestOptions = {}
) {
  return schemaRequest('get', schema, path, options);
}

export async function
post<TIn extends yup.Maybe<yup.AnyObject>, TContext, TDefault, TFlags extends yup.Flags>(
  schema: yup.ObjectSchema<TIn, TContext, TDefault, TFlags>,
  path: string,
  options: RequestOptions = {}
) {
  return schemaRequest('post', schema, path, options);
}