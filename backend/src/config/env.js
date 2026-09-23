import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
// Read this BEFORE dotenv runs. A PORT already set by your shell, Docker or PM2
// wins over backend/.env, and that surprise is worth naming in the error message.
const portFromShell = process.env.PORT !== undefined;
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

export function readEnv() {
  const { MONGO_URI, JWT_SECRET } = process.env;
  if (!MONGO_URI?.startsWith('mongodb')) throw new Error('Set MONGO_URI in backend/.env. Run npm run setup first.');
  if (!JWT_SECRET || JWT_SECRET.length < 32 || JWT_SECRET === 'GENERATE_WITH_NPM_RUN_SETUP') {
    throw new Error('JWT_SECRET must be a random secret of at least 32 characters. Run npm run setup.');
  }
  const port = Number(process.env.PORT || 5000);
  const sessionDays = Number(process.env.SESSION_DAYS || 7);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1-65535.');
  if (!Number.isInteger(sessionDays) || sessionDays < 1 || sessionDays > 30) throw new Error('SESSION_DAYS must be 1-30.');
  const origins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173').split(',').map(v => v.trim());
  for (const origin of origins) {
    const parsed = new URL(origin);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== origin) throw new Error('CLIENT_ORIGINS must contain exact http(s) origins, without trailing slashes.');
  }
  const production = process.env.NODE_ENV === 'production';
  if (production && origins.some(v => !v.startsWith('https://'))) throw new Error('Production CLIENT_ORIGINS must use HTTPS.');
  return {
    port,
    portFromShell,
    mongoUri: MONGO_URI,
    jwtSecret: JWT_SECRET,
    sessionDays,
    origins,
    isProduction: production,
    cookieName: process.env.COOKIE_NAME || 'mern_base_session',
    trustProxy: process.env.TRUST_PROXY === '1',
    serveClient: process.env.SERVE_CLIENT === 'true',
  };
}
