class Index {
  fetchAll(ctx) {
    ctx.body = 'Bantam: Index -> fetchAll()';
  }

  getSayHelloMatt(ctx) {
    ctx.body = 'Say hello to Matt';
  }

  fetchSingle(id, ctx) {
    ctx.body = `Say hello to ${id}`;
  }

  create(data, ctx) {
    ctx.body = 'Bantam: Index -> create()';
  }

  update(id, data, ctx) {
    ctx.body = 'Bantam: Index -> update()';
  }

  delete(id, ctx) {
    ctx.body = 'Bantam: Index -> delete()';
  }
}

module.exports = Index;
