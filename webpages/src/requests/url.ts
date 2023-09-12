import urlJoin from 'url-join';
import queryString from 'query-string';

function makeWebservicesUrl() {
  let host = import.meta.env.VITE_WEBSERVICES_HOST;
  
  if (host === undefined) {
    console.warn(
      'The host address of the webservices server is not defined. ' +
      'If this is not intentional, define the environment variable ' +
      "'VITE_WEBSERVICES_HOST' to point to the webservices host address. " +
      "Defaulting to 'localhost'."
    );

    host = 'localhost';
  }
  
  let port = import.meta.env.VITE_WEBSERVICES_PORT;

  if (port === undefined) {
    console.warn(
      'The host port of the webservices server is not defined. ' +
      'If this is not intentional, define the environment variable ' +
      "'VITE_WEBSERVICES_PORT' to point to the webservices host port. " +
      "Defaulting to 3000."
    );

    port = 3000;
  }

  return `http://${host}:${port}`;
}

export const WEBSERVICES_URL = makeWebservicesUrl();

export function makeCompleteUrl(path: string, queryParams?: object) {
  const urlParts = [
    WEBSERVICES_URL,
    path
  ];

  if (queryParams !== undefined) {
    urlParts.push('?' + queryString.stringify(queryParams, { arrayFormat: 'bracket' }));
  }
  
  return urlJoin(urlParts);
}