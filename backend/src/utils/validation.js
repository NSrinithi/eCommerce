import { AppError } from './AppError.js';
export function objectBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new AppError(400, 'Send a JSON object.', 'VALIDATION_ERROR');
  return body;
}
export function text(value, field, min, max) {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
    const message = `${field} must have ${min}-${max} characters.`;
    throw new AppError(400, message, 'VALIDATION_ERROR', { [field]: message });
  }
  return value.trim();
}
export function email(value) {
  const result = text(value, 'email', 3, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new AppError(400, 'Enter a valid email.', 'VALIDATION_ERROR', { email: 'Enter a valid email.' });
  return result;
}
export function password(value, registering = false) {
  const min = registering ? 12 : 1;
  // bcrypt has a 72-byte input limit. Do not silently truncate or trim passwords.
  if (typeof value !== 'string' || value.length < min || Buffer.byteLength(value, 'utf8') > 72) {
    throw new AppError(400, `Password must be at least ${min} characters and at most 72 UTF-8 bytes.`, 'VALIDATION_ERROR');
  }
  return value;
}
