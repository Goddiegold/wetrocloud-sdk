import FetchAPI from "./fetchApi";
import {
    ICatergorizeResource,
    ICreateCollection, IDataExtraction, IErrorMessage,
    IGenericResponse,
    IInsertResourceCollection, IListCollection,
    IQueryResourceCollectionDynamic
} from "./types";
import { errorMessage, RequestMethods } from "./utils";


export default class WetroCloud {
    private fetchApi: FetchAPI;

    constructor({ apiSecret }: { apiSecret: string }) {
        this.fetchApi = new FetchAPI({ apiSecret });
    }

    /**
     * Creates a new collection in WetroCloud.
     *
     * @returns {Promise<ICreateCollection | IErrorMessage>} A promise that resolves to an object containing
     * the created collection_id and success status or an error message if the operation fails.
     *
     * @example
     * const collection = await sdk.createCollection();
     */
    public async createCollection(): Promise<ICreateCollection | IErrorMessage> {
        try {
            const res = await this.fetchApi.request({ url: "/collection/", method: RequestMethods.POST, data: {} })
            return res as ICreateCollection;
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

    /**
 * Retrieves a list of all your available collections in WetroCloud.
 *
 * @returns {Promise<IListCollection[] | IErrorMessage>} A promise that resolves to an array of collection objects 
 * containing collection IDs and creation timestamps, or an error message if the request fails.
 *
 * @example
 * const collections = await sdk.listCollections();
 */
    public async listCollections(): Promise<IListCollection[] | IErrorMessage> {
        try {
            const res = await this.fetchApi.request({ url: "/collection/", method: RequestMethods.GET })
            return res?.results as IListCollection[];
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

    /**
 * Inserts a resource into an existing collection in WetroCloud.
 *
 * @param {string} collection_id - The unique identifier of the collection where the resource will be inserted.
 * @param {string} resource - The resource data to be added to the collection.
 * @param {string} type - The type of the resource (e.g., text, file, etc.).
 *
 * @returns {Promise<IInsertResourceCollection | IErrorMessage>} A promise that resolves to an object 
 * containing the success status and a token for tracking, or an error message if the request fails.
 *
 * @example
 * const response = await sdk.insertResource({
 *     collection_id: "12345",
 *     resource: "Sample text",
 *     type: "text"
 * });
 */
    public async insertResource({
        collection_id, resource, type
    }: {
        collection_id: string, resource: string,
        type: string
    }): Promise<IInsertResourceCollection | IErrorMessage> {
        try {
            const res = await this.fetchApi.request({
                url: "/insert/resource/",
                method: RequestMethods.POST,
                data: {
                    collection_id,
                    resource,
                    type
                }
            })
            return res as IInsertResourceCollection
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

    /**
 * Queries resources from a specified collection in WetroCloud.
 *
 * @template T - The expected structure of the queried resources.
 *
 * @param {string} collection_id - The unique identifier of the collection to query from.
 * @param {string} request_query - The search query used to retrieve matching resources.
 * @param {T | T[]} [json_schema] - An optional JSON schema to structure the response data.
 * @param {string} [json_schema_rules] - Optional rules to refine the JSON schema filtering.
 * @param {string} [model] - (Optional) The AI model to use for the query. 
 *                          Defaults to WetroCloud's default model if not provided.
 *                          Check supported models here: https://docs.wetrocloud.com/endpoint-explanations/models
 *
 * @returns {Promise<IErrorMessage | IQueryResourceCollectionDynamic<T>>} 
 * A promise that resolves to the query result containing the response data, token usage,
 * and success status, or an error message if the request fails.
 *
 * @example
 * const response = await sdk.queryResources({
 *     collection_id: "12345",
 *     request_query: "search query",
 *     model:"gpt-4.5-preview",
 *     json_schema: { topic: "", description: "" }
 * });
 */
    public async queryResources<T = string>(
        {
            collection_id,
            request_query,
            json_schema,
            json_schema_rules,
            model
        }:
            {
                collection_id: string,
                request_query: string,
                model?: string,
                json_schema?: T | T[],
                json_schema_rules?: string,
            }): Promise<IErrorMessage | IQueryResourceCollectionDynamic<T>> {
        try {
            const requestData: Record<string, any> = {
                collection_id,
                request_query,
                ...(json_schema ? { json_schema } : {}),
                ...(json_schema_rules ? { json_schema_rules } : {}),
                ...(model ? { model } : {}),

            };
            const res = await this.fetchApi.request({
                url: "/collection/query/",
                method: RequestMethods.POST,
                data: requestData
            })
            return res;
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

    /**
     * Initiates a conversation with a specified collection in WetroCloud.
     *
     * This allows you to chat with your collection and get responses based on the
     * resources added to that collection.
     *
     * @template T - The expected structure of the response (e.g., string or a JSON object).
     *
     * @param {string} collection_id - The unique identifier of the collection to chat with.
     * @param {string} message - The user's message or query.
     * @param {{ role: "user" | "system", content: string }[]} chat_history - The conversation history
     * to maintain context during the chat.
     *
     * @returns {Promise<IErrorMessage | IQueryResourceCollectionDynamic<T>>} 
     * A promise that resolves to the collection's response, token usage, and success status,
     * or an error message if the request fails.
     *
     * @example
     * const response = await sdk.chatWithCollection({
     *     collection_id: "12345",
     *     message: "What do you know about Web3?",
     *     chat_history: [
     *         { role: "user", content: "Tell me about blockchain." },
     *         { role: "system", content: "Blockchain is a decentralized ledger system." }
     *     ]
     * });
     *
     * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/chat
     */
    public async chatWithCollection<T = string>({
        collection_id,
        message,
        chat_history
    }: {
        collection_id: string,
        message: string,
        chat_history: { role: "user" | "system", content: string }[]

    }): Promise<IErrorMessage | IQueryResourceCollectionDynamic<T>> {
        try {
            const requestData: Record<string, any> = {
                collection_id,
                message,
                chat_history
            };
            const res = await this.fetchApi.request({
                url: "/collection/query/",
                method: RequestMethods.POST,
                data: requestData
            })
            return res;
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

    /**
     * Deletes a specific resource from a collection in WetroCloud.
     *
     * This allows you to permanently remove a resource from a specified collection.
     *
     * @param {string} collection_id - The unique identifier of the collection.
     * @param {string} resource_id - The unique identifier of the resource to be deleted.
     *
     * @returns {Promise<IGenericResponse | IErrorMessage>}
     * A promise that resolves to a success message or an error message if the operation fails.
     *
     * @example
     * const response = await sdk.deleteResource({
     *     collection_id: "12345",
     *     resource_id: "67890"
     * });
     *
     * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/remove-resource
     */

    public async deleteResource({ collection_id, resource_id }:
        { collection_id: string, resource_id: string }): Promise<IGenericResponse | IErrorMessage> {
        try {
            const requestData = {
                collection_id,
                resource_id
            };

            const res = await this.fetchApi.request({
                url: "/remove/resource/",
                method: RequestMethods.DELETE,
                data: requestData
            })

            return res;
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

     /**
     * Deletes an entire collection from WetroCloud.
     *
     * This permanently removes the specified collection and all its associated resources.
     *
     * @param {string} collection_id - The unique identifier of the collection to be deleted.
     *
     * @returns {Promise<IGenericResponse | IErrorMessage>}
     * A promise that resolves to a success message or an error message if the operation fails.
     *
     * @example
     * const response = await sdk.deleteCollection({ collection_id: "12345" });
     *
     * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/delete
     */
    public async deleteCollection({ collection_id }: { collection_id: string }):
        Promise<IGenericResponse | IErrorMessage> {
        try {
            const requestData = {
                collection_id
            };

            const res = await this.fetchApi.request({
                url: "/collection/",
                method: RequestMethods.DELETE,
                data: requestData
            })

            return res;

        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

    /**
     * Categorizes a resource in WetroCloud.
     *
     * This allows you to organize a resource into specific categories within a collection
     * based on a provided JSON schema.
     *
     * @template T - The expected structure of the resource.
     *
     * @param {string} resource - The ID or reference of the resource to be categorized.
     * @param {string} type - The type of resource being categorized (e.g., "text", "image", etc.).
     * @param {T | T[]} json_schema - The JSON schema that defines the structure of the resource.
     * @param {string[]} categories - An array of category names to associate the resource with.
     *
     * @returns {Promise<ICatergorizeResource<T> | IErrorMessage>}
     * A promise that resolves to the categorized resource or an error message if the operation fails.
     *
     * @example
     * const response = await sdk.categorizeResource({
     *     resource: "resource_id",
     *     type: "text",
     *     json_schema: { topic: "", description: "" },
     *     categories: ["AI", "Machine Learning"]
     * });
     *
     * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/category
     */
    public async categorizeResource<T>({
        resource,
        type,
        json_schema,
        categories
    }: {
        resource: string,
        type: string,
        json_schema: T | T[]
        categories: string[]

    }): Promise<ICatergorizeResource<T> | IErrorMessage> {
        try {
            const requestData: Record<string, any> = {
                resource,
                type,
                json_schema,
                categories
            };

            const res = await this.fetchApi.request({
                url: "/collection/",
                method: RequestMethods.POST,
                data: requestData
            })

            return res;
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

        /**
     * Generates text using WetroCloud's open-source language models.
     *
     * This endpoint allows you to generate natural language responses without relying on
     * Retrieval-Augmented Generation (RAG), supporting conversational interactions through a
     * message-based format.
     *
     * @param {string} model - The model to be used for text generation (e.g., "gpt-4.5-turbo").
     *                        Check all supported models here: https://docs.wetrocloud.com/endpoint-explanations/models
     * @param {Array<{ role: "user" | "system" | "assistant", content: string }>} messages - An array of messages representing the conversation history.
     *
     * @returns {Promise<IGenericResponse | IErrorMessage>}
     * A promise that resolves to the generated text response or an error message if the request fails.
     *
     * @example
     * const response = await sdk.generateTextWithoutRag({
     *     model: "gpt-4.5-turbo",
     *     messages: [
     *         { role: "user", content: "What's the capital of France?" },
     *         { role: "assistant", content: "Paris." }
     *     ]
     * });
     *
     * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/text-generation
     */

    public async generateTextWithoutRag({
        messages,
        model
    }: {
        model: string,
        messages: { role: "user" | "system" | "assistant", content: string }[]
    }): Promise<IGenericResponse | IErrorMessage> {
        try {
            const requestData: Record<string, any> = {
                messages,
                model
            }

            const res = await this.fetchApi.request({
                url: "/text-generation/",
                method: RequestMethods.POST,
                data: requestData
            })

            return res;
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

    /**
     * Generates text from an image using WetroCloud's image-to-text endpoint.
     *
     * This allows you to analyze an image and ask questions about its content. 
     * Supports both JSON and plain text response formats.
     *
     * @param {string} image_url - The URL of the image to be analyzed.
     * @param {string} request_query - The query or prompt related to the image content.
     *
     * @returns {Promise<IGenericResponse | IErrorMessage>}
     * A promise that resolves to the generated text response or an error message if the request fails.
     *
     * @example
     * const response = await sdk.generateTextFromImage({
     *     image_url: "https://example.com/image.png",
     *     request_query: "What's happening in this image?"
     * });
     *
     * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/image-to-text
     */

    public async generateTextFromImage({
        image_url,
        request_query
    }: {
        image_url: string,
        request_query: string
    }): Promise<IGenericResponse | IErrorMessage> {
        try {
            const requestData: Record<string, any> = {
                image_url,
                request_query
            }

            const res = await this.fetchApi.request({
                url: "/image-to-text/",
                method: RequestMethods.POST,
                data: requestData
            })

            return res;
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

        /**
     * Extracts structured data from a website using WetroCloud's data-extraction endpoint.
     *
     * This allows you to retrieve specific data from a web page in a structured JSON format 
     * based on your predefined JSON schema.
     *
     * @template T - The expected structure of the extracted data.
     *
     * @param {string} website_url - The URL of the website to extract data from.
     * @param {T | T[]} json_schema - The JSON schema to structure the extracted data.
     *
     * @returns {Promise<IDataExtraction<T> | IErrorMessage>}
     * A promise that resolves to the extracted data or an error message if the request fails.
     *
     * @example
     * const response = await sdk.dataExtractionFromWebsite({
     *     website_url: "https://example.com",
     *     json_schema: { title: "", description: "" }
     * });
     *
     * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/data-extraction
     */
    public async dataExtractionFromWebsite<T>({
        website_url,
        json_schema
    }: {
        website_url: string,
        json_schema: T | T[]
    }): Promise<IDataExtraction<T> | IErrorMessage> {
        try {
            const requestData: Record<string, any> = {
                website: website_url,
                json_schema
            }

            const res = await this.fetchApi.request({
                url: "/image-to-text/",
                method: RequestMethods.POST,
                data: requestData
            })

            return res;
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }
}