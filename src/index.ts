import FetchAPI from "./fetchApi";
import {
    ICreateCollection, IErrorMessage,
    IInsertResourceCollection, IListCollection,
    IQueryResourceCollectionDynamic
} from "./types";
import { errorMessage } from "./utils";


export default class WetroCloud {
    private fetchApi: FetchAPI;

    constructor({ apiSecret }: { apiSecret: string }) {
        this.fetchApi = new FetchAPI({ apiSecret });
    }

    /**
     * Creates a new collection in WetroCloud.
     *
     * @returns {Promise<ICreateCollection | IErrorMessage>} A promise that resolves to an object containing
     * the created collection's ID and success status or an error message if the operation fails.
     *
     * @example
     * const collection = await sdk.createCollection();
     */
    public async createColllection(): Promise<ICreateCollection | IErrorMessage> {
        try {
            const res = await this.fetchApi.request({ url: "/create/", method: "post", data: {} })
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
            const res = await this.fetchApi.request({ url: "/collection/", method: "get" })
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
                url: "/insert/",
                method: "post",
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
 *
 * @returns {Promise<IErrorMessage | IQueryResourceCollectionDynamic<T>>} 
 * A promise that resolves to the query result containing the response data, token usage,
 * and success status, or an error message if the request fails.
 *
 * @example
 * const response = await sdk.queryResources({
 *     collection_id: "12345",
 *     request_query: "search query",
 *     json_schema: { topic: "", description: "" }
 * });
 */
    public async queryResources<T>(
        {
            collection_id,
            request_query,
            json_schema,
            json_schema_rules
        }:
            {
                collection_id: string,
                request_query: string,
                json_schema?: T | T[],
                json_schema_rules?: string,
            }): Promise<IErrorMessage | IQueryResourceCollectionDynamic<T>> {
        try {
            const requestData: Record<string, any> = {
                collection_id,
                request_query,
                ...(json_schema ? { json_schema } : {}),
                ...(json_schema_rules ? { json_schema_rules } : {})
            };
            const res = await this.fetchApi.request({
                url: "/query/",
                method: "post",
                data: requestData
            })
            return res;
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }
}