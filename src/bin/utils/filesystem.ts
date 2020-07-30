import fs from 'fs';
import path from 'path';

import { FileExistsError } from './errors';
import { CliOptions } from '../bantam-init';

export const createFile = async (
  filePath: string,
  data: string,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const writeIfNotExists = 'wx';
    fs.writeFile(
      path.resolve(process.cwd(), filePath),
      data,
      { flag: writeIfNotExists },
      (error) => {
        if (error instanceof Error) {
          reject(error.code === 'EEXIST' ? new FileExistsError() : error);
        }
        resolve();
      },
    );
  });

export const createFolder = async (folderPath: string): Promise<void> =>
  new Promise((resolve, reject) => {
    fs.mkdir(path.resolve(process.cwd(), folderPath), (error) => {
      if (error instanceof Error) {
        reject(error.code === 'EEXIST' ? new FileExistsError() : error);
      }
      resolve();
    });
  });

export const makeClassName = (s: string): string =>
  s
    .replace(/\.[t|j]s/g, '') // remove ext
    .replace(
      /(\w)(\w*)/g,
      (g0: string, g1: string, g2: string) =>
        `${g1.toUpperCase()}${g2.toLowerCase()}`,
    ) // capitalise
    .replace(/\W/g, ''); // remove symbols and spaces

export const createBantamRCFile = async (options: CliOptions): Promise<void> =>
  createFile(
    './.bantamrc.js',
    `module.exports = {
  actionsFolder: '${options.actionsFolder}',
  language: '${options.language}',
  entrypoint: '${options.entrypoint}',
};
`,
  );
