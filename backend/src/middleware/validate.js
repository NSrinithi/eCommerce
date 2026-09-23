import { AppError } from '../utils/AppError.js';
export const validate = validator => (req, _res, next) => {
  // Whitelisted data only. Controllers use req.validated, not arbitrary request fields.
  req.validated = validator(req.body);
  next();
};
export function validId(req, _res, next) {
  if (!/^[a-f0-9]{24}$/i.test(req.params.id)) throw new AppError(400, 'Invalid record ID.', 'INVALID_ID');
  next();
}
