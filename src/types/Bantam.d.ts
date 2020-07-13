import { Context } from 'koa';

export type SupportedLanguage = 'typescript' | 'javascript';

export interface CliOptions {
  actionsFolder: string;
  language: SupportedLanguage;
}

export interface Action {
  fetchAll?: (ctx: Context) => void;
  fetchSingle?: (id: string, ctx: Context) => void;
  create?: (data: any, ctx: Context) => void;
  update?: (id: string, data: any, ctx: Context) => void;
  delete?: (id: string, ctx: Context) => void;
  [method: string]: any;
}
