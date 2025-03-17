import axios, { AxiosInstance } from "axios";
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
    }: {
        url: string;
        method: string;
        data?: FormData | Record<string, string>;
        headers?: Record<string, string>;
    }) {
        return this.axiosInstance({
            url,
            method,
            data,
            headers,
        }).then((response) => response.data);
    }

    // public cancelRequests() {
    //     this.axiosInstance.defaults.signal?.abort();
    // }
}
