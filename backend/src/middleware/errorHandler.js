export function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'API route not found.' },
    requestId: req.id
  });
}
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  let status = error.status || 500;
  let message = error.message;
  let code = error.code || 'SERVER_ERROR';
  if (error.code === 11000) {
    status = 409;
    code = 'DUPLICATE';
    message = 'This email is already registered.';
  }
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    status = 400;
    code = 'VALIDATION_ERROR';
    message = 'Check the submitted fields.';
  }
  if (error.type === 'entity.parse.failed') {
    status = 400;
    code = 'INVALID_JSON';
    message = 'Request body is not valid JSON.';
  }
  if (error.type === 'entity.too.large') {
    status = 413;
    code = 'PAYLOAD_TOO_LARGE';
    message = 'Request is too large.';
  }
  if (status >= 500) {
    // Log a safe diagnostic, not the DB URI/query/body. Correlate with X-Request-Id.
    console.error(`[${req.id}] ${error.name || 'Error'} at ${req.method} ${req.path}`);
    message = 'Something went wrong on the server.';
    code = 'SERVER_ERROR';
  }
  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      ...(error.fields ? { fields: error.fields } : {})
    },
    requestId: req.id
  });
}
