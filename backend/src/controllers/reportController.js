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

    const [recentSales] = await pool.query(
      `SELECT id_venta, DATE_FORMAT(fecha, '%Y-%m-%d %H:%i:%s') AS fecha,
              cliente, usuario, metodo_pago, total
       FROM vista_resumen_ventas
       ORDER BY fecha DESC
       LIMIT 20`,
    );

    const [salesByDate] = await pool.query(
      `SELECT fecha_dia AS fecha, COUNT(*) AS ventas, COALESCE(SUM(total), 0) AS ingresos
       FROM (
         SELECT DATE(fecha) AS fecha_dia, total
         FROM ventas
       ) ventas_por_dia
       GROUP BY fecha_dia
       ORDER BY fecha_dia DESC
       LIMIT 30`,
    );

    const [bestSellers] = await pool.query(
      `WITH ranking_productos AS (
         SELECT
           p.id_producto,
           p.nombre,
           COALESCE(SUM(dv.cantidad), 0) AS unidades,
           COALESCE(SUM(dv.subtotal), 0) AS ingresos,
           RANK() OVER (ORDER BY COALESCE(SUM(dv.cantidad), 0) DESC) AS posicion
         FROM productos p
         LEFT JOIN detalle_venta dv ON dv.id_producto = p.id_producto
         GROUP BY p.id_producto, p.nombre
       )
       SELECT id_producto, nombre, unidades, ingresos, posicion
       FROM ranking_productos
       ORDER BY posicion ASC, ingresos DESC
       LIMIT 10`,
    );

    const [havingProducts] = await pool.query(
      `SELECT
         p.id_producto,
         p.nombre,
         COALESCE(SUM(dv.cantidad), 0) AS unidades,
         COALESCE(SUM(dv.subtotal), 0) AS ingresos
       FROM productos p
       INNER JOIN detalle_venta dv ON dv.id_producto = p.id_producto
       GROUP BY p.id_producto, p.nombre
       HAVING SUM(dv.cantidad) > 2
       ORDER BY unidades DESC, ingresos DESC`,
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

    const [topCustomers] = await pool.query(
      `SELECT
         c.id_cliente,
         c.nombre,
         COUNT(v.id_venta) AS compras,
         COALESCE(SUM(v.total), 0) AS gasto
       FROM clientes c
       INNER JOIN ventas v ON v.id_cliente = c.id_cliente
       GROUP BY c.id_cliente, c.nombre
       ORDER BY gasto DESC
       LIMIT 10`,
    );

    const [belowAverageStock] = await pool.query(
      `SELECT id_producto, nombre, stock
       FROM productos
       WHERE stock < (SELECT AVG(stock) FROM productos)
       ORDER BY stock ASC, nombre ASC`,
    );

    const [customersAboveAverage] = await pool.query(
      `SELECT c.id_cliente, c.nombre, COALESCE(SUM(v.total), 0) AS gasto
       FROM clientes c
       INNER JOIN ventas v ON v.id_cliente = c.id_cliente
       GROUP BY c.id_cliente, c.nombre
       HAVING SUM(v.total) > (SELECT AVG(total) FROM ventas)
       ORDER BY gasto DESC`,
    );

    const [salesJoin] = await pool.query(
      `SELECT v.id_venta, DATE_FORMAT(v.fecha, '%Y-%m-%d %H:%i:%s') AS fecha,
              c.nombre AS cliente, u.nombre AS usuario, mp.nombre AS metodo_pago, v.total
       FROM ventas v
       INNER JOIN clientes c ON c.id_cliente = v.id_cliente
       INNER JOIN usuarios u ON u.id_usuario = v.id_usuario
       INNER JOIN metodos_pago mp ON mp.id_metodo_pago = v.id_metodo_pago
       ORDER BY v.fecha DESC
       LIMIT 10`,
    );

    const [detailJoin] = await pool.query(
      `SELECT dv.id_detalle, dv.id_venta, p.nombre AS producto,
              c.nombre AS categoria, m.nombre AS marca,
              dv.cantidad, dv.precio_unitario, dv.subtotal
       FROM detalle_venta dv
       INNER JOIN productos p ON p.id_producto = dv.id_producto
       INNER JOIN categorias c ON c.id_categoria = p.id_categoria
       INNER JOIN marcas m ON m.id_marca = p.id_marca
       ORDER BY dv.id_detalle DESC
       LIMIT 10`,
    );

    const [productsJoin] = await pool.query(
      `SELECT p.id_producto, p.nombre, p.precio, p.stock,
              c.nombre AS categoria, pr.nombre AS proveedor, m.nombre AS marca
       FROM productos p
       INNER JOIN categorias c ON c.id_categoria = p.id_categoria
       INNER JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
       INNER JOIN marcas m ON m.id_marca = p.id_marca
       ORDER BY p.nombre ASC
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
      recentSales,
      salesByDate,
      bestSellers: bestSellers.map((row) => ({
        rank: Number(row.posicion),
        product: row.nombre,
        units: Number(row.unidades),
        revenue: Number(row.ingresos),
      })),
      havingProducts: havingProducts.map((row) => ({
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
      topCustomers: topCustomers.map((row) => ({
        customer: row.nombre,
        purchases: Number(row.compras),
        amount: Number(row.gasto),
      })),
      belowAverageStock,
      customersAboveAverage: customersAboveAverage.map((row) => ({
        customer: row.nombre,
        amount: Number(row.gasto),
      })),
      sqlSamples: {
        salesJoin,
        detailJoin,
        productsJoin,
      },
    });
  } catch (error) {
    next(error);
  }
}

function escapeCsv(value) {
  const normalized = value == null ? '' : String(value);
  return `"${normalized.replaceAll('"', '""')}"`;
}

function escapePdfText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('\\', '\\\\')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)')
    .replace(/[^\x20-\x7E]/g, '');
}

function formatCell(value) {
  if (value == null) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'number') return Number(value).toFixed(2).replace(/\.00$/, '');
  return String(value);
}

function buildCsv(columns, rows) {
  const headers = columns.map((column) => column.label);
  const body = rows.length
    ? rows.map((row) =>
        columns.map((column) => escapeCsv(formatCell(row[column.key]))).join(','),
      )
    : [columns.map((column, index) => escapeCsv(index === 0 ? 'Sin datos disponibles' : '')).join(',')];

  return [headers.map(escapeCsv).join(','), ...body].join('\n');
}

function buildPdf({ title, columns, rows }) {
  const lines = [
    title,
    `Generado: ${new Date().toLocaleString('es-GT')}`,
    '',
    columns.map((column) => column.label).join(' | '),
    '-'.repeat(96),
    ...(rows.length
      ? rows.slice(0, 45).map((row) =>
          columns
            .map((column) => formatCell(row[column.key]).slice(0, 24))
            .join(' | '),
        )
      : ['Sin datos disponibles']),
  ];

  const content = [
    'BT',
    '/F1 10 Tf',
    '40 790 Td',
    ...lines.flatMap((line, index) => [
      index === 0 ? '/F1 16 Tf' : index === 1 ? '/F1 9 Tf' : '/F1 8 Tf',
      `(${escapePdfText(line)}) Tj`,
      '0 -16 Td',
    ]),
    'ET',
  ].join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(content, 'utf8')} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, 'utf8');
}

const REPORTS = {
  'recent-sales': {
    title: 'Ventas recientes',
    filename: 'ventas-recientes',
    columns: [
      { key: 'id_venta', label: 'ID' },
      { key: 'fecha', label: 'Fecha' },
      { key: 'cliente', label: 'Cliente' },
      { key: 'usuario', label: 'Usuario' },
      { key: 'metodo_pago', label: 'Metodo de pago' },
      { key: 'total', label: 'Total' },
    ],
    query: `SELECT id_venta, DATE_FORMAT(fecha, '%Y-%m-%d %H:%i:%s') AS fecha,
                   cliente, usuario, metodo_pago, total
            FROM vista_resumen_ventas
            ORDER BY fecha DESC
            LIMIT 100`,
  },
  'top-products': {
    title: 'Productos mas vendidos',
    filename: 'productos-mas-vendidos',
    columns: [
      { key: 'posicion', label: 'Ranking' },
      { key: 'producto', label: 'Producto' },
      { key: 'unidades', label: 'Unidades vendidas' },
      { key: 'ingresos', label: 'Ingresos' },
    ],
    query: `WITH ranking_productos AS (
              SELECT p.id_producto, p.nombre AS producto,
                     COALESCE(SUM(dv.cantidad), 0) AS unidades,
                     COALESCE(SUM(dv.subtotal), 0) AS ingresos,
                     RANK() OVER (ORDER BY COALESCE(SUM(dv.cantidad), 0) DESC) AS posicion
              FROM productos p
              LEFT JOIN detalle_venta dv ON dv.id_producto = p.id_producto
              GROUP BY p.id_producto, p.nombre
            )
            SELECT posicion, producto, unidades, ingresos
            FROM ranking_productos
            ORDER BY posicion ASC, ingresos DESC
            LIMIT 100`,
  },
  'low-stock': {
    title: 'Productos con bajo stock',
    filename: 'productos-bajo-stock',
    columns: [
      { key: 'producto', label: 'Producto' },
      { key: 'stock', label: 'Stock actual' },
      { key: 'stock_minimo', label: 'Stock minimo' },
      { key: 'reorden_sugerido', label: 'Reorden sugerido' },
    ],
    query: `SELECT nombre AS producto, stock, 10 AS stock_minimo,
                   GREATEST(10 - stock, 0) + 10 AS reorden_sugerido
            FROM productos
            WHERE stock < 10
            ORDER BY stock ASC, nombre ASC`,
  },
  'sales-by-payment': {
    title: 'Ventas por metodo de pago',
    filename: 'ventas-por-metodo-pago',
    columns: [
      { key: 'metodo_pago', label: 'Metodo de pago' },
      { key: 'total_ventas', label: 'Ventas' },
      { key: 'monto', label: 'Monto' },
    ],
    query: `SELECT mp.nombre AS metodo_pago, COUNT(v.id_venta) AS total_ventas,
                   COALESCE(SUM(v.total), 0) AS monto
            FROM metodos_pago mp
            LEFT JOIN ventas v ON v.id_metodo_pago = mp.id_metodo_pago
            GROUP BY mp.id_metodo_pago, mp.nombre
            ORDER BY monto DESC, mp.nombre ASC`,
  },
  'sales-by-date': {
    title: 'Ventas por fecha',
    filename: 'ventas-por-fecha',
    columns: [
      { key: 'fecha', label: 'Fecha' },
      { key: 'ventas', label: 'Ventas' },
      { key: 'ingresos', label: 'Ingresos' },
    ],
    query: `SELECT fecha_dia AS fecha,
                   COUNT(*) AS ventas,
                   COALESCE(SUM(total), 0) AS ingresos
            FROM (
              SELECT DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha_dia, total
              FROM ventas
            ) ventas_por_dia
            GROUP BY fecha_dia
            ORDER BY fecha_dia DESC
            LIMIT 100`,
  },
  'top-customers': {
    title: 'Clientes con mas compras',
    filename: 'clientes-mas-compras',
    columns: [
      { key: 'cliente', label: 'Cliente' },
      { key: 'compras', label: 'Compras' },
      { key: 'gasto', label: 'Gasto' },
    ],
    query: `SELECT c.nombre AS cliente,
                   COUNT(v.id_venta) AS compras,
                   COALESCE(SUM(v.total), 0) AS gasto
            FROM clientes c
            INNER JOIN ventas v ON v.id_cliente = c.id_cliente
            GROUP BY c.id_cliente, c.nombre
            ORDER BY gasto DESC, compras DESC
            LIMIT 100`,
  },
};

async function sendReport(req, res, next, reportId, format) {
  try {
    const report = REPORTS[reportId];

    if (!report) {
      res.status(404).json({ message: 'Reporte no encontrado.' });
      return;
    }

    const [rows] = await pool.query(report.query);

    if (format === 'csv') {
      const csv = buildCsv(report.columns, rows);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${report.filename}.csv"`);
      res.send(`\uFEFF${csv}`);
      return;
    }

    const pdf = buildPdf({ title: report.title, columns: report.columns, rows });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.filename}.pdf"`);
    res.send(pdf);
  } catch (error) {
    next(error);
  }
}

export function exportRecentSalesCsv(req, res, next) {
  return sendReport(req, res, next, 'recent-sales', 'csv');
}

export function exportRecentSalesPdf(req, res, next) {
  return sendReport(req, res, next, 'recent-sales', 'pdf');
}

export function exportTopProductsCsv(req, res, next) {
  return sendReport(req, res, next, 'top-products', 'csv');
}

export function exportTopProductsPdf(req, res, next) {
  return sendReport(req, res, next, 'top-products', 'pdf');
}

export function exportLowStockCsv(req, res, next) {
  return sendReport(req, res, next, 'low-stock', 'csv');
}

export function exportLowStockPdf(req, res, next) {
  return sendReport(req, res, next, 'low-stock', 'pdf');
}

export function exportSalesByPaymentCsv(req, res, next) {
  return sendReport(req, res, next, 'sales-by-payment', 'csv');
}

export function exportSalesByPaymentPdf(req, res, next) {
  return sendReport(req, res, next, 'sales-by-payment', 'pdf');
}

export function exportSalesByDateCsv(req, res, next) {
  return sendReport(req, res, next, 'sales-by-date', 'csv');
}

export function exportSalesByDatePdf(req, res, next) {
  return sendReport(req, res, next, 'sales-by-date', 'pdf');
}

export function exportTopCustomersCsv(req, res, next) {
  return sendReport(req, res, next, 'top-customers', 'csv');
}

export function exportTopCustomersPdf(req, res, next) {
  return sendReport(req, res, next, 'top-customers', 'pdf');
}
