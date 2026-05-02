# PlushStore - Proyecto 2 Base de Datos

Tienda web de peluches y merch con frontend React, backend Node.js/Express y MySQL. El proyecto conserva las vistas integradas desde Figma para login, administrador y cliente, agregando logica real, autenticacion, roles, CRUDs, carrito, checkout, reportes SQL y Docker.

## Tecnologias

- React + Vite + TypeScript
- Node.js + Express
- MySQL 8
- SQL explicito con `mysql2`, sin ORM
- JWT + bcrypt
- Docker Compose + Nginx

## Estructura

```text
/
|-- frontend/
|   |-- src/components
|   |-- src/context
|   |-- src/figma
|   |-- src/layouts
|   |-- src/pages
|   |-- src/routes
|   |-- src/services
|   |-- Dockerfile
|   `-- .env.example
|-- backend/
|   |-- src/config
|   |-- src/controllers
|   |-- src/db
|   |-- src/middlewares
|   |-- src/routes
|   |-- src/services
|   |-- src/sql/init.sql
|   |-- Dockerfile
|   `-- .env.example
|-- docker-compose.yml
|-- .env.example
`-- README.md
```

## Variables de entorno

Raiz:

```env
MYSQL_DATABASE=tienda_peluches
MYSQL_USER=proy2
MYSQL_PASSWORD=secret
MYSQL_ROOT_PASSWORD=rootsecret
BACKEND_PORT=3000
FRONTEND_PORT=8080
JWT_SECRET=secret_jwt_dev
VITE_API_URL=/api
```

Backend:

```env
DB_HOST=db
DB_PORT=3306
DB_NAME=tienda_peluches
DB_USER=proy2
DB_PASSWORD=secret
JWT_SECRET=secret_jwt_dev
PORT=3000
```

Frontend local:

```env
VITE_API_URL=http://localhost:3000/api
```

## Ejecutar con Docker

```bash
docker compose up --build
```

Servicios:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3000`
- Health: `http://localhost:3000/health`
- MySQL: `localhost:13306`

Si ya levantaste una version anterior con otro nombre de base, reinicia el volumen:

```bash
docker compose down -v
docker compose up --build
```

## Credenciales de prueba

- Administrador: `admin@tienda.com` / `Admin123`
- Cliente: `cliente@tienda.com` / `Cliente123`

## Funcionalidades

- Login, logout y registro de cliente.
- Passwords hasheadas con bcrypt.
- Sesion con JWT en `Authorization: Bearer`.
- Middleware de autenticacion y autorizacion por rol.
- Redireccion por rol: admin a `/admin`, cliente a `/cliente`.
- CRUD admin de productos, categorias, proveedores, clientes, usuarios y metodos de pago.
- Dashboard con datos reales.
- Catalogo cliente desde MySQL con busqueda, filtros por categoria, marca, precio y stock.
- Carrito con cantidades, subtotales y total.
- Checkout con metodo de pago, registro de venta y detalle, actualizacion de stock y error por stock insuficiente.
- Ventas admin con registro manual y detalle.
- Reportes visibles con datos reales y exportacion CSV.

## Endpoints principales

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET|POST|PUT|DELETE /api/products`
- `GET|POST|PUT|DELETE /api/categories`
- `GET|POST|PUT|DELETE /api/suppliers`
- `GET|POST|PUT|DELETE /api/customers`
- `GET|POST|PUT|DELETE /api/payment-methods`
- `GET /api/sales`
- `GET /api/sales/:id`
- `POST /api/sales`
- `GET /api/reports/dashboard`
- `GET /api/reports/overview`
- `GET /api/reports/recent-sales.csv`

## SQL de la rubrica

Todo esta en consultas ejecutadas por el backend y visible en admin:

- JOIN ventas + cliente + usuario + metodo de pago: `GET /api/sales`, `GET /api/reports/overview`.
- JOIN detalle + productos + categorias + marcas: seccion "JOINs Visibles" en Reportes.
- JOIN productos + categoria + proveedor + marca: catalogo, CRUD productos y Reportes.
- Subquery stock bajo promedio: Reportes, "Stock bajo el promedio".
- Subquery clientes con compras mayores al promedio: Reportes, "Clientes sobre compra promedio".
- GROUP BY y agregaciones: ventas por producto, ventas por metodo de pago, ingresos por fecha/mes.
- HAVING: productos con mas de 2 unidades vendidas.
- CTE `WITH`: ranking de productos mas vendidos en `reportController.js`.
- VIEW: `vista_resumen_ventas` creada en `backend/src/sql/init.sql` y usada por reportes/CSV.

## Transaccion

La transaccion obligatoria esta en `backend/src/controllers/saleController.js`, funcion `createSale`:

- `BEGIN`
- valida productos con `FOR UPDATE`
- inserta `ventas`
- inserta `detalle_venta`
- actualiza stock
- `ROLLBACK` si falla
- `COMMIT` si todo termina bien

Esta transaccion se usa desde checkout cliente y desde "Nueva Venta" del admin.

## Exportacion CSV

En admin abre `Reportes` y usa el boton `Exportar CSV`. Descarga `ventas-recientes.csv` con datos reales desde la VIEW `vista_resumen_ventas`.
