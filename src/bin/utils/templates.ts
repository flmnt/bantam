export const jsIndexTemplate = (
  options: string = '',
): string => `const Bantam = require('@flmnt/bantam');

const app = new Bantam(${options});

if (process.env.NODE_ENV === 'production') {
  app.run().then(
    () => {},
    (error) => console.error(error),
  );
} else {
  app.run().then(
    (app) => app.logRoutes(),
    (error) => console.error(error),
  );
}
`;

export const tsIndexTemplate = (
  options: string = '',
): string => `import Bantam from '@flmnt/bantam';

const app = new Bantam(${options});

if (process.env.NODE_ENV === 'production') {
  app.run().then(
    () => {},
    (error) => console.error(error),
  );
} else {
  app.run().then(
    (app) => app.logRoutes(),
    (error) => console.error(error),
  );
}
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
    ctx.body = 'Bantam: ${className} -> fetchAll()';
  }

  fetchSingle(id, ctx) {
    ctx.body = 'Bantam: ${className} -> fetchSingle()';
  }

  create(data, ctx) {
    ctx.body = 'Bantam: ${className} -> create()';
  }

  update(id, data, ctx) {
    ctx.body = 'Bantam: ${className} -> update()';
  }

  delete(id, ctx) {
    ctx.body = 'Bantam: ${className} -> delete()';
  }
}

module.exports = ${className};
`;

export const tsActionTemplate = (
  className: string,
): string => `import { Action, Context } from '@flmnt/bantam';

class ${className} implements Action {
  fetchAll(ctx: Context): void {
    ctx.body = 'Bantam: ${className} -> fetchAll()';
  }

  fetchSingle(id: string, ctx: Context): void {
    ctx.body = 'Bantam: ${className} -> fetchSingle()';
  }

  create(data: any, ctx: Context): void {
    ctx.body = 'Bantam: ${className} -> create()';
  }

  update(id: string, data: any, ctx: Context): void {
    ctx.body = 'Bantam: ${className} -> update()';
  }

  delete(id: string, ctx: Context): void {
    ctx.body = 'Bantam: ${className} -> delete()';
  }
}

export default ${className};
`;
