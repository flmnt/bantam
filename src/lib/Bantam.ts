import fs from 'fs';
import path from 'path';

import Logger from './services/Logger';

interface UserOptions {
  port?: number;
  devPort?: number;
  actionsFolder?: string;
  actionsIndexFile?: string;
  actionsFileExt?: string;
}

interface Config {
  port: number;
  devPort: number;
  actionsFolder: string;
  actionsIndexFile: string;
  actionsFileExt: string;
}

interface Dependencies {
  logger: Logger;
}

interface Method {
  name: string;
  verb: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  url: string;
}

interface Action {
  name: string;
  methods: Method[];
}

class Bantam {
  readonly defaultConfig: Config = {
    port: 3000,
    devPort: 3000,
    actionsFolder: 'actions',
    actionsIndexFile: 'index',
    actionsFileExt: '.ts',
  };

  readonly logger: Logger;

  private config: Config;

  // private actions: Action[];

  constructor(userOptions?: UserOptions, deps?: Dependencies) {
    const config = Object.assign(this.defaultConfig, userOptions);
    this.setConfig(config);
    this.logger = typeof deps === 'undefined' ? new Logger() : deps.logger;
  }

  getConfig(): Config {
    return this.config;
  }

  setConfig(config: Config): void {
    this.config = config;
  }

  async readActionsFolder(): Promise<string[]> {
    const { actionsFolder } = this.getConfig();
    return new Promise((resolve) => {
      fs.readdir(actionsFolder, (error, files) => {
        if (error instanceof Error) {
          this.logger.error(
            'Unable to read actions folder! Check `actionsFolder` config setting.',
          );
          return resolve([]);
        }
        resolve(files);
      });
    });
  }

  async readActionFile(fileName: string): Promise<string> {
    const { actionsFolder } = this.getConfig();
    const filePath = path.join(actionsFolder, fileName);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (error, file) => {
        if (error instanceof Error) {
          this.logger.error(
            `Unable to read \`${fileName}\`! Check permissions.`,
          );
          return reject(new Error('Not able to read file!'));
        }
        resolve(file);
      });
    });
  }

  async parseRoutes(): Promise<void> {}
}

export default Bantam;