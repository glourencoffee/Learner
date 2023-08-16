import dotenv from 'dotenv';

dotenv.config();

/**
 * Thrown if a required environment variable is missing.
 */
export class MissingEnvironmentVariableError extends Error {
  constructor(varName: string) {
    super(`Missing required environment variable '${varName}'`);

    this.name = 'MissingEnvironmentVariableError';
  }
}

/**
 * Returns the value of the environment variable `varName` if that variable is
 * defined. Throws if that variable is not defined.
 * 
 * @param varName The name of an environment variable.
 * @throws `MissingEnvironmentVariableError` if the environment variable is missing.
 * @returns The value of the environment variable.
 */
function required(varName: string): string {
  if (varName in process.env) {
    return process.env[varName] as string;
  }

  throw new MissingEnvironmentVariableError(varName);
}

/**
 * Returns the value of the environment variable `varName` if that variable
 * is defined, or `undefined` if it is not defined.
 * 
 * @param varName The name of an environment variable.
 * @returns The value of an environment variable or `undefined`.
 */
function optional(varName: string): string | undefined {
  return process.env[varName];
}

/**
 * Returns the value of the environment variable `varName` if that variable 
 * is defined, or `value` if it is not defined.
 * 
 * @param varName The name of an environment variable.
 * @param value A value to fallback to, if the variable is not defined.
 * @returns The value of the environment variable or a fallback value.
 */
function fallback(varName: string, value: string): string {
  if (varName in process.env) {
    return process.env[varName] as string;
  }

  return value;
}

/**
 * Server configuration variables.
 */
const config = {
  db: {
    host:     fallback('DB_HOST', 'localhost'),
    username: required('DB_USER'),
    password: optional('DB_PASS'),
    database: required('DB_NAME')
  },
  server: {
    port: fallback('PORT', '3000')
  }
};

export default config;