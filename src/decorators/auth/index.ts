import { funcActionMap } from '../';
import { composeFunctionName } from '../../utils';

// --------------- actions decorators ---------------

export function onAuthUserCreate() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onAuthUserCreate'
            }
        ];
    }
}

export function onAuthUserDelete() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onAuthUserDelete'
            }
        ];
    }
}
