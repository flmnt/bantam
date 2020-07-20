import { Context } from 'koa';
import { BantamAction } from '@flmnt/bantam';

class Number implements BantamAction {
  getCalculate(ctx: Context): void {
    ctx.body = 2 + 2;
  }
}

export default Number;
