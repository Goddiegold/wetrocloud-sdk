
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
    resource_id: string,
    success: boolean,
    token: number
}

export interface IQueryResourceCollectionDynamic<T> {
    response: T | T[] | string,
    tokens: number,
    success: boolean
}

export interface ICatergorizeResource<T> extends IQueryResourceCollectionDynamic<T> { }
export interface IGenericResponse {
    response?: string,
    message?: string,
    success: boolean
}

export interface IDataExtraction<T> {
    response: {
        [x: string]: T | T[]
    }, 
    tokens: number,
    success: boolean
}