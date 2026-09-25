import * as auth from '../services/auth.service.js';
import { sendData } from '../utils/response.js';
import { cookieOptions, clearSessionCookie } from '../utils/sessionToken.js';
export async function register(req, res) {
  const user = await auth.register(req.validated);
  return sendData(res, { user }, 201, 'Account created. You can now sign in.');
}
export async function login(req, res) {
  const user = await auth.login(req.validated);
  const config = req.app.locals.config;
  const token = await auth.issue(user.id, req.cookies[config.cookieName], config);
  res.cookie(config.cookieName, token, cookieOptions(config));
  // Do not return the JWT to browser JavaScript.
  return sendData(res, { user }, 200, 'Signed in.');
}
export function me(req, res) {
  console.log("========== AUTH ME ==========");
  console.log("USER:", req.user);
  console.log("COOKIES:", req.cookies);
  console.log("=============================");
  return sendData(res, { user: req.user });
}
export async function updateMe(req, res) {
  return sendData(res, { user: await auth.updateProfile(req.user.id, req.validated) }, 200, 'Profile updated.');
}
export async function logout(req, res) {
  const config = req.app.locals.config;
  await auth.revoke(req.cookies[config.cookieName], config);
  clearSessionCookie(res, config);
  return sendData(res, null, 200, 'Signed out.');
}
