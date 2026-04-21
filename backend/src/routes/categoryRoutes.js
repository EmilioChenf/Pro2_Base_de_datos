import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '../controllers/catalogController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', listCategories);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    validateRequest,
  ],
  createCategory,
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  [
    param('id').isInt().withMessage('ID invalido.'),
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    validateRequest,
  ],
  updateCategory,
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  [param('id').isInt().withMessage('ID invalido.'), validateRequest],
  deleteCategory,
);

export default router;
