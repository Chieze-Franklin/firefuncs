import * as functions from 'firebase-functions';
import * as glob from 'glob';
import {
    createFuncWithDatabaseInstance,
    createFuncWithFirestoreDatabase,
    createFuncWithFirestoreNamespace,
    createFuncWithRegion,
    createFuncWithRunWith,
    createFuncWithStorageBucket,
    createFuncWithAction
} from './factory';
import {
    FunctionAction,
    RuntimeOptions,
    RequestOptions,
    ScheduleOptions,
    Region
} from './options';
import { composeFunctionName } from './utils';

const cloudFuncs: {[key: string]: any} = {};
const funcActions: {[key: string]: FunctionAction[]} = {};
const funcDatabases: {[key: string]: boolean} = {};
const funcDatabaseInstances: {[key: string]: string} = {};
const funcFirestores: {[key: string]: boolean} = {};
const funcFirestoreDatabases: {[key: string]: string} = {};
const funcFirestoreNamespaces: {[key: string]: string} = {};
const funcRegions: {[key: string]: Region[]} = {};
const funcRunWiths: {[key: string]: RuntimeOptions} = {};
const funcStorages: {[key: string]: boolean} = {};
const funcStorageBuckets: {[key: string]: string} = {};

export function func() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcActions[funcName].forEach((funcAction, index) => {
            let cloudFunc = functions;

            // region
            cloudFunc = createFuncWithRegion(cloudFunc, funcRegions[funcName]);

            // runWith
            cloudFunc = createFuncWithRunWith(cloudFunc, funcRunWiths[funcName]);

            if (funcDatabases[funcName]) {
                // database instance
                cloudFunc = createFuncWithDatabaseInstance(cloudFunc, funcDatabaseInstances[funcName]);
            }

            if (funcFirestores[funcName]) {
                // firestore database
                cloudFunc = createFuncWithFirestoreDatabase(cloudFunc, funcFirestoreDatabases[funcName]);

                // firestore namespace
                cloudFunc = createFuncWithFirestoreNamespace(cloudFunc, funcFirestoreNamespaces[funcName]);
            }

            if (funcStorages[funcName]) {
                // storage bucket
                cloudFunc = createFuncWithStorageBucket(cloudFunc, funcStorageBuckets[funcName]);
            }

            // func actions
            cloudFunc = createFuncWithAction(cloudFunc, funcAction, target, propertyKey);

            // final result
            cloudFuncs[`${funcName}${funcActions[funcName].length > 1 ? `${(index + 1)}_${funcAction.type}` : ''}`] = cloudFunc;
        });
    }
}

export function bucket(bucket: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        funcStorageBuckets[composeFunctionName(target, propertyKey)] = bucket;
    }
}

export function database(database: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        funcFirestoreDatabases[composeFunctionName(target, propertyKey)] = database;
    }
}

export function instance(instance: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        funcDatabaseInstances[composeFunctionName(target, propertyKey)] = instance;
    }
}

export function namespace(namespace: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        funcFirestoreNamespaces[composeFunctionName(target, propertyKey)] = namespace;
    }
}

export function region(...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!regions || regions.length === 0) {
            regions = ['us-central1'];
        }

        funcRegions[composeFunctionName(target, propertyKey)] = regions;
    }
}

export function runWith(runtimeOptions: RuntimeOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        funcRunWiths[composeFunctionName(target, propertyKey)] = runtimeOptions;
    }
}

// _________________________ Action Decorators _________________________

export function onAuthUserCreate(...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onAuthUserCreate'
            }
        ];
    }
}

export function onAuthUserDelete(...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onAuthUserDelete'
            }
        ];
    }
}

export function onDatabaseCreate(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcDatabases[funcName] = true;
        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onDatabaseCreate',
                payload: {
                    path
                }
            }
        ];
    }
}

export function onDatabaseDelete(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcDatabases[funcName] = true;
        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onDatabaseDelete',
                payload: {
                    path
                }
            }
        ];
    }
}

export function onDatabaseUpdate(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcDatabases[funcName] = true;
        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onDatabaseUpdate',
                payload: {
                    path
                }
            }
        ];
    }
}

export function onDatabaseWrite(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcDatabases[funcName] = true;
        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onDatabaseWrite',
                payload: {
                    path
                }
            }
        ];
    }
}

export function onFirestoreCreate(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcFirestores[funcName] = true;
        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
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
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcFirestores[funcName] = true;
        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
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
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcFirestores[funcName] = true;
        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onFirestoreUpdate',
                payload: {
                    path
                }
            }
        ];
    }
}

export function onFirestoreWrite(path: string, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcFirestores[funcName] = true;
        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onFirestoreWrite',
                payload: {
                    path
                }
            }
        ];
    }
}

export function onCall() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onCall'
            }
        ];
    }
}

export function onRequest(path: string = '/', options?: RequestOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onRequest',
                payload: {
                    options,
                    path: path || '/'
                }
            }
        ];
    }
}

// export function onSchedule(schedule: string, options?: ScheduleOptions, ...regions: Region[]) {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         if (options && options.timeZone) {
//             cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
//                 functions.region(...regions).pubsub.schedule(schedule).timeZone(options.timeZone).onRun(target[propertyKey]);
//         } else {
//             cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
//                 functions.region(...regions).pubsub.schedule(schedule).onRun(target[propertyKey]);
//         }
//     }
// }

export function onStorageObjectArchive() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcStorages[funcName] = true;
        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onStorageObjectArchive'
            }
        ];
    }
}

export function onStorageObjectDelete() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcStorages[funcName] = true;
        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onStorageObjectDelete'
            }
        ];
    }
}

export function onStorageObjectFinalize() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcStorages[funcName] = true;
        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onStorageObjectFinalize'
            }
        ];
    }
}

export function onStorageObjectMetadataUpdate() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcStorages[funcName] = true;
        funcActions[funcName] = [
            ...(funcActions[funcName] || []),
            {
                type: 'onStorageObjectMetadataUpdate'
            }
        ];
    }
}

export function getFunctions(pattern: string) {
    let files = glob.sync(pattern);
    files.map((f: string) => require(f));
    return cloudFuncs;
}
