## About

This directory contains the documentation of the API routes implemented by the web services application. Every Markdown file in this directory documents a particular route in the API. Their format is self-explanatory.

## Errors

In case an error is raised, as documented in the section "Error Handling" of each API document, an standard error object is returned in the response body, which has the following properties:

- `path` (string): The route where the error occured.
- `method` (string): The HTTP method requested by the client.
- `error` (object): An object describing the error that has the following properties:
  - `status` (number): The number of the HTTP status code.
  - `name` (string): The name of the error.
  - `message` (string): A message describing the error.
  - `details?` (any): An optional value with details about the error.