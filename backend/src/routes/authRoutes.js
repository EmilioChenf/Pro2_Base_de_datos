import { Router } from 'express';
import { body } from 'express-validator';

import { login, loginWithGoogle, me, register } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.post(
  '/login',
  [
    body('correo').isEmail().withMessage('Debes enviar un correo valido.'),
    body('password').notEmpty().withMessage('La contrasena es obligatoria.'),
    validateRequest,
  ],
  login,
);

router.post(
  '/register',
  [
    body('nombre').trim().isLength({ min: 2 }).withMessage('El nombre es obligatorio.'),
    body('correo').isEmail().withMessage('Debes enviar un correo valido.'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contrasena debe tener al menos 6 caracteres.'),
    body('telefono').optional().isString(),
    validateRequest,
  ],
  register,
);

router.post(
  '/google',
  [
    body('accessToken').notEmpty().withMessage('Debes enviar el token de Google.'),
    validateRequest,
  ],
  loginWithGoogle,
);

router.get('/me', authenticate, me);

export default router;
