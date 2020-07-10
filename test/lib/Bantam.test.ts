import Bantam from '../../src/lib/Bantam';

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
