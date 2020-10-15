export function createFuncWithStorageBucket(func: any, bucket: string | undefined) {
    if (bucket) {
        return func.storage.bucket(bucket);
    }

    return func.storage;
}
