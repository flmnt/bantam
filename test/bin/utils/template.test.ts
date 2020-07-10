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
  fetchAll(request) => {};

  fetchSingle(id, request) => {};

  create(data, request) => {};

  update(id, data, request) => {};

  delete(id, request) => {};
}

export default ${className};
`);
});

test('TS action template returns correct template', () => {
  const className = 'Test';
  const template = tsActionTemplate(className);
  expect(template).toBe(`import { Request } from 'koa';

class ${className} {
  fetchAll(request: Request): void => {};

  fetchSingle(id: string, request: Request): void => {};

  create(data: any, request: Request): void => {};

  update(id: string, data: any, request: Request): void => {};

  delete(id: string, request: Request): void => {};
}

export default ${className};
`);
});

test('Caculate req options returns null if not required ', () => {
  const options = calculateRequiredOptions('actions', 'actions', true);
  expect(options).toBeNull();
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
