# Proyecto 3 - Plushie Paradise

Plushie Paradise es una aplicacion web full stack para administrar una tienda de peluches y merch. Esta version extiende el Proyecto 2 de Bases de Datos para cumplir Proyecto 3: seguridad real en MySQL, cinco roles de DBMS, stored procedures llamados desde backend, ORM obligatorio, login/logout, sesiones JWT y proteccion de rutas por rol.

## Tecnologias

- Frontend: React, Vite, TypeScript, Tailwind CSS, Axios, Recharts, Lucide React.
- Backend: Node.js, Express, JWT, bcrypt, mysql2, Sequelize ORM.
- Base de datos: MySQL 8, roles DBMS, stored procedures, transacciones, vistas e indices.
- Infraestructura: Docker Compose, Dockerfiles y Nginx para servir frontend.

## Arquitectura

```text
backend/src/
|-- controllers/     # HTTP handlers, ORM, SP y SQL de reportes
|-- db/              # pool mysql2 y conexion Sequelize
|-- middlewares/     # auth JWT, authorize por rol y errores
|-- models/          # modelos Sequelize
|-- routes/          # endpoints protegidos
|-- services/        # auth y helpers de dominio
`-- sql/             # init.sql y grants.sql

frontend/src/
|-- context/         # AuthContext y sesion persistente
|-- figma/           # vistas admin/cliente existentes
|-- pages/           # paginas principales
|-- routes/          # ProtectedRoute
`-- services/        # cliente API
```

## Ejecucion con Docker

```bash
docker compose up --build
```

URLs:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3000`
- Health: `http://localhost:3000/health`
- MySQL host: `localhost:13306`

Si ya existia un volumen anterior:

```bash
docker compose down -v
docker compose up --build
```

## Variables de entorno

El archivo `.env.example` contiene la configuracion reproducible. Las credenciales obligatorias del Proyecto 3 son:

```env
MYSQL_USER=proy3
MYSQL_PASSWORD=secret
DB_NAME=tienda_peluches
DB_USER=proy3
DB_PASSWORD=secret
```

Tambien se incluye `.env` local con los mismos valores para que `docker compose up` funcione directamente.

## Roles y permisos

La base crea exactamente cinco roles reales de MySQL con `CREATE ROLE`, `GRANT` y `REVOKE`:

- `rol_administrador`: control total del esquema.
- `rol_gerente`: consulta de reportes/ventas y registro de ventas.
- `rol_vendedor`: lectura de catalogo/clientes y registro de ventas.
- `rol_inventario`: CRUD de productos, categorias y proveedores.
- `rol_cliente`: lectura de catalogo y registro de compras propias.

## Permisos por rol en la base de datos

Los permisos reales se definen en `backend/src/sql/init.sql` y se reflejan tambien en `backend/src/sql/grants.sql`.

| Rol | Tablas accesibles | Operaciones permitidas | Restricciones |
| --- | --- | --- | --- |
| `rol_administrador` | `tienda_peluches.*` | `ALL PRIVILEGES` | Unico rol con control total del esquema. Asignado a `proy3` y `db_admin_demo`. |
| `rol_gerente` | `vista_resumen_ventas`, `productos`, `categorias`, `proveedores`, `marcas`, `clientes`, `usuarios`, `metodos_pago`, `ventas`, `detalle_venta` | `SELECT` en tablas de consulta/reportes; `SELECT, INSERT` en `ventas` y `detalle_venta`; `EXECUTE` sobre procedimientos del esquema | No tiene `UPDATE` ni `DELETE`; no administra roles, usuarios ni catalogos. |
| `rol_vendedor` | `productos`, `clientes`, `usuarios`, `ventas`, `detalle_venta`, `metodos_pago` | `SELECT` para consultar catalogo/clientes/metodos; `SELECT, INSERT` en `ventas` y `detalle_venta`; `EXECUTE` sobre procedimientos del esquema | No modifica inventario, usuarios, proveedores ni metodos de pago. |
| `rol_inventario` | `productos`, `categorias`, `proveedores`, `marcas` | `SELECT, INSERT, UPDATE, DELETE` en `productos`, `categorias`, `proveedores`; `SELECT` en `marcas`; `EXECUTE` sobre procedimientos del esquema | No accede a ventas, clientes, usuarios ni reportes financieros. |
| `rol_cliente` | `productos`, `categorias`, `marcas`, `metodos_pago`, `clientes`, `ventas`, `detalle_venta` | `SELECT` en catalogo/metodos; `SELECT, INSERT, UPDATE` en `clientes`; `SELECT, INSERT` en `ventas` y `detalle_venta`; `EXECUTE` sobre procedimientos del esquema | No administra inventario, reportes, usuarios ni proveedores. |

Usuarios DBMS de prueba:

- `db_admin_demo` / `secret`
- `db_gerente_demo` / `secret`
- `db_vendedor_demo` / `secret`
- `db_inventario_demo` / `secret`
- `db_cliente_demo` / `secret`

## Usuarios de aplicacion

Todos los usuarios usan login normal en la web:

| Correo | Contrasena | Rol | Que permite probar |
| --- | --- | --- | --- |
| `admin@tienda.com` | `Admin123` | `ADMIN` | Acceso completo: usuarios, reportes, ventas, clientes, inventario, proveedores, categorias y metodos de pago. |
| `gerente@tienda.com` | `Admin123` | `GERENTE` | Dashboard, reportes, consulta de clientes y registro/consulta de ventas. |
| `vendedor@tienda.com` | `Admin123` | `VENDEDOR` | Registro/consulta de ventas y consulta de clientes necesaria para vender. |
| `inventario@tienda.com` | `Admin123` | `INVENTARIO` | Gestion de productos, categorias, proveedores e imagenes de producto. |
| `cliente@tienda.com` | `Cliente123` | `CLIENTE` | Catalogo, carrito, checkout e historial propio de compras. |

## Seguridad y rutas

El backend valida JWT con `authenticate` y permisos con `authorize`. El frontend usa `ProtectedRoute`, persiste sesion en `localStorage`, restaura sesion con `/api/auth/me` y ejecuta logout con `/api/auth/logout`.

Permisos principales:

- `ADMIN`: usuarios, reportes, ventas, clientes, productos, categorias, proveedores y metodos de pago.
- `GERENTE`: dashboard, reportes, ventas y consulta de clientes.
- `VENDEDOR`: ventas y consulta de clientes.
- `INVENTARIO`: productos, categorias, proveedores e imagenes.
- `CLIENTE`: catalogo, carrito, checkout e historial propio.

Si un rol no tiene permiso, el backend responde `403` y el frontend oculta secciones no autorizadas o redirige.

## ORM

Sequelize esta configurado en `backend/src/db/sequelize.js` y los modelos viven en `backend/src/models/index.js`.

CRUD migrados al ORM:

- Categorias: listar, crear, actualizar y eliminar.
- Metodos de pago: listar, crear, actualizar y eliminar.
- Productos: crear, actualizar y eliminar.

Evidencia en codigo:

- `Category.findAll`, `Category.create`, `Category.update`, `Category.destroy` en `backend/src/controllers/catalogController.js`.
- `PaymentMethod.findAll`, `PaymentMethod.create`, `PaymentMethod.update`, `PaymentMethod.destroy` en `backend/src/controllers/catalogController.js`.
- `Product.create`, `Product.update`, `Product.destroy` en `backend/src/controllers/catalogController.js`.

Las consultas complejas de reportes conservan SQL explicito cuando conviene para JOIN, CTE, HAVING y vistas.

## Stored procedures

Los SP se crean en `backend/src/sql/init.sql` y se llaman desde backend:

- `sp_registrar_venta_completa`: registra venta completa con JSON de items, valida stock, inserta detalle y descuenta inventario.
- `sp_registrar_proveedor`: crea proveedor con parametro `OUT`.
- `sp_actualizar_stock_producto`: actualiza stock con parametro `OUT` y validacion.
- `sp_reporte_ventas_mensuales`: devuelve ventas agrupadas por mes para dashboard/reportes.
- `sp_productos_bajo_stock`: devuelve productos bajo minimo de inventario.

`sp_registrar_venta_completa` usa transaccion explicita:

```sql
START TRANSACTION;
COMMIT;
ROLLBACK;
```

Tambien define handler de excepciones con `RESIGNAL` para que el backend reciba el error.

## Endpoints importantes

Autenticacion:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Catalogo y administracion:

- `GET|POST|PUT|DELETE /api/products`
- `GET|POST|PUT|DELETE /api/categories`
- `GET|POST|PUT|DELETE /api/suppliers`
- `GET|POST|PUT|DELETE /api/customers`
- `GET|POST|PUT|DELETE /api/users`
- `GET|POST|PUT|DELETE /api/payment-methods`

Ventas y reportes:

- `GET /api/sales`
- `GET /api/sales/:id`
- `POST /api/sales`
- `GET /api/reports/dashboard`
- `GET /api/reports/overview`
- Exportaciones CSV/PDF bajo `/api/reports/*`.

## Verificacion recomendada

1. `docker compose down -v`
2. `docker compose up --build`
3. Entrar como cada usuario de prueba.
4. Validar que menus y endpoints respetan permisos.
5. Crear una venta como cliente o vendedor y confirmar descuento de stock.
6. Crear/editar productos como inventario.
7. Abrir reportes como gerente o admin.

Comandos utiles:

```bash
docker compose exec db mysql -uroot -p$MYSQL_ROOT_PASSWORD -e "SELECT FROM_USER, TO_USER FROM mysql.role_edges WHERE FROM_USER LIKE 'rol_%';"
docker compose exec db mysql -uroot -p$MYSQL_ROOT_PASSWORD -e "SELECT ROUTINE_NAME FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA='tienda_peluches' AND ROUTINE_TYPE='PROCEDURE';"
```

Para validar rollback, intenta registrar una venta con cantidad mayor al stock disponible desde `POST /api/sales`; el procedimiento debe devolver error y no insertar venta ni detalle.

## Notas de Proyecto 2 preservadas

Se mantiene el catalogo cliente, carrito, checkout, dashboard, CRUD administrativo, exportaciones CSV/PDF, vista `vista_resumen_ventas`, reportes SQL avanzados, imagenes locales y compatibilidad completa con Docker.
