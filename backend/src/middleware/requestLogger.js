import { randomUUID } from 'node:crypto';
export function requestLogger(req, res, next) {
  req.id = randomUUID();
  res.setHeader('X-Request-Id', req.id);
  const started = Date.now();
  res.on('finish', () => {
    // Never log request bodies, passwords, cookies or Authorization headers.
    console.log(`${req.id} ${req.method} ${req.path} ${res.statusCode} ${Date.now() - started}ms`);
  });
  next();
}
