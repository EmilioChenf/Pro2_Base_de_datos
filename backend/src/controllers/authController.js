import bcrypt from 'bcrypt';

import { pool } from '../db/pool.js';
import { buildAuthResponse } from '../services/authService.js';
import {
  getRoleId,
  getUserWithRoleByEmail,
  getUserWithRoleById,
  upsertCustomerProfile,
} from '../services/domainService.js';
import { createHttpError } from '../utils/httpError.js';

async function fetchGoogleProfile(accessToken) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw createHttpError(
      401,
      'No se pudo validar la cuenta de Google. Verifica tu configuracion OAuth.',
    );
  }

  return response.json();
}

export async function login(req, res, next) {
  try {
    const { correo, password } = req.body;
    const user = await getUserWithRoleByEmail(pool, correo);

    if (!user || !user.password) {
      throw createHttpError(401, 'Correo o contrasena incorrectos.');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw createHttpError(401, 'Correo o contrasena incorrectos.');
    }

    res.json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function register(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const { nombre, correo, password, telefono = '' } = req.body;

    await connection.beginTransaction();

    const existingUser = await getUserWithRoleByEmail(connection, correo);
    if (existingUser) {
      throw createHttpError(409, 'Ya existe un usuario registrado con ese correo.');
    }

    const clientRoleId = await getRoleId(connection, 'CLIENTE');
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await connection.query(
      `INSERT INTO usuarios (nombre, correo, password, id_rol, google_id)
       VALUES (?, ?, ?, ?, NULL)`,
      [nombre, correo, passwordHash, clientRoleId],
    );

    await upsertCustomerProfile(connection, {
      userId: result.insertId,
      nombre,
      correo,
      telefono,
    });

    await connection.commit();

    const user = await getUserWithRoleById(pool, result.insertId);
    res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

export async function loginWithGoogle(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const { accessToken } = req.body;
    const googleProfile = await fetchGoogleProfile(accessToken);

    if (!googleProfile?.email || !googleProfile?.sub) {
      throw createHttpError(401, 'La cuenta de Google no devolvio informacion suficiente.');
    }

    await connection.beginTransaction();

    let user = await getUserWithRoleByEmail(connection, googleProfile.email);

    if (!user) {
      const clientRoleId = await getRoleId(connection, 'CLIENTE');

      const [result] = await connection.query(
        `INSERT INTO usuarios (nombre, correo, password, id_rol, google_id)
         VALUES (?, ?, NULL, ?, ?)`,
        [googleProfile.name ?? googleProfile.email, googleProfile.email, clientRoleId, googleProfile.sub],
      );

      await upsertCustomerProfile(connection, {
        userId: result.insertId,
        nombre: googleProfile.name ?? googleProfile.email,
        correo: googleProfile.email,
        telefono: '',
      });
    } else if (!user.google_id) {
      await connection.query(
        'UPDATE usuarios SET google_id = ? WHERE id_usuario = ?',
        [googleProfile.sub, user.id_usuario],
      );
      await upsertCustomerProfile(connection, {
        userId: user.id_usuario,
        nombre: googleProfile.name ?? user.nombre,
        correo: googleProfile.email,
        telefono: '',
      });
    }

    await connection.commit();

    user = await getUserWithRoleByEmail(pool, googleProfile.email);
    res.json(buildAuthResponse(user));
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

export async function me(req, res, next) {
  try {
    const user = await getUserWithRoleById(pool, req.user.id_usuario);

    if (!user) {
      throw createHttpError(404, 'No se encontro el usuario autenticado.');
    }

    res.json({ user: buildAuthResponse(user).user });
  } catch (error) {
    next(error);
  }
}
