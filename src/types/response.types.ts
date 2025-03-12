
// export 

export interface ICreateCollection {
    collection_id?: string,
    success: boolean
}

export interface IListCollection {
    collection_id: string,
    created_at: string
}

export interface IErrorMessage {
    message: string,
}

export interface IInsertResourceCollection {
    success: boolean,
    token: number
}

export interface IQueryResourceCollectionDynamic<T> {
    response: string | T | T[],
    tokens: number,
    success: boolean
}

