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
  fetchAll(request) => {};

  fetchSingle(id, request) => {};

  create(data, request) => {};

  update(id, data, request) => {};

  delete(id, request) => {};
}

export default ${className};
`;

export const tsActionTemplate = (
  className: string,
): string => `import { Request } from 'koa';

class ${className} {
  fetchAll(request: Request): void => {};

  fetchSingle(id: string, request: Request): void => {};

  create(data: any, request: Request): void => {};

  update(id: string, data: any, request: Request): void => {};

  delete(id: string, request: Request): void => {};
}

export default ${className};
`;
