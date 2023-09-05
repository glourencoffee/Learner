# `/topic`

<!----------------------------------------------------------
-- GET method (many)
----------------------------------------------------------->

## `/topic` (GET)

### Description

Retrieves zero or more topics.

### Request

#### Url params

None.

#### Query params

```ts
{
  areaId?: number
  topicName?: string
}
```

#### Body params

None.

### Response

```ts
{
  topics: {
    areaId: number
    topicId: number
    topicName: string
  }[]
}
```

### Details

Finds all existing topics, optionally filters them by `areaId` and `topicName` if these fields are present, and returns them.

If `areaId` is absent or invalid, returns all topics.


<!----------------------------------------------------------
-- POST method 
----------------------------------------------------------->

## `/topic` (POST)

### Description

Creates a topic.

### Request

#### Url params

None.

#### Query params

None.

#### Body params

```ts
{
  areaId: number
  topicName: string
}
```

### Response

```ts
{
  topicId: number
}
```

### Details

Case-insensitively compares `topicName` to the name of each child of the knowledge area identified by `areaId`. If a match is found, raises `ConflictError`.

Otherwise, creates a topic with name `topicName` under `areaId` and returns the id of that topic.

<!----------------------------------------------------------
-- PUT method 
----------------------------------------------------------->

## `/topic/{topicId}` (PUT)

### Description

Updates a topic.

### Request

#### Url params

```ts
{
  topicId: number
}
```

#### Query params

None.

#### Body params

```ts
{
  areaId: number
  topicName: string
}
```

### Details

If `topicId` does not identify an existing topic or if `areaId` does not identify an existing knowledge area, raises `NotFoundError`.

If that knowledge area has another child whose name case-insensitively matches `topicName`, raises `ConflictError`.

Otherwise, if no exception was raised, changes that topic's name to `topicName` and makes it a child of `areaId`.

<!----------------------------------------------------------
-- GET method (single)
----------------------------------------------------------->

## `/topic/{topicId}` (GET)

### Description

Retrieves one topic.

### Request

#### Url params

```ts
{
  topicId: number
}
```

#### Query params

None.

#### Body params

None.

### Response

```ts
{
  areaId: number
  topicId: number
  topicName: string
}
```

### Details

If `{topicId}` does not identify an existing topic, raises `NotFoundError`.

Otherwise, returns the data of the topic identified by `{topicId}`.

<!----------------------------------------------------------
-- DELETE method (single)
----------------------------------------------------------->

## `/topic/{topicId}` (DELETE)

### Description

Deletes one topic.

### Request

#### Url params

```ts
{
  topicId: number
}
```

#### Query params

None.

#### Body params

None.

### Response

None.

### Details

If `{topicId}` does not identify an existing topic, raises `NotFoundError`.

Otherwise, removes that topic.