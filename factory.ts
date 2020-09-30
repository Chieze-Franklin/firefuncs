import cors from 'cors';
import express from 'express';
import { RequestMiddleware } from './middleware';
import {
    FunctionAction,
    RuntimeOptions,
    RequestOptions,
    ScheduleOptions,
    StorageOptions,
    Region
} from './options';

const map = new Map<string, RequestMiddleware>();

export function createFuncWithDatabaseInstance(func: any, instance: string | undefined) {
    if (instance) {
        return func.database.instance(instance);
    }

    return func.database;
}

export function createFuncWithRegion(func: any, regions: Region[] | undefined) {
    if (regions) {
        return func.region(regions);
    }

    return func;
}

export function createFuncWithRunWith(func: any, runtimeOptions: RuntimeOptions | undefined) {
    if (runtimeOptions) {
        return func.runWith(runtimeOptions);
    }

    return func;
}

export function createFuncWithAction(func: any, functionAction: FunctionAction, target: any, propertyKey: string) {
    switch (functionAction.type) {
        case 'onCall':
            return func.https.onCall(target[propertyKey]);
        case 'onDatabaseCreate': {
            const path = functionAction.payload?.path;

            return func.ref(path).onCreate(target[propertyKey]);
        }
        case 'onDatabaseDelete': {
            const path = functionAction.payload?.path;

            return func.ref(path).onDelete(target[propertyKey]);
        }
        case 'onDatabaseUpdate': {
            const path = functionAction.payload?.path;

            return func.ref(path).onUpdate(target[propertyKey]);
        }
        case 'onDatabaseWrite': {
            const path = functionAction.payload?.path;

            return func.ref(path).onWrite(target[propertyKey]);
        }
        case 'onRequest': {
            const path = functionAction.payload?.path || '/';
            const options: RequestOptions = functionAction.payload?.options;

            if (path === '/' && !options) {
                return func.https.onRequest(target[propertyKey]);
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

                return func.https.onRequest(app);
            }
        }
        default:
            return func.https.onCall(target[propertyKey]);
    }
}
