import Config from "./config";

let fetchFn: typeof fetch;

if (typeof window !== "undefined") {
    fetchFn = fetch; // Use native fetch in the browser
} else {
    fetchFn = require("node-fetch"); // Use node-fetch in Node.js
}

export default class FetchAPI {
    private apiSecret: string;
    private abortController: AbortController;

    constructor({ apiSecret }: { apiSecret: string }) {
        this.apiSecret = apiSecret;
        this.abortController = new AbortController();
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
        headers?: HeadersInit;
    }) {
        const authHeaders: HeadersInit = this.apiSecret
            ? { Authorization: `Token ${this.apiSecret}` }
            : {};

        return fetchFn(Config.WETROCLOUD.API_URL + "/v1" + url, {
            signal: this.abortController.signal,
            method,
            body: method !== "GET" ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
            headers: {
                "Content-Type": "application/json",
                ...authHeaders, // Automatically sets Authorization
                ...headers,
            },
        }).then(async (response) => {
            if (!response.ok) {
                const error = await response.json();
                const formattedError = { ...error, status: response.status, statusText: response.statusText };
                return Promise.reject(formattedError);
            }
            return response.json();
        });
    }

    public cancelRequests() {
        this.abortController.abort();
        this.abortController = new AbortController(); // Reset for future requests
    }
}
