# bantam

<img src="https://raw.githubusercontent.com/FilamentSolutions/bantam/master/logo/logo.png" width="300">

Bantam is an extensible, ultra lightweight NodeJS framework for creating RESTful microservices.

Features include:
- built on top of [KOA](https://github.com/koajs/koa)
- built with [Typescript](https://github.com/microsoft/TypeScript) (but works with vanilla JS)
- simple REST routing
- [segregated business logic](https://en.wikipedia.org/wiki/Separation_of_concerns)
- [convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration) paradigms
- expressive logging (decent error reporting!)
- live reloading in developer mode
- small package size (xx with all dependencies)

## Getting started

Our goal with Bantam is reduce the work bootstrapping microservices and getting started is very simple.

Let's imagine we're creating a very simple user service.

### Installation

```
% npm install @_filament/bantam
```

Once installed initialise your app. This can be done with a brand new or existing app.

```
% npm run bantam init
```

Follow the CLI instructions and then starting building your microservice!

### Setup

Bantam expects the following folder structure:

```
| index.ts       // can have any name, it's where you run your app
| actions        // where your domain logic sits
|  |  index.ts   // primary logic lives here (might be all you need)
|  |  other.ts   // add as many other "domains" as you like (optional)
```

In the root level index.ts file add the following to run Bantam:

```
import Bantam from '@_filament/bantam';

const app = new Bantam();

app.run();
```

In the `actions` folder create the following files.

`actions/index.js`
```
class Index {

  fetchAll: () => { ... },

  fetchSingle: (id) => { ... },

  create: (data, request) => { ... },

  update: (id, data, request) => { ... },

  delete: (id) => { ... },

}
```

`actions/other.js`
```
class Other {

  fetchSingle: (id) => { ... },

  create: (data, request) => { ... },

  // NB: add as few methods as you need...

}
```

The setup above will make the following routes available:

```
GET      /
GET      /:id
POST     /
PATCH    /:id
DELETE   /:id

GET      /other/:id
POST     /other
```

And that's you ready to go!

### Development

If you have followed the standard installation, start the development server with:

```
% npm start
```

Your application will be served on http://localhost:3000

In development mode, when you make changes to files the application will update itself.

### Production

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
  livereload: false,
  ...
};

const app = new Bantam(options);

app.run();
```

The options object can have the following properties:

port
devPort
livereload
actionsFolder
indexFile

## Extending Bantam
