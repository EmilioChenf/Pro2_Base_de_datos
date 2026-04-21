import { pool } from '../db/pool.js';
import {
  getCategoryDescription,
  getPaymentPresentation,
  resolveBrandId,
  resolveCategoryId,
  resolveSupplierId,
} from '../services/domainService.js';
import { createHttpError } from '../utils/httpError.js';

function mapProductRow(row, { bestSellerIds, newestIds }) {
  return {
    id_producto: row.id_producto,
    nombre: row.nombre,
    descripcion: row.descripcion,
    precio: row.precio,
    stock: row.stock,
    imagen: row.imagen,
    id_categoria: row.id_categoria,
    categoria: row.categoria,
    id_proveedor: row.id_proveedor,
    proveedor: row.proveedor,
    id_marca: row.id_marca,
    marca: row.marca,
    isBestSeller: bestSellerIds.has(row.id_producto),
    isNew: newestIds.has(row.id_producto),
    isFeatured:
      bestSellerIds.has(row.id_producto) ||
      newestIds.has(row.id_producto) ||
      row.stock >= 15,
  };
}

async function getProductPresentationSets() {
  const [bestSellerRows] = await pool.query(
    `SELECT dv.id_producto, SUM(dv.cantidad) AS unidades
     FROM detalle_venta dv
     GROUP BY dv.id_producto
     ORDER BY unidades DESC
     LIMIT 5`,
  );

  const [newestRows] = await pool.query(
    'SELECT id_producto FROM productos ORDER BY id_producto DESC LIMIT 4',
  );

  return {
    bestSellerIds: new Set(bestSellerRows.map((row) => row.id_producto)),
    newestIds: new Set(newestRows.map((row) => row.id_producto)),
  };
}

export async function listCategories(_req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id_categoria, nombre FROM categorias ORDER BY nombre ASC',
    );

    res.json(
      rows.map((row) => ({
        ...row,
        descripcion: getCategoryDescription(row.nombre),
      })),
    );
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { nombre } = req.body;
    const [result] = await pool.query(
      'INSERT INTO categorias (nombre) VALUES (?)',
      [nombre.trim()],
    );

    res.status(201).json({
      id_categoria: result.insertId,
      nombre: nombre.trim(),
      descripcion: getCategoryDescription(nombre.trim()),
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const [result] = await pool.query(
      'UPDATE categorias SET nombre = ? WHERE id_categoria = ?',
      [nombre.trim(), id],
    );

    if (!result.affectedRows) {
      throw createHttpError(404, 'La categoria no existe.');
    }

    res.json({
      id_categoria: Number(id),
      nombre: nombre.trim(),
      descripcion: getCategoryDescription(nombre.trim()),
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const [result] = await pool.query(
      'DELETE FROM categorias WHERE id_categoria = ?',
      [req.params.id],
    );

    if (!result.affectedRows) {
      throw createHttpError(404, 'La categoria no existe.');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function listSuppliers(_req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT id_proveedor, nombre, correo, telefono
       FROM proveedores
       ORDER BY nombre ASC`,
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function createSupplier(req, res, next) {
  try {
    const { nombre, correo, telefono } = req.body;
    const [result] = await pool.query(
      `INSERT INTO proveedores (nombre, correo, telefono)
       VALUES (?, ?, ?)`,
      [nombre.trim(), correo.trim(), telefono.trim()],
    );

    res.status(201).json({
      id_proveedor: result.insertId,
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre, correo, telefono } = req.body;

    const [result] = await pool.query(
      `UPDATE proveedores
       SET nombre = ?, correo = ?, telefono = ?
       WHERE id_proveedor = ?`,
      [nombre.trim(), correo.trim(), telefono.trim(), id],
    );

    if (!result.affectedRows) {
      throw createHttpError(404, 'El proveedor no existe.');
    }

    res.json({
      id_proveedor: Number(id),
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSupplier(req, res, next) {
  try {
    const [result] = await pool.query(
      'DELETE FROM proveedores WHERE id_proveedor = ?',
      [req.params.id],
    );

    if (!result.affectedRows) {
      throw createHttpError(404, 'El proveedor no existe.');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function listBrands(_req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id_marca, nombre FROM marcas ORDER BY nombre ASC',
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function listPaymentMethods(_req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id_metodo_pago, nombre FROM metodos_pago ORDER BY id_metodo_pago ASC',
    );

    res.json(
      rows.map((row) => ({
        ...row,
        ...getPaymentPresentation(row.nombre),
      })),
    );
  } catch (error) {
    next(error);
  }
}

export async function createPaymentMethod(req, res, next) {
  try {
    const { nombre } = req.body;
    const trimmed = nombre.trim();

    const [result] = await pool.query(
      'INSERT INTO metodos_pago (nombre) VALUES (?)',
      [trimmed],
    );

    res.status(201).json({
      id_metodo_pago: result.insertId,
      nombre: trimmed,
      ...getPaymentPresentation(trimmed),
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePaymentMethod(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const trimmed = nombre.trim();

    const [result] = await pool.query(
      'UPDATE metodos_pago SET nombre = ? WHERE id_metodo_pago = ?',
      [trimmed, id],
    );

    if (!result.affectedRows) {
      throw createHttpError(404, 'El metodo de pago no existe.');
    }

    res.json({
      id_metodo_pago: Number(id),
      nombre: trimmed,
      ...getPaymentPresentation(trimmed),
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePaymentMethod(req, res, next) {
  try {
    const [result] = await pool.query(
      'DELETE FROM metodos_pago WHERE id_metodo_pago = ?',
      [req.params.id],
    );

    if (!result.affectedRows) {
      throw createHttpError(404, 'El metodo de pago no existe.');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function listProducts(req, res, next) {
  try {
    const filters = [];
    const values = [];
    const {
      search,
      category,
      brand,
      inStock,
      featured,
      sort = 'recent',
    } = req.query;

    if (search) {
      filters.push(
        '(p.nombre LIKE ? OR p.descripcion LIKE ? OR m.nombre LIKE ? OR c.nombre LIKE ?)',
      );
      values.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category) {
      filters.push('(c.nombre = ? OR c.id_categoria = ?)');
      values.push(String(category), Number(category) || 0);
    }

    if (brand) {
      filters.push('(m.nombre = ? OR m.id_marca = ?)');
      values.push(String(brand), Number(brand) || 0);
    }

    if (String(inStock) === 'true') {
      filters.push('p.stock > 0');
    }

    const orderBy =
      sort === 'price_asc'
        ? 'p.precio ASC'
        : sort === 'price_desc'
          ? 'p.precio DESC'
          : 'p.id_producto DESC';

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const [rows] = await pool.query(
      `SELECT
         p.id_producto,
         p.nombre,
         p.descripcion,
         p.precio,
         p.stock,
         p.imagen,
         c.id_categoria,
         c.nombre AS categoria,
         pr.id_proveedor,
         pr.nombre AS proveedor,
         m.id_marca,
         m.nombre AS marca
       FROM productos p
       INNER JOIN categorias c ON c.id_categoria = p.id_categoria
       INNER JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
       INNER JOIN marcas m ON m.id_marca = p.id_marca
       ${whereClause}
       ORDER BY ${orderBy}`,
      values,
    );

    const presentationSets = await getProductPresentationSets();
    const products = rows.map((row) => mapProductRow(row, presentationSets));

    res.json(
      String(featured) === 'true'
        ? products.filter((product) => product.isFeatured)
        : products,
    );
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT
         p.id_producto,
         p.nombre,
         p.descripcion,
         p.precio,
         p.stock,
         p.imagen,
         c.id_categoria,
         c.nombre AS categoria,
         pr.id_proveedor,
         pr.nombre AS proveedor,
         m.id_marca,
         m.nombre AS marca
       FROM productos p
       INNER JOIN categorias c ON c.id_categoria = p.id_categoria
       INNER JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
       INNER JOIN marcas m ON m.id_marca = p.id_marca
       WHERE p.id_producto = ?
       LIMIT 1`,
      [req.params.id],
    );

    if (!rows.length) {
      throw createHttpError(404, 'El producto no existe.');
    }

    const presentationSets = await getProductPresentationSets();
    res.json(mapProductRow(rows[0], presentationSets));
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      id_categoria,
      categoria,
      id_proveedor,
      proveedor,
      id_marca,
      marca,
    } = req.body;

    await connection.beginTransaction();

    const categoryId = await resolveCategoryId(connection, id_categoria ?? categoria);
    const brandId = await resolveBrandId(connection, id_marca ?? marca);
    const supplierId = await resolveSupplierId(connection, id_proveedor ?? proveedor);

    const [result] = await connection.query(
      `INSERT INTO productos
       (nombre, descripcion, precio, stock, imagen, id_categoria, id_proveedor, id_marca)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre.trim(),
        descripcion.trim(),
        Number(precio),
        Number(stock),
        imagen.trim(),
        categoryId,
        supplierId,
        brandId,
      ],
    );

    await connection.commit();

    req.params.id = String(result.insertId);
    return getProductById(req, res, next);
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

export async function updateProduct(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      id_categoria,
      categoria,
      id_proveedor,
      proveedor,
      id_marca,
      marca,
    } = req.body;

    await connection.beginTransaction();

    const categoryId = await resolveCategoryId(connection, id_categoria ?? categoria);
    const brandId = await resolveBrandId(connection, id_marca ?? marca);
    const supplierId = await resolveSupplierId(connection, id_proveedor ?? proveedor);

    const [result] = await connection.query(
      `UPDATE productos
       SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?,
           id_categoria = ?, id_proveedor = ?, id_marca = ?
       WHERE id_producto = ?`,
      [
        nombre.trim(),
        descripcion.trim(),
        Number(precio),
        Number(stock),
        imagen.trim(),
        categoryId,
        supplierId,
        brandId,
        req.params.id,
      ],
    );

    if (!result.affectedRows) {
      throw createHttpError(404, 'El producto no existe.');
    }

    await connection.commit();
    return getProductById(req, res, next);
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const [result] = await pool.query(
      'DELETE FROM productos WHERE id_producto = ?',
      [req.params.id],
    );

    if (!result.affectedRows) {
      throw createHttpError(404, 'El producto no existe.');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
