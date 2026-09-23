// Creates one demo account so you can sign in immediately after installing.
// Development only. Delete this file once you have your own accounts.
// Run from the project root: npm run seed
import bcrypt from 'bcryptjs';
import { readEnv } from '../src/config/env.js';
import { connectDB, closeDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Example } from '../src/models/Example.js';

const email = (process.env.SEED_EMAIL || 'student@example.com').toLowerCase();
const password = process.env.SEED_PASSWORD || 'MernBase@2026';
const name = process.env.SEED_NAME || 'Demo Student';

const config = readEnv();
if (config.production) {
  console.error('Refusing to seed: NODE_ENV is production. Demo accounts must never exist in production.');
  process.exit(1);
}

await connectDB(config.mongoUri);
try {
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Demo account already exists: ${email}`);
    console.log('Nothing changed. Delete the user in MongoDB first if you want a fresh one.');
  } else {
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
    await Example.create([
      { title: 'My first record', description: 'Edit or delete me from the Sample API page.', owner: user._id },
      { title: 'Second record', description: 'These rows come from MongoDB, not from the code.', owner: user._id },
    ]);
    console.log('Demo account created.');
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log('Change this password, or delete the account, before you share the project.');
  }
} finally {
  await closeDB();
}
