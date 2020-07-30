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
import { CliOptions } from './bantam-init';

//
// ACTION
//
// Create a new action route
//

const action = async (actionFile: string): Promise<void> => {
  clear();

  let config: CliOptions;

  try {
    // eslint-disable-next-line
    const options = require(path.resolve(process.cwd(), './.bantamrc.js'));
    config = options;
  } catch (error) {
    writeError(
      errorMsg(
        'Cannot find .bantamrc.js file. Trying running `npx @flmnt/bantam init`',
      ),
    );
    process.exit(1);
  }

  const isTs = config.language === 'typescript';
  const actionsFolder = config.actionsFolder;

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
};

export const runAction = (actionFile: string): void => {
  action(actionFile).then(
    () => {
      writeMsg(
        successMsg(`Your new action \`${actionFile}\` is ready!`),
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
