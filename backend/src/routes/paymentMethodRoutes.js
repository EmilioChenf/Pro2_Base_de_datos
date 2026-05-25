import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  createPaymentMethod,
  deletePaymentMethod,
  listPaymentMethods,
  updatePaymentMethod,
} from '../controllers/catalogController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', listPaymentMethods);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    validateRequest,
  ],
  createPaymentMethod,
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
  updatePaymentMethod,
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  [param('id').isInt().withMessage('ID invalido.'), validateRequest],
  deletePaymentMethod,
);

export default router;
