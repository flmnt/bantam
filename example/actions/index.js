class Index {
  fetchAll(ctx) {
    ctx.body = 'My Example';
  }

  getCustomMethod(ctx) {
    ctx.body = 'Custom getter!';
  }

  fetchSingle(id, ctx) {
    ctx.body = 'Bantam: Index -> fetchSingle()';
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

  setCustomMethod(data, ctx) {
    ctx.body = 'Custom setter!';
  }
}

module.exports = Index;
