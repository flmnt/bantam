import chalk from 'chalk';

export const infoMsg = chalk.bold.blue;
export const successMsg = chalk.bold.green;
export const errorMsg = chalk.bold.red;
export const bantamMsg = chalk.bold.yellow;

export enum NEW_LINE {
  BEFORE,
  AFTER,
  BOTH,
}

export const writeMsg = (message: string, spacing?: NEW_LINE): void => {
  let prefix: string = '';
  let suffix: string = '';
  if (spacing === NEW_LINE.BEFORE || spacing === NEW_LINE.BOTH) {
    prefix = '\n';
  }
  if (spacing === NEW_LINE.AFTER || spacing === NEW_LINE.BOTH) {
    suffix = '\n';
  }
  process.stdout.write(`${prefix}${message}${suffix}`);
};

export const writeError = (message: string): void => {
  process.stderr.write(`\n${message}\n`);
};

export const BANTAM: string = bantamMsg('BANTAM');

export const welcomeMsg = (): string => `
${BANTAM}

The microframework for microservices.

Let's build your app...

`;

export const languageCheckMsg = (): string =>
  'Are you using Typescript or Javascript?';

export const nameIndexFileMsg = (): string =>
  'What is the name of your main script?';

export const nameActionsFolderMsg = (): string =>
  'What is the name of your actions folder?';

export const createActionsFileMsg = (secondRun: boolean = false): string =>
  `Do you want to create ${secondRun ? 'another' : 'an'} action file?`;

export const nameActionsFileMsg = (): string =>
  'What is the name of your actions file?';

export const confirmStructureMsg = (
  structure: string,
): string => `Your application will look like this:

${structure}

Happy to proceed?`;
