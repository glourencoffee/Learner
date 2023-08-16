import { NextFunction, Request, Response } from 'express';
import { HttpError, InternalServerError } from '../exceptions/common';
import { HttpStatusCode } from '../utils';
import { ValidationError } from 'yup';
import { UnprocessableContentError } from '../exceptions/common';

/**
 * Represents a standard error object which is sent as a response to clients
 * when an error occurs.
 */
interface StandardError {
  path: string;
  method: string;
  error: {
    status: HttpStatusCode;
    name: string;
    message: string;
    details?: any;
  }
}

/**
 * Creates a standard error object from an instance of `HttpError`.
 * 
 * @param httpError An instance of `HttpError`.
 * @param request The request on which the error occurred.
 * @returns A standard error object.
 */
function makeStandardError(httpError: HttpError, request: Request): StandardError {
  return {
    path: request.originalUrl,
    method: request.method,
    error: {
      status:  httpError.status,
      name:    httpError.name,
      message: httpError.message,
      details: httpError.details
    }
  };
}

/**
 * Handles a trusted error, that is, a known error which was thrown by this application.
 * 
 * This function converts `httpError` to a standard error object and sends that object
 * as JSON to the client. The status of the HTTP response is set to `httpError.status`.
 * 
 * @param httpError An HTTP error.
 * @param request The request on which the error occurred.
 * @param response The response associated with `request`.
 */
function handleTrustedError(httpError: HttpError, request: Request, response: Response): void {
  const stdError = makeStandardError(httpError, request);

  response.status(httpError.status).json(stdError);
}

/**
 * Handles a critical error, that is, an unknown error which this application wasn't
 * expecting.
 * 
 * This function handles the unknown error by:
 * - Sending an `InternalServerError` to the client as a standard error JSON object.
 * - Printing `error` to the console.
 * - Exiting the application.
 * 
 * @param error An error.
 * @param request The request on which the error occurred.
 * @param response The response associated with `request`.
 */
function handleCriticalError(error: Error, request: Request, response: Response): void {
  const httpError = new InternalServerError();
  const stdError  = makeStandardError(httpError, request);

  response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(stdError);
  
  console.error(error);
  console.log('Application encountered a critical error. Exiting');

  process.exit(1);
}

/**
 * Handles an error that occurred while processing a request.
 * 
 * @param error An error.
 * @param req The request on which the error occurred.
 * @param res The response associated with `request`.
 */
export function handleError(error: Error, req: Request, res: Response, _: NextFunction): void {
  if (error instanceof ValidationError) {
    // This error is thrown by `yup` if a request's data fails to fit into an schema.
    // Create an HttpError for it and handle it as a trusted error.
    handleTrustedError(new UnprocessableContentError(error.message), req, res);
  }
  else if (error instanceof HttpError) {
    handleTrustedError(error, req, res);
  }
  else {
    handleCriticalError(error, req, res);
  }
}