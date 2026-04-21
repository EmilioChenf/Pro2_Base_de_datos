import { Router } from 'express';
import { body, param } from 'express-validator';

import { createSale, getSaleById, listSales } from '../controllers/saleController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.use(authenticate);

router.get('/', listSales);

router.get(
  '/:id',
  [param('id').isInt().withMessage('ID invalido.'), validateRequest],
  getSaleById,
);

router.post(
  '/',
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
