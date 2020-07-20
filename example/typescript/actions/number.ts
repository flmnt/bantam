import { Context } from 'koa';
import { BantamAction } from '@flmnt/bantam';

class Number implements BantamAction {
  // TRY THIS: curl --request GET 'http://localhost:3000/number/calculate/'
  getCalculate(ctx: Context): void {
    ctx.body = 2 + 2;
  }
}

export default Number;
