# Plushie Paradise - Sistema Web de Gestion de Inventario y Ventas

Plushie Paradise es una aplicacion web full stack para administrar una tienda de peluches, productos de Escandalosos, Snoopy y merch variada. El sistema integra un panel administrativo, una vista cliente tipo ecommerce, autenticacion por roles, carrito, checkout, reportes SQL y exportacion de informacion en CSV y PDF.

El proyecto fue preparado como entrega final del Proyecto 2 de Bases de Datos UVG, priorizando SQL explicito, Docker, integridad referencial, transacciones reales y consultas avanzadas visibles desde la aplicacion web.

## Caracteristicas principales

- Login, logout y registro de clientes.
- Roles `ADMIN` y `CLIENTE` con rutas protegidas.
- Panel admin con dashboard y CRUD de productos, categorias, proveedores, clientes, usuarios y metodos de pago.
- Catalogo cliente con busqueda, filtros, detalle de producto, carrito y checkout.
- Checkout con transaccion SQL: valida stock, registra venta, registra detalle y descuenta inventario.
- Reportes administrativos con JOIN, subqueries, GROUP BY, HAVING, CTE y VIEW.
- Exportacion CSV y PDF por reporte.
- Base de datos MySQL inicializada con DDL, datos semilla, indices y vista SQL.
- Despliegue completo con Docker Compose.

## Tecnologias utilizadas

Frontend:

- React
- Vite
- TypeScript
- Tailwind CSS / CSS global
- Axios
- Recharts
- Lucide React

Backend:

- Node.js
- Express
- mysql2
- JWT
- bcrypt

Base de datos:

- MySQL 8
- SQL explicito, sin ORM

Infraestructura:

- Docker
- Docker Compose
- Nginx para servir el frontend

## Estructura del proyecto

```text
Pro2_Base_de_datos/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- db/
|   |   |-- middlewares/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- sql/
|   |       `-- init.sql
|   |-- Dockerfile
|   `-- .env.example
|-- frontend/
|   |-- public/
|   |   `-- images/productos/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- figma/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- styles/
|   |   `-- utils/
|   |-- Dockerfile
|   `-- .env.example
|-- docker-compose.yml
|-- .env.example
`-- README.md
```

## Requisitos previos

- Docker Desktop instalado y abierto.
- Docker Compose disponible desde terminal.
- Puertos libres:
  - `8080` para frontend
  - `3000` para backend
  - `13306` para MySQL desde el host

## Variables de entorno

Archivo raiz `.env.example`:

```env
MYSQL_DATABASE=tienda_peluches
MYSQL_USER=proy2
MYSQL_PASSWORD=secret
DB_USER=proy2
DB_PASSWORD=secret
MYSQL_ROOT_PASSWORD=rootsecret
MYSQL_PORT=13306

BACKEND_PORT=3000
FRONTEND_PORT=8080

JWT_SECRET=secret_jwt_dev
JWT_EXPIRES_IN=7d
DB_CONNECTION_LIMIT=10

CORS_ORIGIN=http://localhost:8080
FRONTEND_URL=http://localhost:8080
VITE_API_URL=/api

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Credenciales obligatorias para la evaluacion:

```env
DB_USER=proy2
DB_PASSWORD=secret
```

## Ejecucion desde cero

```bash
git clone <url-del-repositorio>
cd Pro2_Base_de_datos
docker compose up --build
```

URLs:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3000`
- Health backend: `http://localhost:3000/health`
- MySQL desde host: `localhost:13306`

Si ya existe un volumen viejo y se necesita recargar el seed:

```bash
docker compose down -v
docker compose up --build
```

Para levantar en segundo plano:

```bash
docker compose up --build -d
```

Para ver logs:

```bash
docker compose logs -f
```

## Usuarios de prueba

Administrador:

- Correo: `admin@tienda.com`
- Contrasena: `Admin123`

Cliente:

- Correo: `cliente@tienda.com`
- Contrasena: `Cliente123`

## Funcionalidades por rol

Admin:

- Dashboard con metricas reales.
- CRUD de productos.
- CRUD de categorias.
- CRUD de proveedores.
- CRUD de clientes.
- CRUD de usuarios.
- CRUD de metodos de pago.
- Gestion y consulta de ventas.
- Reportes avanzados.
- Exportacion CSV y PDF.

Cliente:

- Registro y login.
- Catalogo de productos.
- Filtros por categoria, marca, precio y stock.
- Detalle de producto.
- Carrito de compras.
- Checkout con metodo de pago.
- Confirmacion de compra.
- Historial visual de pedidos.

## Base de datos

El DDL principal esta en:

```text
backend/src/sql/init.sql
```

Entidades principales:

- `roles`
- `usuarios`
- `clientes`
- `categorias`
- `marcas`
- `proveedores`
- `metodos_pago`
- `productos`
- `ventas`
- `detalle_venta`

El modelo usa llaves primarias, llaves foraneas, restricciones `NOT NULL`, `UNIQUE`, tipos adecuados e integridad referencial con InnoDB.

Indices creados:

- `idx_usuarios_correo`: acelera login y busqueda por correo.
- `idx_productos_nombre`: acelera busqueda de productos.
- `idx_ventas_fecha`: acelera reportes por fecha.
- `idx_detalle_venta_producto`: acelera reportes por producto vendido.

Vista SQL:

- `vista_resumen_ventas`: resume ventas con cliente, usuario, metodo de pago y total. Se usa en reportes y exportaciones.

## Datos semilla

El seed incluye usuarios, clientes, categorias, marcas, proveedores, metodos de pago, ventas, detalle de ventas y 20 productos variados.

Productos principales:

- Peluche Panda Escandalosos
- Peluche Polar Escandalosos
- Peluche Pardo Escandalosos
- Llavero Escandalosos
- Taza Escandalosos
- Playera Escandalosos
- Sudadera Escandalosos
- Mochila Escandalosos
- Sticker Pack Escandalosos
- Termo Escandalosos
- Peluche Snoopy Clasico
- Llavero Snoopy
- Taza Snoopy
- Playera Snoopy
- Sudadera Snoopy
- Gorra Snoopy
- Mochila Snoopy
- Libreta Snoopy
- Mousepad Snoopy
- Figura Snoopy

Imagenes locales:

```text
frontend/public/images/productos/
```

Las rutas guardadas en base de datos son relativas, por ejemplo:

```text
/images/productos/peluche-panda-escandalosos.jpg
/images/productos/llavero-snoopy.jpg
/images/productos/placeholder-producto.png
```

Si una imagen no carga, el frontend usa:

```text
/images/productos/placeholder-producto.png
```

## SQL implementado para la rubrica

Las consultas no estan solo en scripts: se ejecutan desde backend y se muestran en la aplicacion, especialmente en Admin > Reportes, Dashboard, Ventas y CRUD de productos.

JOIN:

- `GET /api/sales`: ventas con clientes, usuarios y metodos de pago.
- `GET /api/reports/overview`: ventas recientes desde `vista_resumen_ventas`.
- `GET /api/reports/overview`: detalle de venta con productos, categorias y marcas.
- `GET /api/products`: productos con categoria, proveedor y marca.

SUBQUERY:

- `GET /api/reports/dashboard`: totales con subconsultas para productos, stock, ventas del dia, ingresos del mes y clientes.
- `GET /api/reports/overview`: productos con stock menor al promedio.
- `GET /api/reports/overview`: clientes con gasto mayor al promedio de ventas.

GROUP BY / HAVING:

- Ventas por mes.
- Ventas por metodo de pago.
- Productos mas vendidos.
- Clientes con mas compras.
- Productos con mas de 2 unidades vendidas usando `HAVING`.

CTE:

- `WITH ranking_productos AS (...)` en `reportController.js` para ranking de productos mas vendidos.

VIEW:

- `CREATE VIEW vista_resumen_ventas` en `backend/src/sql/init.sql`.
- Uso real en `GET /api/reports/overview` y exportacion de ventas recientes.

TRANSACCION:

- `backend/src/controllers/saleController.js`, funcion `createSale`.
- Ejecuta `BEGIN`.
- Bloquea productos con `FOR UPDATE`.
- Valida stock.
- Inserta en `ventas`.
- Inserta en `detalle_venta`.
- Actualiza inventario.
- Ejecuta `COMMIT` si todo sale bien.
- Ejecuta `ROLLBACK` si ocurre un error.

## Endpoints principales

Autenticacion:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

Catalogo y CRUD:

- `GET|POST|PUT|DELETE /api/products`
- `GET|POST|PUT|DELETE /api/categories`
- `GET|POST|PUT|DELETE /api/suppliers`
- `GET|POST|PUT|DELETE /api/customers`
- `GET|POST|PUT|DELETE /api/users`
- `GET|POST|PUT|DELETE /api/payment-methods`

Ventas:

- `GET /api/sales`
- `GET /api/sales/:id`
- `POST /api/sales`

Reportes:

- `GET /api/reports/dashboard`
- `GET /api/reports/overview`

## Exportacion CSV y PDF

Cada boton de Admin > Reportes descarga un archivo especifico:

- `GET /api/reports/recent-sales/csv` -> `ventas-recientes.csv`
- `GET /api/reports/recent-sales/pdf` -> `ventas-recientes.pdf`
- `GET /api/reports/top-products/csv` -> `productos-mas-vendidos.csv`
- `GET /api/reports/top-products/pdf` -> `productos-mas-vendidos.pdf`
- `GET /api/reports/low-stock/csv` -> `productos-bajo-stock.csv`
- `GET /api/reports/low-stock/pdf` -> `productos-bajo-stock.pdf`
- `GET /api/reports/sales-by-payment/csv` -> `ventas-por-metodo-pago.csv`
- `GET /api/reports/sales-by-payment/pdf` -> `ventas-por-metodo-pago.pdf`
- `GET /api/reports/sales-by-date/csv` -> `ventas-por-fecha.csv`
- `GET /api/reports/sales-by-date/pdf` -> `ventas-por-fecha.pdf`
- `GET /api/reports/top-customers/csv` -> `clientes-mas-compras.csv`
- `GET /api/reports/top-customers/pdf` -> `clientes-mas-compras.pdf`

Los endpoints requieren token de administrador.

## Paleta visual cliente/login

La paleta oficial esta centralizada en:

```text
frontend/src/styles/theme.css
```

Variables principales:

```css
--color-primary: #08FCB8;
--color-secondary: #ADEBB3;
--color-soft: #A5FFF2;
--primary: #08FCB8;
--secondary: #ADEBB3;
--soft: #A5FFF2;
```

El archivo se importa desde:

```text
frontend/src/styles/index.css
frontend/src/main.tsx
```

Docker copia `src`, `public`, `index.html`, `vite.config.ts` y archivos requeridos del frontend, por lo que los estilos persisten al reconstruir el contenedor.

## Como probar rapido antes de entregar

1. Reconstruir desde cero:

```bash
docker compose down -v
docker compose up --build
```

2. Abrir el frontend:

```text
http://localhost:8080
```

3. Ingresar como admin:

```text
admin@tienda.com / Admin123
```

4. Validar:

- Dashboard carga metricas.
- CRUD productos permite crear, editar y eliminar.
- CRUD categorias permite crear, editar y eliminar.
- Reportes muestran graficas y tablas.
- Cada boton CSV descarga un archivo distinto.
- Cada boton PDF descarga un archivo distinto y abre correctamente.

5. Ingresar como cliente:

```text
cliente@tienda.com / Cliente123
```

6. Validar:

- Catalogo muestra imagenes locales.
- Filtros funcionan.
- Detalle de producto muestra imagen y stock.
- Carrito suma subtotales.
- Checkout crea venta y descuenta stock.

## Solucion de problemas

Docker no inicia o la base queda con datos viejos:

```bash
docker compose down -v
docker compose up --build
```

Puerto ocupado:

- Cambiar `FRONTEND_PORT`, `BACKEND_PORT` o `MYSQL_PORT` en `.env`.

Error de conexion a MySQL:

- Verificar que Docker Desktop este abierto.
- Verificar que el servicio `db` aparezca healthy.
- Revisar credenciales `proy2` / `secret`.

Error al descargar reportes:

- Iniciar sesion como `ADMIN`.
- Verificar que el backend este activo en `http://localhost:3000/health`.
- Reconstruir contenedores si los endpoints fueron agregados recientemente.

Imagen de producto no aparece:

- Colocar la imagen real en `frontend/public/images/productos/` con el mismo nombre guardado en base de datos.
- Si falta la imagen, se muestra `placeholder-producto.png`.

## Notas academicas

Este proyecto cumple los puntos tecnicos principales del Proyecto 2:

- Docker obligatorio con `docker-compose.yml`.
- Credenciales requeridas `DB_USER=proy2` y `DB_PASSWORD=secret`.
- Backend con SQL explicito y sin ORM.
- Modelo relacional con PK, FK, restricciones e indices.
- Datos semilla consistentes para probar la aplicacion.
- CRUD real de multiples entidades.
- Consultas SQL avanzadas visibles en la aplicacion: JOIN, subquery, GROUP BY, HAVING, CTE y VIEW.
- Transaccion real integrada al flujo de ventas.
- Autenticacion, logout, roles y rutas protegidas.
- Exportacion CSV y PDF por reporte.
- README con instrucciones reproducibles desde cero.
