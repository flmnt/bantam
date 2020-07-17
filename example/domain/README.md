# Domain based microservice example

The following example microservice has been created using [Bantam](https://github.com/flmnt/bantam).

Follow the quickstart steps below to checkout this repo and explore this exact example or skip this step and creating this example yourself from scratch.

## Quickstart

Open a terminal and run the following:

```
git clone git@github.com:flmnt/bantam.git
cd bantam/example/domain
npm install
npx @flmnt/bantam serve -d
```

To test the example app out, in a new terminal, run:

```
curl --request GET 'http://localhost:3000'
```

## Tutorial

Let's build the example in this folder from scratch together.

We're going to build a [domain segregated microservice](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/microservice-domain-model). Once we're done we'll have an example "user" service.

Start by creating a new folder, initialising your app and install Bantam with few other dependencies.

```
% mkdir user-service
% cd user-service
% npm init -y
% npm i @flmnt/bantam node-dev nedb
```

Next we'll use the Bantam CLI to make our application.

```
% npx @flmnt/bantam init
```

Follow the steps, accepting the defaults, to create just one action file (index.js) and you should have a structure like this:

```
| index.js
| actions
|   index.js
```

Now let's run the application!

```
% npx @flmnt/bantam serve --dev
```

You should see something like this:

```
BANTAM: Application loaded! Serving at http://localhost:3000/
BANTAM: Available Routes:

GET    -> /    -> index.js -> fetchAll
GET    -> /:id -> index.js -> fetchSingle
POST   -> /    -> index.js -> create
PATCH  -> /:id -> index.js -> update
DELETE -> /:id -> index.js -> delete
```

Now let's build out our app further.

In the code editor of your choice open `actions/index.js` and setup an in memory database at the top of the file like this:

```
const Datastore = require('nedb');

const db = new Datastore();
db.insert({ uid: '0', firstName: 'Bart', lastName: 'Simpson', email: 'eat@myshorts.org' });
db.insert({ uid: '1', firstName: 'Lisa', lastName: 'Simpson', email: 'lisa.simpson@harvard.edu' });

class Index {
  ...
}
```

Next add a little helper method to create some quick promises:

```
...

const promisify = (callback) => new Promise((resolve) => callback(resolve));

class Index {
  ...
}
```

Now change the `fetchAll` method to look like this:

```
async fetchAll(ctx) {
  const users = await promisify((resolve) =>
    db.find({}, (err, users) => resolve(users))
  );
  ctx.body = users;
}
```

Save your file and the server should automatically reload.

In a new terminal window run this command:

```
% curl --request GET 'http://localhost:3000'
```

And you should see the records you created before!

Now let's created the rest of the methods...

```
async fetchSingle(uid, ctx) {
  const user = await promisify((resolve) =>
    db.findOne({ uid }, (err, user) => resolve(user))
  );
  ctx.body = user;
}

create(data, ctx) {
  db.count({}, (err, count) => {
    data.uid = `${count++}`;
    db.insert(data);
  });
  ctx.status = 201;
  ctx.body = 'Created!';
}

update(uid, data, ctx) {
  db.update({ uid }, data, { upsert: true });
  ctx.body = 'Updated!';
}

delete(uid, ctx) {
  db.remove({ uid });
  ctx.status = 200;
  ctx.body = 'Deleted!';
}
```

You'll notice that `create()`, `update()`, and `delete()` are not asynchronous, this is intentional – you can choose to use synchronous or asynchronous methods.

We can test each method in order with the following CURL commands:

```
// fetchSingle
% curl --request GET 'http://localhost:3000/1

// create
% curl --request POST 'http://localhost:3000' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'firstName=Homer' \
  --data-urlencode 'lastName=Simpson' \
  --data-urlencode 'email=homer@donut.me'

// update
% curl --request PATCH 'http://localhost:3000/0' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'lastName=Flanders'

// delete
% curl --request DELETE 'http://localhost:3000/1'
```

And we're done! You've created your first microservice for Bantam.
