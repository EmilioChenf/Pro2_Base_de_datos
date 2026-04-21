import { pool } from '../db/pool.js';
import {
  resolvePaymentMethodId,
  upsertCustomerProfile,
} from '../services/domainService.js';
import { createHttpError } from '../utils/httpError.js';

async function getSaleOwnership(executor, saleId) {
  const [rows] = await executor.query(
    `SELECT v.id_venta, v.id_cliente, v.id_usuario
     FROM ventas v
     WHERE v.id_venta = ?
     LIMIT 1`,
    [saleId],
  );

  return rows[0] ?? null;
}

export async function listSales(req, res, next) {
  try {
    const isClientScope =
      req.user.rol === 'CLIENTE' || String(req.query.scope) === 'mine';

    const values = [];
    const whereClause = isClientScope
      ? 'WHERE c.id_usuario = ?'
      : '';

    if (isClientScope) {
      values.push(req.user.id_usuario);
    }

    const [rows] = await pool.query(
      `SELECT
         v.id_venta,
         v.fecha,
         v.total,
         c.id_cliente,
         c.nombre AS cliente,
         u.nombre AS usuario,
         mp.nombre AS metodo_pago,
         COALESCE(SUM(dv.cantidad), 0) AS items
       FROM ventas v
       INNER JOIN clientes c ON c.id_cliente = v.id_cliente
       INNER JOIN usuarios u ON u.id_usuario = v.id_usuario
       INNER JOIN metodos_pago mp ON mp.id_metodo_pago = v.id_metodo_pago
       LEFT JOIN detalle_venta dv ON dv.id_venta = v.id_venta
       ${whereClause}
       GROUP BY v.id_venta, v.fecha, v.total, c.id_cliente, c.nombre, u.nombre, mp.nombre
       ORDER BY v.fecha DESC`,
      values,
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function getSaleById(req, res, next) {
  try {
    const sale = await getSaleOwnership(pool, req.params.id);

    if (!sale) {
      throw createHttpError(404, 'La venta no existe.');
    }

    if (req.user.rol === 'CLIENTE') {
      const [ownerRows] = await pool.query(
        'SELECT id_cliente FROM clientes WHERE id_usuario = ? LIMIT 1',
        [req.user.id_usuario],
      );

      if (!ownerRows.length || ownerRows[0].id_cliente !== sale.id_cliente) {
        throw createHttpError(403, 'No puedes ver una venta que no te pertenece.');
      }
    }

    const [headers] = await pool.query(
      `SELECT
         v.id_venta,
         v.fecha,
         v.total,
         c.id_cliente,
         c.nombre AS cliente,
         c.correo,
         c.telefono,
         u.nombre AS usuario,
         mp.nombre AS metodo_pago
       FROM ventas v
       INNER JOIN clientes c ON c.id_cliente = v.id_cliente
       INNER JOIN usuarios u ON u.id_usuario = v.id_usuario
       INNER JOIN metodos_pago mp ON mp.id_metodo_pago = v.id_metodo_pago
       WHERE v.id_venta = ?
       LIMIT 1`,
      [req.params.id],
    );

    const [items] = await pool.query(
      `SELECT
         dv.id_detalle,
         dv.id_producto,
         p.nombre AS producto,
         dv.cantidad,
         dv.precio_unitario,
         dv.subtotal
       FROM detalle_venta dv
       INNER JOIN productos p ON p.id_producto = dv.id_producto
       WHERE dv.id_venta = ?
       ORDER BY dv.id_detalle ASC`,
      [req.params.id],
    );

    res.json({
      ...headers[0],
      items,
    });
  } catch (error) {
    next(error);
  }
}

export async function createSale(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const { items, id_metodo_pago, customer = {}, id_cliente } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw createHttpError(422, 'Debes agregar al menos un producto a la venta.');
    }

    await connection.beginTransaction();

    const paymentMethodId = await resolvePaymentMethodId(connection, id_metodo_pago);

    let customerId = id_cliente;

    if (req.user.rol === 'CLIENTE') {
      customerId = await upsertCustomerProfile(connection, {
        userId: req.user.id_usuario,
        nombre: customer.nombre ?? req.user.nombre,
        correo: customer.correo ?? req.user.correo,
        telefono: customer.telefono ?? '',
      });
    } else {
      const [customerRows] = await connection.query(
        'SELECT id_cliente FROM clientes WHERE id_cliente = ? LIMIT 1',
        [customerId],
      );

      if (!customerRows.length) {
        throw createHttpError(422, 'Debes seleccionar un cliente valido para registrar la venta.');
      }
    }

    let total = 0;
    const normalizedItems = [];

    for (const item of items) {
      const quantity = Number(item.cantidad);
      const productId = Number(item.id_producto);

      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw createHttpError(422, 'Cada producto debe tener una cantidad valida.');
      }

      const [productRows] = await connection.query(
        `SELECT id_producto, nombre, precio, stock
         FROM productos
         WHERE id_producto = ?
         LIMIT 1
         FOR UPDATE`,
        [productId],
      );

      if (!productRows.length) {
        throw createHttpError(404, `El producto ${productId} no existe.`);
      }

      const product = productRows[0];

      if (product.stock < quantity) {
        throw createHttpError(
          409,
          `Stock insuficiente para ${product.nombre}. Disponible: ${product.stock}.`,
        );
      }

      const subtotal = Number(product.precio) * quantity;
      total += subtotal;

      normalizedItems.push({
        id_producto: productId,
        cantidad: quantity,
        precio_unitario: Number(product.precio),
        subtotal,
      });
    }

    const [saleResult] = await connection.query(
      `INSERT INTO ventas (id_cliente, id_usuario, id_metodo_pago, fecha, total)
       VALUES (?, ?, ?, NOW(), ?)`,
      [customerId, req.user.id_usuario, paymentMethodId, total],
    );

    for (const item of normalizedItems) {
      await connection.query(
        `INSERT INTO detalle_venta
         (id_venta, id_producto, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [
          saleResult.insertId,
          item.id_producto,
          item.cantidad,
          item.precio_unitario,
          item.subtotal,
        ],
      );

      await connection.query(
        `UPDATE productos
         SET stock = stock - ?
         WHERE id_producto = ?`,
        [item.cantidad, item.id_producto],
      );
    }

    await connection.commit();
    req.params.id = String(saleResult.insertId);
    return getSaleById(req, res, next);
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}
