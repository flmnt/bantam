export const indexTemplate = (
  options: string = '',
): string => `import Bantam from '@_filament/bantam';

const app = new Bantam(${options});

app.run();
`;

export const calculateRequiredOptions = (
  actionsFolder: string,
  actionsFolderDefault: string,
  isTs: boolean,
): string => {
  let options = `{
  actionsFolder: '${String(actionsFolder)}',
  actionsFileExt: '${isTs ? 'ts' : 'js'}',
}`;

  if (actionsFolder === actionsFolderDefault) {
    options = options.replace(
      new RegExp(`  actionsFolder: '${String(actionsFolder)}',\n`),
      '',
    );
  }

  if (isTs) {
    options = options.replace(new RegExp(`  actionsFileExt: 'ts',\n`), '');
  }

  const isRequired = options.length > 3;

  return isRequired ? options : '';
};

export const jsActionTemplate = (
  className: string,
): string => `class ${className} {
  fetchAll(ctx) {
    // ctx.body = 'YOUR RESPONSE';
  }

  fetchSingle(id, ctx) {
    // ctx.body = 'YOUR RESPONSE';
  }

  create(data, ctx) {
    // ctx.body = 'YOUR RESPONSE';
  }

  update(id, data, ctx) {
    // ctx.body = 'YOUR RESPONSE';
  }

  delete(id, ctx) {
    // ctx.body = 'YOUR RESPONSE';
  }
}

export default ${className};
`;

export const tsActionTemplate = (
  className: string,
): string => `import { Context } from 'koa';
import { Action } from '@_filament/bantam';

class ${className} implements Action {
  fetchAll(ctx: Context): void {
    // ctx.body = 'YOUR RESPONSE';
  }

  fetchSingle(id: string, ctx: Context): void {
    // ctx.body = 'YOUR RESPONSE';
  }

  create(data: any, ctx: Context): void {
    // ctx.body = 'YOUR RESPONSE';
  }

  update(id: string, data: any, ctx: Context): void {
    // ctx.body = 'YOUR RESPONSE';
  }

  delete(id: string, ctx: Context): void {
    // ctx.body = 'YOUR RESPONSE';
  }
}

export default ${className};
`;
