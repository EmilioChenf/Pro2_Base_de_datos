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
DB_USER=proy3
DB_PASSWORD=secret
```

Tambien se incluye `.env` local con los mismos valores para que `docker compose up` funcione directamente.

## Roles y permisos

La base crea exactamente cinco roles reales de MySQL con `CREATE ROLE`, `GRANT` y `REVOKE`:

- `rol_administrador`: control total del esquema.
- `rol_gerente`: lectura, escritura y ejecucion para gestion operativa.
- `rol_vendedor`: lectura de catalogo/clientes y registro de ventas.
- `rol_inventario`: CRUD de productos, categorias y proveedores.
- `rol_cliente`: lectura de catalogo y registro de compras propias.

Usuarios DBMS de prueba:

- `db_admin_demo` / `secret`
- `db_gerente_demo` / `secret`
- `db_vendedor_demo` / `secret`
- `db_inventario_demo` / `secret`
- `db_cliente_demo` / `secret`

## Usuarios de aplicacion

Todos los usuarios usan login normal en la web:

- Admin: `admin@tienda.com` / `Admin123`
- Gerente: `gerente@tienda.com` / `Admin123`
- Vendedor: `vendedor@tienda.com` / `Admin123`
- Inventario: `inventario@tienda.com` / `Admin123`
- Cliente: `cliente@tienda.com` / `Cliente123`

## Seguridad y rutas

El backend valida JWT con `authenticate` y permisos con `authorize`. El frontend usa `ProtectedRoute`, persiste sesion en `localStorage`, restaura sesion con `/api/auth/me` y ejecuta logout con `/api/auth/logout`.

Permisos principales:

- `ADMIN`: usuarios, reportes, ventas, clientes, productos, categorias, proveedores y metodos de pago.
- `GERENTE`: reportes, ventas, clientes, productos, categorias, proveedores y metodos de pago.
- `VENDEDOR`: ventas y clientes.
- `INVENTARIO`: productos, categorias, proveedores e imagenes.
- `CLIENTE`: catalogo, carrito, checkout e historial propio.

Si un rol no tiene permiso, el backend responde `403` y el frontend oculta secciones no autorizadas o redirige.

## ORM

Sequelize esta configurado en `backend/src/db/sequelize.js` y los modelos viven en `backend/src/models/index.js`.

CRUD migrados al ORM:

- Categorias: listar, crear, actualizar y eliminar.
- Metodos de pago: listar, crear, actualizar y eliminar.
- Productos: crear, actualizar y eliminar.

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

## Notas de Proyecto 2 preservadas

Se mantiene el catalogo cliente, carrito, checkout, dashboard, CRUD administrativo, exportaciones CSV/PDF, vista `vista_resumen_ventas`, reportes SQL avanzados, imagenes locales y compatibilidad completa con Docker.
