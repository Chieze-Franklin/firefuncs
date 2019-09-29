# firefuncs

>> Create [Firebase cloud functions](https://firebase.google.com/docs/functions) from functions marked with [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).

```bash
npm i firefuncs
```

To demonstrate the use of firefuncs, let's create Firebase cloud functions with and without firefuncs.

## Creating Firebase cloud functions without firefuncs

For a start you may have all your [cloud functions](https://github.com/firebase/functions-samples/tree/master/typescript-getting-started) in one file.

**index.ts**
```typescript
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send('Hello from Firebase!\n\n');
});

exports.initializeApp = functions.https.onRequest(async (request, response) => {
 admin.initializeApp(functions.config().firebase);
});
```

Over time that file grows and that necessitates breaking it into smaller files. You may do so as shown below.

**hello.functions.ts**
```typescript
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const helloWorld = (request, response) => {
 response.send('Hello from Firebase!\n\n');
};

export const initializeApp = async (request, response) => {
 admin.initializeApp(functions.config().firebase);
};
```

**index.ts**
```typescript
// import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { helloWorld, initializeApp } from './hello.functions';

exports.helloWorld = functions.https.onRequest(helloWorld);

exports.initializeApp = functions.https.onRequest(initializeApp);
```

While this is a lot better than the first example, it still requires that **index.ts** be modified every time new functions are added or existing ones removed.

To get a solution where **index.ts** never needs to change even as functions are added or removed, we need a way of specifying what a function is meant for; we need a way of marking or _decorating_ a function with its purpose. Enter [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)!

## Creating Firebase cloud functions using firefuncs

`firefuncs` makes use of decorators, an experimental TypeScript feature. Ensure you enable `experimentalDecorators` and `emitDecoratorMetadata` options in **tsconfig.json**.
```js
{
  "compilerOptions": {
    /* Other Options */

    /* Experimental Options */
    "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    "emitDecoratorMetadata": true         /* Enables experimental support for emitting type metadata for decorators. */
  }
}
```

Install firefuncs

```bash
npm i firefuncs
```

Move your functions into classes and decorate them with the appropriate decorators. In the example below, we want our functions to handle HTTP requests, so we decorate them with the `onRequest` decorator.

**functions/hello.functions.ts**
```ts
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { onRequest } from 'firefuncs';

export class Hello {
    @onRequest()
    public helloWorld(request, response) {
        response.send('Hello from Firebase!\n\n');
    }
    @onRequest()
    public initializeApp(request, response) {
        admin.initializeApp(functions.config().firebase);
    }
}
```

To create cloud functions, use the `getFunctions` function from firefuncs, supplying a glob pattern that matches all the files containing JavaScript functions that should be converted to Firebase cloud functions.

**index.ts**
```ts
import { getFunctions } from 'firefuncs';

// search the 'functions' directory and all its subdirectories
// for JavaScript or TypeScript files
const funcs = getFunctions(__dirname + '/functions/**/*.{js,ts}');

// just writing 'exports = funcs;' won't work
// you have to loop through the keys in 'funcs'
// and assign their values to matching keys in 'exports'
Object.keys(funcs).forEach(key => {
    exports[key] = funcs[key];
});
```

Now you can add more functions in the **/functions** directory and never need to edit **index.ts** for the added functions to be discovered and converted to Firebase cloud functions.

## Firefuncs decorators

### onRequest
```ts
onRequest(path: string = '/', options?: RequestOptions, ...regions: Region[])
```

The `onRequest` decorator specifies that a function should [handle an HTTP request](https://firebase.google.com/docs/functions/http-events).

#### parameters
- **path**  
This is a `string` parameter that represents an [Express-style route path](https://expressjs.com/en/guide/routing.html), like `/users/:id`.

- **options**  
This is an optional `RequestOptions` parameter for passing in extra data to the decorator.

```ts
class RequestOptions {
    method?: RequestMethodType;
    middleware?: typeof RequestMiddleware[];
}

class RequestMiddleware {
    middleware(req, res, next) {}
}

type RequestMethodType = "delete" | "get" | "options" | "post" | "put"
```

- **regions**  
This is an optional list of [regions](https://firebase.google.com/docs/functions/locations) where the function should be deployed to.

#### example
```ts
import { onRequest } from 'firefuncs';

export class Records {
    @onRequest()
    public async hello(req, res) {
        res.send('Hello World!');
    }

    @onRequest('/', {
        method: 'post',
        middleware: [InitMiddleware, AuthMiddleware]
    }, 'europe-west1')
    public async save(req, res) {
        try {
            const db = req.firestore.db;
            await db.collection('records').add({ ...req.body });
            res.send('Added records successfully');
        } catch (error) {
            res.send({ error })
        }
    }
}

class AuthClientMiddleware {
    async middleware(req, res, next) {
        console.log('Authenticate the request here');
    }
}

class InitMiddleware {
    async middleware(req, res, next) {
        console.log('Initialize the Firebase app here');
    }
}
```

>> **Note:** A middleware is any class that has a method named `middleware` with the same signature as an [Express middleware](https://expressjs.com/en/guide/using-middleware.html). 

### onFirestoreCreate, onFirestoreDelete, onFirestoreUpdate, onFirestoreWrite
```ts
onFirestoreCreate(path: string, ...regions: Region[])
onFirestoreDelete(path: string, ...regions: Region[])
onFirestoreUpdate(path: string, ...regions: Region[])
onFirestoreWrite(path: string, ...regions: Region[])
```

These decorators specify that a function should [handle events in Cloud Firestore](https://firebase.google.com/docs/functions/firestore-events).

#### parameters
- **path**  
This is a `string` parameter that represents the path to the document that is being listened to.

- **regions**  
This is an optional list of [regions](https://firebase.google.com/docs/functions/locations) where the function should be deployed to.

#### example
```ts
import { onFirestoreCreate, onFirestoreDelete, onFirestoreUpdate, onFirestoreWrite } from 'firefuncs';

export class FirestoreFunctions {
    @onFirestoreCreate('users/{userId}')
    public async listenForWhenUserIsCreated(snapshot, context) {
        console.log(`New data at users/${context.params.userId} is:`);
        console.log(snapshot.data());
    }
    @onFirestoreDelete('users/{userId}')
    public async listenForWhenUserIsDeleted(snapshot, context) {
        console.log(`Deleted data at users/${context.params.userId} is:`);
        console.log(snapshot.data());
    }
    @onFirestoreUpdate('users/{userId}')
    public async listenForWhenUserIsUpdated(change, context) {
        console.log(`previous data at users/${context.params.userId} is:`);
        console.log(change.before.data());
        console.log(`New data at users/${context.params.userId} is:`);
        console.log(change.after.data());
    }
    @onFirestoreWrite('users/marie')
    public async listenForWhenUserMarieIsWritten(change, context) {
        console.log('previous data at users/marie is:');
        console.log(change.before.data());
        // a write operation could be a create, update or delete
        // check to see if the document still exists
        console.log('New data at users/marie is:');
        console.log(change.after.exists ? change.after.data() : undefined);
    }
    @onFirestoreWrite('users/{userId}')
    public async listenForWhenUserIsWritten(change, context) {
        console.log(`previous data at users/${context.params.userId} is:`);
        console.log(change.before.data());
        // a write operation could be a create, update or delete
        // check to see if the document still exists
        console.log(`New data at users/${context.params.userId} is:`);
        console.log(change.after.exists ? change.after.data() : undefined);
    }
}
```

### onDatabaseCreate, onDatabaseDelete, onDatabaseUpdate, onDatabaseWrite
```ts
onDatabaseCreate(path: string, options?: DatabaseOptions, ...regions: Region[])
onDatabaseDelete(path: string, options?: DatabaseOptions, ...regions: Region[])
onDatabaseUpdate(path: string, options?: DatabaseOptions, ...regions: Region[])
onDatabaseWrite(path: string, options?: DatabaseOptions, ...regions: Region[])
```

These decorators specify that a function should [handle events in Firebase Realtime Database](https://firebase.google.com/docs/functions/database-events).

#### parameters
- **path**  
This is a `string` parameter that represents the path to the document that is being listened to.

- **options**  
This is an optional `DatabaseOptions` parameter for passing in extra data to the decorator.

```ts
class DatabaseOptions {
    instance?: string; // the database instance
}
```

- **regions**  
This is an optional list of [regions](https://firebase.google.com/docs/functions/locations) where the function should be deployed to.

#### example
```ts
import { onDatabaseCreate, onDatabaseDelete, onDatabaseUpdate, onDatabaseWrite } from 'firefuncs';

export class FirestoreFunctions {
    @onDatabaseCreate('/messages/{pushId}/original')
    public async makeUppercase(snapshot, context) {
        const original = snapshot.val();
        console.log('Uppercasing', context.params.pushId, original);
        const uppercase = original.toUpperCase();
        return snapshot.ref.parent.child('uppercase').set(uppercase);
    }
    @onDatabaseWrite('/messages/{pushId}/original')
    public async makeUppercase2(change, context) {
        if (change.before.exists()) {
            return null;
        }
        // Exit when the data is deleted.
        if (!change.after.exists()) {
            return null;
        }
        const original = change.after.val();
        const uppercase = original.toUpperCase();
        return change.after.ref.parent.child('uppercase').set(uppercase);
    }
}
```

### onSchedule
```ts
onSchedule(schedule: string, options?: ScheduleOptions, ...regions: Region[])
```

The `onSchedule` decorator specifies that a function should [run at specified times](https://firebase.google.com/docs/functions/schedule-functions).

#### parameters
- **schedule**  
This is a `string` parameter that represents when you want the function to run. Both Unix Crontab and AppEngine syntax are supported.

- **options**  
This is an optional `ScheduleOptions` parameter for passing in extra data to the decorator.

```ts
class ScheduleOptions {
    timeZone?: string;
}
```

- **regions**  
This is an optional list of [regions](https://firebase.google.com/docs/functions/locations) where the function should be deployed to.

#### example
```ts
import { onSchedule } from 'firefuncs';

export class Schedules {
    @onSchedule('every 5 minutes')
    public async scheduledFunction(context) {
        console.log('This will be run every 5 minutes!');
        return null;
    }
    @onSchedule('5 11 * * *', {
        timeZone: 'America/New_York'
    }, 'europe-west1')
    public async scheduledFunctionCrontab(context) {
        console.log('This will be run every day at 11:05 AM Eastern!');
        return null;
    }
}
```

### onCall
```ts
onCall(...regions: Region[])
```

The `onCall` decorator specifies that a function should [be callable directly from a Firebase app](https://firebase.google.com/docs/functions/callable).

#### parameters
- **regions**  
This is an optional list of [regions](https://firebase.google.com/docs/functions/locations) where the function should be deployed to.
