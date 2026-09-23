import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { Example } from '../models/Example.js';

export async function connectDB(uri) {
  mongoose.set('bufferCommands', false);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  // Create schema indexes before serving requests (including unique email and session expiry).
  await Promise.all([User.init(), Session.init(), Example.init()]);
  console.log('MongoDB connected');
}
export function closeDB() {
  return mongoose.disconnect();
}
export function databaseReady() {
  return mongoose.connection.readyState === 1;
}
