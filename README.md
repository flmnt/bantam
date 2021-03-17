# bantam

<img src="https://raw.githubusercontent.com/flmnt/bantam/master/logo/logo.png" alt="Basil the Bantam" width="300">

Bantam is an extensible, ultra lightweight, NodeJS framework for creating RESTful microservices.

Features include:

- built on top of [Koa](https://github.com/koajs/koa)
- built with [Typescript](https://github.com/microsoft/TypeScript) (works with vanilla JS)
- simple REST routing
- [segregated business logic](https://en.wikipedia.org/wiki/Separation_of_concerns)
- [convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration) paradigm
- expressive logging (decent error reporting!)
- live reloading in developer mode

Need to build a Python microservice? [Check out Pantam](https://github.com/flmnt/pantam)

## Getting started

Our goal with Bantam is reduce the work bootstrapping microservices.

With Bantam you can create a basic REST API in 5 minutes or less.

### Examples

- [Domain segregated example](https://github.com/flmnt/bantam/tree/master/example/domain)
- [Event based example](https://github.com/flmnt/bantam/tree/master/example/event)
- [Typescript example](https://github.com/flmnt/bantam/tree/master/example/typescript)

### Installation

First, install the required packages.

For Typescript:

```
% npm i @flmnt/bantam ts-node ts-node-dev typescript
% npm i @types/node @types/koa @types/koa-bodyparser @types/koa-router
```

Or for Javascript:

```
% npm i @flmnt/bantam node-dev
```

Once you have installed Bantam you can initialise your app; this can be done with either a brand new or existing app.

```
% npx @flmnt/bantam init
```

Follow the CLI instructions and then start building your microservice!

### Setup

Bantam expects the following folder structure:

```
| index.ts       // can have any name, it's where you run your app
| actions        // where your domain logic sits
|  |  index.ts   // primary logic lives here (might be all you need)
|  |  other.ts   // add as many other "domains" as you like (optional)
```

In the root level `index.ts` file add the following to run Bantam:

```
import Bantam from '@flmnt/bantam';

const app = new Bantam();

app.run();
```

In the `actions` folder create the following files.

`actions/index.ts`

```
class Index {

  fetchAll: (ctx) => { ... },

  fetchSingle: (id, ctx) => { ... },

  create: (data, ctx) => { ... },

  update: (id, data, ctx) => { ... },

  delete: (id, ctx) => { ... },

}
```

`actions/other.ts`

```
class Other {

  fetchSingle: (id, ctx) => { ... },

  create: (data, ctx) => { ... },

  // NB: add as few methods as you need...

}
```

The setup above will make the following routes available:

```
GET      /            // Index.fetchAll()
GET      /:id         // Index.fetchSingle()
POST     /            // Index.create()
PATCH    /:id         // Index.update()
DELETE   /:id         // Index.delete()

GET      /other/:id   // Other.fetchSingle()
POST     /other       // Other.create()
```

And that's you ready to go!

### Development

Start the development server with:

```
% npx @flmnt/bantam serve --dev
```

Your application will be served on http://localhost:3000

In development mode, when you make changes to files the application will update itself.

### Production

To serve your microservice in production use:

```
% npx @flmnt/bantam serve
```

Your application is served at http://your-host:3000

You can change the port number via the configuration options.

## .bantamrc.js

After running `npx @flmnt/bantam init` you will have a `.bantamrc.js` file in your directory with some CLI config options like this:

```
module.exports = {
  actionsFolder: 'actions',
  language: 'typescript',
  entrypoint: 'index.js',
};
```

The `.bantamrc` file provides configuration options for the CLI. You only need to change it if you switch language, change your main file (entrypoint) or rename your actions folder.

## Add New Routes

To add a new action (resource) you can either create a new file in the actions folder or use the CLI to make the file for you:

```
% npx @flmnt/bantam action index.ts
```

You can add the standard methods (`fetchAll`, `fetchSingle`, `create`, `update`, `delete`) to an action class which will automatically create the standard routes.

If you'd like to create custom methods for your action class you can create custom getters like this:

```
// GET -> /custom-method/
getCustomMethod(ctx) {
  return ctx.body = 'Custom response';
}
```

And custom setters like this:

```
// POST -> /custom-method/
setCustomMethod(data, ctx) {
  console.log(data);
  return ctx.body = 'Custom response';
}
```

From version 0.2.0 onwards you can also create a `do` method, which is a custom post method that also expects an identifier as part of the url.

```
// POST -> /custom-method/{id}
doCustomMethod(id, data, ctx) {
  console.log(id, data);
  return ctx.body = 'Custom response';
}
```

Bantam will ignore methods that are not "standard" methods or do not start with `get` or `set`. However if you want to _ensure_ that your method will be ignored you can prefix the method with an underscore, like this:

```
_myHiddenMethod() {
  // do something secret
}
```

## Creating Responses

Each method in an action file is passed a context (ctx) argument which you use to build a response. You can read the Koa [context API here](https://github.com/koajs/koa/blob/master/docs/api/context.md).

Creating standard responses is very straightforward.

```
fetchAll(ctx) {
  ctx.body = 'Your response here';
}
```

Changing status code is also simple.

```
fetchAll(ctx) {
  ctx.body = 'Your response here';
  ctx.status = 201;
}
```

Adjusting headers requires you to use the `ctx.set()` method.

```
fetchAll(ctx) {
  ctx.body = 'Your response here';
  ctx.status = 201;
  ctx.set('Cache-Control', 'no-cache');
}
```

## Async/Await Support

Feel free to create synchronous or asynchronous action, methods. Bantam can handle both.

```
async getAsyncExample() {
  const result = await findRecords();
  ctx.body = result;
}

getSyncExample() {
  ctx.body = 'static content';
}
```

## Configuration Options

For advanced configuration pass an options object when instantiating Bantam.

```
import Bantam from '@flmnt/bantam';

const options = {
  port: 80,
  ...
};

const app = new Bantam(options);

app.run();
```

The options object can have the following properties:

**port**: `integer`

Sets the port number when serving the app in production mode.

`Default: 3000`

<br>

**devPort**: `integer`

Sets the port number when serving the app in development mode.

`Default: 3000`

<br>

**actionsFolder**: `string`

The folder that contains your action files.

`Default: "actions"`

<br>

**actionsIndexFile**: `string`

The primary action file in your action folder.

`Default: "index"`

<br>

**actionsFileExt**: `string`

The file extension for action files.

`Default: "ts"`

## Extending Bantam

Bantam has been built on top of [Koa](https://github.com/koajs/koa), to expose the Koa application and extend Bantam's functionality you can do the following:

```
import Bantam from '@flmnt/bantam';

const app = new Bantam();

app.extend((koaApp) => {

  koaApp.use(async (ctx, next) => {
    // your code here...
    await next();
  });

  return koaApp;
});

app.run();
```

If you need to add middlewear to specific routes, you'll likely want to interact with the Bantam router, which is provided by [Koa Router](https://github.com/ZijianHe/koa-router).

```
import Bantam from '@flmnt/bantam';

const app = new Bantam();

app.extend((koaApp, koaRouter) => {

  koaApp.use(initMiddlewear());

  koaRouter.use('/url', useMiddlewear());

  return [koaApp, koaRouter];
});

app.run();
```

_NB: if you adjust the router as well as the Koa app, make sure your callback returns an array with the app and then the router (in that order)_

## Debugging

If you're struggling to debug and issue and unsure what routes Bantam has created for you, you can use `logRoutes()` to find out.

```
const app = new Bantam();

app.run().then((app) => {
  app.logRoutes();
});
```

Also check trailing slashes in your urls, these are important.

In the example below the url `test/1` and `test/custom-method` both trigger `fetchSingle()` but the url `test/custom-method/` (with the trailing slash) triggers `getCustomMethod()`.

```
// actions/test.js

// GET -> test/custom-method
// GET -> test/:id
fetchSingle() {}

// GET -> test/custom-method/
getCustomMethod() {}
```

## Contribution

We welcome feedback, suggestions and contributions.

If you have an idea you want to discuss please [open an issue](https://github.com/flmnt/bantam/issues/new).

## Licenses

Free for personal and commerical use under the [MIT License](https://github.com/flmnt/bantam/blob/master/LICENSE.md)

_Basil the Bantam_ was created with a free vector from [Vectorportal.com](https://vectorportal.com)
