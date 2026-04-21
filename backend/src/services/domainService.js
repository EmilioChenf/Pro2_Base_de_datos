import { createHttpError } from '../utils/httpError.js';

export async function getRoleId(executor, roleName) {
  const [rows] = await executor.query(
    'SELECT id_rol FROM roles WHERE nombre = ? LIMIT 1',
    [roleName],
  );

  if (!rows.length) {
    throw createHttpError(500, `El rol ${roleName} no existe en la base de datos.`);
  }

  return rows[0].id_rol;
}

export async function getUserWithRoleById(executor, userId) {
  const [rows] = await executor.query(
    `SELECT u.id_usuario, u.nombre, u.correo, u.password, u.google_id, r.nombre AS rol
     FROM usuarios u
     INNER JOIN roles r ON r.id_rol = u.id_rol
     WHERE u.id_usuario = ?
     LIMIT 1`,
    [userId],
  );

  return rows[0] ?? null;
}

export async function getUserWithRoleByEmail(executor, email) {
  const [rows] = await executor.query(
    `SELECT u.id_usuario, u.nombre, u.correo, u.password, u.google_id, r.nombre AS rol
     FROM usuarios u
     INNER JOIN roles r ON r.id_rol = u.id_rol
     WHERE u.correo = ?
     LIMIT 1`,
    [email],
  );

  return rows[0] ?? null;
}

export async function upsertCustomerProfile(
  executor,
  { userId, nombre, correo, telefono },
) {
  const [rows] = await executor.query(
    'SELECT id_cliente FROM clientes WHERE id_usuario = ? LIMIT 1',
    [userId],
  );

  const phone = (telefono ?? '').trim();

  if (rows.length) {
    await executor.query(
      `UPDATE clientes
       SET nombre = ?, correo = ?, telefono = ?
       WHERE id_usuario = ?`,
      [nombre, correo, phone, userId],
    );
    return rows[0].id_cliente;
  }

  const [result] = await executor.query(
    `INSERT INTO clientes (nombre, correo, telefono, id_usuario)
     VALUES (?, ?, ?, ?)`,
    [nombre, correo, phone, userId],
  );

  return result.insertId;
}

export async function resolveCategoryId(executor, value) {
  if (!value) {
    throw createHttpError(422, 'Debes indicar una categoria.');
  }

  const normalized = String(value).trim();
  const parsed = Number(normalized);

  if (Number.isFinite(parsed) && parsed > 0) {
    const [rows] = await executor.query(
      'SELECT id_categoria FROM categorias WHERE id_categoria = ? LIMIT 1',
      [parsed],
    );

    if (!rows.length) {
      throw createHttpError(404, 'La categoria seleccionada no existe.');
    }

    return parsed;
  }

  const [rows] = await executor.query(
    'SELECT id_categoria FROM categorias WHERE nombre = ? LIMIT 1',
    [normalized],
  );

  if (rows.length) {
    return rows[0].id_categoria;
  }

  const [result] = await executor.query(
    'INSERT INTO categorias (nombre) VALUES (?)',
    [normalized],
  );

  return result.insertId;
}

export async function resolveBrandId(executor, value) {
  if (!value) {
    throw createHttpError(422, 'Debes indicar una marca.');
  }

  const normalized = String(value).trim();
  const parsed = Number(normalized);

  if (Number.isFinite(parsed) && parsed > 0) {
    const [rows] = await executor.query(
      'SELECT id_marca FROM marcas WHERE id_marca = ? LIMIT 1',
      [parsed],
    );

    if (!rows.length) {
      throw createHttpError(404, 'La marca seleccionada no existe.');
    }

    return parsed;
  }

  const [rows] = await executor.query(
    'SELECT id_marca FROM marcas WHERE nombre = ? LIMIT 1',
    [normalized],
  );

  if (rows.length) {
    return rows[0].id_marca;
  }

  const [result] = await executor.query(
    'INSERT INTO marcas (nombre) VALUES (?)',
    [normalized],
  );

  return result.insertId;
}

export async function resolveSupplierId(executor, value) {
  if (!value) {
    throw createHttpError(422, 'Debes indicar un proveedor.');
  }

  const normalized = String(value).trim();
  const parsed = Number(normalized);

  if (Number.isFinite(parsed) && parsed > 0) {
    const [rows] = await executor.query(
      'SELECT id_proveedor FROM proveedores WHERE id_proveedor = ? LIMIT 1',
      [parsed],
    );

    if (!rows.length) {
      throw createHttpError(404, 'El proveedor seleccionado no existe.');
    }

    return parsed;
  }

  const [rows] = await executor.query(
    'SELECT id_proveedor FROM proveedores WHERE nombre = ? LIMIT 1',
    [normalized],
  );

  if (!rows.length) {
    throw createHttpError(
      404,
      'El proveedor indicado no existe. Crea el proveedor antes de asignarlo al producto.',
    );
  }

  return rows[0].id_proveedor;
}

export async function resolvePaymentMethodId(executor, value) {
  if (!value) {
    throw createHttpError(422, 'Debes indicar un metodo de pago.');
  }

  const normalized = String(value).trim();
  const parsed = Number(normalized);

  if (Number.isFinite(parsed) && parsed > 0) {
    const [rows] = await executor.query(
      'SELECT id_metodo_pago FROM metodos_pago WHERE id_metodo_pago = ? LIMIT 1',
      [parsed],
    );

    if (!rows.length) {
      throw createHttpError(404, 'El metodo de pago seleccionado no existe.');
    }

    return parsed;
  }

  const [rows] = await executor.query(
    'SELECT id_metodo_pago FROM metodos_pago WHERE nombre = ? LIMIT 1',
    [normalized],
  );

  if (!rows.length) {
    throw createHttpError(404, 'El metodo de pago indicado no existe.');
  }

  return rows[0].id_metodo_pago;
}

export function getPaymentPresentation(name) {
  const dictionary = {
    Efectivo: {
      descripcion: 'Pago directo en caja o contra entrega.',
      icon: 'cash',
      active: true,
    },
    Tarjeta: {
      descripcion: 'Pago con tarjeta de debito o credito.',
      icon: 'card',
      active: true,
    },
    Transferencia: {
      descripcion: 'Transferencia bancaria o pago por SPEI.',
      icon: 'transfer',
      active: true,
    },
  };

  return (
    dictionary[name] ?? {
      descripcion: 'Metodo de pago configurado en el sistema.',
      icon: 'cash',
      active: true,
    }
  );
}

export function getCategoryDescription(name) {
  return `Categoria disponible para productos de ${name.toLowerCase()}.`;
}
