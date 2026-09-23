import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { AppError } from '../utils/AppError.js';
import { signSession, verifySession } from '../utils/sessionToken.js';
// Compare against a dummy hash as well when an email is absent. This is NOT a login credential.
const dummyHash = await bcrypt.hash('not-a-user-password', 12);
export function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role:user.role,
    createdAt: user.createdAt
  };
}
export async function register(input) {
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash
  });
  return publicUser(user);
}
export async function login(input) {
  const user = await User.findOne({ email: input.email }).select('+passwordHash');
  const valid = await bcrypt.compare(input.password, user?.passwordHash || dummyHash);
  if (!user || !valid) throw new AppError(401, 'Email or password is incorrect.', 'INVALID_CREDENTIALS');
  return publicUser(user);
}
export async function revoke(token, config) {
  const claims = verifySession(token, config);
  if (claims) await Session.deleteOne({ _id: claims.sid, user: claims.sub });
}
export async function issue(userId, previousToken, config) {
  await revoke(previousToken, config);
  const session = await Session.create({ user: userId, expiresAt: new Date(Date.now() + config.sessionDays * 86400000) });
  return signSession(userId, session.id, config);
}
export async function updateProfile(userId, input) {
  const user = await User.findByIdAndUpdate(userId, { $set: { name: input.name } }, { new: true, runValidators: true });
  if (!user) throw new AppError(401, 'Please sign in again.', 'UNAUTHENTICATED');
  return publicUser(user);
}
