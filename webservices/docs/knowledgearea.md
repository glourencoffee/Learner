# `/knowledgearea`

<!----------------------------------------------------------
-- POST (top-level)
----------------------------------------------------------->

## `/knowledgearea/toplevel` (POST)

### Description

Creates a top-level knowledge area.

### Request

#### Url params

None.

#### Query params

None.

#### Body params

- *`name`*`: `**`string`**

### Response

- *`id`*`: `**`number`**

### Details

Case-insensitively compares *`name`* to the name of each existing top-level knowledge area. If a match is found, raises `ConflictError`.

Otherwise, creates a top-level knowledge area with name *`name`* and returns the id of that knowledge area.

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

#### Url params

None.

#### Query params

- *`nameFilter?`*`: `**`string`**

#### Body params

None.

### Response

- *`areas`*`: `**`object[]`**
  - *`id`*`: `**`number`**
  - *`name`*`: `**`string`**

### Details

If *`nameFilter`* is absent or empty, returns all top-level knowledge areas.

Otherwise, finds and returns all top-knowledge areas whose name case-insensitively includes *`nameFilter`*.

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

#### Url params

- *`{id}`*`: `**`number`**

#### Query params

None.

#### Body params

- *`name`*`: `**`string`**

### Response

- *`id`*`: `**`number`**

### Details

If *`{id}`* does not identify an existing knowledge area, raises `NotFoundError`.

Otherwise, case-insensitively compares *`name`* to the name of each child of the knowledge area identified by `{id}`. If a match is found, raises `ConflictError`.

Otherwise, creates a knowledge area with name *`name`* as a child of that parent knowledge area and returns the id of the new knowledge area.

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

## `/knowledgearea/`*`{id}`* (PUT)

### Description

Updates a knowledge area.

### Request

#### Url params

- *`{id}`*`: `**`number`**

#### Query params

None.

#### Body params

- *`name`*`: `**`string`**
- *`parentId`*`: `**`number | null`**

### Response

None.

### Details

If *`{id}`* does not identify an existing knowledge area, raises `NotFoundError`.

If the value type of *`parentId`* is `null`, behaves as follows:
- If *`name`* is already used by another top-level knowledge area, raises `ConflictError`.
- Otherwise, updates the knowledge area identified by *`{id}`* so that:
  - its name becomes *`name`*, and
  - it has no parent, becoming a top-level knowledge area.

Conversely, if the value type of *`parentId`* is `number`, behaves as follows:
- If *`parentId`* does not identify an existing knowledge area, raises `NotFoundError`.
- If *`parentId`* is same as *`{id}`*, raises `BadRequestError`.
- If *`name`* is already used by another child of the knowledge area identified by *`parentId`*, raises `ConflictError`.
- Otherwise, if no exception was raised, updates the knowledge area identified by *`{id}`* so that:
  - its name becomes *`name`*, and
  - it becomes a child of the knowledge area identified by *`parentId`*.

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

## `/knowledgearea/`*`{id}`* (GET)

### Description

Retrieves one knowledge area.

### Request 

#### Url params

- *`{id}`*`: `**`number`**

#### Query params

None.

#### Body params

None.

### Response

- *`id`*`: `**`number`**
- *`name`*`: `**`string`**
- *`parentId`*`: `**`number | null`**

### Details

If *`{id}`* does not identify an existing knowledge area, raises `NotFoundError`.

Otherwise, returns the information of the knowledge area identified by *`{id}`*.

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

## `/knowledgearea/`*`{id}`* (DELETE)

### Request

#### Url params

- *`{id}`*`: `**`number`**

#### Query params

None.

#### Body params

None.

### Response

None.

### Description

Removes a knowledge area.

### Details

If *`{id}`* does not identify an existing knowledge area, raises `NotFoundError`.

If the knowledge area identified by *`{id}`* has any children, raises `MethodNotAllowedError`.

Otherwise, removes that knowledge area.

<!----------------------------------------------------------
-- GET method (many parented)
----------------------------------------------------------->

## `/knowledgearea/`*`{id}`*`/children` (GET)

### Description

Retrieves the children of a knowledge area.

### Request

#### Url params

- *`{id}`*`: `**`number`**

#### Query params

- *`nameFilter?`*`: `**`string`**

#### Body params

None.

### Response

- *`children`*`: `**`object[]`**
  - *`id`*`: `**`number`**
  - *`name`*`: `**`string`**

### Details

If *`{id}`* does not identify an existing knowledge area, raises `NotFoundError`.

Otherwise, finds all children of the knowledge area identified by *`{id}`*, and behaves as follows:
- If *`nameFilter`* is absent or empty, returns all those children.
- Otherwise, returns only the children whose name case-insensitively includes *`nameFilter`*.

### Example

A GET request is made to `/knowledgearea/1/children`. The response received is:

```json
{
  "children": [
    {
      "id": 3,
      "name": "Computer Programming"
    },
    {
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
      "id": 3,
      "name": "Computer Programming"
    }
  ]
}
```