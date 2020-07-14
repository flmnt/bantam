import fs from 'fs';
import path from 'path';

import Koa, { Context } from 'koa';
import KoaRouter from 'koa-router';
import koaBodyParser from 'koa-bodyparser';

import Logger from './services/Logger';
import { Action as BantamAction } from '../types/Bantam';

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

interface Route {
  method: string;
  verb: HttpVerb;
  url: string;
}

export interface Action {
  fileName: string;
  pathName: string;
  actionClass?: BantamAction;
  routes?: Route[];
}

interface MethodsDict {
  get: string[];
  post: string[];
  patch: string[];
  delete: string[];
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

  private app: Koa;

  private config: Config;

  private actions: Action[] = [];

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

  getActions(): Action[] {
    if (this.actions.length === 0) {
      this.logger.error(
        'You have no loaded actions. Check for files in the actions folder.',
      );
    }
    return this.actions;
  }

  // @TODO: needs tests
  async discoverActions(): Promise<Action[]> {
    const actionFiles = await this.readActionsFolder();
    const actions: Action[] = [];
    for (const fileName of actionFiles) {
      const pathName = encodeURI(fileName.replace(/\.[j|t]s/, ''));
      const action: Action = {
        fileName: fileName,
        pathName: pathName,
      };
      actions.push(action);
    }
    this.actions = actions;
    return actions;
  }

  // @TODO: needs tests
  loadActions(): void {
    const { actionsFolder } = this.getConfig();

    const actions = this.getActions();

    const loadedActions = actions.map(
      (action): Action => {
        try {
          // eslint-disable-next-line
          const actionClass = require(path.join(
            process.cwd(),
            actionsFolder,
            action.fileName,
          ));
          action.actionClass = actionClass;
        } catch (error) {
          this.logger.error(
            `Unable to load \`${action.fileName}\` action file.`,
          );
        }
        return action;
      },
    );

    this.actions = loadedActions;
  }

  introspectMethods(action: BantamAction): MethodsDict {
    const keys = Reflect.ownKeys(action.prototype);
    const methodsDict: MethodsDict = {
      get: [],
      post: [],
      patch: [],
      delete: [],
    };
    const GET_METHOD_RE = /^(get\w*|fetchAll|fetchSingle)$/;
    const POST_METHOD_RE = /^(set\w*|create)$/;
    const PATCH_METHOD_RE = /^update$/;
    const DELETE_METHOD_RE = /^delete$/;
    for (const key of keys) {
      const propertyName = String(key);
      const isGetMethod = GET_METHOD_RE.test(propertyName);
      const isPostMethod = POST_METHOD_RE.test(propertyName);
      const isPatchMethod = PATCH_METHOD_RE.test(propertyName);
      const isDeleteMethod = DELETE_METHOD_RE.test(propertyName);
      if (isGetMethod) methodsDict.get.push(propertyName);
      if (isPostMethod) methodsDict.post.push(propertyName);
      if (isPatchMethod) methodsDict.patch.push(propertyName);
      if (isDeleteMethod) methodsDict.delete.push(propertyName);
    }
    return methodsDict;
  }

  makeUrl(pathName: string, method: string): string {
    const { actionsIndexFile } = this.getConfig();
    let url = actionsIndexFile === pathName ? '/' : `/${pathName}`;
    const INDI_RES_RE = /^(fetchSingle|update|delete)$/;
    const isIndividualResource = INDI_RES_RE.test(method);
    if (isIndividualResource) {
      url = `${url}/:id`;
    }
    return url;
  }

  // @TODO: needs tests
  makeRoutes(pathName: string, action: BantamAction): Route[] {
    const methodsDict = this.introspectMethods(action);
    const mapToRoute = (verb: HttpVerb) => (method: string): Route => ({
      method,
      verb,
      url: this.makeUrl(pathName, method),
    });
    const getRoutes = methodsDict.get.map(mapToRoute('get'));
    const postRoutes = methodsDict.post.map(mapToRoute('post'));
    const patchRoutes = methodsDict.patch.map(mapToRoute('patch'));
    const deleteRoutes = methodsDict.delete.map(mapToRoute('delete'));
    return [].concat(getRoutes, postRoutes, patchRoutes, deleteRoutes);
  }

  // @TODO: needs tests
  bindRoutes(router: KoaRouter): void {
    const actions = this.getActions();

    for (const action of actions) {
      const { pathName, actionClass } = action;
      const routes = this.makeRoutes(pathName, actionClass);
      action.routes = routes;

      if (routes.length === 0) {
        this.logger.error(`No routes found for \`${pathName}\` action.`);
        continue;
      }

      for (const { method, verb, url } of routes) {
        try {
          router[verb](url, (ctx: Context) => {
            const CTX_ONLY_RE = /^(get\w*|fetchAll)$/;
            const CTX_ID_RE = /^(fetchSingle|delete)$/;
            const CTX_BODY_RE = /^(set\w*|create)$/;
            const CTX_ID_BODY_RE = /^update$/;

            const isContextOnly = CTX_ONLY_RE.test(method);
            const isContextId = CTX_ID_RE.test(method);
            const isContextBody = CTX_BODY_RE.test(method);
            const isContextIdBody = CTX_ID_BODY_RE.test(method);

            const id = ctx.params.id;
            const body = ctx.request.body;

            const args = [];
            if (isContextOnly) args.push(ctx);
            if (isContextId) args.push(id, ctx);
            if (isContextBody) args.push(body, ctx);
            if (isContextIdBody) args.push(id, body, ctx);

            actionClass[method](...args);
          });
        } catch (error) {
          this.logger.error(
            `Unable to bind method \`${method}\` from \`${pathName}\` action to route.`,
          );
        }
      }
    }

    this.actions = actions;
  }

  async init(): Promise<Bantam> {
    const app = new Koa();
    const router = new KoaRouter();

    await this.discoverActions();

    this.loadActions();

    this.bindRoutes(router);

    app.use(koaBodyParser()).use(router.routes()).use(router.allowedMethods());

    this.app = app;

    return this;
  }

  getApp(): Koa {
    if (typeof this.app === 'undefined') {
      this.logger.error('Koa application has not been initialised.');
    }
    return this.app;
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
