import fs from 'fs';
import path from 'path';

import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaBodyParser from 'koa-bodyparser';

import Logger from './services/Logger';
import { Action } from '../types/Bantam';

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

type HttpVerb = 'get' | 'post' | 'patch' | 'delete';

interface Method {
  method: string;
  verb: HttpVerb;
  url: string;
}

export interface Route {
  fileName: string;
  pathName: string;
  action?: Action;
}

interface MethodsMap {
  get: string[];
  post: string[];
  patch: string[];
  delete: string[];
}

const GET_METHOD_RE = /^(get\w*|fetchAll|fetchSingle)$/;

const POST_METHOD_RE = /^(set\w*|create)$/;

const PATCH_METHOD_RE = /^update$/;

const DELETE_METHOD_RE = /^delete$/;

// const METHOD_VERB: { [fnName: string]: HttpVerb } = {
//   fetchAll: 'get',
//   fetchSingle: 'get',
//   create: 'post',
//   update: 'patch',
//   delete: 'delete',
// };

// const url = (strings: TemplateStringsArray, prefix: string): string =>
//   prefix === ''
//     ? `${prefix}${strings[1]}`
//     : `${strings[0]}${prefix}${strings[1]}`;

// const individualResourceUrl = (
//   strings: TemplateStringsArray,
//   prefix: string,
// ): string => url`/${prefix}/:id`;
// const collectiveResourceUrl = (
//   strings: TemplateStringsArray,
//   prefix: string,
// ): string => url`/${prefix}/`;

// const METHOD_URL = {
//   fetchAll: collectiveResourceUrl,
//   fetchSingle: individualResourceUrl,
//   create: collectiveResourceUrl,
//   update: individualResourceUrl,
//   delete: individualResourceUrl,
// };

class Bantam {
  readonly defaultConfig: Config = {
    port: 3000,
    devPort: 3000,
    actionsFolder: 'actions',
    actionsIndexFile: 'index',
    actionsFileExt: '.ts',
  };

  readonly logger: Logger;

  private app: Koa;

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

  getRoutes(): Route[] {
    if (this.routes.length === 0) {
      this.logger.error(
        'You have no routes. Check for files in the actions folder and then restart the app.',
      );
    }
    return this.routes;
  }

  // @TODO: needs tests
  async fetchRoutes(): Promise<Route[]> {
    const actionFiles = await this.readActionsFolder();
    const routes: Route[] = [];
    for (const fileName of actionFiles) {
      const pathName = encodeURI(fileName.replace(/\.[j|t]s/, ''));
      const route: Route = {
        fileName: fileName,
        pathName: pathName,
      };
      routes.push(route);
    }
    this.routes = routes;
    return routes;
  }

  // @TODO: needs tests
  loadActions(): void {
    const { actionsFolder } = this.getConfig();

    const routes = this.getRoutes();

    const routesWithActions = routes.map(
      (route): Route => {
        try {
          // eslint-disable-next-line
          const action = require(path.join(
            process.cwd(),
            actionsFolder,
            route.fileName,
          ));
          route.action = action;
        } catch (error) {
          this.logger.error(
            `Unable to load \`${route.fileName}\` action file.`,
          );
        }
        return route;
      },
    );

    this.routes = routesWithActions;
  }

  // @TODO: needs tests
  introspectActionMethods(action: Action): MethodsMap {
    const keys = Reflect.ownKeys(action.prototype);
    const methodsMap: MethodsMap = {
      get: [],
      post: [],
      patch: [],
      delete: [],
    };
    for (const key of keys) {
      const propertyName = String(key);
      const isGetMethod = GET_METHOD_RE.test(propertyName);
      const isPostMethod = POST_METHOD_RE.test(propertyName);
      const isPatchMethod = PATCH_METHOD_RE.test(propertyName);
      const isDeleteMethod = DELETE_METHOD_RE.test(propertyName);
      if (isGetMethod) methodsMap.get.push(propertyName);
      if (isPostMethod) methodsMap.post.push(propertyName);
      if (isPatchMethod) methodsMap.patch.push(propertyName);
      if (isDeleteMethod) methodsMap.delete.push(propertyName);
    }
    return methodsMap;
  }

  // @TODO: needs tests
  bindRoutes(router: KoaRouter): void {
    const routes = this.getRoutes();

    for (const { pathName, action } of routes) {
      if (typeof action === 'undefined') {
        this.logger.error(`No actions loaded for \`${pathName}\` route.`);
        continue;
      }

      // const methods = this.introspectActionMethods(action);
      // for (const { method } of methods) {
      //   try {
      //     console.log(method);
      //   } catch (error) {
      //     this.logger.error(`Unable to bind method \`${method}\` from \`${pathName}\` action to route.`);
      //   }
      // }
    }
  }

  getApp(): Koa {
    if (typeof this.app === 'undefined') {
      this.logger.error('Koa application has not been initialised.');
    }
    return this.app;
  }

  async init(): Promise<Bantam> {
    const app = new Koa();
    const router = new KoaRouter();

    await this.fetchRoutes();

    this.loadActions();

    this.bindRoutes(router);

    app.use(koaBodyParser()).use(router.routes()).use(router.allowedMethods());

    this.app = app;

    return this;
  }

  extend(callback: (app: Koa) => Koa): Bantam {
    const app = this.getApp();
    this.app = callback(app);
    return this;
  }

  run(): Bantam {
    const app = this.getApp();

    try {
      app.listen({ port: 3000 });
    } catch (error) {
      this.logger.error('Unable to start Bantam application!');
    }

    return this;
  }
}

export default Bantam;
