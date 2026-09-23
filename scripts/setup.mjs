// Run from the project root: npm run setup. Existing .env files are never overwritten.
import { chmodSync, copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
for (const folder of ['backend', 'frontend']) {
  const target = path.join(root, folder, '.env');
  if (existsSync(target)) {
    console.log(`${folder}/.env already exists; kept unchanged.`);
    continue;
  }
  copyFileSync(path.join(root, folder, '.env.example'), target);
  if (folder === 'backend') {
    const value = readFileSync(target, 'utf8').replace('GENERATE_WITH_NPM_RUN_SETUP', randomBytes(48).toString('hex'));
    writeFileSync(target, value);
    // copyFileSync already created the file, so writeFileSync's mode option is ignored.
    // chmod explicitly: this file holds JWT_SECRET and must not be world-readable.
    chmodSync(target, 0o600);
  }
  console.log(`Created ${folder}/.env`);
}
console.log('Next: set backend/.env MONGO_URI, then npm install and npm run dev.');
