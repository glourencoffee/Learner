interface RequestErrorArgs {
  path: string;
  method: string;
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}

/**
 * Thrown if the server sends an error as response to a request.
 */
export class RequestError extends Error {
  public readonly path: string;
  public readonly method: string;
  public readonly status: number;
  public readonly details?: any;

  constructor(args: RequestErrorArgs) {
    super(args.error.message);

    this.name    = `RequestError("${args.error.name}")`;
    this.path    = args.path;
    this.method  = args.method;
    this.status  = args.error.status;
    this.details = args.error.details;
  }

  toString(): string {
    const message = (
      `A ${this.method} request to URL path '${this.path}' returned ` + 
      `an error '${this.name}' with HTTP status ${this.status}: ${this.message}`
    );

    if (this.details !== undefined) {
      return message + ` (details: ${this.details})`;
    }
    else {
      return message;
    }
  }
};