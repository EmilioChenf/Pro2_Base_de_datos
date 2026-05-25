# Documentacion Proyecto 3

## 1. Introduccion

Este documento describe la extension del Proyecto 2 de Bases de Datos 1 hacia Proyecto 3. La aplicacion mantiene la tienda de peluches ya implementada y agrega seguridad real en MySQL, roles de base de datos, stored procedures, transacciones explicitas, uso de ORM y proteccion por rol en backend y frontend.

## 2. Descripcion del proyecto

Plushie Paradise es una aplicacion web full stack para gestionar inventario, clientes, ventas, usuarios, catalogo, carrito, checkout y reportes de una tienda. El sistema tiene un panel administrativo para roles internos y una vista de cliente para compras.

## 3. Tecnologias usadas

- Frontend: React, Vite, TypeScript, Tailwind CSS, Axios, Recharts y Lucide React.
- Backend: Node.js, Express, JWT, bcrypt, mysql2 y Sequelize.
- Base de datos: MySQL 8 con roles, permisos, stored procedures, vistas, indices y transacciones.
- Infraestructura: Docker Compose, Dockerfiles y Nginx para servir frontend.

## 4. Cambios realizados sobre Proyecto 2

- Se agregaron cinco roles reales en el DBMS con `CREATE ROLE`.
- Se definieron permisos por tabla con `GRANT` y limpieza con `REVOKE`.
- Se agregaron usuarios de prueba de aplicacion y usuarios de prueba del DBMS.
- Se integro Sequelize como ORM.
- Se migraron operaciones CRUD reales al ORM.
- Se agregaron cinco stored procedures invocados desde backend.
- Se movio el registro de ventas a un stored procedure transaccional.
- Se reforzo la proteccion de endpoints por rol.
- Se alinearon vistas y menus del frontend con los permisos del backend.
- Se actualizaron Docker, variables de entorno y README.

## 5. ORM utilizado

El ORM utilizado es Sequelize.

Archivos principales:

- `backend/package.json`: dependencia `sequelize`.
- `backend/src/db/sequelize.js`: configuracion de conexion Sequelize usando variables de entorno.
- `backend/src/models/index.js`: modelos `Role`, `Category`, `Supplier`, `Brand`, `PaymentMethod`, `Product`, `User` y `Customer`.
- `backend/src/server.js`: valida conexion con `sequelize.authenticate()`.

## 6. CRUD implementados con ORM

Los CRUD migrados al ORM estan en `backend/src/controllers/catalogController.js`.

| Entidad | Operaciones ORM | Evidencia |
| --- | --- | --- |
| Categorias | listar, crear, actualizar, eliminar | `Category.findAll`, `Category.create`, `Category.update`, `Category.destroy` |
| Metodos de pago | listar, crear, actualizar, eliminar | `PaymentMethod.findAll`, `PaymentMethod.create`, `PaymentMethod.update`, `PaymentMethod.destroy` |
| Productos | crear, actualizar, eliminar | `Product.create`, `Product.update`, `Product.destroy` |

Las consultas avanzadas de reportes se mantienen en SQL explicito cuando conviene por JOIN, CTE, HAVING y vistas.

## 7. Roles definidos en el DBMS

Los roles se crean en:

- `backend/src/sql/init.sql`
- `backend/src/sql/grants.sql`

Roles exactos:

- `rol_administrador`
- `rol_gerente`
- `rol_vendedor`
- `rol_inventario`
- `rol_cliente`

El usuario obligatorio de conexion es:

- Usuario: `proy3`
- Contrasena: `secret`

## 8. Tabla de permisos por rol

| Rol | Tablas accesibles | Operaciones permitidas | Restricciones |
| --- | --- | --- | --- |
| `rol_administrador` | `tienda_peluches.*` | `ALL PRIVILEGES` | Rol de administracion total del esquema. Asignado a `proy3` y `db_admin_demo`. |
| `rol_gerente` | `vista_resumen_ventas`, `productos`, `categorias`, `proveedores`, `marcas`, `clientes`, `usuarios`, `metodos_pago`, `ventas`, `detalle_venta` | `SELECT` en tablas de consulta/reportes; `SELECT, INSERT` en `ventas` y `detalle_venta`; `EXECUTE` en procedimientos | No tiene `UPDATE` ni `DELETE`; no administra usuarios, roles ni catalogos. |
| `rol_vendedor` | `productos`, `clientes`, `usuarios`, `ventas`, `detalle_venta`, `metodos_pago` | `SELECT` para consultar informacion de venta; `SELECT, INSERT` en `ventas` y `detalle_venta`; `EXECUTE` en procedimientos | No modifica inventario, usuarios, proveedores ni metodos de pago. |
| `rol_inventario` | `productos`, `categorias`, `proveedores`, `marcas` | `SELECT, INSERT, UPDATE, DELETE` en `productos`, `categorias`, `proveedores`; `SELECT` en `marcas`; `EXECUTE` en procedimientos | No accede a ventas, clientes, usuarios ni reportes financieros. |
| `rol_cliente` | `productos`, `categorias`, `marcas`, `metodos_pago`, `clientes`, `ventas`, `detalle_venta` | `SELECT` en catalogo/metodos; `SELECT, INSERT, UPDATE` en `clientes`; `SELECT, INSERT` en `ventas` y `detalle_venta`; `EXECUTE` en procedimientos | No administra inventario, reportes, usuarios ni proveedores. |

## 9. Usuarios de prueba

Usuarios de aplicacion:

| Correo | Contrasena | Rol | Que permite probar |
| --- | --- | --- | --- |
| `admin@tienda.com` | `Admin123` | `ADMIN` | Acceso completo al panel administrativo. |
| `gerente@tienda.com` | `Admin123` | `GERENTE` | Dashboard, reportes, ventas y consulta de clientes. |
| `vendedor@tienda.com` | `Admin123` | `VENDEDOR` | Ventas y consulta de clientes. |
| `inventario@tienda.com` | `Admin123` | `INVENTARIO` | Productos, categorias, proveedores e imagenes. |
| `cliente@tienda.com` | `Cliente123` | `CLIENTE` | Catalogo, carrito, checkout e historial propio. |

Usuarios DBMS de prueba:

| Usuario DBMS | Contrasena | Rol asignado |
| --- | --- | --- |
| `db_admin_demo` | `secret` | `rol_administrador` |
| `db_gerente_demo` | `secret` | `rol_gerente` |
| `db_vendedor_demo` | `secret` | `rol_vendedor` |
| `db_inventario_demo` | `secret` | `rol_inventario` |
| `db_cliente_demo` | `secret` | `rol_cliente` |

## 10. Stored procedures implementados

Los stored procedures se crean en `backend/src/sql/init.sql`.

| Stored procedure | Uso |
| --- | --- |
| `sp_registrar_proveedor` | Registra proveedores y devuelve `OUT p_id_proveedor`. |
| `sp_actualizar_stock_producto` | Actualiza stock y devuelve `OUT p_stock_final`. |
| `sp_reporte_ventas_mensuales` | Devuelve ventas agrupadas por mes para dashboard/reportes. |
| `sp_productos_bajo_stock` | Devuelve productos bajo un minimo de inventario. |
| `sp_registrar_venta_completa` | Registra venta completa con JSON de items, valida stock, inserta detalle y descuenta inventario. |

Invocaciones desde backend:

- `backend/src/controllers/catalogController.js`: `sp_registrar_proveedor`, `sp_actualizar_stock_producto`.
- `backend/src/controllers/reportController.js`: `sp_reporte_ventas_mensuales`, `sp_productos_bajo_stock`.
- `backend/src/controllers/saleController.js`: `sp_registrar_venta_completa`.

## 11. Transacciones y rollback

El procedimiento `sp_registrar_venta_completa` contiene:

- `START TRANSACTION`
- `COMMIT`
- `ROLLBACK`
- `DECLARE EXIT HANDLER FOR SQLEXCEPTION`
- `RESIGNAL`

Si ocurre un error, por ejemplo producto invalido o stock insuficiente, se ejecuta rollback y no se registra una venta parcial.

## 12. Seguridad backend

Archivos principales:

- `backend/src/middlewares/auth.js`: valida JWT.
- `backend/src/middlewares/authorize.js`: valida roles permitidos.
- `backend/src/routes/authRoutes.js`: define login, registro, `me` y logout.
- `backend/src/routes/userRoutes.js`: solo `ADMIN`.
- `backend/src/routes/reportRoutes.js`: `ADMIN` y `GERENTE`.
- `backend/src/routes/productRoutes.js`, `categoryRoutes.js`, `supplierRoutes.js`, `uploadRoutes.js`: `ADMIN` e `INVENTARIO`.
- `backend/src/routes/saleRoutes.js`: `ADMIN`, `GERENTE`, `VENDEDOR`, `CLIENTE`.
- `backend/src/routes/customerRoutes.js`: consulta para `ADMIN`, `GERENTE`, `VENDEDOR`; modificacion solo `ADMIN`.

## 13. Seguridad frontend

Archivos principales:

- `frontend/src/routes/ProtectedRoute.tsx`: bloquea rutas por rol.
- `frontend/src/routes/router.tsx`: separa area administrativa de area cliente.
- `frontend/src/pages/admin/AdminPage.tsx`: define permisos por seccion y redirige a una seccion permitida.
- `frontend/src/figma/admin/Sidebar.tsx`: oculta opciones no permitidas.
- `frontend/src/context/AuthContext.tsx`: persiste token/usuario en `localStorage`, restaura sesion con `/api/auth/me` y ejecuta logout.

## 14. Docker y variables de entorno

Archivos:

- `docker-compose.yml`
- `.env`
- `.env.example`
- `backend/Dockerfile`
- `frontend/Dockerfile`

Variables obligatorias principales:

```env
MYSQL_DATABASE=tienda_peluches
MYSQL_USER=proy3
MYSQL_PASSWORD=secret
DB_NAME=tienda_peluches
DB_USER=proy3
DB_PASSWORD=secret
```

El backend requiere `DB_NAME`, `DB_USER` y `DB_PASSWORD`; si faltan, `backend/src/config/env.js` detiene el arranque con error claro.

## 15. Instrucciones para ejecutar

Desde la raiz del proyecto:

```bash
docker compose down -v
docker compose up --build
```

URLs:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3000`
- Health: `http://localhost:3000/health`
- MySQL desde host: `localhost:13306`

## 16. Pruebas recomendadas

Verificar rama:

```bash
git checkout proyecto-3
git status
```

Verificar roles DBMS:

```bash
docker compose exec db mysql -uroot -p$MYSQL_ROOT_PASSWORD -e "SELECT FROM_USER, TO_USER FROM mysql.role_edges WHERE FROM_USER LIKE 'rol_%' ORDER BY FROM_USER, TO_USER;"
```

Verificar stored procedures:

```bash
docker compose exec db mysql -uroot -p$MYSQL_ROOT_PASSWORD -e "SELECT ROUTINE_NAME FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA='tienda_peluches' AND ROUTINE_TYPE='PROCEDURE' ORDER BY ROUTINE_NAME;"
```

Probar login de aplicacion:

- `admin@tienda.com` / `Admin123`
- `gerente@tienda.com` / `Admin123`
- `vendedor@tienda.com` / `Admin123`
- `inventario@tienda.com` / `Admin123`
- `cliente@tienda.com` / `Cliente123`

Probar permisos:

- `ADMIN`: debe poder entrar a usuarios, reportes, ventas, clientes, productos, categorias, proveedores y metodos de pago.
- `GERENTE`: debe poder ver dashboard/reportes/ventas/clientes, pero no usuarios ni inventario editable.
- `VENDEDOR`: debe poder usar ventas/clientes, pero no reportes ni productos.
- `INVENTARIO`: debe poder usar productos/categorias/proveedores, pero no ventas ni reportes.
- `CLIENTE`: debe entrar a catalogo, carrito, checkout e historial propio.

Probar rollback:

1. Iniciar sesion como cliente o vendedor.
2. Enviar `POST /api/sales` con una cantidad mayor al stock disponible.
3. Verificar que la respuesta sea error y que no exista venta parcial en `ventas` ni `detalle_venta`.

## 17. Conclusion

El Proyecto 3 mantiene la funcionalidad base del Proyecto 2 y agrega los requisitos obligatorios: ORM real, roles de DBMS, permisos granulares, usuarios de prueba, autenticacion con sesion, proteccion backend/frontend, stored procedures invocados desde backend, transacciones con rollback y despliegue completo con Docker Compose.
