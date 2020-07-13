import {
  indexTemplate,
  jsActionTemplate,
  tsActionTemplate,
  calculateRequiredOptions,
} from '../../../src/bin/utils/templates';

test('Index template returns correct template', () => {
  const options = '{ port: 3001 }';
  const template = indexTemplate(options);
  expect(template).toBe(`import Bantam from '@_filament/bantam';

const app = new Bantam(${options});

app.run();
`);
});

test('JS action template returns correct template', () => {
  const className = 'Test';
  const template = jsActionTemplate(className);
  expect(template).toBe(`class ${className} {
  fetchAll(ctx) {
    // ctx.body = 'YOUR RESPONSE';
  }

  fetchSingle(id, ctx) {
    // ctx.body = 'YOUR RESPONSE';
  }

  create(data, ctx) {
    // ctx.body = 'YOUR RESPONSE';
  }

  update(id, data, ctx) {
    // ctx.body = 'YOUR RESPONSE';
  }

  delete(id, ctx) {
    // ctx.body = 'YOUR RESPONSE';
  }
}

export default ${className};
`);
});

test('TS action template returns correct template', () => {
  const className = 'Test';
  const template = tsActionTemplate(className);
  expect(template).toBe(`import { Context } from 'koa';
import { Action } from '@_filament/bantam';

class ${className} implements Action {
  fetchAll(ctx: Context): void {
    // ctx.body = 'YOUR RESPONSE';
  }

  fetchSingle(id: string, ctx: Context): void {
    // ctx.body = 'YOUR RESPONSE';
  }

  create(data: any, ctx: Context): void {
    // ctx.body = 'YOUR RESPONSE';
  }

  update(id: string, data: any, ctx: Context): void {
    // ctx.body = 'YOUR RESPONSE';
  }

  delete(id: string, ctx: Context): void {
    // ctx.body = 'YOUR RESPONSE';
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
