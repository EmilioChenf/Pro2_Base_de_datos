# PlushStore

Aplicacion web full stack con frontend React unificado desde las vistas de Figma (`login`, `vista_admin`, `vista_cliente`), backend Node.js/Express, autenticacion con JWT y Google OAuth, MySQL con SQL explicito y despliegue completo con Docker Compose.

## Requisitos

- Docker Desktop o Docker Engine con Docker Compose
- Opcional para ejecucion local sin Docker: Node.js 20+ y MySQL 8

## Variables de entorno

Archivo raiz opcional: `.env`

Usa como base [`.env.example`](./.env.example).

Variables principales:

- `MYSQL_DATABASE=plushstore_db`
- `MYSQL_USER=proy2`
- `MYSQL_PASSWORD=secret`
- `MYSQL_ROOT_PASSWORD=rootsecret`
- `MYSQL_PORT=13306`
- `FRONTEND_PORT=8080`
- `BACKEND_PORT=4000`
- `JWT_SECRET=change-this-super-secret-key`
- `GOOGLE_CLIENT_ID=`
- `GOOGLE_CLIENT_SECRET=`

Archivos de referencia adicionales:

- [frontend/.env.example](./frontend/.env.example)
- [backend/.env.example](./backend/.env.example)

## Como levantar con Docker

1. Opcionalmente copia `.env.example` a `.env` y ajusta valores.
2. Ejecuta:

```bash
docker compose up --build
```

Servicios disponibles:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:4000`
- Health backend: `http://localhost:4000/health`
- MySQL: `localhost:13306`

La base de datos se inicializa automaticamente con el script [backend/src/sql/init.sql](./backend/src/sql/init.sql).

## Credenciales de prueba

Administrador inicial:

- Correo: `admin@plushstore.com`
- Password: `Admin123!`

Clientes semilla:

- `maria@cliente.com` / `Cliente123!`
- `carlos@cliente.com` / `Cliente123!`
- `ana@cliente.com` / `Cliente123!`

## Google OAuth

Para habilitar login/registro con Google configura:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `frontend/.env` o `.env` con el mismo `GOOGLE_CLIENT_ID`

El frontend usa `VITE_GOOGLE_CLIENT_ID` en build y el backend valida el `access_token` contra Google UserInfo. Si un usuario de Google no existe, se crea automaticamente con rol `CLIENTE` y su registro relacionado en `CLIENTES`.

## Estructura del proyecto

```text
/
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- figma/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- styles/
|   |   `-- types/
|   |-- Dockerfile
|   `-- nginx.conf
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- db/
|   |   |-- middlewares/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- sql/
|   `-- Dockerfile
|-- docker-compose.yml
`-- .env.example
```

## Funcionalidad incluida

- Login y registro con correo/password
- Login y registro con Google
- Hash de contrasenas con bcrypt
- Sesion con JWT
- Redireccion automatica por rol
- Rutas protegidas para `ADMIN` y `CLIENTE`
- Logout funcional
- CRUD de productos
- CRUD de categorias
- CRUD de proveedores
- CRUD de clientes
- CRUD de usuarios
- CRUD de metodos de pago
- Ventas con transaccion SQL explicita
- Reportes basicos para admin
- Catalogo, busqueda, filtros, carrito, checkout e historial para cliente

## Endpoints principales

- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/google`
- `/api/auth/me`
- `/api/products`
- `/api/categories`
- `/api/suppliers`
- `/api/customers`
- `/api/users`
- `/api/sales`
- `/api/payment-methods`
- `/api/reports`

## Ejecucion local sin Docker

Backend:

```bash
cd backend
npm install
npm run start
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Necesitas un MySQL 8 corriendo y configurar [backend/.env.example](./backend/.env.example) y [frontend/.env.example](./frontend/.env.example) como `.env`.
