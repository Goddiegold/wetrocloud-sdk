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

#### **Parameters:**
- `collection_id: string` - (Optional) The unique ID of the collection.

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
- `model?: string` - Optional model parameter.

#### **Return Type:**
```typescript
Promise<IErrorMessage | IQueryResourceCollectionDynamic<T>>
```

#### **Example:**
```typescript
const response = await sdk.queryResources({
    collection_id: "12345",
    request_query: "search query",
    json_schema: { topic: "", description: "" },
    model: "gpt-4"
});
```

### 5. `chatWithCollection<T>()`
Chat with a collection using message history.

#### **Parameters:**
- `collection_id: string` - The ID of the collection.
- `message: string` - The message to send.
- `chat_history: { role: "user" | "system", content: string }[]` - Chat history.

#### **Return Type:**
```typescript
Promise<IErrorMessage | IQueryResourceCollectionDynamic<T>>
```

#### **Example:**
```typescript
const response = await sdk.chatWithCollection({
    collection_id: "12345",
    message: "Hello, how does this work?",
    chat_history: [{ role: "user", content: "Hello" }]
});
```

### 6. `deleteResource()`
Deletes a resource from a collection.

#### **Parameters:**
- `collection_id: string` - The ID of the collection.
- `resource_id: string` - The ID of the resource to delete.

#### **Return Type:**
```typescript
Promise<IGenericResponse | IErrorMessage>
```

#### **Example:**
```typescript
const response = await sdk.deleteResource({
    collection_id: "12345",
    resource_id: "67890"
});
```

### 7. `deleteCollection()`
Deletes an entire collection.

#### **Parameters:**
- `collection_id: string` - The ID of the collection.

#### **Return Type:**
```typescript
Promise<IGenericResponse | IErrorMessage>
```

#### **Example:**
```typescript
const response = await sdk.deleteCollection({
    collection_id: "12345"
});
```

### 8. `categorizeResource<T>()`
Categorizes a resource using predefined categories.

#### **Parameters:**
- `resource: string` - The resource to categorize.
- `type: string` - The type of resource.
- `json_schema: T | T[]` - JSON schema of the resource.
- `categories: string[]` - List of categories.

#### **Return Type:**
```typescript
Promise<ICatergorizeResource<T> | IErrorMessage>
```

#### **Example:**
```typescript
const response = await sdk.categorizeResource({
    resource: "AI-generated text",
    type: "text",
    json_schema: { title: "", content: "" },
    categories: ["AI", "Tech"]
});
```

### 9. `generateTextWithoutRag()`
Generates text without retrieval-augmented generation (RAG).

#### **Parameters:**
- `model: string` - The model to use.
- `messages: { role: "user" | "system" | "assistant", content: string }[]` - Message history.

#### **Return Type:**
```typescript
Promise<IGenericResponse | IErrorMessage>
```

#### **Example:**
```typescript
const response = await sdk.generateTextWithoutRag({
    model: "gpt-4",
    messages: [{ role: "user", content: "Tell me a joke." }]
});
```

### 10. `generateTextFromImage()`
Extracts text from an image.

#### **Parameters:**
- `image_url: string` - The URL of the image.
- `request_query: string` - The query to process the image.

#### **Return Type:**
```typescript
Promise<IGenericResponse | IErrorMessage>
```

#### **Example:**
```typescript
const response = await sdk.generateTextFromImage({
    image_url: "https://example.com/image.jpg",
    request_query: "Extract text from this image."
});
```

### 11. `dataExtractionFromWebsite<T>()`
Extracts structured data from a website.

#### **Parameters:**
- `website_url: string` - The URL of the website.
- `json_schema: T | T[]` - The JSON schema defining the expected structure.

#### **Return Type:**
```typescript
Promise<IDataExtraction<T> | IErrorMessage>
```

#### **Example:**
```typescript
const response = await sdk.dataExtractionFromWebsite({
    website_url: "https://example.com",
    json_schema: { title: "", body: "" }
});
```

## Documentation
For more details, check out the official API documentation: [WetroCloud Docs](https://docs.wetrocloud.com/introduction)

