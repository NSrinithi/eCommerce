import { Router } from 'express';
import * as controller from '../controllers/example.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { validId, validate } from '../middleware/validate.js';
import { createBody, updateBody } from '../validators/example.validators.js';
const router = Router();
router.use(requireAuth);
router.get('/', controller.list);
router.post('/', validate(createBody), controller.create);
router.get('/:id', validId, controller.get);
router.patch('/:id', validId, validate(updateBody), controller.update);
// PUT supplies the full editable shape; PATCH supplies only the changed fields.
router.put('/:id', validId, validate(createBody), controller.update);
router.delete('/:id', validId, controller.remove);
export default router;
