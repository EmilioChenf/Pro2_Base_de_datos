import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  createSupplier,
  deleteSupplier,
  listSuppliers,
  updateSupplier,
} from '../controllers/catalogController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', authenticate, authorize('ADMIN', 'GERENTE', 'INVENTARIO'), listSuppliers);

router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'INVENTARIO'),
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('correo').isEmail().withMessage('Debes enviar un correo valido.'),
    body('telefono').trim().notEmpty().withMessage('El telefono es obligatorio.'),
    validateRequest,
  ],
  createSupplier,
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'INVENTARIO'),
  [
    param('id').isInt().withMessage('ID invalido.'),
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('correo').isEmail().withMessage('Debes enviar un correo valido.'),
    body('telefono').trim().notEmpty().withMessage('El telefono es obligatorio.'),
    validateRequest,
  ],
  updateSupplier,
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'INVENTARIO'),
  [param('id').isInt().withMessage('ID invalido.'), validateRequest],
  deleteSupplier,
);

export default router;
