export function createFuncWithDatabaseInstance(func: any, instance: string | undefined) {
    if (instance) {
        return func.database.instance(instance);
    }

    return func.database;
}
