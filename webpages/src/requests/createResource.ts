import { PromiseWrapper } from './PromiseWrapper';

export interface Resource<T> {
  data: PromiseWrapper<T>;
}

export type ResourceOf<PromiseFunctionType extends (...args: any[]) => Promise<any>> = (
  Resource<Awaited<ReturnType<PromiseFunctionType>>>
);

export function createResource<T>(promise: Promise<T> | (() => Promise<T>)): Resource<T> {
  return {
    data: new PromiseWrapper(
      typeof promise === 'function'
      ? promise()
      : promise
    )
  };
}