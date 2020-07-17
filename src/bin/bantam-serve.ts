#!/usr/bin/env node

import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs';
import path from 'path';

import {
  bantamMsg,
  errorMsg,
  infoMsg,
  writeMsg,
  writeError,
  NEW_LINE,
} from './utils/messages';
import { CliOptions } from './bantam-init';

export const runServe = (devMode: boolean): void => {
  let config: CliOptions;

  try {
    // eslint-disable-next-line
    const options = require(path.resolve(process.cwd(), './.bantamrc.js'));
    config = options;
  } catch (error) {
    writeMsg(
      errorMsg(
        'Cannot find .bantamrc.js file. Trying running `@flmnt/bantam init`',
      ),
      NEW_LINE.AFTER,
    );
    process.exit(1);
  }

  if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = devMode ? 'development' : 'production';
  }

  let engine: string = '';

  if (config.language === 'javascript') {
    engine = devMode
      ? path.resolve(process.cwd(), './node_modules/.bin/node-dev')
      : 'node';
  }

  if (config.language === 'typescript') {
    engine = devMode
      ? path.resolve(process.cwd(), './node_modules/.bin/ts-node-dev')
      : path.resolve(process.cwd(), './node_modules/.bin/ts-node');
  }

  if (engine === '') {
    writeMsg(errorMsg('Cannot load an appropriate engine!'), NEW_LINE.AFTER);
    process.exit(1);
  }

  if (engine !== 'node' && !fs.existsSync(engine)) {
    const engineName = path.basename(engine);
    writeMsg(
      errorMsg(
        `Engine \`${engineName}\` is not available. Try installing it with \`npm i ${engineName}${
          devMode ? ' -D' : ''
        }\``,
      ),
      NEW_LINE.AFTER,
    );
    process.exit(1);
  }

  const env = process.env;
  env.FORCE_COLOR = '1';

  try {
    let serve: ChildProcessWithoutNullStreams;

    if (engine === 'node') {
      serve = spawn('node', [config.entrypoint], { env });
    } else {
      serve = spawn('node', [engine, config.entrypoint], { env });
    }

    serve.stdout.on('data', (data: string): void => {
      const message = data.includes('Restarting')
        ? `${bantamMsg('BANTAM:')} ${infoMsg('Restarting...')}\n`
        : data;
      writeMsg(message);
    });

    serve.stderr.on('data', (data: string): void => {
      writeError(`${bantamMsg('BANTAM:')} ${errorMsg(data)}`);
    });
  } catch (error) {
    writeMsg(errorMsg('Cannot serve your application!'), NEW_LINE.AFTER);
  }
};

const isCli = require.main === module;
if (isCli) {
  const devMode = process.argv[2];
  runServe(devMode === '--dev' || devMode === '-d');
}
