import { funcActionMap } from '../';
import { composeFunctionName } from '../../utils';

// map of function name to a boolean that is true
// if that function is decorated with any of the following:
// @"onDatabaseCreate, @onDatabaseDelete" | "onDatabaseUpdate" | "onDatabaseWrite"
export const funcDatabaseMap: {[key: string]: boolean} = {};

// map of function name to database instance
export const funcDatabaseInstanceMap: {[key: string]: string} = {};

// --------------- modifier decorators ---------------

export function instance(instanceName: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        funcDatabaseInstanceMap[composeFunctionName(target, propertyKey)] = instanceName;
    }
}

// --------------- actions decorators ---------------

export function onDatabaseCreate(path: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcDatabaseMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
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
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcDatabaseMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
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
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcDatabaseMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
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
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcDatabaseMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onDatabaseWrite',
                payload: {
                    path
                }
            }
        ];
    }
}
