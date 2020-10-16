import { funcActionMap } from '../';
import { composeFunctionName } from '../../utils';
import { ScheduleRetryConfig } from '../../types';

// map of function name to a boolean that is true
// if that function is decorated with any of the following:
// @onPubsubPublish, @onPubsubRun
export const funcPubsubMap: {[key: string]: boolean} = {};

// map of function name to pubsub retry config
export const funcPubsubRetryconfMap: {[key: string]: ScheduleRetryConfig} = {};

// map of function name to pubsub schedule
export const funcPubsubScheduleMap: {[key: string]: string} = {};

// map of function name to pubsub time zone
export const funcPubsubTimezoneMap: {[key: string]: string} = {};

// map of function name to pubsub topic
export const funcPubsubTopicMap: {[key: string]: string} = {};

// --------------- modifier decorators ---------------

export function retryConfig(config: ScheduleRetryConfig) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        funcPubsubRetryconfMap[composeFunctionName(target, propertyKey)] = config;
    }
}

export function schedule(scheduleString: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        funcPubsubScheduleMap[composeFunctionName(target, propertyKey)] = scheduleString;
    }
}

export function timeZone(timeZoneName: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        funcPubsubTimezoneMap[composeFunctionName(target, propertyKey)] = timeZoneName;
    }
}

export function topic(topicName: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        funcPubsubTopicMap[composeFunctionName(target, propertyKey)] = topicName;
    }
}

// --------------- actions decorators ---------------

export function onPubsubPublish() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcPubsubMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onPubsubPublish'
            }
        ];
    }
}

export function onPubsubRun() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const funcName = composeFunctionName(target, propertyKey);

        funcPubsubMap[funcName] = true;
        funcActionMap[funcName] = [
            ...(funcActionMap[funcName] || []),
            {
                type: 'onPubsubRun'
            }
        ];
    }
}
