import {
  jsIndexTemplate,
  tsIndexTemplate,
  jsActionTemplate,
  tsActionTemplate,
  calculateRequiredOptions,
} from '../../../src/bin/utils/templates';

test('JS index template returns correct template', () => {
  const options = '{ port: 3001 }';
  const template = jsIndexTemplate(options);
  expect(template).toBe(`const Bantam = require('@flmnt/bantam');

const app = new Bantam(${options});

if (process.env.NODE_ENV === 'production') {
  app.run().then(
    () => {},
    (error) => console.error(error),
  );
} else {
  app.run().then(
    (app) => app.logRoutes(),
    (error) => console.error(error),
  );
}
`);
});

test('TS index template returns correct template', () => {
  const options = '{ port: 3001 }';
  const template = tsIndexTemplate(options);
  expect(template).toBe(`import Bantam from '@flmnt/bantam';

const app = new Bantam(${options});

if (process.env.NODE_ENV === 'production') {
  app.run().then(
    () => {},
    (error) => console.error(error),
  );
} else {
  app.run().then(
    (app) => app.logRoutes(),
    (error) => console.error(error),
  );
}
`);
});

test('JS action template returns correct template', () => {
  const className = 'Test';
  const template = jsActionTemplate(className);
  expect(template).toBe(`class ${className} {
  fetchAll(ctx) {
    ctx.body = 'Bantam: Test -> fetchAll()';
  }

  fetchSingle(id, ctx) {
    ctx.body = 'Bantam: Test -> fetchSingle()';
  }

  create(data, ctx) {
    ctx.body = 'Bantam: Test -> create()';
  }

  update(id, data, ctx) {
    ctx.body = 'Bantam: Test -> update()';
  }

  delete(id, ctx) {
    ctx.body = 'Bantam: Test -> delete()';
  }
}

module.exports = ${className};
`);
});

test('TS action template returns correct template', () => {
  const className = 'Test';
  const template = tsActionTemplate(className);
  expect(template).toBe(`import { Action, Context } from '@flmnt/bantam';

class ${className} implements Action {
  fetchAll(ctx: Context): void {
    ctx.body = 'Bantam: Test -> fetchAll()';
  }

  fetchSingle(id: string, ctx: Context): void {
    ctx.body = 'Bantam: Test -> fetchSingle()';
  }

  create(data: any, ctx: Context): void {
    ctx.body = 'Bantam: Test -> create()';
  }

  update(id: string, data: any, ctx: Context): void {
    ctx.body = 'Bantam: Test -> update()';
  }

  delete(id: string, ctx: Context): void {
    ctx.body = 'Bantam: Test -> delete()';
  }
}

export default ${className};
`);
});

test('Caculate req options returns empty string if not required ', () => {
  const options = calculateRequiredOptions('actions', 'actions', true);
  expect(options).toBe('');
});

test('Caculate req options returns actions folder opt if needed ', () => {
  const options = calculateRequiredOptions('example', 'actions', true);
  expect(options).toBe(`{
  actionsFolder: 'example',
}`);
});

test('Caculate req options returns file ext opt if needed ', () => {
  const options = calculateRequiredOptions('actions', 'actions', false);
  expect(options).toBe(`{
  actionsFileExt: 'js',
}`);
});

test('Caculate req options returns file ext and actions folder if needed ', () => {
  const options = calculateRequiredOptions('example', 'actions', false);
  expect(options).toBe(`{
  actionsFolder: 'example',
  actionsFileExt: 'js',
}`);
});
