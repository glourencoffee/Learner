/**
 * Enumerates all the HTTP codes used by this application.
 */
export enum HttpStatusCode {
  // 2xx
  OK         = 200,
  CREATED    = 201,
  NO_CONTENT = 204,
  
  // 4xx
  BAD_REQUEST           = 400,
  NOT_FOUND             = 404,
  METHOD_NOT_ALLOWED    = 405,
  CONFLICT              = 409,
  UNPROCESSABLE_CONTENT = 422,

  // 5xx
  INTERNAL_SERVER_ERROR = 500
};