# Event based microservice example

The following example microservice has been created using [Bantam](https://github.com/flmnt/bantam).

Follow the quickstart steps below to checkout this repo and explore this exact example or skip this step and creating this example yourself from scratch.

## Quickstart

Open a terminal and run the following:

```
git clone git@github.com:flmnt/bantam.git
cd bantam/example/event
npm install
npx @flmnt/bantam serve -d
```

To test the example app out, in a new terminal, run:

```
curl --request POST 'http://localhost:3000/add-product-to-cart/' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'product=Ducati Panigale' \
  --data-urlencode 'cost=25000'
```

## Tutorial

Let's build the example in this folder from scratch together.

We're going to build an [event based microservice](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/multi-container-microservice-net-applications/integration-event-based-microservice-communications). Once we're done we'll have an example ecommerce cart service.

Start by creating a new folder, initialising your app and install Bantam with few other dependencies.

```
% mkdir cart-service
% cd cart-service
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

class Index {
  ...
}
```

Next add a little helper method to create quick promises:

```
...

const promisify = (callback) => new Promise((resolve) => callback(resolve));

class Index {
  ...
}
```

Now replace all the standard methods with following new code:

```
  setAddProductToCart(data, ctx) {
    db.insert(data);
    ctx.status = 201;
    ctx.body = 'Product added to cart!';
  }

  async getCartContents(ctx) {
    const products = await promisify((resolve) =>
      db.find({}, (err, products) => resolve(products)),
    );
    ctx.body = products;
  }

  async getCartTotal(ctx) {
    const products = await promisify((resolve) =>
      db.find({}, (err, products) => resolve(products)),
    );
    const total = products
      .map(({ cost }) => parseInt(cost))
      .reduce((prev, current) => prev + current, 0);
    ctx.body = total;
  }
```

The first method adds products to the database, the second method retieves the contents of the cart, and the final method calculates the total.

Save your file and the server should automatically reload. Well done you've created a microservice with Bantam, let's test it out!

In a new terminal window run this command to create a product:

```
curl --request POST 'http://localhost:3000/add-product-to-cart/' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'product=Ducati Panigale' \
  --data-urlencode 'cost=25000'
```

Create another product:

```
curl --request POST 'http://localhost:3000/add-product-to-cart/' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'product=Honda C90' \
  --data-urlencode 'cost=1500'
```

Then fetch all of your products from the system.

```
curl --request GET 'http://localhost:3000/cart-contents/'
```

And finally calculate the total cost of all products in the cart.

```
curl --request GET 'http://localhost:3000/cart-total/'
```

That's the end of this guide, thanks for using Bantam!
