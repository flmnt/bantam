# bantam

<img src="https://raw.githubusercontent.com/FilamentSolutions/bantam/master/logo/logo.png" width="300">

Bantam is an extensible, ultra lightweight, NodeJS framework for creating RESTful microservices.

Features include:
- built on top of [Koa](https://github.com/koajs/koa)
- built with [Typescript](https://github.com/microsoft/TypeScript) (works with vanilla JS)
- simple REST routing
- [segregated business logic](https://en.wikipedia.org/wiki/Separation_of_concerns)
- [convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration) paradigm
- expressive logging (decent error reporting!)
- live reloading in developer mode
- small package size (xx with all dependencies)


## Getting started

Our goal with Bantam is reduce the work bootstrapping microservices.

Getting started with your first microservice is very simple.


### Installation

```
% npm install @_filament/bantam
```

Once you have installed Bantam you can initialise your app; this can be done with either a brand new or existing app.

```
% npm run bantam init
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
import Bantam from '@_filament/bantam';

const app = new Bantam();

app.run();
```

In the `actions` folder create the following files.

`actions/index.ts`
```
class Index {

  fetchAll: () => { ... },

  fetchSingle: (id) => { ... },

  create: (data, request) => { ... },

  update: (id, data, request) => { ... },

  delete: (id) => { ... },

}
```

`actions/other.ts`
```
class Other {

  fetchSingle: (id) => { ... },

  create: (data, request) => { ... },

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

If you have followed the standard installation, start the development server with:

```
% npm start
```

Your application will be served on http://localhost:3000

In development mode, when you make changes to files the application will update itself.


### Production

To serve your microservice in production use:

```
% npm serve
```

Your application is served at http://your-host:3000

You can change the port number via the configuration options.


## Configuration Options

For advanced configuration pass an options object when instantiating Bantam.

```
import Bantam from '@_filament/bantam';

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

`Default: "index.ts"`

<br>

**actionsFileExt**: `string`

The file extension for action files.

`Default: "ts"`


## Extending Bantam

Bantam has been built on top of [Koa](https://github.com/koajs/koa), to expose the Koa application and extend Bantam's functionality you can do the following:

```
import Bantam from '@_filament/bantam';

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


## Contribution

We welcome feedback, suggestions and contributions.

If you have an idea you want to discuss please [open an issue](https://github.com/FilamentSolutions/bantam/issues/new).


## Licenses

Free for personal and commerical use under the [MIT License](https://github.com/FilamentSolutions/bantam/blob/master/LICENSE.md)

Basil the Bantam was created with a free vector from [Vectorportal.com](https://vectorportal.com)
