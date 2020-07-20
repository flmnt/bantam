import { Action, Context } from '@flmnt/bantam';

class Number implements Action {
  // TRY THIS: curl --request GET 'http://localhost:3000/number/calculate/'
  getCalculate(ctx: Context): void {
    ctx.body = 2 + 2;
  }
}

export default Number;
