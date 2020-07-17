const Datastore = require('nedb');

const db = new Datastore();

//
// Some mock data stored in memory...
//
db.insert({
  uid: '0',
  firstName: 'Bart',
  lastName: 'Simpson',
  email: 'eat@myshorts.org',
});
db.insert({
  uid: '1',
  firstName: 'Lisa',
  lastName: 'Simpson',
  email: 'lisa.simpson@harvard.edu',
});

const promisify = (callback) => new Promise((resolve) => callback(resolve));

class Index {
  // TRY THIS: curl --request GET 'http://localhost:3000'
  async fetchAll(ctx) {
    const users = await promisify((resolve) =>
      db.find({}, (err, users) => resolve(users)),
    );
    ctx.body = users;
  }

  // TRY THIS: curl --request GET 'http://localhost:3000/1'
  async fetchSingle(uid, ctx) {
    const user = await promisify((resolve) =>
      db.findOne({ uid }, (err, user) => resolve(user)),
    );
    ctx.body = user;
  }

  /*
    TRY THIS:
    curl --request POST 'http://localhost:3000' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'firstName=Homer' \
    --data-urlencode 'lastName=Simpson' \
    --data-urlencode 'email=homer@donut.me'
  */
  create(data, ctx) {
    db.count({}, (err, count) => {
      data.uid = `${count++}`;
      db.insert(data);
    });
    ctx.status = 201;
    ctx.body = 'Created!';
  }

  /*
    TRY THIS:
    curl --request PATCH 'http://localhost:3000/0' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'lastName=Flanders'
  */
  update(uid, data, ctx) {
    db.update({ uid }, data, { upsert: true });
    ctx.body = 'Updated!';
  }

  // TRY THIS: curl --request DELETE 'http://localhost:3000/1'
  delete(uid, ctx) {
    db.remove({ uid });
    ctx.status = 200;
    ctx.body = 'Deleted!';
  }
}

module.exports = Index;
