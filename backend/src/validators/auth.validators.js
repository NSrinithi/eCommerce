import { objectBody, text, email, password } from '../utils/validation.js';
export function registerBody(raw) {
  const body = objectBody(raw);
  return {
    name: text(body.name, 'name', 2, 80),
    email: email(body.email),
    password: password(body.password, true)
  };
}
export function loginBody(raw) {
  const body = objectBody(raw);
  return { email: email(body.email), password: password(body.password) };
}
export function profileBody(raw) {
  return { name: text(objectBody(raw).name, 'name', 2, 80) };
}
