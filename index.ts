import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';
import * as glob from 'glob';
import { DatabaseOptions, RequestOptions, ScheduleOptions } from './options';

let cloudFuncs: any = {};

export function onDatabaseCreate(path: string, options?: DatabaseOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (options && options.instance) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.database.instance(options.instance).ref(path).onCreate(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.database.ref(path).onCreate(target[propertyKey]);
        }
    }
}

export function onDatabaseDelete(path: string, options?: DatabaseOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (options && options.instance) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.database.instance(options.instance).ref(path).onDelete(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.database.ref(path).onDelete(target[propertyKey]);
        }
    }
}

export function onDatabaseUpdate(path: string, options?: DatabaseOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (options && options.instance) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.database.instance(options.instance).ref(path).onUpdate(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.database.ref(path).onUpdate(target[propertyKey]);
        }
    }
}

export function onDatabaseWrite(path: string, options?: DatabaseOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (options && options.instance) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.database.instance(options.instance).ref(path).onWrite(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.database.ref(path).onWrite(target[propertyKey]);
        }
    }
}

export function onFirestoreCreate(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.firestore.document(path).onCreate(target[propertyKey]);
    }
}

export function onFirestoreDelete(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.firestore.document(path).onDelete(target[propertyKey]);
    }
}

export function onFirestoreUpdate(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.firestore.document(path).onUpdate(target[propertyKey]);
    }
}

export function onFirestoreWrite(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.firestore.document(path).onWrite(target[propertyKey]);
    }
}

export function onCall() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.https.onCall(target[propertyKey]);
    }
}

export function onRequest(path: string = '/', options?: RequestOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (path == '/' && !options) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.https.onRequest(target[propertyKey]);
        } else {
            const app = express();
            app.use(cors({
                origin: true
            }));
            if (options && options.method) {
                app[options.method](path, target[propertyKey]);
            } else {
                app.get(path, target[propertyKey]);
            }
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.https.onRequest(app);
        }
    }
}

export function onSchedule(schedule: string, options?: ScheduleOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (options && options.timeZone) {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.pubsub.schedule(schedule).timeZone(options.timeZone).onRun(target[propertyKey]);
        } else {
            cloudFuncs[`${target.constructor.name}_${propertyKey}`] = functions.pubsub.schedule(schedule).onRun(target[propertyKey]);
        }
    }
}

export function getFunctions(pattern: string) {
    let files = glob.sync(pattern);
    files.map((f: string) => require(f));
    return cloudFuncs;
}
