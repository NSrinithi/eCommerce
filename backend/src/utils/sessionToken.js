import jwt from 'jsonwebtoken';
const issuer = 'mern-base-api';
const audience = 'mern-base-web';
export function signSession(userId, sessionId, config) {
  return jwt.sign({ sid: sessionId }, config.jwtSecret, {
    subject: userId,
    issuer,
    audience,
    algorithm: 'HS256',
    expiresIn: `${config.sessionDays}d`,
  });
}
export function verifySession(token, config) {
  if (!token) return null;
  try {
    const claims = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
      issuer,
      audience
    });
    if (typeof claims === 'string' || !/^[a-f0-9]{24}$/i.test(claims.sub || '') || !/^[a-f0-9]{24}$/i.test(claims.sid || '')) return null;
    return claims;
  } catch {
    return null;
  }
}
export function cookieOptions(config) {
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite:'lax',
    path: '/api',
    // keep your existing maxAge / other options
  };
}
export function clearSessionCookie(res, config) {
  const options = cookieOptions(config);
  delete options.maxAge;
  res.clearCookie(config.cookieName, options);
}
