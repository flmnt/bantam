import Bantam from '@flmnt/bantam';

const app = new Bantam();

if (process.env.NODE_ENV === 'production') {
  app.run().then(
    () => {},
    (error) => console.log(error),
  );
} else {
  app.run().then(
    (app) => {
      app.logRoutes();
    },
    (error) => {
      console.log(error);
    },
  );
}
