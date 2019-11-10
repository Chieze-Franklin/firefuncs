import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';
import * as glob from 'glob';
import {
    DatabaseOptions,
    RequestOptions,
    ScheduleOptions,
    StorageOptions,
    Region
} from './options';
import { RequestMiddleware } from './middleware';

let cloudFuncs: any = {};
let map = new Map<string, RequestMiddleware>();

export function onAuthUserCreate(...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!regions || regions.length === 0) regions = ['us-central1'];
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
            functions.region(...regions).auth.user().onCreate(target[propertyKey]);
    }
}

export function onAuthUserDelete(...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!regions || regions.length === 0) regions = ['us-central1'];
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
            functions.region(...regions).auth.user().onDelete(target[propertyKey]);
    }
}

export function onDatabaseCreate(path: string, options?: DatabaseOptions, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!regions || regions.length === 0) regions = ['us-central1'];
        if (options && options.instance) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
                functions.region(...regions).database.instance(options.instance).ref(path).onCreate(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
                functions.region(...regions).database.ref(path).onCreate(target[propertyKey]);
        }
    }
}

export function onDatabaseDelete(path: string, options?: DatabaseOptions, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!regions || regions.length === 0) regions = ['us-central1'];
        if (options && options.instance) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
                functions.region(...regions).database.instance(options.instance).ref(path).onDelete(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
                functions.region(...regions).database.ref(path).onDelete(target[propertyKey]);
        }
    }
}

export function onDatabaseUpdate(path: string, options?: DatabaseOptions, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!regions || regions.length === 0) regions = ['us-central1'];
        if (options && options.instance) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
                functions.region(...regions).database.instance(options.instance).ref(path).onUpdate(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
                functions.region(...regions).database.ref(path).onUpdate(target[propertyKey]);
        }
    }
}

export function onDatabaseWrite(path: string, options?: DatabaseOptions, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!regions || regions.length === 0) regions = ['us-central1'];
        if (options && options.instance) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
                functions.region(...regions).database.instance(options.instance).ref(path).onWrite(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
                functions.region(...regions).database.ref(path).onWrite(target[propertyKey]);
        }
    }
}

export function onFirestoreCreate(path: string, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!regions || regions.length === 0) regions = ['us-central1'];
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
            functions.region(...regions).firestore.document(path).onCreate(target[propertyKey]);
    }
}

export function onFirestoreDelete(path: string, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!regions || regions.length === 0) regions = ['us-central1'];
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
            functions.region(...regions).firestore.document(path).onDelete(target[propertyKey]);
    }
}

export function onFirestoreUpdate(path: string, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!regions || regions.length === 0) regions = ['us-central1'];
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
            functions.region(...regions).firestore.document(path).onUpdate(target[propertyKey]);
    }
}

export function onFirestoreWrite(path: string, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!regions || regions.length === 0) regions = ['us-central1'];
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
            functions.region(...regions).firestore.document(path).onWrite(target[propertyKey]);
    }
}

export function onCall(...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!regions || regions.length === 0) regions = ['us-central1'];
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
            functions.region(...regions).https.onCall(target[propertyKey]);
    }
}

export function onRequest(path: string = '/', options?: RequestOptions, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!path) path = '/';
        if (!regions || regions.length === 0) regions = ['us-central1'];
        if (path === '/' && !options) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
                functions.region(...regions).https.onRequest(target[propertyKey]);
        } else {
            const app = express();
            app.use(cors({
                origin: true
            }));
            if (options && options.middleware) {
                options.middleware.forEach(m => {
                    let i = map.get(m.name);
                    if (!i) {
                        i = new m();
                        map.set(m.name, i);
                    }
                    app.use(i.middleware);
                });
            }
            if (options && options.method) {
                app[options.method](path, target[propertyKey]);
            } else {
                app.get(path, target[propertyKey]);
            }
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] =
                functions.region(...regions).https.onRequest(app);
        }
    }
}

export function onSchedule(schedule: string, options?: ScheduleOptions, ...regions: Region[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!regions || regions.length === 0) regions = ['us-central1'];
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
        if (!regions || regions.length === 0) regions = ['us-central1'];
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
        if (!regions || regions.length === 0) regions = ['us-central1'];
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
        if (!regions || regions.length === 0) regions = ['us-central1'];
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
        if (!regions || regions.length === 0) regions = ['us-central1'];
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
