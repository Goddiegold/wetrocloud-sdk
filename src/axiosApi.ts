import axios, { AxiosInstance, ResponseType } from "axios";
import Config from "./config.js";

export default class AxiosAPI {
    private apiSecret: string;
    private axiosInstance: AxiosInstance;

    constructor({ apiSecret }: { apiSecret: string }) {
        this.apiSecret = apiSecret;

        this.axiosInstance = axios.create({
            baseURL: Config.WETROCLOUD.API_URL + "/v1",
            headers: {
                Authorization: `Token ${this.apiSecret}`,
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
