export function notFoundHandler(req, _res, next) {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  let status = error.status ?? 500;
  let message = error.message ?? 'Error interno del servidor.';

  if (error.code === 'ER_DUP_ENTRY') {
    status = 409;
    message = 'El registro ya existe y no puede duplicarse.';
  }

  if (
    error.code === 'ER_ROW_IS_REFERENCED_2' ||
    error.code === 'ER_ROW_IS_REFERENCED'
  ) {
    status = 409;
    message =
      'No se puede eliminar este registro porque tiene informacion relacionada.';
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    status = 400;
    message =
      'No se pudo completar la operacion porque una referencia relacionada no existe.';
  }

  const payload = {
    message,
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (process.env.NODE_ENV !== 'production' && error.stack) {
    payload.stack = error.stack;
  }

  res.status(status).json(payload);
}
