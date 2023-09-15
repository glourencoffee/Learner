# `/topic`

<!----------------------------------------------------------
-- GET method (many)
----------------------------------------------------------->

## `/topic` (GET)

### Description

Retrieves zero or more topics.

### Request

#### URL Parameters

None.

#### Query Parameters

- `areaId?` (number): The ID of a knowledge area to filter by. Optional.
- `topicName?` (string): The name of a topic to filter by. Optional.

#### Body Parameters

None.

### Response

- `topics` (array of objects): An array containing topic objects with the following properties:
  - `areaId` (number): The ID of the knowledge area which the topic belongs to.
  - `topicId` (number): The ID of the topic.
  - `topicName` (string): The name of the topic.

### Error Handling

None.

### Details

Finds all topics and filters them by `areaId` and `topicName` if these parameters are present. If these parameters are absent, no filtering is applied.

Finally, returns a 200 OK with the topics.

<!----------------------------------------------------------
-- POST method 
----------------------------------------------------------->

## `/topic` (POST)

### Description

Creates a topic.

### Request

#### URL Parameters

None.

#### Query Parameters

None.

#### Body Parameters

- `areaId` (number): The ID of a knowledge area.
- `topicName` (string): The name of the new topic.

### Response

- `topicId` (number): A unique identifier for the newly-created topic.

### Error Handling

- Returns a 409 Conflict response if:
  - `topicName` case-insensitively matches the name of any child of the knowledge area identified by `areaId`.

### Details

If no error was raised, creates a topic with name `topicName` under the knowledge area identified by `areaId`.

Finally, returns a 201 Created with the id of that topic.

<!----------------------------------------------------------
-- PUT method 
----------------------------------------------------------->

## `/topic/{topicId}` (PUT)

### Description

Updates a topic.

### Request

#### URL Parameters

- `topicId` (number): The ID of a topic.

#### Query Parameters

None.

#### Body Parameters

- `areaId` (number): The ID of a knowledge area.
- `topicName` (string): The name of the new topic.

### Response

None.

### Error Handling

- Returns a 404 Not Found response if:
  - `topicId` does not identify a valid topic.
  - `areaId` does not identify a valid knowledge area.
- Returns a 409 Conflict response if:
  - `topicName` case-insensitively matches the name of any child of the knowledge area identified by `areaId`.

### Details

If no error was raised, updates the topic identified by `topicId` so that its name is `topicName` and that it becomes a child of the knowledge area identified by `areaId`.

Finally, the route returns a 200 OK.

<!----------------------------------------------------------
-- GET method (single)
----------------------------------------------------------->

## `/topic/{topicId}` (GET)

### Description

Retrieves one topic.

### Request

#### URL Parameters

- `topicId` (number): The ID of a topic.

#### Query Parameters

None.

#### Body Parameters

None.

### Response

- `areaId` (number): The ID of a knowledge area.
- `topicId` (number): The ID of a topic.
- `topicName` (string): The name of the new topic.

### Error Handling

- Returns a 404 Not Found response if:
  - `topicId` does not identify a valid topic.

### Details

If no error was raised, returns a 200 OK with the topic identified by `topicId`.

<!----------------------------------------------------------
-- DELETE method (single)
----------------------------------------------------------->

## `/topic/{topicId}` (DELETE)

### Description

Deletes one topic.

### Request

#### URL Parameters

- `topicId` (number): The ID of a topic.

#### Query Parameters

None.

#### Body Parameters

None.

### Response

None.

### Error Handling

- Returns a 404 Not Found response if:
  - `topicId` does not identify a valid topic.

### Details

If no error was raised, removes that topic and returns a 204 No Content.