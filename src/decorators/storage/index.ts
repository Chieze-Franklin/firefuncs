import { funcActionMap } from '../';
import { composeFunctionName } from '../../utils';

// map of function name to a boolean that is true
// if that function is decorated with any of the following:
// @onStorageObjectArchive, @onStorageObjectDelete, @onStorageObjectFinalize, @onStorageObjectMetadataUpdate
export const funcStorageMap: {[key: string]: boolean} = {};

// map of function name to storage bucket
export const funcStorageBucketMap: {[key: string]: string} = {};

// --------------- modifier decorators ---------------

export function bucket(bucketName: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        funcStorageBucketMap[composeFunctionName(target, propertyKey)] = bucketName;
    }
}

// --------------- actions decorators ---------------

export function onStorageObjectArchive() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcStorageMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onStorageObjectArchive'
            }
        ];
    }
}

export function onStorageObjectDelete() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcStorageMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onStorageObjectDelete'
            }
        ];
    }
}

export function onStorageObjectFinalize() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcStorageMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onStorageObjectFinalize'
            }
        ];
    }
}

export function onStorageObjectMetadataUpdate() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcStorageMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onStorageObjectMetadataUpdate'
            }
        ];
    }
}

