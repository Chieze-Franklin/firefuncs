export class DatabaseOptions {
    instance?: string;
}

export class RequestOptions {
    method?: RequestMethodTypes;
}

export type RequestMethodTypes = "connect" | "delete" | "get" | "head" | "options" | "patch" | "post" | "put" | "trace"

export class ScheduleOptions {
    timeZone?: string;
}
