export type PromiseWrapperStatus = 'pending' | 'success' | 'error';

/**
 * Wraps a promise to be used with React `<Suspense>`.
 */
export class PromiseWrapper<Result> {
  private status: PromiseWrapperStatus;
  private result: any;
  private suspender: any;

  /**
   * A promise to execute.
   * 
   * @param promise 
   */
  constructor(promise: Promise<Result>) {
    this.status = 'pending';
    this.suspender = promise.then(
      (res) => {
        this.status = 'success';
        this.result = res;
      },
      (err) => {
        this.status = 'error';
        this.result = err;
      }
    );
  }

  getStatus(): PromiseWrapperStatus {
    return this.status;
  }

  /**
   * Reads the result of the promise, or throws an error.
   * 
   * @throws A promise, if `getStatus()` is `'pending'`.
   * @throws An error from the rejected promise, if `getStatus()` is `'error'`.
   * @returns The result of the promise, if `getStatus()` is `'success'`.
   */
  read(): Result {
    switch (this.status) {
      case 'pending': throw this.suspender;
      case 'error':   throw this.result;
      case 'success': return this.result as Result;
    }
  }
}