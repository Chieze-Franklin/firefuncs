import {
    FunctionAction,
    RuntimeOptions,
    Region
} from '../types';
import { composeFunctionName } from '../utils';

// map of function name to function actions
// (a function can have more than 1 action decorator applied to it)
export const funcActionMap: {[key: string]: FunctionAction[]} = {};

// map of function name to regions
export const funcRegionsMap: {[key: string]: Region[]} = {};

// map of function name to runtime options
export const funcRunWithMap: {[key: string]: RuntimeOptions} = {};

// --------------- modifier decorators ---------------

export function region(...regions: Region[]) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (!regions || regions.length === 0) {
            regions = ['us-central1'];
        }

        funcRegionsMap[composeFunctionName(target, propertyKey)] = regions;
    }
}

export function runWith(runtimeOptions: RuntimeOptions) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        funcRunWithMap[composeFunctionName(target, propertyKey)] = runtimeOptions;
    }
}
