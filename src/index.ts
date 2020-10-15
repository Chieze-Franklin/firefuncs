import * as functions from 'firebase-functions';
import * as glob from 'glob';
import { composeFunctionName } from './utils';

// ------------- function creators ------------

import {
    createFuncWithAction,
    createFuncWithRegion,
    createFuncWithRunWith
} from './factory';
import {
    createFuncWithDatabaseInstance
} from './factory/database';
import {
    createFuncWithFirestoreDatabase,
    createFuncWithFirestoreNamespace,
} from './factory/firestore';
import {
    createFuncWithPubsubRetryConfig,
    createFuncWithPubsubSchedule,
    createFuncWithPubsubTimeZone,
    createFuncWithPubsubTopic
} from './factory/pubsub';
import {
    createFuncWithStorageBucket
} from './factory/storage';

// ------------- maps/objects/dictionaries to help track decorators ------------

import {
    funcActionMap,
    funcRegionsMap,
    funcRunWithMap
} from './decorators';
import {
    funcDatabaseMap,
    funcDatabaseInstanceMap
} from './decorators/database';
import {
    funcFirestoreMap,
    funcFirestoreDatabaseMap,
    funcFirestoreNamespaceMap
} from './decorators/firestore';
import {
    funcPubsubMap,
    funcPubsubRetryconfMap,
    funcPubsubScheduleMap,
    funcPubsubTimezoneMap,
    funcPubsubTopicMap
} from './decorators/pubsub';
import {
    funcStorageMap,
    funcStorageBucketMap
} from './decorators/storage';

// ------------- exported decorators ------------

export {
    region,
    runWith
} from './decorators';
export {
    onAuthUserCreate,
    onAuthUserDelete
} from './decorators/auth';
export {
    instance,
    onDatabaseCreate,
    onDatabaseDelete,
    onDatabaseUpdate,
    onDatabaseWrite
} from './decorators/database';
export {
    database,
    namespace,
    onFirestoreCreate,
    onFirestoreDelete,
    onFirestoreUpdate,
    onFirestoreWrite
} from './decorators/firestore';
export {
    onHttpsCall,
    onHttpsRequest
} from './decorators/https';
export {
    retryConfig,
    schedule,
    timeZone,
    topic,
    onPubsubPublish,
    onPubsubRun
} from './decorators/pubsub';
export {
    bucket,
    onStorageObjectArchive,
    onStorageObjectDelete,
    onStorageObjectFinalize,
    onStorageObjectMetadataUpdate
} from './decorators/storage';

const cloudFuncs: {[key: string]: any} = {};

export function func() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcActionMap[funcName].forEach((funcAction, index) => {
            let cloudFunc = functions;

            // region
            cloudFunc = createFuncWithRegion(cloudFunc, funcRegionsMap[funcName]);

            // runWith
            cloudFunc = createFuncWithRunWith(cloudFunc, funcRunWithMap[funcName]);

            if (funcDatabaseMap[funcName]) {
                // database instance
                cloudFunc = createFuncWithDatabaseInstance(cloudFunc, funcDatabaseInstanceMap[funcName]);
            }

            if (funcFirestoreMap[funcName]) {
                // firestore database
                cloudFunc = createFuncWithFirestoreDatabase(cloudFunc, funcFirestoreDatabaseMap[funcName]);

                // firestore namespace
                cloudFunc = createFuncWithFirestoreNamespace(cloudFunc, funcFirestoreNamespaceMap[funcName]);
            }

            if (funcPubsubMap[funcName]) {
                // pubsub schedule
                // pubsub topic
                // can't use the 2 simultaneously
                if (funcPubsubScheduleMap[funcName]) {
                    cloudFunc = createFuncWithPubsubSchedule(cloudFunc, funcPubsubScheduleMap[funcName]);
                } else {
                    cloudFunc = createFuncWithPubsubTopic(cloudFunc, funcPubsubTopicMap[funcName]);
                }

                // pubsub retryConfig
                cloudFunc = createFuncWithPubsubRetryConfig(cloudFunc, funcPubsubRetryconfMap[funcName]);

                // pubsub timeZone
                cloudFunc = createFuncWithPubsubTimeZone(cloudFunc, funcPubsubTimezoneMap[funcName]);
            }

            if (funcStorageMap[funcName]) {
                // storage bucket
                cloudFunc = createFuncWithStorageBucket(cloudFunc, funcStorageBucketMap[funcName]);
            }

            // func actions
            cloudFunc = createFuncWithAction(cloudFunc, funcAction, target, propertyKey);

            // final result
            cloudFuncs[`${funcName}${funcActionMap[funcName].length > 1 ? `${(index + 1)}_${funcAction.type}` : ''}`] = cloudFunc;
        });
    }
}

export function getFunctions(pattern: string) {
    const files = glob.sync(pattern);
    files.map((f: string) => require(f));
    return cloudFuncs;
}
