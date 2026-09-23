import { objectBody, text } from '../utils/validation.js';
import { AppError } from '../utils/AppError.js';
export function createBody(raw) {
  const body = objectBody(raw);
  return { title: text(body.title, 'title', 1, 100), description: text(body.description ?? '', 'description', 0, 500) };
}
export function updateBody(raw) {
  const body = objectBody(raw);
  const result = {};
  if ('title' in body) result.title = text(body.title, 'title', 1, 100);
  if ('description' in body) result.description = text(body.description, 'description', 0, 500);
  if (!Object.keys(result).length) throw new AppError(400, 'Send title or description.', 'VALIDATION_ERROR');
  return result;
}
