import { funcActionMap } from '../';
import { composeFunctionName } from '../../utils';

// map of function name to a boolean that is true
// if that function is decorated with any of the following:
// @onFirestoreCreate, @onFirestoreDelete, @onFirestoreUpdate, @onFirestoreWrite"
export const funcFirestoreMap: {[key: string]: boolean} = {};

// map of function name to firestore database
export const funcFirestoreDatabaseMap: {[key: string]: string} = {};

// map of function name to firestore namespace
export const funcFirestoreNamespaceMap: {[key: string]: string} = {};

// --------------- modifier decorators ---------------

export function database(databaseName: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        funcFirestoreDatabaseMap[composeFunctionName(target, propertyKey)] = databaseName;
    }
}

export function namespace(namespaceName: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        funcFirestoreNamespaceMap[composeFunctionName(target, propertyKey)] = namespaceName;
    }
}

// --------------- actions decorators ---------------

export function onFirestoreCreate(path: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcFirestoreMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onFirestoreCreate',
                payload: {
                    path
                }
            }
        ];
    }
}

export function onFirestoreDelete(path: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcFirestoreMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onFirestoreDelete',
                payload: {
                    path
                }
            }
        ];
    }
}

export function onFirestoreUpdate(path: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcFirestoreMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onFirestoreUpdate',
                payload: {
                    path
                }
            }
        ];
    }
}

export function onFirestoreWrite(path: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcFirestoreMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onFirestoreWrite',
                payload: {
                    path
                }
            }
        ];
    }
}
