import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  createCustomer,
  deleteCustomer,
  listCustomers,
  updateCustomer,
} from '../controllers/customerController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/', listCustomers);

router.post(
  '/',
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('correo').isEmail().withMessage('Debes enviar un correo valido.'),
    body('telefono').trim().notEmpty().withMessage('El telefono es obligatorio.'),
    body('password').optional().isLength({ min: 6 }),
    validateRequest,
  ],
  createCustomer,
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('ID invalido.'),
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('correo').isEmail().withMessage('Debes enviar un correo valido.'),
    body('telefono').trim().notEmpty().withMessage('El telefono es obligatorio.'),
    validateRequest,
  ],
  updateCustomer,
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('ID invalido.'), validateRequest],
  deleteCustomer,
);

export default router;
