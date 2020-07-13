#!/usr/bin/env node

import clear from 'clear';
import path from 'path';

import { FileExistsError } from './utils/errors';
import { createFile, makeClassName } from './utils/filesystem';
import {
  infoMsg,
  successMsg,
  errorMsg,
  NEW_LINE,
  writeMsg,
  writeError,
} from './utils/messages';
import { tsActionTemplate, jsActionTemplate } from './utils/templates';
import { BantamCliOptions } from '../types/Bantam';

//
// ACTION
//
// Create a new action route
//

const action = async (actionFile: string): Promise<string> => {
  clear();

  // eslint-disable-next-line
  const bantamOptions = require(path.resolve(process.cwd(), './.bantamrc.js'));
  const options: BantamCliOptions = bantamOptions;

  const isTs = options.language === 'typescript';
  const actionsFolder = options.actionsFolder;

  try {
    writeMsg(
      infoMsg(
        `Creating ${String(actionsFolder)}/${String(actionFile)} file...`,
      ),
    );
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

  return actionFile;
};

export const runAction = (actionFile: string): void => {
  action(actionFile).then(
    (newAction: string) => {
      writeMsg(
        successMsg(`Your new action \`${newAction}\` is ready!`),
        NEW_LINE.BOTH,
      );
    },
    (error) => {
      writeError(errorMsg(error));
    },
  );
};

const isCli = require.main === module;
if (isCli) {
  const actionFile = process.argv[2];
  runAction(actionFile);
}
