import fs from 'fs';
import sinon from 'sinon';

import Bantam from '../../src/lib/Bantam';

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

test('Can read action file content', async () => {
  const file = 'Test File Content';
  const app = new Bantam();
  const readFileStub = sinon.stub(fs, 'readFile');
  readFileStub.yields(null, file);
  const contents = await app.readActionFile('index.ts');
  expect(contents).toBe(file);
  expect(readFileStub.calledOnceWith('actions/index.ts'));
});

test('Logs and throws error if action file cannot be read', async () => {
  expect.assertions(2);
  const mockLoggerError = jest.fn();
  const fakeLogger = { error: mockLoggerError };
  // @ts-expect-error
  const app = new Bantam(undefined, { logger: fakeLogger });
  const readFileStub = sinon.stub(fs, 'readFile');
  readFileStub.yields(new Error());
  try {
    await app.readActionFile('index.ts');
  } catch (error) {
    expect(error.message).toBe('Not able to read file!');
  }
  expect(mockLoggerError).toHaveBeenCalledWith(
    'Unable to read `index.ts`! Check permissions.',
  );
});
