import { Router } from 'express';
import { body, param } from 'express-validator';

import { createSale, getSaleById, listSales } from '../controllers/saleController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN', 'GERENTE', 'VENDEDOR', 'CLIENTE'), listSales);

router.get(
  '/:id',
  authorize('ADMIN', 'GERENTE', 'VENDEDOR', 'CLIENTE'),
  [param('id').isInt().withMessage('ID invalido.'), validateRequest],
  getSaleById,
);

router.post(
  '/',
  authorize('ADMIN', 'GERENTE', 'VENDEDOR', 'CLIENTE'),
  [
    body('id_metodo_pago').notEmpty().withMessage('El metodo de pago es obligatorio.'),
    body('items').isArray({ min: 1 }).withMessage('Debes enviar al menos un item.'),
    body('items.*.id_producto').isInt({ min: 1 }),
    body('items.*.cantidad').isInt({ min: 1 }),
    validateRequest,
  ],
  createSale,
);

export default router;
