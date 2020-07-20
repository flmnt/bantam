# Typescript microservice example

The following example microservice has been created using [Bantam](https://github.com/flmnt/bantam).

Follow the quickstart steps below to checkout this repo and explore this exact example or skip this step and creating this example yourself from scratch.

## Quickstart

Open a terminal and run the following:

```
git clone git@github.com:flmnt/bantam.git
cd bantam/example/typescript
npm install
npx @flmnt/bantam serve -d
```

To test the example app out, in a new terminal, run:

```
curl --request GET 'http://localhost:3000/text/welcome-message/'
```

## Tutorial

Let's build the example in this folder from scratch together.

We're going to build a microservice with Typescript.

Start by creating a new folder, initialising your app and install Bantam with few other dependencies.

```
% mkdir example
% cd example
% npm init -y
% npm i @flmnt/bantam ts-node ts-node-dev
```

Next we'll use the Bantam CLI to make our application.

```
% npx @flmnt/bantam init
```

Follow the steps and create two action files - number.ts and text.ts - to get a structure like this:

```
| index.ts
| actions
|   number.ts
|   text.ts
```

Now let's run the application!

```
% npx @flmnt/bantam serve --dev
```

You should see something like this:

```
BANTAM: Application loaded! Serving at http://localhost:3000/
BANTAM: Available Routes:

GET    -> /number/    -> number.ts -> fetchAll
GET    -> /number/:id -> number.ts -> fetchSingle
POST   -> /number/    -> number.ts -> create
PATCH  -> /number/:id -> number.ts -> update
DELETE -> /number/:id -> number.ts -> delete
GET    -> /text/      -> text.ts   -> fetchAll
GET    -> /text/:id   -> text.ts   -> fetchSingle
POST   -> /text/      -> text.ts   -> create
PATCH  -> /text/:id   -> text.ts   -> update
DELETE -> /text/:id   -> text.ts   -> delete
```

Now let's build out our app further!

In the code editor of your choice open `actions/number.ts` and delete the methods provided to leave an empty class:

```
import { Action, Context } from '@flmnt/bantam';

class Number implements Action {
}

export default Number;
```

Next add a custom method:

```
...

class Number implements Action {
  getCalculate(ctx: Context): void {
    ctx.body = 2 + 2;
  }
}

...
```

Save your file and the server should automatically reload.

In a new terminal window run this command:

```
curl --request GET 'http://localhost:3000/number/calculate/'
```

And you should see the number "4" before!

Now let's edit the other action. Open `actions/text.ts` and once again delete the methods provided to leave an empty class.

Then add a custom method to give you a class like this:

```
import { Action, Context } from '@flmnt/bantam';

class Text implements Action {
  getWelcomeMessage(ctx: Context): void {
    ctx.body = 'Hello Friend!';
  }
}

export default Text;
```

Save your file and in your terminal window run this command:

```
curl --request GET 'http://localhost:3000/text/welcome-message/'
```

You should see the text "Hello Friend!"

And we're finished! You've created your first microservice using Typescript and Bantam.
