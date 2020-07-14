const Bantam = require('@flmnt/bantam');

console.log(Bantam);

const app = new Bantam({
  actionsFileExt: 'js',
});

app.run();
