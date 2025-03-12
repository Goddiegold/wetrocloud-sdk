# WetroCloud SDK

## Introduction
The **WetroCloud SDK** provides an easy way to interact with the WetroCloud API, allowing developers to create collections, insert resources, and query data effortlessly.

## Installation
```sh
npm install wetrocloud-sdk
```

## Usage
### Importing the SDK
```typescript
import WetroCloud from "wetrocloud-sdk";

const sdk = new WetroCloud({ apiSecret: "your-api-secret" });
```

## Available Methods

### 1. `createCollection()`
Creates a new collection.

#### **Return Type:**
```typescript
Promise<ICreateCollection | IErrorMessage>
```

#### **Example:**
```typescript
const collection = await sdk.createCollection();
```

### 2. `listCollections()`
Retrieves a list of available collections.

#### **Return Type:**
```typescript
Promise<IListCollection[] | IErrorMessage>
```

#### **Example:**
```typescript
const collections = await sdk.listCollections();
```

### 3. `insertResource()`
Inserts a resource into a collection.

#### **Parameters:**
- `collection_id: string` - The ID of the collection.
- `resource: string` - The resource to insert.
- `type: string` - The type of resource.

#### **Return Type:**
```typescript
Promise<IInsertResourceCollection | IErrorMessage>
```

#### **Example:**
```typescript
const response = await sdk.insertResource({
    collection_id: "12345",
    resource: "Sample text",
    type: "text"
});
```

### 4. `queryResources<T>()`
Queries resources from a collection.

#### **Parameters:**
- `collection_id: string` - The ID of the collection.
- `request_query: string` - The query string.
- `json_schema?: T | T[]` - Optional JSON schema.
- `json_schema_rules?: string` - Optional JSON schema rules.

#### **Return Type:**
```typescript
Promise<IErrorMessage | IQueryResourceCollectionDynamic<T>>
```

#### **Example:**
```typescript
const response = await sdk.queryResources({
    collection_id: "12345",
    request_query: "search query",
    json_schema: { topic: "", description: "" }
});
```

## Interfaces

```typescript
export interface ICreateCollection {
    collection_id?: string,
    success: boolean
}

export interface IListCollection {
    collection_id: string,
    created_at: string
}

export interface IErrorMessage {
    message: string
}

export interface IInsertResourceCollection {
    success: boolean,
    token: number
}

export interface IQueryResourceCollectionDynamic<T> {
    response: string | T | T[],
    tokens: number,
    success: boolean
}
```

## Documentation
For more details, check out the official API documentation: [WetroCloud Docs](https://docs.wetrocloud.com/introduction)

