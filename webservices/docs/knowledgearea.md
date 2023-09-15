# `/knowledgearea`

<!----------------------------------------------------------
-- POST (top-level)
----------------------------------------------------------->

## `/knowledgearea/toplevel` (POST)

### Description

Creates a top-level knowledge area.

### Request

#### URL Parameters

None.

#### Query Parameters

None.

#### Body Parameters

- `name` (string): The name of a knowledge area.

### Response

- `id` (number): A unique identifier for the newly-created knowledge area.

### Error Handling

- Returns a 409 Conflict response if:
  - `name` case-insensitively matches the name of any top-level knowledge area.

### Details

If no error was raised, creates a top-level knowledge area with name *`name`* and returns a 201 Created with the id of that knowledge area.

### Example

A POST request is made to the route `/knowledgearea` with body:

```json
{
  "name": "Computer Science"
}
```

The response received is:

```json
{
  "id": 1
}
```

Another POST request is made to the route `/knowledgearea` with body:

```json
{
  "name": "Physics"
}
```

The response received is:

```json
{
  "id": 2
}
```

<!----------------------------------------------------------
-- GET (top-level)
----------------------------------------------------------->

## `/knowledgearea/toplevel` (GET)

### Description

Retrieves top-level knowledge areas.

### Request

#### URL Parameters

None.

#### Query Parameters

- `nameFilter?` (string): The name of a knowledge area to filter by. Optional.

#### Body Parameters

None.

### Response

- `areas` (array of objects): An array containing top-level knowledge area objects with the following properties:
  - `id` (number): The ID of the top-level knowledge area.
  - `name` (string): The name of the top-level knowledge area.

### Error Handling

None.

### Details

Finds all top-level knowledge areas. If *`nameFilter`* is present and not empty, filters in only the areas whose name case-insensitively includes the expression *`nameFilter`*.

Finally, the route returns a 200 OK with the areas.

### Example

A GET request is made to the route `/knowledgearea/` with no query params. The response received is:

```json
{
  "areas": [
    {
      "id": 1,
      "name": "Computer Science"
    },
    {
      "id": 2,
      "name": "Physics"
    },
  ]
}
```

Another GET request is made as `/knowledgearea?nameFilter=Computer`.

The response received is:

```json
{
  "areas": [
    {
      "id": 1,
      "name": "Computer Science"
    }
  ]
}
```

<!----------------------------------------------------------
-- POST method (parented)
----------------------------------------------------------->

## `/knowledgearea/{id}` (POST)

### Description

Creates a child knowledge area.

### Request

#### URL Parameters

- `id` (number): The ID of a parent knowledge area.

#### Query Parameters

None.

#### Body Parameters

- `name` (string): The name of the child knowledge area.

### Response

- `id` (number): A unique identifier for the newly-created child knowledge area.

### Error Handling

- Returns a 404 Not Found response if:
  - `id` does not identify a valid knowledge area.
- Returns a 409 Conflict response if:
  - The parent knowledge area identified by `id` already has a child with a name matching `name`.

### Details

If no error was raised, creates a knowledge area with name *`name`* as a child of the parent knowledge area identified by `id`.

Finally, the route returns a 201 Created with the id of the child knowledge area.

### Example

A POST request is made to the route `/knowledgearea/1` with body:

```json
{
  "name": "Computer Programming"
}
```

The response received is:

```json
{
  "id": 3
}
```

Another POST request is made to the route `/knowledgearea/1` with body:

```json
{
  "name": "Computer Network"
}
```

The response received is:

```json
{
  "id": 4
}
```

<!----------------------------------------------------------
-- PUT method (toplevel and parented)
----------------------------------------------------------->

## `/knowledgearea/{id}` (PUT)

### Description

Updates a knowledge area.

### Request

#### URL Parameters

- `id` (number): The ID of a knowledge area.

#### Query Parameters

None.

#### Body Parameters

- `name` (string): The new name of the knowledge area.
- `parentId` (number | null): The new parent of the knowledge area.

### Response

None.

### Error Handling

- Returns a 400 Bad Request response if:
  - `parentId` is `number` and is same as `id`.
- Returns a 404 Not Found response if:
  - `id` does not identify a valid knowledge area.
  - `parentId` is `number` and does not identify a valid knowledge area.
- Returns a 409 Conflict response if:
  - `parentId` is `null` and `name` is already used by another top-level knowledge area.
  - `parentId` is `number` and `name` is already used by another child of the knowledge area identified by `parentId`.

### Details

If no error was raised, updates the knowledge area identified by `id` so that its name is `name` and:
  - if `parentId` is `null`, it becomes a top-level knowledge area, or
  - if `parentId` is `number`, it becomes a child of the knowledge area identified by `parentId`.

Finally, the route returns a 200 OK.

### Example

A PUT request is made to the route `/knowledgearea/3` with body:

```json
{
  "name": "Computer Programming",
  "parentId": 1
}
```

The response received has status 200, indicating that the request succeeded.

<!----------------------------------------------------------
-- GET method (single)
----------------------------------------------------------->

## `/knowledgearea/{id}` (GET)

### Description

Retrieves one knowledge area.

### Request 

#### URL Parameters

- `id` (number): The ID of a knowledge area.

#### Query Parameters

None.

#### Body Parameters

None.

### Response

- `id` (number): The ID of the knowledge area.
- `name` (string): The name of the knowledge area.
- `parentId` (number | null): The parent of knowledge area, if any.

### Error Handling

- Returns a 404 Not Found response if:
  - `id` does not identify a valid knowledge area.

### Details

If no error was raised, returns a 200 OK with the knowledge area identified by `id`.

### Example

A GET request is made to the route `/knowledgearea/1`.

The response received is:

```json
{
  "id": 1,
  "name": "Computer Science",
  "parentId": null
}
```

<!----------------------------------------------------------
-- GET method (single)
----------------------------------------------------------->

## `/knowledgearea/{id}` (DELETE)

### Description

Removes a knowledge area.

### Request

#### URL Parameters

- `id` (number): The ID of a knowledge area.

#### Query Parameters

None.

#### Body Parameters

None.

### Response

None.

### Error Handling

- Returns a 404 Not Found response if:
  - `id` does not identify a valid knowledge area.
- Returns a 405 Method Not Allowed response if:
  - The knowledge area identified by `id` has children.

### Details

If no error was raised, removes the knowledge area identified by `id`.

Finally, the route returns a 204 No Content.

<!----------------------------------------------------------
-- GET method (many parented)
----------------------------------------------------------->

## `/knowledgearea/{id}/children` (GET)

### Description

Retrieves the children of a knowledge area.

### Request

#### URL Parameters

- `id` (number): The ID of a knowledge area.

#### Query Parameters

- `nameFilter?` (string): The name of children to filter by. Optional.
- `type?` ('area' | 'topic'): The type of children to filter by. Optional.

#### Body Parameters

None.

### Response

- `children` (array of objects): An array containing child objects with the following properties:
  - `id` (number): The ID of the child.
  - `name` (string): The name of the child.
  - `type` ('area' | 'topic'): The type of the child, which is `'area'` if the child is a knowledge area or `'topic'` if the child is a topic.

### Error Handling

- Returns a 404 Not Found response if:
  - `id` does not identify a valid knowledge area.

### Details

If no error was raised, finds all children of the knowledge area identified by `id`, and behaves as follows:
- If `nameFilter` is present and not empty, filters in only the children whose name case-insensitively includes `nameFilter`.
- If `type` is present, filters in only the children of that given `type`.

Finally, the route returns a 200 OK with the children.

### Example

A GET request is made to `/knowledgearea/1/children`. The response received is:

```json
{
  "children": [
    {
      "type": "area",
      "id": 3,
      "name": "Computer Programming"
    },
    {
      "type": "area",
      "id": 4,
      "name": "Computer Network"
    }
  ]
}
```

Another GET request is made as `/knowledgearea/1/children?nameFilter=Programming`. The response received is:

```json
{
  "children": [
    {
      "type": "area",
      "id": 3,
      "name": "Computer Programming"
    }
  ]
}
```