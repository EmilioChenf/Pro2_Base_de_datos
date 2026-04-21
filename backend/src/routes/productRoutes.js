import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from '../controllers/catalogController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', [param('id').isInt().withMessage('ID invalido.'), validateRequest], getProductById);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('descripcion').trim().notEmpty().withMessage('La descripcion es obligatoria.'),
    body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a cero.'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un entero positivo.'),
    body('imagen').trim().notEmpty().withMessage('La imagen es obligatoria.'),
    validateRequest,
  ],
  createProduct,
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  [
    param('id').isInt().withMessage('ID invalido.'),
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('descripcion').trim().notEmpty().withMessage('La descripcion es obligatoria.'),
    body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a cero.'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un entero positivo.'),
    body('imagen').trim().notEmpty().withMessage('La imagen es obligatoria.'),
    validateRequest,
  ],
  updateProduct,
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  [param('id').isInt().withMessage('ID invalido.'), validateRequest],
  deleteProduct,
);

export default router;
