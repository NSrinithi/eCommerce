import { verifySession, clearSessionCookie } from '../utils/sessionToken.js';
import { Session } from '../models/Session.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { publicUser } from '../services/auth.service.js';
export async function requireAuth(req, res, next) {
  const config = req.app.locals.config;
  const claims = verifySession(req.cookies[config.cookieName], config);
  if (!claims) throw new AppError(401, 'Please sign in to continue.', 'UNAUTHENTICATED');
  const [session, user] = await Promise.all([
    Session.findOne({
      _id: claims.sid,
      user: claims.sub,
      expiresAt: { $gt: new Date() }
    }),
    User.findById(claims.sub),
  ]);
  if (!session || !user) {
    clearSessionCookie(res, config);
    throw new AppError(401, 'Your session has ended. Please sign in.', 'UNAUTHENTICATED');
  }
  req.user = publicUser(user);
  req.sessionId = session.id;
  next();
}
