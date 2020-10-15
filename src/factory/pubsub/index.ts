import { ScheduleRetryConfig } from '../../types';

export function createFuncWithPubsubRetryConfig(func: any, config: ScheduleRetryConfig | undefined) {
    if (config) {
        return func.retryConfig(config);
    }

    return func;
}

export function createFuncWithPubsubSchedule(func: any, schedule: string | undefined) {
    if (schedule) {
        return func.pubsub.schedule(schedule);
    }

    return func.pubsub;
}

export function createFuncWithPubsubTimeZone(func: any, timeZone: string | undefined) {
    if (timeZone) {
        return func.timeZone(timeZone);
    }

    return func;
}

export function createFuncWithPubsubTopic(func: any, topic: string | undefined) {
    if (topic) {
        return func.pubsub.topic(topic);
    }

    return func.pubsub;
}
