# `/answer`

<!----------------------------------------------------------
-- POST method
----------------------------------------------------------->

## `/answer` (POST)

### Description

Creates an answer.

### Request

#### URL Parameters

None.

#### Query Parameters

None.

#### Body Parameters

- `optionId` (number): The unique identifier of a question option.

### Response

- `answerId` (number): The unique identifier of an answer.
- `isCorrectOption` (boolean): A boolean defining whether the answer matches the correct option for the question.

### Error Handling

- Returns a 404 Not Found response if:
  - `optionId` does not identify a valid option.

### Details

If no error was raised, the route creates an answer for the question associated with `optionId`.

Finally, the route returns a 201 Created with the ID of the newly-created answer and a boolean indicating if the answer is correct.

<!----------------------------------------------------------
-- GET method (many)
----------------------------------------------------------->

## `/answer` (GET)

### Description

Retrieves zero or more answers.

### Request

#### URL Parameters

None.

#### Query Parameters

- `questionId?` (number): The ID of a question.

#### Body Parameters

None.

### Response

- `answers` (array of objects): An array containing answer objects with the following properties:
  - `answerId` (number): The unique identifier for the answer.
  - `questionId` (number): The id of the question which the answer is associated with.
  - `optionId` (number): The id of the chosen option.
  - `optionText` (string): The text of the chosen option.
  - `isCorrect` (boolean): Whether the answer is correct.
  - `createdAt` (number): The timestamp for when the answer was created.

### Details

Finds all answers. If the parameter `questionId` is present, filters them to include only answers associated with the question identified by `questionId`.

Finally, returns a 200 OK with the answers, after filtering is applied. If no filtering is applied, all answers are returned.

<!----------------------------------------------------------
-- DELETE method (many)
----------------------------------------------------------->

## `/answer/` (DELETE)

### Description

Deletes many answers.

### Request

#### URL Parameters

None.

#### Query Parameters

- `questionId` (number): The ID of a question.

#### Body Parameters

None.

### Response

None.

### Error Handling

- Returns a 404 Not Found response if:
  - `questionId` does not identify a valid question.

### Details

If no error was raised, removes all answers associated with the question identified by `questionId` and returns a 204 No Content.

<!----------------------------------------------------------
-- GET method (single)
----------------------------------------------------------->

## `/answer/{answerId}` (GET)

### Description

Retrieves one answer.

### Request

#### URL Parameters

- `answerId` (number): The ID of an answer.

#### Query Parameters

None.

#### Body Parameters

None.

### Response

- `answerId` (number): The unique identifier for the answer.
- `questionId` (number): The id of the question which the answer is associated with.
- `optionId` (number): The id of the chosen option.
- `optionText` (string): The text of the chosen option.
- `isCorrect` (boolean): Whether the answer is correct.
- `createdAt` (number): The timestamp for when the answer was created.

### Error Handling

- Returns a 404 Not Found response if:
  - `answerId` does not identify a valid answer.

### Details

If no error was raised, returns a 200 OK with data about the answer identified by `answerId`.

<!----------------------------------------------------------
-- DELETE method (single)
----------------------------------------------------------->

## `/answer/{answerId}` (DELETE)

### Description

Deletes one answer.

### Request

#### URL Parameters

- `answerId` (number): The ID of an answer.

#### Query Parameters

None.

#### Body Parameters

None.

### Response

None.

### Error Handling

- Returns a 404 Not Found response if:
  - `answerId` does not identify a valid answer.

### Details

If no error was raised, removes the answer identified by `answerId` and returns a 204 No Content.