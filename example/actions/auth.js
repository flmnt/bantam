class Auth {
  fetchAll(ctx) {
    ctx.body = 'Bantam: Auth -> fetchAll()';
  }

  fetchSingle(id, ctx) {
    ctx.body = 'Bantam: Auth -> fetchSingle()';
  }

  create(data, ctx) {
    ctx.body = 'Bantam: Auth -> create()';
  }

  update(id, data, ctx) {
    ctx.body = 'Bantam: Auth -> update()';
  }

  delete(id, ctx) {
    ctx.body = 'Bantam: Auth -> delete()';
  }
}

module.exports = Auth;
