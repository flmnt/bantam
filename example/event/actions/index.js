const Datastore = require('nedb');

const db = new Datastore();

const promisify = (callback) => new Promise((resolve) => callback(resolve));

class Index {
  /*
    TRY THIS:
    curl --request POST 'http://localhost:3000/add-product-to-cart/' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'product=Ducati Panigale' \
    --data-urlencode 'cost=25000'
  */
  setAddProductToCart(data, ctx) {
    db.insert(data);
    ctx.status = 201;
    ctx.body = 'Product added to cart!';
  }

  // TRY THIS: curl --request GET 'http://localhost:3000/cart-contents/'
  async getCartContents(ctx) {
    const products = await promisify((resolve) =>
      db.find({}, (err, products) => resolve(products)),
    );
    ctx.body = products;
  }

  // TRY THIS: curl --request GET 'http://localhost:3000/cart-total/'
  async getCartTotal(ctx) {
    const products = await promisify((resolve) =>
      db.find({}, (err, products) => resolve(products)),
    );
    const total = products
      .map(({ cost }) => parseInt(cost))
      .reduce((prev, current) => prev + current, 0);
    ctx.body = total;
  }
}

module.exports.default = Index;
