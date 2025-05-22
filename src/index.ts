import axios from "axios";
import _FormData from 'form-data';
import * as fs from "fs";
import path from "path";
import { Readable } from "stream";
import AxiosAPI from "./axiosApi.js";
import Config from "./config.js";
import {
    ICatergorizeResource,
    ICreateCollection, IDataExtraction, IErrorMessage,
    IGenericResponse,
    IInsertResourceCollection, IListCollection,
    IMarkDown,
    IQueryResourceCollectionDynamic
} from "./types/index.js";
import { errorMessage, generateRandomString, RequestMethods } from "./utils.js";


class Wetrocloud {
    private axiosApi: AxiosAPI;

    constructor({ apiKey }: { apiKey: string }) {
        if (!apiKey) throw new Error("apiKey is required!")
        this.axiosApi = new AxiosAPI({ apiKey });
    }

    /**
     * Creates a new collection in WetroCloud.
     * @param {string} [collection_id] - (Optional) The unique identifier of the collection where the resource will be inserted. 
     * If not provided, a random ID will be generated
     * @returns {Promise<ICreateCollection | IErrorMessage>} A promise that resolves to an object containing
     * the created collection_id and success status or an error message if the operation fails.
     *
     * @example
     * const collection = await sdk.createCollection();
     * 
     * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/create
     * 
     */
    public async createCollection({ collection_id }: { collection_id?: string }): Promise<ICreateCollection | IErrorMessage> {
        try {
            const formData = new FormData()
            formData.append("collection_id", collection_id || generateRandomString(15))
            const res = await this.axiosApi.request({
                url: "/collection/create/",
                method: RequestMethods.POST,
                data: formData
            })
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
     * 
     * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/list-collections
     * 
     */
    public async listCollections(): Promise<IListCollection[] | IErrorMessage> {
        try {
            const res = await this.axiosApi.request({
                url: "/collection/all/",
                method: RequestMethods.GET
            })
            return res?.results as IListCollection[];
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

    /**
     * Inserts a resource into an existing collection in WetroCloud.
     *
     * @param {string} collection_id - The unique identifier of the collection where the resource will be inserted.
     * @param {string} resource - The the resource to be categorized: local file - e.g ./resource.pdf, remote file - e.g https://s3.amazon/dog.pdf", "plain text",
     * @param {string} type - The type of the resource (web, file, text, json, youtube).
     *
     * @returns {Promise<IInsertResourceCollection | IErrorMessage>} A promise that resolves to an object 
     * containing the success status and a token for tracking, or an error message if the request fails.
     *
     * @example
     * const response = await sdk.insertResource({
     *     collection_id: "12345",
     *     resource: "./data.pdf",
     *     type: "text"
     * });
     * 
     * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/insert
     */
    public async insertResource({
        collection_id, resource, type
    }: {
        collection_id: string, resource: string,
        type: string
    }): Promise<IInsertResourceCollection | IErrorMessage> {
        try {
            let finalResource = resource;
            let finalType = type;

            if (!resource.startsWith("https://") && finalType === "file") {
                const formData = new _FormData()
                // const fileStream = fs.createReadStream(`${__dirname}/${resource}`);
                const fileStream = fs.createReadStream(`${process.cwd()}/${resource}`);
                formData.append("file", fileStream as unknown as Blob, path.basename(resource))
                formData.append("collection_id", collection_id)
                const uploadFileRes = await axios.post(`${Config.WETROCLOUD.UPLOAD_URL}/upload/`, formData, {
                    headers: formData.getHeaders()
                })
                finalResource = uploadFileRes?.data?.url
                finalType = "file";
            }

            const res = await this.axiosApi.request({
                url: "/resource/insert/",
                method: RequestMethods.POST,
                data: {
                    collection_id,
                    resource: finalResource,
                    type: finalType,
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
 * @param {boolean} [stream=false] - Optional. Determines whether the response should be streamed. Defaults to `false`.
 *
 * @returns {Promise<IErrorMessage | IQueryResourceCollectionDynamic<T>>} 
 * A promise that resolves to the query result containing the response data, token usage,
 * and success status, or an error message if the request fails.
 *
 * @example
 * const response = await queryCollection({
 *     collection_id: "12345",
 *     request_query: "search query",
 *     model:"gpt-4.5-preview",
 *     json_schema: { topic: "", description: "" }
 * });
 * 
 * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/query
 */
    public async queryCollection<T>(
        {
            collection_id,
            request_query,
            json_schema,
            json_schema_rules,
            model,
            stream
        }:
            {
                collection_id: string,
                request_query: string,
                model?: string,
                json_schema?: T | T[],
                json_schema_rules?: string,
                stream?: boolean
            }): Promise<IErrorMessage | IQueryResourceCollectionDynamic<T> | unknown> {
        try {
            type json_schema_type = typeof json_schema;
            const requestData: Record<string, any> = {
                collection_id,
                request_query,
                ...(json_schema ? { json_schema: JSON.stringify(json_schema) } : {}),
                ...(json_schema_rules ? { json_schema_rules } : {}),
                ...(model ? { model } : {}),
                // stream
            };
            const res = await this.axiosApi.request({
                url: "/collection/query/",
                method: RequestMethods.POST,
                data: requestData,
                ...(stream ? { responseType: "stream" } : {})
            })

            const resultStream = res as Readable;

            if (stream) {
                return (async function* () {
                    let buffer = "";
                    for await (const chunk of resultStream) {
                        buffer += chunk.toString();
                        let parts = buffer.split("\n");

                        // Process complete JSON lines
                        while (parts.length > 1) {
                            const jsonPart = parts.shift();
                            if (jsonPart?.trim()) {
                                try {
                                    yield JSON.parse(jsonPart) as T;
                                } catch (e) {
                                    console.error("Error parsing JSON chunk:", jsonPart, e);
                                }
                            }
                        }

                        // Keep the last part (it might be incomplete)
                        buffer = parts.join("\n");
                    }

                    // Process any remaining buffered data
                    if (buffer.trim()) {
                        try {
                            yield JSON.parse(buffer) as T;
                        } catch (e) {
                            console.error("Error parsing final JSON chunk:", buffer, e);
                        }
                    }
                })();
            }

            return { ...(res || {}), response: res?.response as json_schema_type };
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
     * @param {boolean} [stream=false] - Optional. Determines whether the response should be streamed. Defaults to `false`.
     * 
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
    public async chat<T = string>({
        collection_id,
        message,
        chat_history,
        stream
    }: {
        collection_id: string,
        message: string,
        chat_history: { role: "user" | "system", content: string }[],
        stream?: boolean

    }): Promise<IErrorMessage | IQueryResourceCollectionDynamic<T> | unknown> {
        try {
            const requestData: Record<string, any> = {
                collection_id,
                message,
                chat_history
            };
            const res = await this.axiosApi.request({
                url: "/collection/chat/",
                // url: "/collection/query/",
                method: RequestMethods.POST,
                data: requestData,
                ...(stream ? { responseType: "stream" } : {})

            })


            if (stream) {
                const resultStream = res as Readable;
                return (async function* () {
                    let buffer = "";
                    for await (const chunk of resultStream) {
                        buffer += chunk.toString();
                        let parts = buffer.split("\n");

                        // Process complete JSON lines
                        while (parts.length > 1) {
                            const jsonPart = parts.shift();
                            if (jsonPart?.trim()) {
                                try {
                                    yield JSON.parse(jsonPart) as T;
                                } catch (e) {
                                    console.error("Error parsing JSON chunk:", jsonPart, e);
                                }
                            }
                        }

                        // Keep the last part (it might be incomplete)
                        buffer = parts.join("\n");
                    }

                    // Process any remaining buffered data
                    if (buffer.trim()) {
                        try {
                            yield JSON.parse(buffer) as T;
                        } catch (e) {
                            console.error("Error parsing final JSON chunk:", buffer, e);
                        }
                    }
                })();
            }

            return { ...(res || {}), response: res?.response };
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
            const formData = new FormData()

            formData.append("collection_id", collection_id)
            formData.append("resource_id", resource_id)

            const res = await this.axiosApi.request({
                url: "/resource/remove/",
                method: RequestMethods.DELETE,
                data: formData
            })

            return res as IGenericResponse;
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

            const res = await this.axiosApi.request({
                url: "/collection/delete/",
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
     * This allows you to organize a resource into specific categories
     * based on a provided JSON schema.
     *
     * @template T - The expected structure of the resource.
     *
     * @param {string} resource - The the resource to be categorized: local file - e.g ./resource.pdf, remote file - e.g https://s3.amazon/dog.pdf", "plain text",
     * @param {string} type - The type of the resource (web, file, text, json, youtube). - The type of resource being categorized (e.g., "text", "image", etc.).
     * @param {T | T[]} json_schema - The JSON schema that defines the structure of the resource.
     * @param {string[]} categories - An array of category names to associate the resource with.
     * @param {string} prompt - An overall command of your request
     *
     * @returns {Promise<ICatergorizeResource<T> | IErrorMessage>}
     * A promise that resolves to the categorized resource or an error message if the operation fails.
     *
     * @example
     * const response = await sdk.categorizeResource({
     *     resource: "./data.pdf",
     *     type: "text",
     *     json_schema: {'label':'string'},
     *     categories: ["football", "Machine Learning","wrestling"], 
     *     prompt: "Where does this fall under?", 
     * });
     *
     * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/category
     */
    public async categorize<T>({
        resource,
        type,
        json_schema,
        categories,
        prompt,
        collection_id,
    }: {
        resource: string,
        type: string,
        json_schema: T | T[]
        categories: string[],
        collection_id: string,
        prompt: string

    }): Promise<ICatergorizeResource<T> | IErrorMessage> {
        try {
            let finalResource = resource;
            let finalType = type;

            if (!resource.startsWith("https://") && finalType === "file") {
                const formData = new _FormData()
                // const fileStream = fs.createReadStream(`${__dirname}/${resource}`);
                const fileStream = fs.createReadStream(`${process.cwd()}/${resource}`);
                formData.append("file", fileStream as unknown as Blob, path.basename(resource))
                formData.append("collection_id", collection_id)
                const uploadFileRes = await axios.post(`${Config.WETROCLOUD.UPLOAD_URL}/upload/`, formData, {
                    headers: formData.getHeaders()
                })
                finalResource = uploadFileRes?.data?.url
                finalType = "file";
            }

            const requestData: Record<string, any> = {
                resource: finalResource,
                type: finalType,
                json_schema: JSON.stringify(json_schema),
                categories,
                prompt
            };

            const res = await this.axiosApi.request({
                url: "/categorize/",
                method: RequestMethods.POST,
                data: requestData
            })

            return res as ICatergorizeResource<T>;
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
 * @param {boolean} [stream=false] - Optional. Determines whether the response should be streamed. Defaults to `false`.
 * 
 * @example
 * const response = await sdk.generateTextWithoutRag({
 *     model: "gpt-4.5-turbo",
 *     messages: [
 *         { "role": "user", content: "What's the capital of France?" },
 *     ]
 * });
 *
 * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/text-generation
 */

    public async textGeneration({
        messages,
        model,
        stream
    }: {
        model: string,
        messages: { role: "user" | "system" | "assistant", content: string }[]
        stream?: boolean
    }): Promise<IGenericResponse | IErrorMessage | unknown> {
        try {

            const formData = new FormData()
            formData.append("model", model)
            formData.append("messages", JSON.stringify(messages))
            const requestBody: Record<string, any> = {
                model,
                messages
            }
            // formData.append("messages", messages)

            const res = await this.axiosApi.request({
                url: "/text-generation/",
                method: RequestMethods.POST,
                data: requestBody,
                ...(stream ? { responseType: "stream" } : {})

            })

            if (stream) {
                const resultStream = res as Readable;

                return (async function* () {
                    let buffer = "";
                    for await (const chunk of resultStream) {
                        buffer += chunk.toString();
                        let parts = buffer.split("\n");

                        // Process complete JSON lines
                        while (parts.length > 1) {
                            const jsonPart = parts.shift();
                            if (jsonPart?.trim()) {
                                try {
                                    yield JSON.parse(jsonPart);
                                } catch (e) {
                                    console.error("Error parsing JSON chunk:", jsonPart, e);
                                }
                            }
                        }

                        // Keep the last part (it might be incomplete)
                        buffer = parts.join("\n");
                    }

                    // Process any remaining buffered data
                    if (buffer.trim()) {
                        try {
                            yield JSON.parse(buffer);
                        } catch (e) {
                            console.error("Error parsing final JSON chunk:", buffer, e);
                        }
                    }
                })();
            }

            return { ...(res || {}), response: res?.response };
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

    public async imageToText({
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

            const res = await this.axiosApi.request({
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
    public async extract<T>({
        website,
        json_schema
    }: {
        website: string,
        json_schema: T | T[]
    }): Promise<IDataExtraction<T> | IErrorMessage> {
        try {

            const formData = new FormData();
            formData.append('website', website)
            formData.append('json_schema', JSON.stringify(json_schema))

            const res = await this.axiosApi.request({
                url: "/data-extraction/",
                method: RequestMethods.POST,
                data: formData
            })

            return res;
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

    /**
     * Converts a markdown resource (local file or URL) into structured markdown content
     * using WetroCloud's markdown-converter endpoint.
     *
     * - If the `resource_type` is `"file"` and the `resource` is a local file path,
     *   the method uploads the file to WetroCloud and obtains a public URL.
     * - The final resource (uploaded URL or original link) is then submitted for conversion.
     *
     * @param {Object} params - The input parameters.
     * @param {string} params.resource - The file path or URL to convert.
     * @param {string} params.resource_type - Indicates the resource type: "file" or "web".
     *
     * @returns {Promise<IMarkDown>} A promise that resolves with the converted markdown response.
     *
     * @throws Will throw an error if file upload or markdown conversion fails.
     *
     * @example
     * const markdown = await sdk.markDownConverter({
     *   resource: "https://example.com/file.md",
     *   resource_type: "web"
     * });
     *
     * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/markdown-converter
     */
    public async markDownConverter({
        resource,
        resource_type
    }: {
        resource: string,
        resource_type: string
    }): Promise<IMarkDown> {
        try {
            let finalResource = resource;
            let finalType = resource_type;

            if (!resource.startsWith("https://") && finalType === "file") {
                const formData = new _FormData()
                // const fileStream = fs.createReadStream(`${__dirname}/${resource}`);
                const fileStream = fs.createReadStream(`${process.cwd()}/${resource}`);
                console.log({
                    fileStream
                })
                formData.append("file", fileStream as unknown as Blob, path.basename(resource))
                formData.append("collection_id", `wetrocloud-markdown-${generateRandomString(10)}`)
                const uploadFileRes = await axios.post(`${Config.WETROCLOUD.UPLOAD_URL}/upload/`, formData, {
                    headers: formData.getHeaders()
                })
                // console.log({
                //     uploadFileRes
                // })
                finalResource = uploadFileRes?.data?.url
                finalType = "file";
            }

            const res = await this.axiosApi.request({
                url: "/markdown-converter/",
                method: RequestMethods.POST,
                data: {
                    link: finalResource,
                    resource_type: finalType,
                }
            })
            return res as IMarkDown
        } catch (e) {
            // return e
            console.log({ "Error": e })
            throw e
        }
    }

    /**
 * Retrieves a transcript from a video using WetroCloud's transcript endpoint.
 *
 * This method sends a request to extract the spoken content from the given YouTube video link
 * and returns a structured transcript or an error message.
 *
 * @param {Object} params - Input parameters.
 * @param {string} params.resource - The video URL.
 * @param {'youtube'} params.resource_type - The type of resource. Must be "youtube".
 *
 * @returns {Promise<IInsertResourceCollection | IErrorMessage>}
 * A promise that resolves to the transcript resource metadata or an error message.
 *
 * @example
 * const response = await sdk.transcript({
 *   resource: "https://www.youtube.com/watch?v=example",
 *   resource_type: "youtube"
 * });
 *
 * @see WetroCloud Docs: https://docs.wetrocloud.com/endpoint-explanations/transcript
 */
public async transcript({
        resource,
        resource_type
    }: {
        resource: string,
        resource_type: 'youtube'
    }): Promise<IInsertResourceCollection | IErrorMessage> {
        try {

            const res = await this.axiosApi.request({
                url: "/transcript/",
                method: RequestMethods.POST,
                data: {
                    link: resource,
                    resource_type,
                }
            })
            return res as IInsertResourceCollection
        } catch (e) {
            // return e
            console.log({ "Error": e })
            throw e
        }
    }
}

export default Wetrocloud;
export * from './types/index.js';

// Safely support CJS
if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    module.exports = Wetrocloud;

}