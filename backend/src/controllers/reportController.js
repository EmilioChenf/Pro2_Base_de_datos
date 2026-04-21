import { pool } from '../db/pool.js';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export async function dashboard(req, res, next) {
  try {
    const [[summary]] = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM productos) AS total_productos,
         (SELECT COUNT(*) FROM productos WHERE stock < 10) AS stock_bajo,
         (SELECT COUNT(*) FROM ventas WHERE DATE(fecha) = CURDATE()) AS ventas_hoy,
         (SELECT COALESCE(SUM(total), 0)
          FROM ventas
          WHERE YEAR(fecha) = YEAR(CURDATE()) AND MONTH(fecha) = MONTH(CURDATE())) AS ingresos_mes,
         (SELECT COUNT(*) FROM clientes) AS total_clientes`,
    );

    const [monthlyRows] = await pool.query(
      `SELECT
         YEAR(fecha) AS anio,
         MONTH(fecha) AS mes_numero,
         COALESCE(SUM(total), 0) AS ventas
       FROM ventas
       WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)
       GROUP BY YEAR(fecha), MONTH(fecha)
       ORDER BY anio ASC, mes_numero ASC`,
    );

    const [recentSales] = await pool.query(
      `SELECT
         v.id_venta,
         c.nombre AS cliente,
         DATE_FORMAT(v.fecha, '%Y-%m-%d %H:%i:%s') AS fecha,
         COALESCE(SUM(dv.cantidad), 0) AS items,
         v.total
       FROM ventas v
       INNER JOIN clientes c ON c.id_cliente = v.id_cliente
       LEFT JOIN detalle_venta dv ON dv.id_venta = v.id_venta
       GROUP BY v.id_venta, c.nombre, v.fecha, v.total
       ORDER BY v.fecha DESC
       LIMIT 5`,
    );

    const [lowStock] = await pool.query(
      `SELECT
         id_producto,
         nombre,
         stock,
         10 AS stock_minimo
       FROM productos
       WHERE stock < 10
       ORDER BY stock ASC, nombre ASC
       LIMIT 5`,
    );

    res.json({
      summary,
      salesByMonth: monthlyRows.map((row) => ({
        month: MONTHS[row.mes_numero - 1],
        ventas: Number(row.ventas),
      })),
      recentSales,
      lowStock,
    });
  } catch (error) {
    next(error);
  }
}

export async function overview(req, res, next) {
  try {
    const [[summary]] = await pool.query(
      `SELECT
         COALESCE(SUM(total), 0) AS ingresos_totales,
         COALESCE((SELECT SUM(cantidad) FROM detalle_venta), 0) AS productos_vendidos,
         COALESCE(AVG(total), 0) AS ticket_promedio,
         COALESCE(SUM(CASE
           WHEN YEAR(fecha) = YEAR(CURDATE()) AND MONTH(fecha) = MONTH(CURDATE())
           THEN total ELSE 0 END), 0) AS ventas_mes_actual
       FROM ventas`,
    );

    const [salesByMonthRows] = await pool.query(
      `SELECT
         YEAR(fecha) AS anio,
         MONTH(fecha) AS mes_numero,
         COALESCE(SUM(total), 0) AS ventas
       FROM ventas
       WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)
       GROUP BY YEAR(fecha), MONTH(fecha)
       ORDER BY anio ASC, mes_numero ASC`,
    );

    const [salesByPaymentRows] = await pool.query(
      `SELECT
         mp.nombre,
         COUNT(v.id_venta) AS total_ventas,
         COALESCE(SUM(v.total), 0) AS monto
       FROM metodos_pago mp
       LEFT JOIN ventas v ON v.id_metodo_pago = mp.id_metodo_pago
       GROUP BY mp.id_metodo_pago, mp.nombre
       ORDER BY monto DESC, mp.nombre ASC`,
    );

    const totalPaymentAmount = salesByPaymentRows.reduce(
      (accumulator, row) => accumulator + Number(row.monto),
      0,
    );

    const [bestSellers] = await pool.query(
      `SELECT
         p.id_producto,
         p.nombre,
         COALESCE(SUM(dv.cantidad), 0) AS unidades,
         COALESCE(SUM(dv.subtotal), 0) AS ingresos
       FROM productos p
       LEFT JOIN detalle_venta dv ON dv.id_producto = p.id_producto
       GROUP BY p.id_producto, p.nombre
       ORDER BY unidades DESC, ingresos DESC
       LIMIT 5`,
    );

    const [lowStock] = await pool.query(
      `SELECT
         id_producto,
         nombre,
         stock,
         10 AS stock_minimo,
         GREATEST(10 - stock, 0) + 10 AS reorden_sugerido
       FROM productos
       WHERE stock < 10
       ORDER BY stock ASC, nombre ASC`,
    );

    const [salesByProduct] = await pool.query(
      `SELECT
         p.id_producto,
         p.nombre,
         COALESCE(SUM(dv.cantidad), 0) AS ventas
       FROM productos p
       LEFT JOIN detalle_venta dv ON dv.id_producto = p.id_producto
       GROUP BY p.id_producto, p.nombre
       ORDER BY ventas DESC, p.nombre ASC
       LIMIT 10`,
    );

    res.json({
      summary,
      salesByMonth: salesByMonthRows.map((row) => ({
        month: MONTHS[row.mes_numero - 1],
        ventas: Number(row.ventas),
      })),
      salesByPayment: salesByPaymentRows.map((row) => ({
        name: row.nombre,
        totalVentas: Number(row.total_ventas),
        amount: Number(row.monto),
        value:
          totalPaymentAmount > 0
            ? Math.round((Number(row.monto) * 100) / totalPaymentAmount)
            : 0,
      })),
      bestSellers: bestSellers.map((row, index) => ({
        rank: index + 1,
        product: row.nombre,
        units: Number(row.unidades),
        revenue: Number(row.ingresos),
      })),
      lowStock: lowStock.map((row) => ({
        product: row.nombre,
        stock: Number(row.stock),
        minStock: Number(row.stock_minimo),
        reorder: Number(row.reorden_sugerido),
      })),
      salesByProduct: salesByProduct.map((row) => ({
        name: row.nombre,
        ventas: Number(row.ventas),
      })),
    });
  } catch (error) {
    next(error);
  }
}
