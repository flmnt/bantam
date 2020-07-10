import {
  BANTAM,
  welcomeMsg,
  languageCheckMsg,
  nameIndexFileMsg,
  nameActionsFolderMsg,
  createActionsFileMsg,
  nameActionsFileMsg,
  confirmStructureMsg,
} from '../../../src/bin/utils/messages';

test('Welcome returns correct message', () => {
  const message = welcomeMsg();
  expect(message).toBe(`
${BANTAM}

The microframework for microservices.

Let's build your app...

`);
});

test('Language check returns correct message', () => {
  const message = languageCheckMsg();
  expect(message).toBe('Are you using Typescript or Javascript?');
});

test('Name index file returns correct message', () => {
  const message = nameIndexFileMsg();
  expect(message).toBe('What is the name of your main script?');
});

test('Name actions folder returns correct message', () => {
  const message = nameActionsFolderMsg();
  expect(message).toBe('What is the name of your actions folder?');
});

test('Create actions file returns correct message', () => {
  const message = createActionsFileMsg();
  expect(message).toBe('Do you want to create an action file?');
});

test('Create actions file second time returns correct message', () => {
  const message = createActionsFileMsg(true);
  expect(message).toBe('Do you want to create another action file?');
});

test('Name actions file returns correct message', () => {
  const message = nameActionsFileMsg();
  expect(message).toBe('What is the name of your actions file?');
});

test('Name actions file returns correct message', () => {
  const message = nameActionsFileMsg();
  expect(message).toBe('What is the name of your actions file?');
});

test('Confirm structure returns correct message', () => {
  const structure = 'test';
  const message = confirmStructureMsg(structure);
  expect(message).toBe(`Your application will look like this:

${structure}

Happy to proceed?`);
});
