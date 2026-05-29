import { Router } from 'express';
import { param } from 'express-validator';

import {
  getProductById,
  listBrands,
  listCategories,
  listPaymentMethods,
  listProducts,
  listSuppliers,
} from '../controllers/catalogController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.use(authenticate);

router.get(
  '/products',
  authorize('ADMIN', 'GERENTE', 'VENDEDOR', 'INVENTARIO', 'CLIENTE'),
  listProducts,
);
router.get(
  '/products/:id',
  authorize('ADMIN', 'GERENTE', 'VENDEDOR', 'INVENTARIO', 'CLIENTE'),
  [param('id').isInt().withMessage('ID invalido.'), validateRequest],
  getProductById,
);
router.get(
  '/categories',
  authorize('ADMIN', 'GERENTE', 'VENDEDOR', 'INVENTARIO', 'CLIENTE'),
  listCategories,
);
router.get(
  '/brands',
  authorize('ADMIN', 'GERENTE', 'INVENTARIO', 'CLIENTE'),
  listBrands,
);
router.get(
  '/payment-methods',
  authorize('ADMIN', 'GERENTE', 'VENDEDOR', 'INVENTARIO', 'CLIENTE'),
  listPaymentMethods,
);
router.get('/suppliers', authorize('ADMIN', 'GERENTE', 'INVENTARIO'), listSuppliers);

export default router;
