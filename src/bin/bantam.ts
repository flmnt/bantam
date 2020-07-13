#!/usr/bin/env node

import yargs from 'yargs';

import { runInit } from './bantam-init';
import { runAction } from './bantam-action';

interface ActionArgs {
  file: string;
}

interface ServeArgs {
  dev: boolean;
}

// eslint-disable-next-line
const cli = yargs
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
  // .command(
  //   'serve',
  //   'Serve your application',
  //   (yargs) => {},
  //   ({ dev }: ServeArgs) => runServe(dev),
  // )
  .option('dev', {
    alias: 'd',
    type: 'boolean',
    description: 'Run in dev mode, with livereloading',
  })
  .demandCommand(1, 'Please provide a command')
  .help().argv;
