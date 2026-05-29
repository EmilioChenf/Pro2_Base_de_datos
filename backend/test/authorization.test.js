import assert from 'node:assert/strict';

import jwt from 'jsonwebtoken';

process.env.DB_NAME ??= 'tienda_peluches';
process.env.DB_USER ??= 'proy3';
process.env.DB_PASSWORD ??= 'secret';
process.env.JWT_SECRET ??= 'test_secret';

const { default: app } = await import('../src/app.js');

let server;
let baseUrl;

function tokenFor(role) {
  return jwt.sign(
    {
      sub: 999,
      correo: `${role.toLowerCase()}@test.local`,
      rol: role,
      nombre: `Usuario ${role}`,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
}

async function request(path, { method = 'GET', role, body } = {}) {
  const headers = {};

  if (role) {
    headers.Authorization = `Bearer ${tokenFor(role)}`;
  }

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function runTest(name, callback) {
  try {
    await callback();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

await new Promise((resolve) => {
  server = app.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
    resolve();
  });
});

try {
  await runTest('rechaza endpoints de lectura protegidos cuando no hay sesion', async () => {
    const protectedReads = [
      '/api/users',
      '/api/reports/dashboard',
      '/api/suppliers',
      '/api/products',
      '/api/categories',
      '/api/brands',
      '/api/payment-methods',
      '/api/catalog/products',
      '/api/catalog/categories',
      '/api/catalog/brands',
      '/api/catalog/payment-methods',
    ];

    for (const path of protectedReads) {
      const response = await request(path);
      assert.equal(response.status, 401, `${path} debe responder 401 sin token`);
    }
  });

  await runTest('responde 403 cuando el rol autenticado no corresponde', async () => {
    const forbiddenCases = [
      { path: '/api/users', role: 'CLIENTE' },
      { path: '/api/reports/dashboard', role: 'CLIENTE' },
      { path: '/api/suppliers', role: 'CLIENTE' },
      {
        path: '/api/products',
        method: 'POST',
        role: 'CLIENTE',
        body: {},
      },
      {
        path: '/api/categories',
        method: 'POST',
        role: 'CLIENTE',
        body: {},
      },
      { path: '/api/brands', role: 'VENDEDOR' },
      {
        path: '/api/payment-methods',
        method: 'POST',
        role: 'INVENTARIO',
        body: {},
      },
    ];

    for (const testCase of forbiddenCases) {
      const response = await request(testCase.path, testCase);
      assert.equal(
        response.status,
        403,
        `${testCase.role} no debe acceder a ${testCase.method ?? 'GET'} ${testCase.path}`,
      );
    }
  });
} finally {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}
