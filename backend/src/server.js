import { readEnv } from './config/env.js';
import { connectDB, closeDB } from './config/db.js';
import { createApp } from './app.js';
let server;
try {
  const config = readEnv();
  await connectDB(config.mongoUri);
  const app = createApp(config);
  server = app.listen(config.port, () => console.log(`API ready at http://localhost:${config.port}/api`));
  server.on('error', async error => {
    console.error(error.code === 'EADDRINUSE'
      ? `Port ${config.port} is already in use${config.portFromShell ? ` (PORT=${config.port} came from your shell/Docker/PM2 environment, which wins over backend/.env)` : ''}. Stop the other server, or change PORT and DEV_API_TARGET.`
      : 'Server failed to start.');
    await closeDB();
    process.exit(1);
  });
} catch (error) {
  // Do not print MongoDB URIs, credentials or raw connection errors.
  console.error(error.name?.includes('Mongo') || error.name?.includes('Mongoose')
    ? 'MongoDB connection failed. Check MONGO_URI, database-user credentials, Atlas IP access and DNS. See docs/TROUBLESHOOTING.md.'
    : error.message);
  await closeDB();
  process.exit(1);
}
async function shutdown() {
  const forceExit = setTimeout(() => process.exit(1), 10000);
  forceExit.unref();
  server.close(async () => {
    await closeDB();
    process.exit(0);
  });
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
