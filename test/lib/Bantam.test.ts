import fs from 'fs';
import sinon from 'sinon';
import { Context } from 'koa';

import Bantam from '../../src/lib/Bantam';
import { Action } from '../../src/types/Bantam';

afterEach(() => {
  sinon.restore();
});

test('Can instantiate with default options', (): void => {
  const app = new Bantam();
  expect(app.getConfig()).toStrictEqual({
    port: 3000,
    devPort: 3000,
    actionsFolder: 'actions',
    actionsIndexFile: 'index',
    actionsFileExt: '.ts',
  });
});

test('Can instantiate with some user options', (): void => {
  const app = new Bantam({
    actionsFolder: 'test',
    actionsFileExt: '.js',
  });
  expect(app.getConfig()).toStrictEqual({
    port: 3000,
    devPort: 3000,
    actionsFolder: 'test',
    actionsIndexFile: 'index',
    actionsFileExt: '.js',
  });
});

test('Can instantiate with all user options', (): void => {
  const app = new Bantam({
    port: 80,
    devPort: 3001,
    actionsFolder: 'example',
    actionsIndexFile: 'other',
    actionsFileExt: '.jsx',
  });
  expect(app.getConfig()).toStrictEqual({
    port: 80,
    devPort: 3001,
    actionsFolder: 'example',
    actionsIndexFile: 'other',
    actionsFileExt: '.jsx',
  });
});

test('Can read file names in actions folder', async () => {
  const files = ['index.ts', 'other.ts', 'test.ts'];
  const app = new Bantam();
  const readdirStub = sinon.stub(fs, 'readdir');
  readdirStub.yields(null, files);
  const actions = await app.readActionsFolder();
  expect(actions).toBe(files);
});

test('Logs error if actions folder cannot be read', async () => {
  const mockLoggerError = jest.fn();
  const fakeLogger = { error: mockLoggerError };
  // @ts-expect-error
  const app = new Bantam(undefined, { logger: fakeLogger });
  const readdirStub = sinon.stub(fs, 'readdir');
  readdirStub.yields(new Error());
  const actions = await app.readActionsFolder();
  expect(actions).toStrictEqual([]);
  expect(mockLoggerError).toHaveBeenCalledWith(
    'Unable to read actions folder! Check `actionsFolder` config setting.',
  );
});

test('Can get routes', () => {
  const app = new Bantam();
  const mockRoutes = [
    {
      name: 'index',
      methods: [{ name: 'fetchAll', verb: 'GET', url: '/' }],
    },
  ];
  // @ts-expect-error
  app.routes = mockRoutes;
  expect(app.getRoutes()).toStrictEqual(mockRoutes);
});

test('Logs error if no routes have been set', () => {
  const mockLoggerError = jest.fn();
  const fakeLogger = { error: mockLoggerError };
  // @ts-expect-error
  const app = new Bantam(undefined, { logger: fakeLogger });
  app.getRoutes();
  expect(mockLoggerError).toHaveBeenCalledWith(
    'You have no routes. Check for files in the actions folder and then restart the app.',
  );
});

class MockAction implements Action {
  fetchAll(ctx: Context): void {}
  fetchSingle(id: string, ctx: Context): void {}
  create(data: any, ctx: Context): void {}
  update(id: string, data: any, ctx: Context): void {}
  delete(id: string): void {}
  getCustom(ctx: Context): void {}
  setCustom(data: any, ctx: Context): void {}
  private _privateMethod(): void {}
}

test('Find action methods through introspection', () => {
  const app = new Bantam();
  const Action = MockAction;
  const methods = app.introspectActionMethods(Action);
  expect(methods).toStrictEqual({
    get: ['fetchAll', 'fetchSingle', 'getCustom'],
    post: ['create', 'setCustom'],
    patch: ['update'],
    delete: ['delete'],
  });
});

// @TODO: test route setting methods

// test('Can set routes', async () => {
//   const app = new Bantam();
//   const readFolderStub = sinon.stub(app, 'readActionsFolder');
//   readFolderStub.returns(['index.ts', 'other.ts']);
//   const readFileStub = sinon.stub(app, 'readActionFile');
//   await app.fetchRoutes();
//   expect(app.getRoutes()).toStrictEqual([
//     {
//       name: 'index',
//       methods: [
//         { name: 'fetchAll', verb: 'GET', url: '/' },
//         { name: 'fetchSingle', verb: 'GET', url: '/:id' },
//         { name: 'create', verb: 'POST', url: '/' },
//         { name: 'update', verb: 'PATCH', url: '/:id' },
//         { name: 'delete', verb: 'DELETE', url: '/:id' },
//       ],
//     },
//     {
//       name: 'other',
//       methods: [
//         { name: 'fetchAll', verb: 'GET', url: '/other/' },
//         { name: 'fetchSingle', verb: 'GET', url: '/other/:id' },
//       ],
//     },
//   ]);
// });

test('User can extend koa app with a callback', () => {
  const app = new Bantam();
  // @ts-expect-error
  app.app = 'koa';
  app.extend((koa) => {
    koa = 'foo';
    return koa;
  });
  // @ts-expect-error
  expect(app.app).toBe('foo');
});

test('Starts koa app when run is called', () => {
  const listenStub = jest.fn();
  const fakeApp = { listen: listenStub };
  const app = new Bantam();
  // @ts-expect-error
  app.app = fakeApp;
  app.run();
  expect(listenStub).toHaveBeenCalled();
});

test('Logs error if app is not ready when run is called', () => {
  const mockLoggerError = jest.fn();
  const fakeLogger = { error: mockLoggerError };
  // @ts-expect-error
  const app = new Bantam(undefined, { logger: fakeLogger });
  app.run();
  expect(mockLoggerError).toHaveBeenCalledWith(
    'Koa application has not been initialised.',
  );
});

test('Logs error on run if koa app startup throws', () => {
  const mockLoggerError = jest.fn();
  const fakeLogger = { error: mockLoggerError };
  const listenStub = sinon.stub();
  listenStub.throws('I am ERROR');
  const fakeApp = { listen: listenStub };
  // @ts-expect-error
  const app = new Bantam(undefined, { logger: fakeLogger });
  // @ts-expect-error
  app.app = fakeApp;
  app.run();
  expect(mockLoggerError).toHaveBeenCalledWith(
    'Unable to start Bantam application!',
  );
});
