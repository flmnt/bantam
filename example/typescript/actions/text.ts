import { Context } from 'koa';
import { BantamAction } from '@flmnt/bantam';

class Text implements BantamAction {
  getWelcomeMessage(ctx: Context): void {
    ctx.body = 'Hello Friend!';
  }
}

export default Text;
