import cors from 'cors';
import express from 'express';

import { RequestMiddleware } from '../middleware';
import {
    FunctionAction,
    RuntimeOptions,
    RequestOptions,
    Region
} from '../types';

const map = new Map<string, RequestMiddleware>();

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
        case 'onAuthUserCreate':
            return func.auth.user().onCreate(target[propertyKey]);
        case 'onAuthUserDelete':
            return func.auth.user().onDelete(target[propertyKey]);
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
        case 'onFirestoreCreate': {
            const path = functionAction.payload?.path;

            return func.document(path).onCreate(target[propertyKey]);
        }
        case 'onFirestoreDelete': {
            const path = functionAction.payload?.path;

            return func.document(path).onDelete(target[propertyKey]);
        }
        case 'onFirestoreUpdate': {
            const path = functionAction.payload?.path;

            return func.document(path).onUpdate(target[propertyKey]);
        }
        case 'onFirestoreWrite': {
            const path = functionAction.payload?.path;

            return func.document(path).onWrite(target[propertyKey]);
        }
        case 'onHttpsCall':
            return func.https.onCall(target[propertyKey]);
        case 'onHttpsRequest': {
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
        case 'onPubsubPublish':
            return func.onPublish(target[propertyKey]);
        case 'onPubsubRun':
            return func.onRun(target[propertyKey]);
        case 'onStorageObjectArchive':
            return func.object().onArchive(target[propertyKey]);
        case 'onStorageObjectDelete':
            return func.object().onDelete(target[propertyKey]);
        case 'onStorageObjectFinalize':
            return func.object().onFinalize(target[propertyKey]);
        case 'onStorageObjectMetadataUpdate':
            return func.object().onMetadataUpdate(target[propertyKey]);
        default:
            return func.https.onCall(target[propertyKey]);
    }
}
