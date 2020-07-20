import { Context } from 'koa';
import { BantamAction } from '@flmnt/bantam';

class Text implements BantamAction {
  // TRY THIS: curl --request GET 'http://localhost:3000/text/welcome-message/'
  getWelcomeMessage(ctx: Context): void {
    ctx.body = 'Hello Friend!';
  }
}

export default Text;
