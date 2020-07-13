import fs from 'fs';
import sinon from 'sinon';

import {
  makeClassName,
  createFile,
  createFolder,
  createBantamRCFile,
} from '../../../src/bin/utils/filesystem';

afterEach(() => {
  sinon.restore();
});

test('make class name returns correct format', () => {
  const className = makeClassName('this-example.ts');
  expect(className).toBe('ThisExample');
});

test('Create file method writes to disk', async () => {
  const writeFileStub = sinon.stub(fs, 'writeFile');
  writeFileStub.callsArg(3);
  const path = 'index.ts';
  const template = 'template here';
  await createFile(path, template);
  expect(
    writeFileStub.calledOnceWith(`${process.cwd()}/${path}`, template),
  ).toBeTruthy();
});

test('Create file method throws if file exists', async () => {
  expect.assertions(1);
  const fakeError = new Error('File exists');
  const writeFileStub = sinon.stub(fs, 'writeFile');
  writeFileStub.yields(fakeError);
  const path = 'index.ts';
  return createFile(path, 'template').catch((error) => {
    expect(error).toBe(fakeError);
  });
});

test('Create folder method writes to disk', async () => {
  const mkdirStub = sinon.stub(fs, 'mkdir');
  mkdirStub.callsArg(1);
  const path = 'actions';
  await createFolder(path);
  expect(mkdirStub.calledOnceWith(`${process.cwd()}/${path}`)).toBeTruthy();
});

test('Create folder method throws if folder exists', async () => {
  expect.assertions(1);
  const fakeError = new Error('folder exists');
  const mkdirStub = sinon.stub(fs, 'mkdir');
  mkdirStub.yields(fakeError);
  const path = 'actions';
  return createFolder(path).catch((error) => {
    expect(error).toBe(fakeError);
  });
});

test('Create config method writes options to file', async () => {
  const writeFileStub = sinon.stub(fs, 'writeFile');
  writeFileStub.callsArg(3);
  await createBantamRCFile({
    actionsFolder: 'example',
    language: 'javascript',
  });
  expect(
    writeFileStub.calledOnceWith(
      `${process.cwd()}/.bantamrc.js`,
      `module.exports = {
  actionsFolder: 'example',
  language: 'javascript',
};`,
    ),
  ).toBeTruthy();
});
