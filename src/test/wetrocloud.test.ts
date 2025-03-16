require('dotenv').config(); //this should always be first
import { beforeAll, describe, expect, it } from '@jest/globals';
import Wetrocloud from "..";
import Config from "../config";
import { ICatergorizeResource, ICreateCollection, IDataExtraction, IGenericResponse, IInsertResourceCollection, IListCollection, IQueryResourceCollectionDynamic, ResourceType } from '../types';


let wetrocloud: Wetrocloud;
let apiSecret: string | undefined;
let collection_id: string;
let resource_id: string;

describe('Wetrocloud SDK Tests', () => {

    beforeAll(() => {
        apiSecret = Config.TEST.WETROCLOUD_SECRET_KEY;
        console.log("apiSecretKey", apiSecret);
        wetrocloud = new Wetrocloud({ apiSecret });
    });

    it('should create a collection', async () => {
        try {
            const response = await wetrocloud.createCollection({});
            console.log("Creating Collection:", response);

            collection_id = (response as ICreateCollection)?.collection_id || '';

            expect(response).toHaveProperty('collection_id');
        } catch (error) {
            throw error; // Re-throw the error to fail the test
        }
    }, 10000);


    it('should list all collections', async () => {
        try {
            const response = await wetrocloud.listCollections()
            console.log("Lisiting Collections", response);
            const collections = response as IListCollection[]
            expect(Array.isArray(collections)).toBe(true);
            expect(collections[0]).toHaveProperty('collection_id');
            expect(collections[0].collection_id).toBe(collection_id);
        } catch (error) {
            throw error; // Re-throw the error to fail the test
        }
    })

    it('should insert a resource', async () => {
        try {
            const response = await wetrocloud.insertResource({
                collection_id,
                resource: "https://dev.to/hayleycodes/deploying-a-node-js-site-to-vultr-j8d",
                type: ResourceType.WEB
            })

            console.log("insert a resource", response);
            const newResource = response as IInsertResourceCollection
            resource_id = newResource?.resource_id;
            console.log("resource_id", resource_id);
            expect(newResource).toHaveProperty('resource_id');
            expect(newResource?.success).toBe(true)

        } catch (error) {
            throw error; // Re-throw the error to fail the test
        }
    })

    it('query a collection', async () => {
        try {
            const shouldRun = false;
            if (!shouldRun) return;
            const json_schema = { step: "", description: "" }
            const response = await wetrocloud.queryResources({
                collection_id,
                request_query: "What do I need to deploy my application to vultr ?",
                json_schema,
                json_schema_rules: "Give a very short description of every step"
            })

            console.log("querying collection", response);

            const queryResource = response as IQueryResourceCollectionDynamic<typeof json_schema>
            expect(queryResource?.success).toBe(true)
            expect(queryResource).toHaveProperty('response');
        } catch (error) {
            throw error; // Re-throw the error to fail the test
        }
    })

    it('delete a resource', async () => {
        try {
            const response = await wetrocloud.deleteResource({
                collection_id,
                resource_id
            })

            console.log("deleting resource", response);

            expect((response as IGenericResponse)?.success).toBe(true)

        } catch (error) {
            throw error; // Re-throw the error to fail the test
        }
    })

    it('delete a collection', async () => {
        try {
            const response = await wetrocloud.deleteCollection({
                collection_id,
            })

            console.log("deleting a collection", response);

            expect((response as IGenericResponse)?.success).toBe(true)
            expect(response).toHaveProperty('message')

        } catch (error) {
            throw error; // Re-throw the error to fail the test
        }
    })

    it('categorize a resource', async () => {
        try {
            const result = await wetrocloud.categorizeResource({
                resource: "match review: John Cena vs. The Rock",
                type:ResourceType.TEXT,
                "json_schema": { 'label': '' },
                "categories": ["football", "coding", "entertainment", "basketball", "wrestling", "information"]
            })
            console.log("categorizing a resource", result);
            const _result = (result as ICatergorizeResource<{ label: string }>)
            const response = _result?.response as { label: string };
            expect(response?.label).toBeDefined();
            expect(_result?.success).toBe(true)
        } catch (error) {
            throw error; // Re-throw the error to fail the test
        }
    })

    it('text generation without RAG', async () => {
        try {
            const result = await wetrocloud.generateTextWithoutRag({
                messages: [{ role: 'user', content: 'what is a large language model?' }],
                model: "llama-3.3-70b"
            })

            console.log("generation without RAG", result);

            const _result = result as IGenericResponse;
            expect(_result).toHaveProperty('response')
            expect(_result?.success).toBe(true)

        } catch (error) {
            throw error; // Re-throw the error to fail the test
        }
    })


    it('image to text OCR', async () => {
        try {
            const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQBQcwHfud1w3RN25Wgys6Btt_Y-4mPrD2kg&s';
            const query = 'What animal is this?';
            const result = await wetrocloud.generateTextFromImage({
                image_url: imageUrl,
                request_query: query
            })
            console.log("image to text", result);

            const _result = result as IGenericResponse;
            expect(_result).toHaveProperty('response')
            expect(_result?.success).toBe(true)
        } catch (error) {
            throw error; // Re-throw the error to fail the test
        }
    }, 20000)

    it('data extraction from website', async () => {
        try {
            const website = "https://www.forbes.com/real-time-billionaires/#7583ee253d78"
            const json_schema = [{ "name": "<name of rich man>", "networth": "<amount worth>" }]
            const result = await wetrocloud.dataExtractionFromWebsite({
                website_url: website,
                json_schema
            })

            console.log("data extraction", result);
            const _result = result as IDataExtraction<{ name: string, networth: string }>

            expect(_result?.response).toBeDefined();
            expect(_result?.success).toBe(true)
        } catch (error) {
            throw error; // Re-throw the error to fail the test
        }
    }, 30000)
});
