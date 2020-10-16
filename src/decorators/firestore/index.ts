import { funcActionMap } from '../';
import { composeFunctionName } from '../../utils';

// --------------- actions decorators ---------------

export function onFirestoreCreate(path: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

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
