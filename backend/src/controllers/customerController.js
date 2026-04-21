import bcrypt from 'bcrypt';

import { pool } from '../db/pool.js';
import {
  getRoleId,
  upsertCustomerProfile,
} from '../services/domainService.js';
import { createHttpError } from '../utils/httpError.js';

export async function listCustomers(_req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT
         c.id_cliente,
         c.nombre,
         c.correo,
         c.telefono,
         c.id_usuario,
         COALESCE(COUNT(v.id_venta), 0) AS total_compras
       FROM clientes c
       LEFT JOIN ventas v ON v.id_cliente = c.id_cliente
       GROUP BY c.id_cliente, c.nombre, c.correo, c.telefono, c.id_usuario
       ORDER BY c.id_cliente DESC`,
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function createCustomer(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const {
      nombre,
      correo,
      telefono,
      password = 'Cliente123!',
    } = req.body;

    await connection.beginTransaction();

    const [existingRows] = await connection.query(
      'SELECT id_usuario FROM usuarios WHERE correo = ? LIMIT 1',
      [correo],
    );

    if (existingRows.length) {
      throw createHttpError(409, 'Ya existe un usuario con ese correo.');
    }

    const clientRoleId = await getRoleId(connection, 'CLIENTE');
    const passwordHash = await bcrypt.hash(password, 10);

    const [userResult] = await connection.query(
      `INSERT INTO usuarios (nombre, correo, password, id_rol, google_id)
       VALUES (?, ?, ?, ?, NULL)`,
      [nombre.trim(), correo.trim(), passwordHash, clientRoleId],
    );

    const customerId = await upsertCustomerProfile(connection, {
      userId: userResult.insertId,
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
    });

    await connection.commit();

    res.status(201).json({
      id_cliente: customerId,
      id_usuario: userResult.insertId,
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      total_compras: 0,
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

export async function updateCustomer(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const { nombre, correo, telefono } = req.body;
    const { id } = req.params;

    await connection.beginTransaction();

    const [rows] = await connection.query(
      'SELECT id_usuario FROM clientes WHERE id_cliente = ? LIMIT 1',
      [id],
    );

    if (!rows.length) {
      throw createHttpError(404, 'El cliente no existe.');
    }

    const userId = rows[0].id_usuario;

    await connection.query(
      `UPDATE usuarios
       SET nombre = ?, correo = ?
       WHERE id_usuario = ?`,
      [nombre.trim(), correo.trim(), userId],
    );

    await connection.query(
      `UPDATE clientes
       SET nombre = ?, correo = ?, telefono = ?
       WHERE id_cliente = ?`,
      [nombre.trim(), correo.trim(), telefono.trim(), id],
    );

    await connection.commit();

    res.json({
      id_cliente: Number(id),
      id_usuario: userId,
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

export async function deleteCustomer(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    await connection.beginTransaction();

    const [rows] = await connection.query(
      'SELECT id_usuario FROM clientes WHERE id_cliente = ? LIMIT 1',
      [id],
    );

    if (!rows.length) {
      throw createHttpError(404, 'El cliente no existe.');
    }

    const userId = rows[0].id_usuario;

    await connection.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
    await connection.query('DELETE FROM usuarios WHERE id_usuario = ?', [userId]);

    await connection.commit();
    res.status(204).send();
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}
