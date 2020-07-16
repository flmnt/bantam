const Bantam = require('@flmnt/bantam');

const app = new Bantam({
  actionsFileExt: 'js',
});

if (process.env.NODE_ENV === 'production') {
  app.run();
} else {
  app.run().then((app) => {
    app.logRoutes();
  });
}
