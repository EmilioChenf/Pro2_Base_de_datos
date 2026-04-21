import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { createHttpError } from '../utils/httpError.js';

export function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization ?? '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw createHttpError(401, 'Debes iniciar sesion para continuar.');
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = {
      id_usuario: decoded.sub,
      correo: decoded.correo,
      rol: decoded.rol,
      nombre: decoded.nombre,
    };

    next();
  } catch (error) {
    next(createHttpError(401, 'Sesion invalida o expirada.'));
  }
}
