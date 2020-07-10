import { Request } from 'koa';

class Other {
  fetchAll(request: Request): void {}

  fetchSingle(id: string, request: Request): void {}

  create(data: any, request: Request): void {}

  update(id: string, data: any, request: Request): void {}

  delete(id: string, request: Request): void {}
}

export default Other;
