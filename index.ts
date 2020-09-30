import * as functions from 'firebase-functions';
import * as glob from 'glob';
import {
    createFuncWithDatabaseInstance,
    createFuncWithRegion,
    createFuncWithRunWith,
    createFuncWithAction
} from './factory';
import {
    FunctionAction,
    RuntimeOptions,
    RequestOptions,
    ScheduleOptions,
    StorageOptions,
    Region
} from './options';
import { composeFunctionName } from './utils';

const cloudFuncs: {[key: string]: any} = {};
const funcActions: {[key: string]: FunctionAction[]} = {};
const funcDatabaseInstances: {[key: string]: string} = {};
const funcRegions: {[key: string]: Region[]} = {};
const funcRunWiths: {[key: string]: RuntimeOptions} = {};

// 258

export function func() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

        funcActions[funcName].forEach((funcAction, index) => {
            let cloudFunc = functions;

            // region
            cloudFunc = createFuncWithRegion(cloudFunc, funcRegions[funcName]);

            // runWith
            cloudFunc = createFuncWithRunWith(cloudFunc, funcRunWiths[funcName]);

            // database instance
            cloudFunc = createFuncWithDatabaseInstance(cloudFunc, funcDatabaseInstances[funcName]);

            // func actions
            cloudFunc = createFuncWithAction(cloudFunc, funcAction, target, propertyKey);

            // final result
            cloudFuncs[`${funcName}${funcActions[funcName].length > 1 ? `${(index + 1)}_${funcAction.type}` : ''}`] = cloudFunc;
        });
    }
}

export function instance(instance: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        funcDatabaseInstances[composeFunctionName(target, propertyKey)] = instance;
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
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
            functions.region(...regions).auth.user().onCreate(target[propertyKey]);
    }
}

export function onAuthUserDelete(...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
            functions.region(...regions).auth.user().onDelete(target[propertyKey]);
    }
}

export function onDatabaseCreate(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const funcName = composeFunctionName(target, propertyKey);

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

export function onFirestoreCreate(path: string, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
            functions.region(...regions).firestore.document(path).onCreate(target[propertyKey]);
    }
}

export function onFirestoreDelete(path: string, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
            functions.region(...regions).firestore.document(path).onDelete(target[propertyKey]);
    }
}

export function onFirestoreUpdate(path: string, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
            functions.region(...regions).firestore.document(path).onUpdate(target[propertyKey]);
    }
}

export function onFirestoreWrite(path: string, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
            functions.region(...regions).firestore.document(path).onWrite(target[propertyKey]);
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

export function onSchedule(schedule: string, options?: ScheduleOptions, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (options && options.timeZone) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
                functions.region(...regions).pubsub.schedule(schedule).timeZone(options.timeZone).onRun(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
                functions.region(...regions).pubsub.schedule(schedule).onRun(target[propertyKey]);
        }
    }
}

export function onStorageObjectArchive(options?: StorageOptions, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (options && options.bucket) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`]
                = functions.region(...regions).storage.bucket(options.bucket).object().onArchive(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`]
                = functions.region(...regions).storage.object().onArchive(target[propertyKey]);
        }
    }
}

export function onStorageObjectDelete(options?: StorageOptions, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (options && options.bucket) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`]
                = functions.region(...regions).storage.bucket(options.bucket).object().onDelete(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`]
                = functions.region(...regions).storage.object().onDelete(target[propertyKey]);
        }
    }
}

export function onStorageObjectFinalize(options?: StorageOptions, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (options && options.bucket) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`]
                = functions.region(...regions).storage.bucket(options.bucket).object().onFinalize(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`]
                = functions.region(...regions).storage.object().onFinalize(target[propertyKey]);
        }
    }
}

export function onStorageObjectMetadataUpdate(options?: StorageOptions, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (options && options.bucket) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`]
                = functions.region(...regions).storage.bucket(options.bucket).object().onMetadataUpdate(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`]
                = functions.region(...regions).storage.object().onMetadataUpdate(target[propertyKey]);
        }
    }
}

export function getFunctions(pattern: string) {
    let files = glob.sync(pattern);
    files.map((f: string) => require(f));
    return cloudFuncs;
}
