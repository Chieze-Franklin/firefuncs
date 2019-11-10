import { RequestMiddleware } from './middleware';

export type Region = "us-central1" | "us-east1" | "us-east4" | "europe-west1" | "europe-west2" | "asia-east2" | "asia-northeast1"

//export type RequestMethodType = "connect" | "delete" | "get" | "head" | "options" | "patch" | "post" | "put" | "trace"
export type RequestMethodType = "delete" | "get" | "options" | "post" | "put"

export class DatabaseOptions {
    instance?: string;
}

export class RequestOptions {
    method?: RequestMethodType;
    middleware?: typeof RequestMiddleware[];
}

export class ScheduleOptions {
    timeZone?: string;
}

export class StorageOptions {
    bucket?: string;
}
