import {
  Alert,
  AlertTitle
} from '@mui/material';
import { RequestError } from '../requests/RequestError';
import React from 'react';
import ErrorBox from './ErrorBox';

function getErrorTitle(error: unknown | Error): string {
  return (error instanceof Error) ? error.name : 'Unknown Error';
}

export interface ErrorAlertProps {
  /**
   * An error.
   */
  error: unknown | Error | RequestError;

  /**
   * Which text to show in a Material UI `<AlertTitle>`, if any.
   * 
   * If `undefined`, does not show a title.
   * 
   * If `'fixed'`, shows "Error" as title.
   * 
   * If `'error-name'`, shows the name of the error as title
   * or "Unknown Error" if the error is unknown.
   * 
   * @default undefined
   */
  title?: 'error-name' | 'fixed';

  /**
   * An action to be used with Material UI `Alert`.
   * 
   * @default undefined
   */
  action?: React.ReactNode;
}

/**
 * Error alert shown in development environment.
 */ 
function ErrorAlertForDevelopment({ error, action }: ErrorAlertProps): JSX.Element {
  return (
    <Alert severity='error' action={action}>
      <AlertTitle sx={{
        overflowWrap: 'break-word'
      }}>
        { getErrorTitle(error) }
      </AlertTitle>
      <ErrorBox
        error={error}
        padding={0}
        backgroundColor='inherit'
        section={{
          titleColor: 'inherit'
        }}
      />
    </Alert>
  );
}

/**
 * Error alert shown in production environment.
 * 
 * Uses all `ErrorAlertProps`, as given to the public `<ErrorAlert>` component.
 */ 
function ErrorAlertForProduction({ error, title, action }: ErrorAlertProps): JSX.Element {
  let titleElement;

  switch (title) {
    case 'error-name':
      titleElement = <AlertTitle>{getErrorTitle(error)}</AlertTitle>;
      break;
    
    case 'fixed':
      titleElement = <AlertTitle>Error</AlertTitle>;
      break;
  }

  return (
    <Alert severity='error' action={action}>
      {titleElement}
      {String(error)}
    </Alert>
  );
}

/**
 * Renders a Material UI `<Alert>` for an error.
 * 
 * In production environment, renders a simple error alert
 * which has `String(props.error)` as the alert's message,
 * and optionally a title if `props.title` is set.
 * 
 * In development environment, shows a very descriptive error
 * message with `<ErrorBox>`.
 * 
 * @param props The properties of this component.
 * @see `<ErrorBox>`
 */
const ErrorAlert = (
  import.meta.env.PROD
  ? ErrorAlertForProduction
  : ErrorAlertForDevelopment
);

export default ErrorAlert;