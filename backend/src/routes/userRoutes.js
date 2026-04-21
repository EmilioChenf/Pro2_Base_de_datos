import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/', listUsers);

router.post(
  '/',
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('correo').isEmail().withMessage('Debes enviar un correo valido.'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contrasena debe tener al menos 6 caracteres.'),
    body('rol').isIn(['ADMIN', 'CLIENTE']).withMessage('Rol invalido.'),
    body('telefono').optional().isString(),
    validateRequest,
  ],
  createUser,
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('ID invalido.'),
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('correo').isEmail().withMessage('Debes enviar un correo valido.'),
    body('rol').isIn(['ADMIN', 'CLIENTE']).withMessage('Rol invalido.'),
    body('password').optional().isLength({ min: 6 }),
    validateRequest,
  ],
  updateUser,
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('ID invalido.'), validateRequest],
  deleteUser,
);

export default router;
