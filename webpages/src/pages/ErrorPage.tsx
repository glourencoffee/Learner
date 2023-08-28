import { Navigate } from "react-router-dom";
import ErrorBox from "../components/ErrorBox";

export interface ErrorPageProps {
  error: unknown;
}

/**
 * Renders an error page, whose behavior is as follows:
 * - On production environment, redirects to the home page.
 * - On development environment, renders an `<ErrorBox>`.
 * 
 * @param props The properties of this component.
 */
export default function ErrorPage({ error }: ErrorPageProps): JSX.Element {
  if (import.meta.env.PROD) {
    return <Navigate to='/' />
  }
  else {
    return (
      <ErrorBox error={error} />
    );
  }
}