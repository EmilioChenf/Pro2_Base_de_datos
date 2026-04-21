import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

export function buildUserPayload(row) {
  return {
    id_usuario: row.id_usuario,
    nombre: row.nombre,
    correo: row.correo,
    rol: row.rol,
  };
}

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id_usuario,
      correo: user.correo,
      rol: user.rol,
      nombre: user.nombre,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

export function buildAuthResponse(row) {
  const user = buildUserPayload(row);
  return {
    token: signAccessToken(user),
    user,
  };
}
