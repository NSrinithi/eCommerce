export class AppError extends Error {
  constructor(status, message, code = 'REQUEST_ERROR', fields) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}
