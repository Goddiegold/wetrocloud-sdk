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

    public async createColllection(): Promise<ICreateCollection | IErrorMessage> {
        try {
            const res = await this.fetchApi.request({ url: "/create/", method: "post", data: {} })
            return res as ICreateCollection;
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

    public async listCollections(): Promise<IListCollection[] | IErrorMessage> {
        try {
            const res = await this.fetchApi.request({ url: "/collection/", method: "get" })
            return res?.results as IListCollection[];
        } catch (e) {
            return { message: errorMessage(e) }
        }
    }

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