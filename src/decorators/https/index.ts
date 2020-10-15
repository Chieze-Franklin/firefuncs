import { funcActionMap } from '../';
import { composeFunctionName } from '../../utils';
import { RequestOptions } from '../../types';

// --------------- actions decorators ---------------

export function onHttpsCall() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onHttpsCall'
            }
        ];
    }
}

export function onHttpsRequest(path: string = '/', options?: RequestOptions) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onHttpsRequest',
                payload: {
                    options,
                    path: path || '/'
                }
            }
        ];
    }
}