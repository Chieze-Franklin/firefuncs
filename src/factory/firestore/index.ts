export function createFuncWithFirestoreDatabase(func: any, database: string | undefined) {
    if (database) {
        return func.firestore.database(database);
    }

    return func.firestore;
}

export function createFuncWithFirestoreNamespace(func: any, namespace: string | undefined) {
    if (namespace) {
        return func.namespace(namespace);
    }

    return func;
}
