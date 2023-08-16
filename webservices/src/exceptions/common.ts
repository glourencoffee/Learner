import { HttpStatusCode } from '../utils';

interface HttpErrorArgs {
  status: HttpStatusCode;
  message: string;
  details?: any;
}

/**
 * Thrown if an HTTP error occurs.
 */
export class HttpError extends Error {
  public readonly status: HttpStatusCode;
  public details?: any;

  constructor(args: HttpErrorArgs) {
    super(args.message);

    this.status  = args.status;
    this.details = args.details;

    Error.captureStackTrace(this);
  }
}

/**
 * Specializes `HttpError` for status `HttpStatusCode.BAD_REQUEST`.
 */
export class BadRequestError extends HttpError {
  constructor(message: string, details?: any) {
    super({
      status: HttpStatusCode.BAD_REQUEST,
      message: message,
      details: details
    });

    this.name = 'BadRequestError';
  }
}

/**
 * Specializes `HttpError` for status `HttpStatusCode.NOT_FOUND`.
 */
export class NotFoundError extends HttpError {
  constructor(message: string, details?: any) {
    super({
      status: HttpStatusCode.NOT_FOUND,
      message: message,
      details: details
    });

    this.name = 'NotFoundError';
  }
}

/**
 * Specializes `HttpError` for status `HttpStatusCode.METHOD_NOT_ALLOWED`.
 */
export class MethodNotAllowedError extends HttpError {
  constructor(message: string, details?: any) {
    super({
      status: HttpStatusCode.METHOD_NOT_ALLOWED,
      message: message,
      details: details
    });

    this.name = 'MethodNotAllowedError';
  }
}

/**
 * Specializes `HttpError` for status `HttpStatusCode.CONFLICT`.
 */
export class ConflictError extends HttpError {
  constructor(message: string, details?: any) {
    super({
      status: HttpStatusCode.CONFLICT,
      message: message,
      details: details
    });

    this.name = 'ConflictError';
  }
}

/**
 * Specializes `HttpError` for status `HttpStatusCode.UNPROCESSABLE_CONTENT`.
 */
export class UnprocessableContentError extends HttpError {
  constructor(message: string, details?: any) {
    super({
      status: HttpStatusCode.UNPROCESSABLE_CONTENT,
      message: message,
      details: details
    });

    this.name = 'UnprocessableContentError';
  }
}

/**
 * Specializes `HttpError` for status `HttpStatusCode.INTERNAL_SERVER_ERROR`.
 */
export class InternalServerError extends HttpError {
  constructor(details?: any) {
    super({
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: 'An internal server error occurred',
      details: details
    });

    this.name = 'InternalServerError';
  }
}