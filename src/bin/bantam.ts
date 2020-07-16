#!/usr/bin/env node

import yargs from 'yargs';

import { runInit } from './bantam-init';
import { runAction } from './bantam-action';
import { runServe } from './bantam-serve';

interface ActionArgs {
  file: string;
}

interface ServeArgs {
  dev: boolean;
}

// eslint-disable-next-line
yargs
  .command(
    'init',
    'Configure a Bantam application',
    (yargs) => {},
    (argv) => runInit(),
  )
  .command(
    'action [file]',
    'Create a new action route',
    (yargs) => {
      yargs.positional('file', {
        describe: 'action file name',
      });
    },
    ({ file }: ActionArgs) => runAction(file),
  )
  .command(
    'serve',
    'Serve your application',
    (yargs) => {
      yargs.option('dev', {
        alias: 'd',
        type: 'boolean',
        description: 'Run in dev mode, with livereloading',
      });
    },
    ({ dev }: ServeArgs) => runServe(dev),
  )
  .demandCommand(1, 'What would you like to do?')
  .help().argv;
