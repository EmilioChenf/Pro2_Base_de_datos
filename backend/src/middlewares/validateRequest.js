import { validationResult } from 'express-validator';

import { createHttpError } from '../utils/httpError.js';

export function validateRequest(req, _res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return next(
      createHttpError(422, 'Los datos enviados no son validos.', result.array()),
    );
  }

  return next();
}
