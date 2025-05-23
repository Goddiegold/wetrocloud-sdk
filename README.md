# WetroCloud SDK

## Introduction

The **WetroCloud SDK** provides an easy way to interact with the WetroCloud API, allowing developers to create collections, insert resources, and query data effortlessly.

## Installation

```sh

npm install wetro-sdk

```

## Usage

### Importing the SDK

```typescript
import Wetrocloud from "wetro-sdk";

const wetrocloud = new Wetrocloud({ apiKey: "your-api-key" });
```

## Available Methods

### 1. `createCollection()`

Creates a new collection.

#### **Parameters:**

- `collection_id: string` - (Optional) The unique ID of the collection.

#### **Return Type:**

```typescript
Promise<ICreateCollection | IErrorMessage>;
```

#### **Example:**

```typescript
import Wetrocloud from "wetro-sdk";

const wetrocloud = new Wetrocloud();

const collection_id = 'unique_id'; //this is optional if not specified one would be generated for you.
const response = await wetrocloud.createCollection({ collection_id });

console.log("Creating Collection", response);
```

### 2. `listCollections()`

Retrieves a list of available collections.

#### **Return Type:**

```typescript
Promise<IListCollection[] | IErrorMessage>;
```

#### **Example:**

```typescript
import Wetrocloud from "wetro-sdk";
 
const wetrocloud = new Wetrocloud();
const response = await wetrocloud.listCollections();

console.log("Lisiting Collections", response);
```

### 3. `insertResource()`

Inserts a resource into a collection.

#### **Parameters:**

- `collection_id: string` - The ID of the collection.

- `resource: string` - The resource to insert.

- `type: string` - The type of resource.

#### **Return Type:**

```typescript
Promise<IInsertResourceCollection | IErrorMessage>;
```

#### **Example:**

```typescript
import Wetrocloud from "wetro-sdk";

const wetrocloud = new Wetrocloud();
const response = await wetrocloud.insertResource({
  collection_id: "<collection_id>",
  resource: "https://medium.com/@AlexanderObregon/a-brief-history-of-artificial-intelligence-1656693721f9#:~:text=In%20this%20article%2C%20we%20explore,learning%20are%20breaking%20new%20ground.",
  type: "web"
});

console.log("insert a resource", response);
```

### 4. `queryCollection<T>()`

Queries resources from a collection.

#### **Parameters:**

- `collection_id: string` - The ID of the collection.

- `request_query: string` - The query string.

- `json_schema?: T | T[]` - Optional JSON schema.

- `json_schema_rules?: string` - Optional JSON schema rules.

- `model?: string` - Optional model parameter.

- `stream?: boolean` - Optional. Determines whether the response should be streamed. Defaults to `false`.

#### **Return Type:**

```typescript
Promise<IErrorMessage | IQueryResourceCollectionDynamic<T>>;
```

#### **Example:**

```typescript
import Wetrocloud from "wetro-sdk";

const wetrocloud = new Wetrocloud();

const collectionId = '<collection_id>';
const query = 'What are the sales trends for Q1?';

const response = await wetrocloud.queryCollection({
  collection_id: collectionId,
  request_query: query,
});

console.log("Querying resource", response);
```

### 5. `chat<T>()`

Chat with a collection using message history.

#### **Parameters:**

- `collection_id: string` - The ID of the collection.

- `message: string` - The message to send.

- `chat_history: { "role": "user" | "system", "content": string }[]` - Chat history.

- `stream?: boolean` - Optional. Determines whether the response should be streamed. Defaults to `false`.

#### **Return Type:**

```typescript
Promise<IErrorMessage | IQueryResourceCollectionDynamic<T>>;
```

#### **Example:**

```typescript
import Wetrocloud from "wetro-sdk";

const wetrocloud = new Wetrocloud();
const response = await wetrocloud.chat({
 collection_id:"<collection_id>",
 message:"Tell me more",
 chat_history:[
    {"role":"user", "content":"What is this all about?"}, 
    {"role":"system","content":"This is about Queen Elizabeth_II of England"}
 ]
});

console.log("Chat with collection", response);
```

### 6. `deleteResource()`

Deletes a resource from a collection.

#### **Parameters:**

- `collection_id: string` - The ID of the collection.

- `resource_id: string` - The ID of the resource to delete.

#### **Return Type:**

```typescript
Promise<IGenericResponse | IErrorMessage>;
```

#### **Example:**

```typescript
import Wetrocloud from "wetro-sdk";

const wetrocloud = new Wetrocloud();
const response = await wetrocloud.deleteResource({
  collection_id: '<collection_id>',
  resource_id: '<resource_id>'
});

console.log("Deleting resource", response);
```

### 7. `deleteCollection()`

Deletes an entire collection.

#### **Parameters:**

- `collection_id: string` - The ID of the collection.

#### **Return Type:**

```typescript
Promise<IGenericResponse | IErrorMessage>;
```

#### **Example:**

```typescript
import Wetrocloud from "wetro-sdk";

const wetrocloud = new Wetrocloud();
const response = await wetrocloud.deleteCollection({
  collection_id:'<collection_id>',
});

console.log("Deleting collection", response);
```

### 8. `categorize<T>()`

Categorizes a resource using predefined categories.

#### **Parameters:**

- `resource: string` - The resource to categorize.

- `type: string` - The type of resource.

- `json_schema: T | T[]` - JSON schema of the resource.

- `categories: string[]` - List of categories.

- `prompt: string` - An overall command of your request.

#### **Return Type:**

```typescript
Promise<ICatergorizeResource<T> | IErrorMessage>;
```

#### **Example:**

```typescript
import Wetrocloud from "wetro-sdk";

const wetrocloud = new Wetrocloud();

//Categorize content
const response = await wetrocloud.categorize({
    resource: "match review: John Cena vs. The Rock",
    type: "text",
    json_schema: { 'label': '' },
    categories: ["football", "coding", "entertainment", "basketball", "wrestling", "information"],
    prompt: "Where does this fall under?"
  });

  console.log("Categorizing resource", result);
```

### 9. `textGeneration()`

Generates text without retrieval-augmented generation (RAG).

#### **Parameters:**

- `model: string` - The model to use.

- `messages: { role: "user" | "system" | "assistant", content: string }[]` - Message history.

- `stream?: boolean` - Optional. Determines whether the response should be streamed. Defaults to `false`.

#### **Return Type:**

```typescript
Promise<IGenericResponse | IErrorMessage>;
```

#### **Example:**

```typescript
import Wetrocloud from "wetro-sdk";

const wetrocloud = new Wetrocloud();

// Text Generation
const response = await wetrocloud.textGeneration({
  messages: [
      {"role": "system", "content": "You are a helpful assistant."}, 
      {"role": "user", "content": "Write a short poem about technology."}
  ],
  model: "llama-3.3-70b"
})

console.log("Generation without RAG", result);
```

### 10. `imageToText()`

Extracts text from an image.

#### **Parameters:**

- `image_url: string` - The URL of the image.

- `request_query: string` - The query to process the image.

#### **Return Type:**

```typescript
Promise<IGenericResponse | IErrorMessage>;
```

#### **Example:**

```typescript
import Wetrocloud from "wetro-sdk";

const wetrocloud = new Wetrocloud();

const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQBQcwHfud1w3RN25Wgys6Btt_Y-4mPrD2kg&s';
const query = 'What animal is this?';

// Extract text from an image and answer questions about it
const response = await wetrocloud.imageToText({
  image_url: imageUrl,
  request_query: query
})

console.log("Image to text", response);
```

### 11. `extract<T>()`

Extracts structured data from a website.

#### **Parameters:**

- `website_url: string` - The URL of the website.

- `json_schema: T | T[]` - The JSON schema defining the expected structure.

#### **Return Type:**

```typescript
Promise<IDataExtraction<T> | IErrorMessage>;
```

#### **Example:**

```typescript
import Wetrocloud from "wetro-sdk";

const wetrocloud = new Wetrocloud();

const website = "https://www.forbes.com/real-time-billionaires/#7583ee253d78"
const json_schema = [{ "name": "<name of rich man>", "networth": "<amount worth>" }]

// Extract structured data from a website
const response = await wetrocloud.extract({
   website,
  json_schema:
});

console.log("Data extraction", result);
```

Here are the markdown-formatted documentation sections for both `markDownConverter()` and `transcript()` methods, following the format of your `extract<T>()` example:

---

### 12. `markDownConverter()`

Converts a markdown resource (URL or local file) into structured markdown content using WetroCloud.

#### **Parameters:**

* `resource: string` – The markdown file path or URL.
* `resource_type: string` – Type of resource, e.g., `"file"` or `"web"`.

#### **Return Type:**

```ts
Promise<IMarkDown>
```

#### **Example:**

```ts
import Wetrocloud from "wetro-sdk";

const wetrocloud = new Wetrocloud();

const resource = "https://www.forbes.com/real-time-billionaires/#7583ee253d78"; 
const resource_type = "web";

// Convert markdown file to structured markdown
const result = await wetrocloud.markDownConverter({
  resource,
  resource_type
});

console.log("Converted Markdown", result);
```

---

### 13. `transcript()`

Retrieves transcript data from a YouTube video via WetroCloud.

#### **Parameters:**

* `resource: string` – The YouTube video URL.
* `resource_type: 'youtube'` – Must be set to `"youtube"`.

#### **Return Type:**

```ts
Promise<ITrancript>
```

#### **Example:**

```ts
import Wetrocloud from "wetro-sdk";

const wetrocloud = new Wetrocloud();

const resource = "https://www.youtube.com/watch?v=m4qBwGnubew&pp=ygURZ29vZ2xlIGFpIHJlbGVhc2U%3D";
const resource_type = "youtube";

// Retrieve transcript from YouTube video
const result = await wetrocloud.transcript({
  resource,
  resource_type
});

console.log("Transcript result", result);
```

---

Let me know if you want these grouped in a table of contents or need this output styled for a README or documentation website.


## Support

For additional support, please contact support@wetrocloud.com or visit our website [WetroCloud Docs](https://docs.wetrocloud.com/introduction).
