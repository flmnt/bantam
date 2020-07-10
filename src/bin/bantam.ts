#!/usr/bin/env node

import yargs from 'yargs';

import { runInit } from './bantam-init';

const runServe = (isDev: boolean): void =>
  console.log(`serve${isDev ? ' dev' : ''}`);

interface Args {
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
    'serve',
    'Serve your application',
    (yargs) => {},
    ({ dev }: Args) => runServe(dev),
  )
  .option('dev', {
    alias: 'd',
    type: 'boolean',
    description: 'Run in dev mode, with livereloading',
  })
  .demandCommand(1, 'Please provide a command')
  .help().argv;
