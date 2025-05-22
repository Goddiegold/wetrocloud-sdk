import axios, { AxiosInstance, ResponseType } from "axios";
import Config from "./config.js";

export default class AxiosAPI {
    private apiKey: string;
    private axiosInstance: AxiosInstance;

    constructor({ apiKey}: {apiKey: string }) {
        this.apiKey = apiKey;

        this.axiosInstance = axios.create({
            baseURL: Config.WETROCLOUD.API_URL + "/v2",
            headers: {
                Authorization: `Token ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }

    public async request({
        url,
        method,
        data,
        headers = {},
        responseType
    }: {
        url: string;
        method: string;
        data?: FormData | Record<string, string>;
        headers?: Record<string, string>;
        responseType?: ResponseType
    }) {
        return this.axiosInstance({
            url: url + `?referrer=node_sdk`,
            method,
            data,
            headers,
            responseType
        }).then((response) => response.data);
    }

    // public cancelRequests() {
    //     this.axiosInstance.defaults.signal?.abort();
    // }
}
