import { RequestMiddleware } from './middleware';

export type FailurePolicy = {
    retry: {}
}

export type FunctionAction = {
    type:
        "onCall" |
        "onDatabaseCreate" | "onDatabaseDelete" | "onDatabaseUpdate" | "onDatabaseWrite" |
        "onRequest";
    payload?: {
        [key: string]: any
    }
}

export type Memory = "128MB" | "256MB" | "512MB" | "1GB" | "2GB";

// https://firebase.google.com/docs/functions/locations
export type Region =
    "asia-east2" |
    "asia-northeast1" | "asia-northeast2" | "asia-northeast3" |
    "asia-south1" |
    "asia-southeast2" |
    "australia-southeast1" |
    "europe-west1" | "europe-west2" | "europe-west3" | "europe-west6" |
    "northamerica-northeast1" |
    "southamerica-east1" |
    "us-central1" |
    "us-east1" | "us-east4" |
    "us-west2" | "us-west3" | "us-west4";

export type RequestMethodType = "delete" | "get" | "options" | "post" | "put";

export type VpcConnectorEgressSettings = "VPC_CONNECTOR_EGRESS_SETTINGS_UNSPECIFIED" | "PRIVATE_RANGES_ONLY" | "ALL_TRAFFIC";

export interface RequestOptions {
    method?: RequestMethodType;
    middleware?: typeof RequestMiddleware[];
}

export interface RuntimeOptions {
    failurePolicy?: FailurePolicy | boolean;
    memory?: Memory;
    maxInstances?: number;
    timeoutSeconds?: number;
    vpcConnector?: string;
    vpcConnectorEgressSettings?: VpcConnectorEgressSettings
}

export interface ScheduleRetryConfig {
    retryCount?: number;
    maxRetryDuration?: string;
    minBackoffDuration?: string;
    maxBackoffDuration?: string;
    maxDoublings?: number;
}

export interface ScheduleOptions {
    schedule: string;
    timeZone?: string;
    retryConfig?: ScheduleRetryConfig;
}

export class StorageOptions {
    bucket?: string;
}
