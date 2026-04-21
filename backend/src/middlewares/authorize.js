import { createHttpError } from '../utils/httpError.js';

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(createHttpError(401, 'Debes iniciar sesion para continuar.'));
    }

    if (!roles.includes(req.user.rol)) {
      return next(createHttpError(403, 'No tienes permisos para realizar esta accion.'));
    }

    return next();
  };
}
