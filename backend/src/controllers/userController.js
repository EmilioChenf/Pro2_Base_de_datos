import bcrypt from 'bcrypt';

import { pool } from '../db/pool.js';
import {
  getRoleId,
  upsertCustomerProfile,
} from '../services/domainService.js';
import { createHttpError } from '../utils/httpError.js';

export async function listUsers(_req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT
         u.id_usuario,
         u.nombre,
         u.correo,
         r.nombre AS rol,
         u.google_id
       FROM usuarios u
       INNER JOIN roles r ON r.id_rol = u.id_rol
       ORDER BY u.id_usuario DESC`,
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const { nombre, correo, password, rol, telefono = '' } = req.body;
    await connection.beginTransaction();

    const [existingRows] = await connection.query(
      'SELECT id_usuario FROM usuarios WHERE correo = ? LIMIT 1',
      [correo],
    );

    if (existingRows.length) {
      throw createHttpError(409, 'Ya existe un usuario con ese correo.');
    }

    const roleId = await getRoleId(connection, rol);
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await connection.query(
      `INSERT INTO usuarios (nombre, correo, password, id_rol, google_id)
       VALUES (?, ?, ?, ?, NULL)`,
      [nombre.trim(), correo.trim(), passwordHash, roleId],
    );

    if (rol === 'CLIENTE') {
      await upsertCustomerProfile(connection, {
        userId: result.insertId,
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono,
      });
    }

    await connection.commit();

    res.status(201).json({
      id_usuario: result.insertId,
      nombre: nombre.trim(),
      correo: correo.trim(),
      rol,
      google_id: null,
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

export async function updateUser(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { nombre, correo, password, rol, telefono = '' } = req.body;

    await connection.beginTransaction();

    const roleId = await getRoleId(connection, rol);

    if (password?.trim()) {
      const passwordHash = await bcrypt.hash(password.trim(), 10);
      await connection.query(
        `UPDATE usuarios
         SET nombre = ?, correo = ?, password = ?, id_rol = ?
         WHERE id_usuario = ?`,
        [nombre.trim(), correo.trim(), passwordHash, roleId, id],
      );
    } else {
      const [result] = await connection.query(
        `UPDATE usuarios
         SET nombre = ?, correo = ?, id_rol = ?
         WHERE id_usuario = ?`,
        [nombre.trim(), correo.trim(), roleId, id],
      );

      if (!result.affectedRows) {
        throw createHttpError(404, 'El usuario no existe.');
      }
    }

    if (rol === 'CLIENTE') {
      await upsertCustomerProfile(connection, {
        userId: Number(id),
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono,
      });
    }

    await connection.commit();

    res.json({
      id_usuario: Number(id),
      nombre: nombre.trim(),
      correo: correo.trim(),
      rol,
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

export async function deleteUser(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    if (Number(id) === Number(req.user?.id_usuario)) {
      throw createHttpError(409, 'No puedes eliminar tu propio usuario.');
    }

    await connection.beginTransaction();

    await connection.query('DELETE FROM clientes WHERE id_usuario = ?', [id]);
    const [result] = await connection.query(
      'DELETE FROM usuarios WHERE id_usuario = ?',
      [id],
    );

    if (!result.affectedRows) {
      throw createHttpError(404, 'El usuario no existe.');
    }

    await connection.commit();
    res.status(204).send();
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}
