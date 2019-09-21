# firefuncs

>> Create [Firebase cloud functions](https://firebase.google.com/docs/functions) from functions marked with [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).

>> `npm install --save firefuncs`

To demonstrate the use of firefuncs, let's create Firebase cloud functions with and without firefuncs.

## Creating Firebase cloud functions without firefuncs

For a start you may have all your cloud functions in one [file](https://github.com/firebase/functions-samples/tree/master/typescript-getting-started)

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
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { helloWorld, initializeApp } from './hello.functions';

exports.helloWorld = functions.https.onRequest(helloWorld);

exports.initializeApp = functions.https.onRequest(initializeApp);
```

While this is a lot better than the first example, it still requires that **index.ts** be modified every time new functions are added to or existing ones removed.

To get a solution where **index.ts** never needs to change even as functions are added or removed, we need a way of specifying what a function is meant for; we need a way of marking or _decorating_ a function with its purpose. Enter decorators!

## Creating Firebase cloud functions using firefuncs

Firefuncs makes use of decorators, an experimental TypeScript feature... enable those 2 options in tsconfig

Install firefuncs

Move your functions into ts classes

Decorate those class functions (methods)

Specify a glob pattern to match every file u want to consider
