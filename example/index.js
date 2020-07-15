const Bantam = require('@flmnt/bantam');

const app = new Bantam({
  actionsFileExt: 'js',
});

app.run().then((app) => {
  app.logRoutes();
});
