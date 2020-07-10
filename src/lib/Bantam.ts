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

interface Route {
  name: string;
  methods: Method[];
}

const METHOD_RE = /(fetchAll)|(fetchSingle)|(create)|(update)|(delete)/g;

const METHOD_VERB = {
  fetchAll: 'GET',
  fetchSingle: 'GET',
  create: 'POST',
  update: 'PATCH',
  delete: 'DELETE',
};

const url = (strings: TemplateStringsArray, prefix: string | null): string =>
  prefix ? `${strings[0]}${prefix}${strings[1]}` : `${prefix}${strings[1]}`;

const individualResourceUrl = (
  strings: TemplateStringsArray,
  prefix: string,
): string => url`/${prefix}/:id`;
const collectiveResourceUrl = (
  strings: TemplateStringsArray,
  prefix: string,
): string => url`/${prefix}/`;

const METHOD_URL = {
  fetchAll: collectiveResourceUrl,
  fetchSingle: individualResourceUrl,
  create: collectiveResourceUrl,
  update: individualResourceUrl,
  delete: individualResourceUrl,
};

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

  private routes: Route[] = [];

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

  getRoutes(): Route[] {
    if (this.routes.length === 0) {
      this.logger.error(
        'You have no routes. Check for files in the actions folder and then restart the app.',
      );
    }
    return this.routes;
  }

  async fetchRoutes(): Promise<void> {
    const { actionsIndexFile } = this.getConfig();
    const actionFiles = await this.readActionsFolder();
    const routes = [];
    for (const fileName of actionFiles) {
      try {
        const route = {
          name: encodeURI(fileName.replace(/\.[j|t]s/, '')),
          methods: [],
        };
        const file = await this.readActionFile(fileName);
        const methods = file.match(METHOD_RE);
        for (const method of methods) {
          const prefix = actionsIndexFile !== route.name ? route.name : null;
          route.methods.push({
            name: method,
            verb: METHOD_VERB[method],
            url: METHOD_URL[method]`${prefix}`,
          });
        }
        routes.push(route);
      } catch (error) {
        // suppress error
      }
    }
    this.routes = routes;
  }
}

export default Bantam;
