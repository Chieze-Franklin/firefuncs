# firefuncs

>> Create [Firebase cloud functions](https://firebase.google.com/docs/functions) from Typescript functions marked with [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).

[![NPM version](https://badge.fury.io/js/firefuncs.svg)](http://badge.fury.io/js/firefuncs)

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

Move your functions into classes and decorate them with the appropriate decorators. In the example below, we want our functions to handle HTTP requests, so we decorate them with the `onHttpsRequest` decorator.

**functions/hello.functions.ts**
```ts
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { func, onHttpsRequest } from 'firefuncs';

export class Hello {
    @func()
    @onHttpsRequest()
    public helloWorld(request, response) {
        response.send('Hello from Firebase!\n\n');
    }

    @func()
    @onHttpsRequest()
    public initializeApp(request, response) {
        admin.initializeApp(functions.config().firebase);
    }
}
```

To create cloud functions, use the `getFunctions` function from firefuncs, supplying a glob pattern that matches all the files containing TypeScript class methods that should be converted to Firebase cloud functions.

**index.ts**
```ts
import { getFunctions } from 'firefuncs';

// search the 'functions' directory and all its subdirectories
// for JavaScript or TypeScript files
const funcs = getFunctions(__dirname + '/functions/**/*.{js,ts}');

// loop through the keys in 'funcs'
// and assign their values to matching keys in 'exports'
Object.keys(funcs).forEach(key => {
    exports[key] = funcs[key];
});
```

Now you can add more functions in the **/functions** directory and never need to edit **index.ts** for the added functions to be discovered and converted to Firebase cloud functions.

## Firefuncs decorators

- [func](https://github.com/Chieze-Franklin/firefuncs/wiki/func)

- [region](https://github.com/Chieze-Franklin/firefuncs/wiki/region)

- [runWith](https://github.com/Chieze-Franklin/firefuncs/wiki/runWith)

- [onAuthUserCreate, onAuthUserDelete](https://github.com/Chieze-Franklin/firefuncs/wiki/onAuthUserCreate,-onAuthUserDelete)

- [onDatabaseCreate, onDatabaseDelete, onDatabaseUpdate, onDatabaseWrite](https://github.com/Chieze-Franklin/firefuncs/wiki/onDatabaseCreate,-onDatabaseDelete,-onDatabaseUpdate,-onDatabaseWrite)

- [onFirestoreCreate, onFirestoreDelete, onFirestoreUpdate, onFirestoreWrite](https://github.com/Chieze-Franklin/firefuncs/wiki/onFirestoreCreate,-onFirestoreDelete,-onFirestoreUpdate,-onFirestoreWrite)

- [onHttpsCall, onHttpsRequest](https://github.com/Chieze-Franklin/firefuncs/wiki/onHttpsCall,-onHttpsRequest)

- [onPubsubPublish, onPubsubRun](https://github.com/Chieze-Franklin/firefuncs/wiki/onPubsubPublish,-onPubsubRun)

- [onStorageObjectArchive, onStorageObjectDelete, onStorageObjectFinalize, onStorageObjectMetadataUpdate](https://github.com/Chieze-Franklin/firefuncs/wiki/onStorageObjectArchive,-onStorageObjectDelete,-onStorageObjectFinalize,-onStorageObjectMetadataUpdate)

## Multiple decorators

Decorators that start with `on` (like `onFirestoreCreate`, `onStorageObjectArchive`) are primary decorators. They are the ones that ultimately determine what type of cloud function is created from a decorated TypeScript class method.

You can apply multiple primary decorators on a single class method. You can even repeat a primary decorator multiple times on a single class method. This has the effect of creating multiple cloud functions from a single class method, one cloud function for each primary decorator.

## Autogenerated cloud function names

### Specifying name in func

You can specify a name for the produced cloud function by supplying a `name` argument to the `@func` decorator.

```ts
import { func, onHttpsRequest } from 'firefuncs';

export class Hello {
    @func('my_cloud_function')
    @onHttpsRequest()
    public helloWorld(request, response) {
        response.send('Hello from Firebase!\n\n');
    }
}
```

The produced cloud function will be named `my_cloud_function`.

### Specifying no name in func

If you supply no `name` argument to the `@func` decorator, the produced cloud function will be named using the name of the TypeScript class and the name of the method, concatenated using an underscore (`_`).

```ts
import { func, onHttpsRequest } from 'firefuncs';

export class Hello {
    @func()
    @onHttpsRequest()
    public helloWorld(request, response) {
        response.send('Hello from Firebase!\n\n');
    }
}
```

The produced cloud function will be named `Hello_helloWorld`.

### Applying multiple primary decorators on a method

If multiple primary decorators are applied to a method, the produced cloud functions will be named as described above, followed by a number (ranging from `1` to `n`, where `n` is the number of primary decorators applied to the method), followed by an underscore (`_`), and followed by the name of the decorator.

#### Example 1
```ts
import { func, onStorageObjectArchive, onStorageObjectDelete, onStorageObjectFinalize } from 'firefuncs';

export class Hello {
    @func('my_cloud_function')
    @onStorageObjectArchive()
    @onStorageObjectArchive()
    @onStorageObjectArchive()
    @onStorageObjectFinalize()
    public helloWorld(object) {
        response.send('Hello from Firebase!\n\n');
    }
}
```

This will produce 4 cloud functions named

- my_cloud_function1_onStorageObjectFinalize
- my_cloud_function2_onStorageObjectDelete
- my_cloud_function3_onStorageObjectArchive
- my_cloud_function4_onStorageObjectArchive

#### Example 2

```ts
import { func, onStorageObjectArchive, onStorageObjectDelete, onStorageObjectFinalize } from 'firefuncs';

export class Hello {
    @func()
    @onStorageObjectArchive()
    @onStorageObjectArchive()
    @onStorageObjectDelete()
    @onStorageObjectFinalize()
    public helloWorld(object) {
        response.send('Hello from Firebase!\n\n');
    }
}
```

This will produce 4 cloud functions named

- Hello_helloWorld1_onStorageObjectFinalize
- Hello_helloWorld2_onStorageObjectDelete
- Hello_helloWorld3_onStorageObjectArchive
- Hello_helloWorld4_onStorageObjectArchive
