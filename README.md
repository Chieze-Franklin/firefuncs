# firefuncs

>> Create Firebase Cloud Functions from functions marked with decorators.

>> `npm install --save firefuncs`

## Creating Firebase Cloud Functions without firefuncs

- having your funcs in one place is not maintanable
- splitting them helps only so much
- we need a way to split them but still make them easily discoverable

## Creating Firebase Cloud Functions using firefuncs

Firefuncs makes use of decorators, an experimental TypeScript feature... enable those 2 options in tsconfig

Install firefuncs

Move your functions into ts classes

Decorate those class functions (methods)

Specify a glob pattern to match every file u want to consider
