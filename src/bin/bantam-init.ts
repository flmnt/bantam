#!/usr/bin/env node

import clear from 'clear';
import inquirer from 'inquirer';
import path from 'path';

import { FileExistsError, CancelError } from './utils/errors';
import {
  createFile,
  createFolder,
  makeClassName,
  createBantamRCFile,
} from './utils/filesystem';
import {
  infoMsg,
  successMsg,
  errorMsg,
  NEW_LINE,
  writeMsg,
  writeError,
  welcomeMsg,
  languageCheckMsg,
  nameIndexFileMsg,
  nameActionsFolderMsg,
  createActionsFileMsg,
  nameActionsFileMsg,
  confirmStructureMsg,
} from './utils/messages';
import {
  indexTemplate,
  calculateRequiredOptions,
  tsActionTemplate,
  jsActionTemplate,
} from './utils/templates';

type SupportedLanguage = 'typescript' | 'javascript';

export interface CliOptions {
  actionsFolder: string;
  language: SupportedLanguage;
}

//
// INIT
//
// Configure a Bantam application via CLI
//

const init = async (): Promise<void> => {
  clear();

  writeMsg(welcomeMsg());

  const choices: SupportedLanguage[] = ['typescript', 'javascript'];
  const { language }: { language: SupportedLanguage } = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: languageCheckMsg(),
      choices,
      default: choices[0],
    },
  ]);

  const isTs = language === 'typescript';
  const indexFileDefault = `index.${isTs ? 'ts' : 'js'}`;
  const actionsFolderDefault = 'actions';

  const answers: {
    indexFile: string;
    actionsFolder: string;
    createActionsFile: boolean;
  } = await inquirer.prompt([
    {
      type: 'input',
      name: 'indexFile',
      message: nameIndexFileMsg(),
      default: indexFileDefault,
    },
    {
      type: 'input',
      name: 'actionsFolder',
      message: nameActionsFolderMsg(),
      default: actionsFolderDefault,
    },
    {
      type: 'confirm',
      name: 'createActionsFile',
      message: createActionsFileMsg(),
      default: true,
    },
  ]);

  let doCreateActionFiles = answers.createActionsFile;

  const actionFiles: string[] = [];

  while (doCreateActionFiles) {
    const {
      actionsFile,
      createActionsFile,
    }: {
      actionsFile: string;
      createActionsFile: boolean;
    } = await inquirer.prompt([
      {
        type: 'input',
        name: 'actionsFile',
        message: nameActionsFileMsg(),
        default:
          actionFiles.length === 0 ? `index.${isTs ? 'ts' : 'js'}` : undefined,
      },
      {
        type: 'confirm',
        name: 'createActionsFile',
        message: createActionsFileMsg(true),
        default: true,
      },
    ]);

    if (!actionFiles.includes(actionsFile) && actionsFile.length > 0) {
      actionFiles.push(actionsFile);
    }
    doCreateActionFiles = createActionsFile;
  }

  const actionFilesFlat: string = actionFiles
    .map((fileName) => `|  |  ${fileName}`)
    .join('\n');

  const structure: string = `
| ${answers.indexFile}
| ${answers.actionsFolder}
${actionFilesFlat}`;

  const { confirm }: { confirm: boolean } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: confirmStructureMsg(infoMsg(structure.trim())),
      default: true,
    },
  ]);

  if (!confirm) {
    return Promise.reject(new CancelError('Cancelled!'));
  }

  const { indexFile, actionsFolder } = answers;

  writeMsg(infoMsg('Building your app! 🚀'), NEW_LINE.BOTH);

  const options = calculateRequiredOptions(
    actionsFolder,
    actionsFolderDefault,
    isTs,
  );

  try {
    writeMsg(infoMsg(`Creating ${indexFile} file...`));
    await createFile(indexFile, indexTemplate(options));
    writeMsg(successMsg(' done!'), NEW_LINE.AFTER);
  } catch (error) {
    if (error instanceof FileExistsError) {
      writeMsg(errorMsg(' file exists, skipping'), NEW_LINE.AFTER);
    } else {
      throw error;
    }
  }

  try {
    writeMsg(infoMsg(`Creating ${actionsFolder} folder...`));
    await createFolder(actionsFolder);
    writeMsg(successMsg(' done!'), NEW_LINE.AFTER);
  } catch (error) {
    if (error instanceof FileExistsError) {
      writeMsg(errorMsg(' folder exists, skipping'), NEW_LINE.AFTER);
    } else {
      throw error;
    }
  }

  for (const actionFile of actionFiles) {
    try {
      writeMsg(infoMsg(`Creating ${actionsFolder}/${actionFile} file...`));
      const actionTemplate = isTs ? tsActionTemplate : jsActionTemplate;
      await createFile(
        path.join(actionsFolder, actionFile),
        actionTemplate(makeClassName(actionFile)),
      );
      writeMsg(successMsg(' done!'), NEW_LINE.AFTER);
    } catch (error) {
      if (error instanceof FileExistsError) {
        writeMsg(errorMsg(' file exists, skipping'), NEW_LINE.AFTER);
      } else {
        throw error;
      }
    }
  }

  try {
    writeMsg(infoMsg(`Creating .bantamrc.js file...`));
    await createBantamRCFile({ actionsFolder, language });
    writeMsg(successMsg(' done!'), NEW_LINE.AFTER);
  } catch (error) {
    if (error instanceof FileExistsError) {
      writeMsg(errorMsg(' file exists, skipping'), NEW_LINE.AFTER);
    } else {
      throw error;
    }
  }
};

export const runInit = (): void => {
  init().then(
    () => {
      writeMsg(successMsg('Your application is ready!'), NEW_LINE.BOTH);
      writeMsg(
        `Run ${infoMsg('npx bantam serve --dev')} to begin...\n`,
        NEW_LINE.BOTH,
      );
    },
    (error) => {
      switch (error.constructor) {
        case CancelError:
          writeError(errorMsg('Setup cancelled...'));
          break;
        default:
          writeError(errorMsg(error));
          break;
      }
    },
  );
};

const isCli = require.main === module;
if (isCli) runInit();
