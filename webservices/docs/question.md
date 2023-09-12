# `/question`

<!----------------------------------------------------------
-- GET method (many)
----------------------------------------------------------->

## `/question` (GET)

### Description

Retrieves zero or more questions.

### Request

#### URL Parameters

None.

#### Query Parameters

- `questionType?` ('boolean' | 'multiple-choice'): An optional filter by question type.
- `questionText?` (string): An optional filter by question text.
- `difficultyLevels?` (array of 'easy' | 'medium' | 'hard'): An optional filter by difficulty levels.
- `topicIds?` (array of number): An optional filter by topic ids.

#### Body Parameters

None.

### Response

- `questions` (array of objects): An array containing question objects with the following properties:
  - `questionId` (number): The unique identifier for the question.
  - `questionType` ('boolean' | 'multiple-choice'): The type of the question, indicating whether it's a boolean or multiple-choice question.
  - `questionText` (string): A Markdown text that users will read to answer the question.
  - `options` (array of strings): A list of options from which users can choose their answer.
  - `correctOptionIndex` (number): The index of the correct answer within the options array.
  - `explanationText` (string): A Markdown text explaining the question.
  - `difficultyLevel` ('easy' | 'medium' | 'hard'): An indicator of the question's difficulty level.
  - `topicIds` (array of numbers): An array of IDs identifying the topics associated with the question.

### Details

Finds all questions and filters them based on the given query parameters, as follows: 
  - If `questionType` is `'boolean'`, includes only boolean (true-or-false) questions. If it is `'multiple-choice'`, includes only multiple-choice questions. Otherwise, if absent, includes questions of both types.
  - If `questionText` is present and not empty, includes only questions whose text contain the value of that field. Otherwise, if absent, includes questions containing any text.
  - If `difficultyLevels` is present, includes only questions matching the difficulty levels. Otherwise, if absent, includes questions of any difficulty level.
  - If `topicIds` is present, includes only questions which are associated with at least one of the topics in that list. Otherwise, includes questions of all topics.

Finally, returns the questions after filtering is applied. If no filtering is applied, all questions are returned.

<!----------------------------------------------------------
-- POST method 
----------------------------------------------------------->

## `/question/` (POST)

### Description

Creates a question.

### Request

#### URL Parameters

None.

#### Query Parameters

None.

#### Body Parameters

- `questionText` (string): A Markdown text that users will read to answer the question.
- `options` (string[]): A list of options from which a user may choose their answer.
- `correctOptionIndex` (number): Refers to the index of the option that is the correct answer to the question.
- `explanationText` (string): A Markdown text explaining the question.
- `difficultyLevel` ('easy' | 'medium' | 'hard'): An indicator of the question's difficulty.
- `topicIds` (number[]): A list of IDs identifying the topics with which the question will be associated.

### Response

- `questionId` (number): The ID of the newly-created question.

### Error Handling

- Returns a 422 Unprocessable Content response if:
  - `questionText` or `explanationText` has more than 2000 characters.
  - `options` has a length less than 2 or greater than 5.
  - Any string in `options` has more than 500 characters.
  - `correctOptionIndex` is out of bounds of the `options` array.
  - `topicIds` is empty.
  - Any ID in `topicIds` does not identify a valid topic.

### Details

If no error was raised, the route creates a question with the given body parameters.

The contents of the `options` array are analyzed to determine the question type:
- If there are exactly two options, and one is a case-insensitive match for "True" and the other for "False," the question is marked as a boolean question.
- Otherwise, it's treated as a multiple-choice question.

Finally, the route returns a 201 Created with the ID of the newly-created question.

<!----------------------------------------------------------
-- PUT method
----------------------------------------------------------->

## `/question/{questionId}` (PUT)

### Description

Updates a question.

### Request

#### URL Parameters

- `questionId` (number): The ID of a question.

#### Query Parameters

None.

#### Body Parameters

- `questionText` (string): A Markdown text that users will read to answer the question.
- `options` (string[]): A list of options from which a user may choose their answer.
- `correctOptionIndex` (number): Refers to the index of the option that is the correct answer to the question.
- `explanationText` (string): A Markdown text explaining the question.
- `difficultyLevel` ('easy' | 'medium' | 'hard'): An indicator of the question's difficulty.
- `topicIds` (number[]): A list of IDs identifying the topics with which the question will be associated.

### Response

None.

### Error Handling

- Returns a 404 Not Found response if:
  - `questionId` does not identify a valid question.
- Returns a 422 Unprocessable Content response if:
  - `questionText` or `explanationText` has more than 2000 characters.
  - `options` has a length less than 2 or greater than 5.
  - Any string in `options` has more than 500 characters.
  - `correctOptionIndex` is out of bounds of the `options` array.
  - `topicIds` is empty.
  - Any ID in `topicIds` does not identify a valid topic.

### Details

If no error was raised, the route updates the question identified by `questionId` with the given body parameters.

The contents of the `options` array are analyzed to determine the question type:
- If there are exactly two options, and one is a case-insensitive match for "True" and the other for "False," the question is marked as a boolean question.
- Otherwise, it's treated as a multiple-choice question.

Finally, the route returns a 200 OK.

<!----------------------------------------------------------
-- GET method (single)
----------------------------------------------------------->

## `/question/{questionId}` (GET)

### Description

Retrieves one question.

### Request

#### URL Parameters

- `questionId` (number): The ID of a question.

#### Query Parameters

None.

#### Body Parameters

None.

### Response

- `questionId` (number): The unique identifier for the question.
- `questionType` ('boolean' | 'multiple-choice'): The type of the question, indicating whether it's a boolean or multiple-choice question.
- `questionText` (string): A Markdown text that users will read to answer the question.
- `options` (array of strings): A list of options from which users can choose their answer.
- `correctOptionIndex` (number): The index of the correct answer within the options array.
- `explanationText` (string): A Markdown text explaining the question.
- `difficultyLevel` ('easy' | 'medium' | 'hard'): An indicator of the question's difficulty level.
- `topicIds` (array of numbers): An array of IDs identifying the topics associated with the question.

### Error Handling

- Returns a 404 Not Found response if:
  - `questionId` does not identify a valid question.

### Details

If no error was raised, returns a 200 OK with the data of the question identified by `{questionId}`.

<!----------------------------------------------------------
-- DELETE method
----------------------------------------------------------->

## `/question/{questionId}` (DELETE)

### Description

Deletes one topic.

### Request

#### URL Parameters

- `questionId` (number): The ID of a question.

#### Query Parameters

None.

#### Body Parameters

None.

### Response

None.

### Error Handling

- Returns a 404 Not Found response if:
  - `questionId` does not identify a valid question.

### Details

If no error was raised, removes the question identified by `questionId` and returns a 204 No Content.