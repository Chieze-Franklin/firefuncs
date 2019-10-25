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

- [onRequest](https://github.com/Chieze-Franklin/firefuncs/wiki/onRequest)

- [onFirestoreCreate, onFirestoreDelete, onFirestoreUpdate, onFirestoreWrite](https://github.com/Chieze-Franklin/firefuncs/wiki/onFirestoreCreate,-onFirestoreDelete,-onFirestoreUpdate,-onFirestoreWrite)

- [onDatabaseCreate, onDatabaseDelete, onDatabaseUpdate, onDatabaseWrite](https://github.com/Chieze-Franklin/firefuncs/wiki/onDatabaseCreate,-onDatabaseDelete,-onDatabaseUpdate,-onDatabaseWrite)

- [onSchedule](https://github.com/Chieze-Franklin/firefuncs/wiki/onSchedule)

- [onCall](https://github.com/Chieze-Franklin/firefuncs/wiki/onCall)

- [onAuthUserCreate, onAuthUserDelete](https://github.com/Chieze-Franklin/firefuncs/wiki/onAuthUserCreate,-onAuthUserDelete)
