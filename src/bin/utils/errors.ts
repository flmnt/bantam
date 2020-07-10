export class FileExistsError extends Error {
  constructor() {
    super('File exists!');
    Object.setPrototypeOf(this, FileExistsError.prototype);
  }
}

export class CancelError extends Error {
  constructor(...args) {
    super(...args);
    Object.setPrototypeOf(this, CancelError.prototype);
  }
}
