import * as functions from 'firebase-functions';
import * as glob from 'glob';

let cloudFuncs: any = {};

export function onDatabaseCreate(path: string, instance?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (instance) {
            cloudFuncs[propertyKey] = functions.database.instance(instance).ref(path).onCreate(target[propertyKey]);
        } else {
            cloudFuncs[propertyKey] = functions.database.ref(path).onCreate(target[propertyKey]);
        }
    }
}

export function onDatabaseDelete(path: string, instance?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (instance) {
            cloudFuncs[propertyKey] = functions.database.instance(instance).ref(path).onDelete(target[propertyKey]);
        } else {
            cloudFuncs[propertyKey] = functions.database.ref(path).onDelete(target[propertyKey]);
        }
    }
}

export function onDatabaseUpdate(path: string, instance?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (instance) {
            cloudFuncs[propertyKey] = functions.database.instance(instance).ref(path).onUpdate(target[propertyKey]);
        } else {
            cloudFuncs[propertyKey] = functions.database.ref(path).onUpdate(target[propertyKey]);
        }
    }
}

export function onDatabaseWrite(path: string, instance?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (instance) {
            cloudFuncs[propertyKey] = functions.database.instance(instance).ref(path).onWrite(target[propertyKey]);
        } else {
            cloudFuncs[propertyKey] = functions.database.ref(path).onWrite(target[propertyKey]);
        }
    }
}

export function onFirestoreCreate(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[propertyKey] = functions.firestore.document(path).onCreate(target[propertyKey]);
    }
}

export function onFirestoreDelete(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[propertyKey] = functions.firestore.document(path).onDelete(target[propertyKey]);
    }
}

export function onFirestoreUpdate(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[propertyKey] = functions.firestore.document(path).onUpdate(target[propertyKey]);
    }
}

export function onFirestoreWrite(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[propertyKey] = functions.firestore.document(path).onWrite(target[propertyKey]);
    }
}

export function onCall() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[propertyKey] = functions.https.onCall(target[propertyKey]);
    }
}

export function onRequest() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        cloudFuncs[propertyKey] = functions.https.onRequest(target[propertyKey]);
    }
}

export function getFunctions(pattern: string) {
    let files = glob.sync(pattern);
    files.map((f: string) => require(f));
    return cloudFuncs;
}
